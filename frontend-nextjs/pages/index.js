import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setShowSuccessModal(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
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
          Welcome to ClothKraft
        </h1>
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
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-purple-400 dark:focus:ring-purple-600 outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring focus:ring-purple-400 dark:focus:ring-purple-600 outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-600 dark:text-gray-400"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-200 mt-4 text-sm">
              Forgot Password?{" "}
              <a
                href="/forgotPassword"
                className="text-purple-500 dark:text-purple-400 hover:underline"
              >
                Click Here
              </a>
            </p>
          </div>

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mb-4">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Continue
          </button>
        </form>
        <p className="text-center text-gray-700 dark:text-gray-200 mt-4 text-sm">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-purple-500 dark:text-purple-400 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Login Successful!
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
