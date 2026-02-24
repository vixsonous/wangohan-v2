import Image from "@/components/Image/server";
import UserTabs from "./components/user-tabs";
import { Metadata } from "next";
import {getUser, isAuthenticated} from "@/server-actions/User/user";
import UserPets from "@/app/(user)/user/[userId]/[userName]/components/user-pet/user-pets";

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
  const user = await getUser(Number(userId), String(userName));

  if(user === undefined) {
    return {
      title: "Undefined"
    }
  }

  const userImage = String(user.user_image).startsWith("r2://") ? process.env.NEXT_PUBLIC_BUCKET_URL + "/" + String(user.user_image).split("r2://")[1] : user.user_image;

  return {
    title: user.user_codename,
    keywords: user.my_recipes?.map(recipe => recipe.recipe_name).concat(user.pets?.map(pet => pet.pet_name) || []),
    creator: user.user_codename,
    description: `Discover the recipes and pets of ${user.user_codename}!`,
    openGraph: {
      title: user.user_codename,
      description: `Discover the recipes and pets of ${user.user_codename}!`,
      url: process.env.NEXT_PUBLIC_ORIGIN + "/user/" + user.user_id + "/" + user.user_codename, // Your website URL
      type: 'profile',
      siteName: "わんごはん",
      images: [
        { url: userImage, width: 500, height: 500, alt: user.user_codename }
      ]
    },
    twitter: {
      title: user.user_codename,
      card: 'summary_large_image',
      creator: `@${user.user_codename}`,
      images: userImage,
      description: `Discover the recipes and pets of ${user.user_codename}!`
    },
    robots: {
      index:true,
      follow: true,
      nocache: false,
    },
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
        <Image className="rounded-full w-3/4 h-3/4 md:w-1/2 md:h-auto" width={300} height={300} src={user.user_image} alt="profile picture"/>
        <h1 className="text-3xl mb-4">{user.user_codename}</h1>
        <div className="relative">
          <Image width={300} height={122} src={"/banner/ribbon.webp"} alt="ribbon banner image"/>
          <h1 className="absolute top-1/12 pt-1 font-semibold text-sm md:text-lg left-1/2 -translate-x-1/2">
            うちのわん
          </h1>
        </div>
        <UserPets userData={userData} user={user} />
      </section>
      <section className="w-full">
        <UserTabs deleted_recipes={user.deleted_recipes} total_recipes={user.total_recipes} total_deleted={user.total_deleted_recipes} total_liked={user.total_liked} user_id={Number(userId)} user_codename={user.user_codename} user_data={userData} liked_recipes={user.liked_recipes} my_recipes={user.my_recipes} />
      </section>
    </div>
  )
}