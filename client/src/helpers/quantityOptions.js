const quantityOptions = (stock) => {
  const arr = [];
  for (let i = 1; i <= stock; i++) {
    arr.push(<option key={i}>{i}</option>);
  }
  return arr;
};

export default quantityOptions;
