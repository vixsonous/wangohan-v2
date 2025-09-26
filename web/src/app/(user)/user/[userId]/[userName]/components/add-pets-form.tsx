import {Controller} from "react-hook-form";
import Image from "@/components/Image/client";
import InputField from "@/components/Input";
import React from "react";
import Error from "@/components/Error";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {format} from "date-fns";
import {ja} from "date-fns/locale";
import {Calendar} from "@/components/ui/calendar";
import {useAddPet} from "@/app/(user)/user/[userId]/[userName]/components/use-add-pet";
import {formatInTimeZone} from "date-fns-tz";

export default function AddPetsForm({user_id}: {user_id: number}) {

  const {petForm, onSubmit, uploadFileMutation, postPetMutation} = useAddPet();
  const errors = petForm.formState.errors;
  return (
    <form className={"pt-8"} onSubmit={petForm.handleSubmit(onSubmit)}>
      <InputField hidden value={Number(user_id)} {...petForm.register("user_id", {valueAsNumber: true})}/>
      <section className={"grid grid-cols-1 md:grid-cols-2 gap-6"}>
        <Controller
          control={petForm.control}
          render={({field}) => (
            <label htmlFor="pet_image" className="col-span-1 flex flex-col justify-center relative items-center">
              <Image src={'/banner/3dogs.webp'}  className="-top-8 md:-top-4 z-10 absolute h-[auto] rounded-[25px]" width={100}  alt="website banner" />
              {
                uploadFileMutation.isPending && (
                  <div className="absolute z-10 flex justify-center gap-2 items-center">
                    <Image alt={"circle loading svg"} src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"}/>
                    <span>アップロード中...</span>
                  </div>
                )
              }
              <div className="relative w-full flex justify-center items-center">
                <Image
                  key={field.value ? field.value.name : "image"}
                  noprocess={true}
                  src={field.value ? URL.createObjectURL(field.value) : "/image.webp"}
                  className="h-full w-full top-0 aspect-square right-0 object-cover rounded-full max-w-[220px]"
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
                  } disabled={uploadFileMutation.isPending} hidden={true} type="file" id="pet_image" />
                </span>
              <Error>{errors.pet_image?.message}</Error>
            </label>
          )}
          name={"pet_image"}
        />
        <div className={"col-span-1 grid grid-cols-1 gap-4"}>
          <p className="col-span-1 flex flex-col gap-2">
            <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="pet_name">
              愛犬の名前
              <Error>{errors.pet_name?.message}</Error>
            </label>
            <InputField
              aria-invalid={errors.pet_name?.message !== undefined}
              className="sm:text-base" {...petForm.register("pet_name")}
              placeholder="名前を入力"
              id="pet_name"
              type="text"
            />
          </p>

          <Controller
            control={petForm.control}
            render={({field}) => (
              <p className="w-full col-span-1 flex flex-col gap-2">
                <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="pet_birthdate">
                  誕生日
                  <Error>{errors.pet_birthdate?.message}</Error>
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
                      selected={new Date(field.value)}
                      onSelect={(date) => {
                        if(date) {
                          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                          const formatted = formatInTimeZone(date, timeZone, 'yyyy-MM-dd');
                          field.onChange(formatted);
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </p>
            )}
            name={"pet_birthdate"}
          />

          <p className="col-span-1 flex flex-col gap-2">
            <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="pet_breed">
              犬種
              <Error>{errors.pet_breed?.message}</Error>
            </label>
            <InputField
              aria-invalid={errors.pet_breed?.message !== undefined}
              className="sm:text-base" {...petForm.register("pet_breed")}
              placeholder="犬種を入力"
              id="pet_breed"
              type="text"
            />
          </p>
        </div>
      </section>
      <Button disabled={postPetMutation.isPending || postPetMutation.isSuccess} className={"w-full mt-6 flex items-center gap-2 bg-primary-text"}>
        <>{postPetMutation.isPending && <Image alt={"circle loading svg"} src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"} />} 家族を追加</>
      </Button>
    </form>
  )
}