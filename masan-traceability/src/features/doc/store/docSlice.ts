import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Doc, DocStatus } from '../types';
import { mockDocs } from '../../../local-data/doc';

interface DocState {
  docs: Doc[];
}

const initialState: DocState = {
  docs: mockDocs
};

const docSlice = createSlice({
  name: 'doc',
  initialState,
  reducers: {
    addDoc: (state, action: PayloadAction<Doc>) => {
      // Deactivate older version of same DocCode
      state.docs = state.docs.map(doc => {
        if (doc.DocCode === action.payload.DocCode && doc.ValidTo === null) {
          return { ...doc, ValidTo: action.payload.ValidFrom };
        }
        return doc;
      });

      state.docs.unshift(action.payload);
    },
    approveDoc: (state, action: PayloadAction<string>) => {
      const doc = state.docs.find(d => d.DocId === action.payload);
      if (doc) {
        doc.Status = DocStatus.APPROVED;
      }
    },
    rejectDoc: (state, action: PayloadAction<string>) => {
      const doc = state.docs.find(d => d.DocId === action.payload);
      if (doc) {
        doc.Status = DocStatus.REJECTED;
      }
    }
  }
});

export const { addDoc, approveDoc, rejectDoc } = docSlice.actions;
export default docSlice.reducer;
