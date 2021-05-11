import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";

import convertErrorArray from "../helpers/convertErrorArray";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setUser(null);
      return setLoading(false);
    }
    setUser(token);
    setUserId(jwt_decode(token)._id);
    setLoading(false);
  }, [setUser, setUserId, setLoading]);

  const signup = async (name, email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        return { error: "Passwords don't match", success: false };
      }

      const response = await axios.post("/api/users/signup", {
        name,
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (err) {
      return convertErrorArray(err.response.data);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      setUser(response.data.token);
      setUserId(jwt_decode(response.data.token)._id);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    Cookies.remove("token");
    localStorage.clear();
  };

  const getProfile = async () => {
    try {
      const response = await axios.get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      setUserData(response.data.user);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const updateProfile = async (name, email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        return { error: "Passwords don't match", success: false };
      }

      const updateFields = {};
      updateFields.name = name;
      updateFields.email = email;
      password && (updateFields.password = password);

      // if name and email are same, don't update them
      if (name === userData.name) delete updateFields.name;
      if (email === userData.email) delete updateFields.email;

      const response = await axios.patch("/api/users/profile", updateFields, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      response.data.user && setUserData(response.data.user);
      return response.data;
    } catch (err) {
      return convertErrorArray(err.response.data);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      const response = await axios.patch(
        `/api/users/${id}/updateRole`,
        {
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return convertErrorArray(err.response.data);
    }
  };

  const values = {
    user,
    userId,
    signup,
    login,
    logout,
    getProfile,
    updateProfile,
    getAllUsers,
    updateUserRole,
  };

  return (
    <AuthContext.Provider value={values}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthProvider;
