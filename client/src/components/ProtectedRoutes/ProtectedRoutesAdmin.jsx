import React, { useEffect, useState } from "react";
import { parseJwt } from "../../utils/ParseJwt";
import { Home } from "../../pages/Home";

export const ProtectedRoutesAdmin = ({ children }) => {
  const [tokenExistAndIsValid, setTokenExistAndIsValid] = useState(parseJwt(localStorage.getItem('auth_token')).exp * 1000 > Date.now());
const [rolValid,setRolValid] = useState(localStorage.getItem('rol'))

  return <>{tokenExistAndIsValid != true || rolValid != 'Admin'  ? <Home/> : children}</>;
};
