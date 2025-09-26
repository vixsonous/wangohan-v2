import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  createCommand,
  LexicalCommand,
   LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  TextModeType,
  TextNode,
} from "lexical";

export class FontSizeNode extends TextNode {
  __size: string;

  constructor(text: string, size: string, key?: NodeKey) {
    super(text, key);
    this.__size = size;
  }

  static getType(): string {
    return "fontSize";
  }

  static clone(node: FontSizeNode): FontSizeNode {
    return new FontSizeNode(node.__text, node.__size, node.__key);
  }

  createDOM(): HTMLElement {
    const element = document.createElement("span");
    element.style.fontSize = this.__size + "px";
    element.textContent = this.getTextContent();
    return element;
  }

  updateDOM(
  ): boolean {
    return false;
  }

  exportJSON(): SerializedFontSizeNode {
    return {
      ...super.exportJSON(),
      size: this.__size,
      type: "fontSize",
      version: 2,
    };
  }

  static importJSON(serializedNode: SerializedFontSizeNode): FontSizeNode {
    const node = $createFontSizeNode(serializedNode.text, serializedNode.size);
    node.setDetail(serializedNode.detail);
    node.setFormat(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
}

export function $createFontSizeNode(text: string, size: string): FontSizeNode {
  return new FontSizeNode(text, size);
}

export function $isFontSizeNode(node: LexicalNode): node is FontSizeNode {
  return node instanceof FontSizeNode;
}

export const FORMAT_FONTSIZE_COMMAND: LexicalCommand<string> =
  createCommand("changeFontSize");

export function FontSizePlugin(): null {
  const [editor] = useLexicalComposerContext();
  if (!editor.hasNodes([FontSizeNode])) {
    throw new Error(
      "FontSizePlugin: FontSizeNode not registered on the editor (initialConfig.nodes)"
    );
  }

  editor.registerCommand(
    FORMAT_FONTSIZE_COMMAND,
    (size: string) => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-size": `${size}px` || "16px" });
      }

      return true;
    },
    COMMAND_PRIORITY_HIGH
  );

  return null;
}

export type SerializedFontSizeNode = Spread<
  {
    detail: number;
    format: number;
    mode: TextModeType;
    style: string;
    text: string;
    size: string;
  },
  SerializedLexicalNode
>;
