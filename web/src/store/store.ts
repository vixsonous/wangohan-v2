import { configureStore } from "@reduxjs/toolkit";
import CommentsReducer from "@/app/(public)/recipe/show/[recipeId]/[recipeName]/components/comments-slice";
import NotificationReducer from "@/app/_root-components/(root-header)/notifications-slice";
import EditorStateReducer from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-slice";
import UserReducer from "./slice/user-slice";
import RecipeReducer from "@/app/(protected-admin)/admin/dashboard/components/recipe/recipe-slice";
import BlogReducer from "@/app/(protected-admin)/admin/dashboard/components/blog/blog-slice";
import UserAdminReducer from "@/app/(protected-admin)/admin/dashboard/components/user/user-slice";
export const store = configureStore({
  reducer: {
    comments: CommentsReducer,
    notifications: NotificationReducer,
    editorState: EditorStateReducer,
    user: UserReducer,
    recipeAdmin: RecipeReducer,
    blogsAdmin: BlogReducer,
    usersAdmin: UserAdminReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;