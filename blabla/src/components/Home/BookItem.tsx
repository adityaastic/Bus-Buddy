// import { View, Text, Image, TouchableOpacity } from 'react-native';
// import React, { useState } from 'react';
// import TicketModal from '../ui/TicketModal';
// import { UserGroupIcon } from 'react-native-heroicons/solid';
//  // <-- make sure this file exists

// const BookItem = ({ item }: any) => {
//   const [ticketVisible, setTicketVisible] = useState(false);

//   return (
//     <View className="bg-white p-4 rounded-lg mb-3">
//       {/* Top Row */}
//       <View className="flex-row justify-between items-center">
//         <Image
//           source={require('../../assets/images/sidebus_png.png')}
//           className="h-8 w-8"
//           resizeMode="contain"
//         />
//         <Text className="text-gray-800">{item?.status}</Text>
//       </View>

//       {/* Bus Route */}
//       <Text className="text-lg font-bold mt-2">
//         {item?.bus?.from} → {item?.bus?.to}
//       </Text>

//       {/* Date & Type */}
//       <Text className="text-gray-600">{new Date(item?.date)?.toDateString()}</Text>
//       <Text className="text-gray-600">{item?.bus?.type}</Text>

//       {/* Seat Numbers */}
//       <View className="flex-row items-center mt-2">
//         <UserGroupIcon size={18} color="gray" />
//         <Text className="ml-2 text-gray-600">
//           {item?.seatNumbers?.toString()}
//         </Text>
//       </View>

//       {/* Cancelled & Refund Info */}
//       {item?.status === 'Cancelled' && (
//         <Text className="text-green-600 font-bold mt-2">
//           Refund completed
//         </Text>
//       )}

//       {/* See Ticket Button */}
//       <TouchableOpacity
//         onPress={() => setTicketVisible(true)}
//         className="mt-2 bg-red-600 py-2 px-4 rounded-lg"
//       >
//         <Text className="text-white text-center font-bold">See Ticket</Text>
//       </TouchableOpacity>

//       {/* Ticket Modal */}
//       {ticketVisible && (
//         <TicketModal
//           bookingInfo={{
//             from: item?.bus?.from,
//             to: item?.bus?.to,
//             departureTime: new Date(item?.bus?.departureTime).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             }),
//             arrivalTime: new Date(item?.bus?.arrivalTime).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             }),
//             date: new Date(item?.bus?.departureTime).toDateString(),
//             company: item?.bus?.company,
//             busType: item?.bus?.busType,
//             seats: item?.seatNumbers,
//             ticketNumber: item?._id,
//             pnr: item?.pnr,
//             fare: item?.total_fare,
//           }}
//           onClose={() => setTicketVisible(false)}
//           visible={ticketVisible}
//         />
//       )}
//     </View>
//   );
// };

// export default BookItem;


import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import TicketModal from '../ui/TicketModal';
import { UserGroupIcon, ClockIcon, MapPinIcon } from 'react-native-heroicons/solid';

const BookItem = ({ item }: any) => {
  const [ticketVisible, setTicketVisible] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'pending':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100';
      case 'cancelled':
        return 'bg-red-100';
      case 'pending':
        return 'bg-amber-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <View className="bg-white p-5 rounded-2xl mb-4 shadow-lg border border-gray-100">
      {/* Header with Company and Status */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Image
            source={require('../../assets/images/sidebus_png.png')}
            className="h-10 w-10 mr-3"
            resizeMode="contain"
          />
          <View>
            <Text className="text-black font-bold text-base">{item?.bus?.company}</Text>
            <Text className="text-gray-500 text-xs">{item?.bus?.busType}</Text>
          </View>
        </View>
        
        <View className={`px-3 py-1 rounded-full ${getStatusBgColor(item?.status)}`}>
          <Text className={`text-xs font-semibold ${getStatusColor(item?.status)}`}>
            {item?.status}
          </Text>
        </View>
      </View>

      {/* Route Information */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-black mb-2">
          {item?.bus?.from} → {item?.bus?.to}
        </Text>
        
        <View className="flex-row items-center mb-2">
          <ClockIcon size={16} color="#666" />
          <Text className="ml-2 text-gray-600 text-sm">
            {new Date(item?.bus?.departureTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })} - {new Date(item?.bus?.arrivalTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <MapPinIcon size={16} color="#666" />
          <Text className="ml-2 text-gray-600 text-sm">
            {new Date(item?.date)?.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="border-b border-gray-200 mb-4" />

      {/* Seat and Fare Information */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <UserGroupIcon size={18} color="#10B981" />
          <Text className="ml-2 text-black font-medium">
            Seats: {item?.seatNumbers?.join(', ')}
          </Text>
        </View>
        
        <View className="items-end">
          <Text className="text-black font-bold text-lg">
            ₹{item?.total_fare}
          </Text>
          <Text className="text-gray-500 text-xs">Total Fare</Text>
        </View>
      </View>

      {/* Cancelled & Refund Info */}
      {item?.status === 'Cancelled' && (
        <View className="bg-green-50 p-3 rounded-lg mb-4 border border-green-200">
          <Text className="text-green-800 font-semibold text-center">
            ✅ Refund completed successfully
          </Text>
        </View>
      )}

      {/* See Ticket Button */}
      <TouchableOpacity
        onPress={() => setTicketVisible(true)}
        className="bg-green-600 py-3 px-4 rounded-xl shadow-md"
      >
        <Text className="text-white text-center font-bold text-base">
          View Ticket
        </Text>
      </TouchableOpacity>

      {/* Ticket Modal */}
      <TicketModal
        visible={ticketVisible}
        onClose={() => setTicketVisible(false)}
        bookingInfo={{
          from: item?.bus?.from,
          to: item?.bus?.to,
          departureTime: new Date(item?.bus?.departureTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          arrivalTime: new Date(item?.bus?.arrivalTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: new Date(item?.bus?.departureTime).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          company: item?.bus?.company,
          busType: item?.bus?.busType,
          seats: item?.seatNumbers,
          ticketNumber: item?._id,
          pnr: item?.pnr,
          fare: item?.total_fare,
        }}
      />
    </View>
  );
};

export default BookItem;