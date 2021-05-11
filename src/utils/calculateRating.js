const calculateRating = (product) =>
  (
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.numberOfReviews
  ).toFixed(1);

module.exports = calculateRating;
