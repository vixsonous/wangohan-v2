import {HandleSubmit} from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-lexical-composer";
import {FieldValues} from "react-hook-form";
import SpinLoader from "@/components/SpinLoader";
import {Button} from "@/components/ui/button";
import React from "react";
import {useMutation} from "@tanstack/react-query";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";
import {toast} from "sonner";
import {ENDPOINTS} from "@/constants/endpoints";
import {useRouter} from "next/navigation";
import {ROUTES} from "@/constants/routes";
import z from "zod";
import {BlogSchema} from "@/types/blog-types";

type UpdateBlogButtonProps = {
  handleSubmit: HandleSubmit;
  blog: z.infer<typeof BlogSchema.Blog>;
};

export default function UpdateBlogButton({handleSubmit, blog}: UpdateBlogButtonProps) {

  const router = useRouter();

  const updateBlogMutation = useMutation({
    mutationFn: ({data, publish} : {data: FieldValues, publish: boolean}) =>
      ClientApiService.put(ENDPOINTS.BLOG +"/" + data.blog_id + "?publish=" + publish, data),
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
      <Button disabled={updateBlogMutation.isPending} onClick={handleSubmit((data: FieldValues) => updateBlogMutation.mutate({data, publish: blog.is_published}))} type={"button"}>
        {updateBlogMutation.isPending && <SpinLoader />} Update blog
      </Button>
      <Button disabled={updateBlogMutation.isPending} onClick={handleSubmit((data: FieldValues) => updateBlogMutation.mutate({data, publish: !blog.is_published}))} type={"button"}>
        {updateBlogMutation.isPending && <SpinLoader />} Update & {blog.is_published ? "Unpublish" : "Publish"} blog
      </Button>
    </>
  )
}