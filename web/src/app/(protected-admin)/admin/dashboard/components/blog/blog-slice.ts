import {createSlice} from "@reduxjs/toolkit";
import {Blog} from "@/app/(protected-admin)/admin/dashboard/components/generic-data-table";

type SetBlogsActionPayload = {
  payload: Blog[];
  type: string;
}

type SetPublishBlogActionPayload = {
  payload: {
    id: number,
    publish: boolean;
  },
  type: string;
}

type DeleteBlogActionPayload = {
  payload: number;
  type: string;
}

export const blogSlice = createSlice({
  name: 'Admin Blog',
  initialState: [] as Blog[],
  reducers: {
    setBlogs(state, action: SetBlogsActionPayload) {
      return action.payload;
    },

    setPublishBlog(state, action: SetPublishBlogActionPayload) {
      const idx = state.findIndex( b => b.blog_id === action.payload.id);
      if (idx < 0) return state;
      state[idx].is_published = action.payload.publish;
    },

    deleteBlog(state, action: DeleteBlogActionPayload) {
      const idx = state.findIndex(r => r.blog_id === action.payload);
      if(idx < 0) return state;
      state.splice(idx, 1);
    }
  }
});

export const {setBlogs, setPublishBlog, deleteBlog} = blogSlice.actions;
export default blogSlice.reducer;