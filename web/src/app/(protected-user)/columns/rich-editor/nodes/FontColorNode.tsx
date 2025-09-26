import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  createCommand,
  EditorConfig,
  LexicalCommand,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  TextModeType,
  TextNode,
} from "lexical";

export class FontColorNode extends TextNode {
  __color: string;

  constructor(text: string, color: string, key?: NodeKey) {
    super(text, key);
    this.__color = color;
  }

  static getType(): string {
    return "fontColor";
  }

  static clone(node: FontColorNode): FontColorNode {
    return new FontColorNode(node.__text, node.__color, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement("p");
    element.style.color = config.theme.color;
    return element;
  }

  updateDOM(
  ): boolean {
    return false;
  }

  exportJSON(): SerializedFontColorNode {
    return {
      ...super.exportJSON(),
      color: this.__color,
      type: "fontColor",
      version: 2,
    };
  }

  static importJSON(serializedNode: SerializedFontColorNode): FontColorNode {
    const node = $createFontColorNode(
      serializedNode.text,
      serializedNode.color
    );
    node.setDetail(serializedNode.detail);
    node.setFormat(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
}

export function $createFontColorNode(
  text: string,
  color: string
): FontColorNode {
  return new FontColorNode(text, color);
}

export function $isFontColorNode(node: FontColorNode): node is FontColorNode {
  return node instanceof FontColorNode;
}

export const FORMAT_FONTCOLOR_COMMAND: LexicalCommand<string> =
  createCommand("changeFontColor");

export function FontColorPlugin(): null {
  const [editor] = useLexicalComposerContext();
  if (!editor.hasNodes([FontColorNode])) {
    throw new Error(
      "FontColorPlugin: FontColorNode not registered on the editor (initialConfig.nodes)"
    );
  }

  editor.registerCommand(
    FORMAT_FONTCOLOR_COMMAND,
    (color: string) => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: `${color}` || "#0000000" });
      }

      return true;
    },
    COMMAND_PRIORITY_HIGH
  );

  return null;
}

export type SerializedFontColorNode = Spread<
  {
    detail: number;
    format: number;
    mode: TextModeType;
    style: string;
    text: string;
    color: string;
  },
  SerializedLexicalNode
>;
