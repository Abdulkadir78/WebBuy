import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { ImCross } from "react-icons/im";
import { MdDone } from "react-icons/md";

import { OrderContext } from "../../contexts/Order";
import PageLoader from "../Miscellaneous/PageLoader";
import Error from "../Miscellaneous/Error";
import convertDateString from "../../helpers/convertDateString";

function MyOrders() {
  const { getMyOrders } = useContext(OrderContext);

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyOrders = async () => {
      const response = await getMyOrders();
      if (response.error) {
        setError(response.error);
        return setLoading(false);
      }
      setOrders(response.orders);
      setLoading(false);
    };

    fetchMyOrders();
  }, [getMyOrders, setError, setLoading, setOrders]);

  return loading ? (
    <PageLoader />
  ) : (
    <>
      {error && <Error error={error} />}
      <Row className="mt-4 justify-content-center">
        <Col md={5} xs={3}></Col>
        {!orders.length ? (
          <Col md={7} xs={8}>
            <h4 className="text-muted mt-13">No orders</h4>
          </Col>
        ) : (
          <Col lg={10}>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <Link to={`/order/${order._id}`} className="text-dark">
                        {order._id}{" "}
                      </Link>
                    </td>
                    <td>{convertDateString(order.createdAt)}</td>
                    <td>₹{order.total.toLocaleString()}</td>
                    <td>
                      {order.isPaid ? (
                        <MdDone className="text-success" size={23} />
                      ) : (
                        <ImCross className="text-danger" size={13} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <MdDone className="text-success" size={23} />
                      ) : (
                        <ImCross className="text-danger" size={13} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        )}
      </Row>
    </>
  );
}

export default MyOrders;
