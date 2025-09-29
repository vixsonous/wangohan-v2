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

type DeleteCommentActionPayload = {
  payload: {
    recipe_id: number;
    recipe_comment_id: number;
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

    setPublishRecipe(state, action: SetPublishRecipeActionPayload) {
      const idx = state.findIndex(r => r.recipe_id === action.payload.id);
      if(idx < 0) return state;
      state[idx].is_published = action.payload.publish;
    },

    deleteRecipe(state, action: DeleteRecipeActionPayload) {
      const idx = state.findIndex(r => r.recipe_id === action.payload);
      if(idx < 0) return state;
      state.splice(idx, 1);
    },

    deleteComment(state, action: DeleteCommentActionPayload) {
      const recipeIdx = state.findIndex( r => r.recipe_id === action.payload.recipe_id);
      if(recipeIdx < 0) return state;

      const commentIdx = state[recipeIdx].recipe_comments.findIndex(c => c.recipe_comment_id === action.payload.recipe_comment_id);

      if(commentIdx < 0) return state;

      state[recipeIdx].recipe_comments.splice(commentIdx, 1);
    }
  }
});

export const {setRecipes, setPublishRecipe, deleteRecipe, deleteComment} = recipeSlice.actions;
export default recipeSlice.reducer;