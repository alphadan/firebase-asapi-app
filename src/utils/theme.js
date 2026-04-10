import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#0d2445" },
    secondary: { main: "#c82027" },
    background: { default: "#f8f9fa" },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
      },
    },
  },
});
