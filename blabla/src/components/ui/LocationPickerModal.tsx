import { View, Text, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native';
import React from 'react';
import { locations } from '../../utils/dummyData';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: string, type: 'from' | 'to') => void;
  type: 'from' | 'to';
  fromLocation: string;
  toLocation: string;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  type,
  fromLocation,
  toLocation,
}) => {
  const [search, setSearch] = React.useState('');

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(search.toLowerCase())
  );

  return (
  // In LocationPickerModal component, update the structure:
<Modal transparent visible={visible} animationType="slide">
  <View className="flex-1 justify-end bg-black/50">
    <View className="h-5/6 bg-white rounded-t-3xl overflow-hidden">
      <SafeAreaView className="bg-white">
        <View className="p-4">
          {/* Header with close button */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">
              Select {type === 'from' ? 'Departure' : 'Destination'} City
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-lg font-bold text-blue-500">Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <TextInput
            className="border border-gray-400 rounded-md mb-4 px-3 py-2"
            placeholder="Search City"
            value={search}
            onChangeText={setSearch}
          />

          {/* List */}
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              // Prevent selecting same city for TO if already chosen as FROM
              if (type === 'to' && item === fromLocation) {
                return (
                  <View className="p-3 border-b border-gray-300">
                    <Text className="text-md text-gray-400">{item} (Already selected as From)</Text>
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item, type);
                    onClose();
                  }}
                  className="p-3 border-b border-gray-300"
                >
                  <Text
                    className={`text-md ${
                      item === fromLocation || item === toLocation
                        ? 'text-gray-400'
                        : 'text-black'
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  </View>
</Modal>
  );
};

export default LocationPickerModal;
