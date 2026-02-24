"use client";

import AddPetsDialog from "@/app/(user)/user/[userId]/[userName]/components/user-pet/add-pets-dialog";
import UserPetsCarousel, {PetProps} from "@/app/(user)/user/[userId]/[userName]/components/user-pet/user-pets-carousel";
import {User} from "@/types/user-types.user";
import {GetUserDetails} from "@/types/user-types.user-detail";
import {useState} from "react";

type UserPetsProps = {
  userData: User | undefined;
  user: GetUserDetails;
}
export default function UserPets({userData, user}: UserPetsProps) {
  const [pets, setPets] = useState<Array<PetProps>>(() => user.pets || []);
  return (
    <>
      {userData !== undefined && (
        <AddPetsDialog user_id={userData.user_id} setPets={setPets}/>
      )}
      <UserPetsCarousel pets={pets} user_id={user.user_id} user_codename={user.user_codename} setPets={setPets} user_data={userData} />
    </>
  )
}