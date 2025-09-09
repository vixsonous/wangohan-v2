import {log} from "@/server/utils/log";
import {db} from "@/database/database";
import z from "zod";
import {BlogSchema, GetBlogSchema} from "@/server/Blog/blog-types";

export class BlogRepository {
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
}