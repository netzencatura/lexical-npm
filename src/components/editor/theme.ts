import { createTheme } from "@mui/material";

export const theme = {
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listItem",
    listitemChecked: "editor-listItemChecked",
    listitemUnchecked: "editor-listItemUnchecked",
  },
  link: "editor-link",
  text: {
    bold: "editor-textBold",
    code: "editor-textCode",
    italic: "editor-textItalic",
    underline: "editor-textUnderline",
    strikethrough: "editor-textStrikethrough",
  },
  code: "editor-code",
};

export const MuiEditorTheme = createTheme({
  palette: {
    primary: { main: "#a39f9f" },
  },
  typography: { fontFamily: ["Inter", "sans-serif"].join(",") },
});
