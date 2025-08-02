"use client";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import InputField from "@/components/Input";
import TextareaField from "@/components/Textarea";
import React from "react";
import {Control, Controller, FieldPath, useController} from 'react-hook-form';
import { RecipeSchema, useCreateRecipeForm } from "./helper";
import Error from "@/components/Error";
import z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

interface CheckboxProps {
  label: string;
  control: Control<z.infer<typeof RecipeSchema>>;
  name: FieldPath<z.infer<typeof RecipeSchema>>;
}

function Checkbox({label, control, name}: CheckboxProps) {
  const {field} = useController({
    name,
    control,
  });

  return (
    <p>
      <input 
        onClick={() => console.log(field.value)} 
        value={label} 
        name="checkbox-age" 
        checked={!!field.value} 
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => field.onChange(e.currentTarget.checked ? e.currentTarget.value : false)} 
        id={label} 
        type="checkbox" 
        className="hidden"
      />
      <label htmlFor={label}>
        <span
          className={`cursor-pointer bg-primary-text self-center flex justify-center border-2 border-transparent items-center text-white py-[5px] px-[7px] rounded-[5px] text-sm`}
        >
          {label}
        </span>
      </label>
    </p>
  )
}

export default function CreateRecipeForm() {
  
  const {
    onSubmit,
    fileOnChange,
    files,
    register,
    handleSubmit,
    recipe_ingredients_field,
    recipe_instructions_field,
    errors,
    control,
    watch,
    deleteFiles
  } = useCreateRecipeForm();

  const title = watch("recipe_title");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap justify-center gap-8 max-w-7xl h-full w-full">
      <div className="first-section--container grid grid-cols-6 md:grid-cols-12 w-full gap-8">
        <div className="col-span-6 flex flex-col gap-4">
          <p className="flex flex-col gap-2">
            <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="recipe_title">
              レシピタイトル
              {
                (25 - title.length >= 0) ? (
                  <span className="text-xs">（{25 - title.length}文字以内）</span>
                ) : (
                  <Error>（{25 - title.length}文字オーバーしています）</Error>
                )
                
              }
              <Error>{errors.recipe_title?.message}</Error>
            </label>
            <InputField aria-invalid={errors.recipe_title?.message !== undefined} className="sm:text-base" {...register(RECIPE_TITLE)} placeholder="例）炊飯器で簡単！夏バテでも食べられるご飯" id="recipe_title" type="text" />
          </p>
          <p className="flex flex-col gap-2 flex-[1_0_50%]">
            <label className="text-xl font-semibold flex gap-2 items-baseline" htmlFor={RECIPE_DESCRIPTION}>
              レシピの説明
              <Error>{errors.recipe_description?.message}</Error>
            </label>
            <TextareaField aria-invalid={errors.recipe_description?.message !== undefined} {...register(RECIPE_DESCRIPTION)} placeholder="レシピに説明をしてください例）愛犬が夏バテでなかなかご飯を食べなかったので、お魚ベースの手作りごはんを作りました。たくさん食べてくれたので是非作ってみてください。" className="h-full" id={RECIPE_DESCRIPTION} />
          </p>
        </div>
        <div className="col-span-6">
          <Dialog>
            <DialogTrigger className="w-full">
              <p className="relative flex flex-col gap-2">
                <span className="absolute z-10 -top-14 left-38">
                  <Image  width={211} height={120} src={"/banner/3dogs.webp"} alt="3 dogs image background for image upload"/>
                </span>
                <span className=" z-10 top-0 left-0 w-full text-left text-xl font-semibold">画像を追加する</span>
                <span className=" cursor-pointer">
                  <span className="relative flex h-full  after:content-[''] after:transition-all after:duration-300 after:absolute after:top-0 after:left-0 after:w-full after:h-full hover:after:bg-black/10">
                    <Image className="rounded-md" width={624} height={351} src={"/banner/empty-bg.webp"} alt="empty background for image upload"/>
                  </span>
                </span>
              </p>
            </DialogTrigger>
            <DialogContent className="w-256 sm:max-w-3xl">
              <DialogTitle>
                <label htmlFor="recipe_images" className="absolute z-10 -top-22 left-38">
                  <Image  width={211} height={120} src={"/banner/3dogs.webp"} alt="3 dogs image background for image upload"/>
                </label>
                <label htmlFor="recipe_images" className="w-full cursor-pointer">
                  <span className="relative flex h-full  after:content-[''] after:transition-all after:duration-300 after:absolute after:top-0 after:left-0 after:w-full after:h-full hover:after:bg-black/10">
                    <Image className="rounded-md w-full" width={200} height={50} src={"/banner/empty-bg.webp"} alt="empty background for image upload"/>
                    <span className="absolute tracking-tight w-full leading-8 text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      料理の画像をアップロード <br /> （横長or正方形推奨）
                    </span>
                  </span>
                </label>
                <InputField accept="images/*" onChange={fileOnChange} multiple className="hidden" id="recipe_images" type="file"/>
              </DialogTitle>
              <DialogDescription className="grid grid-cols-5 gap-1 w-full h-full">
                {files.map((f, idx) => (
                  <span key={idx} className="relative col-span-1 w-full h-full">
                    <Image alt="preview image of uploaded file" className="w-full h-[100px] aspect-auto" src={f.preview_url} width={100} height={100} noprocess/>
                    <Button className="absolute top-2 right-2 bg-secondary-bg rounded-full" onClick={deleteFiles(f.preview_url)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x size-4" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </Button>
                  </span>
                ))}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="second-section--container w-full flex flex-col gap-8">
        <section className="recipe_ingredients w-full flex flex-col gap-2">
          <h1 className="text-xl font-semibold flex gap-2 items-baseline">
            材料・分量
            <Error>{errors.recipe_ingredients?.message}</Error>
          </h1>
          <div className="recipe_ingredients_fields flex flex-col gap-2">
            {recipe_ingredients_field.fields.map( (cnt, idx) => {
              return (
                <div key={cnt.id} className="flex gap-2 w-full">
                  <div className="flex gap-2 w-full">
                    <Controller 
                      control={control}
                      name={`recipe_ingredients.${idx}.recipe_ingredient`}
                      render={({field}) => (
                        <InputField 
                          aria-invalid={
                            errors && 
                            errors["recipe_ingredients"] !== undefined && 
                            errors["recipe_ingredients"][idx]?.recipe_ingredient?.message !== undefined
                          } 
                          className="w-full" 
                          {...field} 
                          placeholder="例）にんじん" 
                        />
                      )}
                    />
                    <Controller 
                      control={control}
                      name={`recipe_ingredients.${idx}.recipe_amount`}
                      render={({field}) => (
                        <InputField 
                          aria-invalid={
                            errors && 
                            errors["recipe_ingredients"] !== undefined && 
                            errors["recipe_ingredients"][idx]?.recipe_amount?.message !== undefined
                          } 
                          className="w-full" 
                          {...field} 
                          placeholder="例）1/2本" 
                        />
                      )}
                    />
                  </div>
                  <Button onClick={() => recipe_ingredients_field.remove(idx)}>
                    <Image width={20} src={"/icons/svg/primary-trash.svg"} alt="trash icon" noprocess/>
                  </Button>
                </div>
              )
            })}
          </div>
          <Button className="max-w-max" onClick={() => recipe_ingredients_field.append({recipe_ingredient: "", recipe_amount: ""})}>＋追加</Button>
        </section>

        <section className="recipe_ingredients w-full flex flex-col gap-2">
          <h1 className="text-xl font-semibold flex">
            作り方
          </h1>
          <div className="recipe_ingredients_fields flex flex-col gap-2">
            {recipe_instructions_field.fields.map( (ins, idx) => {
              return (
                <div key={ins.id} className="flex gap-2 w-full ">
                  <span className="mr-2 ml-2.5 flex justify-center items-center rounded-xl relative">
                    {idx + 1}
                    <div className="border border-black absolute h-6 w-6 rounded-full"></div>
                  </span>
                  <div className="w-full">
                    <Controller 
                      control={control}
                      name={`recipe_instructions.${idx}.recipe_instruction`}
                      render={({field}) => (
                        <InputField 
                          aria-invalid={
                            errors && 
                            errors["recipe_instructions"] !== undefined && 
                            errors["recipe_instructions"][idx]?.recipe_instruction?.message !== undefined
                          } 
                          {...field} 
                          placeholder="例）にんじん" 
                        />
                      )}
                    />
                  </div>
                  <Button onClick={() => recipe_instructions_field.remove(idx)}>
                    <Image width={20} src={"/icons/svg/primary-trash.svg"} alt="trash icon" noprocess/>
                  </Button>
                </div>
              )
            })}
          </div>
          <Button onClick={() => recipe_instructions_field.append({recipe_instruction: ""})} className="max-w-max">＋追加</Button>
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
              <div className="flex gap-1 flex-wrap">
                {age.map((a, idx) => {
                  return (
                    <Checkbox key={a} label={a} control={control} name={`checkbox_age.${idx}`} />
                  )
                })}
              </div>
            </section>
            <section className="col-span-6 grid gap-2">
              <h1 className="text-sm text-gray-500">サイズを選択</h1>
              <div className="flex gap-1 flex-wrap">
                {size.map((s, idx) => {
                  return (
                    <Checkbox key={s} label={s} control={control} name={`checkbox_size.${idx}`}/>
                  )
                })}
              </div>
            </section>
            <section className="col-span-12 grid gap-2">
              <h1 className="text-sm text-gray-500">イベントを選択</h1>
              <div className="flex gap-1 flex-wrap">
                {events.map((e, idx) => {
                  return (
                    <Checkbox key={e} label={e} control={control} name={`checkbox_event.${idx}`}/>
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