import { motion } from "framer-motion";

import Image from "next/image";
const SignInimage = () => {
  return (
    <div className="w-full md:w-1/2 bg-green-600 text-white md:flex flex-col justify-center items-center p-12 hidden">
      <div className="max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">
            Start your journey with us
          </h2>
          <p className="mb-8 text-sm">
            Experience expert healthcare from the best doctors in the country in
            the comfort of your home.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className=""
        >
          <Image
            src="/signIn.jpg"
            alt="Sign In"
            width={400}
            height={100}
            className="rounded-xl shadow-lg mx-auto object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SignInimage;
