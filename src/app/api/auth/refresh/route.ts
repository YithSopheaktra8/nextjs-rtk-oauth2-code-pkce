
// Add the following import statement
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Data = {
	refreshToken: string;
};
// Create a POST request handler
export async function POST() {
	// Get the refresh token from the client-side cookies
	const cookieStore = cookies();
	const cookieName = "refresh_token";
	const credential = cookieStore.get(cookieName);

	console.log("refresh token : "+credential?.value);

	// If the refresh token is not found, return an error message to the client-side
	if (!credential) {
		return NextResponse.json(
			{
				message: "Token not found !!!",
			},
			{
				status: 404,
			}
		);
	}
	// get the refresh token value

    const authorizationHeader = `Basic ${Buffer.from(process.env.OAUTH2_CLIENT_ID+":"+process.env.OAUTH2_CLIENT_SECRET).toString("base64")}`;
    const requestBody = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.OAUTH2_CLIENT_ID as string,
      redirect_uri: process.env.OAUTH2_REDIRECT_URI as string,
      refresh_token: credential.value,
    });

	// if the refresh token is found, make a POST request to the Our API
	const response = await fetch(
		process.env.OAUTH2_TOKEN_URL as string,
		{
			method: "POST",
			headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: authorizationHeader,
              },
              body: requestBody,
		}
	);
	// If the request fails, return an error message to the client-side
	if (!response.ok) {
		return NextResponse.json(
			{
				message: "Failed to refresh access token",
			},
			{
				status: response.status,
			}
		);
	}
	// Parse the response body to get the data
	const data = await response.json();
	console.log("data after refresh token : ",data)
	const refresh = data?.refresh_token || null;
	const access = data?.access_token || null;

	// Serialize the refresh token and set it as a cookie with
	// (httpOnly, secure, path, and sameSite options) in the response headers to the client-side
	const serialized = serialize(cookieName, refresh, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		sameSite: "lax",
	});

	console.log("access token : ", access);

	// Return the access token to the client-side with the serialized refresh token as a cookie
	return NextResponse.json(
		{
			accessToken: access,
		},
		{
			headers: {
				"Set-Cookie": serialized,
			},
		}
	);
}
