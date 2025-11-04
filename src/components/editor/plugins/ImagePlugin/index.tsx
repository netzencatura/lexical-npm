/* eslint-disable react-refresh/only-export-components */

import {
  $createParagraphNode,
  $getNodeByKey,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import { useEffect, type JSX } from "react";
import { $createImageNode, ImageNode } from "../../nodes";
import {
  INSERT_IMAGE_COMMAND,
  DELETE_IMAGE_COMMAND,
  type InsertImagePayload,
} from "./commands";

// Re-export pro zpětnou kompatibilitu
export { INSERT_IMAGE_COMMAND, DELETE_IMAGE_COMMAND, type InsertImagePayload } from "./commands";

export function ImagePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagePlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<{ key: string }>(
        DELETE_IMAGE_COMMAND,
        ({ key }) => {
          editor.update(() => {
            const node = $getNodeByKey(key);
            if (node && node instanceof ImageNode) node.remove();
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
