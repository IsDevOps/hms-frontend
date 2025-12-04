import { api } from '../api';
import { io } from 'socket.io-client';
import { MarkAsReadResponseType, NotificationResponseType } from './typings';
import { setPing } from '@/store/reducers/notification/reducer';

const url = process.env.NEXT_PUBLIC_MEDICATE_BASE_URL;

const inApp = api.injectEndpoints({
  endpoints: (build) => ({
    getAllNotifications: build.query<
      NotificationResponseType,
      { token: string; limit?: number; page?: number }
    >({
      query: (params) => ({
        url: `${url}/notifications/in-app`,
        params: { limit: params.limit ?? 10, page: params.page ?? 1 },
      }),

      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },

      async onCacheEntryAdded(
        { token },
        // _arg,
        { dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = io(process.env.NEXT_PUBLIC_MEDICATE_WEBSOCKET_BASE_URL, {
          transports: ['websocket'],
          auth: {
            accessToken: token,
          },
        });

        try {
          await cacheDataLoaded;

          socket.on('connect', () => {
            // for debug purposes emit 'ping' and listen for 'pong'
            socket.emit('ping');
            socket.on('pong', (data) => console.log(data));
          });

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          socket.on('notification', (data) => {
            if (data && typeof data === 'object' && 'id' in data)
              updateCachedData((draft) => {
                draft.data.notifications.unshift(data);
              });

            dispatch(setPing());
          });
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }

        await cacheEntryRemoved;
        socket.disconnect();
      },
      providesTags: (result) =>
        result && result.data && Array.isArray(result.data.notifications)
          ? [
              ...result.data.notifications.map(({ id }) => ({
                type: 'Reminder' as const,
                id,
              })),
              { type: 'Reminder', id: 'LIST' },
            ]
          : [{ type: 'Reminder', id: 'LIST' }],
    }),
    markAsRead: build.mutation<MarkAsReadResponseType, string>({
      query: (notificationId) => ({
        url: `${url}/notifications/in-app/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Reminder', id },
        { type: 'Reminder', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAllNotificationsQuery, useMarkAsReadMutation } = inApp;
