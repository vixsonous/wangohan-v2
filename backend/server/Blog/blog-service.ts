import {BlogRepository} from "@/server/Blog/blog-repository";
import {BlogSchema} from "@/server/Blog/blog-types";
import z from "zod";

export class BlogService {
  static async getBlogs(page_no: number, category?: string | undefined) {
    return await BlogRepository.getBlogs(page_no, category);
  }

  static async getBlog(blog_id: number, blog_title: string) {
    return await BlogRepository.getBlog(blog_id, blog_title);
  }

  static async postBlog(blog: z.infer<typeof BlogSchema.PostBlog>, publish: boolean, user_id: number) {
    return await BlogRepository.postBlog(blog, publish, user_id);
  }

  static async getBlogImages(page_no: number) {
    return await BlogRepository.getBlogImages(page_no);
  }

  static async postBlogImage(blog_image: Express.Multer.File, blog_image_title: string) {
    return BlogRepository.postBlogImage(blog_image, blog_image_title);
  }

  static async putBlog(blog: z.infer<typeof BlogSchema.PutBlog>, blog_id: number) {
    return BlogRepository.putBlog(blog, blog_id);
  }

  static async getRelatedBlogs(blog_category: string) {
    return BlogRepository.getRelatedBlogs(blog_category);
  }
}