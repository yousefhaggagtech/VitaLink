import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from '@/domain/types/types';

export const extractUserFromToken = (): string => {
  const token = Cookies.get("token");
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const name =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.email ||
        decoded.sub ||
        "User";

      const normalizedUsername = name.toLowerCase();
      return normalizedUsername;
    } catch (error) {
      console.error(" Invalid token:", error);
    }
  } else {
    console.warn(" No JWT cookie found.");
  }
  return "";
};
