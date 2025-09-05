"use client";

import {useEffect} from "react";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";
import {toast} from "sonner";
import {EventSchema} from "@/types/event-types";
import Image from "@/components/Image/client";
import Link from "next/link";

type RootNavigationUserProps = {
  user_data: z.infer<typeof UserSchema.User>;
}
export default function RootNavigationUser({user_data}: RootNavigationUserProps) {

  useEffect(() => {
    if(!user_data.user_details) return;

    const event = new EventSource( process.env.NEXT_PUBLIC_ORIGIN + ":3001/api/recipe-events?user_id=" + user_data.user_id+ "&user_codename=" + user_data.user_details.user_codename, {withCredentials: true});
    event.onmessage = (event) => {
      const data: z.infer<typeof EventSchema.Event> = JSON.parse(event.data);
      toast.message(`${data.user_codename} liked your recipe!`, {
        position: "bottom-right",
        description:
          <Link href={"/recipe/show/" + data.recipe_id + "/" + data.recipe_name} className={"flex gap-2 items-center"}>
            <Image
              src={data.user_image}
              alt={`${data.user_codename}'s user image`}
              className={"rounded-full"}
              width={30}
              height={30}
            />
            has liked your recipe!
          </Link>
      });
    }

    console.log(event);
  }, [user_data]);
  return (
    <>
    <h1>Hello User!</h1>
    </>
  )
}