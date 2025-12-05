import { api } from '../api';
import { BookingResponse } from './typings';

const url = 'https://api-staging.medicate.health/api/v1';

const admindashboard = api.injectEndpoints({
  endpoints: (build) => ({
    getadminDashboard: build.query<any, void>({
      query: () => ({
        url: `${url}/admin/stats`,
        method: 'GET',
      }),
    }),
    // get all rooms
    getRooms: build.query<any, void>({
      query: () => ({
        url: `${url}/rooms/available`,
        method: 'GET',
      }),
    }),
    getAllRooms: build.query<any, void>({
      query: () => ({
        url: `${url}/rooms`,
        method: 'GET',
      }),
    }),

    // POST

    // createBooking: build.mutation<BookingResponse, FormData>({
    //   query: (formData) => ({
    //     url: `${url}/bookings`,
    //     method: 'POST',
    //     body: formData,
    //   }),
    // }),

    createBooking: build.mutation({
      query: (formData) => ({
        url: `${url}/bookings`,
        method: 'POST',
        body: formData,
      }),
    }),
    uploadBooking: build.mutation<BookingResponse, FormData>({
      query: (formData) => ({
        url: `${url}/ai-test/simulate-booking`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});
export const {
  useGetadminDashboardQuery,
  useCreateBookingMutation,
  useGetRoomsQuery,
  useUploadBookingMutation,
  useGetAllRoomsQuery,
} = admindashboard;
