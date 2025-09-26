import z from "zod";

export class BlogSchema {
  static Blog = z.object({
    blog_id: z.number(),
    user_id: z.number(),
    title: z.string(),
    editor_state: z.string(),
    is_deleted: z.boolean(),
    is_published: z.boolean(),
    blog_image: z.string(),
    blog_category: z.string(),
    updated_at: z.date()
  });

  static BlogList = z.array(BlogSchema.Blog);

  static PostBlog = z.object({
    title: z.string().min(1, "Please provide the blog title!"),
    category: z.string().min(1, "Please provide a valid blog category!"),
    editor_state: z.string().min(1, "Please provide the blog content!"),
    file: z.string().min(1, "Please provide the blog image!")
  });

  static PutBlog = z.object({
    blog_id: z.number("Please provide the blog id!"),
    title: z.string().min(1, "Please provide the blog title!"),
    category: z.string().min(1, "Please provide a valid blog category!"),
    editor_state: z.string().min(1, "Please provide the blog content!"),
    file: z.string().min(1, "Please provide the blog image!"),
    is_published: z.boolean()
  })
}

export class BlogControllerSchema {
  static GetBlogs = z.object({
    page_no: z.number("Provide a valid page number!"),
    category: z.string().optional()
  });

  static GetBlog = z.object({
    blog_id: z.number("Please provide a valid blog id!"),
    blog_title: z.string("Please provide a valid blog title!"),
  });

  static GetBlogImages = z.number("Please provide a valid page number!");

  static PutBlog = z.object({
    blog_id: z.number("Please provide a valid blog id!"),
  })
}

export class GetBlogSchema {
  static GetBlogList = z.object({
    blogs: BlogSchema.BlogList,
    total_blogs: z.number()
  })
}

export class GetBlogImagesSchema {
  static BlogImage = z.object({
    blog_image_title: z.string(),
    blog_image_url: z.string()
  });

  static BlogImages = z.array(GetBlogImagesSchema.BlogImage);

  static GetBlogImages = z.object({
    blog_images: GetBlogImagesSchema.BlogImages,
    total_blog_images: z.number()
  })
}

export class PostBlogImageSchema {
  static PostBlogImage = z.object({
    blog_image_title: z.string("Please provide the title text of the image!"),
    blog_image: z.custom<Express.Multer.File>().nonoptional(),
  })
}

export class AdminBlogSchema {
  static Blog = z.object({
    blog_id: z.number(),
    title: z.string(),
    is_published: z.boolean(),
  })
}