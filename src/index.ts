// Hlavní komponenta editoru
export { default as LexicalRichTextEditor } from './components/editor';
export type { EditorHandle } from './components/editor';

// Exportuj custom nodes
export { ImageNode } from './components/editor/nodes';
export type { SerializedImageNode, ImageAlignment, ImageFloat } from './components/editor/nodes/ImageNode';

// Exportuj pluginy pro customizaci
export { 
  ToolbarPlugin,
  CodeHighlightShikiPlugin,
  ImagePlugin,
  DragDropPastePlugin,
  LinkPreviewPlugin 
} from './components/editor/plugins';

// Exportuj hooks
export { 
  usePopover, 
  useToolbarState 
} from './components/editor/hooks';

// Exportuj UI komponenty
export { 
  ToolbarButton,
  ToolbarBlockTypeButton,
  ToolbarDropdownButton,
  Popover,
  PopoverItem,
  ColorPickerPopover,
  ResizableImage,
  ReadOnlyImage,
  ImageWrapper
} from './components/editor/ui';

// Exportuj typy UI komponent
export type {
  ToolbarButtonProps,
  ToolbarBlockTypeButtonProps,
  ToolbarDropdownButtonProps,
  PopoverItemProps,
  TextColor,
  ColorPickerPopoverProps
} from './components/editor/ui';

// Exportuj theme
export { theme as editorTheme, MuiEditorTheme } from './components/editor/theme';

// Exportuj renderer
export { LexicalRenderer } from './components/renderer';
