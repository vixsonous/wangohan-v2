"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import LoginForm from "./login-form";
import { queryClient } from "@/lib/tanstack-query";
import {useEffect} from "react";
import {toast} from "sonner";
import {useSearchParams} from "next/navigation";
import {Toaster} from "@/components/ui/sonner";

export default function LoginWrapper() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if(error) {
      toast.error("Error!", {description: error});
    }
  }, [error]);
  return (
    <QueryClientProvider client={queryClient}>
      <LoginForm />
      <Toaster richColors position="top-center"/>
    </QueryClientProvider>
  )
}