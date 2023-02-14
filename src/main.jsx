import React from "react";
import ReactDOM from "react-dom/client";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import App from "./App";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const darkTheme = extendTheme({ config });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={darkTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
