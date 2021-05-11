import { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { AuthContext } from "../../contexts/Auth";

function Navigation({ history }) {
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      return history.push(`/search/${searchTerm}`);
    }
    history.push("/");
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
      <Navbar.Brand href="/" className="brand-logo">
        WebBuy
      </Navbar.Brand>
      <Navbar.Toggle />

      <Navbar.Collapse id="responsive-nav">
        <Form inline onSubmit={handleSubmit} className="py-1">
          <Form.Control
            type="text"
            placeholder="Search"
            className="mr-2 col"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            type="submit"
            variant="outline-light"
            className="no-shadow-btn"
          >
            Search
          </Button>
        </Form>

        <Nav className="ml-auto mr-4">
          <LinkContainer to="/cart">
            <Nav.Link>Cart</Nav.Link>
          </LinkContainer>

          {!user && (
            <>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/signup">
                <Nav.Link>Signup</Nav.Link>
              </LinkContainer>
            </>
          )}

          {user && (
            <>
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default withRouter(Navigation);
