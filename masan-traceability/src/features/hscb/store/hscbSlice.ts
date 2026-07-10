import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hscb } from '../types';
import { mockHscbs } from '../../../local-data/hscb';

interface HscbState {
  hscbs: Hscb[];
}

const initialState: HscbState = {
  hscbs: mockHscbs
};

const hscbSlice = createSlice({
  name: 'hscb',
  initialState,
  reducers: {
    addHscb: (state, action: PayloadAction<Hscb>) => {
      // Deactivate older version of same ItemCode
      state.hscbs = state.hscbs.map(hscb => {
        // Find versions inside
        if (hscb.HscbVersions && hscb.HscbVersions.some(v => v.HscbItems?.some(item => item.ItemCode === action.payload.HscbVersions?.[0]?.HscbItems?.[0]?.ItemCode))) {
          const updatedVersions = hscb.HscbVersions.map(v => {
            if (v.ValidTo === null) {
              return { ...v, ValidTo: action.payload.HscbVersions?.[0]?.ValidFrom };
            }
            return v;
          });
          return { ...hscb, HscbVersions: updatedVersions };
        }
        return hscb;
      });

      // Add new HSCB
      state.hscbs.unshift(action.payload);
    },
    updateHscb: (state, action: PayloadAction<Hscb>) => {
      state.hscbs = state.hscbs.map(hscb => {
        if (hscb.HscbId === action.payload.HscbId) {
          return action.payload;
        }
        return hscb;
      });
    }
  }
});

export const { addHscb, updateHscb } = hscbSlice.actions;
export default hscbSlice.reducer;
