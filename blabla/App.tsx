import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/service/queryClient';
import Navigation from './src/navigation/Navigation';
import './global.css'; // NativeWind global styles

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
};

export default App;
