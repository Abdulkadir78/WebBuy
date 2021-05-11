import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";

import { OrderContext } from "../../../contexts/Order";
import PageLoader from "../../Miscellaneous/PageLoader";
import Error from "../../Miscellaneous/Error";
import convertDateString from "../../../helpers/convertDateString";

function Orders({ sellerId }) {
  const { getSellersOrders } = useContext(OrderContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getSellersOrders(sellerId);
      if (response.error) {
        setError(response.error);
        return setLoading(false);
      }
      setOrders(response.orders);
      setLoading(false);
    };

    fetchOrders();
  }, [getSellersOrders, sellerId, setOrders, setLoading, setError]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return !orders.length ? (
    <h5 className="text-secondary text-center mt-13">
      You have not received any orders yet
    </h5>
  ) : (
    <>
      <h2>Your orders</h2>

      <Table bordered hover responsive className="mt-2">
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Payment mode</th>
            <th>Paid on</th>
            <th>Delivered on</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <Link to={`/order/${order._id}`} className="text-dark">
                  {order._id}
                </Link>
              </td>

              <td>{convertDateString(order.createdAt)}</td>
              <td>{order.paymentMethod}</td>
              <td>
                {order.isPaid ? (
                  <span className="text-success">
                    {convertDateString(order.paidAt)}
                  </span>
                ) : (
                  <span className="text-danger">Not paid</span>
                )}
              </td>

              <td>
                {order.isDelivered ? (
                  <span className="text-success">
                    {convertDateString(order.deliveredAt)}
                  </span>
                ) : (
                  <span className="text-danger">Not delivered</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Orders;
