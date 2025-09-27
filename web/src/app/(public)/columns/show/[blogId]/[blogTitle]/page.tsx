import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import {BlogSchema} from "@/types/blog-types";
import z from "zod";
import ColumnDisplay from "@/app/(public)/columns/show/[blogId]/[blogTitle]/components/column-display";
import {ENDPOINTS} from "@/constants/endpoints";
import {RecipeDisplaySchema} from "@/types/recipe-types";
import {Metadata} from "next";

type BlogProps = {
  params: Promise<{
    blogId: string;
    blogTitle: string;
  }>
}

export async function generateMetadata({params}: BlogProps): Promise<Metadata> {
  const {blogId, blogTitle} = await params;

  const blogResponse = await ServerApiService.get(ENDPOINTS.BLOG +"/" + blogId + "/" + blogTitle);

  const blog = await ServerApiResponseService.getResponseData<z.infer<typeof BlogSchema.Blog>>(blogResponse);

  return {
    title: blog.title,
    keywords: ["愛犬のための手作りごはんレシピサイト",
      "わんごはん","dog food blog","japanese pet blog",
      "犬用手作りごはん",
      "wangohan",
      "dog food ideas",
      "pet food",
      "dog food recipes",
      "ペットレシピサイト"].concat(blog.blog_category),
    creator: blog.user?.user_codename,
    // description: recipe.recipe_description,
    openGraph: {
      title: blog.title,
      description: "Blolg",
      url: 'https://wangohanjp.com', // Your website URL
      type: "article",
      images: [
        { url: blog.blog_image.startsWith("r2://") ?
            process.env.NEXT_PUBLIC_BUCKET_URL + blog.blog_image.split("r2://")[1] :
            blog.blog_image, width: 500, height: 500, alt: blog.title }
      ]
    },
    robots: {
      index:true,
      follow: true,
      nocache: false,
    },

  }
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