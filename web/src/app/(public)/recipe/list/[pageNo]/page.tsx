import {Metadata} from "next";
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";
import RecipeList from "@/app/(public)/recipe/list/[pageNo]/components/recipe-list";
import Image from "@/components/Image/server";
import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import {PaginationWithLinks} from "@/app/(public)/recipe/list/[pageNo]/components/pagination-with-links";
import {ENDPOINTS} from "@/constants/endpoints";

type Props = {
  params: Promise<{
    pageNo: string;
  }>
}
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {pageNo} = await params;
  return {
    title: "Recipe list " + pageNo
  }
}
export default async function RecipeListPage({params}: Props) {

  const p = await params;

  const recipeListResponse = await ServerApiService.get(ENDPOINTS.RECIPE + "?page_no=" + (Number(p.pageNo) - 1));
  const recipeList = await ServerApiResponseService.getResponseData<z.infer<typeof RecipeSchema.RecipeList>>(recipeListResponse);

  return (
    <div className="flex flex-col mt-[30px] gap-[30px]">
      <div className="flex flex-col justify-center items-center relative p-2 lg:p-0">
        <h1 className="absolute top-[26px] lg:top-[15px] text-[18px] font-semibold text-[#523636]">
          レシピ図鑑
        </h1>
        <Image
          src={"/banner/ribbon.webp"}
          className="h-[auto] w-[270px] sm:w-[300px] max-w-none mb-[30px]"
          width={300}
          height={122}
          alt="image list page title ribbon"
        />
        <RecipeList recipes={recipeList.recipes} />
        {recipeList.total_recipes > 20 && <PaginationWithLinks totalCount={recipeList.total_recipes} pageSize={20} page={Number(p.pageNo)} /> }
      </div>
    </div>
  )
}