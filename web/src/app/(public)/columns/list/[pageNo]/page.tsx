import {Metadata} from "next";
import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import z from "zod";
import { GetBlogSchema} from "@/types/blog-types";
import Image from "@/components/Image/server";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {BlogItem} from "@/app/(public)/columns/list/[pageNo]/components/blog-item";
import {PaginationWithLinks} from "@/app/(public)/recipe/list/[pageNo]/components/pagination-with-links";

type Props = {
  params: Promise<{
    pageNo: string;
  }>
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}
export async function generateMetadata({params,searchParams }: Props): Promise<Metadata> {
  const {pageNo} = await params;
  const {category} = await searchParams;

  console.log(`Page No: ${pageNo} ${category}`);

  return {
    title: 'Columns ' + pageNo + (category ? ' ' + category : '')
  }
}

export default async function Columns({params, searchParams}: Props) {
  const {pageNo} = await params;
  const {category} = await searchParams;

  const response = await ServerApiService.get("/get-blogs?page_no=" + pageNo + "&category=" + category);

  if(!response.ok) {
    return (
      <h1>There was an error!</h1>
    )
  }

  const blogsResponse = await ServerApiResponseService.getResponseData<z.infer<typeof GetBlogSchema.GetBlogList>>(response);

  return (
    <section>
      <div className="flex flex-col items-center relative mt-16">
        <h1 className="w-full bottom-16 p-4 bg-white border-2 rounded-2xl border-primary-text max-w-max absolute text-2xl whitespace-pre-wrap lg:text-4xl font-bold text-primary-text">
          {`犬と「食」に関する知識や\nレシピ特集をご紹介！`}
        </h1>
        <Image
          src={"/banner/column.png"}
          className="rounded-md w-[100%] h-[100%] inline max-w-none object-fill"
          width={1280}
          height={375}
          alt="website banner"
        />
      </div>
      <ul className="py-8 flex w-full text-xs md:text-sm justify-center gap-2">
        {["全て", "レシピ特集", "基礎知識", "その他"].map((item, idx) => (
          <li key={idx}>
            <Link href={`/columns/list/${pageNo}?category=${item}`}>
              <Button className={"bg-secondary-bg rounded-full text-primary-text border-2 border-primary-text hover:bg-secondary-bg/50"}>
                <Image preload={true} width={16} height={16} src={"/icons/column/paw2.png"} alt={"category icon"}/>
                <p>{item}</p>
              </Button>
            </Link>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {blogsResponse.blogs.length > 0 ? (
          blogsResponse.blogs.map((blog, idx) => {
            return (
              <Link
                key={idx}
                href={`/columns/` + blog.blog_id}
                className="col-span-1 flex flex-col items-center justify-center"
              >
                <BlogItem blog={blog} />
              </Link>
            );
          })
        ) : (
          <div>No blogs!</div>
        )}
      </div>
      <PaginationWithLinks totalCount={blogsResponse.total_blogs} pageSize={6} page={Number(pageNo)} />
    </section>
  )
}