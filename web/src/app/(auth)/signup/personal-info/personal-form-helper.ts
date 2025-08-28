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

export const usePersonalForm = (is_edit?: boolean, user_details?: z.infer<typeof UserSchema.User>) => {

  const router = useRouter();
  const signupInfoMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post("/personal-info", {
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
      router.push("/user/" + dt?.user_id + "/" + dt?.user_codename);
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  const updateInfoMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.put("/update-personal-info", {
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
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

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
      user_agreement: user_details.user_details?.user_agreement,
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