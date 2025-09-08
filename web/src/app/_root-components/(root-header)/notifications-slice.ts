import {createSlice} from "@reduxjs/toolkit";
import z from "zod";
import {EventSchema} from "@/types/event-types";

type AddNotificationPayload = {
  payload: Array<z.infer<typeof EventSchema.Event>> | z.infer<typeof EventSchema.Event>;
  type: string;
}

export const notificationsSlice = createSlice({
  name: 'Notification',
  initialState: [] as Array<z.infer<typeof EventSchema.Event>>,
  reducers: {
    addNotification(state, action: AddNotificationPayload) {
      if(Array.isArray(action.payload)) {
        state = state.concat(action.payload);
      } else {
        const pl = action.payload as z.infer<typeof EventSchema.Event>;
        const exist = state.find(n => n.type === pl.type && n.user_codename === pl.user_codename && n.recipe_id === pl.recipe_id);

        if(!exist) {
          state.unshift(action.payload);
        }

      }

      return state;
    },
    readAllNotifications(state) {
      return state.map(notification => ({...notification, is_read: true}));
    }
  }
})

export const {addNotification, readAllNotifications} = notificationsSlice.actions;
export default notificationsSlice.reducer;