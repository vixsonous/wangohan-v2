import EditorWrapper from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-wrapper";
import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import z from "zod";
import {BlogSchema, GetBlogImagesSchema} from "@/types/blog-types";
import {isAuthenticated} from "@/server-actions/User/user";
import LoginRequired from "@/app/(error)/log-in-required";

type EditBlogProps = {
  params: Promise<{
    blogId: string;
    blogTitle: string;
  }>
}

export default async function CreateBlog({params}: EditBlogProps) {
  const {blogId, blogTitle} = await params;

  const [blogImagesResponse, blogResponse, userData] = await Promise.all([
    ServerApiService.get("/get-blog-images?page_no=1"),
    ServerApiService.get("/get-blog?blog_id=" + blogId + "&blog_title=" + blogTitle),
    isAuthenticated()
  ]);

  if(!blogResponse.ok) {
    return (
      <h1>There was an error!</h1>
    )
  }

  if(!blogImagesResponse.ok) {
    return (
      <h1>Error</h1>
    )
  }

  if(!userData) {
    return <LoginRequired />
  }

  const [blog, blogImages] = await Promise.all([
    ServerApiResponseService.getResponseData<z.infer<typeof BlogSchema.Blog>>(blogResponse),
    ServerApiResponseService.getResponseData<z.infer<typeof GetBlogImagesSchema.GetBlogImages>>(blogImagesResponse)
  ]);

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <EditorWrapper blog_images={blogImages} user_data={userData} blog={blog} />
    </div>
  )
}