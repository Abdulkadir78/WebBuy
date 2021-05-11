const convertErrorArray = (err) => {
  err.error instanceof Array && (err.error = err.error[0]);
  return err;
};

export default convertErrorArray;
