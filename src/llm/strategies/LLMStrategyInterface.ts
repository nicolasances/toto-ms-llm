import { LLM } from '../LLMInterface.js'

export interface LLMStrategyInterface {

    /**
     * Generic strategy for picking an LLM
     */
    getLLM(): LLM

    /**
     * Register that a failure has occurred for a specific LLM.
     * This is used to track LLMs that are not working properly, so that they can be skipped in future invocations.
     * 
     * @param llm the LLM to register as failed
     */
    registerFailure(llm: LLM): void

}

/**
 * Error for the case in which there are no more Backup LLMs available
 */
export class NoMoreBackupLLMsError extends Error {
    constructor(message: string = "No more Backup LLMs available") {
        super(message);
        this.name = "NoMoreBackupLLMsError";
    }
}
