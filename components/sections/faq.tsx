import FaqAccordion from "@/components/blocks/faqAccordion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Faq = () => {
  return (
    <section className="">
      <div className="grid sm:grid-cols-[auto_1fr] lg:gap-32">
        <div className="sm:px-10 max-sm:py-4">
          <h3 className="text-2xl font-semibold">
            Frequently <br /> Asked <br /> Questions.
          </h3>
        </div>
        <div>
          <FaqAccordion />
          <Link href={"#"} className="flex items-center gap-1 text-sm mt-3">
            Get more answers here <ArrowRight className="w-4 h-4" strokeWidth={1.8}/>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Faq;
