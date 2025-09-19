import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useEffect} from "react";
import z from "zod";
import {BlogSchema} from "@/types/blog-types";

export default function InitEditor({blog}: {blog?: z.infer<typeof BlogSchema.Blog> | undefined;}) {

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if(blog) {
      editor.update(() => {
        const state = editor.parseEditorState(blog.editor_state);
        editor.setEditorState(state);
      })
    }

  }, [blog, editor]);
  return null;
}