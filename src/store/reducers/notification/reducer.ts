import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  hasNew: boolean;
};

const initialState: InitialState = {
  hasNew: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setPing: (state) => {
      state.hasNew = true;
    },
    clearPing: (state) => {
      state.hasNew = false;
    },
  },
});

export const { setPing, clearPing } = notificationSlice.actions;
export const selectPing = (state: RootState) => state.notification.hasNew;

export default notificationSlice.reducer;
