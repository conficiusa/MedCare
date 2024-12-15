const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const uri = "mongodb+srv://addawebadua:2006adda@medcare.jqcyr.mongodb.net";
const client = new MongoClient(uri);
const dbName = "Medcare";
const userCollectionName = "users";
const availabilityCollectionName = "availabilities";

const sampleImageUrl =
  "https://xgyzgqc7wzq7cyz6.public.blob.vercel-storage.com/1733850094847-doctormale-KeiKFnKcLFEaQ6fJjszq8txz0Dxz2m.jpg";
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
};

const generateBio = (name, specialization, experience, certifications) => {
  const introduction = [
    `With a heart dedicated to healing and a mind committed to knowledge, Dr. ${name} has carved a niche in ${specialization.toLowerCase()} over ${experience}.,
    Known for an exceptional commitment to patient care, Dr. ${name} has over ${experience} specializing in ${specialization.toLowerCase()}, where their expertise shines.,
    Driven by a passion for bettering lives, Dr. ${name} has spent ${experience} excelling in ${specialization.toLowerCase()}.`,
  ];

  const achievements = [
    ` Holding certifications such as ${certifications.join(
      ", "
    )}, Dr. ${name} continually pursues excellence.,
    With esteemed qualifications like ${certifications.join(
      ", "
    )}, Dr. ${name} is regarded for skillful and compassionate care.,
    Certified in areas such as ${certifications.join(
      ", "
    )}, Dr. ${name} brings trusted and specialized knowledge.`,
  ];

  const approach = [
    `A blend of empathy and expertise defines Dr. ${name}'s approach, making each patient feel understood and valued.`,
    `Patients often commend Dr. ${name} for their comforting demeanor and sharp diagnostic abilities.`,
    `With a keen eye for detail and a warm bedside manner, Dr. ${name} provides a unique blend of care and accuracy.`,
    `Dr. ${name} is known for their patient-centric approach, ensuring that each individual receives personalized care.`,
    `Combining modern techniques with traditional values, Dr. ${name} offers a holistic approach to treatment.`,
  ];

  const passion = [
    `Outside the clinic, Dr. ${name} is an avid advocate for community health awareness and often hosts workshops to educate the public.`,
    `An advocate for holistic wellness, Dr. ${name} believes in empowering patients with knowledge for better long-term health.`,
    `Passionate about advancing medical practices, Dr. ${name} frequently participates in conferences to share insights with peers.`,
    `Dr. ${name} is dedicated to continuous learning and often engages in research to stay at the forefront of medical advancements.`,
    `Committed to giving back, Dr. ${name} volunteers at local health camps and supports various health initiatives.`,
  ];

  const personalTouch = [
    `When not seeing patients, Dr. ${name} enjoys spending time with family, cooking new recipes, and reading about advances in ${specialization.toLowerCase()}.`,
    `In personal life, Dr. ${name} loves hiking and finds solace in nature, which inspires a calm approach in their medical practice.`,
    `Outside the medical realm, Dr. ${name} is a fan of classical music and often volunteers for local health events.`,
    `Dr. ${name} enjoys painting and finds it a great way to relax and express creativity.`,
    `In their free time, Dr. ${name} loves traveling and exploring different cultures, which enriches their understanding of diverse patient backgrounds.`,
  ];
  const experienceDetails = [
    `Dr. ${name} has been practicing for over ${experience}, during which they have successfully treated numerous complex cases in ${specialization.toLowerCase()}.`,
    `With a career spanning ${experience}, Dr. ${name} has gained extensive experience in ${specialization.toLowerCase()}, making them a trusted name in the field.`,
    `Over the past ${experience}, Dr. ${name} has honed their skills in ${specialization.toLowerCase()}, earning a reputation for excellence and dedication.`,
  ];

  const patientFeedback = [
    `Patients appreciate Dr. ${name}'s thorough approach and ability to explain complex medical conditions in an understandable manner.`,
    `Dr. ${name} is known for their compassionate care and ability to make patients feel at ease during consultations.`,
    `Many patients have praised Dr. ${name} for their attentiveness and willingness to go the extra mile to ensure the best possible outcomes.`,
  ];

  const communityInvolvement = [
    `Dr. ${name} is actively involved in community health initiatives, often organizing free health camps and awareness programs.`,
    `In addition to their clinical practice, Dr. ${name} volunteers at local shelters, providing medical care to underserved populations.`,
    `Dr. ${name} frequently collaborates with non-profit organizations to improve healthcare access and education in the community.`,
  ];

  return `${introduction[Math.floor(Math.random() * introduction.length)]} ${
    achievements[Math.floor(Math.random() * achievements.length)]
  } ${approach[Math.floor(Math.random() * approach.length)]} ${
    passion[Math.floor(Math.random() * passion.length)]
  } ${personalTouch[Math.floor(Math.random() * personalTouch.length)]} ${
    experienceDetails[Math.floor(Math.random() * experienceDetails.length)]
  } ${patientFeedback[Math.floor(Math.random() * patientFeedback.length)]} ${
    communityInvolvement[Math.floor(Math.random() * communityInvolvement.length)]
  }`;

  return `${introduction[Math.floor(Math.random() * introduction.length)]} ${
    achievements[Math.floor(Math.random() * achievements.length)]
  } ${approach[Math.floor(Math.random() * approach.length)]} ${
    passion[Math.floor(Math.random() * passion.length)]
  } ${personalTouch[Math.floor(Math.random() * personalTouch.length)]}`;
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

const usersData = names.map((name, index) => {
  const specialization1 = specializations[index % specializations.length];
  const specialization2 = specializations[(index + 1) % specializations.length];
  const certification1 = certifications[index % certifications.length];
  const certification2 = certifications[(index + 1) % certifications.length];

  return {
    name: name,
    email: `${name.split(" ").join("").toLowerCase()}${Math.floor(
      Math.random() * 10000
    )}@example.com`,
    password: bcrypt.hashSync("password123", 12),
    role: "doctor",
    languages: ["English", index % 2 === 0 ? "French" : "Spanish"],
    country: "Ghana",
    region: index % 2 === 0 ? "Northern Region" : "Southern Region",
    dob: new Date(1985, 1, index + 1),
    city: index % 3 === 0 ? "Tamale" : index % 3 === 1 ? "Accra" : "Kumasi",
    image: index % 2 === 0 ? sampleImageUrl : sampleImageTwoUrl,
    gender: index % 2 === 0 ? "Male" : "Female",
    phone: `+233555000${Math.floor(100 + index)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    doctorInfo: {
      specialities: [specialization1, specialization2],
      experience: `${5 + index}`,
      rate: 100 + index * 10,
      rating: Math.round((Math.random() * (5 - 1) + 1) * 10) / 10,
      certifications: [certification1, certification2],
      bio: `Dr. ${name} specializes in ${specialization1} and has demonstrated excellence in their field. Patients commend Dr. ${name} for their dedication, expertise, and ability to build lasting patient relationships. They are certified in ${certification1} and ${certification2}, continually advancing healthcare excellence.`,
      license_number: `LIC-${Math.floor(1000 + index * 3)}`,
      account_name: `${name.split(" ")[0]} ${name.split(" ")[1]}`,
      account_number: `${Math.floor(12345678 + index * 101)}`,
      bank: index % 2 === 0 ? "28" : "342",
      payment_channel: index % 2 === 0 ? "mobile money" : "card",
      onboarding_level: 7,
      verification: "approved",
      media: generateMedia(index),
    },
  };
});

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
