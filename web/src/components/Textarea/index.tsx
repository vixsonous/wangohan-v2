import { TextareaHTMLAttributes } from "react";
import { Textarea } from "../ui/textarea";

export default function TextareaField({className, ...props}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Textarea className={`py-2 px-4 w-full border border-primary-text rounded-md text-xs md:text-sm bg-secondary-bg ` + className} {...props}/>
  )
}