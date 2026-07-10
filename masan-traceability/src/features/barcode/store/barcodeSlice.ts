import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Barcode } from '../types';
import { mockBarcodes } from '../../../local-data/barcode';

interface BarcodeState {
  barcodes: Barcode[];
}

const initialState: BarcodeState = {
  barcodes: mockBarcodes
};

const barcodeSlice = createSlice({
  name: 'barcode',
  initialState,
  reducers: {
    addBarcode: (state, action: PayloadAction<Barcode>) => {
      state.barcodes.unshift(action.payload);
    },
    updateBarcode: (state, action: PayloadAction<Barcode>) => {
      const idx = state.barcodes.findIndex(
        (b) => b.BarcodeId === action.payload.BarcodeId
      );
      if (idx !== -1) {
        state.barcodes[idx] = action.payload;
      }
    }
  }
});

export const { addBarcode, updateBarcode } = barcodeSlice.actions;
export default barcodeSlice.reducer;
