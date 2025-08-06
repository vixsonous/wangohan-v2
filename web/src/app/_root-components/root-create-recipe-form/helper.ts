
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {AxiosError, AxiosResponse} from "axios";
import React, { useState } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {useMutation} from "@tanstack/react-query";
import heic2any from "heic2any";
import {FileDisplaySchema, RecipeSchema} from "@/types/recipe-types";

const MAX_FILES_LENGTH = 5;

const PostRecipeSchema = RecipeSchema.and(z.object({
  recipe_images: z.array(z.file()).min(1, "Please upload recipe images!")
}))

export const useCreateRecipeForm = () => {
  
  const {
    register, 
    unregister, 
    handleSubmit, 
    formState: {errors},
    reset,
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

  const fileOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const targetFiles = e.currentTarget.files;
    if(targetFiles === null) return;
    if(targetFiles.length < 0) return;

    const temp = structuredClone(files);
    for(let i = 0; i < targetFiles.length && temp.length < MAX_FILES_LENGTH; i++) {

      const fileExt = targetFiles[i].name.substring(targetFiles[i].name.lastIndexOf(".") + 1);

      if(fileExt.toLowerCase() === "heic" || fileExt.toLowerCase() === "heif") {
        const image = await heic2any({
          blob: targetFiles[i],
          toType: "image/webp",
          quality: 0.8
        });

        const img = !Array.isArray(image) ? [image] : image;
        const file = new File(img, targetFiles[i].name);
        temp.push({
          file: file,
          preview_url: URL.createObjectURL(targetFiles[i])
        });
      } else {
        temp.push({
          file: targetFiles[i] as File,
          preview_url: URL.createObjectURL(targetFiles[i])
        });
      }

    }
    setFiles(structuredClone(temp));
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

  const submitMutation = useMutation({
    mutationFn: (data: z.infer<typeof PostRecipeSchema>) => ClientApiService.post("/post-recipe", data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    onSuccess: (data: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(data);

      toast.success("Recipe posted successfully!", {
        description: message
      });

      reset();
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(error.response as AxiosResponse);
      console.log(message);
      toast.error("There was an error posting recipe!", {
        description: message
      });
    }
  })

  const onSubmit = async (data: FieldValues) => {
    console.log(data);

    const parseResult = RecipeSchema.safeParse(data);
    console.log(parseResult);
    if(!parseResult.success) {
      toast.error("Error", {
        description: parseResult.error.issues[0].message
      });
      return;
    }

    const filesParseResult = FileDisplaySchema.safeParse(files);

    if(!filesParseResult.success) {
      toast.error("Error", {
        description: filesParseResult.error.issues[0].message
      });
      return;
    }

    const submitData = {
      ...data,
      recipe_images: files.map(f => f.file)
    }

    const submitParseResult = PostRecipeSchema.safeParse(submitData);

    if(!submitParseResult.success) {
      toast.error("Error", {
        description: submitParseResult.error.issues[0].message
      });
      return;
    }

    submitMutation.mutate(submitParseResult.data);
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
    watch,
    submitMutation
  }
}