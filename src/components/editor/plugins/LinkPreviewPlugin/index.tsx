import { useEffect, useState, type JSX } from "react";
import { $getSelection, $isRangeSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  Box,
  ButtonBase,
  Grow,
  InputAdornment,
  Popper,
  TextField,
} from "@mui/material";
import { Trash2, Link } from "lucide-react";
import "./styles.css";

export function LinkPreviewPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const toggleLinkPreview = (event: MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const parentAnchor = target.closest("a");

    if (parentAnchor) {
      setAnchorEl(parentAnchor as any);
      setOpen(true);
    } else close();
  };

  const deleteNode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

      const anchorNode = selection.anchor.getNode();
      const parent = anchorNode.getParent();

      if ($isLinkNode(parent)) {
        close();
        setTimeout(() => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        });
      }
    });
  };

  const withoutProtocol = (url: string): string => {
    return url.trim().replace(/(^\w+:|^)\/\//, "");
  };

  const close = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

      const anchorNode = selection.anchor.getNode();
      const parent = anchorNode.getParent();

      if ($isLinkNode(parent)) {
        parent.setURL("https://" + url);
      }
    });

    setOpen(false);
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

          const anchorNode = selection.anchor.getNode();
          const parent = anchorNode.getParent();

          if ($isLinkNode(parent)) {
            setUrl(withoutProtocol(parent.getURL()));
          }
        });
      }),

      editor.registerRootListener((root, prev) => {
        root?.addEventListener("click", toggleLinkPreview);
        prev?.removeEventListener("click", toggleLinkPreview);
      })
    );
  });

  return (
    <Popper
      disablePortal
      open={open}
      anchorEl={anchorEl}
      modifiers={[
        {
          name: "eventListeners",
          options: { scroll: true, resize: true },
        },
        {
          name: "preventOverflow",
          enabled: true,
          options: {
            padding: 8,
          },
        },
      ]}
      transition
    >
      {({ TransitionProps }) => (
        <Grow in={open} {...TransitionProps} timeout={400}>
          <Box className="preview__container">
            <div className="preview__content">
              <div className="preview__link-icon">
                <Link size={33} strokeWidth={1.5} />
              </div>
              <span className="preview__url">
                <TextField
                  variant="standard"
                  value={url}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ marginRight: "2px" }}
                        >
                          https://
                        </InputAdornment>
                      ),
                      disableUnderline: true,
                    },
                  }}
                  onChange={(e) => setUrl(withoutProtocol(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      close();
                    }
                  }}
                />
              </span>
            </div>
            <div className="preview__actions">
              <ButtonBase onClick={deleteNode}>
                <Trash2
                  size={22}
                  strokeWidth={1.5}
                  className="active-icon-color"
                />
              </ButtonBase>
            </div>
          </Box>
        </Grow>
      )}
    </Popper>
  );
}