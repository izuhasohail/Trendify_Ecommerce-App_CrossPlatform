import React, { useEffect, useState } from "react";
import "../ProductForm/ProductForm.css";
import "./CustomerCard.css";
import AlertBox from "../../../components/AlertBox/AlertBox";
import axios from "axios";
import { IoSearchSharp } from "react-icons/io5";

const ProductDetailsCard = ({ product, onClose }) => {
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [popup, setPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertMessage, setAlertMessage] = useState("");


  const handleToggleDetails = () => {
    setShowUpdateProduct(!showUpdateProduct);
  };

  const deleteProduct = () => {
    try {
      axios
        .delete(`http://localhost:4001/api/products/${product._id}`)
        .then((res) => {
          console.log(res.data);
          setAlertMessage("Product deleted succefully");
          setAlertType("success");
          setShowAlert(true);
        });
      setPopup(false);
    } catch {
      (error) => console.log(error);
      setAlertMessage("Failed to delete product");
      setAlertType("error");
      setShowAlert(true);
      setPopup(false);
    }
  };

  return (
    <>
      <div className="customer-details-card">
        <div className="card-header">
          <h2>Product Details</h2>
          <button className="close-btn" onClick={onClose}>
            &#x2715;
          </button>
        </div>
        <div className="card-content">
          {Object.entries(product).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
          <button onClick={handleToggleDetails} className="submit-button">
            Update Product Details
          </button>
          <button onClick={() => setPopup(true)} className="submit-button">
            Delete This Product
          </button>
        </div>
        {popup && (
          <div id="confirmPopup">
            <p>Click "Confirm" to delete this product</p>
            <button className="confirm" onClick={deleteProduct}>
              Confirm
            </button>
            <button className="cancel" onClick={() => setPopup(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
      {showUpdateProduct && <UpdateForm onClose={onClose} product={product} />}
      {showAlert && (
        <AlertBox
          message={alertMessage}
          type={alertType}
          onClose={() => {
            setShowAlert(false);
          }}
        />
      )}
    </>
  );
};

const UpdateForm = ({ onClose, product }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState("");
  const [expense, setExpense] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setProductName(product.productName);
    setProductDescription(product.description);
    setPrice(product.price);
    setExpense(product.expense);
  }, [product]);

  const update = () => {
    const formData = {
      id: product._id,
      productName: productName,
      description: productDescription,
      stock: parseInt(stock, 10) + parseInt(product.stock, 10),
      price: price,
      expense: expense,
    };

    console.log(formData);
    axios
      .patch("http://localhost:4001/api/products/", formData)
      .then((res) => {
        console.log(res.data);

        // Clear form fields and files after successful request
        setProductName("");
        setProductDescription("");
        setStock("");
        setPrice("");
        setExpense("");

        // Display success alert
        setAlertMessage("Updated product details succefully");
        setAlertType("success");
        setShowAlert(true);
      })
      .catch((err) => {
        // Handle error
        setAlertMessage("Failed to update status");
        setAlertType("error");
        setShowAlert(true);
        console.error(err);
      });
  };

  return (
    <div className="customer-details-card">
      <div className="product-updateform-header">
        <h3 className="updateform-h3">Update Product Details</h3>
        <button className="update-close-btn" onClick={onClose}>
          &#x2715;
        </button>
      </div>
      <form className="product-form">
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="productDescription">Product Description:</label>
          <textarea
            id="productDescription"
            className="form-control"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense">Manufacturing Price:</label>
          <input
            type="number"
            id="expense"
            className="form-control"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Add To Stock:</label>
          <input
            type="number"
            id="stock"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <button type="button" onClick={update} className="submit-button">
          Update Product
        </button>
      </form>
      {showAlert && (
        <AlertBox
          message={alertMessage}
          type={alertType}
          onClose={() => {
            setShowAlert(false);
          }}
        />
      )}
    </div>
  );
};

const ProuctsTable = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState(""); // Default: No sorting
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // When products change, update filteredProducts
    setFilteredProducts(products);
  }, [products]);

  const handleChange = (e) => {
    const searchQuery = e.target.value.replace(/\s/g, "").toLowerCase();
    setQuery(searchQuery);

    // Filter products based on productName, category, and sort option
    const filtered = products.filter(
      (product) =>
        product.productName
          .replace(/\s/g, "")
          .toLowerCase()
          .includes(searchQuery) &&
        (selectedCategory === "All" || product.category === selectedCategory)
    );

    applySorting(filtered);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    // Filter products based on productName, category, and sort option
    const filtered = products.filter(
      (product) =>
        product.productName.replace(/\s/g, "").toLowerCase().includes(query) &&
        (category === "All" || product.category === category)
    );

    applySorting(filtered);
  };

  const applySorting = (filtered) => {
    // Sort products based on the selected sort option
    let sortedProducts = [...filtered];
    switch (sortOption) {
      case "priceHighToLow":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "priceLowToHigh":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "expenseHighToLow":
        sortedProducts.sort((a, b) => b.expense - a.expense);
        break;
      case "expenseLowToHigh":
        sortedProducts.sort((a, b) => a.expense - b.expense);
        break;
      case "stockHighToLow":
        sortedProducts.sort((a, b) => b.stock - a.stock);
        break;
      case "stockLowToHigh":
        sortedProducts.sort((a, b) => a.stock - b.stock);
        break;
      default:
        break;
    }

    setFilteredProducts(sortedProducts);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    applySorting(filteredProducts);
  };

  const handleSearch = () => {
    // Add your search logic here if needed
    console.log("Searching for:", query);
  };

  const handleViewDetails = (_id) => {
    const product = products.find((product) => product._id === _id);
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const categories = ["All", "Men", "Women", "Kids"];
  const sortOptions = [
    { value: "", label: "No Sorting" },
    { value: "priceHighToLow", label: "Price (High to Low)" },
    { value: "priceLowToHigh", label: "Price (Low to High)" },
    { value: "expenseHighToLow", label: "Expense (High to Low)" },
    { value: "expenseLowToHigh", label: "Expense (Low to High)" },
    { value: "stockHighToLow", label: "Stock (High to Low)" },
    { value: "stockLowToHigh", label: "Stock (Low to High)" },
  ];

  return (
    <>
      <div className="item7 subcontainer2" id="product-table-section">
        <div className="topbar topbar-column">
          <div className="search">
            <button onClick={handleSearch}>
              <IoSearchSharp className="search_icon" />
            </button>
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={handleChange}
            />
          </div>
          <div className="filter-sort-container width-full-products">
            <div className="category-dropdown align-flex-end-products">
              <label htmlFor="product-category" className="filter-sort-label">
                Filter by Category:
              </label>
              <select
                id="product-category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="filter-sort-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="sort-dropdown">
              <label htmlFor="product-sort" className="filter-sort-label">
                Sort By:
              </label>
              <select
                id="product-sort"
                value={sortOption}
                onChange={handleSortChange}
                className="filter-sort-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th className="hide_col2">Manufaturing Price</th>
              <th className="hide_col2">Selling Price</th>
              <th className="hide_col2">Stock</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={`../${product.images[0]}`}
                    alt={product.productName}
                    className="product-image"
                  />
                </td>
                <td>{product.productName}</td>
                <td className="hide_col2">${product.expense}</td>
                <td className="hide_col2">{product.price}</td>
                <td className="hide_col2">{product.stock}</td>
                <td>
                  <button
                    className="actionbtn"
                    onClick={() => handleViewDetails(product._id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProduct && (
        <ProductDetailsCard
          product={selectedProduct}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
};

export default ProuctsTable;
