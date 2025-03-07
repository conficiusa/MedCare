export interface ExpandedSections {
  patientInfo: boolean;
  consultation: boolean;
  medicalHistory: boolean;
  examination: boolean;
  assessment: boolean;
  followUp: boolean;
  investigations: boolean;
}

export interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}