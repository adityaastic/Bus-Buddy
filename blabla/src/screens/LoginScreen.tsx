import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginWithPhone } from '../service/requests/auth';
import { resetAndNavigate } from '../utils/NavigationUtils';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const phoneLoginMutation = useMutation({
    mutationFn: loginWithPhone,
    onSuccess: () => {
      resetAndNavigate('HomeScreen');
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to login. Please try again.';
      Alert.alert('Login Failed', msg);
    },
  });

  const handlePhoneSubmit = () => {
    const cleanPhone = phone.trim();
    if (cleanPhone.length !== 10 || isNaN(Number(cleanPhone))) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number');
      return;
    }
    setOtp('1234'); // Pre-fill with default OTP 1234
    setStep('otp');
  };

  const handleOtpVerify = () => {
    const cleanPhone = phone.trim();
    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      Alert.alert('OTP Required', 'Please enter the 4-digit OTP (1234)');
      return;
    }

    if (cleanOtp !== '1234') {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP: 1234');
      return;
    }

    phoneLoginMutation.mutate({ phone: cleanPhone, otp: cleanOtp });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Image
        source={require('../assets/images/cover.jpeg')}
        className="w-full h-64"
        resizeMode="cover"
      />

      <View className="flex-1 py-4 p-4 mt-4">
        <View className="p-2">
          <Text className="font-okra font-bold text-2xl text-center">
            {step === 'phone' ? 'Create Account or Sign in' : 'Verify Mobile OTP'}
          </Text>
          <Text className="text-gray-500 text-center mt-1 font-okra">
            {step === 'phone'
              ? 'Enter your mobile number to get started'
              : `Enter 4-digit OTP sent to +91 ${phone}`}
          </Text>
        </View>

        {step === 'phone' ? (
          <>
            <View className="my-4 mt-8 p-1 border border-black rounded-lg px-2 flex-row items-center">
              <Text className="font-okra m-0 font-bold text-xl">+91</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
                keyboardType="number-pad"
                placeholder="Enter 10 digit phone number"
                className="font-okra h-11 flex-1 ml-2 text-base text-black"
              />
            </View>

            {/* Let's Go Button */}
            <TouchableOpacity
              onPress={handlePhoneSubmit}
              disabled={phoneLoginMutation.isPending}
              className="bg-blue-600 py-3.5 rounded-lg mt-4 shadow-sm">
              <Text className="text-white font-okra font-bold text-center text-lg">
                Let's Go
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View className="my-4 mt-6">
              <Text className="font-okra text-gray-700 font-medium mb-1">
                Enter OTP (Default: 1234)
              </Text>
              <View className="p-1 border border-blue-500 rounded-lg px-3 flex-row items-center bg-blue-50">
                <TextInput
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={4}
                  keyboardType="number-pad"
                  placeholder="1234"
                  className="font-okra h-12 flex-1 text-center font-bold text-2xl tracking-widest text-black"
                  autoFocus
                />
              </View>
            </View>

            {/* Verify & Login Button */}
            <TouchableOpacity
              onPress={handleOtpVerify}
              disabled={phoneLoginMutation.isPending}
              className="bg-blue-600 py-3.5 rounded-lg mt-2 shadow-sm flex-row justify-center items-center">
              {phoneLoginMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-okra font-bold text-center text-lg">
                  Verify & Login
                </Text>
              )}
            </TouchableOpacity>

            {/* Change Number Button */}
            <TouchableOpacity
              onPress={() => setStep('phone')}
              className="py-2.5 mt-3">
              <Text className="text-blue-600 font-okra font-semibold text-center text-base">
                ← Change Phone Number
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View className="mt-auto mb-4">
          <Text className="font-okra text-xs text-center text-gray-400 px-4">
            By signing up you agree to our Terms and Conditions and Privacy Policy.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

