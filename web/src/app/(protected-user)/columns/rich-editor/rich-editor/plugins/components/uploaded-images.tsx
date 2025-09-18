"use client";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button as ButtonUI} from "@/components/ui/button";
import SpinLoader from "@/components/SpinLoader";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useMutation} from "@tanstack/react-query";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";
import z from "zod";
import {BlogImageSchema, GetBlogImagesSchema, PostBlogImageSchema} from "@/types/blog-types";
import {
  addUploadedImages,
  prependUploadedImages
} from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-slice";
import {toast} from "sonner";
import InputField from "@/components/Input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {usePersonalForm} from "@/app/(auth)/signup/personal-info/personal-form-helper";
import {Controller, FieldValues, useForm} from "react-hook-form";
import Error from "@/components/Error";
import {ENDPOINTS} from "@/constants/endpoints";

export default function UploadedImages({action, children}: {action: (image: z.infer<typeof BlogImageSchema.BlogImage>) => void, children: React.ReactElement}) {

  const [imgDialogOpen, setImgDialogOpen] = useState(false);

  const [uploadImagePopover, setUploadImagePopover] = useState(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState(2);
  const {blog_images, total_blog_images} = useSelector((state: RootState) => state.editorState);

  const moreImagesMutation = useMutation({
    mutationFn: (page: number) => ClientApiService.get(ENDPOINTS.BLOG + "/images?page_no=" + page),
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

  const uploadBlogImageMutation = useMutation({
    mutationFn: (data: FieldValues) => ClientApiService.post(ENDPOINTS.BLOG + "/images", data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    onSuccess: (response: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      const image: z.infer<typeof BlogImageSchema.BlogImage> = ClientApiResponseService.getAxiosResponseData(response);
      dispatch(prependUploadedImages([image]));
      toast.success("Successful!", {description: message});
      setImgDialogOpen(false);
      setUploadImagePopover(false);
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  })

  const {uploadFileMutation} = usePersonalForm();
  const onSubmit = (data: FieldValues) => uploadBlogImageMutation.mutate(data);
  const { handleSubmit, control, formState: {errors}, register} = useForm<z.infer<typeof PostBlogImageSchema.PostBlogImage>>({
    mode: 'onChange'
  })

  return (
    <Dialog open={imgDialogOpen} onOpenChange={setImgDialogOpen}>
      <DialogTrigger asChild={true}>
        {children}
      </DialogTrigger>
      <DialogContent className={"sm:max-w-5xl px-2 sm:px-4"}>
        <DialogTitle className={"text-primary-text flex items-center gap-2"}>
          Uploaded Images
          {Object.keys(errors).map((err) => (
            <Error>{errors[err as keyof typeof errors]?.message}</Error>
          ))}
          <form>
            <Controller
              render={({field}) => (
                <Popover open={uploadImagePopover}>
                  <PopoverTrigger asChild={true}>
                    <label htmlFor="blog-image-upload" className={"cursor-pointer"}>
                      <ButtonUI type={"button"} className={"pointer-events-none flex gap-2 items-center"}>
                        {uploadFileMutation.isPending && <SpinLoader /> }
                        Upload Image
                      </ButtonUI>
                      <InputField disabled={uploadFileMutation.isPending} hidden={true} onChange={async (e:React.ChangeEvent<HTMLInputElement>) => {
                        if(e.currentTarget.files === null) return;
                        const file = e.currentTarget.files[0];
                        if(file === undefined) return;
                        setUploadImagePopover(false);
                        const processedFile = await uploadFileMutation.mutateAsync(file);
                        setUploadImagePopover(true);
                        field.onChange(processedFile);
                      }} id={"blog-image-upload"} type={"file"} />
                    </label>
                  </PopoverTrigger>
                  <PopoverContent className={"flex items-center flex-col gap-4 bg-secondary-bg"}>
                    <div className={"flex items-center w-full gap-2 justify-between"}>
                      <Image src={"/icons/svg/primary-image.svg"} alt={"image icon for uploaded image"} width={20} height={20}/>
                      <span className={"overflow-hidden max-w-[200px] w-[200px] overflow-ellipsis"}>{field.value && field.value.name}</span>
                    </div>
                    <p className="w-full flex flex-col gap-2">
                      <label className="text-xl font-semibold flex items-baseline gap-2" htmlFor="user_occupation">
                        職業
                        <Error>{errors.blog_image_title?.message}</Error>
                      </label>
                      <InputField
                        aria-invalid={errors.blog_image_title?.message !== undefined}
                        className="sm:text-base" {...register("blog_image_title")}
                        placeholder="Blog Image Alt Text"
                        id="blog_image_title"
                        type="text"
                      />
                    </p>
                    <ButtonUI disabled={uploadBlogImageMutation.isPending} onClick={handleSubmit(onSubmit)} type={"submit"}>
                      {uploadBlogImageMutation.isPending && <SpinLoader />} Upload
                    </ButtonUI>
                  </PopoverContent>
                </Popover>
              )}
              name={"blog_image"}
              control={control}
            />
          </form>
        </DialogTitle>
        <Separator className={"bg-primary-text"} />
        <ScrollArea className={"w-full flex justify-center max-h-[400px] sm:max-h-[600px]"}>
          {blog_images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {blog_images.map( (i, idx) => (
                <Button onClick={() => {
                  action(i);
                  setImgDialogOpen(false);
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
          {blog_images.length < total_blog_images && (
            <ButtonUI disabled={moreImagesMutation.isPending} onClick={() => moreImagesMutation.mutate(page)} className={"flex self-center"}>
              {moreImagesMutation.isPending && <SpinLoader />} More Images
            </ButtonUI>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}