import React from "react";
import TestimonialCard from "../blocks/testimononialCard";

const Testimonials = () => {
  return (
    <section className="grid md:grid-cols-[auto_1fr] mb-20 md:gap-24 gap-5">
      <div>
        <h2 className="text-xl font-medium max-md:text-center">
          Patient <br className="hidden md:block" /> Praises
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-12 max-sm:grid-cols-1 text-center place-items-center">
        <TestimonialCard />
        <TestimonialCard />
        <TestimonialCard />
      </div>
    </section>
  );
};

export default Testimonials;
