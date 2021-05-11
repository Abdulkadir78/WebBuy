import { useState } from "react";

import Products from "./Products";
import Orders from "./Orders";

function Seller({ sellerId }) {
  const [component, setComponent] = useState(<Products sellerId={sellerId} />);

  const handleChange = async (e) => {
    switch (e.target.value) {
      case "products":
        setComponent(<Products sellerId={sellerId} />);
        break;
      case "orders":
        setComponent(<Orders sellerId={sellerId} />);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div className="clearfix">
        <select className="float-right mt-4" onChange={handleChange}>
          <option>products</option>
          <option>orders</option>
        </select>
      </div>

      {component}
    </>
  );
}

export default Seller;
