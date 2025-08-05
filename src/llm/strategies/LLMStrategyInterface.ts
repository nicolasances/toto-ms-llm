import { LLM } from '../LLMInterface.js'

export interface LLMStrategyInterface {

    /**
     * Generic strategy for picking an LLM
     */
    getPrioritizedLLMs(): LLM[] 

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
