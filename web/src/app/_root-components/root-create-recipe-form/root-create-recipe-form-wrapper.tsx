"use client";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import CreateRecipeForm from "@/app/_root-components/root-create-recipe-form/root-create-recipe-form";

export default function CreateRecipeFormWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateRecipeForm />
    </QueryClientProvider>
  )
}