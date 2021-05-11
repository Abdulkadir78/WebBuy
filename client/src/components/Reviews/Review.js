import { useContext, useState } from "react";
import { MdStar, MdDelete } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import moment from "moment";

import { ProductContext } from "../../contexts/Product";
import DismissableError from "../Miscellaneous/DismissableError";
import Success from "../Miscellaneous/Success";

function Review({ review, productId, userId, handleRefresh }) {
  const { deleteReview } = useContext(ProductContext);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [truncate, setTruncate] = useState(review.body.length > 120);

  const handleDelete = async (reviewId) => {
    setError("");
    setSuccessMsg("");

    const response = await deleteReview(productId, reviewId);
    if (response.error) {
      return setError(response.error);
    }
    setSuccessMsg(response.message);
    handleRefresh();
  };

  return (
    <div className="text-break">
      {error && <DismissableError error={error} />}
      {successMsg && <Success message={successMsg} />}
      <span>
        {review.rating}
        <MdStar size={20} className="mb-1 text-warning" />

        {review.author._id === userId && (
          <>
            <MdDelete
              size={20}
              className="text-danger float-right pointer"
              onClick={() => handleDelete(review._id)}
              data-tip="Delete"
            />
            <ReactTooltip effect="solid" />
          </>
        )}
      </span>
      <h6 className="font-weight-bold">{review.title}</h6>

      {review.body && (
        <p>
          {truncate ? review.body.slice(0, 120) : review.body}

          <span
            className="text-info font-weight-bold pointer"
            onClick={() => setTruncate((prevValue) => !prevValue)}
          >
            {truncate ? (
              "...Read more"
            ) : (
              <span className="ml-2">Read less</span>
            )}
          </span>
        </p>
      )}

      <h6>
        - {review.author.name},{" "}
        <span className="text-muted">{moment(review.createdAt).fromNow()}</span>
      </h6>
      <hr />
    </div>
  );
}

export default Review;
