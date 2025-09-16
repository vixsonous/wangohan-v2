import CreateEditorWrapper from "@/app/(protected-user)/columns/create/components/create-editor-wrapper";
import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import z from "zod";
import {GetBlogImagesSchema} from "@/types/blog-types";
import {isAuthenticated} from "@/server-actions/User/user";
import LoginRequired from "@/app/(error)/log-in-required";


export default async function CreateBlog() {
  const blogImagesResponse = await ServerApiService.get("/get-blog-images?page_no=1");

  if(!blogImagesResponse.ok) {
    return (
      <h1>Error</h1>
    )
  }
  const blogImages = await ServerApiResponseService.getResponseData<z.infer<typeof GetBlogImagesSchema.GetBlogImages>>(blogImagesResponse);

  const userData = await isAuthenticated();

  if(!userData) {
    return <LoginRequired />
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <CreateEditorWrapper blog_images={blogImages} user_data={userData} />
    </div>
  )
}