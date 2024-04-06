import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: {
    value: '/Account',
  },
  reducers: {
    fetchPageState(state, action) {
      return state;
    },

    setPageState(state, action) {
      return { ...state, value: action.payload };
    },
    deletePageState(state) {
      return { ...state, value: null };
    },
  },
});

// export const userId=(state)=>state.user.value;

export default pageSlice.reducer;
export const { fetchPageState, setPageState, deletePageState } =
pageSlice.actions;
