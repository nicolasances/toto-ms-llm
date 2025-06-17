import { Request } from "express";
import { TotoDelegate, UserContext, ExecutionContext, ValidationError, TotoRuntimeError } from "toto-api-controller";
import { AWSFirstStrategy } from "../llm/strategies/AWSFirstStrategy.js";
import { NoMoreBackupLLMsError } from "../llm/strategies/LLMStrategyInterface.js";

export class PostPrompt implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const numRetries = 1;

        const userPrompt = req.body.prompt;
        const logger = execContext.logger;
        const cid = execContext.cid;

        let outputFormat = req.body.outputFormat ?? "text";

        if (!userPrompt) throw new ValidationError(400, 'Missing user prompt');
        if (outputFormat && outputFormat != 'text' && outputFormat != 'json') throw new ValidationError(400, `Output format ${outputFormat} not accepted.`);

        // Instantiate the LLM through the chosen strategy
        const strategy = new AWSFirstStrategy();
        let llm = strategy.getLLM()

        try {

            logger.compute(cid, `LLM Invocation. LLM: ${llm.name}`)

            // Call the LLM
            return await llm.invoke(
                { promptText: userPrompt },
                { outputFormat: outputFormat },
                execContext
            )

        } catch (error) {

            logger.compute(cid, `LLM Invocation FAILED. LLM: ${llm.name}`)
            console.log(error);

            // When an error is caught, we will do the following: 
            // 1. Retry for a x number of times, x being defined in var "numRetries"
            // 2. If it still fails, try another LLM either on a different cloud provider or on the same provider, the reason being that it could just be throttled

            let retries = 0;
            while (retries < numRetries) {

                logger.compute(cid, `Retrying LLM Invocation. LLM: ${llm.name}`)

                // 1. Retry calling the LLM
                try {
                    return await llm.invoke({ promptText: userPrompt }, { outputFormat: outputFormat }, execContext)

                } catch (error) {
                    logger.compute(cid, `LLM Invocation FAILED. LLM: ${llm.name}`)
                    console.log(error);
                }

                retries++;
            }

            // 2. If we get here LLM invocations have still failed. 
            // Let's switch LLM
            let llmPriority = 0;

            while (true) {

                try {

                    logger.compute(cid, `Trying a backup LLM with priority ${llmPriority}.`)

                    llm = strategy.getBackupLLM(llmPriority++);

                    logger.compute(cid, `Chosen LLM ${llm.name}. Trying invocation.`)

                    return await llm.invoke({ promptText: userPrompt }, { outputFormat: outputFormat }, execContext)

                } catch (error) {
                    if (error instanceof NoMoreBackupLLMsError) {
                        logger.compute(cid, `No more LLMs to try. Last failed LLM: ${llm.name}`)
                        throw new TotoRuntimeError(500, `All LLMs have failed. Sorry.`);
                    } else {
                        logger.compute(cid, `LLM Invocation FAILED. LLM: ${llm.name}`)
                        console.log(error);
                    }
                }
            }
        }



    }
}