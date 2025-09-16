import {createSlice} from "@reduxjs/toolkit";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";

type SetUserAction = {
  payload: z.infer<typeof UserSchema.User>;
  type: string;
}
export const userSlice = createSlice({
  name: 'User',
  initialState: null as null | z.infer<typeof UserSchema.User>,
  reducers: {
    setUser(state, action: SetUserAction) {
      state = action.payload;
      return state;
    }
  }
});

export const {setUser} = userSlice.actions;
export default userSlice.reducer;