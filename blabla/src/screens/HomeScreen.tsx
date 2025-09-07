  // import { View, Text, SafeAreaView } from 'react-native';
  // import React from 'react';
  // import { UserCircleIcon } from 'react-native-heroicons/solid';
  // import { logout } from '../service/requests/auth';
  // import Booking from "../components/Home/Booking"

  // const HomeScreen = () => {
  //   return (
  //     <View className="flex-1 bg-white">
  //       <SafeAreaView />
  //       <View className="flex-row justify-between items-center px-4 py-2">
  //         <Text className="font-okra font-semibold text-3xl">Bus Tickets</Text>
  //         <UserCircleIcon color="red" size={38} onPress={logout} />
  //       </View>

      
  //     <Booking/>
  //     </View>
  //   );
  // };

  // export default HomeScreen;


  import { View, Text } from 'react-native';
import React from 'react';
import { UserCircleIcon } from 'react-native-heroicons/solid';
import { logout } from '../service/requests/auth';
import Booking from "../components/Home/Booking";
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-2">
        <Text className="font-semibold text-3xl">Bus Tickets</Text>
        <UserCircleIcon color="red" size={38} onPress={logout} />
      </View>

      <Booking />
    </SafeAreaView>
  );
};

export default HomeScreen;