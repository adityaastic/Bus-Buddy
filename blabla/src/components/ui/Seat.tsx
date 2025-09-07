import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import BookedIcon from "../../assets/images/booked.jpg";
import AvailableIcon from "../../assets/images/available.jpg";
import SelectedIcon from "../../assets/images/selected.jpg";

interface seat_id {
  seat_id: number;
  booked: boolean;
  type: 'window' | 'side' | 'path';
}

interface Seats {
  rowId: number;
  seats: seat_id[];
}

const Seat: FC<{
  seats: Seats[]; // Updated to match your actual data structure
  onSeatSelect: (seat_id: number) => void;
  selectedSeats: number[];
}> = ({ seats, onSeatSelect, selectedSeats }) => {

  return (
    <View className='mb-4 justify-between flex-row'>
      <View className='w-[30%] items-center bg-white rounded-2xl p-4'>

     <Text className='font-okra font-bold text-lg mb-4'>Seat Type</Text>   

      <View className="items-center mb-4">
        <Image source={SelectedIcon} className="h-12 w-12 my-1" />
        <Text className="font-okra font-medium text-md mb-4">Selected</Text>
      </View>

      {/* Available */}
      <View className="items-center mb-4">
        <Image source={AvailableIcon} className="h-12 w-12 my-1" />
        <Text className="font-okra font-medium text-md mb-4">Available</Text>
      </View>

      {/* Booked */}
      <View className="items-center mb-4">
        <Image source={BookedIcon} className="h-12 w-12 my-1" />
        <Text className="font-okra font-medium text-md mb-4">Booked</Text>
      </View>

    </View>
    
    <View className='w-[65%] bg-white rounded-2xl p-4'>
     <Image source={require('../../assets/images/wheel.png')} className='h-10 w-10 mb-4 self-end'/>

   
{/* CORRECTED CODE - Now matches your data structure */}
<View className="mt-2 w-full">
  {seats?.map((row, rowIndex) => (
    <View
      key={row.rowId}
      className="flex-row w-full justify-between items-center mb-2"
    >
      {row.seats?.map((seat, seatIndex) => { 
        // If seat type is 'path', render empty space (aisle)
        if (seat.type === 'path') { 
          return <View key={`${row.rowId}-${seatIndex}-path`} className='p-5 m-1' />
        }
        
        return (
          <TouchableOpacity
            key={`${row.rowId}-${seat.seat_id}`}
            disabled={seat.booked}
            onPress={() => onSeatSelect(seat.seat_id)}
            className="m-1"
          >
            <Image
              source={ 
                selectedSeats?.includes(seat.seat_id)
                  ? SelectedIcon
                  : seat.booked
                    ? BookedIcon
                    : AvailableIcon
              }
              className="h-12 w-12"
            />
          </TouchableOpacity>
        );
      })}
     </View>
  ))}
</View>


   </View>
       </View>
  )
}

export default Seat;


