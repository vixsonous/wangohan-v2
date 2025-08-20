import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PetSchema} from "@/types/pet-types.pet";
import {useMutation} from "@tanstack/react-query";
import heic2any from "heic2any";

export const useAddPet = () => {

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
    console.log(data);
  }

  return {
    petForm,
    onSubmit,
    uploadFileMutation
  }
}