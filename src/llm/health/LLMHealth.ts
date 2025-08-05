import { ExecutionContext } from "toto-api-controller/dist/model/ExecutionContext.js";
import { LLM } from "../LLMInterface.js";
import { collections, ControllerConfig } from "../../Config.js";
import { TotoRuntimeError, ValidationError } from "toto-api-controller";

const RETRY_TIME = 15; // minutes

export class LLMHealth {
    
    executionContext: ExecutionContext;

    constructor(executionContext: ExecutionContext) {
        this.executionContext = executionContext;
    }

    async isHealthy(llm: LLM): Promise<boolean> {

        const logger = this.executionContext.logger;
        const cid = this.executionContext.cid;
        const config = this.executionContext.config as ControllerConfig;

        let client; 
        try {

            // Instantiate the DB
            client = await config.getMongoClient();
            const db = client.db(config.dbName);

            // Get the health record for the LLM
            const llmHealth = await db.collection(collections.health).findOne({ llmName: llm.name, llmProvider: llm.provider });

            // If there's no record, consider it healthy
            if (!llmHealth || !llmHealth.lastFailedAt) return true;

            // Otherwise check if the last failure was more than RETY_TIME minutes ago
            const lastFailedAt = new Date(llmHealth.lastFailedAt);
            const now = new Date();
            const diffInMinutes = (now.getTime() - lastFailedAt.getTime()) / (1000 * 60);

            logger.compute(cid, `LLM Health Check: LLM ${llm.name} last failed at ${lastFailedAt.toISOString()}, diff in minutes: ${diffInMinutes}. Retry time is ${RETRY_TIME} minutes. Is healthy? ${diffInMinutes > RETRY_TIME}`);

            if (diffInMinutes > RETRY_TIME) return true;

            // If the last failure was within RETRY_TIME minutes, consider it unhealthy
            return false;


        } catch (error) {

            logger.compute(cid, `${error}`, "error")
            console.log(error);

            throw error;
            
        }
        finally {
            if (client) client.close();
        }
        

    }

    async registerLLMFailure(llm: LLM) {

        const logger = this.executionContext.logger;
        const cid = this.executionContext.cid;
        const config = this.executionContext.config as ControllerConfig;

        let client; 
        try {

            logger.compute(cid, `Registering LLM failure for ${llm.name} (${llm.provider})`);

            // Instantiate the DB
            client = await config.getMongoClient();
            const db = client.db(config.dbName);

            // Insert the failure record
            await db.collection(collections.health).updateOne({
                llmName: llm.name,
                llmProvider: llm.provider
            }, {
                $set: {
                    lastFailedAt: new Date(),
                }
            }, {
                upsert: true
            });

            logger.compute(cid, `LLM failure registered for ${llm.name} (${llm.provider})`);

        } catch (error) {

            logger.compute(cid, `${error}`, "error")
            console.log(error);

            throw error;
            
        }
        finally {
            if (client) client.close();
        }
        
    }
}