import { redirect } from "react-router-dom";

import { parseJwt } from "../helpers/jwt.helper";

export const authRoutesLoader = () => {
  const token = localStorage.getItem("user-info");
  const { exp } = parseJwt(token);

  const now = Date.now() / 1000;

  if (exp && exp > now) {
    return redirect("/products");
  }

  return null;
};
