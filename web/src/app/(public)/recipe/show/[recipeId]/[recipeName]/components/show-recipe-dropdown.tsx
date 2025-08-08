import Button from "@/components/Button";
import Image from "@/components/Image/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ShowRecipeDropdownProps {
  recipe_id: number;
  recipe_name: string;
}
export default function ShowRecipeDropdown(recipe: ShowRecipeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer border border-primary-text hover:brightness-80 transition-all duration-200 absolute flex justify-center items-center shadow-2xl top-4 right-4 h-6 w-6 bg-primary-bg rounded-full">
        <Image noprocess src={"/icons/svg/primary-three-dots.svg"} alt="icon for dropdown menu"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-secondary-bg">
        <DropdownMenuLabel className="font-bold">Recipe Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button className="w-full text-left">
            Publish
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/recipe/edit/" + recipe.recipe_id + "/" + recipe.recipe_name} className="w-full text-left">
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button className="w-full text-left">
            Delete
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}