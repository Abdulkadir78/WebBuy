import { useState, useEffect, useContext } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Carousel from "react-bootstrap/Carousel";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { ProductContext } from "../../contexts/Product";
import { AuthContext } from "../../contexts/Auth";
import Navigation from "../Home/Navigation";
import Reviews from "../Reviews/Reviews";
import AddReviewModal from "../Reviews/AddReviewModal";
import PageLoader from "../Miscellaneous/PageLoader";
import Error from "../Miscellaneous/Error";
import GoBackBtn from "../Miscellaneous/GoBackBtn";
import quantityOptions from "../../helpers/quantityOptions";

function ProductById({ match: { params }, history }) {
  const { getProductById } = useContext(ProductContext);
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [inCart, setInCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getProductById(params.productId);
      if (response.error) {
        setError(response.error);
        return setLoading(false);
      }
      setProduct(response.product);

      const cart = JSON.parse(localStorage.getItem("cart"));
      if (cart) {
        const isInCart = cart.some(
          (product) => product.productId === response.product._id
        );
        setInCart(isInCart);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh((prevValue) => !prevValue);
  };

  const handleAddToCart = (product) => {
    if (inCart) {
      return history.push("/cart");
    }

    const cartProduct = {
      productId: product._id,
      seller: product.seller._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      stock: product.stock,
      quantity,
    };

    const cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) {
      localStorage.setItem("cart", JSON.stringify([cartProduct]));
      return setInCart(true);
    }

    cart.push(cartProduct);
    localStorage.setItem("cart", JSON.stringify(cart));
    setInCart(true);
  };

  return (
    <>
      <Navigation />
      <Container fluid className="mt-5 ml-lg-4">
        <GoBackBtn />

        {loading ? (
          <PageLoader />
        ) : (
          <>
            <Col md={7} className="mx-auto mt-5">
              {error && <Error error={error} />}
            </Col>
            {product && (
              <>
                <Row className="mt-5">
                  <Col md={7} lg={5}>
                    <Carousel
                      className="productId-carousel"
                      indicators={product.images.length > 1}
                      controls={product.images.length > 1}
                      nextIcon={
                        <MdKeyboardArrowRight size="50" color="#17a2b8" />
                      }
                      prevIcon={
                        <MdKeyboardArrowLeft size="50" color="#17a2b8" />
                      }
                    >
                      {product.images.map((imageUrl, index) => (
                        <Carousel.Item key={index} interval={3000}>
                          <img
                            className="w-100 productId-img"
                            src={imageUrl}
                            alt="product-img"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </Col>

                  <Col md={4} lg={3} className="mt-4 mx-2">
                    <h3>{product.name}</h3>
                    <hr />

                    <span>
                      {product.rating}
                      <AiFillStar className="text-warning mb-1" />
                    </span>
                    <span className="text-muted ml-5">
                      {product.numberOfReviews} review(s)
                    </span>
                    <hr />

                    <h6 className="text-muted">Description</h6>
                    <p>{product.description}</p>
                  </Col>

                  <Col md={11} lg={3} className="mt-2 mx-auto">
                    <ListGroup className="text-break">
                      <ListGroup.Item>
                        <Row>
                          <span className="col-6">Price</span>
                          <span className="col-6">
                            ₹{product.price.toLocaleString()}
                          </span>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <span className="col-6">Status</span>
                          <span className="col-6">
                            {product.stock > 0 ? (
                              <span className="text-success">In stock</span>
                            ) : (
                              <span className="text-danger">Out of stock</span>
                            )}
                          </span>
                        </Row>
                      </ListGroup.Item>

                      {product.stock > 0 && (
                        <>
                          {!inCart && (
                            <ListGroup.Item>
                              <Row>
                                <span className="col-6">Quantity</span>
                                <div className="col-6">
                                  <select
                                    className="w-50"
                                    onChange={(e) =>
                                      setQuantity(e.target.value)
                                    }
                                  >
                                    {(product.stock > 3
                                      ? quantityOptions(3)
                                      : quantityOptions(product.stock)
                                    ).map((option) => option)}
                                  </select>
                                </div>
                              </Row>
                            </ListGroup.Item>
                          )}

                          <ListGroup.Item>
                            <Button
                              className="form-control no-shadow-btn"
                              variant={inCart ? "info" : "dark"}
                              onClick={() => handleAddToCart(product)}
                            >
                              {inCart ? "In cart" : "Add to cart"}
                            </Button>
                          </ListGroup.Item>
                        </>
                      )}
                    </ListGroup>

                    <Card className="mt-4">
                      <Card.Body>
                        <Card.Title>Seller contact</Card.Title>
                        <hr />
                        <Card.Text>
                          Name: {product.seller.name}
                          <br />
                          Email: {product.seller.email}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="my-4">
                  <Col lg={6}>
                    <h2>Reviews</h2>
                    {user ? (
                      <AddReviewModal
                        productId={product._id}
                        productName={product.name}
                        handleRefresh={handleRefresh}
                      />
                    ) : (
                      <Alert
                        variant="info"
                        className="col-11 col-md-8 col-lg-6"
                      >
                        <Link to="/login" className="text-dark">
                          Login
                        </Link>{" "}
                        to write a review
                      </Alert>
                    )}
                    <hr />
                    <Reviews
                      reviews={product.reviews}
                      numberOfReviews={product.numberOfReviews}
                      productId={product._id}
                      productName={product.name}
                      handleRefresh={handleRefresh}
                    />
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default ProductById;
