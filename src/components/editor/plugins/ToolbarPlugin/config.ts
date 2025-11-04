import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Type,
  Link,
  type LucideIcon,
} from "lucide-react";
import type { LexicalEditor, ElementFormatType } from "lexical";
import type { ToolbarButtonProps } from "../../ui";
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrikethrough,
  toggleCode,
  rotateTextAlignment,
  setUnorderedList,
  setOrderedList,
  setHeading,
  setParagraph,
  setQuote,
  setCodeBlock,
  insertLink,
} from "./utils";

// Jednoduchá paleta pro ColorPicker (klidně později nahraď CSS proměnnými / tématem)
export const TEXT_COLORS = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFFFFF",
  "#808080",
  "#800000",
  "#808000",
  "#008000",
  "#800080",
  "#008080",
  "#000080",
];

export const TEXT_ALIGNMENT_OPTIONS: Array<{
  format: ElementFormatType;
  label: string;
}> = [
  { format: "left", label: "Left" },
  { format: "center", label: "Center" },
  { format: "right", label: "Right" },
  { format: "justify", label: "Justify" },
];

// Vymezíme formáty, které umíme vykreslit ikonou (bez prázdného řetězce)
type AlignFormat = "left" | "start" | "center" | "right" | "end" | "justify";

const ALIGN_ICON_BY_FORMAT: Record<AlignFormat, LucideIcon> = {
  left: AlignLeft,
  start: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
  end: AlignRight,
  justify: AlignJustify,
};

function isAlignFormat(v: unknown): v is AlignFormat {
  return (
    v === "left" ||
    v === "start" ||
    v === "center" ||
    v === "right" ||
    v === "end" ||
    v === "justify"
  );
}

export function getFormatButtonOptions(
  editor: LexicalEditor,
  formats: Record<string, unknown>
): ToolbarButtonProps[] {
  const align: AlignFormat = isAlignFormat(formats.textAlign)
    ? formats.textAlign
    : "left";
  const AlignIcon = ALIGN_ICON_BY_FORMAT[align];

  return [
    {
      title: "Bold",
      icon: Bold,
      active: Boolean(formats.bold),
      onClick: () => toggleBold(editor),
    },
    {
      title: "Italic",
      icon: Italic,
      active: Boolean(formats.italic),
      onClick: () => toggleItalic(editor),
    },
    {
      title: "Underline",
      icon: Underline,
      active: Boolean(formats.underline),
      onClick: () => toggleUnderline(editor),
    },
    {
      title: "Strikethrough",
      icon: Strikethrough,
      active: Boolean(formats.strikethrough),
      onClick: () => toggleStrikethrough(editor),
    },
    {
      title: "Code",
      icon: Code,
      active: Boolean(formats.code),
      onClick: () => toggleCode(editor),
    },
    {
      title: "Insert Link",
      icon: Link,
      active: Boolean(formats.isLink),
      onClick: () => insertLink(editor),
    },
    { title: "Text Color", icon: Palette, active: false },
    {
      title: "Text Align",
      icon: AlignIcon,
      active: false,
      onClick: () => rotateTextAlignment(editor),
    },
    {
      title: "Bulleted List",
      icon: List,
      active: Boolean(formats.isUnorderedList),
      onClick: () => setUnorderedList(editor),
    },
    {
      title: "Numbered List",
      icon: ListOrdered,
      active: Boolean(formats.isOrderedList),
      onClick: () => setOrderedList(editor),
    },
  ];
}

export function getBlockTypeOptions(
  editor: LexicalEditor,
  blockType: string
): Array<{
  title: string;
  icon: LucideIcon;
  active: boolean;
  onClick?: () => void;
}> {
  return [
    {
      title: "Paragraph",
      icon: Type,
      active: blockType === "paragraph",
      onClick: () => setParagraph(editor),
    },
    {
      title: "Heading 1",
      icon: Heading1,
      active: blockType === "h1",
      onClick: () => setHeading(editor, "h1"),
    },
    {
      title: "Heading 2",
      icon: Heading2,
      active: blockType === "h2",
      onClick: () => setHeading(editor, "h2"),
    },
    {
      title: "Heading 3",
      icon: Heading3,
      active: blockType === "h3",
      onClick: () => setHeading(editor, "h3"),
    },
    {
      title: "Quote",
      icon: Quote,
      active: blockType === "quote",
      onClick: () => setQuote(editor),
    },
    {
      title: "Code Block",
      icon: Code,
      active: blockType === "code",
      onClick: () => setCodeBlock(editor),
    },
  ];
}

export const CODE_LANGUAGE_OPTIONS_SHIKI: [string, string][] = [
  ["javascript", "JavaScript"],
  ["typescript", "TypeScript"],
  ["python", "Python"],
  ["java", "Java"],
  ["c", "C"],
  ["cpp", "C++"],
  ["csharp", "C#"],
  ["php", "PHP"],
  ["ruby", "Ruby"],
  ["go", "Go"],
  ["rust", "Rust"],
  ["swift", "Swift"],
  ["kotlin", "Kotlin"],
  ["sql", "SQL"],
  ["html", "HTML"],
  ["css", "CSS"],
  ["json", "JSON"],
  ["xml", "XML"],
  ["yaml", "YAML"],
  ["markdown", "Markdown"],
  ["bash", "Bash"],
  ["powershell", "PowerShell"],
];