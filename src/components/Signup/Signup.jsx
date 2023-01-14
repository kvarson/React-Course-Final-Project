import React, { useEffect, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [validation, setValidation] = useState({
    fName: "",
    email: "",
    password: "",
  });

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  useEffect(() => {
    checkValidation();
  }, [email, password, fullName]);

  const checkValidation = () => {
    let errors = validation;

    //first Name validation
    if (!fullName.trim()) {
      errors.fName = "Full name is required";
    } else {
      errors.fName = "";
    }

    // email validation
    const emailCond =
      /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!email.match(emailCond)) {
      errors.email = "Please ingress a valid email address";
    } else {
      errors.email = "";
    }

    //password validation
    const passwordz = password;
    if (!passwordz) {
      errors.password = "password is required";
    } else if (passwordz.length < 6) {
      errors.password = "Password must be longer than 6 characters";
    } else {
      errors.password = "";
    }
  };
  // http://localhost:8000/register
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.warn(email, password);
    let item = { email, password, fullName };
    try {
      let result = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(item),
      });
      result = await result.json();

      localStorage.setItem("user-info", JSON.stringify(result));

      if (!validation.fName && !validation.email && !validation.password) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit} className='form'>
        <h1>SIGN UP</h1>
        <input
          value={fullName}
          className='input'
          type='text'
          placeholder='Full Name'
          onChange={handleFullNameChange}
        />
        {validation.fName && (
          <p className='validation-alert'>{validation.fName}</p>
        )}
        <br />
        <input
          value={email}
          className='input'
          type='email'
          onChange={handleEmailChange}
          placeholder='Email'
        />
        {validation.email && (
          <p className='validation-alert'>{validation.email}</p>
        )}
        <br />
        <input
          value={password}
          className='input'
          type='password'
          onChange={handlePasswordChange}
          placeholder='Password'
        />
        {validation.password && (
          <p className='validation-alert'>{validation.password}</p>
        )}

        <p className='sign-paragraph'>
          Already have an account?{" "}
          <Link className='sign-in-link' to='/'>
            Sign In
          </Link>
        </p>
        <button type='submit' className='btn'>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
