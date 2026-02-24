import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PetSchema} from "@/types/pet-types.pet";
import {useMutation} from "@tanstack/react-query";
import heic2any from "heic2any";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {ENDPOINTS} from "@/constants/endpoints";
import {PetProps} from "@/app/(user)/user/[userId]/[userName]/components/user-pet/user-pets-carousel";
import {DateUtils, FileUtils} from "@/lib/utils";
import {Dispatch, SetStateAction} from "react";

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

export const usePetForm = ({pet, setOpen, setPets}: {pet?: PetProps | undefined, setOpen: Dispatch<SetStateAction<boolean>>, setPets: Dispatch<SetStateAction<Array<PetProps>>>}) => {

  const postPetMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post(ENDPOINTS.PET, ...getRequestInfo(data)),
    onSuccess: (data) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(data);
      toast.success("Successful!", {description: message});
      setOpen(false);
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
      setOpen(false);
    }
  });

  const putPetMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.put(ENDPOINTS.PET + "/" + (pet?.pet_id || -1), ...getRequestInfo(data)),
    onSuccess: (data) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(data);
      const updatedPet: PetProps = ClientApiResponseService.getAxiosResponseData(data);
      toast.success("Successful!", {description: message});
      setOpen(false);
      setPets(prev => {
        const temp = [...prev];
        const petIdx = temp.findIndex(pet => pet.pet_id === updatedPet.pet_id);
        if(petIdx < 0) return prev;
        temp[petIdx] = updatedPet;
        return [...temp];
      })
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
      setOpen(false);
    }
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File): Promise<File> => FileUtils.clientUpload(file)
  })

  const petForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(PetSchema.PetFormValues),
    defaultValues: {
      user_id: pet?.user_id,
      pet_birthdate: DateUtils.getFormattedDate(pet?.pet_birthdate ? new Date(pet.pet_birthdate) : undefined),
      pet_breed: pet?.pet_breed,
      pet_name: pet?.pet_name,
      pet_image: pet ? new File([], pet.pet_image) : undefined
    }
  });

  const postPetOnSubmit = (data: FieldValues) => postPetMutation.mutateAsync(data);
  const putPetOnSubmit = (data: FieldValues) => putPetMutation.mutateAsync(data);

  return {
    petForm,
    postPetOnSubmit,
    putPetOnSubmit,
    putPetMutation,
    uploadFileMutation,
    postPetMutation
  }
}