import { ExecutionContext } from 'toto-api-controller'
import { LLM } from '../LLMInterface.js'

export interface LLMStrategyInterface {

    /**
     * Generic strategy for picking an LLM
     */
    getLLM(execContext: ExecutionContext): LLM

}
