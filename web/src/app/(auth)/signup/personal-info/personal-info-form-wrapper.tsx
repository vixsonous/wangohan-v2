"use client";

import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import dynamic from "next/dynamic";

const PersonalInfoForm = dynamic(() => import("@/app/(auth)/signup/personal-info/personal-info-form"), {ssr: false, loading: () => <span>Loading</span>})

export default function PersonalInfoFormWrapper({user_id}: {user_id: number}) {
  return (
    <QueryClientProvider client={queryClient}>
      <PersonalInfoForm user_id={user_id}/>
    </QueryClientProvider>
  )
}