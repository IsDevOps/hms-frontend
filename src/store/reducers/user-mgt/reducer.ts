import { RootState } from '@/store';
import { Role } from '@/store/services/user-mgt/typings';
import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from '@/store/sync_storage';

type InitialState = {
  role: Role | null;
};

const initialState: InitialState = {
  role: null,
};

const userMgtSlice = createSlice({
  name: 'user-mgt',
  initialState,
  reducers: {
    setRoleInfo: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setRoleInfo } = userMgtSlice.actions;

const persistConfig = {
  key: 'user-mgt',
  storage,
};

export const selectRoleInfo = (state: RootState) => state.userMgt.role;

export default persistReducer(persistConfig, userMgtSlice.reducer);
