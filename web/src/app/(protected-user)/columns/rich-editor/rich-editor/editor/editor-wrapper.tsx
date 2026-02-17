"use client";

import dynamic from "next/dynamic";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import z from "zod";
import {BlogSchema, GetBlogImagesSchema} from "@/types/blog-types";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import {UserSchema} from "@/types/user-types.user";
import Loader from "@/components/loader";

const CreateEditor = dynamic(() => import("./editor"), {ssr: false, loading: () => <Loader />});

type CreateEditorWrapperProps = {
  blog_images: z.infer<typeof GetBlogImagesSchema.GetBlogImages>;
  user_data: z.infer<typeof UserSchema.User>;
  blog?: z.infer<typeof BlogSchema.Blog> | undefined;
}
export default function EditorWrapper({blog_images, user_data, blog}: CreateEditorWrapperProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <CreateEditor blog_images={blog_images} user_data={user_data} blog={blog} />
      </Provider>
    </QueryClientProvider>
  )
}