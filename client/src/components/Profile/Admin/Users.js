import { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import { AuthContext } from "../../../contexts/Auth";
import PageLoader from "../../Miscellaneous/PageLoader";
import Error from "../../Miscellaneous/Error";
import DismissableError from "../../Miscellaneous/DismissableError";
import DismissableSuccess from "../../Miscellaneous/DismissableSuccess";
import convertDateString from "../../../helpers/convertDateString";

function Users() {
  const { getAllUsers, updateUserRole } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [updateErr, setUpdateErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();
      if (response.error) {
        setError(response.error);
        return setLoading(false);
      }
      setUsers(response.users);
      setLoading(false);
    };

    fetchUsers();
  }, [getAllUsers, refresh, setLoading, setUsers, setError]);

  const handleUpdateRole = async (id, role) => {
    setUpdateErr("");
    setSuccessMsg("");

    const response = await updateUserRole(id, role);
    if (response.error) {
      return setUpdateErr(response.error);
    }
    setSuccessMsg(response.message);
    setRefresh((prevValue) => !prevValue);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return !users.length ? (
    <h4 className="text-secondary text-center mt-13">No users</h4>
  ) : (
    <>
      <h2>Users</h2>
      {updateErr && <DismissableError error={updateErr} />}
      {successMsg && <DismissableSuccess message={successMsg} />}

      <Table bordered hover responsive className="mt-2">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{convertDateString(user.createdAt)}</td>
              <td>{user.role}</td>

              <td>
                {user.role === "user" ? (
                  <div className="text-center">
                    <Button
                      variant="outline-dark no-shadow-btn"
                      size="sm"
                      className="my-1 mx-2"
                      onClick={() => handleUpdateRole(user._id, "seller")}
                    >
                      Make Seller
                    </Button>

                    <Button
                      variant="outline-danger no-shadow-btn"
                      size="sm"
                      className="my-1 mx-1"
                      onClick={() => handleUpdateRole(user._id, "admin")}
                    >
                      Make Admin
                    </Button>
                  </div>
                ) : (
                  <h6 className="text-muted text-center mr-2">No actions</h6>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Users;
