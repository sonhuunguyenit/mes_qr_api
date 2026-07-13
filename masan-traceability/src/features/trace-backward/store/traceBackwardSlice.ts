import { createSlice } from "@reduxjs/toolkit";
import { TraceBackwardState } from "../types";

const initialState: TraceBackwardState = {
  loading: false,
  error: null,
};

export const traceBackwardSlice = createSlice({
  name: "traceBackward",
  initialState,
  reducers: {},
});

export default traceBackwardSlice.reducer;
