import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  type LexicalEditor,
  type ElementFormatType,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $patchStyleText } from "@lexical/selection";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";

import type { TextColor } from "../../ui";
import { INSERT_IMAGE_COMMAND } from "../../plugins";

export const SUPPORTED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "sms:",
  "tel:",
]);

export const TEXT_ALIGNMENT_OPTIONS: Array<{
  format: ElementFormatType;
  label: string;
}> = [
  { format: "left", label: "Left" },
  { format: "center", label: "Center" },
  { format: "right", label: "Right" },
  { format: "justify", label: "Justify" },
];

export function handleUndo(editor: LexicalEditor) {
  editor.dispatchCommand(UNDO_COMMAND, undefined);
}

export function handleRedo(editor: LexicalEditor) {
  editor.dispatchCommand(REDO_COMMAND, undefined);
}

export function setHeading(editor: LexicalEditor, level: HeadingTagType) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createHeadingNode(level));
    }
  });
}

export function setParagraph(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createParagraphNode());
    }
  });
}

export function setCodeBlock(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createCodeNode());
    }
  });
}

export function setQuote(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createQuoteNode());
    }
  });
}

export function setTextColor(editor: LexicalEditor, color: TextColor) {
  editor.update(() => {
    const selection = $getSelection();
    if (selection) $patchStyleText(selection, { color: color });
  });
}

export function toggleBold(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
}

export function toggleItalic(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
}

export function toggleUnderline(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
}

export function toggleStrikethrough(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
}

export function toggleCode(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
}

export function setUnorderedList(editor: LexicalEditor) {
  editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
}

export function setOrderedList(editor: LexicalEditor) {
  editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
}

export function toggleUnorderedList(editor: LexicalEditor) {
  editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
}

export function toggleOrderedList(editor: LexicalEditor) {
  editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
}

export function insertLink(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if (selection) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "");
    }
  });
}

export function insertImage(editor: LexicalEditor) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = false;

  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: src,
        alt: "",
      });
    };

    reader.readAsDataURL(file);
  };

  input.click();
}

export function indent(editor: LexicalEditor) {
  editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
}

export function outdent(editor: LexicalEditor) {
  editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
}

export function handleIndentIncrease(editor: LexicalEditor) {
  editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
}

export function handleIndentDecrease(editor: LexicalEditor) {
  editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
}

export function setAlignment(editor: LexicalEditor, alignment: ElementFormatType) {
  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
}

export function rotateTextAlignment(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const blockElem = $getNearestBlockElementAncestorOrThrow(anchorNode);
      const activeOptionIndex = TEXT_ALIGNMENT_OPTIONS.findIndex(
        (option) =>
          option.format ===
          (blockElem?.getFormatType() ?? TEXT_ALIGNMENT_OPTIONS[0].format)
      );

      editor.dispatchCommand(
        FORMAT_ELEMENT_COMMAND,
        TEXT_ALIGNMENT_OPTIONS[
          ((((activeOptionIndex === -1 ? 0 : activeOptionIndex) + 1) %
            TEXT_ALIGNMENT_OPTIONS.length) +
            TEXT_ALIGNMENT_OPTIONS.length) %
            TEXT_ALIGNMENT_OPTIONS.length
        ].format
      );
    }
  });
}

export function getCodeLanguage(editor: LexicalEditor): string {
  let language: string | null | undefined = null;

  editor.read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode().getTopLevelElementOrThrow();
      if ($isCodeNode(node)) {
        language = node.getLanguage();
      }
    }
  });

  return language ?? "Select Language";
}

export function setCodeLanguage(editor: LexicalEditor, language: string) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode().getTopLevelElementOrThrow();
      if ($isCodeNode(node)) {
        node.setLanguage(language);
      }
    }
  });
}

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return "about:blank";
    }
  } catch {
    return url;
  }
  return url;
}
