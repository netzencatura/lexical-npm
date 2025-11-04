import { useState } from "react";

export function usePopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const close = () => setAnchorEl(null);

  return {
    anchorEl,
    isOpen: Boolean(anchorEl),
    open,
    close,
  };
}
