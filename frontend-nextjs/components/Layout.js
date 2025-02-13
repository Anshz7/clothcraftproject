import { useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSun, faMoon, faBars } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "./ThemeContext";

export default function Layout({ children, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const adminLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Manage Customers", path: "/manage-customers" },
    { name: "Manage Products", path: "/manage-products" },
    { name: "Manage Sales", path: "/manage-sales" },
    { name: "View Bill", path: "/view-bill" },
    { name: "Manage Categories", path: "/manage-categories" },
    { name: "Manage Employees", path: "/manage-employees" },
  ];

  const employeeLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Manage Customers", path: "/manage-customers" },
    { name: "Manage Products", path: "/manage-products" },
    { name: "Manage Sales", path: "/manage-sales" },
    { name: "View Bill", path: "/view-bill" },
  ];

  const links = role === "admin" ? adminLinks : employeeLinks;

  return (
    <div className="flex min-h-screen bg-stone-100 dark:bg-gray-900">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 bg-gradient-to-r from-indigo-200 via-purple-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 h-full fixed left-0 top-0 flex flex-col p-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            ClothKraft
          </div>
          <nav className="flex flex-col space-y-4">
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => router.push(link.path)}
                className={`text-left w-full px-4 py-2 rounded-lg text-gray-900 dark:text-gray-200 hover:bg-purple-200 dark:hover:bg-purple-400 transition ${
                  router.pathname === link.path ? "bg-purple-300 dark:bg-purple-500" : ""
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-0"} transition-all`}>
        {/* Navbar */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 shadow-lg">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-900 dark:text-white md:hidden"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="text-gray-900 dark:text-white font-bold text-xl"></div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              className="p-2 text-gray-900 dark:text-white hover:text-purple-500 transition"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
            </button>
            {/* User Menu */}
            <div className="relative">
              <button
                className="p-2 text-gray-900 dark:text-white"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => router.push("/user-details")}
                    className="block w-full text-left px-4 py-2 text-gray-900 dark:text-gray-200 hover:bg-stone-300 dark:hover:bg-gray-700"
                  >
                    User Details
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-900 dark:text-gray-200 hover:bg-stone-300 dark:hover:bg-gray-700"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-0">{children}</main>
      </div>
    </div>
  );
}
