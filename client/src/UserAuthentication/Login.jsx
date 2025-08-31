// src/pages/Login.jsx
import { useState } from "react";
import { loginuser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const data = await loginuser({ email, password });

    // ✅ Use AuthContext login instead of localStorage
    login(data.token, data.user);

    // Role-based navigation
    if (data.user.role === "teacher") {
      navigate("/teacher");
    } else if (data.user.role === "student") {
      navigate("/student");
    } else {
      navigate("/");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Card Container */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Please Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="name@domain.com"
              required
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
              focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
              dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              required
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
              focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
              dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg 
            text-sm px-5 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            Sign In
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* Extra Links */}
        <p className="mt-5 text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
