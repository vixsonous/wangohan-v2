import { configureStore } from "@reduxjs/toolkit";
import CommentsReducer from "@/app/(public)/recipe/show/[recipeId]/[recipeName]/components/comments-slice";
import NotificationReducer from "@/app/_root-components/(root-header)/notifications-slice";
import EditorStateReducer from "@/app/(protected-user)/columns/create/components/create-editor-slice";
import UserReducer from "./slice/user-slice";
export const store = configureStore({
  reducer: {
    comments: CommentsReducer,
    notifications: NotificationReducer,
    editorState: EditorStateReducer,
    user: UserReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;