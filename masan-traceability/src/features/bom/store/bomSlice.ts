import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bom, Bom_Line } from "../types";
import { mockBoms } from "../../../local-data/bom";

interface BomState {
  boms: Bom[];
}

const initialState: BomState = {
  boms: mockBoms,
};

const bomSlice = createSlice({
  name: "bom",
  initialState,
  reducers: {
    updateBomLine: (
      state,
      action: PayloadAction<{
        BomId: string;
        BomLineId: string;
        data: Partial<Bom_Line>;
      }>,
    ) => {
      const bom = state.boms.find((b) => b.BomId === action.payload.BomId);
      if (bom && bom.BomLines) {
        const line = bom.BomLines.find(
          (l) => l.BomLineId === action.payload.BomLineId,
        );
        if (line) {
          Object.assign(line, action.payload.data);
        }
      }
    },
    updateParentHscb: (
      state,
      action: PayloadAction<{
        BomId: string;
        Selected_HscbVersionId: string | undefined;
      }>,
    ) => {
      const bom = state.boms.find((b) => b.BomId === action.payload.BomId);
      if (bom) {
        bom.Selected_HscbVersionId = action.payload.Selected_HscbVersionId;
      }
    },
  },
});

export const { updateBomLine, updateParentHscb } = bomSlice.actions;
export default bomSlice.reducer;
