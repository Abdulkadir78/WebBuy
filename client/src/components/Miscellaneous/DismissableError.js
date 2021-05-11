import { useState } from "react";
import Alert from "react-bootstrap/Alert";

function DismissableError({ error }) {
  const [showError, setShowError] = useState(true);

  return (
    <Alert
      variant="danger"
      className="mt-2"
      dismissible={true}
      show={showError}
      onClose={() => setShowError(false)}
    >
      {error}
    </Alert>
  );
}

export default DismissableError;
