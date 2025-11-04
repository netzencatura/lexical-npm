import React, {
  lazy,
  Suspense,
  useImperativeHandle,
  type Ref,
  useEffect,
} from "react";
import {
  LexicalComposer,
  type InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { ThemeProvider } from "@mui/material";
import { theme, MuiEditorTheme } from "@/components/editor/theme";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { EditorState, SerializedEditorState } from "lexical";

// core nodes
import { ImageNode } from "./nodes";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";

// helpers
import { TRANSFORMERS } from "@lexical/markdown";

// essential plugins
import { ToolbarPlugin } from "./plugins";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

// lazy loaded plugins
const LinkPlugin = lazy(() =>
  import("@lexical/react/LexicalLinkPlugin").then((m) => ({
    default: m.LinkPlugin,
  }))
);
const ListPlugin = lazy(() =>
  import("@lexical/react/LexicalListPlugin").then((m) => ({
    default: m.ListPlugin,
  }))
);
const TabIndentationPlugin = lazy(() =>
  import("@lexical/react/LexicalTabIndentationPlugin").then((m) => ({
    default: m.TabIndentationPlugin,
  }))
);
const MarkdownShortcutPlugin = lazy(() =>
  import("@lexical/react/LexicalMarkdownShortcutPlugin").then((m) => ({
    default: m.MarkdownShortcutPlugin,
  }))
);

const CodeHighlightShikiPlugin = lazy(() =>
  import("./plugins/CodeHighlightShikiPlugin").then((m) => ({
    default: m.CodeHighlightShikiPlugin,
  }))
);
const ImagePlugin = lazy(() =>
  import("./plugins/ImagePlugin").then((m) => ({ default: m.ImagePlugin }))
);
const DragDropPastePlugin = lazy(() =>
  import("./plugins/DragDropPastePlugin").then((m) => ({
    default: m.DragDropPastePlugin,
  }))
);
const LinkPreviewPlugin = lazy(() =>
  import("./plugins/LinkPreviewPlugin").then((m) => ({
    default: m.LinkPreviewPlugin,
  }))
);

import "./theme.css";
import "./styles.css";

export type EditorHandle = {
  export: () => Promise<string>;
};

/**
 * Definice hodnoty editoru.
 * Může to být serializovaný objekt, JSON string, null nebo undefined.
 */
export type EditorValue = SerializedEditorState | string | null | undefined;

export type EditorProps = {
  ref?: Ref<EditorHandle>;
  value?: EditorValue;
  /** Odesílá serializovaný JSON string */
  onChange?: (value: string) => void;
};

// ====================================================================
// INITIAL STATE
// ====================================================================
function InitialStatePlugin({ value }: { value?: EditorValue }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!value) {
      return;
    }

    const currentState = editor.getEditorState();
    const currentJson = JSON.stringify(currentState.toJSON());

    const incomingValueString =
      typeof value === "object" && value !== null ? JSON.stringify(value) : value;

    if (currentJson === incomingValueString) {
      return;
    }

    try {
      let stateToLoad: SerializedEditorState;

      if (typeof value === "object" && value !== null) {
        // Případ 1: Přišel objekt
        stateToLoad = value as SerializedEditorState;
      } else if (typeof value === "string") {
        // Případ 2: Přišel string, parsujeme
        // try...catch si poradí s nevalidním JSONem (vč. "[object Object]")
        stateToLoad = JSON.parse(value) as SerializedEditorState;
      } else {
        // Jiné neplatné typy
        return;
      }

      const parsed = editor.parseEditorState(stateToLoad);
      editor.setEditorState(parsed);
    } catch (e) {
      console.error("Lexical Editor: InitialState - Critical Parse Error!", e);
      console.error("Lexical Editor: Hodnota, která selhala:", value);
    }
  }, [editor, value]);

  return null;
}

export default function Editor({ ref, value, onChange }: EditorProps) {
  const editorConfig: InitialConfigType = {
    namespace: "editor",
    theme,
    nodes: [
      HeadingNode,
      LinkNode,
      CodeHighlightNode,
      CodeNode,
      QuoteNode,
      ListItemNode,
      ListNode,
      ImageNode,
    ],
    onError(error: Error) {
      console.error("[lexical-editor] Chyba:", error);
    },
  };

// ====================================================================
  // ON CHANGE
  // ====================================================================
  const handleEditorChange = (editorState: EditorState) => {
    const jsonObject = editorState.toJSON();
    // Odesíláme string, jak je definováno v EditorProps
    onChange?.(JSON.stringify(jsonObject));
  };

  return (
    <ThemeProvider theme={MuiEditorTheme}>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary}
            contentEditable={<ContentEditable className="content-editable" />}
          />
        </div>
        <InitialStatePlugin value={value} />
        <OnChangePlugin onChange={handleEditorChange} />

        <HistoryPlugin />

        <Suspense fallback={null}>
          <TabIndentationPlugin />
          <LinkPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <CodeHighlightShikiPlugin />
          <ImagePlugin />
          <DragDropPastePlugin />
          <LinkPreviewPlugin />
        </Suspense>
        <EditorHandleBridge ref={ref} />
      </LexicalComposer>
    </ThemeProvider>
  );
}

function EditorHandleBridge({ ref }: { ref?: Ref<EditorHandle> }) {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(
    ref,
    (): EditorHandle => ({
      export: async () => {
        const { $generateHtmlFromNodes } = await import("@lexical/html");
        let html = "";
        editor.read(() => {
          html = $generateHtmlFromNodes(editor, null);
        });
        return html;
      },
    }),
    [editor]
  );

  return null;
}