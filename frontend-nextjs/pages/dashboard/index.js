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
    <div className="min-h-screen bg-gradient-to-r from-bouquet-50 via-bouquet-200 to-bouquet-400 dark:from-bouquet-900 dark:via-bouquet-800 dark:to-bouquet-950 flex items-center justify-center">
      <div className="bg-white dark:bg-bouquet-950 p-10 rounded-lg shadow-lg text-center">
        {role === "admin" && (
          <h1 className="text-2xl font-bold text-center text-bouquet-800 dark:text-bouquet-100 mb-6">
            Welcome to Dashboard, Admin
          </h1>
        )}
        {role === "employee" && (
          <h1 className="text-2xl font-bold text-center text-bouquet-800 dark:text-bouquet-100 mb-6">
            Welcome to Dashboard, Employee
          </h1>
        )}
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-bouquet-500 to-bouquet-700 dark:from-bouquet-200 dark:to-bouquet-600 text-white dark:text-bouquet-900 py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
