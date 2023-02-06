import React from "react";
import { Routes, Route } from "react-router-dom";

// import Categories from "./Categories";
// import Category from "./Category";
import Users from "../Routes/Users";
import Orders from "../Routes/Orders";
// import Deliveries from "./Deliveries";
import OrdersStatus from "../Routes/OrdersStatus";
import Area from "../Routes/Area";
// import CashDelivery from "./CashDelivery";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard_c">
        <Routes>
          {/* <Route path="categories" element={<Categories />} /> */}
          {/* <Route path="categories/:uid" element={<Category />} /> */}
          <Route path="users" element={<Users />} />
          <Route path="ordars" element={<Orders />} />
          <Route path="area" element={<Area />} />
          {/* <Route path="deliveries" element={<Deliveries />} /> */}
          {<Route path="ordersStatus" element={<OrdersStatus />} />}
          {/* <Route path="cash" element={<CashDelivery />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
