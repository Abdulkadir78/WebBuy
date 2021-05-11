import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import { OrderContext } from "../../../contexts/Order";
import PageLoader from "../../Miscellaneous/PageLoader";
import DismissableError from "../../Miscellaneous/DismissableError";
import DismissableSuccess from "../../Miscellaneous/DismissableSuccess";
import Error from "../../Miscellaneous/Error";
import convertDateString from "../../../helpers/convertDateString";

function Orders() {
  const { getAllOrders, markOrderDelivered } = useContext(OrderContext);

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getAllOrders();
      if (response.error) {
        setError(response.error);
        return setLoading(false);
      }
      setOrders(response.orders);
      setLoading(false);
    };

    fetchOrders();
  }, [getAllOrders, refresh, setLoading, setOrders, setError]);

  const handleMarkDelivered = async (orderId) => {
    setUpdateError("");
    setSuccessMsg("");

    const response = await markOrderDelivered(orderId);
    if (response.error) {
      return setUpdateError(response.error);
    }
    setSuccessMsg(`Order ${orderId} has been marked as delivered`);
    setRefresh((prevValue) => !prevValue);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return !orders.length ? (
    <h4 className="text-secondary text-center mt-13">No orders</h4>
  ) : (
    <>
      <h2>Orders</h2>
      {updateError && <DismissableError error={updateError} />}
      {successMsg && <DismissableSuccess message={successMsg} />}

      <Table bordered hover responsive className="mt-2">
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Payment mode</th>
            <th>Paid on</th>
            <th>Delivered on</th>
            <th>Actions</th>
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

              <td>
                {order.isDelivered ? (
                  <span className="text-muted">Delivered</span>
                ) : (
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => handleMarkDelivered(order._id)}
                  >
                    Mark delivered
                  </Button>
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
