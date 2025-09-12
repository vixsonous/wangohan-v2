import z from "zod";
import {content} from "@/app/(protected-user)/columns/create/components/create-editor";

export class BlogSchema {
  static Blog = z.object({
    blog_id: z.number(),
    user_id: z.number(),
    title: z.string(),
    editor_state: z.string(),
    is_deleted: z.boolean(),
    blog_image: z.string(),
    blog_category: z.string(),
    updated_at: z.date()
  });

  static BlogList = z.array(BlogSchema.Blog);
}

export class GetBlogSchema {
  static GetBlogList = z.object({
    blogs: BlogSchema.BlogList,
    total_blogs: z.number()
  })
}

export class PostBlogSchema {
  static PostBlog = z.object({
    title: z.string().min(1, "Please provide the blog title!"),
    category: z.string("Please provide the blog category!"),
    editor_state: z.string(),
    file: z.file("Please provide the blog image!")
  }).refine(data => data.editor_state !== content, {
    message: "Please provide the content of your blog!",
    path: ["editor_state"]
  })
}

export class BlogImageSchema {
  static BlogImage = z.object({
    blog_image_title: z.string(),
    blog_image_url: z.string()
  });

  static BlogImages = z.array(BlogImageSchema.BlogImage);
}

export class GetBlogImagesSchema {

  static GetBlogImages = z.object({
    blog_images: BlogImageSchema.BlogImages,
    total_blog_images: z.number()
  })
}