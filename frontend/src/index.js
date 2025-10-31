import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";

const PUBLISHABLE_KEY = "pk_test_bXV0dWFsLWNoaWNrZW4tODguY2xlcmsuYWNjb3VudHMuZGV2JA"; // <-- replace with your actual key

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
