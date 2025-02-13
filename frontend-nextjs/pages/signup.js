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
          Sign up to ClothKraft
        </h1>
        {error && <p className="text-bouquet-800 dark:text-bouquet-200 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="employee_name"
              className="block text-bouquet-700 dark:text-bouquet-200 font-medium mb-1"
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
              className="w-full p-3 border rounded-lg focus:ring focus:ring-bouquet-400 dark:focus:ring-bouquet-600 outline-none bg-bouquet-50 dark:bg-bouquet-200 text-bouquet-800"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="employee_phone"
              className="block text-bouquet-700 dark:text-bouquet-200 font-medium mb-1"
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
              className="w-full p-3 border rounded-lg focus:ring focus:ring-bouquet-400 dark:focus:ring-bouquet-600 outline-none bg-bouquet-50 dark:bg-bouquet-200 text-bouquet-800"
              required
            />
          </div>
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
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-bouquet-400 dark:focus:ring-bouquet-600 outline-none bg-bouquet-50 dark:bg-bouquet-200 text-bouquet-800"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-bouquet-700 dark:text-bouquet-200 font-medium mb-1"
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
                className="w-full p-3 border rounded-lg focus:ring focus:ring-bouquet-400 dark:focus:ring-bouquet-600 outline-none bg-bouquet-50 dark:bg-bouquet-200 text-bouquet-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-bouquet-600 dark:text-bouquet-400"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-bouquet-700 dark:text-bouquet-200 font-medium mb-1"
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
                className="w-full p-3 border rounded-lg focus:ring focus:ring-bouquet-400 dark:focus:ring-bouquet-600 outline-none bg-bouquet-50 dark:bg-bouquet-200 text-bouquet-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-bouquet-600 dark:text-bouquet-400"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-bouquet-500 to-bouquet-700 dark:from-bouquet-200 dark:to-bouquet-600 text-white dark:text-bouquet-900 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-bouquet-700 dark:text-bouquet-200 mt-4 text-sm">
          Already have an account?{" "}
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
