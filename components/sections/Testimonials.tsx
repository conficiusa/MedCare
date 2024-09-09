import React from "react";
import TestimonialCard from "../blocks/testimononialCard";

const Testimonials = () => {
  return (
    <section className="grid grid-cols-[auto_1fr] mb-20 gap-24">
      <div>
        <h2 className="text-xl font-medium">
          Patient <br /> Praises
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-12">
        <TestimonialCard />
        <TestimonialCard />
        <TestimonialCard />
      </div>
    </section>
  );
};

export default Testimonials;
