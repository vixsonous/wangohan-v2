

import { FORMAT_FONTFAMILY_COMMAND } from "@/app/(protected-user)/columns/rich-editor/nodes/FontNode";
import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import {Separator} from "@/components/ui/separator";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {setFontFamily} from "@/app/(protected-user)/columns/create/components/create-editor-slice";

const FONT_TEXT = {
  'mitimasu': "Mitimasu",
  'sans': "Sans",
  'sans-serif': 'Sans Serif',
}

const FontFamily = () => {

  const [editor] = useLexicalComposerContext();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.editorState);

  const fontFamilyOnChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    const font = name.split("_")[0] as "sans" | "sans-serif" | "mitimasu";
    editor.dispatchCommand(FORMAT_FONTFAMILY_COMMAND, font);
    dispatch(setFontFamily(font));
  }
  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button type={"button"} className={"flex items-center gap-2"}>
          {FONT_TEXT[state.font.family as keyof typeof FONT_TEXT]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"sm:max-w-max p-0"}>
        <ul className={"flex flex-col bg-secondary-bg items-center rounded-md"}>
          <li
            className={`flex items-center justify-between w-full rounded-t-md`}
          >
            <Button
              type={"button"}
              onClick={fontFamilyOnChange}
              name="sans-serif_0"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.block_type === "paragraph" ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Font Family Sans Serif"
            >
              <span>Sans Serif</span>
            </Button>
          </li>
          <Separator />
          <li
            className={`flex items-center justify-between w-full`}
          >
            <Button
              type={"button"}
              onClick={fontFamilyOnChange}
              name="sans_1"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.block_type === "h1" ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Font Family Sans"
            >
              <Image src={"/icons/svg/primary-h1.svg"} alt={"icon for undo"} width={20} height={20}/>
              <span>Sans</span>
            </Button>
          </li>
          <Separator />
          <li
            className={`flex items-center justify-between w-full`}
          >
            <Button
              type={"button"}
              onClick={fontFamilyOnChange}
              name="mitimasu_2"
              className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.block_type === "h2" ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
              aria-label="Font Family Mitimasu"
            >
              <Image src={"/icons/svg/primary-h2.svg"} alt={"icon for undo"} width={20} height={20}/>
              <span>Mitimasu</span>
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default FontFamily;
