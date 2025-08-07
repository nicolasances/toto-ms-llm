import { LLM, LLMFactory } from "../LLMInterface.js";
import { LLMStrategyInterface } from "./LLMStrategyInterface.js";

export class CustomStrategy implements LLMStrategyInterface {

    llms: LLM[] = [
    ];

    constructor(llms: string[]) {
        this.llms = llms.map(llmName => LLMFactory.getLLM(llmName));
    }

    getPrioritizedLLMs(): LLM[] {
        return this.llms;
    }
}