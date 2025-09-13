
import useToolbarStates from "../toolbar-states";
import {$getSelection, $isRangeSelection, $isTextNode, LexicalEditor} from "lexical";
import {
  FORMAT_FONTSIZE_COMMAND
} from "@/app/(protected-user)/columns/rich-editor/nodes/FontSizeNode";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Button from "@/components/Button";
import {Separator} from "@/components/ui/separator";
import Image from "@/components/Image/client";
import React from "react";
import { useSelector} from "react-redux";
import {RootState} from "@/store/store";

const FontSizeDropdown = () => {

  const [editor] = useLexicalComposerContext();
  const sizeState = useSelector((state: RootState) => state.editorState.font.size);

  const handleFontSizeChange =
    (size: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      editor.dispatchCommand(FORMAT_FONTSIZE_COMMAND, size);
    };
  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button className={"flex items-center gap-2"}>
          {sizeState}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"sm:max-w-max p-0"}>
        <ul className={"flex flex-col bg-secondary-bg items-center rounded-md"}>
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map((size, idx) => {
            return (
              <React.Fragment key={idx}>
                <li
                  className={`flex items-center justify-between w-full rounded-t-md`}
                >
                  <Button
                    onClick={handleFontSizeChange(String(size))}
                    name="sans-serif_0"
                    className={`toolbar-item spaced flex gap-4 px-2 py-1 w-full ${sizeState === String(size) ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
                    aria-label="Image Insert"
                  >
                    <span>{size}</span>
                  </Button>
                </li>
                <Separator />
              </React.Fragment>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
    // <Dropdown
    //   openIcon={states.icons.fontSize}
    //   closeIcon={states.icons.fontSize}
    // >
    //   <ul className=" flex flex-col gap-1 bg-secondary-bg items-center rounded-md border border-primary-text">
    //     {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map(
    //       (s, i) => {
    //         return (
    //           <li
    //             key={i}
    //             className={`flex items-center justify-between w-full px-2 ${
    //               states.icons.fontSizeVal === s ? "bg-primary-bg" : ""
    //             } rounded-md`}
    //           >
    //             <Button
    //               onClick={handleFontSizeChange(String(s))}
    //               name="paragraph"
    //               className="flex px-2 rounded-md"
    //               aria-label="Image Insert"
    //             >
    //               <ButtonText>{s}</ButtonText>
    //             </Button>
    //           </li>
    //         );
    //       }
    //     )}
    //   </ul>
    // </Dropdown>
  );
};

export default FontSizeDropdown;
