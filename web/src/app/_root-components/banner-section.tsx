import BannerCarousel from "./banner-carousel";
import BannerCategories from "./banner-categories";
import z from "zod";
import {RecipeDisplaySchema} from "@/types/recipe-types";

export default function BannerSection({recipes}: {recipes: Array<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>>}) {
  return (
    <section className="lg:my-4 grid grid-cols-1 w-full lg:grid-cols-5 items-start gap-4">
      <BannerCarousel recipes={recipes} />
      <BannerCategories />
    </section>
  )
}