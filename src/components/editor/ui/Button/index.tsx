import { Button, IconButton, Tooltip } from "@mui/material";
import type { LucideIcon } from "lucide-react";
import "./styles.css";

export interface ToolbarButtonProps {
  title: string;
  active: boolean;
  icon: LucideIcon;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export interface ToolbarBlockTypeButtonProps {
  icon: LucideIcon;
  chevronIcon: LucideIcon;
  opened: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ToolbarDropdownButtonProps {
  label: string;
  chevronIcon: LucideIcon;
  opened: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ToolbarButton({
  title,
  active,
  icon: Icon,
  onClick,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <Tooltip title={title}>
      <IconButton
        className={`toolbar-button ${active ? "active" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon size={24} strokeWidth={1.5} />
      </IconButton>
    </Tooltip>
  );
}

export function ToolbarBlockTypeButton({
  icon: Icon,
  chevronIcon: ChevronIcon,
  opened = false,
  onClick,
}: ToolbarBlockTypeButtonProps) {
  return (
    <Button 
      disableRipple 
      onClick={onClick}
      className={`toolbar-block-button ${opened ? "opened" : ""}`}
    >
      <Icon size={24} strokeWidth={1.5} />
      <ChevronIcon size={24} strokeWidth={1.5} />
    </Button>
  );
}

export function ToolbarDropdownButton({
  label,
  chevronIcon: ChevronIcon,
  opened = false,
  onClick,
}: ToolbarDropdownButtonProps) {
  return (
    <Button 
      disableRipple 
      onClick={onClick}
      className={`toolbar-dropdown-button ${opened ? "opened" : ""}`}
    >
      <span>{label}</span>
      <ChevronIcon size={24} strokeWidth={1.5} />
    </Button>
  );
}
