import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Error";
import Index from "./routes/index";
import Root from "./routes/root";
import App from "./App";
import PgLite2 from "./PgLite2";
import PgLite from "./PgLite";

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
    path: "/pglite",
    element: <PgLite2 />,
  },
  {
    path: "/pglite-local",
    element: <PgLite />,
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
