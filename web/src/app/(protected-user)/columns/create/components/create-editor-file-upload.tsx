"use client";

import {Control, Controller} from "react-hook-form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button as ButtonUI} from "@/components/ui/button";
import InputField from "@/components/Input";
import z from "zod";
import React, {useState} from "react";
import dynamic from "next/dynamic";

const UploadedImages = dynamic(() => import("@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/components/uploaded-images"),
  {ssr: false, loading: () => <span>Loading</span>}
)

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

  const [popoverOpen, setPopoverOpen] = useState(false);

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
            <UploadedImages action={(i) => {
                const newFile = new File([new Blob([''])], i.blog_image_url);
                  field.onChange(newFile);
                  setPopoverOpen(false);
               }}>
              <ButtonUI className={"w-full"}>
                Uploaded Images
              </ButtonUI>
            </UploadedImages>
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