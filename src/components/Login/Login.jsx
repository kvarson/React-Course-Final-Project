import React, { createContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    let item = { email, password };
    try {
      let result = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(item),
      });
      result = await result.json();

      localStorage.setItem("user-info", JSON.stringify(result));

      if (result.user) {
        navigate("/products");
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className='form-container'>
      {error && <div className='wrong-email'>Wrong Email or Password</div>}
      <form onSubmit={handleSubmit} className='form'>
        <h1>LOGIN</h1>
        <input
          value={email}
          className='input'
          type='email'
          onChange={handleEmailChange}
          placeholder='Email'
        />
        <br />
        <input
          value={password}
          className='input'
          type='password'
          onChange={handlePasswordChange}
          placeholder='Password'
        />

        <p>
          Don't have an account? <Link to='/signup'>Sign Up</Link>
        </p>
        <button className='btn'>Sign In</button>
      </form>
    </div>
  );
};

export default Login;
