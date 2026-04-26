import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверяем пользователя при старте приложения
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const becomeSeller = async () => {
    await api.post("/users/become-seller");

    setUser(prev => ({
      ...prev,
      role: "seller"
    }));
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, becomeSeller }}>
      {children}
    </AuthContext.Provider>
  );
};