import { useEffect, useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

import { AuthContext } from "../../contexts/Auth";
import PageLoader from "../Miscellaneous/PageLoader";
import Error from "../Miscellaneous/Error";
import Navigation from "../Home/Navigation";
import Details from "./Details";
import MyOrders from "./MyOrders";
import Admin from "./Admin/Admin";
import Seller from "./Seller/Seller";

function Profile() {
  const { getProfile } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await getProfile();
      if (response.error) {
        setError(response.error);
        return setLoading(false);
      }
      setUserData(response.user);
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <Navigation />

      {loading ? (
        <PageLoader />
      ) : (
        <Container className="mt-4">
          <Tab.Container defaultActiveKey="account">
            {error && <Error error={error} />}

            <Nav fill variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="account">Account</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="myOrders">My orders</Nav.Link>
              </Nav.Item>

              {userData.role === "admin" && (
                <Nav.Item>
                  <Nav.Link eventKey="admin">Admin</Nav.Link>
                </Nav.Item>
              )}
              {userData.role === "seller" && (
                <Nav.Item>
                  <Nav.Link eventKey="seller">Seller</Nav.Link>
                </Nav.Item>
              )}
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="account">
                <Details userData={userData} />
              </Tab.Pane>
              <Tab.Pane eventKey="myOrders">
                <MyOrders />
              </Tab.Pane>

              {userData.role === "admin" && (
                <Tab.Pane eventKey="admin">
                  <Admin />
                </Tab.Pane>
              )}
              {userData.role === "seller" && (
                <Tab.Pane eventKey="seller">
                  <Seller sellerId={userData._id} />
                </Tab.Pane>
              )}
            </Tab.Content>
          </Tab.Container>
        </Container>
      )}
    </>
  );
}

export default Profile;
