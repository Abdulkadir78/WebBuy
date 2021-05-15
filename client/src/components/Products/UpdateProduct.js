import { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";

import Navigation from "../Home/Navigation";
import { ProductContext } from "../../contexts/Product";
import DismissableError from "../Miscellaneous/DismissableError";

function UpdateProduct({ location: { state }, history }) {
  const { updateProduct } = useContext(ProductContext);

  const [values, setValues] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (state && state.product) {
      const { name, description, category, price, stock, images } =
        state.product;
      setValues({ name, description, category, price, stock, images });
    }
  }, [state, setValues]);

  const handleChange = (e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await updateProduct(
      state.product._id,
      state.product,
      values
    );

    if (response.error) {
      setError(response.error);
      return setLoading(false);
    }
    if (response.message) {
      setLoading(false);
      return history.push(`/product/${state.product._id}`);
    }
    setLoading(false);
  };

  return !(state && state.product) ? (
    <Redirect to="/" />
  ) : (
    <>
      <Navigation />
      <Container>
        <Row className="justify-content-center mt-5 mb-4">
          <Col xs={11} md={6} lg={4}>
            <h1>Update product</h1>
            <hr />
            {error && <DismissableError error={error} />}

            <label>Images</label>
            <div className="d-flex preview-imgs border">
              {values.images.map((imageURI, index) => (
                <div key={index}>
                  <div className="mx-2 p-2">
                    <Image
                      src={imageURI}
                      alt="product-img"
                      className="preview-img"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Form className="mt-3" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  maxLength="100"
                  className="input"
                  value={values.name}
                  disabled={loading}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  className="input"
                  maxLength="500"
                  rows={3}
                  value={values.description}
                  disabled={loading}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  className="input"
                  value={values.category}
                  disabled={loading}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="fashion">Fashion</option>
                  <option value="mobiles">Mobiles</option>
                  <option value="electronics">Electronics</option>
                  <option value="appliances">Appliances</option>
                  <option value="furniture">Furniture</option>
                  <option value="grocery">Grocery</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Price</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>₹</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="number"
                    min="1"
                    name="price"
                    className="input"
                    value={values.price}
                    disabled={loading}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="stock"
                  className="input"
                  value={values.stock}
                  disabled={loading}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button
                variant="dark"
                type="submit"
                className="no-shadow-btn"
                disabled={loading}
              >
                {!loading ? "Update" : <Spinner animation="border" size="sm" />}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UpdateProduct;
