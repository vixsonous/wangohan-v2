"use client";

import Image from "@/components/Image/client";
import {usePersonalForm} from "@/app/(auth)/signup/personal-info/personal-form-helper";
import Error from "@/components/Error";
import InputField from "@/components/Input";
import React from "react";
import { format } from "date-fns";
import { ja } from 'date-fns/locale';
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
import TermsAndConditions from "@/app/(auth)/signup/personal-info/terms-and-conditions";

export default function PersonalInfoForm({user_id}: {user_id: number}) {
  const { signupInfoMutation, register, errors, control, onSubmit, handleSubmit, uploadFileMutation} = usePersonalForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full sm:max-w-2xl flex flex-col gap-4 items-start pt-10">
      <InputField hidden={true} {...register("user_id", {valueAsNumber: true})} value={Number(user_id)}/>
      <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-5">
        <div className="col-span-2">
          <Controller
            control={control}
            render={({field}) => (
              <label htmlFor="user_image" className="flex flex-col relative items-center justify-center">
                <Image src={'/banner/3dogs.webp'} className="-top-10 z-10 absolute h-[auto] w-[20%] sm:w-[40%] max-w-none rounded-[25px]" width={100} height={100}  alt="website banner" />
                {
                  uploadFileMutation.isPending && (
                    <div className="absolute z-10 flex justify-center gap-2 items-center">
                      <Image src={"/icons/svg/primary-loading.svg"} alt={"circle loading svg"} noprocess={true} className={"animate-spin"}/>
                      <span>アップロード中...</span>
                    </div>
                  )
                }
                <div className="relative w-full">
                  <Image
                    key={field.value ? field.value.name : "image"}
                    noprocess={true}
                    src={field.value ? URL.createObjectURL(field.value) : "/image.webp"}
                    className="h-full w-full top-0 aspect-square right-0 object-cover rounded-full"
                    width={100} height={100}
                    alt={field.value ? field.value.name : "default image"}
                  />
                </div>
                <span className={"hidden"}>
                  <InputField onChange={
                    async (e: React.ChangeEvent<HTMLInputElement>) =>
                      {
                        if(e.currentTarget.files === null) return;
                        const file = e.currentTarget.files[0];
                        const processedFile = await uploadFileMutation.mutateAsync(file);
                        field.onChange(processedFile);
                      }
                  } disabled={uploadFileMutation.isPending} hidden={true} type="file" id="user_image" />
                </span>
                <Error>{errors.user_image?.message}</Error>
              </label>
            )}
            name={"user_image"}
          />
        </div>
        <div className=" grid grid-cols-1 gap-4 col-span-3 w-full">
          <p className="col-span-1 flex flex-col gap-2">
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

          <p className="col-span-1 flex flex-col gap-2">
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

          <p className="col-span-1 w-full flex flex-col gap-2">
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
        </div>
      </div>

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
                        <Image alt={"circle loading svg"} src={"/icons/svg/primary-calendar.svg"} noprocess={true}/>
                      </>
                    ) : (
                      <>
                        <span>誕生日を入力</span>
                        <Image alt={"circle loading svg"} src={"/icons/svg/primary-calendar.svg"} noprocess={true}/>
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
          <label htmlFor="user_gender" className={`text-xl flex gap-2 items-center font-semibold`}>
            性別
            <Error>{errors.user_gender?.message}</Error>
          </label>

          <Controller render={({field}) => (
            <Select onValueChange={field.onChange}>
              <SelectTrigger id={"user_gender"} className="w-full bg-secondary-bg border border-primary-text">
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
          )}
          name={"user_gender"}
          control={control}
          />
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

      <Controller
        render={({field}) => (
          <p className="w-full flex flex-col justify-center items-center gap-2">
            <label className="text-sm font-semibold flex items-baseline gap-2" htmlFor="user_agreement">
              <input
                aria-invalid={errors.user_agreement?.message !== undefined}
                className="sm:text-base"
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => field.onChange(e.currentTarget.checked ? 1 : 0)}
                id="user_agreement"
                type="checkbox"
              />
              I have read and agree to the <TermsAndConditions />
            </label>
            <Error>{errors.user_agreement?.message}</Error>
          </p>
        )}
        name={"user_agreement"}
        control={control}
      />
      <div className="w-full flex justify-center flex-col items-center gap-[10px]">
        <Button disabled={signupInfoMutation.isPending || signupInfoMutation.isSuccess} type="submit" className="w-full flex items-center gap-2 bg-primary-text">
          {signupInfoMutation.isPending ? (
            <><Image alt={"circle loading svg"} src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"} /> 新規登録</>
          ): (
            "新規登録"
          )}
        </Button>
      </div>
    </form>
  )
}