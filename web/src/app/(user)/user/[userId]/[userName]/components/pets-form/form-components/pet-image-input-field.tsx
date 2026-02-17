import React from "react";
import {UseMutationResult} from "@tanstack/react-query";
import InputField from "@/components/Input";

type PetImageInputFieldProps = {
  uploadFileMutation:  UseMutationResult<File, Error, File, unknown>;
  onChange: (...event: any[]) => void;
}
export default function PetImageInputField ({uploadFileMutation, onChange} : PetImageInputFieldProps) {
  return (
    <span className={"hidden"}>
    <InputField onChange={
      async (e: React.ChangeEvent<HTMLInputElement>) =>
      {
        if(e.currentTarget.files === null) return;
        const file = e.currentTarget.files[0];
        const processedFile = await uploadFileMutation.mutateAsync(file);
        onChange(processedFile);
      }
    } disabled={uploadFileMutation.isPending} hidden={true} type="file" id="pet_image" />
  </span>
  )
}