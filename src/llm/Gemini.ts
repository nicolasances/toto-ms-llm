import * as genai from '@google/genai';
import { LLM, LLMProvider, LLMResponse, Prompt, PromptOptions } from "./LLMInterface.js";
import { ExecutionContext, Logger } from 'toto-api-controller';

export class Gemini implements LLM {

    name = 'gemini-2.0-flash-lite'
    provider: LLMProvider = 'gcp';

    constructor() {
    }

    async invoke(prompt: Prompt, options: PromptOptions, execContext: ExecutionContext): Promise<LLMResponse> {

        const logger = execContext.logger;
        const cid = execContext.cid;

        logger.compute(cid, `Invoking model ${this.name} with options ${JSON.stringify(options)}`);

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

        logger.compute(cid, `Model ${this.name} responded.`)


        // JSON Formatting, if needed
        let responseData = response.text;
        
        if (options.outputFormat == 'json') {
            responseData = response.text?.replace("```json", "").replace("\\n", "").replace("```", "")
            return { format: "json", value: JSON.parse(String(responseData)), llmName: this.name, llmProvider: this.provider };
        }

        return { format: "text", value: String(response.text), llmName: this.name, llmProvider: this.provider };


    }

}