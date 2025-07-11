"use client";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import InputField from "@/components/Input";
import TextareaField from "@/components/Textarea";
import React, { useCallback, useState } from "react";

export default function CreateRecipeForm() {
  const [recipeIngredientsCnt, setRecipeIngredientsCnt] = useState(2);

  const increaseRecipeIngredients = useCallback((e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRecipeIngredientsCnt(prev => prev + 1);
  }, []);

  return (
    <form action="" className="flex flex-wrap justify-between gap-8 max-w-7xl h-full w-full">
      <div className="first-section--container grid grid-cols-6 md:grid-cols-12 w-full gap-8">
        <div className="col-span-6 flex flex-col gap-4">
          <p className="flex flex-col gap-2">
            <label className="text-xl font-semibold" htmlFor="recipe_title">
              レシピタイトル
            </label>
            <InputField placeholder="例）炊飯器で簡単！夏バテでも食べられるご飯" id="recipe_title" type="text" />
          </p>
          <p className="flex flex-col gap-2 flex-[1_0_50%]">
            <label className="text-xl font-semibold" htmlFor="text_description">
              レシピの説明
            </label>
            <TextareaField placeholder="レシピに説明をしてください例）愛犬が夏バテでなかなかご飯を食べなかったので、お魚ベースの手作りごはんを作りました。たくさん食べてくれたので是非作ってみてください。" className="h-full" id="text_description" />
          </p>
        </div>
        <div className="col-span-6">
          <p className="relative flex flex-col gap-2">
            <label htmlFor="recipe_images" className="absolute z-10 -top-16 left-38">
              <Image  width={211} height={120} src={"/banner/3dogs.webp"} alt="3 dogs image background for image upload"/>
            </label>
            <label htmlFor="recipe_images" className=" z-10 top-0 left-0 text-xl font-semibold">画像を追加する</label>
            <label htmlFor="recipe_images" className=" cursor-pointer">
              <span className="relative flex h-full  after:content-[''] after:transition-all after:duration-300 after:absolute after:top-0 after:left-0 after:w-full after:h-full hover:after:bg-black/10">
                <Image width={624} height={351} src={"/banner/empty-bg.webp"} alt="empty background for image upload"/>
              </span>
            </label>
            <InputField className="hidden" id="recipe_images" type="file"/>
          </p>
        </div>
      </div>
      <div className="second-section--container w-full">
        <section className="recipe_ingredients w-full">
          <h1 className="text-xl font-semibold">材料・分量</h1>
          <div className="recipe_ingredients_fields flex flex-col gap-2">
            {Array.from(Array(recipeIngredientsCnt).keys()).map( cnt => {
              return (
                <div key={cnt} className="flex gap-2 w-full">
                  <InputField placeholder="例）にんじん" className="" />
                  <InputField placeholder="例）1/2本" className="" />
                  <Button className="">X</Button>
                </div>
              )
            })}
          </div>
          <Button onClick={increaseRecipeIngredients}>＋追加</Button>
        </section>
      </div>
    </form>
  )
}