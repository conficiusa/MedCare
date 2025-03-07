import { Option } from "@/components/ui/multi-select";

export const languages: Option[] = [
  { label: "English", value: "English", group: "Global" },
  { label: "French", value: "French", group: "Global" },
  { label: "Spanish", value: "Spanish", group: "Global" },
  { label: "Portuguese", value: "Portuguese", group: "Global" },
  { label: "Chinese", value: "Chinese", group: "Global" },
  //Ghanaian Languages
  {
    label: "Akan",
    value: "Akan",
    group: "Ghanaian Languages",
  },
  {
    label: "Dagbani",
    value: "Dagbani",
    group: "Ghanaian Languages",
  },
  {
    label: "Dangme",
    value: "Dangme",
    group: "Ghanaian Languages",
  },
  {
    label: "Ewe",
    value: "Ewe",
    group: "Ghanaian Languages",
  },
  {
    label: "Ga",
    value: "Ga",
    group: "Ghanaian Languages",
  },
  {
    label: "Gonja",
    value: "Gonja",
    group: "Ghanaian Languages",
  },
  {
    label: "Kasem",
    value: "Kasem",
    group: "Ghanaian Languages",
  },
  {
    label: "Fante",
    value: "Fante",
    group: "Ghanaian Languages",
  },
  {
    label: "Twi",
    value: "Twi",
    group: "Ghanaian Languages",
  },
  {
    label: "Hausa",
    value: "Hausa",
    group: "Ghanaian Languages",
  },
  {
    label: "Dagare",
    value: "Dagare",
    group: "Ghanaian Languages",
  },
  {
    label: "Gurune",
    value: "Gurune",
    group: "Ghanaian Languages",
  },
  {
    label: "Kusaal",
    value: "Kusaal",
    group: "Ghanaian Languages",
  },
  {
    label: "Sisaala",
    value: "Sisaala",
    group: "Ghanaian Languages",
  },
];

export const regions: {
  label: string;
  value: string;
}[] = [
  { label: "Northern", value: "Northern" },
  { label: "Upper West", value: "Upper West" },
  { label: "Upper East", value: "Upper East" },
  { label: "Savannah", value: "Savannah" },
  { label: "Bono", value: "Bono" },
  { label: "Greater Accra", value: "Greater Accra" },
  { label: "Western", value: "Western" },
  { label: "Central", value: "Central" },
  { label: "Volta", value: "Volta" },
  { label: "North East", value: "North East" },
  { label: "Bono East", value: "Bono East" },
  { label: "Oti", value: "Oti" },
  { label: "Ashanti", value: "Ashanti" },
];

//condtions patients can have which the doctor must be aware of
export const conditions: Option[] = [
  { label: "Asthma", value: "Asthma" },
  { label: "Cancer", value: "Cancer" },
  { label: "Diabetes", value: "Diabetes" },
  { label: "Epilepsy", value: "Epilepsy" },
  { label: "G6PD Deficiency", value: "G6PD Deficiency" },
  { label: "Heart Disease", value: "Heart Disease" },
  { label: "HIV/AIDS", value: "HIV/AIDS" },
  { label: "Hypertension", value: "Hypertension" },
  { label: "Kidney Disease", value: "Kidney Disease" },
  { label: "Mental Health", value: "Mental Health" },
  { label: "Other", value: "Other" },
  { label: "Pregnancy", value: "Pregnancy" },
  { label: "Sickle Cell", value: "Sickle Cell" },
  { label: "Stroke", value: "Stroke" },
  { label: "Tuberculosis", value: "Tuberculosis" },
];

export const specializations: Option[] = [
  { label: "Cardiology", value: "Cardiology" },
  { label: "Pediatrics", value: "Pediatrics" },
  { label: "Dermatology", value: "Dermatology" },
  { label: "Orthopedics", value: "Orthopedics" },
  { label: "Neurology", value: "Neurology" },
  { label: "Oncology", value: "Oncology" },
  { label: "Gynecology", value: "Gynecology" },
  { label: "Ophthalmology", value: "Ophthalmology" },
  { label: "Psychiatry", value: "Psychiatry" },
  { label: "Gastroenterology", value: "Gastroenterology" },
  { label: "Anesthesiology", value: "Anesthesiology" },
  { label: "Endocrinology", value: "Endocrinology" },
  { label: "Nephrology", value: "Nephrology" },
  { label: "Rheumatology", value: "Rheumatology" },
  { label: "Pulmonology", value: "Pulmonology" },
  { label: "Urology", value: "Urology" },
  { label: "Hematology", value: "Hematology" },
  { label: "Immunology", value: "Immunology" },
  { label: "Radiology", value: "Radiology" },
  { label: "Pathology", value: "Pathology" },
  { label: "Allergy and Immunology", value: "Allergy and Immunology" },
  { label: "Emergency Medicine", value: "Emergency Medicine" },
  { label: "Family Medicine", value: "Family Medicine" },
  { label: "Geriatrics", value: "Geriatrics" },
  { label: "Infectious Disease", value: "Infectious Disease" },
  { label: "Internal Medicine", value: "Internal Medicine" },
  { label: "Nuclear Medicine", value: "Nuclear Medicine" },
  { label: "Plastic Surgery", value: "Plastic Surgery" },
  { label: "Reproductive Endocrinology", value: "Reproductive Endocrinology" },
  { label: "Vascular Surgery", value: "Vascular Surgery" },
];

