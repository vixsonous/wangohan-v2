import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SidebarMenu from "./root-sidebar-menu";
import Button from "@/components/Button";
import Image from "@/components/Image/server";
import { CreateRecipe } from "./root-create-recipe";

export default function RootSidebar() {
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
        <SidebarMenu />
      </SheetContent>
    </Sheet>
  )
}