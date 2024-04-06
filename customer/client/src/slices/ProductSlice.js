import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "product",
  initialState: {
    value: null,
  },
  reducers: {
    fetchUProductState(state, action) {
      return state;
    },

    setProductState(state, action) {
      return { ...state, value: action.payload };
    },
    deleteProductState(state) {
      return { ...state, value: null };
    },
  },
});

// export const userId=(state)=>state.user.value;

export default userSlice.reducer;
export const { fetchProductState, setProductState, deleteProductState } =
  userSlice.actions;
