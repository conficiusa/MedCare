import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCard } from "@/lib/definitions";
import { ArrowRight, CalendarCheck, Pill, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlurFade from "../ui/blurFade";

export const ServiceCardsDetails: ServiceCard[] = [
  {
    title: "Consult a Doctor",
    icon: <Stethoscope className="w-4 h-4 text-blue-500 " />,
    description:
      "Need medical advice now? Speak to a licensed online doctor and get personalized assistance.",
    footer: "See available doctors",
  },
  {
    title: "Book Appointment",
    icon: <CalendarCheck className="w-4 h-4 text-orange-500 " />,
    description:
      "Schedule your in-person doctor's appointment for general medical advice.",
    footer: "Schedule an appointment",
  },
  {
    title: "Get Medication",
    icon: <Pill className="w-4 h-4 text-green-500 " />,
    description:
      "Receive your prescribed medication, with the option for easy home delivery or local pharmacy pick-up.",
    footer: "Get your medication",
  },
  {
    title: "Take a Lab Test",
    icon: <Stethoscope className="w-4 h-4 text-blue-500 " />,
    description:
      "Request a home visit from our professionals to take your lab test—convenience at your doorstep.",
    footer: "Take a Lab Test",
  },
];

const ServiceCards = () => {
  return (
    <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
      {ServiceCardsDetails.map((card: ServiceCard, idx: number) => (
        <Card className="gap-3 shadow-md" key={idx}>
          <CardHeader className="py-3">
            <p>{card.icon}</p>
            <CardTitle className="text-[14px] font-semibold">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground">{card.description}</p>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="text-[12px] flex items-center gap-2 px-1 my-2 "
            >
              {card.footer}{" "}
              <ArrowRight className="text-muted-foreground w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceCards;
