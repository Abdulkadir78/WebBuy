import { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Button from "react-bootstrap/Button";

import { ProductContext } from "../../../contexts/Product";
import ProductsTable from "../shared/ProductsTable";
import PageLoader from "../../Miscellaneous/PageLoader";
import Error from "../../Miscellaneous/Error";
import DismissableError from "../../Miscellaneous/DismissableError";
import DismissableSuccess from "../../Miscellaneous/DismissableSuccess";

function Products({ history, sellerId }) {
  const { getSellersProducts, deleteProduct } = useContext(ProductContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getSellersProducts(sellerId);
      if (response.error) {
        setError(response.error);
        return setLoading(false);
      }
      setProducts(response.products);
      setLoading(false);
    };

    fetchProducts();
  }, [
    getSellersProducts,
    sellerId,
    refresh,
    setLoading,
    setError,
    setProducts,
  ]);

  const handleDelete = async (productId) => {
    setDeleteError("");
    setSuccessMsg("");

    const response = await deleteProduct(productId);
    if (response.error) {
      return setDeleteError(response.error);
    }
    setSuccessMsg(response.message);
    setRefresh((prevValue) => !prevValue);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <div className="clearfix mt-4 mb-3">
        <Button
          variant="dark"
          className="float-right no-shadow-btn"
          onClick={() => history.push("/products/new")}
        >
          <FaPlus className="mb-1 mr-1" size="14" />
          Add a product
        </Button>
      </div>

      {!products.length ? (
        <h5 className="text-secondary text-center mt-8">
          You have not listed any products yet
        </h5>
      ) : (
        <>
          <h2>Your products</h2>
          {deleteError && <DismissableError error={deleteError} />}
          {successMsg && <DismissableSuccess message={successMsg} />}
          <ProductsTable
            products={products}
            handleDelete={handleDelete}
            allowUpdate={true}
          />
        </>
      )}
    </>
  );
}

export default withRouter(Products);
