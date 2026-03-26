import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ClinicProvider } from "./context/ClinicContext";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ClinicProvider>
          <App />
        </ClinicProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
