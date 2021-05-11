import { useState, useEffect, useContext } from "react";

import { ProductContext } from "../../contexts/Product";

function Categories() {
  const { filterByCategory } = useContext(ProductContext);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    filterByCategory(category);
  }, []);

  const handleChange = (e) => {
    setCategory(e.target.value);
    filterByCategory(e.target.value);
  };

  return (
    <>
      <div className="clearfix">
        <select
          name="category"
          className="input float-right mb-3 p-2"
          value={category}
          onChange={handleChange}
        >
          <option value="All">All</option>
          <option value="Fashion">Fashion</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Electronics">Electronics</option>
          <option value="Appliances">Appliances</option>
          <option value="Furniture">Furniture</option>
          <option value="Grocery">Grocery</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <span className="h2 text-capitalize">
        {category === "All"
          ? "Products"
          : category.charAt(0).toUpperCase() + category.substr(1)}
      </span>
      <hr />
    </>
  );
}

export default Categories;
