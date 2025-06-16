import { AuthCheckResult, CustomAuthVerifier, IdToken } from "toto-api-controller";
import jwt from 'jsonwebtoken';

function verifyAndDecode(token: string, jwtSigningKey: string) {

    try {
        return jwt.verify(token, jwtSigningKey)
    } catch (error) {
        console.log(error);
        throw error
    }

}

export class TotoAuthProvider implements CustomAuthVerifier {

    jwtSigningKey: string;

    constructor(jwtSigningKey: string) {
        this.jwtSigningKey = jwtSigningKey;

    }

    getAuthProvider(): string {
        return "toto"
    }

    async verifyIdToken(idToken: IdToken): Promise<AuthCheckResult> {

        console.log("Validating custom token..")

        const result: any = verifyAndDecode(idToken.idToken, this.jwtSigningKey)

        if (!result) throw {code: 401, message: 'Failed token verification'};

        console.log("Custom token successfully validated");

        return {
            sub: result.user,
            email: result.user,
            authProvider: result.authProvider
        }

    }
}
