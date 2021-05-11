import { useState } from "react";

import Users from "./Users";
import Products from "./Products";
import Orders from "./Orders";

function Admin() {
  const [component, setComponent] = useState(<Users />);

  const handleChange = async (e) => {
    switch (e.target.value) {
      case "users":
        setComponent(<Users />);
        break;
      case "products":
        setComponent(<Products />);
        break;
      case "orders":
        setComponent(<Orders />);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="clearfix">
        <select className="float-right mt-4" onChange={handleChange}>
          <option>users</option>
          <option>products</option>
          <option>orders</option>
        </select>
      </div>

      {component}
    </>
  );
}

export default Admin;
