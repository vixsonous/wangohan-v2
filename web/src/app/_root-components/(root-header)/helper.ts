import z from "zod";
import {UserSchema} from "@/types/user-types.user";
import {useEffect} from "react";
import {
  addNotification,
  readAllNotifications,
  setNotification
} from "@/app/_root-components/(root-header)/notifications-slice";
import {EventSchema} from "@/types/event-types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useMutation} from "@tanstack/react-query";
import {ClientApiService} from "@/lib/client-utils";
import {displayNotification} from "@/app/_root-components/(root-header)/root-nav-user";

export const useHeader = (user_data: z.infer<typeof UserSchema.User>) => {

  const notifications = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();
  const readAllNotificationsMutation = useMutation({
    mutationFn: () => ClientApiService.get("/set-user-notifications-read"),
    onSuccess: () => dispatch(readAllNotifications())
  });

  useEffect(() => {
    if(!user_data.user_details) return;
    dispatch(setNotification(user_data.notifications));

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
  }, []);

  return {
    notifications,
    readAllNotificationsMutation,
    combinedNotifications,
    unread_notifications
  }
}