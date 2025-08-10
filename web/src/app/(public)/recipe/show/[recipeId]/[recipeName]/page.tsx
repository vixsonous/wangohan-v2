import ShowRecipeCarousel from "./show-recipe-carousel";
import ShowRecipeTags from "./show-recipe-tags";
import ShowRecipeIngredients from "./show-recipe-ingredients";
import ShowRecipeInstructions from "./show-recipe-instructions";
import ShowRecipeCommentsHeader from "./show-recipe-comments-header";
import ShowRecipeComments from "./show-recipe-comments";
import { Metadata } from "next";
import { getRecipe } from "@/server-actions/Recipe/recipe";
import z from "zod";
import {RecipeDisplaySchema} from "@/types/recipe-types";

type Props = {
  params: Promise<{ recipeId: string, recipeName: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const id = (await params).recipeId;
  const name = (await params).recipeName;
  console.log(id, name);
  return {
    title: "クリスマス3色あんかけ",
    keywords: ["愛犬のための手作りごはんレシピサイト",
      "わんごはん",
      "犬用手作りごはん",
      "wangohan",
      "homemade dog food",
      "healthy pet food",
      "dog recipe ideas",
      "ペットレシピサイト"],
    creator: "Victor Chiong",
    description: "わんちゃん専用投稿型レシピサイト。レシピ投稿や検索はもちろん、愛犬登録や誕生日月アナウンスなど盛りだくさん！皆さんの『わんごはん』レシピを投稿してみませんか？",
    openGraph: {
      title: 'わんごはん - 愛犬のための手作りごはんレシピサイト',
      description: 'わんちゃん専用投稿型レシピサイト。レシピ投稿や検索はもちろん、愛犬登録や誕生日月アナウンスなど盛りだくさん！皆さんの『わんごはん』レシピを投稿してみませんか？',
      url: 'https://wangohanjp.com', // Your website URL
      type: 'website',
      images: [
          { url: 'https://wangohanjp.com/logo-final.webp', width: 500, height: 500, alt: 'わんごはん' }
      ]
    },
    robots: {
      index:true,
      follow: true,
      nocache: false,
    },
    
  }
}

export default async function ShowRecipe({params}: Props) {
  const {recipeId, recipeName} = await params;

  const recipe = await getRecipe(Number(recipeId), recipeName, false) as z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplay>;

  if(recipe === undefined) {
    return (
      <h1>
        Recipe not found
      </h1>
    )
  }

  return (
    <section className="flex max-w-3xl flex-col text-primary-text items-center w-full mt-10 gap-2">
      <ShowRecipeCarousel recipe_images={recipe.recipe_images} recipe_id={recipe.recipe_id} recipe_name={recipe.recipe_name} />
      <ShowRecipeTags {...recipe}/>
      <section className="flex w-full flex-col p-5 gap-7">
        <header className="flex flex-col gap-7">
          <h1 className="text-2xl font-semibold max-w-max">{recipe.recipe_name}</h1>
          <p className="leading-snug whitespace-pre-line">
            {recipe.recipe_description}
          </p>
        </header>
        <ShowRecipeIngredients recipe_ingredients={recipe.recipe_ingredients}/>
        <ShowRecipeInstructions recipe_instructions={recipe.recipe_instructions}/>
        <ShowRecipeCommentsHeader avgRating={4.5} totalRating={10} recipe_id={recipe.recipe_id} user={recipe.user}/>
        <ShowRecipeComments comments={recipe.recipe_comments} total_comments={15}/>
      </section>
    </section>
  )
}