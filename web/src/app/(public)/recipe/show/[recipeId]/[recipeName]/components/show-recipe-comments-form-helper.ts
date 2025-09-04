import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RecipeDisplaySchema, RecipeSchema} from "@/types/recipe-types";
import {useMutation} from "@tanstack/react-query";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";
import {toast} from "sonner";
import z from "zod";
import {Dispatch, SetStateAction} from "react";

export const useShowRecipeCommentsForm = (setComments: Dispatch<SetStateAction<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>[]>>) => {
  const { register, handleSubmit, formState: {errors}, control, reset } = useForm({
    mode: 'onBlur',
    resolver: zodResolver(RecipeSchema.ClientPostComment)
  });

  const commentSubmitMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post("/post-comment", {
      ...data,
      created_at: new Date().toLocaleString()
    }),
    onSuccess: (response: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      toast.success("Successful!", {description: message});
      const data = ClientApiResponseService.getAxiosResponseData<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>>(response);
      setComments(prev => ([data, ...prev]));
      reset();
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  })

  const onSubmit = (data: FieldValues) => {
    commentSubmitMutation.mutate(data);
  }

  return {
    register,
    handleSubmit,
    errors,
    control,
    onSubmit,
    commentSubmitMutation
  }
}