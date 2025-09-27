import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import {BlogSchema} from "@/types/blog-types";
import z from "zod";
import ColumnDisplay from "@/app/(public)/columns/show/[blogId]/[blogTitle]/components/column-display";
import {ENDPOINTS} from "@/constants/endpoints";
import {RecipeDisplaySchema} from "@/types/recipe-types";

type BlogProps = {
  params: Promise<{
    blogId: string;
    blogTitle: string;
  }>
}
export default async function Blog({params}: BlogProps) {

  const {blogId, blogTitle} = await params;

  const [blogResponse, popularRecipesResponse] = await Promise.all([
    await ServerApiService.get(ENDPOINTS.BLOG +"/" + blogId + "/" + blogTitle),
    await ServerApiService.get(ENDPOINTS.RECIPE + "/slider/popular")
  ])

  if(!blogResponse.ok) {
    return (
      <h1>There was an error!</h1>
    )
  }

  const blog = await ServerApiResponseService.getResponseData<z.infer<typeof BlogSchema.Blog>>(blogResponse);

  const relatedBlogResponse = await ServerApiService.get(ENDPOINTS.BLOG + "/related?blog_category=" + blog.blog_category);
  const relatedBlogs = await ServerApiResponseService.getResponseData<z.infer<typeof BlogSchema.BlogList>>(relatedBlogResponse);
  const popularRecipes = await ServerApiResponseService.getResponseData<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[]>(popularRecipesResponse);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": blog.title,
    "description": blog.title,
    "image": blog.blog_image || "https://wangohanjp.com/logo-v2.png",
    "author": {
      "@type": "Person",
      "name": "わんごはん公式"
    },
    "keywords": ["ブログ",
      "わんごはん",
      "犬用手作りごはん",
      "ペットレシピサイト", blog.title, blog.blog_category],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ColumnDisplay blog_data={blog} related_blogs={relatedBlogs} popular_recipes={popularRecipes} />
    </div>
  )
}