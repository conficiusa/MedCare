const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const uri = "mongodb+srv://addawebadua:2006adda@medcare.jqcyr.mongodb.net";
const client = new MongoClient(uri);
const dbName = "Medcare";
const userCollectionName = "users";
const availabilityCollectionName = "availabilities";

const sampleImageUrl =
  "https://xgyzgqc7wzq7cyz6.public.blob.vercel-storage.com/profiles/sampleDoc-ZNAAkbr0wqXBoAKwJ3i8Mi32QIw40T.png";
const sampleImageTwoUrl =
  "https://xgyzgqc7wzq7cyz6.public.blob.vercel-storage.com/mock%20use%20(1)-TmsZBhLFrPxkF3V93pNPiux4UhESPh.jpg";

const names = [
  "John Smith",
  "Alice Johnson",
  "Michael Brown",
  "Emily Davis",
  "David Wilson",
  "Sarah Taylor",
  "Robert Miller",
  "Jessica Anderson",
  "Daniel Thomas",
  "Laura Lee",
  "Henry Walker",
  "Megan Parker",
  "Nathan Hill",
  "Rebecca Green",
  "Oliver Scott",
  "Sophia Carter",
  "Ethan Evans",
  "Grace Hall",
  "Benjamin Wright",
  "Isabella King",
  "James Martin",
  "Olivia Lewis",
  "Lucas Young",
  "Emma Clark",
  "Alexander Lee",
  "Charlotte Harris",
  "Liam Robinson",
  "Amelia White",
  "William Rodriguez",
  "Ava Martinez",
  "Mason Clark",
  "Mia Walker",
  "Logan Allen",
  "Harper Lopez",
  "Jackson Perez",
  "Ella Gonzalez",
  "Sebastian Rivera",
  "Scarlett Morgan",
  "Aiden James",
  "Evelyn Morris",
  "Elijah Ward",
  "Abigail Cooper",
  "Matthew Reed",
  "Lily Cook",
  "Lucas Brooks",
  "Hannah Gray",
  "Joseph Flores",
  "Zoey Ramirez",
  "Joshua Bennett",
  "Riley Cruz",
];

const specializations = [
  "Cardiology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Neurology",
  "Oncology",
  "Gynecology",
  "Ophthalmology",
  "Psychiatry",
  "Gastroenterology",
  "Anesthesiology",
  "Endocrinology",
  "Nephrology",
  "Rheumatology",
  "Pulmonology",
  "Urology",
  "Hematology",
  "Immunology",
  "Radiology",
  "Pathology",
  "Allergy and Immunology",
  "Emergency Medicine",
  "Family Medicine",
  "Geriatrics",
  "Infectious Disease",
  "Internal Medicine",
  "Nuclear Medicine",
  "Plastic Surgery",
  "Reproductive Endocrinology",
  "Vascular Surgery",
];

const certifications = [
  "Board Certified in Internal Medicine",
  "Fellowship in Cardiology",
  "Certified in Pediatric Advanced Life Support",
  "Diploma in Dermatology",
  "Certification in Orthopedic Surgery",
  "Certified Neurologist",
  "Certified Oncologist",
  "Board Certified in Obstetrics and Gynecology",
  "Certified Ophthalmologist",
  "Certified in Gastroenterology",
  "Certification in Anesthesiology",
  "Board Certified Endocrinologist",
  "Certified Nephrologist",
  "Fellowship in Rheumatology",
  "Certified Pulmonologist",
  "Board Certified Urologist",
  "Certified Hematologist",
  "Certified Immunologist",
  "Certification in Radiology",
  "Diploma in Pathology",
  "Board Certified Allergist",
  "Certified Emergency Medicine Physician",
  "Board Certified Family Physician",
  "Geriatric Medicine Certification",
  "Certified in Infectious Disease",
  "Board Certified Internist",
  "Certified in Nuclear Medicine",
  "Certified Plastic Surgeon",
  "Board Certified Reproductive Endocrinologist",
  "Certified Vascular Surgeon",
];

const generateTimeSlots = (date) => {
  const slotsPerDay = 24; // One slot per hour for a full day
  return Array.from({ length: slotsPerDay }, (_, i) => {
    const startTime = new Date(date);
    startTime.setUTCHours(i, 0, 0, 0); // Start of the hour
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1); // One hour later

    return {
      slotId: new ObjectId().toString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      isBooked: false,
      patientId: null,
      cancellationReason: null,
      rescheduledTo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
};

const generateAvailability = (doctorId) => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() + i); // Increment date by i days
    const expiresAt = new Date(date); // Clone the date
    expiresAt.setUTCDate(expiresAt.getUTCDate() + 1); // Move to the next day
    expiresAt.setUTCHours(0, 0, 0, 0); // Set to 12:00 AM (start of the day)

    return {
      doctorId,
      date,
      expiresAt,
      timeSlots: generateTimeSlots(date),
    };
  });
};

