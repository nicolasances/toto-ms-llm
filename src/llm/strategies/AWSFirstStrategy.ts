import { LLM } from "../LLMInterface.js";
import { LLMStrategyInterface, NoMoreBackupLLMsError } from "./LLMStrategyInterface.js";
import { AWSClaude } from "../AWSClaude.js";
import { Gemini } from "../Gemini.js";

export class AWSFirstStrategy implements LLMStrategyInterface {
    
    llms: LLM[] = [
        new AWSClaude("claude-4-sonnet"),
        new AWSClaude("claude-3.7-sonnet"),
        new AWSClaude("claude-3.5-sonnet"),
        new Gemini()
    ]

    getPrioritizedLLMs(): LLM[] {
        return this.llms
    }

}
