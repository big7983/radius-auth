"use client";
import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return <SessionProvider >{children}</SessionProvider>;
};

export default SessionWrapper;
