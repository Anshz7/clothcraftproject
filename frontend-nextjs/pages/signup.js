import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

export default function SignupPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    employee_name: "",
    employee_phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include a special character, and a number."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/employee/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_name: formData.employee_name,
          employee_phone: formData.employee_phone,
          email: formData.email,
          password: formData.password,
        }),
      });
      if (response.ok) {
        setShowModal(true);
      } else {
        const data = await response.json();
        setError(data.message || "Signup failed.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
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
      Sign up to ClothKraft
        </h1>
        {error && <p className="text-red-600 dark:text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="employee_name"
              className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
            >
              Full Name
            </label>
            <input
              id="employee_name"
              name="employee_name"
              type="text"
              placeholder="Enter your full name"
              value={formData.employee_name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-purple-400 dark:focus:ring-purple-600 outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="employee_phone"
              className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
            >
              Phone Number
            </label>
            <input
              id="employee_phone"
              name="employee_phone"
              type="text"
              placeholder="Enter your phone number"
              value={formData.employee_phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-purple-400 dark:focus:ring-purple-600 outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              required
            />
          </div>
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
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-purple-400 dark:focus:ring-purple-600 outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              required
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
                name="password"
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
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
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
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-700 dark:text-gray-200 mt-4 text-sm">
          Already have an account?{" "}
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
