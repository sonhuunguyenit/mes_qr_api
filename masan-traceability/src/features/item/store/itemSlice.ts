import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../types';
import { mockItems } from '../../../local-data/item';

interface ItemState {
  items: Item[];
  loading: boolean;
}

const initialState: ItemState = {
  items: mockItems,
  loading: false
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.unshift(action.payload);
    },
    updateItem: (state, action: PayloadAction<{ ItemCode: string; data: Partial<Item> }>) => {
      const index = state.items.findIndex(item => item.ItemCode === action.payload.ItemCode);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.ItemCode !== action.payload);
    }
  }
});

export const { addItem, updateItem, deleteItem } = itemSlice.actions;
export default itemSlice.reducer;
