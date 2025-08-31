import React, { useState } from "react";
import { signUp } from "../services/api.js";   // import your function

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await signUp({ name, email, password, role });
      setSuccess(data.message);

      

      // Redirect after successful signup
      window.location.href = "/login";

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setRole("student");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Please Register
          </h1>

          {/* Name */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
                focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              required
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
                focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
                focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 
                focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg 
              text-sm px-5 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            Register
          </button>

          {/* Messages */}
          {success && <p className="mt-3 text-sm text-green-600">{success}</p>}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </form>
  );
};

export default SignUp;
