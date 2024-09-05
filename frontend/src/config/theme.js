import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#A7C340",
      light: "#74A6F0",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#203142",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#DDDDDD",
    },
  },
  components: {
    RaImageField: {
      styleOverrides: {
        image: {
          width: "100%",
          margin: 0,
          maxHeight: 200,
          objectFit: "cover",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: 2,
          padding: "6px 12px",
          minWidth: 100,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          marginBottom: 24,
        },
      },
    },
  },
});

export default theme;
