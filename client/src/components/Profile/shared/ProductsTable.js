import { Link, withRouter } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

function ProductsTable({ products, handleDelete, allowUpdate, history }) {
  return (
    <Table bordered hover responsive className="mt-2">
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>
              <Link to={`/product/${product._id}`} className="text-dark">
                {product._id}
              </Link>
            </td>

            <td>{product.name}</td>
            <td>₹{product.price.toLocaleString()}</td>
            <td>{product.category}</td>

            <td>
              {product.stock > 0 ? (
                <span className="text-success">In Stock</span>
              ) : (
                <span className="text-danger">Out of stock</span>
              )}
            </td>

            <td>
              {allowUpdate && (
                <Button
                  variant="outline-dark"
                  size="sm"
                  className="my-1 mx-2"
                  onClick={() =>
                    history.push({
                      pathname: "/products/update",
                      state: { product },
                    })
                  }
                >
                  Update
                </Button>
              )}

              <Button
                variant="outline-danger"
                size="sm"
                className="my-1 mx-2"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default withRouter(ProductsTable);
