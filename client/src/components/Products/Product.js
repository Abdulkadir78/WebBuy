import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

function Product({ product }) {
  return (
    <Col md={4} className="mt-4">
      <Link
        to={`/product/${product._id}`}
        className="text-decoration-none text-dark"
      >
        <Card className="h-100 shadow border-0 text-break position-relative">
          {product.stock === 0 && (
            <Card.Header
              className="w-100 text-center text-white bg-danger position-absolute"
              style={{ top: "35%" }}
            >
              <h5>Out of stock</h5>
            </Card.Header>
          )}

          <Card.Img
            variant="top"
            className="card-img"
            src={product.images[0]}
          />
          <Card.Body>
            <Card.Title className="text-truncate">{product.name}</Card.Title>
            <Card.Subtitle>
              {product.rating}
              <AiFillStar className="text-warning mb-1" /> (
              {product.numberOfReviews})
            </Card.Subtitle>

            <Card.Text className="mt-2 text-info text-truncate">
              ₹{product.price.toLocaleString()}
            </Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
}

export default Product;
