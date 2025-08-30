"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {toast} from "sonner";
import {Toaster} from "@/components/ui/sonner";

export default function GoogleLoginSuccess() {
  const searchParams = useSearchParams();
  const googleLoginSuccess = searchParams.get("google-login-success");
  const router = useRouter();
  useEffect(() => {
    if(googleLoginSuccess) {
      toast.success("Successful!", {description: "Successfully logged in!"});
      router.replace("/");
    }
  }, [googleLoginSuccess]);
  return <Toaster richColors position="top-center"/>;
}