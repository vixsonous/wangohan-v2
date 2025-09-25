"use client";

import React from "react";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";
import {toast} from "sonner";
import {EventSchema} from "@/types/event-types";
import Image from "@/components/Image/client";
import Link from "next/link";
import {Provider} from "react-redux";
import { store} from "@/store/store";
import Button from "@/components/Button";
import {Button as ButtonX} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import {useHeader} from "@/app/_root-components/(root-header)/helper";
import {getTimeAgo} from "@/lib/time";

type RootNavigationUserProps = {
  user_data: z.infer<typeof UserSchema.User>;
}

export function displayNotification(header_msg: string, description_msg: string, data: z.infer<typeof EventSchema.Event>) {
  toast.message(header_msg, {
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
        {description_msg}
      </Link>
  });
}

function NavigationUser({user_data}: RootNavigationUserProps) {

  const {
    notifications,
    readAllNotificationsMutation,
    combinedNotifications,
    unread_notifications,
    readNotificationMutation
  } = useHeader(user_data);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={"relative"}>
          <Image src={"/icons/svg/primary-notification.svg"} width={35} height={35} alt={"notification icon"}/>
          {unread_notifications > 0 && (
            <span className='absolute z-10 top-4 left-6 bg-red-600 text-white text-xs rounded-full flex justify-center items-center h-5 w-5 aspect-square'>
              {unread_notifications}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={"start"} className="w-72 p-0 bg-secondary-bg max-h-[400px] overflow-auto">
        <div className="grid gap-4 p-4 relative bg-secondary-bg shadow-2xl">
          <h4 className="font-bold leading-none top-0 sticky p-4 bg-secondary-bg w-full z-10 border-b border-primary-text">お知らせ</h4>
          {notifications.length > 0 ? (
            <>
              {combinedNotifications.map((notification, idx) => {

                const timeDiff = new Date().getTime() - new Date(notification.notification_date).getTime();

                const text = getTimeAgo(timeDiff);

                let descriptionMsg = '';
                switch (notification.type) {
                  case "like" :
                    descriptionMsg = notification.duplicate_count && notification.duplicate_count > 1 ? `${notification.duplicate_count} people has liked your recipe!` :`${notification.user_codename} has liked your recipe!`;
                    break;
                  case "comment":
                    descriptionMsg = notification.duplicate_count && notification.duplicate_count > 1 ? `${notification.duplicate_count} people has commented on your recipe!` :`${notification.user_codename} has commented on your recipe!`;
                    break;
                }

                return (
                  (
                    <Link onClick={() => readNotificationMutation.mutate(notification.notification_id)} href={"/recipe/show/" + notification.recipe_id + "/" + notification.recipe_name} key={idx} className="mb-2 relative grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0">
                      {!notification.is_read ? (
                        <span className="flex h-2 w-2 relative top-2 translate-y-1.5 rounded-full bg-primary-text" />
                      ) : (
                        <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-transparent" />
                      )}
                      <div className="grid gap-1">
                        <div className="text-sm flex gap-2 items-center font-medium">
                          <Image
                            src={notification.user_image}
                            alt={`${notification.user_codename}'s user image`}
                            className={"rounded-full"}
                            width={30}
                            height={30}
                          />
                          <p>{descriptionMsg}</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
                      </div>
                    </Link>
                  )
                )
              })}
              <ButtonX onClick={() => {readAllNotificationsMutation.mutate()}} disabled={readAllNotificationsMutation.isPending} variant="outline" className="mt-4">
                {readAllNotificationsMutation.isPending && <Image alt={"circle loading svg"} src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"} />} Mark All as Read
              </ButtonX>
            </>
          ) : (
            <h1>You have no notifications!</h1>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
export default function RootNavigationUser({user_data}: RootNavigationUserProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationUser user_data={user_data} />
      </Provider>
    </QueryClientProvider>
  )
}