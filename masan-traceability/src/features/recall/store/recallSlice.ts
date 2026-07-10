import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecallDecision } from '../types';
import { mockRecallDecisions } from '../../../local-data/recall';

interface RecallState {
  recalls: RecallDecision[];
}

const initialState: RecallState = {
  recalls: mockRecallDecisions
};

const recallSlice = createSlice({
  name: 'recall',
  initialState,
  reducers: {
    addRecall: (state, action: PayloadAction<RecallDecision>) => {
      state.recalls.unshift(action.payload);
    }
  }
});

export const { addRecall } = recallSlice.actions;
export default recallSlice.reducer;
