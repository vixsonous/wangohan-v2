"use client";

import Image from "@/components/Image/client";
import {usePersonalForm} from "@/app/(auth)/signup/personal-info/personal-form-helper";
import Error from "@/components/Error";
import InputField from "@/components/Input";
import React from "react";
import { format } from "date-fns";
import { enUS, ja } from 'date-fns/locale';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Controller} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const PERSONAL_INFO_FIELDS = {
  USER_LAST_NAME: "user_last_name",
  USER_FIRST_NAME: "user_first_name",
};

export default function PersonalInfoForm() {

  const {uploadInfoMutation, signupInfoMutation, register, errors, control} = usePersonalForm();

  return (
    <form action="" className="w-full max-w-full sm:max-w-2xl flex flex-col gap-4 items-start pt-10">
      <div className="flex flex-wrap w-full justify-center gap-[1em]">
        <div className="flex-[0_0_100%] sm:flex-[0_0_50%]">
          <label htmlFor="personal-image" className="flex relative items-center justify-center">
            <img src={'/banner/3dogs.webp'} className="top-[-20.2%] absolute h-[auto] w-[20%] sm:w-[40%] max-w-none rounded-[25px]" width={100} height={100}  alt="website banner" />
            {
              uploadInfoMutation.isPending && (
                <div className="absolute z-10 flex justify-center gap-2 items-center">
                  <Image src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"}/>
                  <span>アップロード中...</span>
                </div>
              )
            }
            <div className="relative pt-[50%] w-[50%] sm:pt-[100%] sm:w-full">
              <Image src={"/image.webp"} className="h-full w-full top-0 right-0 object-cover absolute rounded-[200px]" width={100} height={100}  alt="website banner" />
            </div>
            <input disabled={true} className="hidden" type="file" name="personal-image" id="personal-image" />
          </label>
        </div>
        <div className="flex-[0_0_100%] flex flex-wrap sm:flex-nowrap sm:flex-col gap-[1rem] w-full">
          <p className="flex flex-col gap-2">
            <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="user_last_name">
              姓
              <Error>{errors.user_last_name?.message}</Error>
            </label>
            <InputField
                aria-invalid={errors.user_last_name?.message !== undefined}
                className="sm:text-base" {...register("user_last_name")}
                placeholder="姓を入力"
                id="user_last_name"
                type="text"
            />
          </p>

          <p className="flex flex-col gap-2">
            <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="user_first_name">
              名
              <Error>{errors.user_first_name?.message}</Error>
            </label>
            <InputField
              aria-invalid={errors.user_first_name?.message !== undefined}
              className="sm:text-base" {...register("user_first_name")}
              placeholder="名を入力"
              id="user_first_name"
              type="text"
            />
          </p>
        </div>
      </div>

      <p className="w-full flex flex-col gap-2">
        <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="user_codename">
          ユーザー名
          <Error>{errors.user_codename?.message}</Error>
        </label>
        <InputField
          aria-invalid={errors.user_codename?.message !== undefined}
          className="sm:text-base" {...register("user_codename")}
          placeholder="ユーザー名を入力"
          id="user_codename"
          type="text"
        />
      </p>

      <div className="grid grid-cols-2 gap-2 w-full">
        <Controller
          control={control}
          render={({field}) => (
            <p className="w-full col-span-1 flex flex-col gap-2">
              <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="user_birthdate">
                誕生日
                <Error>{errors.user_birthdate?.message}</Error>
              </label>
              <Popover>
                <PopoverTrigger>
                  <span className={"flex text-sm md:text-base py-1.5 h-9 px-4 rounded-md border border-primary-text bg-secondary-bg justify-between items-center"}>
                    {field.value ? (
                      <>
                        {format(field.value, "PPP", {locale: ja})}
                        <Image src={"/icons/svg/primary-calendar.svg"} noprocess={true}/>
                      </>
                    ) : (
                      <>
                        <span>誕生日を入力</span>
                        <Image src={"/icons/svg/primary-calendar.svg"} noprocess={true}/>
                      </>
                    )}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </p>
          )}
          name={"user_birthdate"}
        />

        <div className="w-full col-span-1 flex flex-col gap-2">
          <label htmlFor="gender" className={`text-xl font-semibold`}>性別 </label>

          <Select {...register("user_gender")}>
            <SelectTrigger className="w-full bg-secondary-bg border border-primary-text">
              <SelectValue placeholder="性別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>性別を選択</SelectLabel>
                <SelectItem value="男性">男性</SelectItem>
                <SelectItem value="女性">女性</SelectItem>
                <SelectItem value="どちらでもない">どちらでもない</SelectItem>
                <SelectItem value="答えない">答えない</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="w-full flex flex-col gap-2">
        <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="user_occupation">
          職業
          <Error>{errors.user_occupation?.message}</Error>
        </label>
        <InputField
          aria-invalid={errors.user_occupation?.message !== undefined}
          className="sm:text-base" {...register("user_occupation")}
          placeholder="職業を入力"
          id="user_occupation"
          type="text"
        />
      </p>



      <div className="w-full flex justify-center flex-col items-center gap-[10px]">
        <Button disabled={signupInfoMutation.isPending || signupInfoMutation.isSuccess} type="submit" className="w-full flex items-center gap-2 bg-primary-text">
          {signupInfoMutation.isPending ? (
            <><Image src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"} /> 新規登録</>
          ): (
            "新規登録"
          )}
        </Button>
      </div>
    </form>
  )
}