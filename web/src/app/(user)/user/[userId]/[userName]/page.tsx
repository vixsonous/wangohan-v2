import Image from "@/components/Image/server";
import UserTabs from "./components/user-tabs";
import UserPetsCarousel from "./components/user-pets-carousel";
import { Metadata } from "next";
import {getUser, isAuthenticated} from "@/server-actions/User/user";
import AddPetsDialog from "@/app/(user)/user/[userId]/[userName]/components/add-pets-dialog";

interface UserProps {
  params: Promise<{
    userId: string;
    userName: string;
  }>
}
export async function generateMetadata({
  params
}: UserProps): Promise<Metadata> {
  const {userId, userName} = (await params);
  console.log(userId, userName);
  return {
    title: 'User'
  }
}

export default async function User({
  params
}: UserProps) {
  const {userId, userName} = await params;
  
  const user = await getUser(Number(userId), String(userName));

  if(user === undefined) {
    return <h1>User not found!</h1>;
  }

  const userData = await isAuthenticated();
  return (
    <div className="flex gap-2 flex-col md:flex-row justify-center w-full max-w-7xl text-primary-text mt-10 px-4">
      <section className="w-full flex flex-col gap-2 items-center">
        <Image className="rounded-full" width={300} height={300} src={user.user_image} alt="profile picture"/>
        <h1 className="text-3xl mb-4">{user.user_codename}</h1>
        <div className="relative">
          <Image width={300} height={122} src={"/banner/ribbon.webp"} alt="ribbon banner image"/>
          <h1 className="absolute top-1/12 pt-1 font-semibold text-sm md:text-lg left-1/2 -translate-x-1/2">
            うちのわん
          </h1>
        </div>
        {userData !== undefined && (
          <AddPetsDialog />
        )}
        <UserPetsCarousel pets={user.pets} user_id={Number(userId)} user_codename={user.user_codename} user_data={userData} />
      </section>
      <section className="w-full">
        <UserTabs total_recipes={user.total_recipes} total_liked={user.total_liked} user_id={Number(userId)} user_codename={user.user_codename} user_data={userData} liked_recipes={user.liked_recipes} my_recipes={user.my_recipes} />
      </section>
    </div>
  )
}