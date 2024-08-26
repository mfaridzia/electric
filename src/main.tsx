import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import Index from "./routes/index";
import Root from "./routes/root";
import App from "./App";
import PgliteSync from "./pglite-sync";
import PgliteLocal from "./pglite-local";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/app",
        element: <App />,
      },
    ],
  },
  {
    path: "/pglite-sync",
    element: <PgliteSync />,
  },
  {
    path: "/pglite-local",
    element: <PgliteLocal />,
  },
]);

async function render() {
  ReactDOM.createRoot(document.getElementById(`root`)!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

render();
