import { createSlice } from "@reduxjs/toolkit";
import z from "zod";
import {RecipeDisplaySchema} from "@/types/recipe-types";

type SetCommentPayload = {
  payload: Array<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>>;
  type: string;
}

type AddCommentPayload = {
  payload: z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments> | Array<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>>;
  type: string;
}

const commentsSlice = createSlice({
  name: 'Comments',
  initialState: [] as Array<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>>,
  reducers: {
    setComments(state, action: SetCommentPayload) {
      state = action.payload;

      return state;
    },
    addComments(state, action: AddCommentPayload) {
      if(Array.isArray(action.payload)) {
        state = state.concat(action.payload);
      } else {
        state.unshift(action.payload);
      }

      return state;
    }
  }
});

export const {setComments, addComments} = commentsSlice.actions;
export default commentsSlice.reducer;