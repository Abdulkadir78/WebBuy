const calculateTotal = (products) => {
  return products.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const calculateTotalItems = (products) => {
  return products.reduce((acc, item) => acc + parseInt(item.quantity), 0);
};

export { calculateTotal, calculateTotalItems };
