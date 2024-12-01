import ServerDocOnboard from "@/components/sections/serverdocOnboard";
import { Suspense } from "react";

const Page = async () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <ServerDocOnboard />
    </Suspense>
  );
};

export default Page;
