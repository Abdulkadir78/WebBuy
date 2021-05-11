import { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { AuthContext } from "../../contexts/Auth";
import Navigation from "../Home/Navigation";
import DismissableError from "../Miscellaneous/DismissableError";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const { user, signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await signup(name, email, password, confirmPassword);
    if (response.error) {
      setLoading(false);
      return setError(response.error);
    }
    setLoading(false);
    setRedirectToLogin(true);
  };

  if (redirectToLogin) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { message: "Your account has been created! Please login." },
        }}
      />
    );
  }

  return user ? (
    <Redirect to="/" />
  ) : (
    <>
      <Navigation />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col xs={11} md={6} lg={4}>
            <h1>Signup</h1>
            <hr />
            {error && <DismissableError error={error} />}

            <Form className="mt-3" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  className="input"
                  value={name}
                  disabled={loading}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  className="input"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  className="input"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  className="input"
                  value={confirmPassword}
                  disabled={loading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Show password"
                  disabled={loading}
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </Form.Group>

              <Button
                variant="dark"
                type="submit"
                className="no-shadow-btn"
                disabled={loading}
              >
                {!loading ? "Signup" : <Spinner animation="border" size="sm" />}
              </Button>
            </Form>
            <h6 className="mt-4 text-dark" hidden={loading}>
              Have an account?{" "}
              <Link to="/login" className="text-info">
                Login
              </Link>
            </h6>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Signup;
