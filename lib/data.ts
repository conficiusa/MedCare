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
