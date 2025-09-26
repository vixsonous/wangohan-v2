"use client";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import CreateRecipeForm from "@/app/_root-components/root-recipe-form/root-recipe-form";
import {Dispatch, SetStateAction} from "react";

export default function RecipeFormWrapper({setOpen}: {setOpen?: Dispatch<SetStateAction<boolean>>}) {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateRecipeForm setOpen={setOpen}/>
    </QueryClientProvider>
  )
}