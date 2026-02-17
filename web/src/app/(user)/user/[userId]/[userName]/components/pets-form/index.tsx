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
import { usePetForm} from "@/app/(user)/user/[userId]/[userName]/components/use-add-pet";
import {formatInTimeZone} from "date-fns-tz";
import {PetProps} from "@/app/(user)/user/[userId]/[userName]/components/user-pets-carousel";
import PetBanner from "@/app/(user)/user/[userId]/[userName]/components/pets-form/form-components/pet-banner";
import UploadFileLoading
  from "@/app/(user)/user/[userId]/[userName]/components/pets-form/form-components/upload-file-uploading";
import PetImage from "@/app/(user)/user/[userId]/[userName]/components/pets-form/form-components/pet-image";
import PetImageInputField
  from "@/app/(user)/user/[userId]/[userName]/components/pets-form/form-components/pet-image-input-field";
import FormField from "@/app/(user)/user/[userId]/[userName]/components/pets-form/form-components/pet-form-field";

export default function PetsForm({user_id, pet}: {user_id: number, pet?: PetProps | undefined}) {

  const {petForm, postPetOnSubmit, uploadFileMutation, postPetMutation, putPetMutation, putPetOnSubmit} = usePetForm(pet);
  const errors = petForm.formState.errors;
  return (
    <form className={"pt-8"} onSubmit={petForm.handleSubmit(pet ? putPetOnSubmit : postPetOnSubmit)}>
      <InputField
        hidden
        value={Number(user_id)}
        {...petForm.register("user_id", {valueAsNumber: true})}
      />
      <section className={"grid grid-cols-1 md:grid-cols-2 gap-6"}>
        <Controller
          control={petForm.control}
          render={({field}) => (
            <label htmlFor="pet_image" className="col-span-1 flex flex-col justify-center relative items-center">
              <PetBanner />
              {uploadFileMutation.isPending && <UploadFileLoading />}
              {<PetImage pet_image={field.value && field.value.size !== 0 ? field.value : undefined} pet_existing_image={pet?.pet_image}/>}
              {<PetImageInputField uploadFileMutation={uploadFileMutation} onChange={field.onChange}/>}
              <Error>{errors.pet_image?.message}</Error>
            </label>
          )}
          name={"pet_image"}
        />
        <div className={"col-span-1 grid grid-cols-1 gap-4"}>
          <FormField
            label={"愛犬の名前"}
            placeholder={"名前を入力"}
            errorMessage={errors.pet_name?.message}
            register={petForm.register} name={"pet_name"}
          />
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

          <FormField
            label={"犬種"}
            placeholder={"犬種を入力"}
            errorMessage={errors.pet_breed?.message}
            register={petForm.register} name={"pet_breed"}
          />
        </div>
      </section>
      <div className={"flex w-full justify-center items-center"}>
        <Button
          disabled={postPetMutation.isPending || postPetMutation.isSuccess || putPetMutation.isPending || putPetMutation.isSuccess}
          className={"w-full mt-6 flex gap-2 bg-primary-text max-w-max self-center relative"}
        >
          <>{(postPetMutation.isPending || putPetMutation.isPending) && <Image alt={"circle loading svg"} src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"} />} 家族を追加</>
        </Button>
      </div>
    </form>
  )
}