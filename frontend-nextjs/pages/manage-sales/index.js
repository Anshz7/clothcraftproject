import { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";

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

export default function SalesPage() {
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    contactNumber: "",
  });
  const [customerSearch, setCustomerSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const customerDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target) &&
        event.target.id !== "customer-search"
      ) {
        setShowCustomerDropdown(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target) &&
        event.target.id !== "category-search"
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target) &&
        event.target.id !== "product-search"
      ) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
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
    }
  };

  const fetchProducts = async (categoryId) => {
    if (!categoryId) {
      setProducts([]);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/getByCategory/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const calculateTotal = () => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const addToCart = () => {
    const product = products.find((p) => p.product_id === selectedProduct);
    if (product && quantity > 0) {
      const existingItem = cart.find(
        (item) => item.product_id === selectedProduct
      );
      if (existingItem) {
        setCart(
          cart.map((item) =>
            item.product_id === selectedProduct
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setCart([
          ...cart,
          {
            product_id: selectedProduct,
            product_name: product.product_name,
            price: Number(product.price),
            quantity: quantity,
          },
        ]);
      }
      setQuantity(1);
      setSelectedProduct("");
      setProductSearch("");
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  const handleCustomerSelect = (customer) => {
    setCustomerDetails({
      name: customer.name,
      email: customer.email,
      contactNumber: customer.contactNumber,
    });
    setCustomerSearch(`${customer.name} (${customer.contactNumber})`);
    setShowCustomerDropdown(false);
  };

  const generateSale = async () => {
    if (
      !customerDetails.name ||
      !customerDetails.contactNumber ||
      cart.length === 0
    ) {
      setToast({
        show: true,
        message: "Please fill all required fields and add products",
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const saleData = {
      ...customerDetails,
      paymentMethod: paymentMethod,
      totalAmount: totalAmount,
      productDetails: JSON.stringify(cart),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sale/generateReport`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(saleData),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        setToast({
          show: true,
          message: "Sale generated successfully!",
          type: "success",
        });
        setCart([]);
        setCustomerDetails({ name: "", email: "", contactNumber: "" });
        setCustomerSearch("");
      } else {
        setToast({
          show: true,
          message: `Error: ${responseData.message || "Quantity OverExceeding"}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error generating sale:", error);
      setToast({
        show: true,
        message: "An error occurred while generating the sale.",
        type: "error",
      });
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.contactNumber?.includes(customerSearch)
  );

  const filteredCategories = categories.filter((category) =>
    category.category_name?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.product_name?.toLowerCase().includes(productSearch.toLowerCase())
  );

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
          Create New Sale
        </h1>

        {/* Customer Section */}
        <div className="w-full max-w-2xl mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Customer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <input
                id="customer-search"
                type="text"
                placeholder="Search existing customers..."
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setShowCustomerDropdown(true);
                }}
                onFocus={() => setShowCustomerDropdown(true)}
              />
              {showCustomerDropdown && (
                <div
                  ref={customerDropdownRef}
                  className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                >
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.customer_id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      {customer.name} ({customer.contactNumber})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Customer Name *"
              className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
              value={customerDetails.name}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Contact Number *"
              className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
              value={customerDetails.contactNumber}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  contactNumber: e.target.value,
                })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
              value={customerDetails.email}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  email: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Product Selection */}
        <div className="w-full max-w-2xl mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Product Selection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <input
                id="category-search"
                type="text"
                placeholder="Search categories..."
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                onFocus={() => setShowCategoryDropdown(true)}
              />
              {showCategoryDropdown && (
                <div
                  ref={categoryDropdownRef}
                  className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                >
                  {filteredCategories.map((category) => (
                    <div
                      key={category.category_id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                      onClick={() => {
                        setSelectedCategory(category.category_id);
                        setCategorySearch(category.category_name);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      {category.category_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <input
                id="product-search"
                type="text"
                placeholder="Search products..."
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowProductDropdown(true);
                }}
                disabled={!selectedCategory}
                onFocus={() => setShowProductDropdown(true)}
              />
              {showProductDropdown && (
                <div
                  ref={productDropdownRef}
                  className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                      onClick={() => {
                        setSelectedProduct(product.product_id);
                        setProductSearch(product.product_name);
                        setShowProductDropdown(false);
                      }}
                    >
                      {product.product_name} (₹{product.price})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
              />
              <button
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={addToCart}
                disabled={!selectedProduct}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Selected Products
            </h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {item.product_name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      x{item.quantity} @ ₹{item.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      ₹{item.quantity * item.price}
                    </span>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => removeFromCart(item.product_id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="w-full max-w-2xl mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <select
                className="p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
              </select>
              <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Total: ₹{totalAmount}
              </div>
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={generateSale}
            >
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
