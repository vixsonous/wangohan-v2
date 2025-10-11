"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import {useRouter, useSearchParams} from "next/navigation";
import Button from "@/components/Button";
import {ScrollArea} from "@/components/ui/scroll-area";
const AddPetForm = dynamic(() => import("./add-pets-form"), {ssr: false, loading: () => <span>Loading</span>})

export default function AddPetsDialog({user_id}: {user_id: number}) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if(typeof window === 'undefined') return;
    if(searchParams.get("register_pet")) {
      setOpen(true);
      router.replace(window.location.pathname);
    }
  }, [searchParams, router]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={true}>
        <Button type={"button"}>
          <span className="text-lg font-bold cursor-pointer hover:brightness-50 transition-all">愛犬を登録する</span>
        </Button>
      </DialogTrigger>
      <DialogContent draggable={true} className={"sm:max-w-2xl p-0"}>
        <DialogHeader className={"pt-4"}>
          <DialogTitle className={"text-center"}>
            ペットを登録しましょう！
          </DialogTitle>
          <DialogDescription className={"text-center"}>
            ここでペットを登録しましょう！
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className={"max-h-128 px-4 pb-4"}>
          <QueryClientProvider client={queryClient}>
            <AddPetForm user_id={user_id} />
          </QueryClientProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}