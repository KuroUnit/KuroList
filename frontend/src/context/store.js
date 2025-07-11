import { configureStore } from '@reduxjs/toolkit';
import mangaReducer from './mangaSlice'
import uiReducer from './uiSlice'
import listReducer from './listSlice'
import errorReducer from './errorSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    'manga': mangaReducer,
    'ui': uiReducer,
    'list': listReducer,
    'error': errorReducer,
    'auth': authReducer
  },
});


