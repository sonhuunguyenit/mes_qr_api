import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Spec, DocStatus } from "../types";
import { mockSpecs } from "../../../local-data/spec";

interface SpecState {
  specs: Spec[];
}

const initialState: SpecState = {
  specs: mockSpecs,
};

const specSlice = createSlice({
  name: "spec",
  initialState,
  reducers: {
    addSpec: (state, action: PayloadAction<Spec>) => {
      // Deactivate older version of same SpecCode
      state.specs = state.specs.map((spec) => {
        if (
          spec.SpecCode === action.payload.SpecCode &&
          spec.ValidTo === null
        ) {
          return { ...spec, ValidTo: action.payload.ValidFrom };
        }
        return spec;
      });

      state.specs.unshift({
        ...action.payload,
        Status: DocStatus.PENDING,
      });
    },
    approveSpec: (state, action: PayloadAction<string>) => {
      const spec = state.specs.find((s) => s.SpecId === action.payload);
      if (spec) {
        spec.Status = DocStatus.APPROVED;
      }
    },
    rejectSpec: (state, action: PayloadAction<string>) => {
      const spec = state.specs.find((s) => s.SpecId === action.payload);
      if (spec) {
        spec.Status = DocStatus.REJECTED;
      }
    },
  },
});

export const { addSpec, approveSpec, rejectSpec } = specSlice.actions;
export default specSlice.reducer;
