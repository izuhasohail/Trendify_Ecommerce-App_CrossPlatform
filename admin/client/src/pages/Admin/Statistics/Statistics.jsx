import React, { useEffect, useState } from "react";
import "./Statistics.css";
import { FaChartBar } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { IoCart } from "react-icons/io5";
import { AiFillDollarCircle } from "react-icons/ai";
import avatar from "../../../imgs/card-advance-sale.png";
import axios from "axios";

const Statistics = (props) => {
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  useEffect(() => {
    const getExpenseDataForMonth = async () => {
      try {
        // Specify the month and year as needed
        const month = 1;
        const year = 2023;

        // Make Axios request to the server API endpoint
        const response = await axios.get(
          `http://localhost:4001/api/admin/getMonthlyExpense/${month}/${year}`
        );

        const response2 = await axios.get(
          `http://localhost:4001/api/admin/getMonthlyRevenue/${month}/${year}`
        );

        setMonthlyExpense(response.data);
        setMonthlyRevenue(response2.data);

        // Process the response data as needed
        // console.log("Expense Data:", response.data);
        // console.log("Revenue Data:", response2.data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    getExpenseDataForMonth();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  return (
    <>
      <div className="item2 subcontainer" id="stat-section">
        <p>Statistics</p>
        <div id="item2_stats">
          <div>
            <div className="stats_logo llg1">
              <FaChartBar className="stats__logo lg1" />
            </div>
            <div>
              <p>{props.totalSales}</p>
              <p>Sales</p>
            </div>
          </div>

          <div>
            <div className="stats_logo llg2">
              <IoPeopleSharp className="stats__logo lg2" />
            </div>
            <div>
              <p>{props.totalCustomers}</p>
              <p>Customers</p>
            </div>
          </div>

          <div>
            <div className="stats_logo llg3">
              <IoCart className="stats__logo lg3" />
            </div>
            <div>
              <p>{props.totalProducts}</p>
              <p>Products</p>
            </div>
          </div>

          <div>
            <div className="stats_logo llg4">
              <AiFillDollarCircle className="stats__logo lg4" />
            </div>
            <div>
              <p>${props.totalProfit.toFixed(0)}</p>
              <p>Profit</p>
            </div>
          </div>
        </div>
      </div>

      <div className="item1 subcontainer">
        <div className="item1_text">
          <p>Congratulations! 🎉</p>
          <p>Your monthly sales profit is</p>
          <p>${(monthlyRevenue-monthlyExpense).toFixed(0)}</p>
          <p>Keept it up</p>
        </div>
        <img src={avatar} alt="avatar" id="avatar_img" />
      </div>
    </>
  );
};

export default Statistics;
