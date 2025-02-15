import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons"; // FontAwesome Icons

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [role, setRole] = useState(null);
  const [monthlyGoals, setMonthlyGoals] = useState({
    sales: 1000,
    customers: 500,
  });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return;
    }

    fetch("http://localhost:8080/dashboard/details", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setDashboardData(data);
        setRole(data.role);
      })
      .catch((error) => console.error("Error fetching dashboard data:", error));

    checkAndResetGoals();
  }, [router]);

  const checkAndResetGoals = () => {
    const lastUpdated = localStorage.getItem("lastGoalUpdate");
    const currentMonth = new Date().getMonth();

    if (!lastUpdated || parseInt(lastUpdated) !== currentMonth) {
      localStorage.setItem("lastGoalUpdate", currentMonth);
      setMonthlyGoals({ sales: 1000, customers: 500 });
    } else {
      const storedGoals = JSON.parse(localStorage.getItem("monthlyGoals"));
      if (storedGoals) setMonthlyGoals(storedGoals);
    }
  };

  const saveGoals = () => {
    localStorage.setItem("monthlyGoals", JSON.stringify(monthlyGoals));
    setIsEditing(false);
  };

  return (
    <Layout role={role}>
      <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-5xl flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            onClick={() => (isEditing ? saveGoals() : setIsEditing(true))}
          >
            <FontAwesomeIcon icon={isEditing ? faCheck : faEdit} size="sm" />
            <span>{isEditing ? "Save Goals" : "Edit Goals"}</span>
          </button>
        </div>

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
            {/* Sales Performance */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Sales Performance
              </h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">
                  Monthly Target
                </span>
                {isEditing ? (
                  <input
                    type="number"
                    className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-center rounded-lg px-3 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={monthlyGoals.sales}
                    onChange={(e) =>
                      setMonthlyGoals({
                        ...monthlyGoals,
                        sales: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  <span className="text-purple-500 font-semibold">
                    {dashboardData.sale}/{monthlyGoals.sales}
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-purple-500 dark:bg-purple-400 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      (dashboardData.sale / monthlyGoals.sales) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Customer Growth */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Customer Growth
              </h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">
                  Monthly Target
                </span>
                {isEditing ? (
                  <input
                    type="number"
                    className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-center rounded-lg px-3 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={monthlyGoals.customers}
                    onChange={(e) =>
                      setMonthlyGoals({
                        ...monthlyGoals,
                        customers: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  <span className="text-green-500 font-semibold">
                    {dashboardData.customer}/{monthlyGoals.customers}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
