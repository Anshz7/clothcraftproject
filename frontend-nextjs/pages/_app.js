import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/components/ThemeContext";
import "@/styles/globals.css";

const roleBasedRoutes = {
  admin: [
    "/dashboard",
    "/manage-customers",
    "/manage-products",
    "/manage-sales",
    "/view-bill",
    "/manage-categories",
    "/manage-employees",
    "/user-details",
  ],
  employee: [
    "/dashboard",
    "/manage-products",
    "/manage-sales",
    "/view-bill",
    "/user-details",
  ],
};

const publicRoutes = ["/", "/signup", "/forgotPassword"];

export default function App({ Component, pageProps }) {
  const [role, setRole] = useState(null);
  const router = useRouter();
  const timeoutIdRef = useRef(null);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole(null);
      if (!publicRoutes.includes(router.pathname)) {
        router.replace("/");
      }
      return;
    }

    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);

      // Check token expiration
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        localStorage.removeItem("token");
        setRole(null);
        router.replace("/");
        return;
      }

      // Set role if token is valid
      setRole(payload.role);

      // Clear existing timeout
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      // Set new timeout for automatic logout
      const remainingTime = expirationTime - currentTime;
      timeoutIdRef.current = setTimeout(() => {
        localStorage.removeItem("token");
        setRole(null);
        router.replace("/");
      }, remainingTime);
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      setRole(null);
      router.replace("/");
    }
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = (event) => {
      if (event.key === "token") {
        if (!event.newValue) {
          // Token removed
          if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
          }
          setRole(null);
          router.replace("/");
        } else {
          // Token added/updated
          checkAuth();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      // Clear timeout on component unmount
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [router.pathname]);

  useEffect(() => {
    if (role) {
      const allowedRoutes = roleBasedRoutes[role] || [];
      if (!allowedRoutes.includes(router.pathname)) {
        router.replace("/dashboard");
      }
    }
  }, [role, router.pathname]);

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
