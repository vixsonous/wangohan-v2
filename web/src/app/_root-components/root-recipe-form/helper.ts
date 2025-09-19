
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {AxiosError, AxiosResponse} from "axios";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {useMutation} from "@tanstack/react-query";
import heic2any from "heic2any";
import {RecipeDisplaySchema, RecipeSchema} from "@/types/recipe-types";
import {FileSchema} from "@/types/file-types";
import {ENDPOINTS} from "@/constants/endpoints";
import {useRouter} from "next/navigation";

const MAX_FILES_LENGTH = 5;

export const useRecipeForm = (recipe_data?: z.infer<typeof RecipeSchema.UpdateRecipe>, setOpen?: Dispatch<SetStateAction<boolean>> | undefined) => {

  const router = useRouter();
  const {
    register, 
    unregister, 
    handleSubmit, 
    formState: {errors},
    reset,
    control,
    watch
  } = useForm<z.infer<typeof RecipeSchema.Recipe>>({
    mode: 'onChange', 
    resolver: zodResolver(RecipeSchema.Recipe),
    defaultValues: {
      recipe_name: recipe_data ? recipe_data.recipe_name : "",
      recipe_description: recipe_data ? recipe_data.recipe_description : "",
      recipe_ingredients: recipe_data ? recipe_data.recipe_ingredients.map( i => ({
        recipe_ingredient_id: i.recipe_ingredient_id,
        recipe_ingredients_amount: i.recipe_ingredients_amount,
        recipe_ingredients_name: i.recipe_ingredients_name,
      })) : [
        {
          recipe_ingredients_amount: "",
          recipe_ingredients_name: ""
        }
      ],
      recipe_instructions: recipe_data ? recipe_data.recipe_instructions.map( i => ({
        recipe_instructions_id: i.recipe_instructions_id,
        recipe_instructions_text: i.recipe_instructions_text
      })): [
        {
          recipe_instructions_text: ""
        }
      ],
      recipe_age_tag: "",
      recipe_size_tag: "",
      recipe_event_tag: "",
    }
  });
  const [deleteIngredientsIds, setDeleteIngredientsIds] = useState<Array<number>>([]);
  const [deleteInstructionsIds, setDeleteInstructionsIds] = useState<Array<number>>([]);
  const removeIngredients = (idx: number) => () => {
    recipe_ingredients_field.remove(idx);
    const fieldId = recipe_ingredients_field.fields[idx].recipe_ingredient_id;
    if(fieldId !== undefined) {
      setDeleteIngredientsIds(prev => [...prev, fieldId]);
    }

  }

  const removeInstructions = (idx: number) => () => {
    recipe_instructions_field.remove(idx);
    const fieldId = recipe_instructions_field.fields[idx].recipe_instructions_id;
    if(fieldId !== undefined) {
      setDeleteInstructionsIds(prev => [...prev, fieldId]);
    }

  }

  const [files, setFiles] = useState<z.infer<typeof FileSchema.FileDisplaySchema>>([]);
  const [deleteFileIds, setDeleteFileIds] = useState<Array<{delete_image_id: number, delete_image_key: string}>>([]);
  useEffect(() => {
    if(recipe_data) {
      setFiles(recipe_data.recipe_images.map(i => ({
        recipe_image_id: (i as z.infer<typeof RecipeDisplaySchema.RecipeImageDisplay>).recipe_image_id,
        preview_url: (i as z.infer<typeof RecipeDisplaySchema.RecipeImageDisplay>).recipe_image
      })));
    }
  }, [recipe_data]);

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File): Promise<File> => new Promise(async (resolve) => {
      let retFile = file;
      const fileExt = file.name.substring(file.name.lastIndexOf(".") + 1);

      if(typeof window !== undefined && (fileExt.toLowerCase() === "heic" || fileExt.toLowerCase() === "heif")) {
        const image = await heic2any({
          blob: file,
          toType: "image/webp",
          quality: 0.8,

        });

        const img = !Array.isArray(image) ? [image] : image;
        retFile = new File(img, file.name);
      }

      resolve(retFile);
    })
  })

  const fileOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const targetFiles = e.currentTarget.files;
    if(targetFiles === null) return;
    if(targetFiles.length < 0) return;

    const temp = structuredClone(files);
    for(let i = 0; i < targetFiles.length && temp.length < MAX_FILES_LENGTH; i++) {

      const file = await uploadFileMutation.mutateAsync(targetFiles[i]);

      temp.push({
        file: file,
        preview_url: URL.createObjectURL(file)
      });

      // if(typeof window !== undefined && (fileExt.toLowerCase() === "heic" || fileExt.toLowerCase() === "heif")) {
      //   const image = await heic2any({
      //     blob: targetFiles[i],
      //     toType: "image/webp",
      //     quality: 0.8
      //   });
      //
      //   const img = !Array.isArray(image) ? [image] : image;
      //   const file = new File(img, targetFiles[i].name);
      //
      // } else {
      //   temp.push({
      //     file: targetFiles[i] as File,
      //     preview_url: URL.createObjectURL(targetFiles[i])
      //   });
      // }

    }
    setFiles(structuredClone(temp));
  }
  
  const deleteFiles = (preview_url: string) => () => {

    const temp = structuredClone(files);
    const idx = temp.findIndex(f => f.preview_url === preview_url);

    if(idx < 0) return;
    const deleteId = temp[idx].recipe_image_id;
    const previewUrl = temp[idx].preview_url;
    if(deleteId !== undefined) {
      setDeleteFileIds(prev => ([...prev, {delete_image_id: deleteId, delete_image_key: previewUrl}]));
    }

    temp.splice(idx, 1);

    setFiles(structuredClone(temp));
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
    mutationFn: (data: z.infer<typeof RecipeSchema.PostRecipe>) => ClientApiService.post(ENDPOINTS.RECIPE + "/", data, {
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
      router.refresh();

      if(setOpen) {
        setOpen(false);
      }
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(error.response as AxiosResponse);
      console.log(message);
      toast.error("There was an error posting recipe!", {
        description: message
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: z.infer<typeof RecipeSchema.UpdateRecipe>) => ClientApiService.put(ENDPOINTS.RECIPE + "/", data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    onSuccess: (data: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(data);

      toast.success("Recipe updated successfully!", {
        description: message
      });

      reset();
      router.refresh();

    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(error.response as AxiosResponse);
      console.log(message);
      toast.error("There was an error updating recipe!", {
        description: message
      });
    }
  });

  const onSubmit = async (data: FieldValues) => {

    const parseResult = RecipeSchema.Recipe.safeParse(data);

    if(!parseResult.success) {
      toast.error("Error", {
        description: parseResult.error.issues[0].message
      });
      return;
    }

    const filesParseResult = FileSchema.FileDisplaySchema.safeParse(files);
    if(!filesParseResult.success) {
      toast.error("Error", {
        description: filesParseResult.error.issues[0].message
      });
      return;
    }

    const submitData = {
      ...data,
      recipe_id: data.recipe_id,
      recipe_age_tag: data.checkbox_age.filter((a: string | undefined | boolean) => a !== undefined && a !== 'false').join(",") || "",
      recipe_size_tag: data.checkbox_size.filter((s: string | undefined | boolean) => s !== undefined && s !== 'false').join(",") || "",
      recipe_event_tag: data.checkbox_event.filter((e: string | undefined | boolean) => e !== undefined && e !== 'false').join(",") || "",
      recipe_images: files.map(f => f.file || new File([new Blob([''])], f.preview_url)),
      delete_image_ids: [...deleteFileIds],
      delete_recipe_instruction_ids: [...deleteInstructionsIds],
      delete_recipe_ingredient_ids: [...deleteIngredientsIds],
    }
    let submitParseResult;
    if(recipe_data) {
      submitParseResult = RecipeSchema.UpdateRecipe.safeParse(submitData);
    } else {
      submitParseResult = RecipeSchema.PostRecipe.safeParse(submitData);
    }

    if(!submitParseResult.success) {
      toast.error("Error", {
        description: submitParseResult.error.issues[0].message
      });
      return;
    }

    if(recipe_data) {
      updateMutation.mutate(submitParseResult.data as z.infer<typeof RecipeSchema.UpdateRecipe>);
    } else {
      submitMutation.mutate(submitParseResult.data as z.infer<typeof RecipeSchema.PostRecipe>);
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
    watch,
    submitMutation,
    removeIngredients,
    removeInstructions,
    uploadFileMutation
  }
}