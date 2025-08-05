import { Request } from "express";
import { TotoDelegate, UserContext, ExecutionContext, ValidationError, TotoRuntimeError } from "toto-api-controller";
import { AWSFirstStrategy } from "../llm/strategies/AWSFirstStrategy.js";
import { NoMoreBackupLLMsError } from "../llm/strategies/LLMStrategyInterface.js";
import { LLMInvocation } from "../llm/process/LLMInvocation.js";

export class PostPrompt implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const userPrompt = req.body.prompt;

        let outputFormat = req.body.outputFormat ?? "text";

        if (!userPrompt) throw new ValidationError(400, 'Missing user prompt');
        if (outputFormat && outputFormat != 'text' && outputFormat != 'json') throw new ValidationError(400, `Output format ${outputFormat} not accepted.`);

        // Instantiate the LLM through the chosen strategy
        const strategy = new AWSFirstStrategy();

        return await new LLMInvocation(execContext, strategy).invoke({ prompt: userPrompt, outputFormat: outputFormat ?? "text" });

    }
}