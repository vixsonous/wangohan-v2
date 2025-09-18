import EditorWrapper from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-wrapper";
import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import z from "zod";
import {GetBlogImagesSchema} from "@/types/blog-types";
import {isAuthenticated} from "@/server-actions/User/user";
import LoginRequired from "@/app/(error)/log-in-required";
import {ENDPOINTS} from "@/constants/endpoints";


export default async function CreateBlog() {
  const blogImagesResponse = await ServerApiService.get(ENDPOINTS.BLOG + "/images?page_no=1");

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
      <EditorWrapper blog_images={blogImages} user_data={userData} />
    </div>
  )
}