import { RECIPE_AMOUNT, RECIPE_INGREDIENT, RECIPE_INSTRUCTION } from "@/constants/field-ids";
import { useCallback, useState } from "react";
import { FieldValues, UseFormUnregister } from "react-hook-form";
import { v4 } from "uuid";



export const useCreateRecipeForm = (unregister: UseFormUnregister<FieldValues>) => {
  
  const [recipeIngredientsCnt, setRecipeIngredientsCnt] = useState([
    {recipe_ingredient: `${RECIPE_INGREDIENT}_1` , recipe_amount: `${RECIPE_AMOUNT}_1`}
  ]);

  const [recipeInstructions, setRecipeInstructions] = useState([RECIPE_INSTRUCTION]);

  const deleteRecipeIngredients = (id: string) => (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRecipeIngredientsCnt(prev => {
      const temp = structuredClone(prev);
      const idx = temp.findIndex(v => v.recipe_ingredient === id);
      if(idx < 0) return structuredClone(temp);
      
      unregister(id.replace(RECIPE_INGREDIENT,RECIPE_AMOUNT));
      temp.splice(idx, 1);

      return structuredClone(temp);
    });
  }

  const deleteRecipeInstructions = (id: string) => (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRecipeInstructions(prev => {
      const temp = structuredClone(prev);
      const idx = temp.findIndex(i => i === id);
      if(idx < 0) return structuredClone(temp);
      temp.splice(idx, 1);
      unregister(id);
      return structuredClone(temp);
    });
  }

  const increaseRecipeIngredients = useCallback((e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = v4();
    setRecipeIngredientsCnt(prev => [...prev, {recipe_ingredient: `${RECIPE_INGREDIENT}_` + id, recipe_amount: `${RECIPE_AMOUNT}_` + id}]);
  }, []);

  const increaseRecipeInstructions = useCallback((e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRecipeInstructions(prev => [...prev, `${RECIPE_INSTRUCTION}_` + v4()]);
  }, []);

  const onSubmit = (data: FieldValues) => {
    const recipe_instructions:Array<string> = [];
    const recipe_amounts: Array<string> = [];
    const recipe_ingredients: Array<string> = [];
    Object.keys(data).forEach(k => {
      if(k.includes(RECIPE_INSTRUCTION)) recipe_instructions.push(data[k]);
      if(k.includes(RECIPE_INGREDIENT)) recipe_ingredients.push(data[k]);
      if(k.includes(RECIPE_AMOUNT)) recipe_amounts.push(data[k]);
    });

    console.log(recipe_amounts);
  }

  return {
    recipeIngredientsCnt, setRecipeIngredientsCnt,
    recipeInstructions, setRecipeInstructions,
    deleteRecipeIngredients,
    deleteRecipeInstructions,
    increaseRecipeIngredients,
    increaseRecipeInstructions,
    onSubmit
  }
}