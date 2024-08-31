import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { encrypt } from "@/app/utils/encryption";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const cookieStore = cookies();
    let authorization = new URLSearchParams();

    // generate PKCE code verifier and code challenge

    const codeVerifier = crypto.randomBytes(64).toString("base64url");
    const codeVerifierHash = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest();
    const codeChallenge = codeVerifierHash
        .toString("base64url")
        .replace(/=+$/, "");

    // append the code challenge and state to the authorization request
    authorization.append("response_type", "code");
    authorization.append("client_id", process.env.OAUTH2_CLIENT_ID as string);
    authorization.append(
        "redirect_uri",
        process.env.OAUTH2_REDIRECT_URI as string
    );
    authorization.append("scope", process.env.OAUTH2_SCOPE as string);
    authorization.append("code_challenge_method", "S256");
    authorization.append("code_challenge", codeChallenge);

    console.log("code_verifier : " + codeVerifier);

    const encryptedCodeVerifier = encrypt(codeVerifier);

    console.log("enc : " + encryptedCodeVerifier);

    cookieStore.set("code_verifier", encryptedCodeVerifier, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + 300000),
    });

    const redirectUrl =
        process.env.OAUTH2_AUTHORIZATION_URL + authorization.toString();
    console.log("Redirecting to: " + redirectUrl);

    return NextResponse.redirect(redirectUrl);
}
