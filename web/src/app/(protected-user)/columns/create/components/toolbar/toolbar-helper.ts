import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setEditor} from "@/app/(protected-user)/columns/create/components/create-editor-slice";

export const useLexicalEditor = () => {
  const [editor] = useLexicalComposerContext();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setEditor(editor));
  }, [editor]);

  return editor;
}