// import {MMKV} from 'react-native-mmkv';

// export const storage = new MMKV();

// export const setAccessToken = (token: string) => {
//   storage.set('accessToken', token);
// };

// export const getAccessToken = () => {
//   return storage.getString('accessToken');
// };

// export const removeAccessToken = () => {
//   storage.delete('accessToken');
// };

// export const setRefreshToken = (token: string) => {
//   storage.set('refreshToken', token);
// };

// export const getRefreshToken = () => {
//   return storage.getString('refreshToken');
// };

// export const removeRefreshToken = () => {
//   storage.delete('refreshToken');
// };

// // Additional utility functions for common storage operations
// export const setUserData = (userData: object) => {
//   storage.set('userData', JSON.stringify(userData));
// };

// export const getUserData = () => {
//   const userData = storage.getString('userData');
//   return userData ? JSON.parse(userData) : null;
// };

// export const removeUserData = () => {
//   storage.delete('userData');
// };

// export const clearAllData = () => {
//   storage.clearAll();
// };

// // Check if user is authenticated
// export const isAuthenticated = () => {
//   const accessToken = getAccessToken();
//   return !!accessToken;
// };



import { MMKV } from 'react-native-mmkv';

// Check if we're in remote debugging mode (JSI not available)
const isRemoteDebugging = typeof global.nativeCallSyncHook === 'undefined';

// Create a fallback storage for remote debugging
const createFallbackStorage = () => {
  console.warn('Using fallback storage (MMKV not available in remote debugging)');
  
  let memoryStorage: Record<string, string> = {};
  
  return {
    set: (key: string, value: string) => {
      memoryStorage[key] = value;
    },
    getString: (key: string) => memoryStorage[key] || null,
    delete: (key: string) => {
      delete memoryStorage[key];
    },
    clearAll: () => {
      memoryStorage = {};
    }
  };
};

// Use MMKV if available, otherwise use fallback
export const storage = isRemoteDebugging ? createFallbackStorage() : new MMKV();

// Token functions
export const setAccessToken = (token: string) => {
  storage.set('accessToken', token);
};

export const getAccessToken = () => {
  return storage.getString('accessToken');
};

export const removeAccessToken = () => {
  storage.delete('accessToken');
};

export const setRefreshToken = (token: string) => {
  storage.set('refreshToken', token);
};

export const getRefreshToken = () => {
  return storage.getString('refreshToken');
};

export const removeRefreshToken = () => {
  storage.delete('refreshToken');
};

// User data functions
export const setUserData = (userData: object) => {
  storage.set('userData', JSON.stringify(userData));
};

export const getUserData = () => {
  const userData = storage.getString('userData');
  return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
  storage.delete('userData');
};

export const clearAllData = () => {
  storage.clearAll();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  return !!accessToken;
};