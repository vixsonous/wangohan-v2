import React, { InputHTMLAttributes } from "react";
import { Input } from "../ui/input";
import { FieldErrors, FieldValues } from "react-hook-form";
import Image from "../Image/client";
import Button from "../Button";
import { Inter } from "next/font/google";
import Error from "../Error";

type Size = "sm" | "md" | "lg";

export const inter = Inter({ subsets: ["latin"], display: 'swap', adjustFontFallback: false });

interface InputFieldProps {
  size?: Size;
  errors?: FieldErrors<FieldValues>;
  icon?: React.ReactElement;
}

export default function InputField({className, icon, errors, type, ...props}: InputHTMLAttributes<HTMLInputElement> & InputFieldProps) {
  return (
    <span className="relative w-full">
      <Input 
        type={type}
        data-slot="input"
        className={`py-2 ${inter.className} px-4 w-full border border-primary-text rounded-md text-sm md:text-base bg-secondary-bg ` + className} 
        {...props}
      />
      {icon && <span className="absolute right-2 top-2">{icon}</span>}
      <Error>
        {errors && errors[props.name || ""] && <Image className="error" src={"/icons/svg/warning-circle-alert.svg"} alt="warning circle icon svg"/>}
        {errors && errors[props.name || ""] && errors[props.name || ""]?.message?.toString()}
      </Error>
    </span>
  )
}