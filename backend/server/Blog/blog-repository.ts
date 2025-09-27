import {log} from "@/server/utils/log";
import {db} from "@/database/database";
import z from "zod";
import {BlogSchema, GetBlogImagesSchema, GetBlogSchema} from "@/server/Blog/blog-types";
import {ImageProcess, ImageService} from "@/server/Images/image-service";
import {BlogImageInsert} from "@/database/types";

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
          "is_published",
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

  static async postBlog(blog: z.infer<typeof BlogSchema.PostBlog>, publish: boolean, user_id: number): Promise<boolean | undefined> {
    try {
      await db.insertInto("blog_columns_table")
        .values({
          blog_category: blog.category,
          user_id: user_id,
          title: blog.title,
          is_deleted: false,
          is_published: publish,
          blog_image: blog.file,
          editor_state: blog.editor_state,
          updated_at: new Date(),
          created_at: new Date(),
        })
        .executeTakeFirstOrThrow();

      log("Successfully posted blog!");
      return true;
    } catch(e) {
      log(e);
      return undefined;
    }
  }

  static async putBlog(blog: z.infer<typeof BlogSchema.PutBlog>, blog_id: number): Promise<z.infer<typeof BlogSchema.Blog> | undefined> {
    try {
      const blogResult: z.infer<typeof BlogSchema.Blog> = await db.updateTable("blog_columns_table")
        .set({
          blog_id: blog.blog_id,
          title: blog.title,
          blog_image: blog.file,
          editor_state: blog.editor_state,
          is_published: blog.is_published
        })
        .returning([
          "blog_id",
          "user_id",
          "title",
          "editor_state",
          "is_deleted",
          "is_published",
          "blog_image",
          "blog_category",
          "updated_at",
        ])
        .where(eb => eb.and({
          blog_id: blog_id
        }))
        .executeTakeFirstOrThrow();

      log("Successfully updated blog!");

      return blogResult;
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
          "is_published",
          "blog_image",
          "blog_category",
          "updated_at"
        ])
        .$if(category !== "全て", q => q.where("blog_columns_table.blog_category", "=", category))
        .where(eb => eb.and({
          is_deleted: false,
          is_published: true
        }))
        .orderBy("created_at", "desc")
        .offset(BlogRepository.BLOG_LIMIT * page_no)
        .limit(BlogRepository.BLOG_LIMIT)
        .execute();

      const totalBlogs = await db.selectFrom("blog_columns_table")
        .select(lteb => [
          lteb.fn.coalesce(lteb.selectFrom("blog_columns_table").select(({fn}) => [
            fn.count<number>("blog_columns_table.blog_id").as("total_blogs")
          ]).$if(category !== "全て", q => q.where("blog_columns_table.blog_category", "=", category))
            .where(eb => eb.and({
              is_deleted: false,
              is_published: true
            })), lteb.val(0)).as("total_blogs")
        ])

        .executeTakeFirstOrThrow();

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
      const images: z.infer<typeof GetBlogImagesSchema.BlogImages> = await db.selectFrom("blog_images_upload")
        .select([
          "blog_image_title",
          "blog_image_url"
        ])
        .offset(BlogRepository.BLOG_IMAGE_LIMIT * page_no)
        .limit(BlogRepository.BLOG_IMAGE_LIMIT)
        .orderBy("created_at", "desc")
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

  static async postBlogImage(blog_image: Express.Multer.File, blog_image_title: string): Promise<z.infer<typeof GetBlogImagesSchema.BlogImage> | undefined> {
    try {
      const buffer: Buffer<ArrayBuffer> = Buffer.from(blog_image.buffer);

      let image = new ImageProcess(buffer.buffer);

      image = image.resize(1024, undefined, {
        withoutEnlargement: true,
        fit: "inside"
      });

      image = image.webp({
        quality: 80
      });

      const uploadImage = await image.result();
      const folder = `blog-uploads`;
      const uploadDone = await ImageService.uploadToR2Public(folder, uploadImage, blog_image.originalname.split(".")[0], "webp", "images/webp");

      if(uploadDone.Key === undefined) {
        return undefined;
      }

      const blogImageInsert = {
        blog_image_title: blog_image_title,
        blog_image_url: `r2://${uploadDone.Key}`,
        created_at: new Date(),
        updated_at: new Date(),
      } satisfies BlogImageInsert;

      const blogImage: z.infer<typeof GetBlogImagesSchema.BlogImage> = await db.insertInto("blog_images_upload")
        .values(blogImageInsert)
        .returning(["blog_image_title", "blog_image_url"])
        .executeTakeFirstOrThrow();

      log("Successfully posted blog image!");
      return blogImage;
    } catch(e) {
      log(e);
      return undefined;
    }
  }

  static RELATED_BLOG_LIMIT = 3;
  static async getRelatedBlogs(blog_category: string): Promise<z.infer<typeof BlogSchema.BlogList> | undefined> {
    try {

      const blogs: z.infer<typeof BlogSchema.BlogList> = await db.selectFrom("blog_columns_table")
        .select([
          "blog_id",
          "user_id",
          "title",
          "editor_state",
          "is_deleted",
          "is_published",
          "blog_image",
          "blog_category",
          "updated_at"
        ])
        .where(eb => eb.and({
          is_deleted: false,
          is_published: true,
          blog_category: blog_category
        }))
        .orderBy("created_at", "desc")
        .limit(BlogRepository.RELATED_BLOG_LIMIT)
        .execute();

      log("Successfully retrieved blogs!");
      return blogs;
    } catch(e) {
      log(e);
      return undefined;
    }
  }
}