import { useState } from "react";

export const useTraceBackward = () => {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
};
