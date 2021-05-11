import { useState } from "react";
import Modal from "react-bootstrap/Modal";

import Review from "./Review";

function AllReviewsModal({
  reviews,
  numberOfReviews,
  productName,
  productId,
  userId,
  handleRefresh,
}) {
  const [show, setShow] = useState(false);

  return (
    <>
      <h6 className="text-primary pointer" onClick={() => setShow(true)}>
        See all {numberOfReviews} review(s)
      </h6>

      <Modal size="lg" show={show} scrollable onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{productName} reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviews.map((review) => (
            <Review
              key={review._id}
              review={review}
              productId={productId}
              userId={userId}
              handleRefresh={handleRefresh}
            />
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AllReviewsModal;
