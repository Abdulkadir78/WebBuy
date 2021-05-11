import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../../contexts/Auth";

function PrivateRoute(props) {
  const { user } = useContext(AuthContext);

  return !user ? <Redirect to="/login" /> : <Route {...props} />;
}

export default PrivateRoute;
