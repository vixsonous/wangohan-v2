"use client";

import dynamic from "next/dynamic";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import z from "zod";
import {GetBlogImagesSchema} from "@/types/blog-types";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import {UserSchema} from "@/types/user-types.user";

const CreateEditor = dynamic(() => import("./create-editor"), {ssr: false, loading: () => <span>Loading</span>});

type CreateEditorWrapperProps = {
  blog_images: z.infer<typeof GetBlogImagesSchema.GetBlogImages>;
  user_data: z.infer<typeof UserSchema.User>;
}
export default function CreateEditorWrapper({blog_images, user_data}: CreateEditorWrapperProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <CreateEditor blog_images={blog_images} user_data={user_data} />
      </Provider>
    </QueryClientProvider>
  )
}