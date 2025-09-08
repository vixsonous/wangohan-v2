"use client";

import {useEffect} from "react";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";
import {toast} from "sonner";
import {EventSchema} from "@/types/event-types";
import Image from "@/components/Image/client";
import Link from "next/link";
import {Provider, useDispatch, useSelector} from "react-redux";
import {RootState, store} from "@/store/store";
import {addNotification, readAllNotifications} from "@/app/_root-components/(root-header)/notifications-slice";
import Button from "@/components/Button";
import {Button as ButtonX} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

type RootNavigationUserProps = {
  user_data: z.infer<typeof UserSchema.User>;
}

function displayNotification(header_msg: string, description_msg: string, data: z.infer<typeof EventSchema.Event>) {
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

  const notifications = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!user_data.user_details) return;

    const event = new EventSource( process.env.NEXT_PUBLIC_ORIGIN + "/api/recipe-events?user_id=" + user_data.user_id+ "&user_codename=" + user_data.user_details.user_codename, {withCredentials: true});
    event.onmessage = (event) => {
      const data: z.infer<typeof EventSchema.Event> = JSON.parse(event.data);
      let headerMsg = '';
      let descriptionMsg = '';

      switch (data.type) {
        case "like" :
          headerMsg = `${data.user_codename} liked your recipe!`;
          descriptionMsg = `has liked your recipe!`;
          displayNotification(
            headerMsg,
            descriptionMsg,
            data
          );
          dispatch(addNotification(data));
          break;
        case "comment":
          headerMsg = `${data.user_codename} commented on your recipe!`;
          descriptionMsg = `has commented on your recipe!`;
          displayNotification(
            headerMsg,
            descriptionMsg,
            data
          );
          dispatch(addNotification(data));
          break;
      }
    }

    return () => {
      event.onmessage = null;
    }
  }, [user_data]);

  const unread_notifications = notifications.filter(notification => !notification.is_read).length;
  const combinedNotifications = notifications.reduce((acc: Array<z.infer<typeof EventSchema.Event>>, curNotification) => {
    const existingNotification = acc.find(
      notification =>
        notification.recipe_id === curNotification.recipe_id &&
        notification.type === curNotification.type
    );

    if(existingNotification) {
      existingNotification.duplicate_count = (existingNotification.duplicate_count || 0) + 1;
    } else {
      acc.push({...curNotification, duplicate_count: curNotification.duplicate_count || 1});
    }

    return acc;
  }, [])
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={"relative"}>
          <Image src={"/icons/svg/primary-notification.svg"} width={35} height={35} alt={"notification icon"}/>
          <span className='absolute z-10 top-4 left-6 bg-red-600 text-white text-xs rounded-full flex justify-center items-center h-5 w-5 aspect-square'>
            {unread_notifications}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={"start"} className="w-72 p-0 bg-secondary-bg max-h-[400px] overflow-auto">
        <div className="grid gap-4 p-4 relative bg-secondary-bg shadow-2xl">
          <h4 className="font-bold leading-none top-0 sticky p-4 bg-secondary-bg w-full z-10 border-b border-primary-text">お知らせ</h4>
          {notifications.length > 0 ? (
            <>
              {combinedNotifications.map((notification, idx) => {
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
                    <Link href={"/recipe/show/" + notification.recipe_id + "/" + notification.recipe_name} key={idx} className="mb-2 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0">
                      {!notification.is_read ? (
                        <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-primary-text" />
                      ) : (
                        <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-transparent" />
                      )}
                      <div className="grid gap-1">
                        <p className="text-sm flex gap-2 items-center font-medium">
                          <Image
                            src={notification.user_image}
                            alt={`${notification.user_codename}'s user image`}
                            className={"rounded-full"}
                            width={30}
                            height={30}
                          />
                          {descriptionMsg}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">5 min ago</p>
                      </div>
                    </Link>
                  )
                )
              })}
              <ButtonX onClick={() => dispatch(readAllNotifications())} variant="outline" className="mt-4">
                Mark All as Read
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
    <Provider store={store}>
      <NavigationUser user_data={user_data} />
    </Provider>
  )
}