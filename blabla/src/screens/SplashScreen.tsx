import { View, Text, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { getAccessToken, getRefreshToken } from '../service/storage';
import {jwtDecode} from 'jwt-decode'; // 
import { resetAndNavigate } from '../utils/NavigationUtils';
import { refresh_tokens } from '../service/requests/auth';

interface DecodedToken {
  exp: number; // Expiration time as a Unix timestamp
}

const SplashScreen = () => {
  const tokenCheck = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken() as string;

      

    if (accessToken) {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);
      const currentTime = Date.now() / 1000;

      // 🔹 Refresh token expired
      if (decodedRefreshToken?.exp < currentTime) {
        Alert.alert('Session Expired, please login again');
        resetAndNavigate('LoginScreen');
        return;
      }

      // 🔹 Access token expired → try refresh
      if (decodedAccessToken?.exp < currentTime) {
        const refreshed = await refresh_tokens();
        if (!refreshed) {
          Alert.alert('There was an error');
          resetAndNavigate('LoginScreen');
          return;
        }
      }

    

      // 🔹 Valid token → go to Home
      resetAndNavigate('HomeScreen');
      return;
    }

    // 🔹 No access token → go to Login
    resetAndNavigate('LoginScreen');
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      tokenCheck();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View className="flex-1 justify-center bg-white items-center">
      <Image
        source={require('../assets/images/logo_t.png')}
        className="h-[30%] w-[60%]"
        resizeMode="contain"
      />
      <Text className="text-xl font-bold text-gray-800 mt-4">Bus-Buddy</Text>
      <Text className="text-sm text-gray-500 mt-2">Your Journey, Our Priority</Text>
    </View>
  );
};

export default SplashScreen;
