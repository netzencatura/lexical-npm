import { Resizable } from "re-resizable";
import { useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical"; 

import { DELETE_IMAGE_COMMAND } from "../../plugins/ImagePlugin";
import { $isImageNode, type ImageAlignment, type ImageFloat } from "../../nodes/ImageNode";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  IndentDecrease, 
  IndentIncrease, 
  AlignJustify,
  Trash2 
} from "lucide-react";
import { ToolbarButton } from "../Button"; 

import "./styles.css";

interface ImageProps {
  src: string;
  nodeKey: string;
  width?: "inherit" | number;
  height?: "inherit" | number;
  alignment: ImageAlignment;
  float: ImageFloat;
}

export function ResizableImage({ 
  src, 
  nodeKey, 
  width, 
  height,
  alignment,
  float: currentFloat
}: ImageProps) {
  const [editor] = useLexicalComposerContext();
  
  const resizableWrapperRef = useRef<Resizable | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  
  const [resizableWidth, setResizableWidth] = useState<string | null>(null);
  const [resizableHeight, setResizableHeight] = useState<number | null>(null);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (width && width !== "inherit") {
      setResizableWidth(`${width}px`);
    }
    if (height && height !== "inherit") {
      setResizableHeight(height);
    }
  }, [width, height]);

  useEffect(() => createImageAndAppend(), [src]);
  
  useEffect(() => {
    const handleDeselect = (event: MouseEvent) => {
      if (!resizableWrapperRef.current) return;
      const node = resizableWrapperRef.current.resizable;
      if (node && !node.contains(event.target as Node)) setSelected(false);
    };
    
    document.addEventListener("mousedown", handleDeselect);
    return () => document.removeEventListener("mousedown", handleDeselect);
  }, []);
  
  useEffect(() => {
    if (!selected) return;
    
    const handleDeleteKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        handleDeleteImage();
      }
    };
    
    document.addEventListener("keydown", handleDeleteKeyPress);
    return () => document.removeEventListener("keydown", handleDeleteKeyPress);
  }, [selected]);

  const calculateRelativeWidth = (childWidth: number, parentWidth: number) => {
    if (!parentWidth) return "100%";
    if (childWidth >= parentWidth) return "100%";
    const percentage = (childWidth / parentWidth) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  const createImageAndAppend = () => {
    const image = new Image();
    image.src = src;
    image.style.maxWidth = '100%';
    image.style.height = 'auto';
    image.style.display = 'block';

    image.onload = () => handleImageLoad(image);

    if (imageContainerRef.current) {
      imageContainerRef.current.innerHTML = "";
      imageContainerRef.current.appendChild(image);
    }
  };

  const handleImageLoad = (image: HTMLImageElement) => {
    if (width && width !== "inherit") {
      setResizableWidth(`${width}px`);
      return;
    }

    setResizableWidth(
      calculateRelativeWidth(
        image.naturalWidth,
        resizableWrapperRef.current?.getParentSize().width ?? 0
      )
    );
  };
  
  const handleResizeStop = (_event: any, _direction: any, elementRef: any) => {
    const newWidth = elementRef.offsetWidth;
    const newHeight = elementRef.offsetHeight;

    setResizableWidth(`${newWidth}px`);
    setResizableHeight(newHeight);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidth(newWidth);
        node.setHeight(newHeight);
      }
    });
  };

  const handleAlignmentChange = (newAlignment: ImageAlignment) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setAlignment(newAlignment);
        node.setFloat("none");
      }
    });
  };

  const handleFloatChange = (newFloat: ImageFloat) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setFloat(newFloat);
        if (newFloat !== "none") {
          node.setAlignment("left"); 
        }
      }
    });
  };
  
  const handleDeleteImage = () => {
    editor.dispatchCommand(DELETE_IMAGE_COMMAND, {
      key: nodeKey,
    });
  };

  const handleSelect = () => {
    setSelected(true);
  };

  const wrapperClasses = ["resizable-image-wrapper"];
  
  if (currentFloat === "left") {
    wrapperClasses.push("float-left");
  } else if (currentFloat === "right") {
    wrapperClasses.push("float-right");
  } else {
    wrapperClasses.push(`align-${alignment}`);
  }

  return (
    <div className={wrapperClasses.join(" ")}>
      <Resizable
        size={{
          width: resizableWidth ?? 0,
          height: resizableHeight ?? "auto",
        }}
        enable={
          selected
            ? {
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              }
            : {}
        }
        lockAspectRatio
        ref={resizableWrapperRef}
        onResizeStop={handleResizeStop}
      >
        <div 
          className={selected ? "selected" : ""} 
          onClick={handleSelect} 
          style={{ position: 'relative', width: '100%', height: '100%' }}
        >
          <div ref={imageContainerRef} style={{ width: '100%', height: '100%' }} />
          
          {selected && (
            <div className="image-toolbar">
              {currentFloat === "none" && (
                <>
                  <ToolbarButton 
                    title="Zarovnat vlevo" 
                    icon={AlignLeft} 
                    active={alignment === "left"}
                    onClick={() => handleAlignmentChange("left")}
                  />
                  <ToolbarButton 
                    title="Zarovnat na střed" 
                    icon={AlignCenter} 
                    active={alignment === "center"}
                    onClick={() => handleAlignmentChange("center")}
                  />
                  <ToolbarButton 
                    title="Zarovnat vpravo" 
                    icon={AlignRight} 
                    active={alignment === "right"}
                    onClick={() => handleAlignmentChange("right")}
                  />
                  <div className="image-toolbar-separator" />
                </>
              )}

              <ToolbarButton 
                title="Obtékat zleva" 
                icon={IndentIncrease}
                active={currentFloat === "left"}
                onClick={() => handleFloatChange("left")}
              />
              <ToolbarButton 
                title="Obtékat zprava" 
                icon={IndentDecrease}
                active={currentFloat === "right"}
                onClick={() => handleFloatChange("right")}
              />
              <ToolbarButton 
                title="Bez obtékání" 
                icon={AlignJustify}
                active={currentFloat === "none"}
                onClick={() => handleFloatChange("none")}
              />
              
              <div className="image-toolbar-separator" />

              <ToolbarButton 
                title="Smazat obrázekkkk" 
                icon={Trash2} 
                active={false}
                onClick={handleDeleteImage}
              />
            </div>
          )}
        </div>
      </Resizable>
    </div>
  );
}
