import { LLM, LLMResponse, Prompt, PromptOptions } from "./LLMInterface.js";
import { ExecutionContext, Logger } from 'toto-api-controller';
import http from 'request'
import { ControllerConfig } from '../Config.js';

export class AWSClaude implements LLM {

    name = 'claude-3.5-sonnet'

    async invoke(prompt: Prompt, options: PromptOptions, execContext: ExecutionContext): Promise<LLMResponse> {

        const logger = execContext.logger;
        const cid = execContext.cid;
        const awsLLMEndpoint = String((execContext.config as ControllerConfig).awsLLMEndpoint)

        logger.compute(cid, `Invoking model ${this.name} on AWS with options ${JSON.stringify(options)}`);

        // Manage the option
        let finalPrompt = prompt.promptText;

        // JSON Formatting option
        if (options.outputFormat == 'json') finalPrompt += `\nFORMAT THE OUTPUT IN JSON, DO NOT PUT ANY OTHER TEXT.`

        // Invoke the LLM
        const response = await callClaudeAPI(awsLLMEndpoint, finalPrompt);

        logger.compute(cid, `Model ${this.name} responded.`)

        // JSON Formatting, if needed
        if (options.outputFormat == 'json') {
            return { format: "json", value: JSON.parse(String(response)) }
        }

        return { format: "text", value: String(response) }


    }

}

/**
 * This function calls the REST API and the provided endpoint, passing a prompt in the body. 
 * No authentication is used. 
 */
function callClaudeAPI(endpoint: string, prompt: string): Promise<{ text: string }> {
    return new Promise((resolve, reject) => {
        http(
            {
                url: endpoint,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            },
            (error, response, body) => {

                if (error) {
                    return reject(error);
                }
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    return reject(new Error(`Claude API call failed with status ${response.statusCode}`));
                }
                try {
                    resolve(body);
                } catch (e) {
                    reject(e);
                }
            }
        );
    });
}