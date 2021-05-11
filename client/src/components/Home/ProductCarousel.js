import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";

function ProductCarousel({ topProducts }) {
  return (
    <Carousel
      className="shadow-sm"
      pause={false}
      indicators={false}
      controls={topProducts.length > 1}
      nextIcon={<MdKeyboardArrowRight size="50" color="black" />}
      prevIcon={<MdKeyboardArrowLeft size="50" color="black" />}
    >
      {topProducts.map((product, index) => (
        <Carousel.Item key={product._id} interval={2500}>
          <Link to={`/product/${product._id}`} className="text-decoration-none">
            <Image
              className="w-100 carousel-img"
              src={product.images[0]}
              alt={`Top product - ${index + 1}`}
            />

            <h4 className="text-center bg-dark text-white mb-0 p-2  text-truncate">
              {product.name}
            </h4>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
