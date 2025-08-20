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

export default function AddPetsDialog() {

  return (
    <Dialog>
      <DialogTrigger>
        <span className="text-lg font-bold cursor-pointer hover:brightness-50 transition-all">愛犬を登録する</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add your pet!
          </DialogTitle>
          <DialogDescription>
            Add your pet here!
          </DialogDescription>
        </DialogHeader>
        <QueryClientProvider client={queryClient}>
          <AddPetForm />
        </QueryClientProvider>
      </DialogContent>
    </Dialog>
  )
}