import { LLM } from "../LLMInterface.js";
import { LLMStrategyInterface, NoMoreBackupLLMsError } from "./LLMStrategyInterface.js";
import { AWSClaude } from "../AWSClaude.js";
import { Gemini } from "../Gemini.js";

export class AWSFirstStrategy implements LLMStrategyInterface {

    backupLLMs: LLM[] = [
        new Gemini()
    ]

    getLLM(): LLM {
        return new AWSClaude()
    }

    getBackupLLM(priority: number): LLM {

        if (priority >= this.backupLLMs.length) throw new NoMoreBackupLLMsError()

        return this.backupLLMs[priority]

    }
}
