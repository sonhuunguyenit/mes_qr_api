import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hscb_Shtt } from "../types";
import { mockShttMappings, mockIpmsInfo } from "../../../local-data/shtt";

interface ShttState {
  mappings: Hscb_Shtt[];
  ipmsInfo: typeof mockIpmsInfo;
}

const initialState: ShttState = {
  mappings: mockShttMappings,
  ipmsInfo: mockIpmsInfo,
};

const shttSlice = createSlice({
  name: "shtt",
  initialState,
  reducers: {
    addShttMapping: (state, action: PayloadAction<Hscb_Shtt>) => {
      state.mappings.unshift(action.payload);
    },
    setShttMappingsForVersion: (
      state,
      action: PayloadAction<{ versionId: string; mappings: Hscb_Shtt[] }>
    ) => {
      // Remove old mappings for this version
      state.mappings = state.mappings.filter(
        (m) => m.HscbVersionId !== action.payload.versionId
      );
      // Push new mappings
      state.mappings.push(...action.payload.mappings);
    },
  },
});

export const { addShttMapping, setShttMappingsForVersion } = shttSlice.actions;
export default shttSlice.reducer;
