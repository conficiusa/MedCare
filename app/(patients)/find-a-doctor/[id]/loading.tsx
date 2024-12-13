import Loader from "@/components/blocks/loader";

const Loading = () => {
  return (
    <div>
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    </div>
  );
};

export default Loading;
