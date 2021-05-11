import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import Navigation from "../Home/Navigation";

function NotFound() {
  return (
    <>
      <Navigation />
      <div className="mt-13 text-center">
        <h5>The page you are looking for does not exist.</h5>
        <h6 className="text-muted">
          You may have mistyped the url or the page may have moved.
        </h6>
        <Link to="/">
          <Button variant="outline-info" className="my-2 no-shadow-btn">
            Back to WebBuy
          </Button>
        </Link>
      </div>
    </>
  );
}

export default NotFound;
