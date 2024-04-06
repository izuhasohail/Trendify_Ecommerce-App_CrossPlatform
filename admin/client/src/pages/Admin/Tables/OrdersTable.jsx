import React, { useEffect, useState } from "react";
import "./CustomerCard.css";
import axios from "axios";
import AlertBox from "../../../components/AlertBox/AlertBox";
import { IoSearchSharp } from "react-icons/io5";

const OrderDetailsCard = ({ order, onClose, updateOrderStatus }) => {
  const handleStatusChange = async () => {
    // Update the status based on the current status
    let updatedStatus = order.status;
    if (order.status === "Pending") {
      updatedStatus = "Shipped";
    } else if (order.status === "Shipped") {
      updatedStatus = "Delivered";
    }

    // Call the parent function to update the status in the parent state
    updateOrderStatus(order._id, updatedStatus);

    // Perform the logic to update the order status in the database/API
    // This is where you would make a request to your server to update the order status
    console.log(`Order status changed to: ${updatedStatus}`);
  };

  return (
    <div className="customer-details-card">
      <div className="card-header">
        <h2>Order Details</h2>
        <button className="close-btn" onClick={onClose}>
          &#x2715;
        </button>
      </div>
      <div className="card-content">
        {Object.entries(order).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {value}
          </p>
        ))}
        <button onClick={handleStatusChange} className="status-change-btn">
          Change Order Status to{" "}
          {order.status === "Pending"
            ? "Shipped"
            : order.status === "Shipped"
            ? "Delivered"
            : "Already Delivered"}
        </button>
      </div>
    </div>
  );
};

const OrdersTable = ({ orderss }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All"); // Default to showing all orders
  const [selectedSortOption, setSelectedSortOption] = useState("orderDateASC"); // Default to sorting by orderDate in ascending order

  useEffect(() => {
    setOrders(orderss);
  }, [orderss]);

  const handleViewDetails = (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Function to update the order status in the parent state
  const updateOrderStatus = async (orderId, newStatus) => {
    // console.log(orderId)
    if (newStatus == "Shipped" || newStatus == "Delivered") {
      const newOrderItem = {
        id: orderId,
        status: newStatus,
      };
      try {
        axios
          .patch(`http://localhost:4001/api/orders/statusUpdate`, newOrderItem)
          .then((res) => {
            console.log(res.data);

            const updatedOrders = orders.map((order) =>
              order._id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            
            setShowAlert(true);
            setAlertMessage("Order status updated successfully");
            setAlertType("success");
          });
      } catch {
        (error) => {
          console.log(error);
          setShowAlert(true);
          setAlertMessage("Failed to update status");
          setAlertType("error");
        };
      }
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleSortChange = (e) => {
    const selectedSortBy = e.target.value;
    setSelectedSortOption(selectedSortBy);
  };

  const filteredAndSortedOrders = orders
    .filter(
      (order) => selectedStatus === "All" || order.status === selectedStatus
    )
    .sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);

      if (selectedSortOption === "orderDateASC") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  return (
    <>
      <div className="item8 subcontainer2" id="order-table-section">
        <div className="topbar">
          <div className="filter-sort-container width-full">
            <div className="category-dropdown align-flex-end">
              <label htmlFor="order-category" className="filter-sort-label">
                Filter by Category:
              </label>
              <select
                id="order-category"
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="filter-sort-select"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="sort-dropdown">
              <label htmlFor="order-sort" className="filter-sort-label">
                Sort By:
              </label>
              <select
                id="order-sort"
                value={selectedSortOption}
                onChange={handleSortChange}
                className="filter-sort-select"
              >
                <option value="orderDateASC">Order Date (ASC)</option>
                <option value="orderDateDESC">Order Date (DESC)</option>
              </select>
            </div>
          </div>
        </div>
        <table className="admin-table">
          <thead className="admin-table-head">
            <tr>
              {/* <th>Order ID</th> */}
              <th className="hide_col2">Items</th>
              <th>Customer Name</th>
              <th className="hide_col">Order Date</th>
              <th className="hide_col2">Shipping Address</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th className="hide_col">Payment Method</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders.map((order) => (
              <tr key={order._id}>
                {/* <td>{order._id}</td> */}
                <td className="hide_col2">{order.products.join(", ")}</td>
                <td>{order.customerName}</td>
                <td className="hide_col">{order.orderDate}</td>
                <td className="hide_col2">{order.deliveryAddress}</td>
                <td>${order.total}</td>
                <td>{order.status}</td>
                <td className="hide_col">{order.paymentMethod}</td>
                <td>
                  <button
                    className="actionbtn"
                    onClick={() => handleViewDetails(order._id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAlert && (
        <AlertBox
          message={alertMessage}
          type={alertType}
          onClose={() => {
            setShowAlert(false);
          }}
        />
      )}
      {selectedOrder && (
        <OrderDetailsCard
          order={selectedOrder}
          onClose={handleCloseDetails}
          updateOrderStatus={updateOrderStatus}
        />
      )}
    </>
  );
};

export default OrdersTable;
