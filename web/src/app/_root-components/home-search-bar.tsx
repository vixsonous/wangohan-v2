"use client";

import Image from "@/components/Image/client";
import InputField from "@/components/Input";
import React, {useEffect, useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import Button from "@/components/Button";


export default function HomeSearchBar({width, id}: { width?: string | undefined, id: string }) {

  const router = useRouter();
  const submit = (data: FieldValues) => router.push("/recipe/search/" + data.search_text + "/1");
  const {register, handleSubmit} = useForm();
  const [homePast, setHomePast] = useState(false);



  useEffect(() => {
    const category = document.querySelector("#category");
    if(!category) return;
    const top = category.getBoundingClientRect().top + window.scrollY;

    function handleScroll() {
      console.log(top);
      console.log(window.scrollY > top - 100);
      setHomePast(window.scrollY > top - 100);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <form
      id={id}
      onSubmit={handleSubmit(submit)}
      suppressHydrationWarning
      style={{
        clipPath:  id === "header-search" && !homePast ? `inset(0 100% 0 0)` :
          id === "category-search" && homePast ? `inset(0 100% 0 0)` : `inset(0 0% 0 0)`,
      }}
      className={`relative w-full box-border transition-[clip-path] duration-250  flex items-center ${id === 'category-search' ? 'max-w-none' : 'max-w-none sm:max-w-[250px] md:max-w-[500px]'} `}
    >
      <InputField
        {...register("search_text")}
        className={`w-full border border-primary-text rounded-md text-xs md:text-sm bg-secondary-bg`}
        placeholder="キーワードでレシピを検索"
        type="text" 
      />
      <Button type="submit" className="absolute right-2">
        <Image noprocess src={"/icons/svg/primary-magnifying-glass.svg"} alt="an icon for search bar"/>
      </Button>
    </form>
  )
}