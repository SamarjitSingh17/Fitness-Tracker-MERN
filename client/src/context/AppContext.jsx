import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { toast } from "react-toastify";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState([]);
  const [allActivityLogs, setAllActivityLogs] = useState([]);

  const signup = async (credentials) => {
    try {
      const { data } = await api.post("/api/auth/local/register", credentials);
      setUser({ ...data.user, token: data.jwt });
      if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }
      localStorage.setItem("token", data.jwt);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
      toast.success("Signed up successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/api/auth/local", {
        identifier: credentials.email,
        password: credentials.password,
      });
      setUser({ ...data.user, token: data.jwt });
      if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }
      localStorage.setItem("token", data.jwt);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
      toast.success("Logged in successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingCompleted(false);
    api.defaults.headers.common["Authorization"] = "";
    navigate("/");
  };

  // token passed as parameter just like video
  const fetchUser = async (token) => {
    try {
      const { data } = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...data, token });
      if (data?.age && data?.weight && data?.goal) {
        setOnboardingCompleted(true);
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsUserFetched(true);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const fetchFoodLogs = async (token) => {
    try {
      const { data } = await api.get("/api/food-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllFoodLogs(data);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const fetchActivityLogs = async (token) => {
    try {
      const { data } = await api.get("/api/activity-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllActivityLogs(data);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await fetchUser(token); // pass token like video
        await fetchFoodLogs(token);
        await fetchActivityLogs(token);
      })();
    } else {
      setIsUserFetched(true);
    }
  }, []);

  const value = {
    user,
    setUser,
    isUserFetched,
    setIsUserFetched,
    onboardingCompleted,
    setOnboardingCompleted,
    allFoodLogs,
    setAllFoodLogs,
    allActivityLogs,
    setAllActivityLogs,
    signup,
    login,
    logout,
    fetchUser,
    fetchFoodLogs,
    fetchActivityLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppContext;
