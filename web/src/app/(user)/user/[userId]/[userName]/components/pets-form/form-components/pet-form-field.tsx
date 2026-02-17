import {PetProps} from "@/app/(user)/user/[userId]/[userName]/components/user-pets-carousel";
import {usePetForm} from "@/app/(user)/user/[userId]/[userName]/components/use-add-pet";
import InputField from "@/components/Input";
import React from "react";
import {FieldValues, Path, UseFormRegister} from "react-hook-form";
import Error from "@/components/Error";

type FormFieldProps<T extends FieldValues> = {
  errorMessage?: string | undefined;
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  placeholder: string
}
export default function FormField<T extends FieldValues> ({errorMessage, label, placeholder, register, name}: FormFieldProps<T>) {
  return (
    <p className="col-span-1 flex flex-col gap-2">
      <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor={name}>
        {label}
        <Error>{errorMessage}</Error>
      </label>
      <InputField
        aria-invalid={errorMessage !== undefined}
        className="sm:text-base" {...register(name)}
        placeholder={placeholder}
        id={name}
        type="text"
      />
    </p>
  )
}