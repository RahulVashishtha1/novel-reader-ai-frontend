import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import novelReducer from './novels/novelSlice';
import imageReducer from './images/imageSlice';
import userReducer from './users/userSlice';
import preferencesReducer from './preferences/preferencesSlice';
import annotationsReducer from './annotations/annotationsSlice';
import sharingReducer from './sharing/sharingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    novels: novelReducer,
    images: imageReducer,
    users: userReducer,
    preferences: preferencesReducer,
    annotations: annotationsReducer,
    sharing: sharingReducer,
  },
});

export default store;
