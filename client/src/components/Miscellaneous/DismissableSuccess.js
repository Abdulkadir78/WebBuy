import { useState } from "react";
import Alert from "react-bootstrap/Alert";

function DismissableSuccess({ message }) {
  const [showMsg, setShowMsg] = useState(true);

  return (
    <Alert
      variant="success"
      className="mt-2"
      dismissible={true}
      show={showMsg}
      onClose={() => setShowMsg(false)}
    >
      {message}
    </Alert>
  );
}

export default DismissableSuccess;
