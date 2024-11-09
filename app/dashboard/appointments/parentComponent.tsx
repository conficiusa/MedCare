import { useState } from "react";
import AppointmentTabs from "./appointmentTabs";
import { Session } from "next-auth";
import { AppointmentStatus } from "./page";

const ParentComponent = ({ session }: { session: Session }) => {
  const [activeTab, setActiveTab] = useState<AppointmentStatus>("upcoming");

  const handleTabChange = (value: string) => {
    setActiveTab(value as AppointmentStatus);
  };

  return (
    <AppointmentTabs
      session={session}
      activeTab={activeTab}
      handleTabChange={handleTabChange}
    />
  );
};

export default ParentComponent;
