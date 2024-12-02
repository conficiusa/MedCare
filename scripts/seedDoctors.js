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
  "Sophia Moore",
  "Daniel Taylor",
  "Olivia Anderson",
  "Matthew Thomas",
  "Emma Jackson",
  "Ethan White",
  "Isabella Harris",
  "James Martin",
  "Mia Thompson",
  "Alexander Garcia",
  "Ava Martinez",
  "Benjamin Robinson",
  "Charlotte Clark",
  "Samuel Rodriguez",
  "Amelia Lewis",
  "Joseph Lee",
  "Abigail Walker",
  "Andrew Young",
  "Victoria Hall",
  "Christopher Allen",
  "Grace Wright",
  "Joshua King",
  "Zoe Scott",
  "Nathan Green",
  "Lily Adams",
  "Ryan Baker",
  "Chloe Nelson",
  "Logan Carter",
  "Hannah Perez",
  "Jacob Mitchell",
  "Ella Roberts",
  "Luke Phillips",
  "Scarlett Turner",
  "Henry Evans",
  "Aria Edwards",
  "William Collins",
  "Penelope Parker",
  "Jackson Stewart",
  "Riley Sanchez",
  "Sebastian Morris",
  "Layla Cox",
  "Jack Rogers",
  "Madison Bell",
  "Aiden Murphy",
  "Nora Cooper",
];

const specializations = [
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "General Surgery",
  "Dermatology",
  "Psychiatry",
  "Endocrinology",
  "Ophthalmology",
  "Gastroenterology",
  "Oncology",
  "Nephrology",
  "Pulmonology",
  "Rheumatology",
  "Obstetrics and Gynecology",
];

const certifications = [
  "Board Certified in Internal Medicine",
  "Fellowship in Cardiology",
  "Pediatric Advanced Life Support (PALS) Certified",
  "Advanced Cardiovascular Life Support (ACLS) Certified",
  "Certificate in Neurological Surgery",
  "Dermatology Specialty Certificate",
  "Psychiatry Board Certification",
  "Certificate in Endocrine Disorders",
  "Ophthalmology Clinical Fellowship",
  "Gastroenterology Subspecialty Training",
  "Oncology Research Fellowship",
  "Nephrology Board Certification",
  "Certificate in Pulmonary Medicine",
  "Rheumatology Specialty Certificate",
  "Obstetrics and Gynecology Fellowship",
];

const generateTimeSlots = (date) => {
  const slotsPerDay = 24;
  return Array.from({ length: slotsPerDay }, (_, i) => {
    const startTime = new Date(date);
    startTime.setUTCHours(i, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

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
    date.setUTCDate(today.getUTCDate() + i);
    const expiresAt = new Date(date);
    expiresAt.setUTCDate(expiresAt.getUTCDate() + 1);
    expiresAt.setUTCHours(0, 0, 0, 0);

    return {
      doctorId,
      date,
      expiresAt,
      timeSlots: generateTimeSlots(date),
    };
  });
};

const generateMedia = (index) => {
  if (index % 3 === 0) return ["video"];
  if (index % 3 === 1) return ["chat"];
  return ["video", "chat"];
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
    experience: `${5 + index}`,
    rate: 100 + index * 10,
    rating: Math.round((Math.random() * (5 - 1) + 1) * 10) / 10,
    certifications: [
      certifications[index % certifications.length],
      certifications[(index + 1) % certifications.length],
    ],
    bio: `Dr. ${name} has extensive experience in ${
      specializations[index % specializations.length]
    }`,
    license_number: `LIC-${index + 1000}`,
    account_name: `${name.split(" ")[0]} ${name.split(" ")[1]}`,
    account_number: `12345678${index + 1}`,
    bank: index % 2 === 0 ? "28" : "342",
    payment_channel: index % 2 === 0 ? "mobile money" : "card",
    onboarding_level: 7,
    verification: "approved",
    media: generateMedia(index),
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
