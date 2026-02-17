"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import React, { useState} from "react";
import dynamic from "next/dynamic";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import Button from "@/components/Button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {PetProps} from "@/app/(user)/user/[userId]/[userName]/components/user-pets-carousel";
const PetForm = dynamic(() => import("../pets-form"), {ssr: false, loading: () => <span>Loading</span>})

export default function EditPetDialog({user_id, pet}: {user_id: number, pet: PetProps}) {
  const [open, setOpen] = useState(false);
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
            <PetForm user_id={user_id} pet={pet}/>
          </QueryClientProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}