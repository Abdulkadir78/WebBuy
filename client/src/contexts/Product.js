import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

import { AuthContext } from "./Auth";
import convertErrorArray from "../helpers/convertErrorArray";

const ProductContext = createContext();

function ProductProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [prodsByCategory, setProdsByCategory] = useState([]);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        // creating a copy because Array.sort().mutates the array
        const top = [...response.data.products]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);

        setProducts(response.data.products);
        setTopProducts(top);
        setProdsByCategory(response.data.products);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setProducts, setTopProducts, setLoading, setError, refresh]);

  const getProductById = async (id) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const getSellersProducts = async (id) => {
    try {
      const response = await axios.get(`/api/products/sellerProducts/${id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const searchProducts = (searchTerm) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  };

  const filterByCategory = (category) => {
    if (category === "All") {
      return setProdsByCategory(products);
    }

    const byCategory = products.filter(
      (product) => product.category === category.toLowerCase()
    );
    setProdsByCategory(byCategory);
  };

  const addProduct = async (product) => {
    try {
      const response = await axios.post(`/api/products`, product, {
        headers: {
          Authorization: `Bearer ${user}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setRefresh((prevValue) => !prevValue);
      return response.data;
    } catch (err) {
      return convertErrorArray(err.response.data);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      setRefresh((prevValue) => !prevValue);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const updateProduct = async (id, oldData, newData) => {
    try {
      const dataToSend = { ...newData };
      delete dataToSend.images; // image updates are not supported
      // only send fields that have been updated
      for (const key in dataToSend) {
        if (dataToSend[key] === oldData[key]) {
          delete dataToSend[key];
        }
      }

      const response = await axios.patch(`/api/products/${id}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      setRefresh((prevValue) => !prevValue);
      return response.data;
    } catch (err) {
      return convertErrorArray(err.response.data);
    }
  };

  const addReview = async (id, title, body, rating) => {
    try {
      const response = await axios.post(
        `/api/products/${id}/review`,
        { title, body, rating },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return convertErrorArray(err.response.data);
    }
  };

  const deleteReview = async (productId, reviewId) => {
    try {
      const response = await axios.delete(
        `/api/products/${productId}/review/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const values = {
    loading,
    error,
    products,
    topProducts,
    prodsByCategory,
    getProductById,
    getSellersProducts,
    searchProducts,
    filterByCategory,
    addProduct,
    deleteProduct,
    updateProduct,
    addReview,
    deleteReview,
  };

  return (
    <ProductContext.Provider value={values}>{children}</ProductContext.Provider>
  );
}

export { ProductContext };
export default ProductProvider;
