import { constructImportMap, exportMap } from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor-config";
import { createEditor, ParagraphNode, TextNode } from "lexical";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImageNode } from "@/app/(protected-user)/columns/rich-editor/nodes/ImageNode";
import { YouTubeNode } from "@/app/(protected-user)/columns/rich-editor/nodes/YoutubeNode";
import { HeadingNode } from "@lexical/rich-text";
import { IndentationNode } from "@/app/(protected-user)/columns/rich-editor/nodes/IndentationNode";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import ExampleTheme from "@/app/(protected-user)/columns/rich-editor/rich-editor/Theme";
import { customGenerateHtmlFromNodes } from "@/app/(protected-user)/columns/rich-editor/lib/GenerateHtml";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import z from "zod";
import {BlogSchema} from "@/types/blog-types";

export default function useColumnDisplay(blogData: z.infer<typeof BlogSchema.Blog>) {
  const [htmlString, setHtmlString] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Create a new Lexical editor instance
    if (!blogData) {
      router.push("/");
      return;
    }

    const editor = createEditor({
      namespace: "Display",
      html: {
        export: exportMap,
        import: constructImportMap(),
      },
      nodes: [
        ParagraphNode,
        TextNode,
        LinkNode,
        AutoLinkNode,
        ImageNode,
        YouTubeNode,
        HeadingNode,
        IndentationNode,
        TableNode,
        TableRowNode,
        TableCellNode
      ],
      onError(error: Error) {
        throw error;
      },
      theme: ExampleTheme,
    });

    // Parse the JSON and set it as the editor state
    const parsedEditorState = editor.parseEditorState(
      JSON.stringify(blogData.editor_state)
    );
    editor.setEditorState(parsedEditorState);
    editor.read(() => {
      // Convert the editor state to HTML
      const html = customGenerateHtmlFromNodes(editor);
      setHtmlString(html);
    });
  }, [blogData, router]);

  return {
    htmlString,
  };
}