import { createBrowserRouter, Navigate, Outlet } from "react-router";
import Register from "../features/auth/page/Register";
import Login from "../features/auth/page/Login";
import Dashboard from "../features/products/pages/Dashboard.jsx";
import CreateProduct from "../features/products/pages/CreateProduct";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import SellerProductDetails from "../features/products/pages/SellerProductDetail.jsx";
import AppLayout from "./AppLayout.jsx";
import Cart from "../features/cart/pages/Cart.jsx";



export const routes = createBrowserRouter([
 
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
   {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/product/:productId",
                element: <ProductDetail />
            },
            {
                path: "/cart",
                element: <Protected><Cart /></Protected>
            },
            // {
            //     path: "/order-success",
            //     element: <OrderSuccess />
            // },
            {
                path: "/seller",
                children: [
                    {
                        path: "/seller/create-product",

                        element: <Protected role="seller" >
                            <CreateProduct />
                        </Protected>
                    },
                    {
                        path: "/seller/dashboard",
                        element: <Protected role="seller" >
                            <Dashboard />
                        </Protected>
                    },
                    {
                        path: "/seller/product/:productId",
                        element: <Protected role="seller" >
                            <SellerProductDetails />
                        </Protected>
                    }
                ]
            }
        ]
    }


])