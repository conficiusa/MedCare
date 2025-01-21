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
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
