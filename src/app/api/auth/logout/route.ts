import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {

    // Clear the cookie by setting it to an empty string
    const cookieRefreshToken = "refresh_token";
    const cookieCodeVerifier = "code_verifier";
    const cookieIdToken = "id_token";
    const cookieSession = "JSESSIONID";
    const cookieStore = cookies();
    const credential = cookieStore.get(cookieRefreshToken);

    if (!credential) {
        return NextResponse.json(
            {
                message: "Token not found",
            },
            {
                status: 400,
            }
        );
    }
    const refreshToken = credential.value;

    //If refresh token exist, delete the refresh token from the client-side cookies
    if (refreshToken) {
        cookieStore.delete(cookieCodeVerifier);
        cookieStore.delete(cookieRefreshToken);
        cookieStore.delete(cookieIdToken);
        cookieStore.delete(cookieSession);


        return NextResponse.json(
            {
                message: "Logout successful",
            },
            {
                status: 200,
            }
        );
    }
    return NextResponse.json(
        {
            message: "Failed to logout",
        },
        {
            status: 400,
        }
    );
    

}
