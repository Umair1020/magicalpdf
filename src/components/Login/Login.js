import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseurl } from "../../utils/BaseUrl";
import Footer from "../Footer/Footer";
const Login = () => {
  const userCookie = Cookies.get("user");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let res;
  const handleAuth = async () => {
    try {
      const response = await axios.post(`${baseurl}/auth/login`, {
        Email: email,
        Password: password,
      });
      res = response;
      window.location.reload();
      Cookies.set("user", response.data.token);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  // const handleGoogleSignIn = async () => {
  //   window.open(`${baseurl}/auth/google`, "_self");
  // };
  function handleGoogleSignIn() {
    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/auth" +
      "?client_id=522145634044-s8od91l3uifec7tb2jct6gmc9v2g11nd.apps.googleusercontent.com" +
      `&redirect_uri=${baseurl}/auth/google/callback` +
      "&response_type=code" +
      "&scope=openid profile email";

    // Open a new window with the Google OAuth URL
    window.open(googleAuthUrl, "_self");
  }
  return (
    <div>
      <Header />
      <ToastContainer />
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{height: "81vh"}}>
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Login to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {" "}
              <Link
                className="font-medium text-indigo-600 hover:text-indigo-500"
                to="/signup"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                create an account
              </Link>
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <label
                for="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="email"
                  name="email"
                  id="email"
                  style={{
                    height: "50px",
                    padding: "10px",
                    border: "1px solid black",
                  }}
                  className="block w-full rounded-md pr-10 focus:outline-none sm:text-sm border-gray-300 text-gray-900 placeholder-gray-300 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                  placeholder="mary@magicalpdf.ai"
                  aria-invalid="false"
                  aria-describedby="email-error"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <br />
            <div>
              <label
                for="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="password"
                  placeholder="password"
                  style={{
                    height: "50px",
                    padding: "10px",
                    border: "1px solid black",
                  }}
                  id="password"
                  className="block w-full rounded-md pr-10 focus:outline-none sm:text-sm border-gray-300 text-gray-900 placeholder-gray-300 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                  aria-invalid="false"
                  aria-describedby="password-error"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm"></div>
            </div>
            <button
              className="text"
              onClick={handleGoogleSignIn}
              style={{
                backgroundColor: "#4285F4",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                marginTop: "10px",
                height: "50px",
              }}
            >
              <img
                src="/icons8-google-48.png"
                style={{ width: "20px", marginRight: "10px" }}
              />
              Continue with Google
            </button>
            <div onClick={handleAuth}>
              <button
                type="submit"
                style={{ height: "50px", marginTop: "10px" }}
                className="text"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div> <br /> <br />
      <Footer />
    </div>
  );
};

export default Login;
