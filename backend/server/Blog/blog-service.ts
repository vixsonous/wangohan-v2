import {BlogRepository} from "@/server/Blog/blog-repository";

export class BlogService {
  static async getBlogs(page_no: number, category?: string | undefined) {
    return await BlogRepository.getBlogs(page_no, category);
  }

  static async getBlog(blog_id: number, blog_title: string) {
    return await BlogRepository.getBlog(blog_id, blog_title);
  }

  static async getBlogImages(page_no: number) {
    return await BlogRepository.getBlogImages(page_no);
  }

  static async postBlogImage(blog_image: Express.Multer.File, blog_image_title: string) {
    return BlogRepository.postBlogImage(blog_image, blog_image_title);
  }
}