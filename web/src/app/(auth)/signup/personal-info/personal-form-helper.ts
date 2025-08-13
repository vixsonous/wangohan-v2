import {useMutation} from "@tanstack/react-query";
import {FieldValues, useForm} from "react-hook-form";
import {ClientApiService} from "@/lib/client-utils";
import z from "zod";
import {UserDetailSchema} from "@/types/user-types";
import {zodResolver} from "@hookform/resolvers/zod";

export const usePersonalForm = () => {

  const uploadInfoMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post("/api/personal-info", {}, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }),
    onSuccess: (data) => console.log(data)
  });

  const signupInfoMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post("/api/personal-info", {}, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }),
    onSuccess: (data) => console.log(data)
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  }

  const {register, handleSubmit, control, formState: {errors}} = useForm<z.infer<typeof UserDetailSchema.PostInfo>>({
    mode: "onBlur",
    resolver: zodResolver(UserDetailSchema.PostInfo)
  });

  return {
    uploadInfoMutation,
    signupInfoMutation,
    register,
    errors,
    control,
    handleSubmit,
    onSubmit
  }
}