import * as genai from '@google/genai';
import { LLM, LLMResponse, Prompt, PromptOptions } from "./LLMInterface.js";
import { ExecutionContext, Logger } from 'toto-api-controller';

export class Gemini implements LLM {

    name = 'gemini-2.0-flash-lite'
    logger: Logger;
    cid: string;

    constructor(execContext: ExecutionContext) {
        this.logger = execContext.logger
        this.cid = String(execContext.cid)
    }

    async invoke(prompt: Prompt, options: PromptOptions): Promise<LLMResponse> {

        this.logger.compute(this.cid, `Invoking model ${this.name} with options ${JSON.stringify(options)}`);

        // Manage the option
        let finalPrompt = prompt.promptText;

        // JSON Formatting option
        if (options.outputFormat == 'json') finalPrompt += `\nFORMAT THE OUTPUT IN JSON`

        // Invoke the LLM
        const ai = new genai.GoogleGenAI({
            vertexai: true,
            project: process.env.GCP_PID,
            location: process.env.GCP_REGION,
        });

        const response = await ai.models.generateContent({
            model: this.name,
            contents: finalPrompt,
        });

        this.logger.compute(this.cid, `Model ${this.name} responded.`)


        // JSON Formatting, if needed
        let responseData = response.text;
        
        if (options.outputFormat == 'json') {
            responseData = response.text?.replace("```json", "").replace("\\n", "").replace("```", "")
            return { responseJSON: JSON.parse(String(responseData)) }
        }

        return { responseText: String(response.text) }


    }

}