import Loader from "@/components/blocks/loader";
import ServerPatientOnboard from "@/components/sections/serverpatientOnboard";
import { Suspense } from "react";

const Page = async () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <ServerPatientOnboard />
    </Suspense>
  );
};

export default Page;
