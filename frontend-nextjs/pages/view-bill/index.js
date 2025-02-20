import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Added search state

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/sale/getBills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  // Added filtered bills logic
  const filteredBills = bills.filter((bill) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      bill.name?.toLowerCase().includes(searchLower) ||
      bill.email?.toLowerCase().includes(searchLower) ||
      bill.contactNumber?.includes(searchQuery) ||
      bill.paymentMethod?.toLowerCase().includes(searchLower) ||
      bill.total?.toString().includes(searchQuery) ||
      bill.createdBy?.toLowerCase().includes(searchLower)
    );
  });

  const deleteBill = async (billId) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8080/sale/delete/${billId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBills();
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  const handleViewPdf = async (bill) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/sale/getPdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uuid: bill.uuid,
          name: bill.name,
          email: bill.email,
          contactNumber: bill.contactNumber,
          paymentMethod: bill.paymentMethod,
          totalAmount: bill.totalAmount,
          productDetails: JSON.stringify(bill.productDetails),
        }),
      });

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Manage Bills
        </h1>

        {/* Added Search Bar */}
        <div className="w-full max-w-5xl mb-6">
          <input
            type="text"
            placeholder="Search bills by name, email, contact, payment method, total or seller..."
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Bills Table */}
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Contact</th>
                <th className="border border-gray-300 px-4 py-2">
                  Payment Method
                </th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
                <th className="border border-gray-300 px-4 py-2">Sale By</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              {filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {bill.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {bill.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {bill.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {bill.contactNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {bill.paymentMethod}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₹{bill.total}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {bill.createdBy}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-4">
                    <button
                      onClick={() => handleViewPdf(bill)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faFilePdf} />
                    </button>
                    <button
                      onClick={() => deleteBill(bill.id)}
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
