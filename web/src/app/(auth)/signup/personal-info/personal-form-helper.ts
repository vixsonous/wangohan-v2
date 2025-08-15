import {useMutation} from "@tanstack/react-query";
import {FieldValues, useForm} from "react-hook-form";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import z from "zod";
import {UserDetailSchema} from "@/types/user-types";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";

export const usePersonalForm = () => {

  const signupInfoMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post("/personal-info", data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }),
    onSuccess: (data) => {
      toast.success("Successful!", {
        description: ClientApiResponseService.getAxiosResponseMessage(data)
      })
    }
  });

  const onSubmit = (data: FieldValues) => {

    signupInfoMutation.mutate(data);
  }

  const {register, handleSubmit, control, formState: {errors}} = useForm<z.infer<typeof UserDetailSchema.UserDetails>>({
    mode: "onBlur",
    resolver: zodResolver(UserDetailSchema.UserDetails)
  });

  return {
    signupInfoMutation,
    register,
    errors,
    control,
    handleSubmit,
    onSubmit
  }
}