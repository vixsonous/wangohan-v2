"use client";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import CreateRecipeForm from "@/app/_root-components/root-recipe-form/root-recipe-form";

export default function RecipeFormWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateRecipeForm />
    </QueryClientProvider>
  )
}