import { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import { ProductContext } from "../../contexts/Product";
import DismissableError from "../Miscellaneous/DismissableError";

function AddReviewModal({ productId, productName, handleRefresh }) {
  const { addReview } = useContext(ProductContext);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setTitle("");
    setBody("");
    setRating("");
    setError("");
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await addReview(productId, title, body, rating);
    if (response.error) {
      setError(response.error);
      return setLoading(false);
    }
    setLoading(false);
    handleClose();
    handleRefresh();
  };

  return (
    <>
      <Button
        variant="dark"
        size="sm"
        className="no-shadow-btn"
        onClick={() => setShow(true)}
      >
        Write a review
      </Button>

      <Modal
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton={!loading}>
          <Modal.Title>Review {productName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <DismissableError error={error} />}

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                className="input"
                maxLength="100"
                value={title}
                disabled={loading}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Body</Form.Label>
              <Form.Control
                as="textarea"
                className="input"
                maxLength="500"
                rows={3}
                value={body}
                disabled={loading}
                onChange={(e) => setBody(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <Form.Control
                as="select"
                className="input"
                value={rating}
                disabled={loading}
                onChange={(e) => setRating(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very good</option>
                <option value="5">5 - Excellent</option>
              </Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="dark"
              className="no-shadow-btn mt-4"
              disabled={loading}
            >
              {!loading ? "Submit" : <Spinner animation="border" size="sm" />}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddReviewModal;
