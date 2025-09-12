"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeOfType, $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_TAB_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  RangeSelection,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { $createAutoLinkNode, $createLinkNode, $isLinkNode } from "@lexical/link";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isListNode, ListNode } from "@lexical/list";
import { $isCodeNode, getDefaultCodeLanguage } from "@lexical/code";

import React, { memo, useCallback, useEffect, useRef } from "react";
import { FORMAT_FONTCOLOR_COMMAND } from "@/app/(protected-user)/columns/rich-editor/nodes/FontColorNode";
import { FORMAT_FONTBACKGROUNDCOLOR_COMMAND } from "@/app/(protected-user)/columns/rich-editor/nodes/FontBackgroundColorNode";
import useToolbarStates from "./toolbar-states";
import useEditorHelper from "../editor-helper";
import FetchedImageList from "../fetched-image-list";
import ImageUploadSelection from "../image-upload-selection";
import JustifyGroup from "./toolbar-groups/justify-group";
import ImageYoutube from "./toolbar-groups/image-youtube";
import TextMod from "./toolbar-groups/text-mod";
import FontSizeDropdown from "./toolbar-groups/font-size";
import TextHeading from "./toolbar-buttons/text-heading";
import FontFamily from "./toolbar-groups/font-family";
import useToolbarHelper from "./toolbar-helper";
import { $createTableNodeWithDimensions } from "@lexical/table";
import Button from "@/components/Button";
import {SeparatorVertical} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useDispatch, useSelector} from "react-redux";
import {
  setBlockType, setCodeLanguage,
  setColors, setSelectedElementKey,
  setTextFormats,
  setToolbarActions
} from "@/app/(protected-user)/columns/create/components/create-editor-slice";
import {RootState} from "@/store/store";
import Undo from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/undo";
import Redo from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/redo";
import AddTable from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/add-table";
import AddLink from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/toolbar-buttons/add-link";

