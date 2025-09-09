"use client";

import {QueryClientProvider, useMutation} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import Button from "@/components/Button";
import { Button as ButtonUI} from "@/components/ui/button";
import {toast} from "sonner";
import Image from "@/components/Image/client";
import React from "react";
import {useRouter} from "next/navigation";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";

function DeleteButton({recipe_id, recipe_name, user_id}: {recipe_id: number, recipe_name: string, user_id: number}) {

  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: (recipe_id: number) => ClientApiService.delete(`/archive-recipe?recipe_id=${recipe_id}&recipe_name=${recipe_name}&recipe_user_id=${user_id}&is_archive=true`),
    onSuccess: (response: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      toast.success("Successful!", {description: message});
      router.push("/");
      router.refresh();
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild={true} >
        <Button className={"w-full hover:bg-error hover:text-secondary-bg data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"}>
          <span className={"w-full text-left"}>Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete recipe?
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this recipe?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            Cancel
          </DialogClose>
          <ButtonUI disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(recipe_id)} variant={"destructive"}>
            {deleteMutation.isPending && <Image alt={"circle loading svg"} src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"} />}
             Delete
          </ButtonUI>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ShowRecipeDropdownDelete({recipe_id, recipe_name, user_id}: {recipe_id: number, recipe_name: string, user_id: number}) {
  return (
    <QueryClientProvider client={queryClient}>
      <DeleteButton recipe_id={recipe_id} recipe_name={recipe_name} user_id={user_id} />
    </QueryClientProvider>
  )
}