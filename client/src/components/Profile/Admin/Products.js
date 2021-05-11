import { useState, useContext } from "react";

import { ProductContext } from "../../../contexts/Product";
import ProductsTable from "../shared/ProductsTable";
import PageLoader from "../../Miscellaneous/PageLoader";
import Error from "../../Miscellaneous/Error";
import DismissableError from "../../Miscellaneous/DismissableError";
import DismissableSuccess from "../../Miscellaneous/DismissableSuccess";

function Products() {
  const { products, loading, error, deleteProduct } = useContext(
    ProductContext
  );

  const [deleteError, setDeleteError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleDelete = async (productId) => {
    setDeleteError("");
    setSuccessMsg("");

    const response = await deleteProduct(productId);
    if (response.error) {
      return setDeleteError(response.error);
    }
    setSuccessMsg(response.message);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return !products.length ? (
    <h4 className="text-secondary text-center mt-13">No products</h4>
  ) : (
    <>
      <h2>Products</h2>
      {deleteError && <DismissableError error={deleteError} />}
      {successMsg && <DismissableSuccess message={successMsg} />}

      <ProductsTable
        products={products}
        handleDelete={handleDelete}
        allowUpdate={false}
      />
    </>
  );
}

export default Products;
