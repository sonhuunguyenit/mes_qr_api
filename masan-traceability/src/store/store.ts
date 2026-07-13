import { configureStore } from '@reduxjs/toolkit';
import itemReducer from '../features/item/store/itemSlice';
import hscbReducer from '../features/hscb/store/hscbSlice';
import specReducer from '../features/spec/store/specSlice';
import bomReducer from '../features/bom/store/bomSlice';
import shttReducer from '../features/shtt/store/shttSlice';
import barcodeReducer from '../features/barcode/store/barcodeSlice';
import docReducer from '../features/doc/store/docSlice';
import partnerReducer from '../features/partner/store/partnerSlice';
import recallReducer from '../features/recall/store/recallSlice';
import facilityReducer from '../features/facility/store/facilitySlice';

export const store = configureStore({
  reducer: {
    item: itemReducer,
    hscb: hscbReducer,
    spec: specReducer,
    bom: bomReducer,
    shtt: shttReducer,
    barcode: barcodeReducer,
    doc: docReducer,
    partner: partnerReducer,
    recall: recallReducer,
    facility: facilityReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
