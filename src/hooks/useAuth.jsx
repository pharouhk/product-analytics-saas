import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { useSessionStorage } from "./useSessionStorage";

const AuthContext = createContext();

function createExpirationTime(minutes) {
  return new Date(Date.now() + (minutes * 60 * 1000));
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [expirationDate, setExpirationDate] = useSessionStorage("sessionExpiration", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data) => {
    setUser(data);
    setExpirationDate(createExpirationTime(60*24)); //current login time plus one day
    navigate("/overview");
  };

  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  

  return <AuthContext.Provider value={{user, expirationDate, login, logout}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};