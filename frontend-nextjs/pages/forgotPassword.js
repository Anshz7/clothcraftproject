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
    <div className="min-h-screen bg-gradient-to-r from-teal-100 via-blue-100 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-10 text-gray-800 dark:text-gray-100 text-2xl focus:outline-none"
      >
        {isDarkMode ? (
          <FontAwesomeIcon icon={faSun} />
        ) : (
          <FontAwesomeIcon icon={faMoon} />
        )}
      </button>
      <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Forgot Password
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 dark:text-gray-300 font-medium mb-1"
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
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-400 to-blue-500 dark:from-teal-600 dark:to-blue-700 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Send Password
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-sm">
          Remembered your password?{" "}
          <a
            href="/"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
