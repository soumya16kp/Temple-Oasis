import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/AuthSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService  from "../appwrite/authService";
import  Input  from "./Input";
import "./Login.css"; 

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async(data) => {
    setError("")
    try {
        const session = await authService.login(data)
        if (session) {
            const userData = await authService.getCurrentUser()
            if(userData) dispatch(authLogin(userData));
            navigate("/")
        }
    } catch (error) {
        setError(error.message)
    }
}

  return (
    <div className="login-container">
      <h2>Login in to your account</h2>
      <p>
        Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
      </p>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit(login)} className="login-form">
        <div className="input-group">
          <label>Email:</label>
          <Input
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email format",
              },
            })}
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <Input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
            })}
          />
        </div>

        <button type="submit" className="login-button">Login in</button>
      </form>
    </div>
  );
}

export default Login;
