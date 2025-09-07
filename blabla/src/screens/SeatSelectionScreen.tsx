import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchBusDetails, bookTicket } from "../service/requests/bus";
import { ArrowLeftIcon, StarIcon } from "lucide-react-native";
import { resetAndNavigate, goBack } from "../utils/NavigationUtils";
import PaymentButton from "../components/ui/PaymentButton";
import Seat from "../components/ui/Seat";
import TicketModal from "../components/ui/TicketModal";

const SeatSelectionScreen = () => {
  const [ticketVisible, setTicketVisible] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const route = useRoute();
  const { busId } = route.params as { busId: string };

  const {
    data: busInfo,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["busDetails", busId],
    queryFn: () => fetchBusDetails(busId),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [busId])
  );

  const bookTicketMutation = useMutation({
    mutationFn: (ticketData: {
      busId: string;
      date: string;
      seatNumbers: number[];
    }) => bookTicket(ticketData),
    onSuccess: (data) => {
   
      setTicketVisible(true);
    },
    onError: (error: any) => {
  
      Alert.alert("Failed to book ticket. Please try again.");
    },
  });

  const handleSeatSelection = (seat_id: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seat_id)
        ? prev.filter((id) => id !== seat_id)
        : [...prev, seat_id]
    );
  };

  const handleOnPay = () => {
    if (selectedSeats.length === 0) {
      Alert.alert("Please select at least one seat.");
      return;
    }
    if (!busInfo) return;

    bookTicketMutation.mutate({
      busId,
      date: new Date(busInfo.departureTime).toISOString(),
      seatNumbers: selectedSeats,
    });
  };

  // Function to organize seats into rows (4 seats per row with aisle)
  const organizeSeatsIntoRows = (seats: any[]) => {
    if (!seats || !Array.isArray(seats)) return [];
    
    const rows = [];
    const seatsPerRow = 4;
    
    for (let i = 0; i < seats.length; i += seatsPerRow) {
      const rowSeats = seats.slice(i, i + seatsPerRow);
      
      if (rowSeats.length >= 2) {
        rowSeats.splice(2, 0, { 
          type: 'path', 
          seat_id: -1,
          booked: true,
          isAisle: true 
        });
      }
      
      rows.push({
        rowId: Math.floor(i / seatsPerRow) + 1,
        seats: rowSeats
      });
    }
    
    return rows;
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="mt-2 text-gray-600">Loading bus details...</Text>
      </View>
    );
  }

  if (isError || !busInfo) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-red-500 text-center mb-4">Error loading bus details.</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => goBack()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const organizedSeats = organizeSeatsIntoRows(busInfo.seats || []);
  const availableSeats = busInfo.seats?.filter((seat: any) => !seat.booked)?.length || 0;

  return (
    <View className="flex-1 bg-green-200" style={{ backgroundColor: '#dcfce7' }}>
      <SafeAreaView />

      {/* Header */}
      <View className="bg-white px-4 py-4 flex-row items-center border-b border-gray-100 shadow-sm">
        <TouchableOpacity onPress={() => goBack()}>
          <ArrowLeftIcon size={24} color="#000" />
        </TouchableOpacity>
        <View className="ml-4 flex-1">
          <Text className="text-xl font-bold text-gray-900">Seat Selection</Text>
          <Text className="text-sm  text-gray-600 mt-0.5">
            {busInfo.from} → {busInfo.to}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            {new Date(busInfo.departureTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            | {new Date(busInfo.departureTime).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
        className="flex-1"
      >
        {/* Seat Layout */}
        <View className="bg-teal-50 p-4 mb-0">
          <Seat
            selectedSeats={selectedSeats}
            seats={organizedSeats}
            onSeatSelect={handleSeatSelection}
          />
        </View>

<View className="bg-white mx-4 rounded-2xl p-5 shadow-xl border border-gray-100 mb-5">
  {/* Header with company and rating */}
  <View className="flex-row justify-between items-start mb-4">
    <View className="flex-1">
      <Text className="text-2xl font-bold text-black mb-1">{busInfo.company}</Text>
      <Text className="text-sm text-gray-600 font-medium">{busInfo.busType}</Text>
    </View>
    {busInfo.rating && (
      <View className="flex-row items-center bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
        <StarIcon size={16} color="#F59E0B" fill="#F59E0B" />
        <Text className="ml-1.5 text-yellow-800 text-sm font-bold">
          {busInfo.rating}
        </Text>
        <Text className="ml-1 text-yellow-600 text-xs">
          ({busInfo.totalReviews || 0})
        </Text>
      </View>
    )}
  </View>

  {/* Timeline with departure and arrival */}
  <View className="flex-row justify-between items-center py-4 border-t border-b border-gray-100 mb-4">
    <View className="items-start">
      <Text className="text-2xl font-black text-black">
        {new Date(busInfo.departureTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text className="text-xs text-gray-500 mt-1 font-medium">DEPARTURE</Text>
    </View>

    <View className="items-center flex-1 mx-4">
      <Text className="text-sm text-gray-700 font-semibold mb-1">{busInfo.duration}</Text>
      <View className="w-full relative my-2">
        <View className="w-full h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <View className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-gray-400 border-2 border-white" />
        <View className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-gray-400 border-2 border-white" />
      </View>
      <Text className="text-xs text-gray-500 font-medium">NON-STOP</Text>
    </View>

    <View className="items-end">
      <Text className="text-2xl font-black text-black">
        {new Date(busInfo.arrivalTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text className="text-xs text-gray-500 mt-1 font-medium">ARRIVAL</Text>
    </View>
  </View>

  {/* Pricing and availability */}
  <View className="flex-row justify-between items-center mb-4">
    <View className="flex-row items-center bg-green-100 px-4 py-2 rounded-lg border border-green-200">
      <View className="w-3 h-3 bg-green-500 rounded-full mr-2 border-2 border-green-300" />
      <Text className="text-green-800 text-sm font-bold">
        {availableSeats} Seats Available
      </Text>
    </View>

    <View className="flex-row items-end">
      {busInfo.originalPrice && busInfo.originalPrice !== busInfo.price && (
        <Text className="text-gray-400 line-through text-base mr-3 font-medium">
          ₹{busInfo.originalPrice}
        </Text>
      )}
      <View className="items-end">
        <Text className="text-2xl font-black text-green-600">
          ₹{busInfo.price}
        </Text>
        <Text className="text-xs text-gray-500 font-medium">per seat</Text>
      </View>
    </View>
  </View>

  {/* Premium Amenities Section */}
  <View className="pt-4 border-t border-gray-100">
    <Text className="text-base font-bold text-black mb-3">Premium Amenities</Text>
    <View className="flex-row flex-wrap justify-between">
      <View className="flex-row items-center w-1/2 mb-3">
        <Text className="text-blue-600 text-sm font-semibold mr-2">❄️</Text>
        <Text className="text-black text-sm">AC Seating</Text>
      </View>
      <View className="flex-row items-center w-1/2 mb-3">
        <Text className="text-green-600 text-sm font-semibold mr-2">⚡</Text>
        <Text className="text-black text-sm">Charging Port</Text>
      </View>
      <View className="flex-row items-center w-1/2 mb-3">
        <Text className="text-purple-600 text-sm font-semibold mr-2">📶</Text>
        <Text className="text-black text-sm">WiFi</Text>
      </View>
      <View className="flex-row items-center w-1/2 mb-3">
        <Text className="text-yellow-600 text-sm font-semibold mr-2">💺</Text>
        <Text className="text-black text-sm">Spacious</Text>
      </View>
    </View>
  </View>

  {/* Premium badge */}
  <View className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-1.5 rounded-full shadow-lg">
    <Text className="text-white text-xs font-bold tracking-wider">PREMIUM</Text>
  </View>
</View>


        
      </ScrollView>

      {/* Payment Button */}
      <PaymentButton
        selectedSeats={selectedSeats}
        pricePerSeat={busInfo.price}
        onPay={handleOnPay}
        loading={bookTicketMutation.isPending}
      />

      {/* Ticket Modal */}
      <TicketModal
        visible={ticketVisible}
        onClose={() => {
          resetAndNavigate("HomeScreen");
          setTicketVisible(false);
        }}
        bookingInfo={{
          from: busInfo.from,
          to: busInfo.to,
          departureTime: new Date(busInfo.departureTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          arrivalTime: new Date(busInfo.arrivalTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(busInfo.departureTime).toDateString(),
          company: busInfo.company,
          busType: busInfo.busType,
          seats: selectedSeats,
          ticketNumber: bookTicketMutation.data?._id || "N/A",
          pnr: bookTicketMutation.data?.pnr || "N/A",
          fare: (busInfo.price * selectedSeats.length).toString(),
        }}
      />
    </View>
  );
};

export default SeatSelectionScreen;