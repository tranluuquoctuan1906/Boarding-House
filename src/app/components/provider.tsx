"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "antd";

const queryClient = new QueryClient();

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <App>{children}</App>
    </QueryClientProvider>
  );
};
