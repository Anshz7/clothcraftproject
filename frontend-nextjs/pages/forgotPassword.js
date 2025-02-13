import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ForgotPasswordPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/employee/forgotPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setError("");
      } else {
        setError(data.message || "Failed to send password.");
        setSuccessMessage("");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-10 text-gray-800 dark:text-gray-50 text-2xl focus:outline-none"
      >
        {isDarkMode ? (
          <FontAwesomeIcon icon={faSun} />
        ) : (
          <FontAwesomeIcon icon={faMoon} />
        )}
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Forgot Password
        </h1>
        {error && (
          <p className="text-red-600 dark:text-red-400 text-center mb-4">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-green-600 dark:text-green-400 text-center mb-4">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-purple-400 dark:focus:ring-purple-600 outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Send Password
          </button>
        </form>
        <p className="text-center text-gray-700 dark:text-gray-200 mt-4 text-sm">
          Remembered your password?{" "}
          <a
            href="/"
            className="text-purple-500 dark:text-purple-400 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
