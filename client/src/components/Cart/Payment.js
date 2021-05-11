import { useState } from "react";
import { Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import CheckoutNav from "./CheckoutNav";
import { calculateTotal } from "../../helpers/calculate";
import { PURCHASE_LIMIT } from "../constants";

function Payment({ history }) {
  const [cart] = useState(JSON.parse(localStorage.getItem("cart")));
  const [shipping] = useState(localStorage.getItem("shipping"));
  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem("paymentMethod")
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("paymentMethod", paymentMethod);
    history.push("/confirmOrder");
  };

  if (!cart || !cart.length || calculateTotal(cart) > PURCHASE_LIMIT) {
    return <Redirect to="/cart" />;
  }

  return !shipping ? (
    <Redirect to="/shipping" />
  ) : (
    <>
      <CheckoutNav />
      <Container>
        <Row className="justify-content-center mt-4">
          <Col md={4} xs={11}>
            <h2>Payment</h2>
            <hr />
            <Form onSubmit={handleSubmit}>
              <Form.Check
                type="radio"
                name="paymentMethod"
                label="Card"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              />
              <Form.Check
                type="radio"
                name="paymentMethod"
                label="Cash on delivery"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              />
              <Button
                variant="dark"
                type="submit"
                className="no-shadow-btn mt-3"
              >
                Next
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Payment;
