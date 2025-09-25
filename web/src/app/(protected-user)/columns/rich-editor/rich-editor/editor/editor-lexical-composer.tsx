import {editorConfig} from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor-config";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {LinkPlugin} from "@lexical/react/LexicalLinkPlugin";
import ImagesPlugin from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/ImagePlugin";
import YouTubePlugin from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/YoutubePlugin";
import {FontSizePlugin} from "@/app/(protected-user)/columns/rich-editor/nodes/FontSizeNode";
import {FontColorPlugin} from "@/app/(protected-user)/columns/rich-editor/nodes/FontColorNode";
import {TablePlugin} from "@lexical/react/LexicalTablePlugin";
import {FontBackgroundColorNodePlugin} from "@/app/(protected-user)/columns/rich-editor/nodes/FontBackgroundColorNode";
import {FontFamilyPlugin} from "@/app/(protected-user)/columns/rich-editor/nodes/FontNode";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import React, {memo, useEffect } from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {customGenerateHtmlFromNodes} from "@/app/(protected-user)/columns/rich-editor/lib/GenerateHtml";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {
  setEditorState,
  setHTMLString
} from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-slice";
import dynamic from "next/dynamic";
import SpinLoader from "@/components/SpinLoader";
import "@/app/(protected-user)/columns/rich-editor/rich-editor/style.css";
import { SubmitErrorHandler, SubmitHandler} from "react-hook-form";
import z from "zod";
import InitEditor from "@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/components/init-editor";
import {BlogSchema} from "@/types/blog-types";
import UpdateBlogButton from "@/app/(protected-user)/columns/edit/[blogId]/[blogTitle]/components/update-blog-button";
import CreateBlogButton from "@/app/(protected-user)/columns/create/components/create-blog-button";

export type HandleSubmit = (onValid: SubmitHandler<{
  blog_id?: number | undefined,
  title: string
  category: string
  editor_state: string
  file: string
}>, onInvalid?: (SubmitErrorHandler<{
  blog_id?: number | undefined,
  title: string
  category: string
  editor_state: string
  file: string
}> | undefined)) => (e?: React.BaseSyntheticEvent) => Promise<void>;

const ToolbarPlugin = dynamic(
  () => import("@/app/(protected-user)/columns/rich-editor/rich-editor/plugins/ToolbarPlugin"),
  {ssr: false, loading: () => <SpinLoader />
  })

const OnChangePlugin = memo(function OnChangePlugin() {
  const [editor] = useLexicalComposerContext();
  const dispatch = useDispatch();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editor.read(() => {
        const jsonState = editorState.toJSON();
        dispatch(setEditorState(JSON.stringify(jsonState)))
        const html = customGenerateHtmlFromNodes(editor);
        dispatch(setHTMLString(html));
        sessionStorage.setItem("editor", JSON.stringify(jsonState));
      });
    });
  }, [editor, dispatch]);
  return null;
});


export default function EditorLexicalComposer({handleSubmit, blog}: {
  handleSubmit: HandleSubmit,
  blog?: z.infer<typeof BlogSchema.Blog> | undefined;
}) {

  const editorState = useSelector((state: RootState) => state.editorState);

  return (
    <LexicalComposer
      initialConfig={{ ...editorConfig, editorState: editorState.editorState }}
    >
      <div
        className="editor-container"
        style={{ margin: "0", marginTop: "1em", maxWidth: "none" }}
      >
        <InitEditor blog={blog} />
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input py-2 px-4 w-full h-auto rounded-b-md text-xs md:text-sm bg-secondary-bg"
                aria-placeholder={"Enter some text"}
                placeholder={
                  <div className="editor-placeholder">{"Enter some text"}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          {/* <AutoFocusPlugin /> */}
          <LinkPlugin />
          {/*{!states.titleFocus && <AutoLinkPlugin matchers={MATCHERS} />}*/}
          <ImagesPlugin />
          <OnChangePlugin />
          <YouTubePlugin />
          <FontSizePlugin />
          <FontColorPlugin />
          <TablePlugin />
          <FontBackgroundColorNodePlugin />
          <FontFamilyPlugin />
        </div>
      </div>
      <div className="w-full flex justify-center gap-2 items-center mt-8">
        {blog === undefined ? (
          <CreateBlogButton handleSubmit={handleSubmit} />
        ) : (
          <UpdateBlogButton handleSubmit={handleSubmit} blog={blog} />
        )}
      </div>
      <div
        className="mt-8 max-w-full whitespace-pre-wrap break-all"
        dangerouslySetInnerHTML={{ __html: editorState.htmlString }}
      ></div>
    </LexicalComposer>
  )
}