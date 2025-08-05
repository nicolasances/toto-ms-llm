import { MongoClient, ServerApiVersion } from 'mongodb';
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { TotoControllerConfig, CustomAuthVerifier, ValidatorProps } from "toto-api-controller";
import { TotoAuthProvider } from './totoauth/TotoAuthProvider.js';

const secretManagerClient = new SecretManagerServiceClient();

export const collections = {
    health: 'health',
};


export class ControllerConfig implements TotoControllerConfig {

    expectedAudience: string | undefined;
    totoAuthEndpoint: string | undefined;
    jwtSigningKey: string | undefined;
    awsLLMEndpoint: string | undefined;
    mongoUser: string | undefined;
    mongoPwd: string | undefined;
    mongoHost: string | undefined;
    dbName: string = "totollm";
    collections: string[] = [
        "health"
    ]

    async load(): Promise<any> {

        let promises = [];

        promises.push(secretManagerClient.accessSecretVersion({ name: `projects/${process.env.GCP_PID}/secrets/toto-expected-audience/versions/latest` }).then(([version]: any) => {

            this.expectedAudience = version.payload!.data!.toString();

        }));

        promises.push(secretManagerClient.accessSecretVersion({ name: `projects/${process.env.GCP_PID}/secrets/jwt-signing-key/versions/latest` }).then(([version]: any) => {

            this.jwtSigningKey = version.payload!.data!.toString();

        }));

        promises.push(secretManagerClient.accessSecretVersion({ name: `projects/${process.env.GCP_PID}/secrets/toto-auth-endpoint/versions/latest` }).then(([version]: any) => {

            this.totoAuthEndpoint = version.payload!.data!.toString();

        }));

        promises.push(secretManagerClient.accessSecretVersion({ name: `projects/${process.env.GCP_PID}/secrets/aws-sandbox-llm-api-endpoint/versions/latest` }).then(([version]: any) => {

            this.awsLLMEndpoint = version.payload!.data!.toString();

        }));

        promises.push(secretManagerClient.accessSecretVersion({ name: `projects/${process.env.GCP_PID}/secrets/toto-ms-llm-mongo-user/versions/latest` }).then(([version]) => {

            this.mongoUser = version.payload!.data!.toString();

        }));

        promises.push(secretManagerClient.accessSecretVersion({ name: `projects/${process.env.GCP_PID}/secrets/toto-ms-llm-mongo-pswd/versions/latest` }).then(([version]) => {

            this.mongoPwd = version.payload!.data!.toString();

        }));

        promises.push(secretManagerClient.accessSecretVersion({ name: `projects/${process.env.GCP_PID}/secrets/mongo-host/versions/latest` }).then(([version]) => {

            this.mongoHost = version.payload!.data!.toString();

        }));


        await Promise.all(promises);

    }

    getCustomAuthVerifier(): CustomAuthVerifier {
        return new TotoAuthProvider(String(this.jwtSigningKey))
    }

    getProps(): ValidatorProps {

        return {
        }
    }

    async getMongoClient() {

        const mongoUrl = `mongodb://${this.mongoUser}:${this.mongoPwd}@${this.mongoHost}:27017/${this.dbName}`

        return await new MongoClient(mongoUrl).connect();
    }
    
    getExpectedAudience(): string {

        return String(this.expectedAudience)
        
    }

}
