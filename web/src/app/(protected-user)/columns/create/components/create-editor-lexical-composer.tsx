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
import {Button} from "@/components/ui/button";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {customGenerateHtmlFromNodes} from "@/app/(protected-user)/columns/rich-editor/lib/GenerateHtml";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {
  setEditorState,
  setHTMLString
} from "@/app/(protected-user)/columns/create/components/create-editor-slice";
import dynamic from "next/dynamic";
import SpinLoader from "@/components/SpinLoader";
import "@/app/(protected-user)/columns/rich-editor/rich-editor/style.css";
import {FieldValues, SubmitErrorHandler, SubmitHandler} from "react-hook-form";
import z from "zod";
import {useMutation} from "@tanstack/react-query";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosResponse} from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

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
  }, [editor]);
  return null;
});


export default function CreateEditorLexicalComposer({handleSubmit}: {
  handleSubmit:  (onValid: SubmitHandler<{
    title: string
    category: string
    editor_state: string
    file: z.core.File
  }>, onInvalid?: (SubmitErrorHandler<{
    title: string
    category: string
    editor_state: string
    file: z.core.File
  }> | undefined)) => (e?: React.BaseSyntheticEvent) => Promise<void>
}) {

  const editorState = useSelector((state: RootState) => state.editorState);
  const router = useRouter();

  const submitBlogMutation = useMutation({
    mutationFn: ({data, publish} : {data: FieldValues, publish: boolean}) =>
      ClientApiService.post("/post-blog?publish=" + publish, data),
    onSuccess: (response: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      toast.success("Successful!", {description: message});
      router.push("/columns/list/1");
      router.refresh();
    },
    onError: (err: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(err);
      toast.error("Error!", {description: message});
    }
  })

  return (
    <LexicalComposer
      initialConfig={{ ...editorConfig, editorState: editorState.editorState }}
    >
      <div
        className="editor-container"
        style={{ margin: "0", marginTop: "1em", maxWidth: "none" }}
      >
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
        <Button disabled={submitBlogMutation.isPending} onClick={handleSubmit((data: FieldValues) => submitBlogMutation.mutate({data, publish: true}))} type={"button"}>
          {submitBlogMutation.isPending && <SpinLoader />} Post Blog
        </Button>
        <Button disabled={submitBlogMutation.isPending} onClick={handleSubmit((data: FieldValues) => submitBlogMutation.mutate({data, publish: false}))} type={"button"}>
          {submitBlogMutation.isPending && <SpinLoader />} Save blog
        </Button>
      </div>
      <div
        className="mt-8 max-w-full whitespace-pre-wrap break-all"
        dangerouslySetInnerHTML={{ __html: editorState.htmlString }}
      ></div>
    </LexicalComposer>
  )
}