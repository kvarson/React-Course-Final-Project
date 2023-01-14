import { Rating } from "@mui/material";
import { Carousel } from "react-bootstrap";
import React from "react";

import Slider from "react-slick";

import "./card.css";
import { parseJwt } from "../../helpers/jwt.helper";

const Card = ({
  productCategory,
  productDescription,
  productId,
  productPhotos,
  productPrice,
  productReview,
  productTitle,
}) => {
  const token = localStorage.getItem("user-info");
  const { accessToken } = JSON.parse(localStorage.getItem("user-info"));
  const { sub, email } = parseJwt(token);

  const handlAddToCart = async () => {
    try {
      const response = await fetch("http://localhost:8000/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: sub, productId }),
      });
      const data = await response.json();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className='card-container'>
      <div className='image-container'>
        <Carousel variant='dark'>
          <Carousel.Item>
            <img
              className='product-image'
              src={productPhotos[0]}
              alt='First slide'
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className='product-image'
              src={productPhotos[1] ? productPhotos[1] : productPhotos[0]}
              alt='Second slide'
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className='product-image'
              src={productPhotos[2] ? productPhotos[2] : productPhotos[0]}
              alt='Third slide'
            />
          </Carousel.Item>
        </Carousel>
        {/* <img className='product-image' src={productPhotos[0]} alt='' /> */}
      </div>

      <div className='title-container'>
        <p className='card-title'>{productTitle}</p>
        <Rating
          className='rating'
          name='half-rating-read'
          defaultValue={productReview}
          precision={0.5}
          readOnly
        />
        {/* <p>{productReview}</p> */}
      </div>
      <div className='price-container'>
        <p className='product-price'>${productPrice}</p>
        <button onClick={handlAddToCart} className='add-to-cart-btn'>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;
