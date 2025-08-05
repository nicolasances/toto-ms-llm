import { AWSClaude } from "../AWSClaude.js";
import { Gemini } from "../Gemini.js";
import { LLM } from "../LLMInterface.js";
import { LLMStrategyInterface, NoMoreBackupLLMsError } from "./LLMStrategyInterface.js";

export class GoogleFirstLLMStrategy implements LLMStrategyInterface {

    llms: LLM[] = [
        new Gemini(),
        new AWSClaude("claude-4-sonnet"),
        new AWSClaude("claude-3.7-sonnet"),
        new AWSClaude("claude-3.5-sonnet"),
    ]


    getPrioritizedLLMs(): LLM[] {
        return this.llms
    }
}