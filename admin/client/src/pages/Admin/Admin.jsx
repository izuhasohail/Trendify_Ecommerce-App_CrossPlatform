import React, { useState, useEffect } from "react";
import "./Admin.css";
import logo from "../../imgs/logo.png";
import { FaChartBar } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { IoPeopleSharp } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
import ProductForm from "./ProductForm/ProductForm";
import Statistics from "./Statistics/Statistics";
import Charts from "./Charts/Charts";
import PopularProducts from "./PopularProducts/PopularProducts";
import ProuctsTable from "./Tables/ProductsTable";
import OrdersTable from "./Tables/OrdersTable";
import CustomersTable from "./Tables/CustomersTable";
import axios from "axios";

// Tabs Data

const tabs = [
  {
    logo: <FaChartBar className="tab_logo" />,
    name: "Statistics",
    href: "#stat-section",
  },

  {
    logo: <GiClothes className="tab_logo" />,
    name: "Products",
    href: "#product-table-section",
  },
  {
    logo: <FaTruck className="tab_logo" />,
    name: "Orders",
    href: "#order-table-section",
  },
  {
    logo: <IoPeopleSharp className="tab_logo" />,
    name: "Customers",
    href: "#customer-table-section",
  },
  {
    logo: <FiPlusCircle className="tab_logo" />,
    name: "Add New Product",
    href: "#new-section",
  },
];

const Tab = ({ logo, name, href }) => {
  return (
    <div className="tab ds">
      <a href={href} className="tab-link">
        {logo}
        {name}
      </a>
    </div>
  );
};

const Admin = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [yearlyExpense, setYearlyExpense] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [yearlyCategoryRevenue, setYearlyCategoryRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const getYearlyData = async () => {
      try {
        const currentDate = new Date();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        if (month == 1) {
          month = 12;
          year--;
        }

        // Fetch customers
        const totalSales = await axios.get(
          "http://localhost:4001/api/admin/totalSales12Months"
        );
        setTotalSales(totalSales.data);

        // Fetch customers
        const customersData = await axios.get(
          "http://localhost:4001/api/admin/getAllCustomers"
        );
        setCustomers(customersData.data);

        // Fetch orders
        const ordersData = await axios.get(
          "http://localhost:4001/api/admin/getAllOrders"
        );
        setOrders(ordersData.data);

        // Fetch products
        const productsData = await axios.get(
          "http://localhost:4001/api/products/"
        );
        setProducts(productsData.data);

        const terndingProductsData = await axios.get(
          "http://localhost:4001/api/admin/trendingProducts"
        );
        setTrendingProducts(terndingProductsData.data);

        const response = await axios.get(
          `http://localhost:4001/api/admin/getYearlyExpense/${month}/${year}`
        );
        setYearlyExpense(response.data);

        const response2 = await axios.get(
          `http://localhost:4001/api/admin/getYearlyRevenue/${month}/${year}`
        );
        setYearlyRevenue(response2.data);

        // Use async/await for the third request and resolve the promise before setting state
        const response3 = await axios.get(
          `http://localhost:4001/api/admin/getTotalRevenueByCategory/${month}/${year}`
        );
        setYearlyCategoryRevenue((prevData) => [
          ...prevData,
          ...response3.data,
        ]);

        yearlyExpense.forEach((expense) =>
          setTotalExpense((prevTotalExpense) => prevTotalExpense + expense)
        );

        yearlyRevenue.forEach((revenue) =>
          setTotalRevenue((prevTotalRevenue) => prevTotalRevenue + revenue)
        );
        // Process the response data as needed
        // console.log("Yearly Expense Data:", response.data);
        // console.log("Yearly Expense Data UseState:", yearlyExpense);
        // console.log("Yearly Revenue Data:", response2.data);
        // console.log("Yearly Revenue Data UseState:", yearlyRevenue);
        // console.log("Yearly Category Revenue Data:", response3.data);
        // console.log("YEARLY CATEGORY ", yearlyCategoryRevenue);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    getYearlyData();
    console.log(totalRevenue);
    console.log(totalExpense);
  }, []);

  useEffect(() => {
    setTotalExpense(
      yearlyExpense.reduce((total, expense) => total + expense, 0)
    );
    console.log("YEARLY REVENUE", yearlyExpense);
  }, [yearlyExpense]);

  useEffect(() => {
    setTotalRevenue(
      yearlyRevenue.reduce((total, revenue) => total + revenue, 0)
    );
    console.log("YEARLY REVENUE", yearlyRevenue);
  }, [yearlyRevenue]);
  // useEffect(() => {
  //   console.log("Total Revenue:", totalRevenue);
  //   console.log("Total Expense:", totalExpense);
  // }, [totalRevenue, totalExpense]);
  // useEffect(() => {
  //   console.log("Customers UseState", customers);
  //   const getReveiws = async () => {
  //     try {
  //       const targetObject = customers.find((obj) => obj.name === "hanzala");
  //       const response2 = await axios.get(
  //         `http://localhost:4001/api/products/productsWithoutReviews/${targetObject._id}`
  //       );
  //     } catch {
  //       (error) => console.log(error);
  //     }
  //   };
  //   getReveiws();
  // }, [customers]);
  // useEffect(() => {
  //   console.log("Customers UseState", orders);
  // }, [orders]);
  // useEffect(() => {
  //   console.log("Customers UseState", products);
  // }, [products]);
  // useEffect(() => {
  //   console.log("Total Sales UseState", totalSales);
  // }, [totalSales]);
  // useEffect(() => {
  //   console.log("Customers UseState 2", yearlyCategoryRevenue);
  // }, [yearlyCategoryRevenue]);
  // useEffect(() => {
  //   console.log("YearlyExpense UseState", yearlyExpense);

  // }, [yearlyExpense]);
  // useEffect(() => {

  //   console.log("Yearly UseState", yearlyRevenue);
  // }, [yearlyRevenue]);

  return (
    <>
      <div className="bgcol">
        {/* <TopBar /> */}
        <aside>
          <div id="logo">
            <img src={logo} alt="logo" id="logo_img" />
            LOGO
          </div>

          <div id="tabs" className="ds">
            {tabs.map((tab) => (
              <Tab logo={tab.logo} name={tab.name} href={tab.href} />
            ))}
          </div>
        </aside>
        <div className="admin-container">
          <Statistics
            totalSales={totalSales}
            totalCustomers={customers.length}
            totalProducts={products.length}
            totalProfit={totalRevenue - totalExpense}
          />
          <Charts
            doughnutData={yearlyCategoryRevenue}
            lineDataExpense={yearlyExpense}
            lineDataRevenue={yearlyRevenue}
            totalRevenue={totalRevenue}
            totalExpense={totalExpense}
          />
          <PopularProducts popularProducts={trendingProducts} />
          <ProuctsTable products={products} />
          <OrdersTable orderss={orders} />
          <CustomersTable customers={customers} />
          <ProductForm />
          <div className="empty-space"></div>
        </div>
      </div>
    </>
  );
};

export default Admin;
