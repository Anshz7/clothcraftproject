import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [theme, setTheme] = useState("light");
  const [searchQuery, setSearchQuery] = useState(""); // Added search state

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = await response.json();
      data = data.map((emp) => ({
        ...emp,
        status:
          emp.status === "true" || emp.status === 1 || emp.status === true,
      }));
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Added filtered employees logic
  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      employee.employee_name?.toLowerCase().includes(searchLower) ||
      employee.employee_phone?.includes(searchQuery) ||
      employee.salary?.toString().includes(searchQuery) ||
      employee.join_year?.toString().includes(searchQuery) ||
      employee.email?.toLowerCase().includes(searchLower) ||
      (employee.status ? "active" : "inactive").includes(searchLower)
    );
  });

  const toggleStatus = async (employeeId, currentStatus) => {
    const token = localStorage.getItem("token");
    const newStatus = !currentStatus;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: employeeId,
          status: newStatus ? "true" : "false",
        }),
      });

      fetchEmployees();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteEmployee = async (employeeId) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employee_id: employeeId }),
      });

      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const openEditModal = (employee) => {
    setEditEmployee(employee);
    setFormData({
      ...employee,
      status: employee.status ? "true" : "false",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveEmployeeDetails = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: formData.employee_id,
          employee_name: formData.employee_name,
          salary: formData.salary,
          status: formData.status === "true" ? "true" : "false",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Employee Updated Successfully", result);
        setShowModal(false);
        fetchEmployees();
      } else {
        console.error("Error updating employee:", result);
        alert(result.message || "Error updating employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee details.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Manage Employees
        </h1>

        {/* Added Search Bar */}
        <div className="w-full max-w-5xl mb-6">
          <input
            type="text"
            placeholder="Search employees by name, phone, salary, join year, email, or status..."
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Employee Table */}
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Salary</th>
                <th className="border border-gray-300 px-4 py-2">Joining Date</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.employee_id}
                  className={`${
                    employee.status ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.employee_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.employee_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.employee_phone}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.salary}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.join_year}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() =>
                        toggleStatus(employee.employee_id, employee.status)
                      }
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                        employee.status ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          employee.status ? "translate-x-6" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => openEditModal(employee)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => deleteEmployee(employee.employee_id)}
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

        {/* Edit Employee Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div
              className={`p-6 rounded-lg w-96 ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <h2 className="text-lg font-bold">Edit Employee</h2>
              <input
                type="text"
                name="employee_name"
                value={formData.employee_name}
                onChange={handleInputChange}
                className="w-full p-2 my-2 border bg-transparent"
                placeholder="Name"
              />
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full p-2 my-2 border bg-transparent"
                placeholder="Salary"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 my-2 border bg-transparent"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <button
                onClick={saveEmployeeDetails}
                className="bg-blue-500 text-white p-2 w-full mt-2"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white p-2 w-full mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
