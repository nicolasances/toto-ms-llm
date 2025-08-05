import { ExecutionContext } from "toto-api-controller";
import { LLMStrategyInterface, NoMoreBackupLLMsError } from "../strategies/LLMStrategyInterface.js";
import { LLMHealth } from "../health/LLMHealth.js";

export class LLMInvocation {

    executionContext: ExecutionContext;
    strategy: LLMStrategyInterface;

    constructor(executionContext: ExecutionContext, strategy: LLMStrategyInterface) {
        this.executionContext = executionContext;
        this.strategy = strategy;
    }

    /**
     * Invokes an LLM with the given input (prompt). 
     * 
     * Performs the following steps:
     * 1. Gets the first LLM from the strategy 
     * 2. Invokes the LLM with the input
     * 3. If the invocation fails, reports it to the LLM Health service and try with the next LLM in the strategy
     * 4. If all LLMs fail, throws an error
     * 
     * @param input The input for the LLM invocation, which includes the prompt and output format.
     */
    async invoke(input: LLMInvocationInput): Promise<any> {

        const logger = this.executionContext.logger;
        const cid = this.executionContext.cid;

        const llms = this.strategy.getPrioritizedLLMs();

        const healthService = new LLMHealth(this.executionContext);

        for (const llm of llms) {

            try {

                logger.compute(cid, `Considering LLM ${llm.name}`)

                // 1. Check if the LLM is healthy
                const isHealthy = await healthService.isHealthy(llm);

                if (!isHealthy) continue; // Skip this LLM if it's unhealthy

                logger.compute(cid, `LLM ${llm.name} is healthy. Proceeding with invocation.`)

                // 1. Try the first LLM 
                const response = await llm.invoke({ promptText: input.prompt }, { outputFormat: input.outputFormat }, this.executionContext)

                // 2. If successful, return the response
                logger.compute(cid, `LLM Invocation SUCCESS. LLM: ${llm.name}`)

                return response;

            } catch (error) {

                logger.compute(cid, `LLM Invocation FAILED. LLM: ${llm.name} with error: ${error}`, "error");

                // 3. Report failure to the LLM Health service
                await healthService.registerLLMFailure(llm);

            }

        }

        logger.compute(cid, `All LLMs failed.`)

        throw new NoMoreBackupLLMsError(`All LLMs failed.`)

    }


}

export interface LLMInvocationInput {
    prompt: string;
    outputFormat: LLMPromptFormat;
}

export type LLMPromptFormat = "text" | "json";
