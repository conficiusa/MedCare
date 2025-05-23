import { Doctor } from "@/lib/definitions";

const AboutDoctor = ({ doctor }: { doctor: Doctor }) => {
  return (
    <div className="grid gap-5 text-sm max-w-4xl py-4">
      <p className="leading-6 tracking-wide font-[400]">
        {doctor?.doctorInfo?.bio}
      </p>
      <div>
        <ul className="flex max-sm:flex-col gap-10 sm:items-center text-sm mt-4">
          <li className="flex flex-col justify-center gap-2">
            <p className="font-semibold">Specialities</p>
            <p className="leading-8 tracking-wide font-light">
              {doctor?.doctorInfo?.specialities?.join(", ")}
            </p>
          </li>
          <li className="flex flex-col justify-center gap-2">
            <p className="font-semibold">Licenses & Certifications</p>
            <p className="leading-8 tracking-wide font-light">
              {doctor?.doctorInfo?.certifications?.join(", ")}
            </p>
          </li>
          <li className="flex flex-col justify-center gap-2">
            <p className="font-semibold">Languages Spoken</p>
            <p className="leading-8 tracking-wide font-light">
              {doctor?.languages?.join(", ")}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutDoctor;
