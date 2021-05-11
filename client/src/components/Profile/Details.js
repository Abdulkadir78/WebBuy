import { useState, useContext } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { AuthContext } from "../../contexts/Auth";
import DismissableError from "../Miscellaneous/DismissableError";
import DismissableSuccess from "../Miscellaneous/DismissableSuccess";

function Details({ userData }) {
  const { updateProfile } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const response = await updateProfile(
      name,
      email,
      password,
      confirmPassword
    );

    if (response.error) {
      setError(response.error);
      return setLoading(false);
    }
    if (response.message) {
      setSuccessMsg(response.message);
    }

    setLoading(false);
    setPassword("");
    setConfirmPassword("");
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setLoading(false);
    setName(userData.name);
    setEmail(userData.email);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  return (
    <>
      <Row className="justify-content-center my-5">
        <Col md={4} xs={11}>
          <div className="clearfix">
            {!editing && (
              <Button
                variant="success"
                size="sm"
                className="float-right"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            )}

            {editing && (
              <Button
                variant="danger"
                size="sm"
                className="float-right"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </div>

          {successMsg && <DismissableSuccess message={successMsg} />}
          {error && <DismissableError error={error} />}

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                className="input"
                value={name}
                disabled={!editing}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                className="input"
                value={email}
                disabled={!editing}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                className="input"
                value={password}
                disabled={!editing}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                className="input"
                value={confirmPassword}
                disabled={!editing}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Show password"
                disabled={!editing}
                checked={showPassword}
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              className="no-shadow-btn"
              disabled={!editing || loading}
            >
              {!loading ? "Update" : <Spinner animation="border" size="sm" />}
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default Details;
