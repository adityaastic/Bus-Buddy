import {View, Text, Image, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useMutation} from '@tanstack/react-query';
import {loginWithGoogle} from '../service/requests/auth';
import {resetAndNavigate} from '../utils/NavigationUtils';
import apiClient from '../service/apiClient';

GoogleSignin.configure({
  webClientId: '747297565996-am7qiph44ps8nkjgkcnrommpboamlbga.apps.googleusercontent.com',
  offlineAccess: true,
});

const LoginScreen = () => {
  const [phone, setPhone] = useState('');

  const loginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: () => {
      resetAndNavigate('HomeScreen');
    },
    onError: error => {
   
    },
  });

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      loginMutation.mutate(response.data?.idToken as string);
    } catch (error) {
   
    }
  };

  const handlePhoneSubmit = () => {
    // Phone number OTP logic
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
  
           <Image
          source={require('../assets/images/cover.jpeg')}
          className="w-full h-64"
          resizeMode="cover"
        />

      <View className="flex-1 py-4 p-4 mt-4">
     

        <View className="p-4">
          <Text className="font-okra font-bold text-2xl text-center">
          Create Account or Sign in
          </Text>
        </View>

        <View className="my-4 mt-12  p-1 border border-black rounded-lg px-2 flex-row items-center">
          <Text className="font-okra m-0 font-bold text-xl">+91</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
            keyboardType="number-pad"
            placeholder="Enter 10 digit phone number"
            className="font-okra h-11 flex-1 ml-2"
          />
        </View>

        {/* Let's Go Button */}
        <TouchableOpacity
          onPress={handlePhoneSubmit}
          className="bg-blue-500 py-3 rounded-lg mt-4">
          <Text className="text-white font-okra font-semibold text-center text-lg">
            Let's Go
          </Text>
        </TouchableOpacity>

        <View className="flex items-center justify-center flex-row gap-4 my-6">
          <TouchableOpacity
            onPress={handleGoogleSignin}
            className="border border-gray-300 p-2 rounded-lg">
            <Image
              source={require('../assets/images/google.png')}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity className="border border-gray-300 p-2 rounded-lg">
            <Image
              source={require('../assets/images/apple.png')}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Text className="font-okra text-sm text-center text-gray-600 px-4">
          By Signing up you agree to our Terms and Conditions and Privacy
          Policy.
        </Text>
      </View>
  
    </SafeAreaView>
  );
};

export default LoginScreen;
