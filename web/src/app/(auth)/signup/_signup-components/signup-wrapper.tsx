"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import SignupForm from "./signup-form";
import { queryClient } from "@/lib/tanstack-query";

export default function SignupWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <SignupForm />
    </QueryClientProvider>
  )
}