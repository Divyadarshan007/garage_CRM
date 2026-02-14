import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';

export interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

export const auth = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7 });
  },
  getToken: (): string | undefined => Cookies.get(TOKEN_KEY),
  removeToken: () => Cookies.remove(TOKEN_KEY),
  isAuthenticated: (): boolean => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        auth.removeToken();
        return false;
      }
      return true;
    } catch {
      auth.removeToken();
      return false;
    }
  },
  getUserId: (): string | null => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token).id;
    } catch {
      return null;
    }
  },
};
