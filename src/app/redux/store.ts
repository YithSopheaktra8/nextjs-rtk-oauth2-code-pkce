import { configureStore } from "@reduxjs/toolkit";
import { oauth2Api } from "./api";
import token from "./features/tokenSlice";

export const makeStore = () => {
	return configureStore({
		reducer: {
            accessToken: token,
			[oauth2Api.reducerPath]: oauth2Api.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(oauth2Api.middleware),
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
