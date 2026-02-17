import {DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog";
import Image from "@/components/Image/client";
import {format} from "date-fns";
import {PetProps} from "@/app/(user)/user/[userId]/[userName]/components/user-pets-carousel";
import React from "react";
import EditPetDialog from "@/app/(user)/user/[userId]/[userName]/components/user-pet/edit-pet-dialog";

type UserPetViewProps = {
  pet: PetProps;
  user_id: number;
}

export default function UserPetView({pet, user_id}: UserPetViewProps) {
  return (
    <DialogContent>
      <div className={"relative w-full"}>
        <DialogTitle className={"text-center z-10 relative -top-[400%]"}>
          {pet.pet_name}
        </DialogTitle>
        <Image imgonly={true} width={300} height={122} src={"/banner/ribbon.webp"} className={"absolute bg-primary-bg rounded-lg pt-4 -top-[600%] left-1/2 -translate-x-1/2 w-[300px]"} alt="ribbon banner image"/>
      </div>
      <EditPetDialog user_id={user_id} pet={pet}/>
      <section className={"flex flex-col md:flex-row gap-4 relative"}>
        <div className={'w-full flex justify-center items-center md:w-auto md:block'}>
          <Image height={100} width={100} src={pet.pet_image} className={`border-4 max-h-48 max-w-48 border-primary-text duration-500 w-full h-full aspect-square object-cover`} alt={pet.pet_name} />
        </div>
        <div className={"w-full flex flex-col items-center md:w-auto md:block"}>
          <DialogDescription className={"text-center"}>-</DialogDescription>
          <p><span className={"font-bold"}>愛犬の名前:</span> {pet.pet_name}</p>
          <p><span className={"font-bold"}>誕生日:</span> {format(new Date(pet.pet_birthdate).toDateString(), "MMMM do yyyy")}</p>
          <p><span className={"font-bold"}>姓:</span> {pet.pet_breed}</p>
        </div>
      </section>
    </DialogContent>
  )
}