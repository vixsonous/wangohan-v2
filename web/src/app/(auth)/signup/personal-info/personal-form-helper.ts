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

export const usePersonalForm = () => {

  const router = useRouter();
  const signupInfoMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post("/personal-info", data, {
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

  const onSubmit = (data: FieldValues) => {
    signupInfoMutation.mutate({...data});
  }



  const {register, handleSubmit, control, formState: {errors}} = useForm<z.infer<typeof UserDetailSchema.PostUserDetails>>({
    mode: "onBlur",
    resolver: zodResolver(UserDetailSchema.PostUserDetails)
  });

  return {
    signupInfoMutation,
    register,
    errors,
    control,
    handleSubmit,
    onSubmit,
    uploadFileMutation,
  }
}