import { LLM } from '../LLMInterface.js'

export interface LLMStrategyInterface {

    /**
     * Generic strategy for picking an LLM
     */
    getLLM(): LLM

    /**
     * Returns a backup LLM, in case the main LLM fails.
     * 
     * @param execContext the execution context
     * @param priority the priority, rangind from 0 to +oo. The priority is used in case of many backup LLMs available. Each backup LLM must have a priority associated. 
     */
    getBackupLLM(priority: number): LLM;

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
