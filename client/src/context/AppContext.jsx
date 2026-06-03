import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState([]);
  const [allActivityLogs, setAllActivityLogs] = useState([]);

  const signup = async (credentials) => {
    const newUser = {
      id: Date.now(),
      username: credentials.username,
      email: credentials.email,
      age: 0,
      weight: 0,
      height: 0,
      goal: "maintain",
    };
    if (newUser.age && newUser.weight && newUser.goal) {
      setOnboardingCompleted(true);
    }
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", "fake_token_" + Date.now());
    setUser(newUser);
    navigate("/onboarding");
  };

  const login = async (credentials) => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser({ ...savedUser, token: "fake_token_" + Date.now() });
      if (savedUser.age && savedUser.weight && savedUser.goal) {
        setOnboardingCompleted(true);
      }
      localStorage.setItem("token", "fake_token_" + Date.now());
      navigate("/dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingCompleted(false);
    navigate("/");
  };

  // token passed as parameter just like video
  const fetchUser = async (token) => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser({ ...savedUser, token }); // spread token into user like video
      if (savedUser.age && savedUser.weight && savedUser.goal) {
        setOnboardingCompleted(true);
      }
    }
    setIsUserFetched(true);
  };

  const fetchFoodLogs = async () => {
    const savedLogs = JSON.parse(localStorage.getItem("foodLogs")) || [];
    setAllFoodLogs(savedLogs);
  };

  const fetchActivityLogs = async () => {
    const savedLogs = JSON.parse(localStorage.getItem("activityLogs")) || [];
    setAllActivityLogs(savedLogs);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await fetchUser(token); // pass token like video
        await fetchFoodLogs();
        await fetchActivityLogs();
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
