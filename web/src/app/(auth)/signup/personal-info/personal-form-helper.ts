import {useMutation} from "@tanstack/react-query";
import {FieldValues, useForm} from "react-hook-form";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import heic2any from "heic2any";
import {UserDetailSchema} from "@/types/user-types.user-detail";
import {UserSchema} from "@/types/user-types.user";
import {useRouter} from "next/navigation";
import {AxiosError} from "axios";
import React from "react";
import {ENDPOINTS} from "@/constants/endpoints";
import {FileUtils} from "@/lib/utils";

export const usePersonalForm = (is_edit?: boolean, user_details?: z.infer<typeof UserSchema.User>, setOpen?: React.Dispatch<React.SetStateAction<boolean>> | undefined) => {

  const router = useRouter();
  const signupInfoMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post(ENDPOINTS.USER + "/me", {
      ...data,
      updated_at: new Date().toLocaleString(),
      created_at: new Date().toLocaleString(),
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true
    }),
    onSuccess: (data) => {
      const dt = ClientApiResponseService.getAxiosResponseData<z.infer<typeof UserSchema.UserDisplay>>(data);
      toast.success("Successful!", {
        description: ClientApiResponseService.getAxiosResponseMessage(data)
      });
      if(setOpen) setOpen(false);
      router.push("/user/" + dt?.user_id + "/" + dt?.user_codename);
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  const updateInfoMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.put(ENDPOINTS.USER + "/me", {
      ...data,
      updated_at: new Date().toLocaleString(),
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true
    }),
    onSuccess: (data) => {
      const dt = ClientApiResponseService.getAxiosResponseData<z.infer<typeof UserSchema.UserDisplay>>(data);

      toast.success("Successful!", {
        description: ClientApiResponseService.getAxiosResponseMessage(data)
      });
      if(setOpen) setOpen(false);
      router.replace("/user/" + dt?.user_id + "/" + dt?.user_codename);
      router.refresh();
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file:File) => FileUtils.clientUpload(file)
  })

  const onSubmit = (data: FieldValues) => is_edit ? updateInfoMutation.mutate({...data}) : signupInfoMutation.mutate({...data});

  const {register, handleSubmit, control, formState: {errors}} = useForm<z.infer<typeof UserDetailSchema.PostUserDetails | typeof  UserDetailSchema.UpdateUserDetails>>({
    mode: "onBlur",
    resolver: zodResolver(is_edit ? UserDetailSchema.UpdateUserDetails : UserDetailSchema.PostUserDetails),
    defaultValues: user_details ? {
      user_id: user_details.user_id,
      user_codename: user_details.user_details?.user_codename,
      user_image: undefined,
      user_gender: user_details.user_details?.user_gender,
      user_birthdate: user_details.user_details?.user_birthdate,
      user_agreement: 1,
      user_occupation: user_details.user_details?.user_occupation,
      user_last_name: user_details.user_details?.user_last_name,
      user_first_name: user_details.user_details?.user_first_name,
    } : undefined,
  });

  return {
    signupInfoMutation,
    updateInfoMutation,
    register,
    errors,
    control,
    handleSubmit,
    onSubmit,
    uploadFileMutation,
  }
}