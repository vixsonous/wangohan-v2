import Button from "@/components/Button";
import React from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {FORMAT_TEXT_COMMAND} from "lexical";
import Image from "@/components/Image/client";

type TextFormatProps = {
  type: "bold" | "italic" | "underline" | "code";
}

export default function TextFormat({type}: TextFormatProps) {

  const [editor] = useLexicalComposerContext();
  return (
    <Button
      type={"button"}
      aria-label={`Format ${type}`}
      onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, type)}
    >
      <Image src={`/icons/svg/primary-${type}.svg`} alt={"icon for bold text"} width={20} height={20}/>
    </Button>
  )
}