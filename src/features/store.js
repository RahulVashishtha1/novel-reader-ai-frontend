import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import novelReducer from './novels/novelSlice';
import imageReducer from './images/imageSlice';
import userReducer from './users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    novels: novelReducer,
    images: imageReducer,
    users: userReducer,
  },
});

export default store;
