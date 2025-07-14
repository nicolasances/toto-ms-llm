import { ExecutionContext } from "toto-api-controller";

export interface LLM {

    name: string; // The name of the LLM. E.g. 'gemini-2.0-flash-lite'
    provider: LLMProvider;

    /**
     * Invokes an LLM with the provided prompt 
     * 
     * @param prompt the prompt to send to the LLM
     * @param options options to invoke the model
     * @param execContext the execution context
     */
    invoke(prompt: Prompt, options: PromptOptions, execContext: ExecutionContext): Promise<LLMResponse>

}

export interface Prompt {

    promptText: string

}

export interface PromptOptions {

    outputFormat: "text" | "json"
}

export interface LLMResponse {
    
    // Format of the response's "value" field
    format: "json" | "text"

    // Response from the LLM, with the format indicated by the "format" field
    value: any, 

    // LLM name 
    llmName: string

    // LLM provider
    llmProvider: LLMProvider
    
}

export type LLMProvider = "aws" | "gcp";