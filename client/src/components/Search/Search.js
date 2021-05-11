import { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { ProductContext } from "../../contexts/Product";
import Navigation from "../Home/Navigation";
import Product from "../Products/Product";
import PageLoader from "../Miscellaneous/PageLoader";
import GoBackBtn from "../Miscellaneous/GoBackBtn";

function Search({ match: { params } }) {
  const { searchProducts } = useContext(ProductContext);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const response = searchProducts(params.searchTerm.trim().toLowerCase());
    setProducts(response);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [searchProducts, params.searchTerm]);

  return (
    <>
      <Navigation />
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <GoBackBtn />
          <Container className="mb-4">
            <h2>Search for '{params.searchTerm}'</h2>
            <h5 className="text-muted">{products.length} result(s)</h5>
            <Row>
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </Row>
          </Container>
        </>
      )}
    </>
  );
}

export default Search;
