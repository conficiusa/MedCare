import { FormBuilder } from "@/components/blocks/formBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

interface PrescriptionFormProps {
  index: number;
  onDelete: () => void;
  showDelete: boolean;
}

export const PrescriptionForm = ({
  index,
  onDelete,
  showDelete,
}: PrescriptionFormProps) => (
  <Card key={index}>
    <CardHeader className="max-sm:px-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">Prescription #{index + 1}</CardTitle>
        {showDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="max-sm:px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormBuilder
          name={`prescriptions.${index}.medication`}
          label="Medication"
          message
        >
          <Input placeholder="Medication name" />
        </FormBuilder>

        <FormBuilder
          name={`prescriptions.${index}.dosage`}
          label="Dosage"
          message
        >
          <Input placeholder="e.g. 10mg" />
        </FormBuilder>

        <FormBuilder
          name={`prescriptions.${index}.frequency`}
          label="Frequency"
          message
        >
          <Input placeholder="e.g. twice daily" />
        </FormBuilder>

        <FormBuilder
          name={`prescriptions.${index}.duration`}
          label="Duration"
          message
        >
          <Input placeholder="e.g. 7 days" />
        </FormBuilder>

        <FormBuilder
          name={`prescriptions.${index}.instructions`}
          label="Special Instructions"
          message
          className="md:col-span-2"
        >
          <Textarea placeholder="e.g. take with food" />
        </FormBuilder>
      </div>
    </CardContent>
  </Card>
);
