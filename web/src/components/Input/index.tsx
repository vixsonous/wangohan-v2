import React, { InputHTMLAttributes } from "react";
import { Input } from "../ui/input";
import { FieldErrors, FieldValues } from "react-hook-form";
import Image from "../Image/client";
import Button from "../Button";

type Size = "sm" | "md" | "lg";

interface InputFieldProps {
  size?: Size;
  errors?: FieldErrors<FieldValues>;
  icon?: React.ReactElement;
}

export default function InputField({className, icon, errors, type, ...props}: InputHTMLAttributes<HTMLInputElement> & InputFieldProps) {
  return (
    <span className="relative">
      <Input 
        type={type}
        data-slot="input"
        className={`py-2 px-4 w-full border border-primary-text rounded-md text-xs md:text-sm bg-secondary-bg ` + className} 
        {...props}
      />
      {icon && <span className="absolute right-2 top-2">{icon}</span>}
      <span className="text-xs text-error flex items-center gap-2 mt-1">
        {errors && errors[props.name || ""] && <Image className="error" src={"/icons/svg/warning-circle-alert.svg"} alt="warning circle icon svg"/>}
        {errors && errors[props.name || ""] && errors[props.name || ""]?.type === 'required' && "Email is required"}</span>
    </span>
  )
}