import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SidebarMenu from "./root-sidebar-menu";
import Image from "@/components/Image/server";
import { CreateRecipe } from "./root-create-recipe";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";

export default async function RootSidebar(
  {user_data}:
  {user_data: z.infer<typeof UserSchema.User> | undefined}
) {
  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer">
        <Image preload noprocess src={"/icons/svg/primary-list.svg"} alt="an icon for opening the side menu"/>
      </SheetTrigger>
      <SheetContent side="right" className="px-8 w-[300px]">
        <SheetTitle className="mt-8">
          <CreateRecipe />
        </SheetTitle>
        <SheetDescription>
          description
        </SheetDescription>
        <SidebarMenu user_data={user_data} />
      </SheetContent>
    </Sheet>
  )
}