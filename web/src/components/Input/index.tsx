import { InputHTMLAttributes } from "react";
import { Input } from "../ui/input";

type Size = "sm" | "md" | "lg";

interface InputFieldProps {
  size?: Size;
}

export default function InputField({className, ...props}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Input 
      className={`py-2 px-4 w-full border border-primary-text rounded-md text-xs md:text-sm bg-secondary-bg ` + className} 
      {...props}
    />
  )
}