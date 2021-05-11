import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";

import Navigation from "../Home/Navigation";
import { useEffect, useState } from "react";

function CheckoutNav() {
  const [shipping, setShipping] = useState({});
  const [paymentMethod, setPaymentMethod] = useState({});

  useEffect(() => {
    const shipDets = localStorage.getItem("shipping");
    const payDets = localStorage.getItem("paymentMethod");
    setShipping(shipDets);
    setPaymentMethod(payDets);
  }, []);

  return (
    <>
      <Navigation />
      <Container>
        <Row className="justify-content-center mt-4">
          <Nav>
            <Nav.Item>
              <LinkContainer to="/shipping" className="text-dark">
                <Nav.Link>Shipping</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item>
              <LinkContainer to="/payment" className="text-dark">
                <Nav.Link
                  disabled={!shipping}
                  className={!shipping && "text-muted"}
                >
                  Payment
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item>
              <LinkContainer to="/confirmOrder" className="text-dark">
                <Nav.Link
                  disabled={!shipping || !paymentMethod}
                  className={(!shipping || !paymentMethod) && "text-muted"}
                >
                  Confirm
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
        </Row>
      </Container>
    </>
  );
}

export default CheckoutNav;
