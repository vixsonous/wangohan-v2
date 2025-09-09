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

export class BlogControllerSchema {
  static GetBlogs = z.object({
    page_no: z.number("Provide a valid page number!"),
    category: z.string().optional()
  })
}

export class GetBlogSchema {
  static GetBlogList = z.object({
    blogs: BlogSchema.BlogList,
    total_blogs: z.number()
  })
}