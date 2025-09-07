import { View, Text, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { navigate } from '../../utils/NavigationUtils';
import LinearGradient from 'react-native-linear-gradient';
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import DatePickerModal from '../ui/DatePickerModal';
import LocationPickerModal from '../ui/LocationPickerModal';

const Search = () => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locationType, setLocationType] = useState<'from' | 'to'>('from');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);

  const handleLocationSelect = (location: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setFrom(location);
      if (location === to) {
        setTo(null);
      }
    } else {
      setTo(location);
    }
  };

  const handleSearchBuses = () => {
    if (!from || !to) {
      Alert.alert('Missing Information', 'Please select both From and To locations.');
      return;
    }
    if (from === to) {
      Alert.alert('Invalid Selection', 'Departure and destination cannot be the same.');
      return;
    }
    navigate('BusListScreen', { item: { from, to, date } });
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')} ${date.getFullYear()}`;
  };

  return (
    <View className="rounded-b-3xl overflow-hidden shadow-lg">
      <LinearGradient
        colors={['#FFF9FF', '#90CAF9', '#64B5F6', '#42A5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.3, 0.4, 1]}
      >
        <View className="p-4">
          {/* Search Container */}
          <View className="bg-white rounded-2xl border border-black-700 shadow-md">
            {/* FROM */}
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-500"
              onPress={() => {
                setLocationType('from');
                setShowLocationPicker(true);
              }}
            >
              <Image
                source={require('../../assets/images/bus.png')}
                style={{ width: 24, height: 24, }}
                resizeMode="contain"
              />
              <View className="ml-3 flex-1">
                <Text className="text-lg text-gray-800 font-medium">From</Text>
                <Text className={`text-base ${from ? 'text-black font-bold' : 'text-gray-400'}`}>
                  {from || 'Select departure'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* TO */}
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-500"
              onPress={() => {
                setLocationType('to');
                setShowLocationPicker(true);
              }}
            >
              <Image
                source={require('../../assets/images/bus.png')}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <View className="ml-3 flex-1">
                <Text className="text-lg text-gray-800 font-medium">To</Text>
                <Text className={`text-base ${to ? 'text-black font-bold' : 'text-gray-400'}`}>
                  {to || 'Select destination'}
                </Text>
              </View>
            </TouchableOpacity>

{/* DATE SECTION */}
<View className="p-4">
  <View className="flex-row items-center justify-between">
    {/* Today/Tomorrow buttons on the left */}
    <View className="flex-row">
      <TouchableOpacity
        className={`px-3 py-2 rounded-lg mr-4 ${
          date.toDateString() === new Date().toDateString() 
            ? 'bg-orange-400' 
            : 'bg-orange-200'
        }`}
        onPress={() => setDate(new Date())}
      >
        <Text className="font-semibold text-md text-black">
          Today
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`px-4 py-2 rounded-lg ${
          date.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()
            ? 'bg-orange-400' 
            : 'bg-orange-200'
        }`}
        onPress={() => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          setDate(tomorrow);
        }}
      >
        <Text className="font-semibold text-md text-black">
          Tomorrow
        </Text>
      </TouchableOpacity>
    </View>

    {/* Date display with calendar icon on the right */}
    <TouchableOpacity
      className="flex-row items-center"
      onPress={() => setShowDatePicker(true)}
    >
      <View className="mr-2 items-end">
        <Text className="text-xs text-gray-500 font-medium">Date of Journey</Text>
        <Text className="text-base font-bold text-black">
          {formatDate(date)}
        </Text>
      </View>
      <CalendarDaysIcon color="#666" size={24} />
    </TouchableOpacity>
  </View>
</View>


          </View>

          {/* SEARCH BUTTON */}
          <TouchableOpacity
            onPress={handleSearchBuses}
            className="bg-red-500 p-4 rounded-xl mt-4 flex-row items-center justify-center shadow-md"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <MagnifyingGlassIcon color={'#fff'} size={20} />
            <Text className="ml-2 font-bold text-white text-base">
              Search Buses
            </Text>
          </TouchableOpacity>

          {/* PROMOTIONAL IMAGE */}
          <View className="mt-4 rounded-xl overflow-hidden shadow-md">
            <Image
              source={require('../../assets/images/sidebus.jpg')}
              className="h-32 w-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 flex-row items-center justify-between px-4">
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold shadow-lg">
                  Road
                </Text>
                <Text className="text-white text-2xl font-bold shadow-lg">
                  Trip
                </Text>
              </View>
              <Image
                source={require('../../assets/images/bus.png')}
                style={{ width: 80, height: 80, tintColor: 'rgba(255,255,255,0.9)' }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onConfirm={setDate}
          selectedDate={date}
        />
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPickerModal
          visible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelect={handleLocationSelect}
          type={locationType}
          fromLocation={from || undefined}
          toLocation={to || undefined}
        />
      )}
    </View>
  );
};

export default Search;