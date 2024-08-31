import { oauth2Api } from "@/app/redux/api";

export const userApi = oauth2Api.injectEndpoints({
	endpoints: (builder) => ({

		publicApi: builder.query<any, {}>({
			query: () => ({
				url: `test/public`,
				method: "GET",
			}),
		}),

        privateApi: builder.query<any, {}>({
            query: () => ({
                url: `test/private`,
                method: "GET",
            }),
        }),

        
	}),
});

export const {
	usePublicApiQuery,
    usePrivateApiQuery,
} = userApi;
