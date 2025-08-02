
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const MAX_FILES_LENGTH = 5;

const FileDisplaySchema = z.array(z.object({
  file: z.file().min(1, "Please upload some pictures"),
  preview_url: z.string().min(1, "Please provide preview url")
}))

const RecipeIngredientSchema = z.object({
  recipe_ingredient: z.string().min(1, "Please input recipe ingredient"),
  recipe_amount: z.string().min(1, "Please input recipe amount"),
});

const RecipeInstructionSchema = z.object({
  recipe_instruction: z.string().min(1, "Please input recipe instructions")
});

export const RecipeSchema = z.object({
  recipe_title: z.string().min(1, "タイトルを入力してください").max(25, "文字オーバーしています"),
  recipe_description: z.string().min(1, "内容を入力してください"),
  recipe_instructions: z.array(RecipeInstructionSchema).min(1, "Please input recipe instructions!"),
  recipe_ingredients: z.array(RecipeIngredientSchema).min(1, "Please input recipe ingredients!"),
  checkbox_age: z.array(z.string().or(z.boolean()).optional()).optional(),
  checkbox_size: z.array(z.string().or(z.boolean()).optional()).optional(),
  checkbox_event: z.array(z.string().or(z.boolean()).optional()).optional()
});

export const useCreateRecipeForm = () => {
  
  const {
    register, 
    unregister, 
    handleSubmit, 
    formState: {errors},
    control,
    watch
  } = useForm<z.infer<typeof RecipeSchema>>({
    mode: 'onChange', 
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      recipe_title: "",
      recipe_description: "",
      recipe_ingredients: [
        {
          recipe_amount: "",
          recipe_ingredient: ""
        }
      ],
      recipe_instructions: [
        {
          recipe_instruction: ""
        }
      ]
    }
  });

  const [files, setFiles] = useState<z.infer<typeof FileDisplaySchema>>([]);

  const fileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.currentTarget.files;
    if(files === null) return;
    if(files.length < 0) return;
    setFiles( prev => {
      const temp = structuredClone(prev);
      for(let i = 0; i < files.length && temp.length < MAX_FILES_LENGTH; i++) {
        temp.push({
          file: files[i],
          preview_url: URL.createObjectURL(files[i])
        });
      }

      return structuredClone(temp);
    })
  }
  
  const deleteFiles = (preview_url: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setFiles(prev => {
      const temp = structuredClone(prev);
      const idx = temp.findIndex(f => f.preview_url === preview_url);

      if(idx < 0) return prev;

      temp.splice(idx, 1);
      
      return structuredClone(temp);
    });

    
    
  }

  const recipe_ingredients_field = useFieldArray({
    control,
    name: "recipe_ingredients"
  });

  const recipe_instructions_field = useFieldArray({
    control,
    name: "recipe_instructions"
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);

    const parseResult = RecipeSchema.safeParse(data);
    console.log(parseResult);
    if(parseResult.success === false) {
      toast.error("Error", {
        description: parseResult.error.issues[0].message
      })
    }

    const filesParseResult = FileDisplaySchema.safeParse(files);

    if(filesParseResult.success === false) {
      toast.error("Error", {
        description: filesParseResult.error.issues[0].message
      })
    }
  }

  return {
    onSubmit,
    fileOnChange,
    files,
    register,
    unregister,
    handleSubmit,
    errors,
    recipe_ingredients_field,
    recipe_instructions_field,
    control,
    deleteFiles,
    watch
  }
}