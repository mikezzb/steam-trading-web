"use client";
import { FCC } from "@/types/ui";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const ThemeConfig = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff5252",
    },
    secondary: {
      main: "#52FFFF",
    },
  },
});

const ThemeProviderWrapper: FCC = ({ children }) => {
  return <ThemeProvider theme={ThemeConfig}>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;
