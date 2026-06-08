import React, { useContext, useState } from "react";
import { User, Mail, Lock, Eye, EyeClosed } from "lucide-react";
import AppContext from "../context/AppContext";
import api from "../config/api";

const Login = () => {
  const [state, setState] = useState("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { user, login, signup } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (state == "signin") {
      signup({ username, email, password });
    } else {
      login({ email, password });
    }
    setIsSubmitted(false);
    //beacause to get back disabled button if login/signup fails
  };
  return (
    <>
      <main className="login-page-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="text-3xl text-gray-900 dark:text-white">
            {state === "signin" ? "Sign Up" : "Login In"}
          </h2>
          <p className="mt-2 text-gray-500/90 dark:text-gray-400">
            {state === "signin"
              ? "Enter Your detail to Create Account"
              : "Enter your Details to Log in"}
          </p>
          {/* username only in signup */}
          {state === "signin" && (
            <div className="mt-4">
              <label className="font-medium text-sm text-gray-700 dark:text-gray-400">
                Username:
                <div className="relative mt-2">
                  <User className=" absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-400 size-4.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                    placeholder="Enter Username"
                  />
                </div>
              </label>
            </div>
          )}
          {/* email */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-400">
              Email
            </label>
            <div className="mt-2 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-400 size-4.5" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Enter Email"
              />
            </div>
          </div>
          {/* password */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-400">
              Password:
              <div className="relative mt-2">
                <Lock className=" absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-400 size-4.5" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-400 size-4.5 cursor-pointer"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
          </div>

          {/* submit button */}
          <button
            type="submit"
            className="login-button cursor-pointer"
            disabled={isSubmitted}
          >
            {isSubmitted
              ? "Submitting..."
              : state === "signin"
                ? "Sign up"
                : "Log in"}
          </button>
          {state === "login" ? (
            <p className="mt-2 text-center text gray-700 dark:text-gray-400 text-sm">
              Dont have Account?{" "}
              <button
                type="button"
                className="text-green-600 dark:text-green-500 hover:cursor-pointer hover:underline"
                onClick={() => {
                  setState("signin");
                }}
              >
                Signup
              </button>
            </p>
          ) : (
            <p className="mt-2 text-center text gray-700 dark:text-gray-400 text-sm">
              Already have Account?{" "}
              <button
                type="button"
                className="text-green-600 dark:text-green-500 hover:cursor-pointer hover:underline"
                onClick={() => {
                  setState("login");
                }}
              >
                Login
              </button>
            </p>
          )}
        </form>
      </main>
    </>
  );
};

export default Login;
