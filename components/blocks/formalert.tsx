import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

const FormAlert = ({ state }: { state: string | undefined }) => {
  const { pending } = useFormStatus();
  return (
    !pending &&
    state && (
      <div>
        <div className="py-3">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  );
};

export default FormAlert;
