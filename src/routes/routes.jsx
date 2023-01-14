import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ShoppingCart from "../components/ShoppingCart/ShoppingCart";
import Login from "../components/Login/Login";
import Products from "../components/Products/Products";
import Signup from "../components/Signup/Signup";
import { authRoutesLoader } from "../loaders/auth.loader";
import { protectedRoutesLoader } from "../loaders/protected.loader";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        loader: authRoutesLoader,
        element: <Login />,
      },
      {
        path: "/signup",
        loader: authRoutesLoader,
        element: <Signup />,
      },
      {
        path: "/products",
        loader: protectedRoutesLoader,
        element: <Products />,
      },
      {
        path: "/shopping-cart",
        loader: protectedRoutesLoader,
        element: <ShoppingCart />,
      },
    ],
  },
]);
