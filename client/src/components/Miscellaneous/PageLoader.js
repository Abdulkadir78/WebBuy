import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";

function PageLoader() {
  return (
    <Row className="justify-content-center" style={{ marginTop: "15rem" }}>
      <Spinner
        animation="border"
        variant="info"
        style={{ height: "3rem", width: "3rem" }}
      />
    </Row>
  );
}

export default PageLoader;
