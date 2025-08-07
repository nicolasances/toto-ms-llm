import { Request } from "express";
import { TotoDelegate, UserContext, ExecutionContext, ValidationError, TotoRuntimeError } from "toto-api-controller";
import { AWSFirstStrategy } from "../llm/strategies/AWSFirstStrategy.js";
import { LLMInvocation } from "../llm/process/LLMInvocation.js";
import { CustomStrategy } from "../llm/strategies/CustomStrategy.js";

export class PostPrompt implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const userPrompt = req.body.prompt;

        let outputFormat = req.body.outputFormat ?? "text";

        if (!userPrompt) throw new ValidationError(400, 'Missing user prompt');
        if (outputFormat && outputFormat != 'text' && outputFormat != 'json') throw new ValidationError(400, `Output format ${outputFormat} not accepted.`);

        // Validate custom strategy if provided
        if (req.body.strategy && (!req.body.strategy.llms || !Array.isArray(req.body.strategy.llms) || req.body.strategy.llms.length === 0)) {
            throw new ValidationError(400, 'Invalid strategy provided. Expected an array of LLMs.');
        }

        // Instantiate the LLM through the chosen strategy
        let strategy = new AWSFirstStrategy();

        // If there's a custom strategy provided in the request, use it
        if (req.body.strategy) strategy = new CustomStrategy(req.body.strategy.llms);

        return await new LLMInvocation(execContext, strategy).invoke({ prompt: userPrompt, outputFormat: outputFormat ?? "text" });

    }
}