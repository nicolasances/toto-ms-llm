
export interface LLM {

    name: string; // The name of the LLM. E.g. 'gemini-2.0-flash-lite'

    /**
     * Invokes an LLM with the provided prompt 
     * 
     * @param prompt the prompt to send to the LLM
     */
    invoke(prompt: Prompt, options: PromptOptions): Promise<LLMResponse>

}

export interface Prompt {

    promptText: string

}

export interface PromptOptions {

    outputFormat: "text" | "json"
}

export interface LLMResponse {
    
    responseText?: string
    responseJSON?: string
    
}