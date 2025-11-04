import { TEXT_COLORS } from "../../plugins/ToolbarPlugin/config";
import "./styles.css"; // Importujeme CSS

import MuiPopover, {
  type PopoverProps as MuiPopoverProps,
} from "@mui/material/Popover";
import { Button as MuiButton } from "@mui/material"; // Odebrán import 'styled'
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PopoverItemProps {
  title: string;
  active?: boolean;
  icon?: LucideIcon;
  onClick?: () => void;
}

export type TextColor = (typeof TEXT_COLORS)[number];
export interface ColorPickerPopoverProps extends MuiPopoverProps {
  value: TextColor;
  onColorChange?: (color: TextColor) => void;
}

export function Popover(props: MuiPopoverProps) {
  // Používáme MuiPopover s přidanou třídou
  return (
    <MuiPopover className="custom-popover" {...props}>
      {props.children}
    </MuiPopover>
  );
}

export function PopoverItem({
  title,
  icon: Icon,
  onClick,
  active = false,
}: PopoverItemProps) {
  // Používáme MuiButton a dynamicky přidáváme třídy
  return (
    <MuiButton
      className={`popover-item ${active ? "is-active" : ""}`}
      onClick={onClick}
    >
      <span className="popover-item-title">{title}</span>
      {Icon && <Icon size={40} strokeWidth={1.5} />}
    </MuiButton>
  );
}

export function ColorPickerPopover({
  value,
  onColorChange,
  ...props
}: ColorPickerPopoverProps) {
  return (
    <Popover {...props}>
      <div className="color-picker-popover">
        {TEXT_COLORS.map((color, index) => (
          <CircleCheckbox
            key={index}
            fill={color}
            checked={value === color}
            onClick={() => onColorChange?.(color)}
          />
        ))}
      </div>
    </Popover>
  );
}

// Komponenta 'styled' byla odstraněna

const CircleCheckbox = ({
  fill,
  checked,
  onClick,
}: {
  fill: string;
  checked?: boolean;
  onClick?: () => void;
}) => (
  <div className="color-circle-wrapper" onClick={onClick}>
    <div
      className="color-circle"
      // Dynamický backgroundColor musí zůstat inline
      style={{ backgroundColor: fill }}
    >
      {checked && <Check size={20} className="color-circle-checkmark" />}
    </div>
  </div>
);