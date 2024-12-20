import { FeatureCard } from "@/components/blocks/feature-cards";
import Image from "next/image";

export default function Features() {
  const features = [
    {
      title: "INDIVIDUALS",
      heading: "Anytime, anywhere, anything care",
      ctaText: "Get care now",
      ctaHref: "/care",
      imageSrc: "/feature1.png",
      imageAlt:
        "Telemedicine consultation interface showing a patient care plan",
      delay: 0,
    },
    {
      title: "ORGANIZATIONS",
      heading: "Hospitals, Pharmacies, Laboratories",
      ctaText: "Ways we help",
      ctaHref: "/organizations",
      imageSrc: "/feature1.png",
      imageAlt: "Medical device with video conferencing capabilities",
      delay: 200,
    },
    {
      title: "CLINICIANS",
      heading: "Quality care starts here",
      ctaText: "Join the team",
      ctaHref: "/join",
      imageSrc: "/feature1.png",
      imageAlt: "Clinician scheduling interface showing appointments",
      delay: 400,
    },
  ];

  return (
    <section className="container mx-auto pb-12 max-md:mt-6 space-y-8">
      <div className="relative w-full h-[150px] overflow-hidden rounded-lg">
        {/* Background Image */}
        <Image
          src="/banner.png"
          alt="Telehealth consultation on a tablet"
          fill
          className="object-cover"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/90" />
        <div className="relative z-10 h-full flex flex-col justify-center max-w-4xl mx-auto px-4 md:px-8">
          <p className="text-xl md:text-2xl xl:text-3x text-white text-center max-w-[47rem] mx-auto font-light text-pretty leading-8 md:leading-[43px] tracking-wide ">
            For your physical health. For your{" "}
            <span className="text-primary">mental health</span> For{" "}
            <span className="text-teal-700">clinicians</span> For{" "}
            <span className="text-purple-800"> hospitals</span>. For all of it
            in one place. For life.
          </p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
