import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import { parseJwt } from "../../helpers/jwt.helper";
import Navbar from "../Navbar/Navbar";
import "./products.css";
import { Pagination } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowIcon from "@mui/icons-material/KeyboardArrowUp";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState("asc");
  const [users, setUsers] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = Math.ceil(20 / limit);

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

  const fetchProducts = async (
    token,
    page,
    limit,
    minValue = null,
    maxValue = null,
    order = "asc"
  ) => {
    try {
      let url = `http://localhost:8000/products?_page=${page}&_limit=${limit}&_sort=price&_order=${order}`;
      if (minValue !== null || maxValue !== null) {
        url = `http://localhost:8000/products?_page=${page}&_limit=${limit}&price_gte=${minValue}&price_lte=${maxValue}&_sort=price&_order=${order}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setProducts(data);
    } catch (e) {
      console.error(e);
      setProducts([]);
    }
  };
  const handleMinChange = (e) => {
    setMinValue(e.target.value);
  };
  const handleMaxChange = (e) => {
    setMaxValue(e.target.value);
  };

  const handlePaginationChange = (e, nextPage) => {
    console.log(nextPage);
    setPage(nextPage);
    fetchProducts(accessToken, nextPage, limit);
    // console.log(params);
  };
  const handleFilter = (maxValue, minValue) => {
    fetchProducts(accessToken, page, limit, maxValue, minValue);
  };
  const handleDisplayAll = () => {
    fetchProducts(accessToken, page, limit, null, null);
  };
  const sortProducts = () => {
    const newOrder = order === "asc" ? "desc" : "asc";

    setOrder(newOrder);

    fetchProducts(accessToken, page, limit, null, null, newOrder);
  };
  const searchProducts = async (searchTerm) => {
    let query = `http://localhost:8000/products/`;

    if (searchTerm) {
      query += `?q=${searchTerm}`;
    }
    const response = await fetch(query, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchUser(sub, accessToken);
    fetchProducts(accessToken, page, limit);
  }, [page]);

  useEffect(() => {
    searchProducts(searchTerm);
  }, [searchTerm]);
  return (
    <div>
      <Navbar email={email} />
      <div className='layout-container'>
        <div className='left-layout'>
          <div className='price-layout'>
            <p>PRICE: </p>
            <div className='min-container'>
              <label>MIN</label>
              <input
                type='number'
                className='min-input'
                value={minValue}
                onChange={handleMinChange}
              />
            </div>

            <div className='max-container'>
              <label>MAX</label>
              <input
                type='number'
                className='min-input'
                value={maxValue}
                onChange={handleMaxChange}
              />
            </div>

            <div className='button-container'>
              <button
                className='filter-btn'
                onClick={() => handleFilter(minValue, maxValue)}
              >
                Filter
              </button>

              <button className='all-products' onClick={handleDisplayAll}>
                Display All
              </button>
            </div>
          </div>
        </div>
        <div className='middle-layout'>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
            type='text'
            placeholder='Search...'
          />
          <div className='grid-container'>
            {products.map((product) => {
              return (
                <Card
                  key={product.id}
                  productId={product.id}
                  productTitle={product.title}
                  productCategory={product.category}
                  productDescription={product.description}
                  productPhotos={product.photos}
                  productPrice={product.price}
                  productReview={product.review}
                />
              );
            })}
          </div>
          <Pagination
            className='pagination'
            count={totalPages}
            page={page}
            onChange={handlePaginationChange}
          />
        </div>
        <div className='right-layout'>
          <div>
            <button className='sort-btn' onClick={sortProducts}>
              Sort
              <KeyboardArrowUpIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
