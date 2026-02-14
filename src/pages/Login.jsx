import React from "react";
import LoginForm from "../components/auth/LoginForm";
import "../styles/Login.css";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-wrapper">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
