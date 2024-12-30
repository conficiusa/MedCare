"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

// Custom hook to manage dialog state and timeout

const ConsultationStatusDialog = ({
  consultRefActor,
}: {
  consultRefActor: any;
}) => {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm consultation status</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            We noticed that you&apos;ve been disconnected . Please confirm if
            you&apos;re still in the consultation and trying to reconnect
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="text-sm text-muted-foreground">
          We noticed that you&apos;ve been disconnected . Please confirm if
          you&apos;re still in the consultation and trying to reconnect
        </div>
        <AlertDialogFooter>
          <AlertDialogAction className="primary">
            End Consultation
          </AlertDialogAction>
          <AlertDialogCancel
            className="secondary"
            onClick={() => {
              consultRefActor.send({ type: "NOT_OVER" });
            }}
          >
            Reconnect
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConsultationStatusDialog;
