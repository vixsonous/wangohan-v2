import {BlogRepository} from "@/server/Blog/blog-repository";

export class BlogService {
  static async getBlogs(page_no: number, category?: string | undefined) {
    return await BlogRepository.getBlogs(page_no, category);
  }
}