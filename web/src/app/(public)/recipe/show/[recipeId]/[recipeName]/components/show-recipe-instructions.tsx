import z from "zod";
import {RecipeDisplaySchema} from "@/types/recipe-types";


interface ShowRecipeInstructionsProps {
  recipe_instructions: z.infer<typeof RecipeDisplaySchema.RecipeInstruction>[];
}

export default async function ShowRecipeInstructions({recipe_instructions}: ShowRecipeInstructionsProps) {
  return (
    <section className="recipe-instructions flex flex-col gap-2.5 text-primary-text">
      <h1 className="text-xl  font-semibold">
        作り方
      </h1>
      <ol className="list-decimal pl-6 flex flex-col gap-2.5">
        {recipe_instructions.map((ins, idx) => {
          return (
            <li className="whitespace-pre-line" key={idx}>
              {ins.recipe_instructions_text}
            </li>
          )
        })}
      </ol>
    </section>
  )
}