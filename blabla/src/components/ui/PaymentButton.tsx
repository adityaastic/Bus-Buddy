import React from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserGroupIcon } from "react-native-heroicons/solid";

interface PaymentButtonProps {
  selectedSeats: number[];
  pricePerSeat: number;
  onPay: () => void;
  loading?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  selectedSeats, 
  pricePerSeat, 
  onPay, 
  loading = false 
}) => {
  const seatCount = selectedSeats.length;
  const totalAmount = seatCount * pricePerSeat;
  const originalTotal = Math.floor(totalAmount * 1.12); // Simulate original price with 12% markup

  return (
    <SafeAreaView
      edges={["bottom"]}
      className="absolute bottom-0 left-0 right-0 px-4 py-4 shadow-gray-500 rounded-2xl border-t border-gray-200 bg-gray-50"
    >
      {/* Amount Section */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-2xl font-bold text-gray-800">Amount</Text>
          <View className="flex-row items-center">
            <Text className="text-base text-gray-400 line-through mr-2">
              ₹{originalTotal}
            </Text>
            <Text className="text-2xl font-bold text-gray-900">₹{totalAmount}</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-md mt-0 text-gray-500">Tax Included</Text>
          <View className="flex-row items-center">
            <UserGroupIcon size={18} color="gray" />
            <Text className="text-md text-green-600 font-medium ml-1">
              {seatCount} P
            </Text>
          </View>
        </View>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        className={`
          rounded-lg py-4 px-6 flex-row justify-center items-center
          ${seatCount > 0 && !loading ? "bg-red-600" : "bg-gray-400"}
        `}
        disabled={seatCount === 0 || loading}
        onPress={onPay}
        activeOpacity={0.8}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color="white" />
            <Text className="text-center text-white text-lg font-bold ml-2">
              Processing...
            </Text>
          </>
        ) : (
          <Text className="text-center text-white text-lg font-bold">
            {seatCount > 0 ? "Pay Now!" : "Select Seats to Continue"}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PaymentButton;
