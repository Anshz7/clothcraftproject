import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Added search state

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Added filtered categories logic
  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category_name: newCategory }),
      });

      if (response.ok) {
        setNewCategory("");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const updateCategory = async (categoryId) => {
    if (!editedCategoryName.trim()) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_id: categoryId,
          category_name: editedCategoryName,
        }),
      });

      if (response.ok) {
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category_id: categoryId }),
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Manage Categories
        </h1>

        {/* Added Search Bar */}
        <div className="w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add Category Input */}
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="mt-3 w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center transition"
            onClick={addCategory}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Category
          </button>
        </div>

        {/* Category List - Updated to use filteredCategories */}
        <div className="mt-6 w-full max-w-md">
          {filteredCategories.map((category) => (
            <div
              key={category.category_id}
              className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl mb-2 shadow-lg"
            >
              {editingCategory === category.category_id ? (
                <input
                  type="text"
                  className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                />
              ) : (
                <span className="text-gray-800 dark:text-gray-100">
                  {category.category_name}
                </span>
              )}

              <div className="flex space-x-3">
                {editingCategory === category.category_id ? (
                  <button
                    className="text-green-500 hover:text-green-600 transition"
                    onClick={() => updateCategory(category.category_id)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                ) : (
                  <button
                    className="text-blue-500 hover:text-blue-600 transition"
                    onClick={() => {
                      setEditingCategory(category.category_id);
                      setEditedCategoryName(category.category_name);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                )}
                <button
                  className="text-red-500 hover:text-red-600 transition"
                  onClick={() => deleteCategory(category.category_id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
