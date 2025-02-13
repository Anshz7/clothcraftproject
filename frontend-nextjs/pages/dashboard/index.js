import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return;
    }

    fetch("http://localhost:8080/dashboard/details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setDashboardData(data))
      .catch((error) => console.error("Error fetching dashboard data:", error));
  }, [router]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          Dashboard
        </h1>
        {dashboardData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 md:px-10">
            {[
              { label: "Categories", value: dashboardData.categoryCount },
              { label: "Products", value: dashboardData.product },
              { label: "Customers", value: dashboardData.customer },
              { label: "Sales", value: dashboardData.sale },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-start"
              >
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  {item.label}
                </h2>
                <p className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  {item.value}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-purple-500 dark:bg-purple-400 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (item.value / (dashboardData.total || 100)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Progress towards target
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-800 dark:text-gray-100">
            Loading dashboard data...
          </p>
        )}
  
        {/* Statistics Section */}
        {dashboardData && (
          <div className="w-full max-w-4xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Sales Performance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Monthly Target
                </span>
                <span className="text-purple-500 font-semibold">
                  {dashboardData.sale}/1000
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div
                  className="bg-purple-500 dark:bg-purple-400 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min((dashboardData.sale / 1000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
  
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Customer Growth
              </h2>
              <p className="text-2xl font-semibold text-green-500">
                +{dashboardData.customerGrowth || 0}% from last month
              </p>
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                Compared to previous month
              </span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
