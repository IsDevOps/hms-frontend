import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from '@/store/sync_storage';
import { ReminderState } from './typings';
import { RootState } from '@/store';

const initialState: ReminderState = {
  medications: null,
  notificationChannels: null,
  phoneNumbers: null,
  emails: null,
  payment: null,
};

const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    setMedications: (state, action) => ({
      ...state,
      medications: action.payload.medications,
    }),
    setNotificationChannels: (state, action) => ({
      ...state,
      notificationChannels: action.payload.notificationChannels,
    }),
    setPhoneNumbers: (state, action) => ({
      ...state,
      phoneNumbers: action?.payload?.phoneNumbers ?? null,
    }),
    setEmails: (state, action) => ({
      ...state,
      emails: action?.payload?.emails ?? null,
    }),
    setReminderPaymentDetails: (state, action) => ({
      ...state,
      payment: {
        ...state.payment,
        ...action.payload,
      },
    }),
    resetMedicationsDetails: () => {
      return initialState;
    },
  },
});

export const {
  resetMedicationsDetails,
  setEmails,
  setMedications,
  setNotificationChannels,
  setPhoneNumbers,
  setReminderPaymentDetails,
} = reminderSlice.actions;

export const selectReminderDetails = (state: RootState) => ({
  medications: state.reminder.medications,
  notificationChannels: state.reminder.notificationChannels,
  emails: state.reminder.emails,
  phoneNumbers: state.reminder.phoneNumbers,
  payment: state.reminder.payment,
});
export const selectMedications = (state: RootState) =>
  state.reminder.medications;
export const selectNotifChannelsDetail = (state: RootState) => ({
  channels: state.reminder.notificationChannels,
  emails: state.reminder.emails,
  phones: state.reminder.phoneNumbers,
});
export const selectReminderPaymentDetails = (state: RootState) =>
  state.reminder.payment;

const persistConfig = {
  key: 'reminder',
  storage,
};

const reminderReducaer = reminderSlice.reducer;

export default persistReducer(persistConfig, reminderReducaer);
