import React, { useMemo, useRef, useEffect, useState } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  Menu,
  Redo2,
  Type,
  Undo2,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";

import {
  ToolbarButton,
  Popover,
  PopoverItem,
  type ToolbarButtonProps,
  ToolbarBlockTypeButton,
  ColorPickerPopover,
  ToolbarDropdownButton,
} from "../../ui";
import {
  getCodeLanguage,
  handleRedo,
  handleUndo,
  setCodeLanguage,
  setTextColor,
  setParagraph,
} from "./utils";
import { usePopover, useToolbarState } from "../../hooks";
import {
  CODE_LANGUAGE_OPTIONS_SHIKI,
  getBlockTypeOptions,
  getFormatButtonOptions,
} from "./config";
import { INSERT_IMAGE_COMMAND } from "../../plugins/ImagePlugin";
import "./styles.css";


export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { blockType, formats, canUndo, canRedo } = useToolbarState(editor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMedium = useMediaQuery("(min-width: 700px)");
  const isLarge = useMediaQuery("(min-width: 1200px)");

  const blockOptions = useMemo(
    () => getBlockTypeOptions(editor, blockType),
    [editor, blockType]
  );

  const formatOptions = useMemo((): {
    visible: ToolbarButtonProps[];
    hidden: ToolbarButtonProps[];
  } => {
    const all = getFormatButtonOptions(editor, formats);
    const textColorBtn = all.find((b) => b.title === "Text Color");
    const pinned = textColorBtn ? [textColorBtn] : [];

    if (isLarge) return { visible: all, hidden: [] };
    if (isMedium) return { visible: all.slice(0, 4), hidden: all.slice(4) };
    return {
      visible: pinned,
      hidden: all.filter((b) => b.title !== "Text Color"),
    };
  }, [editor, formats, isMedium, isLarge]);

  const blockTypePopover = usePopover();
  const overflowPopover = usePopover();
  const colorPopover = usePopover();
  const codeLangPopover = usePopover();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Placeholder: nahraď vlastní logikou uploadu
      const imageUrl = URL.createObjectURL(file);
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: imageUrl,
        alt: file.name,
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-history-group">
          <ToolbarButton
            title="Undo"
            disabled={!canUndo}
            icon={Undo2}
            active={false}
            onClick={() => handleUndo(editor)}
          />
          <ToolbarButton
            title="Redo"
            disabled={!canRedo}
            icon={Redo2}
            active={false}
            onClick={() => handleRedo(editor)}
          />
        </div>

        <div className="toolbar-formatting-container">
          {blockType === "code" ? (
            <>
              <div className="toolbar-text-type-group">
                <ToolbarButton
                  title="Back to Paragraph"
                  icon={Type}
                  active={false}
                  onClick={() => setParagraph(editor)}
                />
              </div>

              <div className="toolbar-code-language-group">
                <ToolbarDropdownButton
                  label={getCodeLanguage(editor)}
                  chevronIcon={ChevronDown}
                  opened={codeLangPopover.isOpen}
                  onClick={codeLangPopover.open}
                />
              </div>

              <Popover
                open={codeLangPopover.isOpen}
                anchorEl={codeLangPopover.anchorEl}
                onClose={codeLangPopover.close}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {CODE_LANGUAGE_OPTIONS_SHIKI.map(([lang, label]) => (
                  <PopoverItem
                    key={lang}
                    title={label}
                    active={getCodeLanguage(editor) === lang}
                    onClick={() => {
                      setCodeLanguage(editor, lang);
                      codeLangPopover.close();
                    }}
                  />
                ))}
              </Popover>
            </>
          ) : (
            <>
              <div className="toolbar-text-type-group">
                <ToolbarBlockTypeButton
                  icon={blockOptions.find((o) => o.active)?.icon ?? Type}
                  chevronIcon={ChevronDown}
                  opened={blockTypePopover.isOpen}
                  onClick={blockTypePopover.open}
                />
              </div>

              <div className="toolbar-formatting-group">
                {formatOptions.visible.map((btn) => (
                  <ToolbarButton
                    key={btn.title}
                    title={btn.title}
                    active={btn.active}
                    icon={btn.icon}
                    onClick={(e) =>
                      btn.title === "Text Color"
                        ? e && colorPopover.open(e)
                        : btn.onClick?.()
                    }
                  />
                ))}

                <ToolbarButton
                  title="Upload new image"
                  icon={ImageIcon}
                  active={false}
                  onClick={() => fileInputRef.current?.click()}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                {!isLarge && (
                  <ToolbarButton
                    title="More"
                    icon={Menu}
                    active={false}
                    onClick={(e) => e && overflowPopover.open(e)}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Popover
        open={blockTypePopover.isOpen}
        anchorEl={blockTypePopover.anchorEl}
        onClose={blockTypePopover.close}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {blockOptions.map((opt) => (
          <PopoverItem
            key={opt.title}
            title={opt.title}
            active={opt.active}
            icon={opt.icon}
            onClick={() => {
              blockTypePopover.close();
              opt.onClick?.();
            }}
          />
        ))}
      </Popover>

      <Popover
        open={overflowPopover.isOpen}
        anchorEl={overflowPopover.anchorEl}
        onClose={overflowPopover.close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {formatOptions.hidden.map((opt) => (
          <PopoverItem
            key={opt.title}
            title={opt.title}
            active={opt.active}
            icon={opt.icon}
            onClick={() => {
              opt.onClick?.();
              if (opt.title !== "Text Align")
                setTimeout(overflowPopover.close, 0);
            }}
          />
        ))}
      </Popover>

      <ColorPickerPopover
        value={formats.color}
        open={colorPopover.isOpen}
        anchorEl={colorPopover.anchorEl}
        onClose={colorPopover.close}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        marginThreshold={60}
        onColorChange={(color) => setTextColor(editor, color)}
      />
    </>
  );
}

export default ToolbarPlugin;