export const certifications: Option[] = [
  {
    label: "Board Certified in Internal Medicine",
    value: "Board Certified in Internal Medicine",
  },
  { label: "Fellowship in Cardiology", value: "Fellowship in Cardiology" },
  {
    label: "Certified in Pediatric Advanced Life Support",
    value: "Certified in Pediatric Advanced Life Support",
  },
  { label: "Diploma in Dermatology", value: "Diploma in Dermatology" },
  {
    label: "Certification in Orthopedic Surgery",
    value: "Certification in Orthopedic Surgery",
  },
  { label: "Certified Neurologist", value: "Certified Neurologist" },
  { label: "Certified Oncologist", value: "Certified Oncologist" },
  {
    label: "Board Certified in Obstetrics and Gynecology",
    value: "Board Certified in Obstetrics and Gynecology",
  },
  { label: "Certified Ophthalmologist", value: "Certified Ophthalmologist" },
  {
    label: "Certified in Gastroenterology",
    value: "Certified in Gastroenterology",
  },
  {
    label: "Certification in Anesthesiology",
    value: "Certification in Anesthesiology",
  },
  {
    label: "Board Certified Endocrinologist",
    value: "Board Certified Endocrinologist",
  },
  { label: "Certified Nephrologist", value: "Certified Nephrologist" },
  { label: "Fellowship in Rheumatology", value: "Fellowship in Rheumatology" },
  { label: "Certified Pulmonologist", value: "Certified Pulmonologist" },
  { label: "Board Certified Urologist", value: "Board Certified Urologist" },
  { label: "Certified Hematologist", value: "Certified Hematologist" },
  { label: "Certified Immunologist", value: "Certified Immunologist" },
  { label: "Certification in Radiology", value: "Certification in Radiology" },
  { label: "Diploma in Pathology", value: "Diploma in Pathology" },
  { label: "Board Certified Allergist", value: "Board Certified Allergist" },
  {
    label: "Certified Emergency Medicine Physician",
    value: "Certified Emergency Medicine Physician",
  },
  {
    label: "Board Certified Family Physician",
    value: "Board Certified Family Physician",
  },
  {
    label: "Geriatric Medicine Certification",
    value: "Geriatric Medicine Certification",
  },
  {
    label: "Certified in Infectious Disease",
    value: "Certified in Infectious Disease",
  },
  { label: "Board Certified Internist", value: "Board Certified Internist" },
  {
    label: "Certified in Nuclear Medicine",
    value: "Certified in Nuclear Medicine",
  },
  { label: "Certified Plastic Surgeon", value: "Certified Plastic Surgeon" },
  {
    label: "Board Certified Reproductive Endocrinologist",
    value: "Board Certified Reproductive Endocrinologist",
  },
  { label: "Certified Vascular Surgeon", value: "Certified Vascular Surgeon" },
];

export const labInvestigations = [
  { value: "complete_blood_count", label: "Complete Blood Count (CBC)" },
  { value: "malaria_test", label: "Malaria Parasite Test" },
  { value: "random_blood_glucose", label: "Random Blood Glucose" },
  { value: "fasting_blood_glucose", label: "Fasting Blood Glucose" },
  {value:"ogtt", label:"Oral Glucose Tolerance Test (OGTT)"},
  { value: "liver_function", label: "Liver Function Test" },
  { value: "renal_function", label: "Renal Function Test" },
  { value: "lipid_profile", label: "Lipid Profile" },
  { value: "urinalysis", label: "Urinalysis" },
  { value: "stool_exam", label: "Stool Examination" },
  { value: "hba1c", label: "HbA1c (Glycated Hemoglobin)" },
  { value: "thyroid_function", label: "Thyroid Function Test" },
  { value: "hiv_screening", label: "HIV Screening" },
  { value: "hepatitis_b", label: "Hepatitis B Screening" },
  { value: "hepatitis_c", label: "Hepatitis C Screening" },
  { value: "xray_chest", label: "Chest X-Ray" },
  { value: "ultrasound_abdomen", label: "Abdominal Ultrasound" },
  { value: "ecg", label: "Electrocardiogram (ECG)" },
  { value: "sickle_cell", label: "Sickle Cell Test" },
  { value: "widal_test", label: "Widal Test (Typhoid)" },
  { value: "electrolytes", label: "Serum Electrolytes" },
  { value: "esr", label: "Erythrocyte Sedimentation Rate (ESR)" },
];

export const clinicalImaging = [
  { value: "chest_xray", label: "Chest X-Ray" },
  { value: "abdominal_xray", label: "Abdominal X-Ray" },
  { value: "abdominal_ultrasound", label: "Abdominal Ultrasound" },
  { value: "pelvic_ultrasound", label: "Pelvic Ultrasound" },
  { value: "obstetric_ultrasound", label: "Obstetric Ultrasound" },
  { value: "echocardiography", label: "Echocardiography" },
  { value: "ct_scan_head", label: "CT Scan - Head" },
  { value: "ct_scan_chest", label: "CT Scan - Chest" },
  { value: "ct_scan_abdomen", label: "CT Scan - Abdomen" },
  { value: "mri_brain", label: "MRI - Brain" },
  { value: "mri_spine", label: "MRI - Spine" },
  { value: "mammography", label: "Mammography" },
  { value: "doppler_ultrasound", label: "Doppler Ultrasound" },
  { value: "barium_swallow", label: "Barium Swallow" },
  { value: "barium_enema", label: "Barium Enema" },
  { value: "ivp", label: "Intravenous Pyelogram (IVP)" },
  { value: "hsg", label: "Hysterosalpingography (HSG)" },
  { value: "bone_scan", label: "Bone Scan" },
  { value: "fluoroscopy", label: "Fluoroscopy" },
  { value: "dental_xray", label: "Dental X-Ray" }
];