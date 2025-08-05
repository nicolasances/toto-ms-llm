import { Request } from "express";
import { TotoDelegate, UserContext, ExecutionContext, ValidationError, TotoRuntimeError } from "toto-api-controller";
import { AWSFirstStrategy } from "../llm/strategies/AWSFirstStrategy.js";
import { NoMoreBackupLLMsError } from "../llm/strategies/LLMStrategyInterface.js";
import { LLMInvocation } from "../llm/process/LLMInvocation.js";
import { SUPPORTED_LLMS } from "../llm/LLMInterface.js";

/**
 * Returns the list of supported LLMs.
 */
export class GetSupportedLLMs implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        return {
            llms: SUPPORTED_LLMS
        }

    }
}