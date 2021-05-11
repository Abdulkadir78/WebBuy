import { useState, useContext } from "react";
import { MdRemoveCircle } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";

import { ProductContext } from "../../contexts/Product";
import Navigation from "../Home/Navigation";
import Error from "../Miscellaneous/Error";
import DismissableSuccess from "../Miscellaneous/DismissableSuccess";
import DismissableError from "../Miscellaneous/DismissableError";

function AddProduct() {
  const { addProduct } = useContext(ProductContext);

  const [values, setValues] = useState({
    name: "",
    description: "",
    category: "",
    price: 1,
    stock: 1,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileErr, setFileErr] = useState("");
  const [previewImgs, setPreviewImgs] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFileErr("");
    setImages([]);

    const imagesToUpload = [];
    const files = e.target.files;

    if (files.length > 3) {
      return setFileErr("Maximum 3 images are allowed");
    }
    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        return setFileErr("Maximum file size is 2MB");
      }
      imagesToUpload.push(file);
    }

    setImages(imagesToUpload);
    createImagePreview(imagesToUpload);
  };

  const createImagePreview = async (files) => {
    try {
      const images = await Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      setPreviewImgs(images);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileRemove = (index) => {
    // remove from preview images
    setPreviewImgs((prevValues) => prevValues.filter((val, i) => i !== index));
    // remove from actual data
    setImages((prevValues) => prevValues.filter((val, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileErr) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    formData.set("name", values.name);
    formData.set("description", values.description);
    formData.set("category", values.category);
    formData.set("price", values.price);
    formData.set("stock", values.stock);

    const response = await addProduct(formData);
    if (response.error) {
      setError(response.error);
      return setLoading(false);
    }
    setValues({
      name: "",
      description: "",
      category: "",
      price: 1,
      stock: 1,
    });
    setPreviewImgs([]);
    setImages([]);
    setSuccessMsg(response.message);
    setLoading(false);
  };

  return (
    <>
      <Navigation />
      <Container>
        <Row className="justify-content-center mt-5 mb-4">
          <Col xs={11} md={6} lg={4}>
            <h1>Add a product</h1>
            <hr />
            {successMsg && <DismissableSuccess message={successMsg} />}
            {error && <DismissableError error={error} />}
            {fileErr && <Error error={fileErr} />}

            <Form className="mt-3" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.File.Label>Images</Form.File.Label>
                {/* image preview */}
                <div
                  className={`d-flex preview-imgs  ${
                    previewImgs.length && "mb-3 border"
                  }`}
                >
                  {previewImgs.map((imageURI, index) => (
                    <div key={index}>
                      <MdRemoveCircle
                        size="20"
                        onClick={() => handleFileRemove(index)}
                        display={loading ? "none" : "block"}
                        className="pointer float-right mr-2"
                        data-tip="Remove"
                      />
                      <ReactTooltip effect="solid" />
                      <div className="mx-2 p-2">
                        <Image
                          src={imageURI}
                          alt="uploaded-img"
                          className="preview-img"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* image preview end */}
                <Form.File
                  name="images"
                  accept=".png, .jpg, .jpeg"
                  className="input"
                  disabled={loading}
                  onChange={handleFileChange}
                  multiple
                />
                <Form.Text className="text-muted">
                  Maximum 3 images of size 2MB each.
                </Form.Text>
              </Form.Group>

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
                  rows={5}
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
                  <option value="others">Others</option>
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
                    max="990000"
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
                  min="1"
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
                {!loading ? "Create" : <Spinner animation="border" size="sm" />}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AddProduct;
