import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

const ReferFriend = () => {
  return (
    <section className="mb-10">
      <div className="bg-muted min-h-[280px] rounded-sm flex justify-center items-center flex-col py-5">
        <div className="flex flex-col justify-center items-center sm:px-20 px-8 max-sm:text-center">
          <Image
            src={"/faq.png"}
            width={100}
            height={"100"}
            alt="a dial pad for contacting customer support"
            className="object-cover"
          />
          <p className="font-semibold mt-3">Refer a friend & get 10% off</p>
          <p className="text-sm">
            Enjoy the convenience of virtual consultations from the comfort of
            your home.
          </p>
          <Button variant={"outline"} className="mt-6">
            Refer a friend
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ReferFriend;
