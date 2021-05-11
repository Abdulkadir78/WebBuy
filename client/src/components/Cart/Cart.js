import { useEffect, useState, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { AuthContext } from "../../contexts/Auth";
import { calculateTotal, calculateTotalItems } from "../../helpers/calculate";
import quantityOptions from "../../helpers/quantityOptions";
import PageLoader from "../Miscellaneous/PageLoader";
import Error from "../Miscellaneous/Error";
import GoBackBtn from "../Miscellaneous/GoBackBtn";
import Navigation from "../Home/Navigation";
import { PURCHASE_LIMIT } from "../constants";

function Cart({ history }) {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    setProducts(cart);
    if (cart) {
      const amount = calculateTotal(cart);
      amount > PURCHASE_LIMIT &&
        setError("Total purchase amount should not exceed ₹999,999");

      setTotal(amount);
      setTotalItems(calculateTotalItems(cart));
    }
    setLoading(false);
  }, [setProducts, setLoading, setTotal]);

  const handleQuantityChange = (value, id) => {
    setError("");
    const index = products.findIndex((product) => product.productId === id);
    const updatedProducts = [...products];
    updatedProducts[index].quantity = value;

    setProducts(updatedProducts);
    setTotalItems(calculateTotalItems(updatedProducts));
    const amount = calculateTotal(updatedProducts);
    setTotal(amount);

    amount > PURCHASE_LIMIT &&
      setError("Total purchase amount should not exceed ₹999,999");

    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  const handleRemove = (id) => {
    setError("");
    const index = products.findIndex((product) => product.productId === id);
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);

    setProducts(updatedProducts);
    setTotalItems(calculateTotalItems(updatedProducts));
    const amount = calculateTotal(updatedProducts);
    setTotal(amount);

    amount > PURCHASE_LIMIT &&
      setError("Total purchase amount should not exceed ₹999,999");

    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  return (
    <>
      <Navigation />
      <GoBackBtn />

      {loading ? (
        <PageLoader />
      ) : (
        <Container className="mb-4">
          <>
            {error && <Error error={error} />}
            {!products || !products.length ? (
              <Alert variant="info" className="col-md-6">
                Your shopping cart is empty
              </Alert>
            ) : (
              <Row>
                <Col md={8}>
                  <h2 className="mb-3">Your shopping Cart</h2>
                  <ListGroup>
                    {products.map((product) => (
                      <ListGroup.Item
                        key={product.productId}
                        className="text-break"
                      >
                        <Row>
                          <Col md={2}>
                            <img
                              src={product.image}
                              alt="product"
                              style={{ width: "75px", height: "75px" }}
                            />
                          </Col>

                          <Col xs={6} md={3} className="my-2">
                            <Link
                              to={`/product/${product.productId}`}
                              className="text-dark"
                            >
                              {product.name}
                            </Link>
                          </Col>

                          <Col xs={6} md={3} className="my-2">
                            <span>₹{product.price.toLocaleString()}</span>
                          </Col>

                          <Col xs={8} md={3} className="my-2">
                            <select
                              defaultValue={product.quantity}
                              className="w-50 p-1"
                              onChange={(e) =>
                                handleQuantityChange(
                                  e.target.value,
                                  product.productId
                                )
                              }
                            >
                              {(product.stock > 3
                                ? quantityOptions(3)
                                : quantityOptions(product.stock)
                              ).map((option) => option)}
                            </select>
                          </Col>

                          <Col xs={4} md={1} className="my-2">
                            <MdDelete
                              className="pointer"
                              size="20"
                              data-tip="Remove"
                              onClick={() => handleRemove(product.productId)}
                            />
                            <ReactTooltip effect="solid" />
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>

                <Col md={4} className="mt-4">
                  <Card>
                    <Card.Body>
                      <h4>{totalItems} item(s)</h4>
                      <hr />
                      <h6>Total amount - ₹{total.toLocaleString()}</h6>
                      <hr />
                      <Button
                        variant="dark form-contro"
                        block
                        disabled={error}
                        onClick={() =>
                          user
                            ? history.push("/shipping")
                            : history.push("/login?redirect=shipping")
                        }
                      >
                        Proceed to checkout
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </>
        </Container>
      )}
    </>
  );
}
export default Cart;
