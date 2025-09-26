import {HandleSubmit} from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-lexical-composer";
import {Button} from "@/components/ui/button";
import {FieldValues} from "react-hook-form";
import SpinLoader from "@/components/SpinLoader";
import React from "react";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";
import {toast} from "sonner";
import {ENDPOINTS} from "@/constants/endpoints";
import {ROUTES} from "@/constants/routes";

type CreateButtonProps = {
  handleSubmit: HandleSubmit;
};

export default function CreateBlogButton({handleSubmit}: CreateButtonProps) {

  const router = useRouter();

  const submitBlogMutation = useMutation({
    mutationFn: ({data, publish} : {data: FieldValues, publish: boolean}) =>
      ClientApiService.post(ENDPOINTS.BLOG + "?publish=" + publish, data),
    onSuccess: (response: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      toast.success("Successful!", {description: message});
      router.push(ROUTES.COLUMNS);
      router.refresh();
    },
    onError: (err: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(err);
      toast.error("Error!", {description: message});
    }
  });

  return (
    <>
      <Button disabled={submitBlogMutation.isPending} onClick={handleSubmit((data: FieldValues) => submitBlogMutation.mutate({data, publish: true}))} type={"button"}>
        {submitBlogMutation.isPending && <SpinLoader />} Post Blog
      </Button>
      <Button disabled={submitBlogMutation.isPending} onClick={handleSubmit((data: FieldValues) => submitBlogMutation.mutate({data, publish: false}))} type={"button"}>
        {submitBlogMutation.isPending && <SpinLoader />} Save blog
      </Button>
    </>
  )
}