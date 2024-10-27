import dynamic from "next/dynamic";

const OnboardingPatient = dynamic(
  () => import("@/components/sections/onbaordingPatient"),
  {
    ssr: false,
  }
);
const Component = () => {
  return <OnboardingPatient />;
};

export default Component;
