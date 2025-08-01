import { LLM } from "../LLMInterface.js";
import { LLMStrategyInterface, NoMoreBackupLLMsError } from "./LLMStrategyInterface.js";
import { AWSClaude } from "../AWSClaude.js";
import { Gemini } from "../Gemini.js";
import { FAILED_LLM_CACHE, isLLMFailed } from "../../util/LLMCache.js";

export class AWSFirstStrategy implements LLMStrategyInterface {

    backupLLMs: LLM[] = [
        new AWSClaude("claude-3.7-sonnet"),
        new AWSClaude("claude-3.5-sonnet"),
        new Gemini()
    ]

    registerFailure(llm: LLM): void {
        // Cache the failure, so that we can skip this LLM in future invocations
        FAILED_LLM_CACHE.set(llm.name, { timestamp: Date.now() });
    }

    getLLM(): LLM {
        return new AWSClaude("claude-4-sonnet")
    }

    getBackupLLM(priority: number): LLM {

        // Find the first LLM that has not failed. Ignore priority (deprecated)
        for (const llm of this.backupLLMs) {
            if (!isLLMFailed(llm)) {
                return llm;
            }
        }

        // If we get here, it means that all backup LLMs have failed
        throw new NoMoreBackupLLMsError();

    }
}
