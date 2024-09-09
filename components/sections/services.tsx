import Image from "next/image";
import ServiceCards from "@/components/blocks/serviceCards";

const Services = () => {
  return (
    <section className="">
      <div className="grid grid-cols-[500px_1fr] gap-8">
        <div>
          <Image
            src={"/ServicePic.svg"}
            alt="a doctor"
            width={500}
            height={500}
            className="object-fit -scale-x-100"
          />
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-6">Our Services</h3>
          <ServiceCards />
        </div>
      </div>
    </section>
  );
};

export default Services;
