import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import { OrderContext } from "../../contexts/Order";
import { AuthContext } from "../../contexts/Auth";
import { calculateTotal, calculateTotalItems } from "../../helpers/calculate";
import convertDateString from "../../helpers/convertDateString";
import Navigation from "../Home/Navigation";
import PageLoader from "../Miscellaneous/PageLoader";
import Error from "../Miscellaneous/Error";
import DismissableError from "../Miscellaneous/DismissableError";

function OrderById({ match: { params } }) {
  const { userId } = useContext(AuthContext);
  const { getOrderById, payForOrder } = useContext(OrderContext);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [payError, setPayError] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getOrderById(params.orderId);
      if (response.error) {
        setError(response.error);
        return setLoading(false);
      }
      setOrder(response.order);
      response.order.paymentMethod === "card" &&
        !response.order.isPaid &&
        setShowPopover(true);
      setLoading(false);
    };

    // this setTimeOut is used for when user gets redirected from checkout
    // otherwise the order will still show unpaid after getting redirected
    setTimeout(() => {
      fetchOrder();
    }, 1000);
  }, [params.orderId, getOrderById, setError, setLoading, setOrder, userId]);

  const handlePay = async (order) => {
    setPayError("");
    setPayLoading(true);
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    const stripe = await stripePromise;
    const response = await payForOrder(order);
    if (response.error) {
      setPayError(response.error);
      return setPayLoading(false);
    }

    setPayLoading(false);
    const result = await stripe.redirectToCheckout({
      sessionId: response.id,
    });

    if (result.error) {
      return setPayError(result.error.message);
    }
  };

  return (
    <>
      <Navigation />

      {loading ? (
        <PageLoader />
      ) : (
        <Container className="mt-5 mb-4">
          {error && <Error error={error} />}
          {payError && <DismissableError error={payError} />}

          {order && (
            <Row className="mb-4 text-break">
              <Col xs={12} className="mb-2">
                <h2>Order {order._id}</h2>
                <hr />
              </Col>

              <Col md={8}>
                <div>
                  <h2 className="mb-3">Shipping</h2>
                  <div>
                    <h6 className="text-muted">Address</h6>
                    <h6>{order.shippingAddress.address},</h6>
                    <h6>
                      {order.shippingAddress.city} -{" "}
                      {order.shippingAddress.postalCode},
                    </h6>
                    <h6>{order.shippingAddress.country}.</h6>

                    {order.isDelivered ? (
                      <Alert variant="success" className="my-3">
                        Delivered on {convertDateString(order.deliveredAt)}
                      </Alert>
                    ) : (
                      <Alert variant="info" className="my-3">
                        Not delivered
                      </Alert>
                    )}
                  </div>
                </div>
                <hr />

                <div>
                  <h2 className="mb-3">Payment</h2>
                  <h6>
                    <span className="text-muted">Method - </span>
                    {order.paymentMethod}

                    {order.isPaid ? (
                      <Alert variant="success" className="my-3">
                        Paid on {convertDateString(order.paidAt)}
                      </Alert>
                    ) : (
                      <Alert variant="info" className="my-3">
                        Not paid
                      </Alert>
                    )}
                  </h6>
                </div>
                <hr />

                <div>
                  <h2 className="mb-3">Order items</h2>
                  {order.orderItems.map((product) => (
                    <div key={product._id} className="my-4 text-break clearfix">
                      <Image
                        src={product.image}
                        width="40px"
                        height="40px"
                        alt="product-img"
                      />

                      <Link
                        to={`/product/${product.productId}`}
                        className="ml-4 text-dark"
                      >
                        {product.name}
                      </Link>

                      <h6 className="float-right mt-2 clearfix">
                        {product.quantity} x ₹{product.price} = ₹
                        {product.quantity * product.price}
                      </h6>
                    </div>
                  ))}
                </div>
              </Col>

              <Col md={4}>
                <Card>
                  <h3 className="p-3">Order summary</h3>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      Items - {calculateTotalItems(order.orderItems)}
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Total - ₹
                      {calculateTotal(order.orderItems).toLocaleString()}
                    </ListGroup.Item>

                    {order.paymentMethod === "card" &&
                      !order.isPaid &&
                      order.buyer === userId && (
                        <ListGroup.Item>
                          <Button
                            variant="dark"
                            className="form-control no-shadow-btn"
                            disabled={payLoading}
                            onClick={() => handlePay(order)}
                          >
                            {!payLoading ? (
                              "Pay"
                            ) : (
                              <Spinner animation="border" size="sm" />
                            )}
                          </Button>
                        </ListGroup.Item>
                      )}
                  </ListGroup>
                </Card>

                <div className="text-center my-3">
                  {order.paymentMethod === "card" &&
                    !order.isPaid &&
                    order.buyer === userId && (
                      <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        show={showPopover}
                        overlay={
                          <Popover>
                            <Popover.Title className="h3 text-center">
                              Dummy card details
                            </Popover.Title>
                            <Popover.Content>
                              <strong>Card number</strong>: 4242 4242 4242 4242
                              <br />
                              <strong>Expiration date</strong>: Any future date
                              <br />
                              <strong>CVC</strong>: Any 3 digit number
                            </Popover.Content>
                          </Popover>
                        }
                      >
                        <Button
                          variant="info"
                          className="no-shadow-btn"
                          onClick={() =>
                            setShowPopover((prevValue) => !prevValue)
                          }
                        >
                          {showPopover ? "Hide " : "Show "}
                          card
                        </Button>
                      </OverlayTrigger>
                    )}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      )}
    </>
  );
}

export default OrderById;