const generateBio = (name, specialization, experience, certifications) => {
  const introduction = [
    `With a heart dedicated to healing and a mind committed to knowledge, Dr. ${name} has carved a niche in ${specialization.toLowerCase()} over ${experience}.`,
    `Known for an exceptional commitment to patient care, Dr. ${name} has over ${experience} specializing in ${specialization.toLowerCase()}, where their expertise shines.`,
    `Driven by a passion for bettering lives, Dr. ${name} has spent ${experience} excelling in ${specialization.toLowerCase()}.`,
  ];

  const achievements = [
    `Holding certifications such as ${certifications.join(
      ", "
    )}, Dr. ${name} continually pursues excellence.`,
    `With esteemed qualifications like ${certifications.join(
      ", "
    )}, Dr. ${name} is regarded for skillful and compassionate care.`,
    `Certified in areas such as ${certifications.join(
      ", "
    )}, Dr. ${name} brings trusted and specialized knowledge.`,
  ];

  const approach = [
    `A blend of empathy and expertise defines Dr. ${name}'s approach, making each patient feel understood and valued.`,
    `Patients often commend Dr. ${name} for their comforting demeanor and sharp diagnostic abilities.`,
    `With a keen eye for detail and a warm bedside manner, Dr. ${name} provides a unique blend of care and accuracy.`,
  ];

  const passion = [
    `Outside the clinic, Dr. ${name} is an avid advocate for community health awareness and often hosts workshops to educate the public.`,
    `An advocate for holistic wellness, Dr. ${name} believes in empowering patients with knowledge for better long-term health.`,
    `Passionate about advancing medical practices, Dr. ${name} frequently participates in conferences to share insights with peers.`,
  ];

  const personalTouch = [
    `When not seeing patients, Dr. ${name} enjoys spending time with family, cooking new recipes, and reading about advances in ${specialization.toLowerCase()}.`,
    `In personal life, Dr. ${name} loves hiking and finds solace in nature, which inspires a calm approach in their medical practice.`,
    `Outside the medical realm, Dr. ${name} is a fan of classical music and often volunteers for local health events.`,
  ];

  return `${introduction[Math.floor(Math.random() * introduction.length)]} ${
    achievements[Math.floor(Math.random() * achievements.length)]
  } ${approach[Math.floor(Math.random() * approach.length)]} ${
    passion[Math.floor(Math.random() * passion.length)]
  } ${personalTouch[Math.floor(Math.random() * personalTouch.length)]}`;
};

const usersData = names.map((name, index) => ({
  name: name,
  email: `${name.split(" ").join("").toLowerCase()}@example.com`,
  password: bcrypt.hashSync("password123", 12),
  role: "doctor",
  languages: ["English", index % 2 === 0 ? "French" : "Spanish"],
  country: "Ghana",
  region: index % 2 === 0 ? "Northern Region" : "Southern Region",
  dob: new Date(1985, 1, index + 1),
  city: index % 3 === 0 ? "Tamale" : index % 3 === 1 ? "Accra" : "Kumasi",
  image: index % 2 === 0 ? sampleImageUrl : sampleImageTwoUrl,
  gender: index % 2 === 0 ? "Male" : "Female",
  phone: `+23355500000${index + 1}`,
  createdAt: new Date(),
  updatedAt: new Date(),
  doctorInfo: {
    specialities: [
      specializations[index % specializations.length],
      specializations[(index + 1) % specializations.length],
    ],
    experience: `${5 + index} years`,
    rate: 100 + index * 10,
    rating: Math.round((Math.random() * (5 - 1) + 1) * 10) / 10,
    certifications: [
      certifications[index % certifications.length],
      certifications[(index + 1) % certifications.length],
    ],
    bio: generateBio(
      name,
      specializations[index % specializations.length],
      `${5 + index} years`,
      [
        certifications[index % certifications.length],
        certifications[(index + 1) % certifications.length],
      ]
    ),
  },
}));

async function seedUsersAndProfiles() {
  try {
    await client.connect();
    console.log("Connected to database!");

    const db = client.db(dbName);
    const userCollection = db.collection(userCollectionName);
    const availabilityCollection = db.collection(availabilityCollectionName);

    const userResult = await userCollection.insertMany(usersData);
    console.log(
      `${userResult.insertedCount} doctor users have been successfully seeded!`
    );

    const availabilityDocs = Object.values(userResult.insertedIds).flatMap(
      (userId) => generateAvailability(userId)
    );

    const availabilityResult = await availabilityCollection.insertMany(
      availabilityDocs
    );
    console.log(
      `${availabilityResult.insertedCount} availability records have been successfully seeded!`
    );
  } catch (err) {
    console.error("Error seeding users and profiles:", err);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

seedUsersAndProfiles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
