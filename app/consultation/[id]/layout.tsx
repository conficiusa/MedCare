import { auth } from "@/auth";
import AblyRealtimeProvider from "@/components/wrappers/ablyProvider";
import React, { ReactNode } from "react";

const Layout = async ({
  children,
  modal,
}: {
  children: ReactNode;
  modal: React.ReactNode;
}) => {
  const session = await auth();

  return (
    <AblyRealtimeProvider clientId={session?.user?.id as string}>
      {modal}
      {children}
    </AblyRealtimeProvider>
  );
};

export default Layout;
