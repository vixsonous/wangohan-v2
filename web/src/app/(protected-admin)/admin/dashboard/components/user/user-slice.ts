import {createSlice} from "@reduxjs/toolkit";
import {User} from "@/app/(protected-admin)/admin/dashboard/components/generic-data-table";

type SetUsersActionPayload = {
  payload: User[];
  type: string;
}

type UpdateUserLevelActionPayload = {
  payload: {
    id: number;
    level: 2 | 1 | 0;
  };
  type: string;
}

export const userSlice = createSlice({
  name: 'User Admin',
  initialState: [] as User[],
  reducers: {
    setUsers(state, action: SetUsersActionPayload) {
      return action.payload;
    },

    updateUserLevel(state, action: UpdateUserLevelActionPayload) {
      const idx = state.findIndex(r => r.user_id === action.payload.id);
      if(idx < 0) return state;
      state[idx].user_lvl = action.payload.level;
    }
  }
});

export const {setUsers, updateUserLevel} = userSlice.actions;
export default userSlice.reducer;