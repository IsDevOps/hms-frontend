import { sortByCreatedAt } from '@/lib/utils/date';
import { api } from '../api';
import {
  AllReminderResponseType,
  CreateReminderRequestType,
  CreateReminderResponseType,
  PaymentReminderResponseType,
  ReminderRequestType,
  SingleReminderResponseType,
  TodayReminderResponseType,
  UpdateDoseRequestType,
  UpdateDoseStatusResponseType,
  UpdateMedicationRequestType,
  UpdateMedicationResponseType,
  UploadReminderImageResponseType,
} from './typings';

const url = process.env.NEXT_PUBLIC_MEDICATE_BASE_URL;

const reminder = api.injectEndpoints({
  endpoints: (build) => ({
    uploadMedImage: build.mutation<UploadReminderImageResponseType, FormData>({
      query: (formData) => ({
        url: `${url}/reminders/image`,
        method: 'POST',
        body: formData,
      }),
    }),
    createReminder: build.mutation<
      CreateReminderResponseType,
      CreateReminderRequestType
    >({
      query: (payload) => ({
        url: `${url}/reminders`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],
    }),
    getReminders: build.query<AllReminderResponseType, ReminderRequestType>({
      query: (params) => ({
        url: `${url}/reminders`,
        params: params,
      }),
      transformResponse: (response: AllReminderResponseType) => {
        if (response.data && Array.isArray(response.data.reminders)) {
          response.data?.reminders?.sort((a, b) =>
            sortByCreatedAt(a.createdAt, b.createdAt)
          );
        }
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.reminders.map(({ _id }) => ({
                type: 'Reminder' as const,
                _id,
              })),
              { type: 'Reminder', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Reminder', id: 'PARTIAL-LIST' }],
    }),
    getTodaysReminder: build.query<
      TodayReminderResponseType,
      { period: 'morning' | 'afternoon' | 'evening'; date: string }
    >({
      query: (params) => ({
        url: `${url}/reminders/daily`,
        params: params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ reminderId }) => ({
                type: 'Reminder' as const,
                id: reminderId,
              })),
              { type: 'Reminder', id: 'LIST' },
            ]
          : [{ type: 'Reminder', id: 'LIST' }],
    }),
    getReminderByTransationRef: build.query<
      PaymentReminderResponseType,
      string
    >({
      query: (transactionRef) =>
        `${url}/reminders/by-transaction/${transactionRef}`,
    }),
    getSingleReminder: build.query<SingleReminderResponseType, string>({
      query: (id) => `${url}/reminders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Reminder', id }],
    }),
    editReminder: build.mutation<
      UpdateMedicationResponseType,
      UpdateMedicationRequestType
    >({
      query: ({ id, ...payload }) => ({
        url: `${url}/reminders/${id}`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Reminder', id: arg.id },
        { type: 'Reminder', id: 'PARTIAL-LIST' },
      ],
    }),
    updateMedImage: build.mutation<
      UploadReminderImageResponseType,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `${url}/reminders/medication-image/${id}/update`,
        method: 'PATCH',
        body: formData,
      }),
    }),
    deleteMedImage: build.mutation<
      UploadReminderImageResponseType,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${url}/reminders/${id}/image`,
        method: 'DELETE',
      }),
    }),
    updateDoseStatus: build.mutation<
      UpdateDoseStatusResponseType,
      UpdateDoseRequestType
    >({
      query: ({ id, doseId, ...payload }) => ({
        url: `${url}/reminders/${id}/doses/${doseId}/status`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Reminder', id: arg.id },
        { type: 'Reminder', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateReminderMutation,
  useDeleteMedImageMutation,
  useEditReminderMutation,
  useGetRemindersQuery,
  useGetReminderByTransationRefQuery,
  useGetTodaysReminderQuery,
  useGetSingleReminderQuery,
  useUpdateDoseStatusMutation,
  useUpdateMedImageMutation,
  useUploadMedImageMutation,
} = reminder;
