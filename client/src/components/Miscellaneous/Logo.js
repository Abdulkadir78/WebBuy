import Navbar from "react-bootstrap/Navbar";

function Logo() {
  return (
    <Navbar bg="dark">
      <Navbar.Brand href="/" className="m-auto text-light brand-logo">
        WebBuy
      </Navbar.Brand>
    </Navbar>
  );
}

export default Logo;
