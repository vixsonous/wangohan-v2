import {
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  LexicalCommand,
} from "lexical";
import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import {Separator} from "@/components/ui/separator";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import { useSelector} from "react-redux";
import {RootState} from "@/store/store";

const elementFormats = [
  {type: "left" as ElementFormatType, text: "Left Align"},
  {type: "right" as ElementFormatType, text: "Right Align"},
  {type: "center" as ElementFormatType, text: "Center Align"},
  {type: "justify" as ElementFormatType, text: "Justify Align"},
  {type: "start" as ElementFormatType, text: "Start Align"},
  {type: "end" as ElementFormatType, text: "End Align"},
]

const ElementFormatTypeObject = {
  LEFT: {type: "left" as ElementFormatType, text: "Left Align"},
  RIGHT: { type: "right" as ElementFormatType, text: "Right Align"},
  CENTER: {type: "center" as ElementFormatType, text: "Center Align"},
  JUSTIFY: {type: "justify" as ElementFormatType, text: "Justify Align"},
  START: {type: "start" as ElementFormatType, text: "Start Align"},
  END: {type: "end" as ElementFormatType, text: "End Align"},
};

const JustifyGroup = () => {

  const [editor] = useLexicalComposerContext();
  const state = useSelector((state: RootState) => state.editorState);
  const handleDispatchCommand =
    (
      command: LexicalCommand<ElementFormatType>,
      payload: ElementFormatType,
    ) =>
    () => {
      editor.dispatchCommand(command, payload as ElementFormatType);
    }

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button className={"flex items-center gap-2"}>
          {Object.keys(state.align).map((align, idx) => {
            if(state.align[align as keyof typeof state.align]) {
              return <React.Fragment key={idx} >
                <Image src={`/icons/svg/primary-align-${ElementFormatTypeObject[String(align).toUpperCase() as keyof typeof ElementFormatTypeObject].type}.svg`} alt={"icon for undo"} width={20} height={20}/>
                {ElementFormatTypeObject[String(align).toUpperCase() as keyof typeof ElementFormatTypeObject].text}
              </React.Fragment>;
            }
          })}

        </Button>
      </PopoverTrigger>
      <PopoverContent className={"sm:max-w-max p-0"}>
        <ul className={"flex flex-col bg-secondary-bg items-center rounded-md"}>
          {elementFormats.map((format, idx)=> (
            <React.Fragment key={idx}>
              <li
                className={`flex items-center justify-between w-full rounded-t-md`}
              >
                <Button
                  onClick={handleDispatchCommand(
                    FORMAT_ELEMENT_COMMAND,
                    format.type
                  )}
                  name={format.text}
                  className={`toolbar-item spaced flex gap-4 p-2 w-full ${state.align[format.type as keyof typeof state.align] ? 'bg-primary-bg' : 'bg-secondary-bg'} hover:bg-primary-bg/30`}
                  aria-label="Image Insert"
                >
                  <Image src={`/icons/svg/primary-align-${format.type}.svg`} alt={"icon for undo"} width={20} height={20}/>
                  <span>{format.text}</span>
                </Button>
              </li>
              <Separator />
            </React.Fragment>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default JustifyGroup;
