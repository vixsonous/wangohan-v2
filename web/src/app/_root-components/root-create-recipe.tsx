import Image from "@/components/Image/server";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CreateRecipeForm from "./root-create-recipe-form";

export async function CreateRecipe() {
  return (
    <Sheet >
      <SheetTrigger className={`cursor-pointer w-full rounded-md text-base relative active:scale-[1.075] md:hover:scale-[1.075] transition-all duration-250`}>
        <p className="absolute text-primary-text z-1 w-full top-1/2 left-0 font-bold">レシピを作成する</p>
        <Image src={'/icons/btn/recipe-button.webp'}
          preload
          className="self-center rounded-md h-auto w-full relative top-0" 
          width={234} 
          alt="create recipe button" 
        />
      </SheetTrigger>
      <SheetContent style={{maxWidth: '100vw'}} side="left" className="w-screen max-w-screen">
        <section className="p-5 flex flex-col items-center">
          <header className="flex justify-center items-center relative mt-14 mb-28">
            <SheetTitle className="absolute top-[55px] font-semibold text-primary-text text-[2em]">レシピを書く</SheetTitle>
            <Image src={'/icons/btn/recipe-button.webp'} loading="lazy" className="max-w-none" width={300}  alt="ribbon" />
          </header>
          <CreateRecipeForm />
          <SheetDescription >
            This is the create recipe
          </SheetDescription>
        </section>
      </SheetContent>
    </Sheet>
  )
}