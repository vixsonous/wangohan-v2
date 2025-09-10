import dynamic from "next/dynamic";
import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import {BlogSchema} from "@/types/blog-types";
import z from "zod";
import ColumnDisplay from "@/app/(public)/columns/show/[blogId]/[blogTitle]/components/column-display";

type BlogProps = {
  params: Promise<{
    blogId: string;
    blogTitle: string;
  }>
}
export default async function Blog({params}: BlogProps) {

  const {blogId, blogTitle} = await params;
  const blogResponse = await ServerApiService.get("/get-blog?blog_id=" + blogId + "&blog_title=" + blogTitle);

  if(!blogResponse.ok) {
    return (
      <h1>There was an error!</h1>
    )
  }

  const blog = await ServerApiResponseService.getResponseData<z.infer<typeof BlogSchema.Blog>>(blogResponse);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: blog.title,
    description: blog.title,
    image: blog.blog_image || "",
    author: {
      "@type": "Person",
      name: blog.user_id,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ColumnDisplay blog_data={blog} related_blogs={[]} popular_recipes={[]} />
    </div>
  )
}