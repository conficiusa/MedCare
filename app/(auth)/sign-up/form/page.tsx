import SignUpform from "@/components/blocks/signUpform";

const SignUpWithCredentials = () => {
  return (
    <div className="flex justify-center rounded-r-md py-5">
      <div className="flex flex-col gap-4 max-w-md w-full">
        <div className="grid">
          <h2 className="text-2xl font-semibold">Create Account</h2>
          <p className="text-muted-foreground text-sm">Fill the form below to create your account </p>
        </div>
        <div>
          <SignUpform />
        </div>
      </div>
    </div>
  );
};

export default SignUpWithCredentials;
