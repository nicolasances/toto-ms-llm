import { Gemini } from "../Gemini.js";
import { LLM } from "../LLMInterface.js";
import { LLMStrategyInterface, NoMoreBackupLLMsError } from "./LLMStrategyInterface.js";

export class GoogleFirstLLMStrategy implements LLMStrategyInterface {

    backupLLMs: LLM[] = [
    ]

    getLLM(): LLM {
        return new Gemini()
    }

    getBackupLLM(priority: number): LLM {

        if (priority >= this.backupLLMs.length) throw new NoMoreBackupLLMsError()

        return this.backupLLMs[priority]
    }
}