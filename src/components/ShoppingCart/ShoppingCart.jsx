import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { parseJwt } from "../../helpers/jwt.helper";
import Navbar from "../Navbar/Navbar";
import "./shoppingcart.css";
const ShoppingCart = () => {
  const [users, setUsers] = useState("");
  const [fetchedCart, setFetchedCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const token = localStorage.getItem("user-info");
  const { accessToken } = JSON.parse(localStorage.getItem("user-info"));
  const { sub, email } = parseJwt(token);

  const fetchUser = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCart = async (userId, token) => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/${userId}/carts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setFetchedCart(data);
    } catch (e) {
      console.log(e);
    }
  };

  const query = fetchedCart.map((item) => `id=${item.productId}`).join("&");
  const fetchCartProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/products?${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      setAllProducts(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUser(sub, accessToken);
    fetchCart(sub, accessToken);
  }, []);

  useEffect(() => {
    fetchCartProducts();
  }, [fetchedCart]);
  const handleDelete = async (productId) => {
    try {
      // Find the item to delete in the fetchedCart state
      const itemToDelete = fetchedCart.find(
        (item) => item.productId === productId
      );
      // Send a DELETE request to the server to delete the item
      await fetch(`http://localhost:8000/carts/${itemToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Refetch the cart items from the server
      const response = await fetch(`http://localhost:8000/user/${sub}/carts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setFetchedCart(data);
    } catch (e) {
      console.log(e);
    }
  };
  const cartProducts = allProducts.filter((product) =>
    fetchedCart.some((item) => item.productId === product.id)
  );

  return (
    <div>
      <Navbar email={email} />
      {cartProducts.length < 1 && (
        <div className='empty-cart'>Shopping Cart is Empty.</div>
      )}
      {cartProducts.map((product) => {
        return (
          <div key={product.id} className='cart-item-container'>
            <div className='cart-image-container'>
              <img className='cart-image' src={product.photos[0]} alt='' />
            </div>
            <div className='cart-desc-container'>
              <h4 className='cart-title'>{product.title}</h4>
              <Rating
                className='rating'
                name='half-rating-read'
                defaultValue={product.review}
                precision={0.5}
                readOnly
              />
              <p className='cart-description'>{product.description}</p>
              <div className='price-btn-container'>
                <p className='cart-price'>${product.price}</p>
                <button
                  onClick={() => handleDelete(product.id)}
                  className='cart-delete-btn'
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShoppingCart;
