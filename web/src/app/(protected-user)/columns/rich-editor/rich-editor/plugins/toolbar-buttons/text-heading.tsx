
import useTextHeadingHelper from "../toolbar-groups/text-heading-helper";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import React from "react";
import {Separator} from "@/components/ui/separator";

const TextHeading = () => {
  const state = useSelector((state: RootState) => state.editorState);

  const textHeading = useTextHeadingHelper();
  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button type={"button"} className={"flex items-center gap-2"}>
          <Image src={`/icons/svg/primary-${state.block_type}.svg`} alt={"icon for undo"} width={20} height={20}/>
          {state.block_type.charAt(0).toUpperCase() + state.block_type.slice(1)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"sm:max-w-max p-0"}>
        <ul className={"flex flex-col bg-secondary-bg items-center rounded-md"}>
          <li
            className={`flex items-center justify-between w-full rounded-t-md`}
          >
            <Button
              type={"button"}
              onClick={textHeading.formatHeading}
              name="paragraph-0"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.block_type === "paragraph" ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Image Insert"
            >
              <Image src={"/icons/svg/primary-paragraph.svg"} alt={"icon for undo"} width={20} height={20}/>
              <span>Paragraph</span>
            </Button>
          </li>
          <Separator />
          <li
            className={`flex items-center justify-between w-full`}
          >
            <Button
              type={"button"}
              onClick={textHeading.formatHeading}
              name="h1-1"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.block_type === "h1" ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Image Insert"
            >
              <Image src={"/icons/svg/primary-h1.svg"} alt={"icon for undo"} width={20} height={20}/>
              <span>H1 Heading</span>
            </Button>
          </li>
          <Separator />
          <li
            className={`flex items-center justify-between w-full`}
          >
            <Button
              type={"button"}
              onClick={textHeading.formatHeading}
              name="h2-2"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.block_type === "h2" ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Image Insert"
            >
              <Image src={"/icons/svg/primary-h2.svg"} alt={"icon for undo"} width={20} height={20}/>
              <span>H2 Heading</span>
            </Button>
          </li>
          <Separator />
          <li
            className={`flex items-center justify-between w-full rounded-b-md`}
          >
            <Button
              type={"button"}
              onClick={textHeading.formatHeading}
              name="h3-3"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.block_type === "h3" ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Image Insert"
            >
              <Image src={"/icons/svg/primary-h3.svg"} alt={"icon for undo"} width={20} height={20}/>
              <span>H3 Heading</span>
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default TextHeading;
