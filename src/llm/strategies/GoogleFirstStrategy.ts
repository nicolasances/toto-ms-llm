import { ExecutionContext } from "toto-api-controller";
import { Gemini } from "../Gemini.js";
import { LLM } from "../LLMInterface.js";
import { LLMStrategyInterface } from "./LLMStrategyInterface.js";

export class GoogleFirstLLMStrategy implements LLMStrategyInterface {

    getLLM(execContext: ExecutionContext): LLM {
        return new Gemini(execContext)
    }

}