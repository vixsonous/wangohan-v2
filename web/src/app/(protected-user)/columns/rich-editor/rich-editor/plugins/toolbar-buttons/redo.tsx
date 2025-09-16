"use client";

import {REDO_COMMAND} from "lexical";
import Button from "@/components/Button";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import Image from "@/components/Image/client";

export default function Redo() {
  const state = useSelector((state: RootState) => state.editorState);
  const [editor] = useLexicalComposerContext();

  return (
    <Button
      type={"button"}
      disabled={!state.toolbar_actions.redo}
      onClick={() => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
      }}
      className="toolbar-item"
      aria-label="Redo"
    >
      <Image src={"/icons/svg/primary-arrow-counter-clockwise.svg"} alt={"icon for redo"} width={20} height={20}/>
    </Button>
  )
}