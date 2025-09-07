import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Search from './Search';
import { tabs } from '../../utils/dummyData';
import { fetchUserTickets } from '../../service/requests/bus';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import BookingItem from './BookItem';

const Booking = () => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const { data: tickets, isLoading, isError, refetch } = useQuery({
    queryKey: ['usertickets'],
    queryFn: fetchUserTickets,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredBookings =
    selectedTab === 'All'
      ? tickets
      : tickets?.filter((ticket: any) => ticket.status === selectedTab);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#ef4444" />
        <Text className="mt-2 text-gray-500">Fetching bookings...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Failed to fetch bookings.</Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-4 bg-red-500 px-6 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        ListHeaderComponent={
          <>
            <Search />
            
            {/* Past Bookings Section */}
            <View className="px-4 mt-4">
              <Text className="text-3xl font-bold text-gray-900 mb-3">
                Past Bookings
              </Text>

              {/* Tab Buttons */}
              <View className="flex-row mb-3">
                {tabs.map(tab => (
                  <TouchableOpacity
                    key={tab}
                    className={`py-2 px-4 rounded-md mr-2  ${
                      selectedTab === tab
                        ? 'bg-red-600'
                        : 'bg-white border border-gray-200'
                    }`}
                    onPress={() => setSelectedTab(tab)}
                    style={
                      selectedTab === tab
                        ? {
                            shadowColor: '#ef4444',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3,
                          }
                        : {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                          }
                    }
                  >
                    <Text
                      className={`text-md font-semibold  ${
                        selectedTab === tab ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        }
        showsVerticalScrollIndicator={false}
        data={filteredBookings}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="items-center mt-10 px-4">
            <Text className="text-gray-400 text-center">
              No bookings found
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ef4444']}
            tintColor="#ef4444"
          />
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <BookingItem item={item} />
          </View>
        )}
      />
    </View>
  );
};

export default Booking;