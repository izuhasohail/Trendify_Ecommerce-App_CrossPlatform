import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    value: null,
  },
  reducers: {
    fetchUserState(state, action) {
      return state;
    },

    setUserState(state, action) {
      return { ...state, value: action.payload };
    },
    deleteUserState(state) {
      return { ...state, value: null };
    },
  },
});

// export const userId=(state)=>state.user.value;

export default userSlice.reducer;
export const { fetchUserState, setUserState, deleteUserState } =
  userSlice.actions;
