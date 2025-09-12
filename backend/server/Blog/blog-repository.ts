import {log} from "@/server/utils/log";
import {db} from "@/database/database";
import z from "zod";
import {BlogSchema, GetBlogImagesSchema, GetBlogSchema} from "@/server/Blog/blog-types";

export class BlogRepository {
  static async getBlog(blog_id: number, blog_title: string) {
    try {
      const blog: z.infer<typeof BlogSchema.Blog> = await db.selectFrom("blog_columns_table")
        .select([
          "blog_id",
          "user_id",
          "title",
          "editor_state",
          "is_deleted",
          "blog_image",
          "blog_category",
          "updated_at"
        ])
        .where(eb => eb.and({
          blog_id: blog_id,
          title: blog_title
        }))
        .executeTakeFirstOrThrow();

      log("Successfully retrieved blog!");
      return blog;
    } catch (e) {
      log(e);
      return undefined;
    }
  }
  static BLOG_LIMIT = 6;
  static async getBlogs(page_no: number, category: string = "全て"): Promise<z.infer<typeof GetBlogSchema.GetBlogList> | undefined> {
    try {
      const blogs: z.infer<typeof BlogSchema.BlogList> = await db.selectFrom("blog_columns_table")
        .select([
          "blog_id",
          "user_id",
          "title",
          "editor_state",
          "is_deleted",
          "blog_image",
          "blog_category",
          "updated_at"
        ])
        .$if(category !== "全て", q => q.where("blog_columns_table.blog_category", "=", category))
        .where("is_deleted", "=", false)
        .offset(BlogRepository.BLOG_LIMIT * page_no)
        .limit(BlogRepository.BLOG_LIMIT)
        .execute();

      const totalBlogs = await db.selectFrom("blog_columns_table")
        .select(lteb => [
          lteb.fn.coalesce(lteb.selectFrom("blog_columns_table").select(({fn}) => [
            fn.count<number>("blog_columns_table.blog_id").as("total_blogs")
          ]), lteb.val(0)).as("total_blogs")
        ]).executeTakeFirstOrThrow();

      log("Successfully retrieved blogs!");
      return {blogs, total_blogs: totalBlogs.total_blogs};
    } catch(e) {
      log(e);
      return undefined;
    }
  }

  static BLOG_IMAGE_LIMIT = 12;
  static async getBlogImages(page_no: number): Promise<z.infer<typeof GetBlogImagesSchema.GetBlogImages> | undefined> {
    try {
      const images: z.infer<typeof GetBlogImagesSchema.GetBlogImages> = await db.selectFrom("blog_images_upload")
        .select([
          "blog_image_title",
          "blog_image_url"
        ])
        .offset(BlogRepository.BLOG_IMAGE_LIMIT * page_no)
        .limit(BlogRepository.BLOG_IMAGE_LIMIT)
        .execute();

      const totalBlogImages = await db.selectFrom("blog_images_upload")
        .select(lteb => [
          lteb.fn.coalesce(lteb.selectFrom("blog_images_upload").select(({fn}) => [
            fn.count<number>("blog_images_upload.blog_image_id").as("total_blog_images")
          ]), lteb.val(0)).as("total_blog_images")
        ]).executeTakeFirstOrThrow();

      return {
        blog_images: images,
        total_blog_images: totalBlogImages.total_blog_images
      }
    } catch (e) {
      log(e);
      return undefined;
    }
  }
}