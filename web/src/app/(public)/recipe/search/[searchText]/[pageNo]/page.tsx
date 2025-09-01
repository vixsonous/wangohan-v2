import {Metadata} from "next";
import RecipeItem from "@/app/_root-components/recipe-item";
import Link from "next/link";
import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";
import Image from "@/components/Image/server";
import {PaginationWithLinks} from "@/app/(public)/recipe/list/[pageNo]/components/pagination-with-links";

type Props = {
  params: Promise<{
    searchText: string;
    pageNo: number;
  }>;
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const searchParams = await params;

  return {
    title: "Search " + decodeURI(searchParams.searchText)
  }
}

export default async function SearchPage({params}: Props) {

  const searchText = decodeURI((await params).searchText);
  const pageNo = Number((await params).pageNo);

  const recipeListResponse = await ServerApiService.get("/get-search-recipe-list?page_no=" + (Number(pageNo) - 1) + "&search_text=" + searchText);
  const recipeList = await ServerApiResponseService.getResponseData<z.infer<typeof RecipeSchema.SearchRecipeList>>(recipeListResponse);

  return (
    <section className="p-5 text-primary-text">
      <div className="flex justify-center items-center relative mt-[10px] mb-[30px]">
        <h1 className="absolute top-6 font-semibold text-primary-text">「{searchText}」を含むレシピ</h1>
        <Image src={'/banner/ribbon.webp'} className="h-[auto] w-[200px] sm:w-[300px] max-w-none" width={300} alt="website banner" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[10px] gap-y-[20px]">
        {
          recipeList && recipeList.recipes.length != 0 ? (
            recipeList.recipes.map( (rec, idx) => {
              return (
                <div key={idx} className="h-full">
                  <RecipeItem key={idx} recipe={rec} />
                </div>
              )
            })
          ) : (
            <span>レシピがありません。</span>
          )
        }
      </div>
      <div className="w-full relative flex justify-center">
        {recipeList.total_recipes > 0 && <PaginationWithLinks totalCount={recipeList.total_recipes} pageSize={9} page={pageNo} />}
        <Link href={`/`} className="flex gap-2 items-center absolute right-0 bottom-0">戻る</Link>
      </div>
    </section>
  )
}