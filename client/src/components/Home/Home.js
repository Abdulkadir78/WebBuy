import { useContext } from "react";
import Container from "react-bootstrap/Container";

import { ProductContext } from "../../contexts/Product";
import Navigation from "./Navigation";
import Products from "../Products/Products";
import ProductCarousel from "./ProductCarousel";
import PageLoader from "../Miscellaneous/PageLoader";
import Error from "../Miscellaneous/Error";
import Categories from "./Categories";

function Home() {
  const { loading, error, topProducts, prodsByCategory } = useContext(
    ProductContext
  );

  if (loading) {
    return (
      <>
        <Navigation />
        <PageLoader />
      </>
    );
  }

  return (
    <>
      <Navigation />
      {error ? (
        <Container>
          <Error error={error} />
        </Container>
      ) : (
        <>
          <ProductCarousel topProducts={topProducts} />
          <Container className="my-5">
            <Categories />
            <Products products={prodsByCategory} />
          </Container>
        </>
      )}
    </>
  );
}

export default Home;
