import { Request } from "express";
import { TotoDelegate, UserContext, ExecutionContext, ValidationError } from "toto-api-controller";
import { GoogleFirstLLMStrategy } from "../llm/strategies/GoogleFirstStrategy.js";

export class PostPrompt implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const userPrompt = req.body.prompt;

        let outputFormat = req.body.outputFormat ?? "text";

        if (!userPrompt) throw new ValidationError(400, 'Missing user prompt');
        if (outputFormat && outputFormat != 'text' && outputFormat != 'json') throw new ValidationError(400, `Output format ${outputFormat} not accepted.`);

        const llm = new GoogleFirstLLMStrategy().getLLM(execContext)

        return await llm.invoke(
            { promptText: userPrompt },
            { outputFormat: outputFormat }
        )

        

    }
}