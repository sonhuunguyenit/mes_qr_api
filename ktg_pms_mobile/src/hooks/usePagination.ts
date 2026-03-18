import { useState } from 'react';

export const usePagination = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);

  const next = () => setPage((p) => p + 1);

  const reset = () => setPage(initialPage);

  return { page, next, reset, setPage };
};
