import { useState, useContext } from "react";
import { Redirect, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { OrderContext } from "../../contexts/Order";
import { calculateTotal, calculateTotalItems } from "../../helpers/calculate";
import { PURCHASE_LIMIT } from "../constants";
import CheckoutNav from "./CheckoutNav";
import Error from "../Miscellaneous/Error";

function ConfirmOrder({ history }) {
  const { addOrder } = useContext(OrderContext);

  const [cart] = useState(JSON.parse(localStorage.getItem("cart")));
  const [shipping] = useState(JSON.parse(localStorage.getItem("shipping")));
  const [paymentMethod] = useState(localStorage.getItem("paymentMethod"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    setLoading(true);
    const order = {
      paymentMethod,
      shippingAddress: shipping,
      orderItems: cart,
    };

    const response = await addOrder(order);
    if (response.error) {
      setError(response.error);
      return setLoading(false);
    }

    setLoading(false);
    history.push(`/order/${response.order._id}`);
  };

  if (!cart || !cart.length || calculateTotal(cart) > PURCHASE_LIMIT) {
    return <Redirect to="/cart" />;
  }

  return !shipping || !paymentMethod ? (
    <Redirect to="/payment" />
  ) : (
    <>
      <CheckoutNav />
      <Container className="my-4">
        <Row>
          <Col md={8}>
            {error && <Error error={error} />}

            <div>
              <h2 className="mb-3">Shipping</h2>
              <div>
                <h6 className="text-muted">Address</h6>
                <h6>{shipping.address},</h6>
                <h6>
                  {shipping.city} - {shipping.postalCode},
                </h6>
                <h6>{shipping.country}.</h6>
              </div>
            </div>
            <hr />

            <div>
              <h2 className="mb-3">Payment</h2>
              <h6>
                <span className="text-muted">Method - </span>
                {paymentMethod}
              </h6>
            </div>
            <hr />

            <div>
              <h2 className="mb-3">Order items</h2>
              {cart.map((product) => (
                <div
                  key={product.productId}
                  className="my-4 text-break clearfix"
                >
                  <Image src={product.image} width="40px" height="40px" />
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
                  Items - {calculateTotalItems(cart)}
                </ListGroup.Item>

                <ListGroup.Item>
                  Total - ₹{calculateTotal(cart).toLocaleString()}
                </ListGroup.Item>

                <ListGroup.Item>
                  <Button
                    variant="dark"
                    className="form-control no-shadow-btn"
                    disabled={loading}
                    onClick={handlePlaceOrder}
                  >
                    {!loading ? (
                      "Place order"
                    ) : (
                      <Spinner animation="border" size="sm" />
                    )}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ConfirmOrder;
