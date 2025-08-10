import Image from "@/components/Image/server";
import Link from "next/link";
import z from "zod";
import {UserSchema} from "@/types/user-types";

interface ShowRecipeCommentsHeaderProps {
  recipe_id: number;
  user: z.infer<typeof UserSchema.UserDisplay>
  avgRating: number;
  totalRating: number;
}

export default function ShowRecipeCommentsHeader(recipe_data: ShowRecipeCommentsHeaderProps) {

  const user = recipe_data.user;

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-full text-[13px] flex justify-between items-center">
        <p>No. {recipe_data.recipe_id}</p>
        <h1 className="flex items-center gap-[10px]">
          Recipe by
          <Link href={user !== null ? "/user/" + user.user_id + "/" + user.user_codename : "/"}>
            <Image
              src={user !== null ? user.user_image : "/image.webp"}
              className="h-[30px] w-[30px] rounded-[100px] object-cover"
              width={100}
              height={100}
              alt="website banner"
            />
          </Link>
          {user ? user.user_codename : "Anonymous"}
        </h1>
      </section>
      <section className="w-full relative">
        <h1
          className={`text-[13px] tracking-tighter inline-block text-[#523636] relative pb-[10px] after:content-[''] z-[10] after:w-[105%] after:h-[20px] after:top-[5px] after:z-[-1] after:flex after:absolute after:bg-[#FFE9C9]`}
        >
          レビュー
          <svg
            className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500 inline"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="yellow"
            viewBox="0 0 22 20"
          >
            <path
              d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
              strokeWidth="0.5"
              stroke="grey"
            />
          </svg>{" "}
          <span className="text-[10px]">
            {Number(recipe_data.avgRating).toFixed(1)} (
            {recipe_data.totalRating})
          </span>
        </h1>
        <div className="absolute w-full top-[13px] border-[1px] border-solid border-[#523636]" />
      </section>
    </div>
  )
}