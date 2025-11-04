import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  type ElementFormatType,
  type LexicalEditor,
  type LexicalNode,
  type RangeSelection,
} from "lexical";
import { useEffect, useState } from "react";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $isListNode, ListNode, type ListNodeTagType } from "@lexical/list";
import { $isCodeNode } from "@lexical/code";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $isLinkNode } from "@lexical/link";
import { $getSelectionStyleValueForProperty } from "@lexical/selection";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";
import type { TextColor } from "../ui";
import {
  TEXT_ALIGNMENT_OPTIONS,
  TEXT_COLORS,
} from "../plugins/ToolbarPlugin/config";

export type BlockType = "paragraph" | "h1" | "h2" | "h3" | "code" | "quote";

export type EditorStyleState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  code: boolean;
  isUnorderedList: boolean;
  isOrderedList: boolean;
  isLink: boolean;
  color: TextColor;
  textAlign: ElementFormatType;
};

export function useToolbarState(editor: LexicalEditor) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [formats, setFormats] = useState<EditorStyleState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    isUnorderedList: false,
    isOrderedList: false,
    isLink: false,
    color: TEXT_COLORS[0], // default: "#000000"
    textAlign: TEXT_ALIGNMENT_OPTIONS[0].format,
  });

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              setFormats(getSelectionFormats(selection));
              
              // ✅ OPRAVENO: Získej správný element node
              const anchorNode = selection.anchor.getNode();
              const element =
                anchorNode.getKey() === "root"
                  ? anchorNode
                  : anchorNode.getTopLevelElementOrThrow();
              
              setBlockType(getBlockType(element));
            }
          });
        }),
        editor.registerCommand<boolean>(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanUndo(payload);
            return false;
          },
          1
        ),
        editor.registerCommand<boolean>(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanRedo(payload);
            return false;
          },
          1
        )
      ),
    [editor]
  );

  return { blockType, formats, canUndo, canRedo };
}

function getBlockType(topNode: LexicalNode): BlockType {
  if ($isHeadingNode(topNode)) {
    const tag = topNode.getTag();
    if (["h1", "h2", "h3"].includes(tag)) {
      return tag as BlockType;
    }
  }
  if ($isQuoteNode(topNode)) return "quote";
  if ($isCodeNode(topNode)) return "code";
  return "paragraph";
}

function getSelectionFormats(selection: RangeSelection) {
  const anchorNode = selection.anchor.getNode();
  const parent = anchorNode.getParent();
  const nearestBlockElem = $getNearestBlockElementAncestorOrThrow(anchorNode);
  let topNode = anchorNode.getTopLevelElementOrThrow();

  let listType: ListNodeTagType | undefined;
  if ($isListNode(topNode)) {
    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
    listType = (parentList ?? topNode).getTag();
  }

  const color = $getSelectionStyleValueForProperty(
    selection,
    "color",
    TEXT_COLORS[0]
  );

  return {
    bold: selection.hasFormat("bold"),
    italic: selection.hasFormat("italic"),
    underline: selection.hasFormat("underline"),
    strikethrough: selection.hasFormat("strikethrough"),
    code: selection.hasFormat("code"),
    isUnorderedList: listType === "ul",
    isOrderedList: listType === "ol",
    isLink: $isLinkNode(anchorNode) || $isLinkNode(parent),
    color: color as TextColor,
    textAlign:
      nearestBlockElem?.getFormatType() ?? TEXT_ALIGNMENT_OPTIONS[0].format,
  };
}
