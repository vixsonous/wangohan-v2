import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PetSchema} from "@/types/pet-types.pet";
import {useMutation} from "@tanstack/react-query";
import heic2any from "heic2any";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {ENDPOINTS} from "@/constants/endpoints";
import {PetProps} from "@/app/(user)/user/[userId]/[userName]/components/user-pets-carousel";

const getRequestInfo = (data: FieldValues) => {
  const requestBody = {
    ...data,
    updated_at: new Date(),
    created_at: new Date(),
  };
  const requestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true
  };

  return [requestBody, requestConfig] as const;
}

export const usePetForm = (pet?: PetProps | undefined) => {

  const postPetMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post(ENDPOINTS.PET, ...getRequestInfo(data)),
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

  const putPetMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.put(ENDPOINTS.PET + "/" + (pet?.pet_id || -1), ...getRequestInfo(data)),
    onSuccess: (data) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(data);
      toast.success("Successful!", {description: message});
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

  const petForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(PetSchema.PetFormValues),
    defaultValues: {
      user_id: pet?.user_id,
      pet_birthdate: pet?.pet_birthdate,
      pet_breed: pet?.pet_breed,
      pet_name: pet?.pet_name,
      pet_image: pet ? new File([], pet.pet_image) : undefined
    }
  });

  const postPetOnSubmit = (data: FieldValues) => postPetMutation.mutate(data);
  const putPetOnSubmit = (data: FieldValues) => putPetMutation.mutate(data);

  return {
    petForm,
    postPetOnSubmit,
    putPetOnSubmit,
    putPetMutation,
    uploadFileMutation,
    postPetMutation
  }
}