import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import CheckoutNav from "./CheckoutNav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { calculateTotal } from "../../helpers/calculate";
import { PURCHASE_LIMIT } from "../constants";

function Shipping({ history }) {
  const [cart] = useState(JSON.parse(localStorage.getItem("cart")));
  const [shippingDetails, setShippingDetails] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const shipping = JSON.parse(localStorage.getItem("shipping"));
    shipping && setShippingDetails(shipping);
  }, [setShippingDetails]);

  const handleChange = (e) => {
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    localStorage.setItem("shipping", JSON.stringify(shippingDetails));
    history.push("/payment");
  };

  if (!cart || !cart.length || calculateTotal(cart) > PURCHASE_LIMIT) {
    return <Redirect to="/cart" />;
  }

  return (
    <>
      <CheckoutNav />
      <Container>
        <Row className="justify-content-center mt-4">
          <Col md={4} xs={11}>
            <h2>Shipping</h2>
            <hr />
            <Form className="mt-3" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  className="input"
                  name="address"
                  maxLength="200"
                  value={shippingDetails.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  className="input"
                  name="city"
                  maxLength="50"
                  value={shippingDetails.city}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Postal code</Form.Label>
                <Form.Control
                  type="text"
                  className="input"
                  name="postalCode"
                  maxLength="20"
                  value={shippingDetails.postalCode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  className="input"
                  name="country"
                  maxLength="50"
                  value={shippingDetails.country}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button
                variant="dark"
                type="submit"
                className="no-shadow-btn mt-2"
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

export default Shipping;
