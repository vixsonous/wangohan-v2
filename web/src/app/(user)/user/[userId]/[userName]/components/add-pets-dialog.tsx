"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import React from "react";
import dynamic from "next/dynamic";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
const AddPetForm = dynamic(() => import("./add-pets-form"), {ssr: false, loading: () => <span>Loading</span>})

export default function AddPetsDialog({user_id}: {user_id: number}) {

  return (
    <Dialog>
      <DialogTrigger>
        <span className="text-lg font-bold cursor-pointer hover:brightness-50 transition-all">愛犬を登録する</span>
      </DialogTrigger>
      <DialogContent draggable={true} className={"sm:max-w-2xl"}>
        <DialogHeader>
          <DialogTitle>
            Add your pet!
          </DialogTitle>
          <DialogDescription>
            Add your pet here!
          </DialogDescription>
        </DialogHeader>
        <QueryClientProvider client={queryClient}>
          <AddPetForm user_id={user_id} />
        </QueryClientProvider>
      </DialogContent>
    </Dialog>
  )
}