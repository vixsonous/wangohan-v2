import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import React, {useState} from "react";
import InputField from "@/components/Input";
import {Button as ButtonUI} from "@/components/ui/button";
import Button from "@/components/Button";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$createTextNode, $getSelection, $isRangeSelection} from "lexical";
import {$createLinkNode} from "@lexical/link";

export default function AddLink() {

  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState({
    text: "",
    link: ""
  });

  const fieldOnChange = (field: keyof typeof link) =>
    (e:React.ChangeEvent<HTMLInputElement>) => {
      if(e.currentTarget === null) return;

      setLink(prev => ({...prev, [field]: e.target.value}));
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={true}>
        <Button type={"button"}>
          Add Link
        </Button>
      </DialogTrigger>
      <DialogContent className={""}>
        <DialogTitle>リンクを追加</DialogTitle>
        <p>
          <span>リンクテキスト</span>
          <InputField type={"text"} onChange={fieldOnChange("text")} />
        </p>
        <p>
          <span>リンクURL</span>
          <InputField type={"url"} onChange={fieldOnChange("link")} />
        </p>
        <ButtonUI type={"button"} onClick={() => {
          const vlinkText = link.text;
          const vlinkUrl = link.link;

          const filteredUrl = vlinkUrl.startsWith("https://") || vlinkUrl.startsWith("http://") ? vlinkUrl : "https://" + vlinkUrl;

          editor.update(() => {
            const selection = $getSelection();
            const link = $createLinkNode(filteredUrl, {target: '_blank'});
            const text = $createTextNode(vlinkText);
            link.append(text);
            if($isRangeSelection(selection)) {
              selection.anchor.getNode().insertAfter(link);
            }
          });
          setOpen(false);
        }}>
          リンクを追加
        </ButtonUI>
      </DialogContent>
    </Dialog>
  )
}