import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  heading: string;
  ctaText: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  delay?: number;
}

export function FeatureCard({
  title,
  heading,
  ctaText,
  ctaHref,
  imageSrc,
  imageAlt,
  delay = 0,
}: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden dark:bg-muted/30 shadow-lg rounded-3xl p-6 transition-all md:p-8 min-h-full">
      <div className="mb-8 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
          {title}
        </h2>
        <h3 className="text-2xl font-medium text-green-900 dark:text-white md:text-3xl lg:text-2xl">
          {heading}
        </h3>
        <Link href={ctaHref}>
          <Button className="mt-4 gap-2 rounded-full" size="lg">
            {ctaText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-500" />
          </Button>
        </Link>
      </div>
      <div className="relative h-[300px] w-full overflow-hidden rounded-2xl md:h-[350px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-contain object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}
