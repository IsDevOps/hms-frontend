import { combineReducers } from '@reduxjs/toolkit';
import { api } from './services/api';
import authReducer from './reducers/auth/reducer';
import reminderReducer from './reducers/reminder/reducer';
import notificationReducer from './reducers/notification/reducer';
import userMgtReducer from './reducers/user-mgt/reducer';

const rootReducer = combineReducers({
  // add reducers here
  auth: authReducer,
  reminder: reminderReducer,
  notification: notificationReducer,
  userMgt: userMgtReducer,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
