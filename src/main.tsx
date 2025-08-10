import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
