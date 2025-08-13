"use client";

import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import PersonalInfoForm from "@/app/(auth)/signup/personal-info/personal-info-form";

export default function PersonalInfoFormWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <PersonalInfoForm/>
    </QueryClientProvider>
  )
}