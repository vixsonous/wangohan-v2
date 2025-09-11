import z from "zod";

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
    title: z.string(),
    category: z.string(),
    editor_state: z.string(),
    file: z.file()
  })
}

export class BlogImageSchema {
  static BlogImage = z.object({
    blog_image_title: z.string(),
    blog_image_url: z.string()
  })
}