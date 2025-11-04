import type { ImageAlignment, ImageFloat } from "../../nodes/ImageNode";
import "./styles.css";

interface ReadOnlyImageProps {
  src: string;
  alt: string;
  nodeKey: string;
  width?: "inherit" | number;
  height?: "inherit" | number;
  alignment: ImageAlignment;
  float: ImageFloat;
}

export function ReadOnlyImage({
  src,
  alt,
  width,
  height,
  alignment,
  float,
}: ReadOnlyImageProps) {
  const wrapperClasses = ["readonly-image-wrapper"];
  
  if (float === "left") {
    wrapperClasses.push("float-left");
  } else if (float === "right") {
    wrapperClasses.push("float-right");
  } else {
    wrapperClasses.push(`align-${alignment}`);
  }

  const imgStyle: React.CSSProperties = {
    maxWidth: "100%",
    height: "auto",
  };

  if (width && width !== "inherit") {
    imgStyle.width = `${width}px`;
  }
  if (height && height !== "inherit") {
    imgStyle.height = `${height}px`;
  }

  return (
    <span className={wrapperClasses.join(" ")}>
      <img src={src} alt={alt} style={imgStyle} />
    </span>
  );
}
