"use client";

import {Control, Controller} from "react-hook-form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button as ButtonUI} from "@/components/ui/button";
import Button from "@/components/Button";
import InputField from "@/components/Input";
import z from "zod";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {BlogImageSchema, GetBlogImagesSchema} from "@/types/blog-types";
import Image from "@/components/Image/client";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {PaginationWithLinks} from "@/app/(public)/recipe/list/[pageNo]/components/pagination-with-links";
import React, {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";
import {addUploadedImages} from "@/app/(protected-user)/columns/create/components/create-editor-slice";
import {toast} from "sonner";
import SpinLoader from "@/components/SpinLoader";

type CreateEditorFileUploadProps = {
  control: Control<{
    title: string
    category: string
    editor_state: string
    file: z.core.File
  }, any, {
    title: string
    category: string
    editor_state: string
    file: z.core.File
  }>
}
export default function CreateEditorFileUpload({control}: CreateEditorFileUploadProps) {

  const uploadedImages: z.infer<typeof BlogImageSchema.BlogImages>=  useSelector((state: RootState) => state.editorState.uploadedImages);
  const totalUploadedImages: number = useSelector((state: RootState) => state.editorState.total_blog_images);

  const [page, setPage] = useState(2);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const dispatch = useDispatch();

  const moreImagesMutation = useMutation({
    mutationFn: (page: number) => ClientApiService.get("/get-blog-images?page_no=" + page),
    onSuccess: (response: AxiosResponse) => {
      const blogList = ClientApiResponseService.getAxiosResponseData<z.infer<typeof GetBlogImagesSchema.GetBlogImages>>(response);
      dispatch(addUploadedImages(blogList.blog_images));
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      toast.success("Successful!", {description: message});
      setPage(prev => prev + 1);
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  return (
    <Controller
      render={({field}) => (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild={true}>
            <ButtonUI>
              {field.value ? field.value.name : "Filename"}
            </ButtonUI>
          </PopoverTrigger>
          <PopoverContent className={"flex flex-col gap-2 bg-secondary-bg"}>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild={true}>
                <ButtonUI className={"w-full"}>
                  Uploaded Images
                </ButtonUI>
              </DialogTrigger>
              <DialogContent className={"sm:max-w-5xl px-2 sm:px-4"}>
                <DialogTitle className={"text-primary-text"}>Uploaded Images</DialogTitle>
                <Separator className={"bg-primary-text"} />
                <ScrollArea className={"w-full flex justify-center max-h-[400px] sm:max-h-[600px]"}>
                  {uploadedImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {uploadedImages.map( (i, idx) => (
                        <Button onClick={() => {
                          const newFile = new File([new Blob([''])], i.blog_image_url);
                          field.onChange(newFile);
                          setDialogOpen(false);
                          setPopoverOpen(false);
                        }} key={idx} className={"w-full"}>
                          <Image className={"aspect-square"} src={i.blog_image_url} alt={i.blog_image_title} width={250} height={250} />
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <h1>No uploaded images</h1>
                  )}
                </ScrollArea>
                <Separator className={"bg-primary-text"}/>
                <div className={"flex w-full justify-center"}>
                  {uploadedImages.length < totalUploadedImages && (
                    <ButtonUI disabled={moreImagesMutation.isPending} onClick={() => moreImagesMutation.mutate(page)} className={"flex self-center"}>
                      {moreImagesMutation.isPending && <SpinLoader />} More Images
                    </ButtonUI>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <label htmlFor={"file"} className={"cursor-pointer"}>
              <ButtonUI className={"pointer-events-none w-full"}>Upload File</ButtonUI>
              <InputField id={"file"} type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if(!e.currentTarget.files) return;

                field.onChange(e.currentTarget.files[0]);
              }} hidden={true}/>
            </label>
          </PopoverContent>
        </Popover>
      )}
      name={"file"}
      control={control}
    />
  )
}