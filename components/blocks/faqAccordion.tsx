interface Faq {
  question: string;
  answer: string;
}
const Faqs: Faq[] = [
  {
    question:
      "What types of medical issues can be addressed through MedCare Hub?",
    answer:
      "MedCare Hub addresses various non-emergency medical issues like colds, minor injuries, mental health, prescription refills, and follow-ups. Consult a healthcare provider to assess suitability for your situation.",
  },
  {
    question: "Does MedCare Hub accept health insurance?",
    answer:
      "At the moment, MedCare Hub does not accept health insurance. However, we are actively working towards incorporating insurance options in the near future to provide you with even more convenient and flexible healthcare solutions.",
  },
  {
    question: "How do I obtain a prescription through MedCare Hub?",
    answer:
      "If a doctor prescribes medication during your appointment, they can electronically send it to your preferred pharmacy for delivery. You can also choose to get them yourself at any pharmacy. Please ensure you provide accurate pharmacy details during the consultation. Note that prescriptions are issued based on the doctor's professional judgment and adherence to relevant regulations.",
  },
  {
    question: "How do I schedule an appointment?",
    answer:
      "Scheduling a appointmentn is easy. Simply log in to your account, browse available healthcare providers,choose a suitable time, and book your appointment. You can also check the availability of doctors, including their consultation  hours, on their profiles.",
  },
];

const FaqAccordion = () => {
  return (
    <div className="max-w-2xl grid divide-y-[1px]">
      {Faqs.map((item: Faq, idx: number) => (
        <div className="flex flex-col gap-3 py-4" key={idx}>
          <h5 className="font-medium">{item.question}</h5>
          <p className="text-muted-foreground text-sm">{item.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
