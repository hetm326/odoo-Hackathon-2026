import { createSlice } from '@reduxjs/toolkit';

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    activeCurrency: 'USD',
    expenseFilterCategory: 'All',
    isAddExpenseModalOpen: false,
  },
  reducers: {
    setActiveCurrency: (state, action) => {
      state.activeCurrency = action.payload;
    },
    setExpenseFilterCategory: (state, action) => {
      state.expenseFilterCategory = action.payload;
    },
    setIsAddExpenseModalOpen: (state, action) => {
      state.isAddExpenseModalOpen = action.payload;
    }
  }
});

export const { setActiveCurrency, setExpenseFilterCategory, setIsAddExpenseModalOpen } = budgetSlice.actions;
export default budgetSlice.reducer;
