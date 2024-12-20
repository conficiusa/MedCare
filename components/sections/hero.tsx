import { CalendarCheck2, CreditCard, Globe, LockKeyhole } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      id="#"
      role="banner"
      className="grid lg:grid-cols-[500px_1fr] min-h-[calc(100dvh_-_4rem)] lg:py-14  max-lg:grid-rows-[0.6fr_1fr] container"
    >
      <div className="lg:py-8 pb-4 pt-8">
        <div className="flex justify-center flex-col h-full gap-4 max-lg:items-center max-lg:text-center">
          <h2 className="text-3xl font-semibold">
            Expert Care At Your <br /> FingerTips
          </h2>
          <p className="text-sm text-muted-foreground">
            Enjoy the convenience of virtual consultations from the comfort of
            your home, eliminating the need for long wait times and travel
            hassles.
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:gap-y-4 mt-5">
            {[
              {
                icon: (
                  <Globe strokeWidth={1.5} className="w-4 h-4 font-light" />
                ),
                phrase: "Anywhere, Anytime",
              },
              {
                icon: (
                  <LockKeyhole
                    strokeWidth={1.5}
                    className="w-4 h-4 font-light"
                  />
                ),
                phrase: "Secure and Private",
              },
              {
                icon: (
                  <CalendarCheck2
                    strokeWidth={1.5}
                    className="w-4 h-4 font-light"
                  />
                ),
                phrase: "Efficient Scheduling",
              },
              {
                icon: (
                  <CreditCard
                    strokeWidth={1.5}
                    className="w-4 h-4 font-light"
                  />
                ),
                phrase: "Transparent Pricing",
              },
            ].map((item) => (
              <li key={item.phrase} className="flex gap-2 items-center text-sm">
                {item.icon}
                <span>{item.phrase}</span>
              </li>
            ))}
          </ul>
          <div className="w-full flex max-lg:justify-center">
            <Button className="mt-8 w-1/2 max-lg:mx-auto" size={"lg"} asChild>
              <Link href={"/sign-in"}>Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="relative hidden sm:flex items-center">
        <Image
          src="/HeroPic.webp"
          alt="african american sick young patient resting bed discussing healthcare treatment"
          fill
          sizes="100%"
          className="object-cover lg:object-cover rounded-md"
          placeholder="blur"
          blurDataURL="LAH2iu008|00~D4oIT.6bXOA_38{"
          priority
        />
      </div>
      <div className="relative max-sm:flex hidden items-center">
        <Image
          src="/HeroPic.webp"
          alt="african american sick young patient resting bed discussing healthcare treatment"
          fill
          sizes="100%"
          className=" rounded-md aspect-video object-contain"
          placeholder="blur"
          blurDataURL="LAH2iu008|00~D4oIT.6bXOA_38{"
          priority
        />
      </div>
    </section>
  );
};

export default Hero;
