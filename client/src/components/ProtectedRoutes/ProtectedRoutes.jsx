import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Login } from "../../pages/Login";
import { parseJwt } from "../../utils/ParseJwt";

export const ProtectedRoutes = ({ children }) => {
  const [tokenExistAndIsValid, setTokenExistAndIsValid] = useState(parseJwt(localStorage.getItem('auth_token')).exp * 1000 > Date.now());

  return <>{tokenExistAndIsValid != true ? <Login/> : children}</>;
};
