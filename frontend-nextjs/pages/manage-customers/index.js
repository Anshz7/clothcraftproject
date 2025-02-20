import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Added search state

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/customer/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Added filtered customers logic
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.contactNumber?.includes(searchQuery)
    );
  });

  const deleteCustomer = async (customerId) => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8080/customer/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customer_id: customerId }),
      });

      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Manage Customers
        </h1>

        {/* Added Search Bar */}
        <div className="w-full max-w-5xl mb-6">
          <input
            type="text"
            placeholder="Search customers by name, email, or contact number..."
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Customer Table */}
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">
                  Contact Number
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.customer_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.contactNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => deleteCustomer(customer.customer_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
