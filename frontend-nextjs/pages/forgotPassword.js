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
    <div className="min-h-screen bg-gradient-to-r from-bouquet-50 via-bouquet-200 to-bouquet-400 dark:from-bouquet-900 dark:via-bouquet-800 dark:to-bouquet-950 flex items-center justify-center">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-10 text-bouquet-800 dark:text-bouquet-50 text-2xl focus:outline-none"
      >
        {isDarkMode ? (
          <FontAwesomeIcon icon={faSun} />
        ) : (
          <FontAwesomeIcon icon={faMoon} />
        )}
      </button>
      <div className="bg-white dark:bg-bouquet-700 rounded-2xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-bouquet-800 dark:text-bouquet-100 mb-6">
          Forgot Password
        </h1>
        {error && (
          <p className="text-bouquet-800 dark:text-bouquet-200 text-center mb-4">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-bouquet-800 dark:text-bouquet-200 text-center mb-4">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-bouquet-700 dark:text-bouquet-200 font-medium mb-1"
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
              className="w-full p-3 border rounded-lg focus:ring focus:ring-bouquet-400 dark:focus:ring-bouquet-600 outline-none bg-bouquet-50 dark:bg-bouquet-200 text-bouquet-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-bouquet-500 to-bouquet-700 dark:from-bouquet-200 dark:to-bouquet-600 text-white dark:text-bouquet-900 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Send Password
          </button>
        </form>
        <p className="text-center text-bouquet-700 dark:text-bouquet-200 mt-4 text-sm">
          Remembered your password?{" "}
          <a
            href="/"
            className="text-bouquet-500 dark:text-bouquet-400 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
