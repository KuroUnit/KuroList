import { configureStore } from '@reduxjs/toolkit';
import mangaReducer from '../context/mangaSlice'
import uiReducer from '../context/uiSlice'

export const store = configureStore({
  reducer: {
    'manga': mangaReducer,
    'ui': uiReducer
  },
});


