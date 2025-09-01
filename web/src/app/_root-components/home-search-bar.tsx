"use client";

import Image from "@/components/Image/client";
import InputField from "@/components/Input";
import React from "react";
import {FieldValues, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import Button from "@/components/Button";

export default function HomeSearchBar() {

  const router = useRouter();
  const submit = (data: FieldValues) => router.push("/recipe/search/" + data.search_text + "/1");
  const {register, handleSubmit} = useForm();
  
  return (
    <form onSubmit={handleSubmit(submit)} suppressHydrationWarning className="relative w-full flex items-center max-w-[170px] sm:max-w-[250px] md:max-w-[500px]">
      <InputField
        {...register("search_text")}
        className={`py-2 px-4 w-full border border-primary-text rounded-md text-xs md:text-sm bg-secondary-bg`} 
        placeholder="キーワードでレシピを検索"
        type="text" 
      />
      <Button type="submit" className="absolute right-2">
        <Image noprocess src={"/icons/svg/primary-magnifying-glass.svg"} alt="an icon for search bar"/>
      </Button>
    </form>
  )
}