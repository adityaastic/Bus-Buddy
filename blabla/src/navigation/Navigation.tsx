import React, {FC} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import { navigationRef } from '../utils/NavigationUtils';
import HomeScreen from '../screens/HomeScreen';
import BusListScreen from '../screens/BusListScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';

const Stack = createNativeStackNavigator();

const Navigation: FC = () => {
  return (
    <NavigationContainer  ref={navigationRef}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen 
          name="SplashScreen" 
          component={SplashScreen} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{headerShown: false}}
        />

        <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{headerShown: false}}
        />
         <Stack.Screen 
          name="BusListScreen" 
          component={BusListScreen} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="SeatSelectionScreen" 
          component={SeatSelectionScreen} 
          options={{headerShown: false}}
        />
         

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;