"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import LoginForm from "./login-form";
import { queryClient } from "@/lib/tanstack-query";

export default function LoginWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>
  )
}