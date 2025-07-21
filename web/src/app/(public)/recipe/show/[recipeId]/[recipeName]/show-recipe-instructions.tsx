interface ShowRecipeInstructionsProps {
  recipe_instructions: Array<string>;
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
              {ins}
            </li>
          )
        })}
      </ol>
    </section>
  )
}