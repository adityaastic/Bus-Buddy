import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, StarIcon } from "lucide-react-native";
import { fetchBuses } from "../service/requests/bus";

const BusListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route?.params as any;

  const { from, to, date } = params?.item || {};

  const {
    data: buses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["buses", from, to, date],
    queryFn: () => fetchBuses(from, to, date),
    enabled: !!from && !!to && !!date,
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white mb-3 p-4 rounded-lg border border-gray-200 shadow-sm mx-4"
      onPress={() =>
        navigation.navigate("SeatSelectionScreen" as never, {
          busId: item.busId,
          busData: item,
        } as never)
      }
    >
      {/* Top Row with Company and Rating */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Image
            source={require("../assets/images/sidebus_png.png")}
            className="h-6 w-8"
            resizeMode="contain"
          />
          <View className="ml-2">
            <Text className="text-lg font-bold text-gray-900">
              {item.company}
            </Text>
          </View>
        </View>
        
        {item.rating && (
          <View className="flex-row items-center bg-amber-100 px-2 py-1 rounded-full">
            <StarIcon size={14} color="#f59e0b" fill="#f59e0b" />
            <Text className="text-xs font-semibold text-gray-800 ml-1">
              {item.rating}
            </Text>
          </View>
        )}
      </View>

      <Text className="text-sm text-gray-600 mb-2">{item.busType}</Text>

      {/* Badges */}
      {item.badges && item.badges.length > 0 && (
        <View className="flex-row flex-wrap mb-3">
          {item.badges.map((badge: string, index: number) => (
            <View
              key={index}
              className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-1"
            >
              <Text className="text-xs font-semibold text-blue-800">
                {badge}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Departure & Arrival */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">
            {new Date(item.departureTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </Text>
          <Text className="text-xs text-gray-600 font-medium mt-1">Departure</Text>
        </View>
        
        <View className="items-center mx-3">
          <Text className="text-xs text-gray-500 font-semibold">{item.duration}</Text>
          <View className="h-px w-16 bg-gray-300 my-1" />
          <Text className="text-xs text-gray-500">Direct</Text>
        </View>
        
        <View className="flex-1 items-end">
          <Text className="text-xl font-bold text-gray-900">
            {new Date(item.arrivalTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </Text>
          <Text className="text-xs text-gray-600 font-medium mt-1">Arrival</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-200 mb-2" />

      {/* Price & Availability */}
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-bold text-green-700">
            ₹{item.price}
          </Text>
          {item.originalPrice && (
            <Text className="text-xs text-gray-500 line-through mt-1">
              ₹{item.originalPrice}
            </Text>
          )}
        </View>
        
        <View className="bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-xs font-semibold text-green-800">
            {item.seats?.filter((seat: any) => !seat.booked)?.length || 0}{" "}
            Seats
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView />
      {/* Header */}
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200 shadow-sm">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-1"
        >
          <ArrowLeftIcon size={22} color={"#000"} />
        </TouchableOpacity>
        <View className="ml-3">
          <Text className="text-lg font-bold text-gray-900">
            {from} - {to}
          </Text>
          <Text className="text-xs text-gray-600">
            {date ? new Date(date).toDateString() : ""}
          </Text>
        </View>
      </View>

      {/* Results Count */}
      {!isLoading && !error && buses?.length > 0 && (
        <View className="px-4 py-2 bg-white border-b border-gray-200">
          <Text className="text-sm font-semibold text-gray-800">
            {buses.length} bus{buses.length !== 1 ? 'es' : ''} found
          </Text>
        </View>
      )}

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-2 text-sm text-gray-700">Loading buses...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-600 font-bold text-base text-center">
            Failed to load buses
          </Text>
          <Text className="text-gray-600 mt-1 text-xs text-center">
            Please check your connection and try again
          </Text>
        </View>
      )}

      {/* Empty State */}
      {!error && !isLoading && buses?.length === 0 && (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-700 font-bold text-base text-center">
            No buses found
          </Text>
          <Text className="text-gray-500 mt-1 text-xs text-center">
            Try different search parameters
          </Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={buses}
        keyExtractor={(item) => item.busId.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BusListScreen;