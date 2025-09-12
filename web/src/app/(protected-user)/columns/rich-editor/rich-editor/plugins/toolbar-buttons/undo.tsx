"use client";

import {UNDO_COMMAND} from "lexical";
import Button from "@/components/Button";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import Image from "@/components/Image/client";

export default function Undo() {

  const state = useSelector((state: RootState) => state.editorState);
  const [editor] = useLexicalComposerContext();

  return (
    <Button
      disabled={!state.toolbar_actions.undo}
      onClick={() => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
      }}
      className="toolbar-item spaced"
      aria-label="Undo"
    >
      <Image src={"/icons/svg/primary-arrow-clockwise.svg"} alt={"icon for undo"} width={20} height={20}/>
    </Button>
  )
}