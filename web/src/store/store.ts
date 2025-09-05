import { configureStore } from "@reduxjs/toolkit";
import CommentsReducer from "@/app/(public)/recipe/show/[recipeId]/[recipeName]/components/comments-slice";
export const store = configureStore({
  reducer: {
    comments: CommentsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;