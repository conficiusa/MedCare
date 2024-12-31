import React, { ReactNode } from "react";

const Layout = ({
  children,
  modal,
}: {
  children: ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <>
      {modal}
      {children}
    </>
  );
};

export default Layout;