const LowPriority = 1;
const IconSize = 20;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.editorState);

  const toolbarRef = useRef(null);
  const states = useToolbarStates();
  const editorHelper = useEditorHelper();
  const tbHelper = useToolbarHelper(editor, states);
  const numRows = useRef<HTMLInputElement>(null);
  const numCols = useRef<HTMLInputElement>(null);
  const linkText = useRef<HTMLInputElement>(null);
  const linkUrl = useRef<HTMLInputElement>(null);

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
          const computedStyle = window.getComputedStyle(elementDOM);
          const fontSize = computedStyle.fontSize;

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
        }
      }
      // Update text format

      // Update links
      const node = tbHelper.getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        dispatch(setTextFormats({field: "link", value: true}));
      } else {
        dispatch(setTextFormats({field: "link", value: false}));
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
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
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar bg-secondary-bg flex flex-wrap" ref={toolbarRef}>
      <Undo />
      <Redo />
      <Separator orientation={'vertical'} />
      <TextHeading />
      <Separator orientation={'vertical'}/>
      <AddTable />
      <Separator orientation={'vertical'}/>
      <AddLink />
      <Separator orientation={'vertical'}/>
      {/*<FontFamily states={states} editor={editor} />*/}
      <Separator orientation={'vertical'}/>
      {/*<FontSizeDropdown states={states} editor={editor} />*/}
      <Separator orientation={'vertical'}/>
      <Button
        className={
          "toolbar-item spaced cursor-pointer " +
          (state.text_formats.bold ? "active" : "")
        }
        aria-label="Format Bold"
      >
        <label
          htmlFor="text-color"
          className="flex gap-1 items-center cursor-pointer"
        >
          {/*<TextAa size={IconSize} className="cursor-pointer" />*/}
          <input
            // onChange={tbHelper.fontColorOnChange}
            type="color"
            id="text-color"
            // value={states.fontColor}
            className="bg-none p-0 cursor-pointer w-2"
          />
        </label>
      </Button>
      <Button
        className={
          "toolbar-item flex justify-center items-center spaced cursor-pointer " +
          (state.text_formats.bold ? "active" : "")
        }
        aria-label="Format Bold"
        // onClick={tbHelper.resetFontColor}
      >
        {/*<ArrowClockwise size={IconSize - 4} />*/}
      </Button>
      <Separator orientation={'vertical'}/>
      <Button
        className={
          "toolbar-item spaced cursor-pointer " +
          (state.text_formats.bold ? "active" : "")
        }
        aria-label="Format Bold"
      >
        <label
          htmlFor="text-background-color"
          className="flex gap-1 items-center cursor-pointer"
        >
          {/*<PaintBucket size={IconSize} className="cursor-pointer" />*/}
          {/*<input*/}
          {/*  // onChange={tbHelper.fontBackgroundColorOnChange}*/}
          {/*  type="color"*/}
          {/*  id="text-background-color"*/}
          {/*  value={state.colors.background}*/}
          {/*  className="bg-none p-0 cursor-pointer w-2"*/}
          {/*/>*/}
        </label>
      </Button>
      <Button
        className={
          "toolbar-item flex justify-center items-center spaced cursor-pointer " +
          (state.text_formats.bold ? "active" : "")
        }
        aria-label="Format Bold"
        // onClick={tbHelper.resetFontBackgroundColor}
      >
        {/*<ArrowClockwise size={IconSize - 4} />*/}
      </Button>
      <Separator orientation={'vertical'}/>
      <Button
        // className={
        //   "toolbar-item flex justify-center items-center spaced cursor-pointer " +
        //   (states.isBold ? "active" : "")
        // }
        aria-label="Format Bold"
        // onClick={tbHelper.resetFontBackgroundColor}
      >
        {/*<ArrowClockwise size={IconSize - 4} />*/}
      </Button>
      <Separator orientation={'vertical'}/>
      <Button
        onClick={() => {
          // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (state.text_formats.bold ? "active" : "")}
        aria-label="Format Bold"
      >
        {/*<TextBolder size={IconSize} />*/}
      </Button>
      <Button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (state.text_formats.italic ? "active" : "")}
        aria-label="Format Italics"
      >
        {/*<TextItalic size={IconSize} />*/}
      </Button>
      <Button
        // onClick={() => {
        //   editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        // }}
        // className={
        //   "toolbar-item spaced " + (states.isUnderline ? "active" : "")
        // }
        aria-label="Format Underline"
      >
        {/*<TextUnderline size={IconSize} />*/}
      </Button>
      <Button
        // onClick={() => {
        //   editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        // }}
        // className={
        //   "toolbar-item spaced " + (states.isUnderline ? "active" : "")
        // }
        aria-label="Format Code"
      >
        {/*<BracketsAngle size={IconSize} />*/}
      </Button>
      {/*<TextMod states={states} editor={editor} />*/}
      <Separator orientation={'vertical'}/>
      {/*<ImageYoutube states={states} dispatch={dispatch} editor={editor} />*/}
      <Separator orientation={'vertical'}/>
      {/*<JustifyGroup states={states} editor={editor} />*/}
      {/*<Modal modalIdProps={modalIds.toolbarpluginModal}>*/}
      {/*  {states.modalMode === "image-upload" ? (*/}
      {/*    <ImageUploadSelection*/}
      {/*      states={states}*/}
      {/*      dispatch={dispatch}*/}
      {/*      toolbar={editorHelper}*/}
      {/*      editor={editor}*/}
      {/*    />*/}
      {/*  ) : (*/}
      {/*    <FetchedImageList*/}
      {/*      states={states}*/}
      {/*      dispatch={dispatch}*/}
      {/*      toolbar={editorHelper}*/}
      {/*      editor={editor}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</Modal>*/}
      {/*<Modal modalIdProps={modalIds.addTableModal}>*/}
      {/*  <div className="relative bg-secondary-bg flex flex-col gap-4 z-[999] py-4 px-8 rounded-lg">*/}
      {/*    <div className="flex flex-col gap-1">*/}
      {/*      <p>Number of rows</p>*/}
      {/*      <input*/}
      {/*        ref={numRows}*/}
      {/*        className="w-[100%] text-[12px] sm:text-[16px] px-[10px] py-[10px] border-[2px] rounded-md border-[#ffcd92]"*/}
      {/*        type="number"*/}
      {/*        name="add-table-rows"*/}
      {/*        placeholder="Rows"*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className="flex flex-col gap-1">*/}
      {/*      <p>Number of columns</p>*/}
      {/*      <input*/}
      {/*        ref={numCols}*/}
      {/*        className="w-[100%] text-[12px] sm:text-[16px] px-[10px] py-[10px] border-[2px] rounded-md border-[#ffcd92]"*/}
      {/*        type="number"*/}
      {/*        name="add-table-columns"*/}
      {/*        placeholder="Columns"*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <Button*/}
      {/*      onClick={() => {*/}
      {/*        if(!numRows.current || !numCols.current) return;*/}
      
      {/*        const numR = numRows.current.value;*/}
      {/*        const numC = numCols.current.value;*/}
      
      {/*        editor.update(() => {*/}
      {/*          const tableNode = $createTableNodeWithDimensions(Number(numR || 0),Number(numC || 0), false);*/}
      {/*          $insertNodeToNearestRoot(tableNode);*/}
      {/*        });*/}
      {/*        dispatch.hideModal();*/}
      {/*      }}*/}
      {/*      className={`w-[100%] bg-[#ffb762] border-[1px] border-primary-text text-primary-text py-2 rounded-md text-sm font-semibold`}*/}
      {/*    >*/}
      {/*      <span>Add Table</span>*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*</Modal>*/}
      {/*<Modal modalIdProps={modalIds.addLinkModal}>*/}
      {/*  <div className="relative bg-secondary-bg flex flex-col gap-4 z-[999] py-4 px-8 rounded-lg">*/}
      {/*    <div className="flex flex-col gap-1">*/}
      {/*      <p>Link Text</p>*/}
      {/*      <input*/}
      {/*        ref={linkText}*/}
      {/*        className="w-[100%] text-[12px] sm:text-[16px] px-[10px] py-[10px] border-[2px] rounded-md border-[#ffcd92]"*/}
      {/*        type="text"*/}
      {/*        name="add-link-text"*/}
      {/*        placeholder="Enter link text"*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className="flex flex-col gap-1">*/}
      {/*      <p>Link URL</p>*/}
      {/*      <input*/}
      {/*        ref={linkUrl}*/}
      {/*        className="w-[100%] text-[12px] sm:text-[16px] px-[10px] py-[10px] border-[2px] rounded-md border-[#ffcd92]"*/}
      {/*        type="text"*/}
      {/*        name="add-link-url"*/}
      {/*        placeholder="Enter link URL"*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <Button*/}
      {/*      onClick={() => {*/}
      {/*        if(!linkText.current || !linkUrl.current) return;*/}
      
      {/*        const vlinkText = linkText.current.value;*/}
      {/*        const vlinkUrl = linkUrl.current.value;*/}
      
      {/*        const filteredUrl = vlinkUrl.startsWith("https://") || vlinkUrl.startsWith("http://") ? vlinkUrl : "https://" + vlinkUrl;*/}
      
      {/*        editor.update(() => {*/}
      {/*          const selection = $getSelection();*/}
      {/*          const link = $createLinkNode(filteredUrl, {target: '_blank'});*/}
      {/*          const text = $createTextNode(vlinkText);*/}
      {/*          link.append(text);*/}
      {/*          if($isRangeSelection(selection)) {*/}
      {/*            selection.anchor.getNode().insertAfter(link);*/}
      {/*          }*/}
      {/*        });*/}
      {/*        dispatch.hideModal();*/}
      {/*      }}*/}
      {/*      className={`w-[100%] bg-[#ffb762] border-[1px] border-primary-text text-primary-text py-2 rounded-md text-sm font-semibold`}*/}
      {/*    >*/}
      {/*      <span>Add Link</span>*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*</Modal>*/}
    </div>
  );
}
