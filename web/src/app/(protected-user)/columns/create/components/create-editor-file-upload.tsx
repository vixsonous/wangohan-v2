"use client";

import {Control, Controller} from "react-hook-form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import InputField from "@/components/Input";
import z from "zod";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";

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
  return (
    <Controller
      render={({field}) => (
        <Popover>
          <PopoverTrigger asChild={true}>
            <Button>
              {field.value ? field.value.name : "Filename"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={"flex flex-col gap-2 bg-secondary-bg"}>
            <Dialog>
              <DialogTrigger asChild={true}>
                <Button className={"w-full"}>
                  Uploaded Images
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Uploaded Images</DialogTitle>
                <h1>Hello Child</h1>
              </DialogContent>
            </Dialog>
            <label htmlFor={"file"} className={"cursor-pointer"}>
              <Button className={"pointer-events-none w-full"}>Upload File</Button>
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