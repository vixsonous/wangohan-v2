"use client";
import React, {useState} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {INSERT_YOUTUBE_COMMAND} from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/YoutubePlugin";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Button from "@/components/Button";
import {Button as ButtonUI} from "@/components/ui/button";
import Image from "@/components/Image/client";
import {Separator} from "@/components/ui/separator";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import InputField from "@/components/Input";
import {INSERT_IMAGE_COMMAND} from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/ImagePlugin";
import dynamic from "next/dynamic";

const UploadedImages = dynamic(() => import("@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/components/uploaded-images"),
  {ssr: false, loading: () => (
      <li
        className={`flex items-center justify-between w-full rounded-t-md`}
      >
        <Button
          name="paragraph-0"
          disabled={true}
          className={`toolbar-item spaced disabled:bg-secondary-bg/30 flex gap-4 p-2 w-full bg-secondary-bg hover:bg-primary-bg/30`}
          aria-label="Image Insert"
        >
          <Image src={"/icons/svg/primary-paragraph.svg"} alt={"icon for undo"} width={20} height={20}/>
          <span>Image</span>
        </Button>
      </li>
    )}
)

function fillUrl(url: string) {
  const match =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(
      url || ""
    );

  const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;

  if (id != null) {
    return id;
  }

  return "";
}

const ImageYoutube = () => {

  const [editor] = useLexicalComposerContext();

  const [url, setUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleYoutubeInsert = () => (e: React.MouseEvent<HTMLButtonElement>) => {
    const url = prompt("Enter the URL of the YouTube video:", "");
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, fillUrl(url || ""));
  }

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button className={"flex items-center gap-2"}>
          <Image src={`/icons/svg/primary-plus.svg`} alt={"icon for undo"} width={20} height={20}/>
          Insert Image/Video
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"sm:max-w-max p-0"}>
        <ul className={"flex flex-col bg-secondary-bg items-center rounded-md"}>

          <UploadedImages action={(i) => {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              altText: i.blog_image_title,
              src: i.blog_image_url.startsWith("r2://") ?
                process.env.NEXT_PUBLIC_BUCKET_URL + "/" + i.blog_image_url.split("r2://")[1] :
                i.blog_image_url,
              width: 500,
            });
          }}>
            <li
              className={`flex items-center justify-between w-full rounded-t-md`}
            >
              <Button
                name="image-button"
                className={`toolbar-item spaced flex gap-4 p-2 w-full bg-secondary-bg hover:bg-primary-bg/30`}
                aria-label="Image Insert"
              >
                <Image src={"/icons/svg/primary-image.svg"} alt={"icon for undo"} width={20} height={20}/>
                <span>Image</span>
              </Button>
            </li>
          </UploadedImages>
          <Separator />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild={true}>
              <li
                className={`flex items-center justify-between w-full`}
              >
                <Button
                  onClick={handleYoutubeInsert}
                  name="h1-1"
                  className={`toolbar-item spaced flex gap-4 p-2 w-full bg-secondary-bg hover:bg-primary-bg/30`}
                  aria-label="Youtube Insert"
                >
                  <Image src={"/icons/svg/primary-h1.svg"} alt={"icon for youtube"} width={20} height={20}/>
                  <span>Youtube</span>
                </Button>
              </li>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Enter youtube URL</DialogTitle>
              <p>
                <span>リンクURL</span>
                <InputField type={"url"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if(!e.currentTarget.value) return;
                  setUrl(e.currentTarget.value);
                }} />
              </p>
              <ButtonUI onClick={() => {
                editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, fillUrl(url || ""));
                setDialogOpen(false);
              }}>
                テーブルを追加
              </ButtonUI>
            </DialogContent>
          </Dialog>
        </ul>
      </PopoverContent>
    </Popover>
    // <Dropdown
    //   openIcon={
    //     <ButtonIcon>
    //       <Plus />
    //       <ButtonText>Insert</ButtonText>
    //       <CaretDown size={REGICONSIZE} />
    //     </ButtonIcon>
    //   }
    //   closeIcon={
    //     <ButtonIcon>
    //       <Plus />
    //       <ButtonText>Insert</ButtonText>
    //       <CaretDown size={REGICONSIZE} />
    //     </ButtonIcon>
    //   }
    // >
    //   <ul className=" flex flex-col gap-2 bg-secondary-bg items-center rounded-md border border-primary-text">
    //     <li
    //       className={`flex items-center justify-between w-full px-2 ${
    //         states.icons.justifyIdx === 0 ? "bg-primary-bg" : ""
    //       } rounded-t-md`}
    //     >
    //       <Button
    //         onClick={imgYtHelper.displayImageSelection}
    //         className="toolbar-item spaced flex gap-4"
    //         aria-label="Image Insert"
    //       >
    //         <Image size={REGICONSIZE} />
    //         <ButtonText>Image</ButtonText>
    //       </Button>
    //     </li>
    //     <li className={`flex items-center justify-between w-full px-2`}>
    //       <Button
    //         onClick={handleYoutubeInsert(editor)}
    //         className="toolbar-item spaced flex gap-4"
    //         aria-label="Youtube Video"
    //       >
    //         <YoutubeLogo size={REGICONSIZE} />
    //         <ButtonText>Youtube Video</ButtonText>
    //       </Button>
    //     </li>
    //   </ul>
    // </Dropdown>
  );
};

export default ImageYoutube;
