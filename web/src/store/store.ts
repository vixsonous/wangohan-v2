import { configureStore } from "@reduxjs/toolkit";
import CommentsReducer from "@/app/(public)/recipe/show/[recipeId]/[recipeName]/components/comments-slice";
import NotificationReducer from "@/app/_root-components/(root-header)/notifications-slice";
export const store = configureStore({
  reducer: {
    comments: CommentsReducer,
    notifications: NotificationReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;