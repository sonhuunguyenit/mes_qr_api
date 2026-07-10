import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Partner, PartnerItemMapping, DocStatus } from '../types';
import { mockPartners, mockPartnerItemMappings } from '../../../local-data/partner';

interface PartnerState {
  partners: Partner[];
  mappings: PartnerItemMapping[];
}

const initialState: PartnerState = {
  partners: mockPartners,
  mappings: mockPartnerItemMappings
};

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    addPartner: (state, action: PayloadAction<Partner>) => {
      state.partners.unshift({
        ...action.payload,
        Status: DocStatus.PENDING
      });
    },
    updatePartner: (state, action: PayloadAction<Partner>) => {
      const idx = state.partners.findIndex(p => p.PartnerId === action.payload.PartnerId);
      if (idx !== -1) {
        state.partners[idx] = {
          ...state.partners[idx],
          ...action.payload,
        };
      }
    },
    approvePartner: (state, action: PayloadAction<string>) => {
      const partner = state.partners.find(p => p.PartnerId === action.payload);
      if (partner) {
        partner.Status = DocStatus.APPROVED;
      }
    },
    rejectPartner: (state, action: PayloadAction<string>) => {
      const partner = state.partners.find(p => p.PartnerId === action.payload);
      if (partner) {
        partner.Status = DocStatus.REJECTED;
      }
    },
    assignPartnerToItem: (state, action: PayloadAction<PartnerItemMapping>) => {
      // Avoid duplicate mappings
      const exists = state.mappings.some(
        m => m.ItemCode === action.payload.ItemCode && m.PartnerId === action.payload.PartnerId
      );
      if (!exists) {
        state.mappings.push(action.payload);
      }
    },
    removePartnerFromItem: (state, action: PayloadAction<{ ItemCode: string; PartnerId: string }>) => {
      state.mappings = state.mappings.filter(
        m => !(m.ItemCode === action.payload.ItemCode && m.PartnerId === action.payload.PartnerId)
      );
    }
  }
});

export const { addPartner, updatePartner, approvePartner, rejectPartner, assignPartnerToItem, removePartnerFromItem } = partnerSlice.actions;
export default partnerSlice.reducer;

