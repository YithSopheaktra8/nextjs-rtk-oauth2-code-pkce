import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { setAccessToken } from "./features/tokenSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL ,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).accessToken.token;
		// const token = localStorage.getItem("accessToken");
		// if we have a token, let's set the authorization header
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
	// check result of each query. if it's a 401, we'll try to re-authenticate
	let result = await baseQuery(args, api, extraOptions);
	if (result.error?.status === 401) {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "auth/refresh", {
			method: "POST",
			credentials: "include",
		});
		if (res.status === 200) {
			const data = await res.json();
			api.dispatch(setAccessToken(data.accessToken));
			// re-run the query with the new token
			result = await baseQuery(args, api, extraOptions);
		} else {
			const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL_LOCALHOST + "auth/logout", {
				method: "POST",
				credentials: "include",
			});
			const data = await res.json();
		}
	}
	return result;
};

export const oauth2Api = createApi({
	refetchOnReconnect: true,
	reducerPath: "iFinderApi",
	tagTypes: ["userImage", "user", "History", 'folder' , 'bookmark', 'ai'],
	baseQuery: baseQueryWithReAuth,
	endpoints: () => ({}),
});
