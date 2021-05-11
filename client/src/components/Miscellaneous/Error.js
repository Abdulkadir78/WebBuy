import Alert from "react-bootstrap/Alert";

function Error({ error }) {
  return (
    <Alert variant="danger" className="mt-4">
      {error}
    </Alert>
  );
}

export default Error;
