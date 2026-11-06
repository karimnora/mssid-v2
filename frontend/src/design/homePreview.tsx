import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/900.css";
import { DidouVillageHome } from "../components/home/DidouVillageHome";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DidouVillageHome />
  </React.StrictMode>
);
