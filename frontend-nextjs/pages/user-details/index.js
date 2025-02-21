import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employee/getCurrent`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Invalid response: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert(error.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Password validation
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return setErrorMessage(
        "Password must be at least 8 characters long and contain at least one number and one special character (!@#$%^&*)."
      );
    }

    if (newPassword !== confirmPassword) {
      return setErrorMessage("New passwords do not match");
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/employee/changePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text.substring(0, 100));
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Password change failed");
      }

      setSuccessMessage(data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          My Profile
        </h1>

        {/* Personal Details Section */}
        {userDetails && (
          <div className="w-full max-w-2xl mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 dark:text-gray-400 font-semibold">Name</label>
                <p className="text-gray-800 dark:text-gray-100">
                  {userDetails.employee_name}
                </p>
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400 font-semibold">
                  Email
                </label>
                <p className="text-gray-800 dark:text-gray-100">
                  {userDetails.email}
                </p>
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400 font-semibold">
                  Phone
                </label>
                <p className="text-gray-800 dark:text-gray-100">
                  {userDetails.employee_phone}
                </p>
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400 font-semibold">
                  Join Date
                </label>
                <p className="text-gray-800 dark:text-gray-100">
                  {userDetails.join_year}
                </p>
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400 font-semibold">
                  Salary
                </label>
                <p className="text-gray-800 dark:text-gray-100">
                  ${userDetails.salary}
                </p>
              </div>
              <div>
                <label className="text-gray-600 dark:text-gray-400 font-semibold">
                  Status
                </label>
                <p className="text-gray-800 dark:text-gray-100">
                  {userDetails.status ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Section */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Change Password
          </h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-2">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-600 dark:text-gray-400"
                  >
                    <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-600 dark:text-gray-400"
                  >
                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-600 dark:text-gray-400"
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}