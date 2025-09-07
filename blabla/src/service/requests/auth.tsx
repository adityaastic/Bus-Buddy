import apiClient from "../apiClient";
import axios from "axios";
import { 
  removeAccessToken, 
  removeRefreshToken, 
  setAccessToken, 
  setRefreshToken, 
  getRefreshToken 
} from "../storage";
// <-- yaha apna helper function import karo
import { BASE_URL } from "../config"; // <-- apna backend base URL rakho
import { resetAndNavigate } from "../../utils/NavigationUtils";

export const loginWithGoogle = async (idToken: string) => {
  const { data } = await apiClient.post("/user/login", { id_token: idToken });


  setAccessToken(data?.accessToken);
  setRefreshToken(data?.refreshToken);

  return data?.user;
};

export const logout = async () => {
  removeAccessToken();
  removeRefreshToken();
  resetAndNavigate("LoginScreen");
};

export const refresh_tokens = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const { data } = await axios.post(`${BASE_URL}/user/refresh`, {
      refreshToken,
    });

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    } else {
      throw new Error("Invalid refresh response");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    return false;
  }
};
