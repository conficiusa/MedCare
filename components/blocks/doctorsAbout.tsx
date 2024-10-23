import React from "react";

const AboutDoctor = () => {
  return (
    <div className="grid gap-5 text-sm max-w-4xl py-4">
      <p>
        Afi Sitsofe is a highly accomplished general medical doctor with a
        commitment to compassionate patient care. She earned her Doctor of
        Medicine (MD) degree from Kwame Nkrumah University of Science ans
        Technology, where she excelled in academic achievements and clinical
        rotations. Driven by a passion for comprehensive healthcare, she
        completed her residency at Komfo Anokye Teaching Hospital, honing her
        diagnostic and treatment skills across various medical disciplines.
      </p>
      <p>
        . With a focus on continuous learning, Sitsofe pursued board
        certification in Internal Medicine, solidifying her expertise in
        managing complex medical cases. Her dedication to patient well-being is
        evident through her extensive professional experience at St. Luke&apos;s
        Medical Center, where she has served as a lead physician for over a
        decade. Sitsofe is known for her empathetic approach, collaborating with
        patients to develop personalized treatment plans that address both
        immediate concerns and long-term health goals.
      </p>
      <p>
        Sitsofe remains actively engaged in the medical community, staying
        abreast of the latest advancements through ongoing professional
        development. Beyond her clinical responsibilities, she is a valued
        mentor to medical students, sharing her knowledge and fostering the next
        generation of healthcare professionals. With a reputation for
        excellence, she continues to make a positive impact on the lives of her
        patients and the broader medical community.
      </p>
      <div>
        <ul className="flex gap-10 items-center text-sm mt-4">
          <li className="flex flex-col justify-center gap-2">
            <p className="font-semibold">Specialities</p>
            <p>Primary care</p>
          </li>
          <li className="flex flex-col justify-center gap-2">
            <p className="font-semibold">Licenses & Certifications</p>
            <p>MBChB, TMDC, MDC</p>
          </li>
          <li className="flex flex-col justify-center gap-2">
            <p className="font-semibold">Languages Spoken</p>
            <p>Asante Twi, English</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutDoctor;
