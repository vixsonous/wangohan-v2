import {SiteHeader} from "@/components/site-header";
import {ChartAreaInteractive} from "@/components/chart-area-interactive";
import {DataTable} from "@/components/data-table";
import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import {ENDPOINTS} from "@/constants/endpoints";
import {FORBIDDEN, UNAUTHORIZED} from "@/constants/http-status";
import LoginRequired from "@/app/(error)/log-in-required";
import Forbidden from "@/app/(error)/forbidden";
import z from "zod";
import {AdminRecipeSchema} from "@/types/recipe-types";
import {AdminBlogSchema} from "@/types/blog-types";
import {AdminUserSchema} from "@/types/user-types.user";

export default async function Dashboard() {

  const recipesResponse = await ServerApiService.get(ENDPOINTS.ADMIN + "/data");

  if(recipesResponse.status === UNAUTHORIZED) {
    return <LoginRequired />
  }

  if(recipesResponse.status === FORBIDDEN) {
    return <Forbidden />
  }

  const data = await ServerApiResponseService.getResponseData<{
    recipes: z.infer<typeof AdminRecipeSchema.Recipe>[],
    blogs: z.infer<typeof AdminBlogSchema.Blog>[],
    users: z.infer<typeof AdminUserSchema.User>[],
  } | undefined>(recipesResponse);

  if(data === undefined) {
    return <Forbidden />
  }

  return (
    <div className={"w-full"}>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/*<SectionCards />*/}
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            {/*<DataTable data={data} />*/}
            <DataTable recipes={data.recipes} users={data.users} blogs={data.blogs} />
          </div>
        </div>
      </div>
    </div>
  )
}