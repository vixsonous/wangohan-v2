import Image from "@/components/Image/server";
import EditRecipeForm from "./edit-recipe-form";

export default async function EditRecipe() {
  return (
    <section suppressHydrationWarning className="max-w-3xl flex flex-col items-center">
      <header className="flex justify-center items-center relative mt-[10px] mb-[30px]">
        <h1 className="absolute z-10 top-1/2 -translate-y-1/4 font-semibold text-primary-text text-[2em] mb-10">レシピを書く</h1>
        <Image src={'/icons/btn/recipe-button.webp'}
          preload
          className="self-center rounded-md h-auto w-[300px] relative top-0" 
          width={300} 
          alt="create recipe button" 
        />
      </header>
      <EditRecipeForm />
    </section>
  )
}