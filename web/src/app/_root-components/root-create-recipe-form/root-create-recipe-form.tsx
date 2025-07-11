"use client";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import InputField from "@/components/Input";
import TextareaField from "@/components/Textarea";
import React, { useCallback, useState } from "react";
import {v4} from 'uuid';
import {FieldValues, useForm} from 'react-hook-form';
import { useCreateRecipeForm } from "./helper";

const events = [
  "お誕生日",
  "おうち記念日",
  "お正月",
  "節分",
  "ひな祭り",
  "こどもの日",
  "七夕",
  "ハロウィン",
  "クリスマス",
  "おやつ",
  "ダイエット",
  "その他",
];

const size = ["小型犬", "中型犬", "大型犬"];
const age = ["子犬", "成犬", "シニア犬"];

const RECIPE_TITLE = 'recipe_title';
const RECIPE_DESCRIPTION = 'recipe_description';

export default function CreateRecipeForm() {

  const {register, unregister, handleSubmit} = useForm({mode: 'onChange'});
  
  const {
    recipeIngredientsCnt,
    recipeInstructions,
    deleteRecipeIngredients,
    deleteRecipeInstructions,
    increaseRecipeIngredients,
    increaseRecipeInstructions,
    onSubmit
  } = useCreateRecipeForm(unregister);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap justify-center gap-8 max-w-7xl h-full w-full">
      <div className="first-section--container grid grid-cols-6 md:grid-cols-12 w-full gap-8">
        <div className="col-span-6 flex flex-col gap-4">
          <p className="flex flex-col gap-2">
            <label className="text-xl font-semibold" htmlFor="recipe_title">
              レシピタイトル
            </label>
            <InputField {...register(RECIPE_TITLE)} placeholder="例）炊飯器で簡単！夏バテでも食べられるご飯" id="recipe_title" type="text" />
          </p>
          <p className="flex flex-col gap-2 flex-[1_0_50%]">
            <label className="text-xl font-semibold" htmlFor={RECIPE_DESCRIPTION}>
              レシピの説明
            </label>
            <TextareaField {...register(RECIPE_DESCRIPTION)} placeholder="レシピに説明をしてください例）愛犬が夏バテでなかなかご飯を食べなかったので、お魚ベースの手作りごはんを作りました。たくさん食べてくれたので是非作ってみてください。" className="h-full" id={RECIPE_DESCRIPTION} />
          </p>
        </div>
        <div className="col-span-6">
          <p className="relative flex flex-col gap-2">
            <label htmlFor="recipe_images" className="absolute z-10 -top-14 left-38">
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
      <div className="second-section--container w-full flex flex-col gap-8">
        <section className="recipe_ingredients w-full flex flex-col gap-2">
          <h1 className="text-xl font-semibold">材料・分量</h1>
          <div className="recipe_ingredients_fields flex flex-col gap-2">
            {recipeIngredientsCnt.map( (cnt, idx) => {
              return (
                <div key={cnt.recipe_ingredient} className="flex gap-2 w-full">
                  <InputField {...register(cnt.recipe_ingredient)} placeholder="例）にんじん" className="" />
                  <InputField {...register(cnt.recipe_amount)} placeholder="例）1/2本" className="" />
                  <Button onClick={deleteRecipeIngredients(cnt.recipe_ingredient)}>
                    <Image src={"/icons/svg/primary-trash.svg"} alt="trash icon" noprocess/>
                  </Button>
                </div>
              )
            })}
          </div>
          <Button className="max-w-max" onClick={increaseRecipeIngredients}>＋追加</Button>
        </section>

        <section className="recipe_ingredients w-full flex flex-col gap-2">
          <h1 className="text-xl font-semibold">作り方</h1>
          <div className="recipe_ingredients_fields flex flex-col gap-2">
            {recipeInstructions.map( (ins) => {
              return (
                <div key={ins} className="flex gap-2 w-full ">
                  <InputField {...register(ins)} placeholder="例）にんじん" className="" />
                  <Button onClick={deleteRecipeInstructions(ins)}>
                    <Image src={"/icons/svg/primary-trash.svg"} alt="trash icon" noprocess/>
                  </Button>
                </div>
              )
            })}
          </div>
          <Button onClick={increaseRecipeInstructions} className="max-w-max">＋追加</Button>
        </section>
        <section className="grid gap-2">
          <header className="flex">
            <h1 className="font-bold text-xl">
              カテゴリー<small className="text-xxs">(任意)</small>
            </h1>
          </header>
          <div className="grid grid-cols-12 gap-y-2">
            <section className="col-span-6 grid gap-2">
              <h1 className="text-sm text-gray-500">年齢を選択</h1>
              <div className="flex gap-1">
                {age.map(a => {
                  return (
                    <p key={a}>
                      <InputField {...register(`checkbox-age-` + a)} id={a} type="checkbox" className="hidden"/>
                      <label htmlFor={a}>
                        <Button
                          className={`cursor-pointer bg-primary-text self-center flex justify-center border-2 border-transparent items-center text-white py-[5px] px-[7px] rounded-[5px] text-sm`}
                        >
                          {a}
                        </Button>
                      </label>
                    </p>
                  )
                })}
              </div>
            </section>
            <section className="col-span-6 grid gap-2">
              <h1 className="text-sm text-gray-500">サイズを選択</h1>
              <div className="flex gap-1">
                {size.map(s => {
                  return (
                    <p key={s}>
                      <InputField {...register(`checkbox-size-` + s)} id={s} type="checkbox" className="hidden"/>
                      <label htmlFor={s}>
                        <Button
                          className={`cursor-pointer bg-primary-text self-center flex justify-center border-2 border-transparent items-center text-white py-[5px] px-[7px] rounded-[5px] text-sm`}
                        >
                          {s}
                        </Button>
                      </label>
                    </p>
                  )
                })}
              </div>
            </section>
            <section className="col-span-12 grid gap-2">
              <h1 className="text-sm text-gray-500">イベントを選択</h1>
              <div className="flex gap-1">
                {events.map(e => {
                  return (
                    <p key={e}>
                      <InputField {...register(`checkbox-event-` + e)} id={e} type="checkbox" className="hidden"/>
                      <label htmlFor={e}>
                        <Button
                          className={`cursor-pointer bg-primary-text self-center flex justify-center border-2 border-transparent items-center text-white py-[5px] px-[7px] rounded-[5px] text-sm`}
                        >
                          {e}
                        </Button>
                      </label>
                    </p>
                  )
                })}
              </div>
            </section>
          </div>
        </section>
      </div>
      <Button className={`bg-[#ffb762] text-white py-2.5 rounded-md text-sm px-5 font-bold self-center`} role="submit">
        作成する
      </Button>
    </form>
  )
}