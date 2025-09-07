import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // cache fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // keep unused data in cache for 10 minutes
      cacheTime: 1000 * 60 * 10,
      // retry failed queries only once
      retry: 1,
    },
  },
});
