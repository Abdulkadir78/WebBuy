import Container from "react-bootstrap/Container";
import { withRouter } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function GoBackBtn({ history }) {
  return (
    <Container fluid className="my-5">
      <span className="text-dark pointer" onClick={() => history.push("/")}>
        <MdKeyboardBackspace /> Home
      </span>
    </Container>
  );
}

export default withRouter(GoBackBtn);
