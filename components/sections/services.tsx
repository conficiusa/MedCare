import Image from "next/image";
import ServiceCards from "@/components/blocks/serviceCards";

const Services = () => {
  return (
    <section className="container bg-gray-100 dark:bg-background">
      <div className="grid xl:grid-cols-[auto_1fr] lg:grid-cols-[300px_1fr]  gap-8 ">
        <div className="lg:flex hidden ">
          <Image
            src={"/service.png"}
            alt="a doctor"
            width={450}
            height={1000}
            className="object-contain -scale-x-100 aspect-[2000/1333]"
          />
        </div>
        <div className="space-y-4 py-8">
          <h3 className="text-2xl font-bold max-lg:text-center">
            Our Services
          </h3>
          <ServiceCards />
        </div>
      </div>
    </section>
  );
};

export default Services;
