"use client";

import z from "zod";
import {UserSchema} from "@/types/user-types.user";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import SidebarMenu from "@/app/_root-components/root-sidebar-menu";

export default function RootSidebarMenuWrapper({user_data}: {user_data: z.infer<typeof UserSchema.User> | undefined}) {

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarMenu user_data={user_data} />
    </QueryClientProvider>
  )
}