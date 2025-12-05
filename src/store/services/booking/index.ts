// import { api } from '../api';

// export const bookingApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     createBooking: builder.mutation({
//       query: (formData) => ({
//         url: '/bookings', // Your NestJS endpoint
//         method: 'POST',
//         // IMPORTANT: Do NOT set 'Content-Type': 'application/json'
//         // Do NOT set 'Content-Type': 'multipart/form-data' manually
//         // RTK Query + fetch will handle the boundary automatically when it sees FormData
//         body: formData,
//       }),
//     }),
//   }),
// });

// export const { useCreateBookingMutation } = bookingApi;
