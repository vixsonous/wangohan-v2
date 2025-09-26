"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection, $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  INDENT_CONTENT_COMMAND,
  KEY_TAB_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $isLinkNode } from "@lexical/link";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isListNode, ListNode } from "@lexical/list";
import { $isCodeNode, getDefaultCodeLanguage } from "@lexical/code";

import React, {useCallback, useEffect, useRef} from "react";
import useToolbarStates from "./toolbar-states";
import JustifyGroup from "./toolbar-groups/justify-group";
import ImageYoutube from "./toolbar-groups/image-youtube";
import TextMod from "./toolbar-groups/text-mod";
import FontSizeDropdown from "./toolbar-groups/font-size";
import TextHeading from "./toolbar-buttons/text-heading";
import FontFamily from "./toolbar-groups/font-family";
import useToolbarHelper from "./toolbar-helper";
import {Separator} from "@/components/ui/separator";
import {useDispatch, useSelector} from "react-redux";
import {
  setBlockType, setCodeLanguage,
  setColors, setFontFamily, setFontSize, setSelectedElementKey, setTextAlignment,
  setTextFormats,
  setToolbarActions
} from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-slice";
import {RootState} from "@/store/store";
import Undo from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/undo";
import Redo from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/redo";
import AddTable from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/add-table";
import AddLink from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/add-link";
import { FORMAT_FONTSIZE_COMMAND} from "@/app/(protected-user)/columns/rich-editor/nodes/FontSizeNode";
import FontColor, {
  BG_COLOR,
  FONT_COLOR
} from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/font-color";
import TextFormat from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/bold";

const LowPriority = 1;
export const DEFAULT_FONT_SIZE = "15";
export const DEFAULT_FONT_FAMILY = "mitimasu";

export type FONT_FAMILY_LIST = "sans" | "sans-serif" | "mitimasu";

export const FONT_SIZE_FIELD = "font-size: ";
export const FONT_FAMILY_FIELD = "font-family: ";

export const SEMICOLON_DELIMITER = ";";
export const PIXEL_DELIMITER = "px;";

export const FORMAT_NO_FORMAT = 0;
export const FORMAT_LEFT_FORMAT = 1;
export const FORMAT_CENTER_FORMAT = 2;
export const FORMAT_RIGHT_FORMAT = 3;
export const FORMAT_JUSTIFY_FORMAT = 4;
export const FORMAT_START_FORMAT = 5;
export const FORMAT_END_FORMAT = 6;

export const LEFT_FORMAT = "left";
export const CENTER_FORMAT = "center";
export const RIGHT_FORMAT = "right";
export const JUSTIFY_FORMAT = "justify";

function ToolbarSeparator() {
  return (
    <Separator className={"bg-primary-text/30 min-h-[20px]"} orientation={"vertical"} />
  )
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.editorState);

  const toolbarRef = useRef(null);
  const states = useToolbarStates();
  const tbHelper = useToolbarHelper(editor, states);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      dispatch(setTextFormats({field: "bold", value: selection.hasFormat("bold")}));
      dispatch(setTextFormats({field: "italic", value: selection.hasFormat("italic")}));
      dispatch(setTextFormats({field: "underline", value: selection.hasFormat("underline")}));
      dispatch(setTextFormats({field: "strikethrough", value: selection.hasFormat("strikethrough")}));
      dispatch(setTextFormats({field: "subscript", value: selection.hasFormat("subscript")}));
      dispatch(setTextFormats({field: "superscript", value: selection.hasFormat("superscript")}));
      dispatch(setTextFormats({field: "code", value: selection.hasFormat("code")}));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();


      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        dispatch(setSelectedElementKey(elementKey));
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          dispatch(setBlockType(type));
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          dispatch(setBlockType(type));

          dispatch(setColors({field: "font", value: selection.style.includes("color:")
              ? selection.style.split("color: ")[1].split(";")[0] || "#523636"
              : "#523636"}));

          dispatch(setColors({field: "background", value: selection.style.includes("background:")
              ? selection.style.split("background: ")[1].split(";")[0] ||
              "#FFE9C9"
              : "#FFE9C9"}));

          if ($isCodeNode(element)) {
            dispatch(setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage()));
          }

          // Update font size and text font
          const nodes = selection.getNodes();
          nodes.forEach((node) => {

            if($isTextNode(node) && node.__style) {
              // Update font size
              if(node.__style.includes(FONT_SIZE_FIELD)) {
                const size = node.__style.split(FONT_SIZE_FIELD)[1].split(PIXEL_DELIMITER)[0];
                dispatch(setFontSize(size));
              } else {
                dispatch(setFontSize(DEFAULT_FONT_SIZE));
              }

              // Update text font
              if(node.__style.includes(FONT_FAMILY_FIELD)) {
                const font = node.__style.split(FONT_FAMILY_FIELD)[1].split(SEMICOLON_DELIMITER)[0];
                dispatch(setFontFamily(font as FONT_FAMILY_LIST));
              } else {
                dispatch(setFontFamily(DEFAULT_FONT_FAMILY));
              }

            } else {
              dispatch(setFontFamily(DEFAULT_FONT_FAMILY));
              dispatch(setFontSize(DEFAULT_FONT_SIZE));
            }
          });
        }
      }
      // Update text alignment
      switch (element.getFormat()) {
        case FORMAT_NO_FORMAT: case FORMAT_LEFT_FORMAT: case FORMAT_START_FORMAT: dispatch(setTextAlignment({field: LEFT_FORMAT, value: true}));break;
        case FORMAT_CENTER_FORMAT: dispatch(setTextAlignment({field: CENTER_FORMAT, value: true}));break;
        case FORMAT_RIGHT_FORMAT: case FORMAT_END_FORMAT: dispatch(setTextAlignment({field: RIGHT_FORMAT, value: true}));break;
        case FORMAT_JUSTIFY_FORMAT: dispatch(setTextAlignment({field: JUSTIFY_FORMAT, value: true}));break;
      }


      // Update links
      const node = tbHelper.getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        dispatch(setTextFormats({field: "link", value: true}));
      } else {
        dispatch(setTextFormats({field: "link", value: false}));
      }
    }
  }, [dispatch, editor, tbHelper]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        FORMAT_FONTSIZE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          dispatch(setToolbarActions({field: "undo", value: payload}));
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          dispatch(setToolbarActions({field: "redo", value: payload}));
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (payload) => {
          const event: KeyboardEvent = payload;
          event.preventDefault();
          return editor.dispatchCommand(
            event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND,
            undefined
          );
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, $updateToolbar, state.font.size, dispatch]);

  return (
    <div className="toolbar bg-secondary-bg flex flex-wrap gap-2 items-center" ref={toolbarRef}>
      <Undo />
      <Redo />
      <ToolbarSeparator />
      <TextHeading />
      <ToolbarSeparator />
      <AddTable />
      <ToolbarSeparator />
      <AddLink />
      <ToolbarSeparator />
      <FontFamily />
      <ToolbarSeparator />
      <FontSizeDropdown />
      <ToolbarSeparator />
      <FontColor type={FONT_COLOR}/>
      <FontColor type={BG_COLOR}/>
      <ToolbarSeparator />
      <TextFormat type={"bold"} />
      <TextFormat type={"italic"} />
      <TextFormat type={"underline"} />
      <TextFormat type={"code"} />
      <ToolbarSeparator />
      <TextMod />
      <ToolbarSeparator />
      <ImageYoutube />
      <ToolbarSeparator />
      <JustifyGroup />
    </div>
  );
}
