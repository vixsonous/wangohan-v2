import { $getSelection, $isRangeSelection } from "lexical";
import { useMemo } from "react";
import { $wrapNodes } from "@lexical/selection";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $createParagraphNode } from "lexical";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {setBlockType} from "@/app/(protected-user)/columns/create/components/create-editor-slice";

const useTextHeadingHelper = () => {

  const [editor] = useLexicalComposerContext();
  const state = useSelector((state: RootState) => state.editorState);
  const dispatch = useDispatch();
  return useMemo(
    () => ({
      formatHeading(e: React.MouseEvent<HTMLButtonElement>) {
        const nameDetail = e.currentTarget.name;
        const name = nameDetail.split("-")[0];

        if (state.block_type !== "paragraph" || state.block_type !== name) {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              const selection = $getSelection();

              if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () =>
                  $createHeadingNode(name as HeadingTagType)
                );
                dispatch(setBlockType(name));

              }
            }
          });
        } else {
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              const selection = $getSelection();

              if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () => $createParagraphNode());
                dispatch(setBlockType("paragraph"));
              }
            }
          });
        }
      },
    }),
    [editor]
  );
};

export default useTextHeadingHelper;
