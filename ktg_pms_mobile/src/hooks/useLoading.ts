import { useState } from 'react';

type LoadingState<T extends Record<string, any>> = T;

function useLoading<T extends Record<string, any>>(deps: LoadingState<T>) {
  const [loading, setLoading] = useState<LoadingState<T>>(deps);

  const updateLoading = (params: Partial<LoadingState<T>>) => {
    setLoading((prev) => ({
      ...prev,
      ...params,
    }));
  };

  return {
    loading,
    setLoading: updateLoading,
  };
}

export default useLoading;
