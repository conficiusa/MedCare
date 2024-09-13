import axios from "axios";
export const useCreateAccount = () => {
  const onCreateAccount = async (data: any) => {
    try {
      const response = await axios.post("/api/auth/signup", data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return { onCreateAccount };
};
