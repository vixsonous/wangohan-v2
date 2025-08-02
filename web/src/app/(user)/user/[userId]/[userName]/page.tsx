import Image from "@/components/Image/server";
import UserTabs from "./components/user-tabs";
import UserPetsCarousel from "./components/user-pets-carousel";
import Button from "@/components/Button";
import { Metadata } from "next";
import { getUser } from "@/server-actions/User/user";

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

  return (
    <div className="flex gap-2 justify-center w-full max-w-7xl text-primary-text mt-10">
      <section className="w-full flex flex-col gap-2 items-center">
        <Image className="rounded-full" width={300} height={300} src={user.user_image} alt="profile picture"/>
        <h1 className="text-3xl mb-4">{user.user_codename}</h1>
        <div className="relative">
          <Image width={300} height={122} src={"/banner/ribbon.webp"} alt="ribbon banner image"/>
          <h1 className="absolute top-1/12 pt-1 font-semibold text-sm md:text-lg left-1/2 -translate-x-1/2">
            うちのわん
          </h1>
        </div>
        <Button className="text-lg font-bold">愛犬を登録する</Button>
        <UserPetsCarousel />
      </section>
      <section className="w-full">
        <UserTabs />
      </section>
    </div>
  )
}