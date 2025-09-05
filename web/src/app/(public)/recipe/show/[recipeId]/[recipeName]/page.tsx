import ShowRecipeCarousel from "./components/show-recipe-carousel";
import ShowRecipeTags from "./components/show-recipe-tags";
import ShowRecipeIngredients from "./components/show-recipe-ingredients";
import ShowRecipeInstructions from "./components/show-recipe-instructions";
import ShowRecipeCommentsHeader from "./components/show-recipe-comments-header";
import { Metadata } from "next";
import { getRecipe } from "@/server-actions/Recipe/recipe";
import z from "zod";
import {RecipeDisplaySchema} from "@/types/recipe-types";
import {isAuthenticated} from "@/server-actions/User/user";
import ViewCounter from "@/components/ViewCounter";
import ShowRecipeCommentFormWrapper
  from "@/app/(public)/recipe/show/[recipeId]/[recipeName]/components/show-recipe-comments-form";

type Props = {
  params: Promise<{ recipeId: string, recipeName: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const id = (await params).recipeId;
  const name = (await params).recipeName;

  const recipe = await getRecipe(Number(id), name, false) as z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplay>;
  return {
    title: recipe.recipe_name,
    keywords: ["愛犬のための手作りごはんレシピサイト",
      "わんごはん",
      "犬用手作りごはん",
      "wangohan",
      "homemade dog food",
      "healthy pet food",
      "dog recipe ideas",
      "ペットレシピサイト"].concat(recipe.recipe_ingredients.map( i => i.recipe_ingredients_name)),
    creator: recipe.user?.user_codename,
    description: recipe.recipe_description,
    openGraph: {
      title: recipe.recipe_name,
      description: recipe.recipe_description,
      url: 'https://wangohanjp.com', // Your website URL
      type: "article",
      images: [
          { url: recipe.recipe_images[0].recipe_image.startsWith("r2://") ?
              process.env.BASE_PUBLIC_BUCKET_URL + recipe.recipe_images[0].recipe_image.split("r2://")[1] :
              recipe.recipe_images[0].recipe_image, width: 500, height: 500, alt: recipe.recipe_images[0].recipe_image_title }
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
  const userData = await isAuthenticated();

  if(recipe === undefined) {
    return (
      <h1>
        Recipe not found
      </h1>
    )
  }

  return (
    <section className="flex max-w-3xl flex-col text-primary-text items-center w-full mt-10 gap-2">
      <ViewCounter recipe_id={recipe.recipe_id} />
      <ShowRecipeCarousel user_id={recipe.user?.user_id || -1} is_owner={userData?.user_id === recipe.user?.user_id} recipe_images={recipe.recipe_images} recipe_id={recipe.recipe_id} recipe_name={recipe.recipe_name} />
      <ShowRecipeTags
        total_likes={recipe.total_likes}
        recipe_id={recipe.recipe_id}
        recipe_size_tag={recipe.recipe_size_tag}
        recipe_event_tag={recipe.recipe_event_tag}
        recipe_age_tag={recipe.recipe_age_tag}
        user_data={userData}
        recipe_name={recipe.recipe_name}
      />
      <section className="flex w-full flex-col p-5 gap-7">
        <header className="flex flex-col gap-7">
          <h1 className="text-2xl font-semibold max-w-max">{recipe.recipe_name}</h1>
          <p className="leading-snug whitespace-pre-line">
            {recipe.recipe_description}
          </p>
        </header>
        <ShowRecipeIngredients recipe_ingredients={recipe.recipe_ingredients}/>
        <ShowRecipeInstructions recipe_instructions={recipe.recipe_instructions}/>
        <ShowRecipeCommentsHeader avgRating={recipe.recipe_rating_data?.avg_rating || 0} totalRating={recipe.recipe_rating_data?.total_rating || 0} recipe_id={recipe.recipe_id} user={recipe.user}/>
        <ShowRecipeCommentFormWrapper recipe_name={recipe.recipe_name} total_comments={Number(recipe.total_comments)} recipe_comments={recipe.recipe_comments} recipe_id={recipe.recipe_id} is_logged_in={userData !== undefined} />
      </section>
    </section>
  )
}