import React, { FC } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { ArrowUpOnSquareIcon, XMarkIcon } from 'react-native-heroicons/solid';
import Svg, { Circle, Line, Path } from 'react-native-svg';

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  bookingInfo: any;
}

const TicketModal: FC<TicketModalProps> = ({ visible, onClose, bookingInfo }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        className="flex-1 justify-center items-center px-5"
        style={{ backgroundColor: 'rgba(42, 37, 38, 0.95)' }}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="bg-white mb-6 p-2 rounded-full shadow-md"
        >
          <XMarkIcon color="black" size={24} />
        </TouchableOpacity>

        {/* Ticket Card */}
        <View className="bg-white w-full rounded-2xl p-5 relative overflow-hidden">
          {/* Top Half Circles */}
          <View className="absolute -top-3 left-0 right-0 flex-row justify-between px-6">
            <View className="w-6 h-6 bg-[#2A2526] rounded-b-full" />
            <View className="w-6 h-6 bg-[#2A2526] rounded-b-full" />
            <View className="w-6 h-6 bg-[#2A2526] rounded-b-full" />
            <View className="w-6 h-6 bg-[#2A2526] rounded-b-full" />
          </View>

          {/* Bottom Half Circles */}
          <View className="absolute -bottom-3 left-0 right-0 flex-row justify-between px-6">
            <View className="w-6 h-6 bg-[#2A2526] rounded-t-full" />
            <View className="w-6 h-6 bg-[#2A2526] rounded-t-full" />
            <View className="w-6 h-6 bg-[#2A2526] rounded-t-full" />
            <View className="w-6 h-6 bg-[#2A2526] rounded-t-full" />
          </View>

          {/* Side Cut-outs - Left */}
          <View className="absolute left-0 top-1/2 -translate-y-1/2">
            <Svg height="50" width="14">
              <Circle cx="7" cy="25" r="7" fill="#2A2526" />
            </Svg>
          </View>
          
          {/* Side Cut-outs - Right */}
          <View className="absolute right-0 top-1/2 -translate-y-1/2">
            <Svg height="50" width="14">
              <Circle cx="7" cy="25" r="7" fill="#2A2526" />
            </Svg>
          </View>

          {/* Route Info */}
          <View className="mb-4 bg-gray-100 p-4 rounded-xl border border-gray-200">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-lg font-bold text-gray-800">
                {bookingInfo?.from} ➝ {bookingInfo?.to}
              </Text>
              <View className="bg-green-100 px-2 py-1 rounded">
                <Text className="text-green-800 text-xs font-semibold">Confirmed</Text>
              </View>
            </View>
            <Text className="text-gray-600 text-sm">
              {bookingInfo?.departureTime} - {bookingInfo?.arrivalTime}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              {bookingInfo?.date}
            </Text>
          </View>

          {/* Bus and Seat Info Container */}
          <View className="flex-row justify-between mb-4">
            {/* Bus Info */}
            <View className="flex-1 pr-2">
              <Text className="text-gray-700 font-semibold text-sm mb-1">Bus</Text>
              <Text className="text-gray-800 font-bold">{bookingInfo?.company}</Text>
              <Text className="text-gray-500 text-xs">{bookingInfo?.busType}</Text>
            </View>

            {/* Seat Info */}
            <View className="flex-1 pl-2">
              <Text className="text-gray-700 font-semibold text-sm mb-1">Seats</Text>
              <Text className="text-gray-800 font-bold">
                {Array.isArray(bookingInfo?.seats) ? bookingInfo.seats.join(', ') : bookingInfo?.seats}
              </Text>
              <Text className="text-gray-500 text-xs">
                {Array.isArray(bookingInfo?.seats) ? bookingInfo.seats.length : 1} seat{Array.isArray(bookingInfo?.seats) && bookingInfo.seats.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* Dashed Line */}
          <View className="my-4">
            <Svg height="2" width="100%">
              <Line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="#D1D5DB"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </Svg>
          </View>

          {/* Ticket Details */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600 text-sm">Ticket #</Text>
              <Text className="text-gray-800 font-medium">{bookingInfo?.ticketNumber}</Text>
            </View>
            
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600 text-sm">PNR #</Text>
              <Text className="text-gray-800 font-medium">{bookingInfo?.pnr}</Text>
            </View>
            
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
              <Text className="text-gray-800 font-bold">Total Fare</Text>
              <Text className="text-xl font-bold text-green-600">
                ₹{bookingInfo?.fare}
              </Text>
            </View>
          </View>

          {/* Share Button */}
          <TouchableOpacity className="bg-red-500 flex-row items-center justify-center p-4 rounded-xl mt-4 shadow-md">
            <ArrowUpOnSquareIcon color="white" size={22} />
            <Text className="text-white font-semibold ml-3 text-base">
              Share your ticket
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TicketModal;