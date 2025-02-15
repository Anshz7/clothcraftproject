import { useEffect, useState } from "react";
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
    "/manage-customers",
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

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setRole(null); // Reset role immediately
        if (!publicRoutes.includes(router.pathname)) {
          router.replace("/");
        }
        return;
      }

      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = atob(payloadBase64);
        const payload = JSON.parse(decodedPayload);
        setRole(payload.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setRole(null);
        router.replace("/");
      }
    };

    checkAuth();

    // Listen for token removal (logout)
    const handleStorageChange = (event) => {
      if (event.key === "token" && !event.newValue) {
        setRole(null);
        router.replace("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
