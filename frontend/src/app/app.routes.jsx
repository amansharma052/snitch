import { createBrowserRouter, Navigate, Outlet } from "react-router";
import Register from "../features/auth/page/Register";
import Login from "../features/auth/page/Login";
import Dashboard from "../features/products/pages/Dashboard.jsx";
import CreateProduct from "../features/products/pages/CreateProduct";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home.jsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "create-product",
        element: <CreateProduct />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
