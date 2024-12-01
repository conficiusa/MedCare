import Loader from "@/components/blocks/loader";
import ServerDocOnboard from "@/components/sections/serverdocOnboard";
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
      <ServerDocOnboard />
    </Suspense>
  );
};

export default Page;
