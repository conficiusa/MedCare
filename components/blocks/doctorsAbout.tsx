import { IUser } from "@/lib/definitions";

const AboutDoctor = ({ doctor }: { doctor: IUser }) => {
  return (
    <div className="grid gap-5 text-sm max-w-4xl py-4">
      <p>{doctor?.doctorInfo?.bio}</p>
      <div>
        <ul className="flex gap-10 items-center text-sm mt-4">
          <li className="flex flex-col justify-center gap-2">
            <p className="font-semibold">Specialities</p>
            <p>{doctor?.doctorInfo?.specialties?.join(", ")}</p>
          </li>
          <li className="flex flex-col justify-center gap-2">
            <p className="font-semibold">Licenses & Certifications</p>
            <p>{doctor?.doctorInfo?.certifications?.join(", ")}</p>
          </li>
          <li className="flex flex-col justify-center gap-2">
            <p className="font-semibold">Languages Spoken</p>
            <p>{doctor?.languages?.join(", ")}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutDoctor;
