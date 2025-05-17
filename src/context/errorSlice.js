import { createSlice } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: 'error',
  initialState: {
    error: null,
  },
  reducers: {
    set_error: (state, action) => {
      state.error = action.payload
      return state; 
    },

  }
});
export const map_error = (state) => state.error.error
export const errorActions = errorSlice.actions
export default errorSlice.reducer 