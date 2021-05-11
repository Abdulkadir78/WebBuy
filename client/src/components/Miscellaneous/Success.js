import Alert from "react-bootstrap/Alert";

function Success({ message }) {
  return (
    <Alert variant="success" className="mt-4">
      {message}
    </Alert>
  );
}

export default Success;
