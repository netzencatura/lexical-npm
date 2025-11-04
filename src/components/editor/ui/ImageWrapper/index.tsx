import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ResizableImage } from "../ResizableImage";
import { ReadOnlyImage } from "../ReadOnlyImage";
import type { ImageAlignment, ImageFloat } from "../../nodes/ImageNode";

interface ImageWrapperProps {
  src: string;
  alt: string;
  nodeKey: string;
  width?: "inherit" | number;
  height?: "inherit" | number;
  alignment: ImageAlignment;
  float: ImageFloat;
}

export function ImageWrapper(props: ImageWrapperProps) {
  const [editor] = useLexicalComposerContext();
  const isEditable = editor.isEditable();

  if (isEditable) {
    return <ResizableImage {...props} />;
  } else {
    return <ReadOnlyImage {...props} />;
  }
}
