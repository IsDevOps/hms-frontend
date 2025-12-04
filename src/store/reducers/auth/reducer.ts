import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from '@/store/sync_storage';
import { AuthState } from './typings';
import { RootState } from '@/store';

const initialState: AuthState = {
  authRole: null,
  areaOfExpertise: null,
  user: null,
  accessToken: null,
  refreshToken: null,
  resetToken: null,
  phoneNumber: null,
  newPhoneNumber: null,
  userId: null, // used during signup & to determine if user is new or existing
  displayName: null,
  pinSet: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthRole: (state, action) => ({
      ...state,
      authRole: action.payload,
    }),
    setCurrentUser: (state, action) => ({
      ...state,
      user: action.payload.user,
      accessToken: action.payload.accessToken,
      refreshToken: action.payload.refreshToken,
    }),
    setDisplayName: (state, action) => ({
      ...state,
      displayName: action.payload.displayName,
    }),
    setResetToken: (state, action) => ({
      ...state,
      resetToken: action.payload.resetToken,
    }),
    setTokenReceived: (state, action) => ({
      ...state,
      accessToken: action.payload.accessToken,
      refreshToken: action.payload.refreshToken,
    }),
    setPhoneNumber: (state, action) => ({
      ...state,
      phoneNumber: action.payload,
    }),
    setNewPhoneNumber: (state, action) => ({
      ...state,
      newPhoneNumber: action.payload,
    }),
    setPinSet: (state, action) => ({
      ...state,
      pinSet: action.payload,
    }),
    setAreaOfExpertise: (state, action) => ({
      ...state,
      areaOfExpertise: action.payload,
    }),
    setUserId: (state, action) => ({
      ...state,
      userId: action.payload,
    }),
    updateUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    logout: () => {
      localStorage.clear();

      return initialState;
    },
  },
});

export const {
  logout,
  setCurrentUser,
  setDisplayName,
  setResetToken,
  setPhoneNumber,
  setNewPhoneNumber,
  setPinSet,
  setAuthRole,
  setAreaOfExpertise,
  setTokenReceived,
  setUserId,
  updateUser,
} = authSlice.actions;

export const selectDisplayName = (state: RootState) => state.auth.displayName;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectResetToken = (state: RootState) => state.auth.resetToken;
export const selectPhoneNumber = (state: RootState) => state.auth.phoneNumber;
export const selectNewPhoneNumber = (state: RootState) =>
  state.auth.newPhoneNumber;
export const selectPinSet = (state: RootState) => state.auth.pinSet;
export const selectAuthRole = (state: RootState) => state.auth.authRole;
export const selectAreaOfExpertise = (state: RootState) =>
  state.auth.areaOfExpertise;
export const selectUserId = (state: RootState) => state.auth.userId;
export const selectUser = (state: RootState) => state.auth.user;

const persistConfig = {
  key: 'auth',
  storage,
  blacklist: ['accessToken'],
};

const authReducer = authSlice.reducer;

export default persistReducer(persistConfig, authReducer);
