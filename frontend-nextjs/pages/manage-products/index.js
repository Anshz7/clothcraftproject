import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4 animate-slide-in`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="text-xl font-bold">
        &times;
      </button>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    category_id: "",
    price: "",
    quantity: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    product_name: "",
    category_id: "",
    price: "",
    quantity: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setToast({
        show: true,
        message: "Failed to fetch products",
        type: "error",
      });
    }
  };

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
      setToast({
        show: true,
        message: "Failed to fetch categories",
        type: "error",
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesName = product.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const category = categories.find(
      (c) => c.category_id === product.category_id
    );
    const matchesCategory = category?.category_name
      ?.toLowerCase()
      ?.includes(searchQuery.toLowerCase());

    return matchesName || matchesCategory;
  });

  const addProduct = async () => {
    if (!newProduct.product_name.trim() || !newProduct.category_id) {
      setToast({
        show: true,
        message: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setToast({
          show: true,
          message: "Product added successfully",
          type: "success",
        });
        setNewProduct({
          product_name: "",
          category_id: "",
          price: "",
          quantity: "",
        });
        fetchProducts();
      } else {
        const errorData = await response.json();
        setToast({
          show: true,
          message: errorData.message || "Failed to add product",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setToast({
        show: true,
        message: "Failed to add product",
        type: "error",
      });
    }
  };

  const updateProduct = async (productId) => {
    if (!editedProduct.product_name.trim() || !editedProduct.category_id) {
      setToast({
        show: true,
        message: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...editedProduct, product_id: productId }),
      });

      if (response.ok) {
        setToast({
          show: true,
          message: "Product updated successfully",
          type: "success",
        });
        setEditingProduct(null);
        fetchProducts();
      } else {
        const errorData = await response.json();
        setToast({
          show: true,
          message: errorData.message || "Failed to update product",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setToast({
        show: true,
        message: "Failed to update product",
        type: "error",
      });
    }
  };

  const deleteProduct = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/delete/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setToast({
          show: true,
          message: "Product deleted successfully",
          type: "success",
        });
        fetchProducts();
      } else {
        const errorData = await response.json();
        setToast({
          show: true,
          message: errorData.message || "Failed to delete product",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setToast({
        show: true,
        message: "Failed to delete product",
        type: "error",
      });
    }
  };

  return (
    <Layout>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Manage Products
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-6">
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add Product Form */}
        <div className="w-full max-w-2xl mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Product Name"
              value={newProduct.product_name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, product_name: e.target.value })
              }
            />

            <select
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
              value={newProduct.category_id}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category_id: e.target.value })
              }
            >
              <option value="" className="text-gray-400 dark:text-gray-500">
                Select Category
              </option>
              {categories.map((category) => (
                <option
                  key={category.category_id}
                  value={category.category_id}
                  className="bg-white dark:bg-gray-800"
                >
                  {category.category_name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Price"
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Quantity"
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value })
              }
            />
          </div>

          <button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
            onClick={addProduct}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Product
          </button>
        </div>

        {/* Product List Table */}
        <div className="w-full max-w-2xl overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Name
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Category
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Price
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Quantity
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {filteredProducts.map((product) => (
                <tr
                  key={product.product_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-800 dark:text-gray-200">
                    {product.product_name}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-800 dark:text-gray-200">
                    {categories.find(
                      (c) => c.category_id === product.category_id
                    )?.category_name || "N/A"}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-800 dark:text-gray-200">
                    ₹{product.price}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-800 dark:text-gray-200">
                    {product.quantity}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-center space-x-3">
                    <button
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 transition-colors"
                      onClick={() => {
                        setEditingProduct(product.product_id);
                        setEditedProduct(product);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 transition-colors"
                      onClick={() => deleteProduct(product.product_id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Product Modal */}
        {editingProduct !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-96 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                Edit Product
              </h2>

              <input
                type="text"
                className="w-full p-2 mb-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={editedProduct.product_name}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    product_name: e.target.value,
                  })
                }
              />

              <select
                className="w-full p-2 mb-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={editedProduct.category_id}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    category_id: e.target.value,
                  })
                }
              >
                <option value="" className="text-gray-400 dark:text-gray-500">
                  Select Category
                </option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                    className="bg-white dark:bg-gray-800"
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="w-full p-2 mb-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={editedProduct.price}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, price: e.target.value })
                }
              />

              <input
                type="number"
                className="w-full p-2 mb-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={editedProduct.quantity}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    quantity: e.target.value,
                  })
                }
              />

              <div className="flex space-x-3">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
                  onClick={() => updateProduct(editingProduct)}
                >
                  Save
                </button>
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
