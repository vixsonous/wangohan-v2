"use client";

import {Control, Controller} from "react-hook-form";
import {Button as ButtonUI} from "@/components/ui/button";
import React from "react";
import dynamic from "next/dynamic";

const UploadedImages = dynamic(() => import("@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/components/uploaded-images"),
  {ssr: false, loading: () => <ButtonUI disabled={true} className={"self-center"}>
      Filename
    </ButtonUI>}
)

/* eslint-disable  @typescript-eslint/no-explicit-any */
type CreateEditorFileUploadProps = {
  control: Control<{
    title: string
    category: string
    editor_state: string
    file: string
  }, any, {
    title: string
    category: string
    editor_state: string
    file: string
  }>
}
export default function EditorFileUpload({control}: CreateEditorFileUploadProps) {


  return (
    <Controller
      render={({field}) => (
        <UploadedImages action={(i) => {
          field.onChange(i.blog_image_url);
        }}>
          <ButtonUI className={"self-center"}>
            {field.value ? field.value : "Filename"}
          </ButtonUI>
        </UploadedImages>
      )}
      name={"file"}
      control={control}
    />
  )
}