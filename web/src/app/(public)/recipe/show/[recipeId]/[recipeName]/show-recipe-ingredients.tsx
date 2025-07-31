import { RecipeIngredient } from "@/server-actions/Recipe/recipe-types";

interface ShowRecipeIngredientsProps {
  recipe_ingredients: Array<RecipeIngredient>;
}

export default async function ShowRecipeIngredients({recipe_ingredients}: ShowRecipeIngredientsProps) {
  return (
    <section className="recipe-ingredients flex flex-col gap-2.5 text-primary-text">
      <h1 className="text-xl font-semibold">
        材料
      </h1>
      <ul className={`flex flex-wrap w-full ${recipe_ingredients.length > 5 ? "flex-row": "flex-col"}`}>
        {recipe_ingredients.map( (i, idx) => {
          return (
            <li key={idx} className={`${recipe_ingredients.length > 5 ? 'basis-1/2': 'basis-1'} whitespace-pre-line text-left`}>
              {i.recipe_ingredients_name} {i.recipe_ingredients_amount}
            </li>
          )
        })}
      </ul>
    </section>
  )
}