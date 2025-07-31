import { LLM } from "../LLMInterface.js";
import { LLMStrategyInterface, NoMoreBackupLLMsError } from "./LLMStrategyInterface.js";
import { AWSClaude } from "../AWSClaude.js";
import { Gemini } from "../Gemini.js";

export class AWSFirstStrategy implements LLMStrategyInterface {

    backupLLMs: LLM[] = [
        new AWSClaude("claude-3.7-sonnet"),
        new AWSClaude("claude-3.5-sonnet"),
        new Gemini()
    ]

    getLLM(): LLM {
        return new AWSClaude("claude-4-sonnet")
    }

    getBackupLLM(priority: number): LLM {

        if (priority >= this.backupLLMs.length) throw new NoMoreBackupLLMsError()

        return this.backupLLMs[priority]

    }
}
