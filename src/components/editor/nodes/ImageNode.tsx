import {
  $applyNodeReplacement,
  DecoratorNode,
  type DOMConversionOutput,
  type DOMExportOutput,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
  type DOMConversionMap,
} from "lexical";
import { type JSX } from "react";
import { ImageWrapper } from "../ui/ImageWrapper";

type DOMNode = globalThis.Node;

// Exporty a typy (musí být na začátku)
export type ImageAlignment = 'left' | 'center' | 'right';
export type ImageFloat = 'none' | 'left' | 'right';

export interface ImagePayload {
  key?: NodeKey;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  maxWidth?: number;
  alignment?: ImageAlignment;
  float?: ImageFloat;
}

export type SerializedImageNode = Spread<
  {
    alt: string;
    height?: number;
    maxWidth: number;
    src: string;
    width?: number;
    alignment: ImageAlignment;
    float: ImageFloat;
  },
  SerializedLexicalNode
>;

// --------------------------------------------------
// Tradiční $create funkce musí být VŽDY deklarována
// před konverzní funkcí, která ji používá.
// --------------------------------------------------

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;
  __maxWidth: number;
  __width: "inherit" | number;
  __height: "inherit" | number;
  __alignment: ImageAlignment;
  __float: ImageFloat;

  // ... (Statické metody a constructor)
  
  static getType(): string {
    return "img";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__alignment,
      node.__float,
      node.__key
    );
  }

  // ✅ importDOM vrací DOMConversionMap
  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: DOMNode) => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }
  
  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt, maxWidth, height, width, alignment, float } = serializedNode;
    return new ImageNode(
      src,
      alt,
      maxWidth,
      width ?? "inherit",
      height ?? "inherit",
      alignment ?? "left",
      float ?? "none"
    );
  }
  
  constructor(
    src: string,
    alt: string,
    maxWidth: number,
    width?: "inherit" | number,
    height?: "inherit" | number,
    alignment?: ImageAlignment,
    float?: ImageFloat,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__alignment = alignment || "left";
    this.__float = float || "none";
  }

  getWidth(): "inherit" | number { return this.__width; }
  getHeight(): "inherit" | number { return this.__height; }
  getAlignment(): ImageAlignment { return this.__alignment; }
  getFloat(): ImageFloat { return this.__float; }
  getSrc(): string { return this.__src; }
  getAlt(): string { return this.__alt; }

  setWidth(width: "inherit" | number): void { 
    this.getWritable().__width = width; 
  }
  
  setHeight(height: "inherit" | number): void { 
    this.getWritable().__height = height; 
  }
  
  setAlignment(alignment: ImageAlignment): void { 
    this.getWritable().__alignment = alignment; 
  }
  
  setFloat(float: ImageFloat): void { 
    this.getWritable().__float = float; 
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): boolean {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__alt);
    
    if (this.__width !== "inherit") {
      element.setAttribute("width", this.__width.toString());
    }
    if (this.__height !== "inherit") {
      element.setAttribute("height", this.__height.toString());
    }

    const styles: string[] = [];
    styles.push('max-width: 100%');
    styles.push('height: auto');
    
    if (this.__width !== "inherit") {
      styles.push(`width: ${this.__width}px`);
    }
    if (this.__height !== "inherit") {
      styles.push(`height: ${this.__height}px`);
    }

    if (this.__float === "left") {
      styles.push('float: left');
      styles.push('margin-right: 16px');
      styles.push('margin-bottom: 8px');
    } else if (this.__float === "right") {
      styles.push('float: right');
      styles.push('margin-left: 16px');
      styles.push('margin-bottom: 8px');
    } else {
      styles.push('display: block');
      
      if (this.__alignment === "center") {
        styles.push('margin-left: auto');
        styles.push('margin-right: auto');
      } else if (this.__alignment === "right") {
        styles.push('margin-left: auto');
        styles.push('margin-right: 0');
      } else if (this.__alignment === "left") {
        styles.push('margin-left: 0');
        styles.push('margin-right: auto');
      }
    }

    element.setAttribute('style', styles.join('; '));

    return { element };
  }

  exportJSON(): SerializedImageNode {
    return {
      type: ImageNode.getType(),
      version: 1,
      src: this.__src,
      alt: this.__alt,
      maxWidth: this.__maxWidth,
      width: this.__width === "inherit" ? undefined : this.__width,
      height: this.__height === "inherit" ? undefined : this.__height,
      alignment: this.__alignment,
      float: this.__float,
    };
  }

  decorate(): JSX.Element {
    return (
      <ImageWrapper
        src={this.__src}
        alt={this.__alt}
        nodeKey={this.getKey()}
        width={this.__width}
        height={this.__height}
        alignment={this.__alignment}
        float={this.__float}
      />
    );
  }
}

// --------------------------------------------------
// Vytvářecí funkce a helpery (musí být na konci)
// --------------------------------------------------

export function $createImageNode({
  src,
  alt,
  width,
  height,
  maxWidth,
  alignment,
  float,
  key,
}: ImagePayload) {
  return $applyNodeReplacement(
    new ImageNode(
      src, 
      alt, 
      maxWidth ?? 500, 
      width, 
      height, 
      alignment ?? "left",
      float ?? "none",
      key
    )
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}


// --- Konverzní funkce (potřebuje $createImageNode) ---
function $convertImageElement(domNode: Node): DOMConversionOutput | null {
    if (domNode instanceof HTMLImageElement) {
        const { alt: altText, src, width, height } = domNode;
        const node = $createImageNode({
            alt: altText,
            src,
            width: width,
            height: height
        });
        return { node };
    }
    return null;
}
