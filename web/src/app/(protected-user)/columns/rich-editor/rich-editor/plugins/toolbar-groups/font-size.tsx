import {
  FORMAT_FONTSIZE_COMMAND
} from "@/app/(protected-user)/columns/rich-editor/nodes/FontSizeNode";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Button from "@/components/Button";
import {Separator} from "@/components/ui/separator";
import React from "react";
import { useSelector} from "react-redux";
import {RootState} from "@/store/store";

const FontSizeDropdown = () => {

  const [editor] = useLexicalComposerContext();
  const sizeState = useSelector((state: RootState) => state.editorState.font.size);

  const handleFontSizeChange =
    (size: string) => () => {
      editor.dispatchCommand(FORMAT_FONTSIZE_COMMAND, size);
    };
  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button type={"button"} aria-label={"Font Size " + sizeState} className={"flex items-center gap-2"}>
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
                    type={"button"}
                    onClick={handleFontSizeChange(String(size))}
                    name="font-size"
                    className={`toolbar-item spaced flex gap-4 px-2 py-1 w-full ${sizeState === String(size) ? "bg-primary-bg" : "bg-secondary-bg"} hover:bg-primary-bg/30`}
                    aria-label={`Font Size ${size}`}
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
  );
};

export default FontSizeDropdown;
