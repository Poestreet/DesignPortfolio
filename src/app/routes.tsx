import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";

function ErrorBoundary() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#fafafa" }}>
      <p style={{ fontFamily: "'Outfit', sans-serif", color: "#070071", fontSize: "14px" }}>
        Something went wrong. Please refresh.
      </p>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/cases",
    Component: Root,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/about",
    Component: Root,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/contact",
    Component: Root,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    Component: Root,
    errorElement: <ErrorBoundary />,
  },
]);
