import { auth } from "@/auth";
import AblyRealtimeProvider from "@/components/wrappers/ablyProvider";
import React, { ReactNode } from "react";

const Layout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const session = await auth();

  return (
    <AblyRealtimeProvider clientId={session?.user?.id as string}>
      {children}
    </AblyRealtimeProvider>
  );
};

export default Layout;
