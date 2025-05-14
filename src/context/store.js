import { configureStore } from '@reduxjs/toolkit';
import mangaReducer from './mangaSlice'
import uiReducer from './uiSlice'
import listReducer from './listSlice'


export const store = configureStore({
  reducer: {
    'manga': mangaReducer,
    'ui': uiReducer,
    'list': listReducer
  },
});


