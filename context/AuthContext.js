import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { loginUser, registerUser, updateUser } from "../services/api";

const STORAGE_KEY = "@ksk_beveren_auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Lets someone past the Start screen without an account. Resets on logout
  // and on a fresh app start, so Start is shown again next time.
  const [isGuest, setIsGuest] = useState(false);

  // Restore a saved session when the app starts.
  useEffect(() => {
    async function restoreSession() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (raw) {
          const saved = JSON.parse(raw);
          setUser(saved.user ?? null);
          setToken(saved.token ?? null);
        }
      } catch (error) {
        console.warn("Kon sessie niet herstellen:", error.message);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function persist(nextUser, nextToken) {
    if (nextUser && nextToken) {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: nextUser, token: nextToken })
      );
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }

  async function login(email, password) {
    const data = await loginUser(email, password);

    setUser(data.user);
    setToken(data.token);
    await persist(data.user, data.token);

    return data.user;
  }

  async function register(username, email, password) {
    await registerUser(username, email, password);
    // De backend geeft geen token bij registreren, dus meteen inloggen.
    return login(email, password);
  }

  async function logout() {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    await persist(null, null);
  }

  function continueAsGuest() {
    setIsGuest(true);
  }

  async function updateProfile(fields) {
    if (!user) {
      throw new Error("Je bent niet ingelogd.");
    }

    const updatedUser = await updateUser(
      user.id,
      fields.username ?? user.username,
      fields.profileImage ?? user.profileImage,
      fields.favoritePlayerId ?? user.favoritePlayerId
    );

    const normalizedUser = {
      ...user,
      ...updatedUser,
      id: updatedUser._id ?? updatedUser.id ?? user.id,
    };

    setUser(normalizedUser);
    await persist(normalizedUser, token);

    return normalizedUser;
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isGuest,
      isAuthenticated: Boolean(user && token),
      canBrowse: Boolean(user && token) || isGuest,
      login,
      register,
      logout,
      continueAsGuest,
      updateProfile,
    }),
    [user, token, isLoading, isGuest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth moet binnen een AuthProvider gebruikt worden.");
  }

  return context;
}