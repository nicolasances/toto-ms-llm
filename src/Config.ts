import { MongoClient, ServerApiVersion } from 'mongodb';
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { TotoControllerConfig, CustomAuthVerifier, ValidatorProps } from "toto-api-controller";
import { TotoAuthProvider } from './totoauth/TotoAuthProvider.js';

const secretManagerClient = new SecretManagerServiceClient();

export class ControllerConfig implements TotoControllerConfig {

    expectedAudience: string | undefined;
    totoAuthEndpoint: string | undefined;
    jwtSigningKey: string | undefined;
    awsLLMEndpoint: string | undefined;

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


        await Promise.all(promises);

    }

    getCustomAuthVerifier(): CustomAuthVerifier {
        return new TotoAuthProvider(String(this.jwtSigningKey))
    }

    getProps(): ValidatorProps {

        return {
        }
    }

    getExpectedAudience(): string {

        return String(this.expectedAudience)
        
    }

}
