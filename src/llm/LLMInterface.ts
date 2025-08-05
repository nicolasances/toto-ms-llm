import { ExecutionContext } from "toto-api-controller";

export interface LLM {

    name: string; // The name of the LLM. E.g. 'gemini-2.0-flash-lite'
    provider: string; // The provider of the LLM, e.g. 'aws', 'gcp', etc.

    /**
     * Invokes an LLM with the provided prompt 
     * 
     * @param prompt the prompt to send to the LLM
     * @param options options to invoke the model
     * @param execContext the execution context
     */
    invoke(prompt: Prompt, options: PromptOptions, execContext: ExecutionContext): Promise<LLMResponse>

}

export const SUPPORTED_LLMS = [
    {name: "claude-3.5-sonnet", provider: "aws"},
    {name: "claude-3.7-sonnet", provider: "aws"},
    {name: "claude-4-sonnet", provider: "aws"},
    {name: "gemini-2.0-flash-lite", provider: "gcp"},
]

export interface Prompt {

    promptText: string

}

export interface PromptOptions {

    outputFormat: "text" | "json", 
}

export interface LLMResponse {
    
    // Format of the response's "value" field
    format: "json" | "text"

    // Response from the LLM, with the format indicated by the "format" field
    value: any, 

    llmName: string // The name of the LLM that generated this response
    llmProvider: string // The provider of the LLM that generated this response, e.g. "aws", "gcp", etc.
    
}