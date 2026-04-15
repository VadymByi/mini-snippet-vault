"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // CREATE STABLE QUERY CLIENT INSTANCE (ONCE PER APP LIFECYCLE)
  const [queryClient] = useState(() => new QueryClient());

  return (
    // REACT QUERY PROVIDER WRAPPER
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
