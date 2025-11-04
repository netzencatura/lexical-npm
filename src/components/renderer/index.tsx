"use client";
import React, { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ImageNode } from '../editor/nodes';
import { theme } from '../editor/theme';

type RendererProps = {
  data: string | SerializedEditorState<SerializedLexicalNode> | null | undefined;
};

function InitialStatePlugin({ data }: RendererProps) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    if (data) {
      try {
        const stateToParse = typeof data === 'string' ? JSON.parse(data) : data;
        const initialState = editor.parseEditorState(stateToParse);
        editor.setEditorState(initialState);
      } catch (e) {
        console.error("Error parsing editor state:", e);
      }
    }
  }, [editor, data]);
  
  return null;
}

export function LexicalRenderer({ data }: RendererProps) {
  const initialConfig = {
    namespace: 'LexicalRenderer',
    nodes: [
      HeadingNode, 
      QuoteNode, 
      ListItemNode, 
      ListNode, 
      CodeNode, 
      CodeHighlightNode,
      LinkNode, 
      ImageNode
    ],
    theme,
    editable: false,
    onError(error: Error) {
      console.error("Lexical error:", error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <InitialStatePlugin data={data} />
    </LexicalComposer>
  );
}
