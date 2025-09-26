
import {
  FORMAT_TEXT_COMMAND,
  LexicalCommand,
  TextFormatType,
} from "lexical";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import {Separator} from "@/components/ui/separator";
import React from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";

const TextMod = () => {

  const [editor] = useLexicalComposerContext();
  const state = useSelector((state: RootState) => state.editorState);
  const handleButtonClick =
    (command: LexicalCommand<TextFormatType>, payload: TextFormatType) =>
    () =>
      editor.dispatchCommand(command, payload);
  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button className={"flex items-center gap-2"}>
          <Image src={`/icons/svg/primary-aa.svg`} alt={"icon for undo"} width={20} height={20}/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"sm:max-w-max p-0"}>
        <ul className={"flex flex-col bg-secondary-bg items-center rounded-md"}>
          <li
            className={`flex items-center justify-between w-full rounded-t-md`}
          >
            <Button
              onClick={handleButtonClick(FORMAT_TEXT_COMMAND, "strikethrough")}
              name="paragraph-0"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.text_formats.strikethrough ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Image Insert"
            >
              <Image src={"/icons/svg/primary-paragraph.svg"} alt={"icon for undo"} width={20} height={20}/>
              <span>Strikethrough</span>
            </Button>
          </li>
          <Separator />
          <li
            className={`flex items-center justify-between w-full`}
          >
            <Button
              onClick={handleButtonClick(FORMAT_TEXT_COMMAND, "subscript")}
              name="h1-1"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.text_formats.subscript ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Image Insert"
            >
              <Image src={"/icons/svg/primary-h1.svg"} alt={"icon for undo"} width={20} height={20}/>
              <span>Subscript</span>
            </Button>
          </li>
          <Separator />
          <li
            className={`flex items-center justify-between w-full`}
          >
            <Button
              onClick={handleButtonClick(FORMAT_TEXT_COMMAND, "superscript")}
              name="h2-2"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.text_formats.superscript ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Image Insert"
            >
              <Image src={"/icons/svg/primary-h2.svg"} alt={"icon for undo"} width={20} height={20}/>
              <span>Superscript</span>
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default TextMod;
