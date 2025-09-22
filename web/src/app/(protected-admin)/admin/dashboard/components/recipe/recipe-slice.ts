import {createSlice} from "@reduxjs/toolkit";
import z from "zod";
import {Recipe} from "@/app/(protected-admin)/admin/dashboard/components/generic-data-table";

type SetRecipesActionPayload = {
  payload: Recipe[];
  type: string;
}

type SetPublishActionPayload = {
  payload: {
    id: number;
    publish: boolean;
  };
  type: string;
}
export const recipeSlice = createSlice({
  name: "Admin Recipe Data",
  initialState: [] as Recipe[],
  reducers: {
    setRecipes(state, action: SetRecipesActionPayload) {
      return action.payload;
    },

    setPublish(state, action: SetPublishActionPayload) {
      const idx = state.findIndex(r => r.recipe_id === action.payload.id);
      if(idx < 0) return state;
      state[idx].is_published = action.payload.publish;
      console.log(state);
    }
  }
});

export const {setRecipes, setPublish} = recipeSlice.actions;
export default recipeSlice.reducer;