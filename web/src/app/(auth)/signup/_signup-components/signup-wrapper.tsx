"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/tanstack-query";
import dynamic from "next/dynamic";

const SignupForm =
  dynamic(() => import("./signup-form"), {ssr: false});

export default function SignupWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <SignupForm />
    </QueryClientProvider>
  )
}