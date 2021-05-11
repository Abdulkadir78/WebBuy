import { useState, useContext, useEffect } from "react";
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
import DismissableSuccess from "../Miscellaneous/DismissableSuccess";

function Login({ location: { state, search } }) {
  const { user, login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/");

  useEffect(() => {
    state && state.message && setShowMessage(true);

    const params = new URLSearchParams(search);
    const redirect = params.get("redirect");
    redirect && setRedirectTo(`/${redirect}`);
  }, [state, search, setShowMessage, setRedirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await login(email, password);
    if (response.error) {
      setError(response.error);
      setLoading(false);
    }
  };

  return user ? (
    <Redirect to={redirectTo} />
  ) : (
    <>
      <Navigation />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={11} md={6} lg={4}>
            <h1>Login</h1>
            <hr />
            {showMessage && <DismissableSuccess message={state.message} />}
            {error && <DismissableError error={error} />}

            <Form className="mt-3" onSubmit={handleSubmit}>
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
                {!loading ? "Login" : <Spinner animation="border" size="sm" />}
              </Button>
            </Form>
            <h6 className="mt-4 text-dark" hidden={loading}>
              New here?{" "}
              <Link to="/signup" className="text-info">
                Signup
              </Link>
            </h6>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
