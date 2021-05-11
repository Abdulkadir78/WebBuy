import { createContext, useContext } from "react";
import axios from "axios";

import { AuthContext } from "./Auth";
import convertErrorArray from "../helpers/convertErrorArray";

const OrderContext = createContext();

function OrderProvider({ children }) {
  const { user } = useContext(AuthContext);

  const getMyOrders = async () => {
    try {
      const response = await axios.get("/api/orders/myOrders", {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const getOrderById = async (id) => {
    try {
      const response = await axios.get(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const getAllOrders = async () => {
    try {
      const response = await axios.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const getSellersOrders = async (id) => {
    try {
      const response = await axios.get(`/api/orders/sellerOrders/${id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const addOrder = async (order) => {
    try {
      const response = await axios.post("/api/orders", order, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      localStorage.removeItem("cart");
      localStorage.removeItem("paymentMethod");
      return response.data;
    } catch (err) {
      return convertErrorArray(err.response.data);
    }
  };

  const markOrderDelivered = async (id) => {
    try {
      const response = await axios.patch(`/api/orders/${id}/deliver`, null, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const payForOrder = async (order) => {
    try {
      const response = await axios.post(
        `/api/orders/checkoutSession/${order._id}`,
        order,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const values = {
    getMyOrders,
    getOrderById,
    getAllOrders,
    getSellersOrders,
    addOrder,
    markOrderDelivered,
    payForOrder,
  };

  return (
    <OrderContext.Provider value={values}>{children}</OrderContext.Provider>
  );
}

export { OrderContext };
export default OrderProvider;
