import { useContext } from "react";
import Review from "./Review";
import AllReviewsModal from "./AllReviewsModal";

import { AuthContext } from "../../contexts/Auth";

function Reviews({
  reviews,
  numberOfReviews,
  productId,
  productName,
  handleRefresh,
}) {
  const { userId } = useContext(AuthContext);

  if (!reviews.length) {
    return (
      <h6 className="text-muted">There are no reviews for this product</h6>
    );
  }

  return reviews.length > 3 ? (
    <>
      {reviews.slice(0, 3).map((review) => (
        <Review
          key={review._id}
          review={review}
          productId={productId}
          userId={userId}
          handleRefresh={handleRefresh}
        />
      ))}
      <AllReviewsModal
        reviews={reviews}
        numberOfReviews={numberOfReviews}
        productName={productName}
        productId={productId}
        userId={userId}
        handleRefresh={handleRefresh}
      />
    </>
  ) : (
    reviews.map((review) => (
      <Review
        key={review._id}
        review={review}
        productId={productId}
        userId={userId}
        handleRefresh={handleRefresh}
      />
    ))
  );
}

export default Reviews;
