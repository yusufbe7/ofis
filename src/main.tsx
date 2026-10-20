import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/components.css";
import "./styles/building.css";

/**
 * Two entry points, split by path so the admin bundle (including SheetJS)
 * never loads for ordinary visitors.
 *
 * Static hosts must rewrite unknown paths to index.html for /admin to work —
 * vercel.json and public/_redirects in this repo already do that.
 */
const AdminApp = lazy(() => import("./admin/AdminApp"));

const isAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div className="login-screen" />}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
