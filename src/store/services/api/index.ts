import { RootState } from '@/store';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { cacher } from './rtkQueryCacheUtils';
import { logout, setTokenReceived } from '@/store/reducers/auth/reducer';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://',
  prepareHeaders: (headers, api) => {
    // By default, if we have a token in the store, use that for authenticated requests
    const token = (api.getState() as RootState)?.auth?.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const refreshToken = (api.getState() as RootState)?.auth?.refreshToken;
  if (result.error && result.error.status === 401) {
    const refreshResult = (await baseQuery(
      {
        url: `${process.env.NEXT_PUBLIC_MEDICATE_BASE_URL}/auth/refresh`,
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    )) as QueryReturnValue<
      {
        data: { accessToken: string; refreshToken: string };
      },
      FetchBaseQueryError,
      FetchBaseQueryMeta
    >;

    if (refreshResult.data) {
      // store the new token
      api.dispatch(
        setTokenReceived({
          accessToken: refreshResult.data.data.accessToken,
          refreshToken: refreshResult.data.data.refreshToken,
        })
      );
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  tagTypes: [...cacher.defaultTags, 'KYC', 'Reminder', 'Role', 'User', 'Staff'],
});
