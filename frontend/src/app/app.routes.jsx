import { createBrowserRouter, Navigate } from "react-router";
import Register from "../features/auth/page/Register";
import Login from "../features/auth/page/Login";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
