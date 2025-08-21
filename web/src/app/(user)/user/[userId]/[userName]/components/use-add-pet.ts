import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PetSchema} from "@/types/pet-types.pet";
import {useMutation} from "@tanstack/react-query";
import heic2any from "heic2any";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {toast} from "sonner";
import {AxiosError} from "axios";

export const useAddPet = () => {

  const postPetMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post("/post-pet", data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true
    }),
    onSuccess: (data) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(data);
      toast.success("Successful!", {description: message});
    },
    onError: (error: AxiosError) => {
      console.log(error);
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

  const petForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(PetSchema.PostPet)
  });

  const onSubmit = (data: FieldValues) => {
    postPetMutation.mutate(data);
  }

  return {
    petForm,
    onSubmit,
    uploadFileMutation,
    postPetMutation
  }
}