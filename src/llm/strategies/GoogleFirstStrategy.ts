import { FAILED_LLM_CACHE, isLLMFailed } from "../../util/LLMCache.js";
import { AWSClaude } from "../AWSClaude.js";
import { Gemini } from "../Gemini.js";
import { LLM } from "../LLMInterface.js";
import { LLMStrategyInterface, NoMoreBackupLLMsError } from "./LLMStrategyInterface.js";

export class GoogleFirstLLMStrategy implements LLMStrategyInterface {

    llms: LLM[] = [
        new Gemini(), 
        new AWSClaude("claude-4-sonnet"),
        new AWSClaude("claude-3.7-sonnet"),
        new AWSClaude("claude-3.5-sonnet")
    ]

    getLLM(): LLM {

        // Find the first LLM that has not failed. Ignore priority (deprecated)
        for (const llm of this.llms) {
            if (!isLLMFailed(llm)) {
                return llm;
            }
        }

        // If we get here, it means that all backup LLMs have failed
        throw new NoMoreBackupLLMsError();
    }

    registerFailure(llm: LLM): void {
        // Cache the failure, so that we can skip this LLM in future invocations
        FAILED_LLM_CACHE.set(llm.name, { timestamp: Date.now() });
    }

}