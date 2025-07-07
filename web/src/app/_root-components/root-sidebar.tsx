import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SidebarMenu from "./root-sidebar-menu";
import Button from "@/components/Button";
import Image from "@/components/Image/server";

export default function RootSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer">
        <Image preload noprocess src={"/icons/svg/primary-list.svg"} alt="an icon for opening the side menu"/>
      </SheetTrigger>
      <SheetContent side="right" className="px-8 w-[300px]">
        <SheetTitle className="mt-8">
          <Button className={`w-full rounded-md text-base relative active:scale-[1.075] md:hover:scale-[1.075] transition-all duration-250`}>
            <p className="absolute text-primary-text z-1 w-full top-1/2 left-0 font-bold">レシピを作成する</p>
            <Image src={'/icons/btn/recipe-button.webp'}
              preload
              className="self-center rounded-md h-auto w-full relative top-0" 
              width={234} 
              alt="wangohan website logo" 
            />
          </Button>
        </SheetTitle>
        <SheetDescription>
          description
        </SheetDescription>
        <SidebarMenu />
      </SheetContent>
    </Sheet>
  )
}