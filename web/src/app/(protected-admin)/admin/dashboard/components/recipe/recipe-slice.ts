import {createSlice} from "@reduxjs/toolkit";
import {Recipe} from "@/app/(protected-admin)/admin/dashboard/components/generic-data-table";

type SetRecipesActionPayload = {
  payload: Recipe[];
  type: string;
}

type SetPublishRecipeActionPayload = {
  payload: {
    id: number;
    publish: boolean;
  };
  type: string;
}

type DeleteRecipeActionPayload = {
  payload: number;
  type: string;
}
export const recipeSlice = createSlice({
  name: "Admin Recipe Data",
  initialState: [] as Recipe[],
  reducers: {
    setRecipes(state, action: SetRecipesActionPayload) {
      return action.payload;
    },

    setPublishRecipe(state, action: SetPublishRecipeActionPayload) {
      const idx = state.findIndex(r => r.recipe_id === action.payload.id);
      if(idx < 0) return state;
      state[idx].is_published = action.payload.publish;
    },

    deleteRecipe(state, action: DeleteRecipeActionPayload) {
      const idx = state.findIndex(r => r.recipe_id === action.payload);
      if(idx < 0) return state;
      state.splice(idx, 1);
    }
  }
});

export const {setRecipes, setPublishRecipe, deleteRecipe} = recipeSlice.actions;
export default recipeSlice.reducer;