"use client";

import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
