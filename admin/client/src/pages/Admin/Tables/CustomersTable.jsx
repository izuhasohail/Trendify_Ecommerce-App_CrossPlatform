import React, { useEffect, useState } from "react";
import "./CustomerCard.css";
import { IoSearchSharp } from "react-icons/io5";

const CustomerDetailsCard = ({ customer, onClose }) => {
  return (
    <div className="customer-details-card">
      <div className="card-header">
        <h2>Customer Details</h2>
        <button className="close-btn" onClick={onClose}>
          &#x2715;
        </button>
      </div>
      <div className="card-content">
        {Object.entries(customer).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {value}
          </p>
        ))}
      </div>
    </div>
  );
};

const CustomersTable = ({ customers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [query, setQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  const handleChange = (e) => {
    const searchQuery = e.target.value.replace(/\s/g, "").toLowerCase();
    setQuery(searchQuery);

    // Filter customers based on name
    const filteredCustomers = customers.filter((customer) =>
      customer.name.replace(/\s/g, "").toLowerCase().includes(searchQuery)
    );

    setFilteredCustomers(filteredCustomers);
  };
  const handleSearch = () => {
    const trimmedQuery = query.trim().toLowerCase();

    const filteredCustomers = trimmedQuery
      ? customers.filter((customer) =>
          customer.name.toLowerCase().includes(trimmedQuery)
        )
      : customers;

    console.log("Searching for:", trimmedQuery);
    setFilteredCustomers(filteredCustomers);
  };
  const handleViewDetails = (customerId) => {
    const customer = customers.find((customer) => customer._id === customerId);
    setSelectedCustomer(customer);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  return (
    <>
      <div className="item9 subcontainer2" id="customer-table-section">
        <div className="topbar">
          <div className=" search customer-search">
            <button onClick={handleSearch}>
              <IoSearchSharp className="search_icon" />
            </button>
            <input
              type="text"
              placeholder="Search by Name"
              value={query}
              onChange={handleChange}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hide_col2">Email</th>
              <th className="hide_col2">Phone Number</th>
              <th className="hide_col">Address</th>
              <th className="hide_col">Total Orders</th>
              <th className="hide_col">Total Spend</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td className="hide_col2">{customer.email}</td>
                <td className="hide_col2">{customer.phone}</td>
                <td className="hide_col">{customer.address}</td>
                <td className="hide_col">{customer.numOrders}</td>
                <td className="hide_col">${customer.totalSpent}</td>
                <td>
                  <button
                    className="actionbtn"
                    onClick={() => handleViewDetails(customer._id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedCustomer && (
        <CustomerDetailsCard
          customer={selectedCustomer}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
};

export default CustomersTable;
