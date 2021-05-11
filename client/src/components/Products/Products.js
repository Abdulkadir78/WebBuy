import Row from "react-bootstrap/Row";

import Product from "./Product";

function Products({ products }) {
  return (
    <Row>
      {!products.length ? (
        <h4 className="text-secondary mx-auto mt-5">No products</h4>
      ) : (
        products.map((product) => (
          <Product key={product._id} product={product} />
        ))
      )}
    </Row>
  );
}

export default Products;
