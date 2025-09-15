import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import InputField from "@/components/Input";
import {Button as ButtonUI} from "@/components/ui/button";
import Button from "@/components/Button";
import React, {useState} from "react";
import { $createTableNodeWithDimensions } from "@lexical/table";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";

export default function AddTable() {

  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState({
    rows: 0,
    columns: 0,
  });

  const fieldOnChange = (field: keyof typeof table) =>
    (e:React.ChangeEvent<HTMLInputElement>) => {
      if(e.currentTarget === null) return;
      setTable(prev => ({...prev, [field]: Number(e.target.value)}));
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={true}>
        <Button>
          Add Table
        </Button>
      </DialogTrigger>
      <DialogContent >
        <DialogTitle>
          表の行と列を追加する
        </DialogTitle>
        <section className={"flex items-center gap-2"}>
          <p>
            <span>行数</span>
            <InputField type={"number"} onChange={fieldOnChange("rows")} />
          </p>
          <p>
            <span>列数</span>
            <InputField type={"number"} onChange={fieldOnChange("columns")} />
          </p>
        </section>
        <ButtonUI onClick={() => {

          const numR = table.rows;
          const numC = table.columns;

          editor.update(() => {
            const tableNode = $createTableNodeWithDimensions(Number(numR || 0),Number(numC || 0), false);
            $insertNodeToNearestRoot(tableNode);
          });
          setOpen(false);
        }}>
          テーブルを追加
        </ButtonUI>
      </DialogContent>
    </Dialog>
  )
}