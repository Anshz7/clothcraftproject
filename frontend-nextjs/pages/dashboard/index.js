import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [role, setRole] = useState("");
  const router = useRouter();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);

    if (!token) {
      router.replace("/");
      return;
    }

    const decodedToken = parseJwt(token);
    console.log("Decoded token:", decodedToken);

    if (decodedToken && decodedToken.role) {
      setRole(decodedToken.role);
    } else {
      localStorage.removeItem("token");
      router.replace("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-100 to-blue-200 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-700 p-10 rounded-lg shadow-lg text-center">
        {role === "admin" && (
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to Dashboard, Admin
          </h1>
        )}
        {role === "employee" && (
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to Dashboard, Employee
          </h1>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
