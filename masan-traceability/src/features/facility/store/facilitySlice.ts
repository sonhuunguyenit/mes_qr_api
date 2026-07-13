import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Facility } from "../types";
import { mockFacilities } from "../../../local-data/facility";

interface FacilityState {
  facilities: Facility[];
}

const initialState: FacilityState = {
  facilities: mockFacilities,
};

const facilitySlice = createSlice({
  name: "facility",
  initialState,
  reducers: {
    addFacility: (state, action: PayloadAction<Facility>) => {
      state.facilities.unshift(action.payload);
    },
    updateFacility: (state, action: PayloadAction<Facility>) => {
      state.facilities = state.facilities.map((fac) => {
        if (fac.FacilityId === action.payload.FacilityId) {
          return action.payload;
        }
        return fac;
      });
    },
  },
});

export const { addFacility, updateFacility } = facilitySlice.actions;
export default facilitySlice.reducer;
