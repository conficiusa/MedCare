const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

async function seedUsersAndProfiles() {
  const uri = "mongodb+srv://addawebadua:2006adda@medcare.jqcyr.mongodb.net";
  const client = new MongoClient(uri);
  const dbName = "Medcare"; // Replace with your database name
  const userCollectionName = "users"; // Collection name for users
  const availabilityCollectionName = "availabilities"; // Collection name for availabilities
  const sampleImageUrl =
    "https://xgyzgqc7wzq7cyz6.public.blob.vercel-storage.com/profiles/sampleDoc-ZNAAkbr0wqXBoAKwJ3i8Mi32QIw40T.png";

  const names = [
    "John Smith",
    "Alice Johnson",
    "Robert Brown",
    "Emily Davis",
    "Michael Wilson",
    "Sarah Taylor",
    "David Anderson",
    "Mia Clark",
    "Daniel Lewis",
    "Sophia Walker",
    "James Hall",
    "Ava Young",
    "Joshua King",
    "Isabella Wright",
    "Matthew Scott",
    "Olivia Adams",
    "Ethan Green",
    "Amelia Nelson",
    "Christopher Hill",
    "Charlotte Carter",
    "Andrew Mitchell",
    "Grace Perez",
    "Jacob Roberts",
    "Lily Turner",
    "Ryan Lee",
  ];

  const specializations = [
    "Cardiology",
    "Pediatrics",
    "Dermatology",
    "Orthopedics",
    "Neurology",
    "Gastroenterology",
    "Ophthalmology",
    "Radiology",
    "Psychiatry",
    "Endocrinology",
    "Urology",
    "Pulmonology",
    "Anesthesiology",
    "Oncology",
    "Obstetrics and Gynecology",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
    "Pathology",
    "Hematology",
  ];

  const certifications = [
    "Board Certified in Internal Medicine",
    "Fellowship in Cardiology",
    "Advanced Cardiovascular Life Support (ACLS)",
    "Basic Life Support (BLS)",
    "Pediatric Advanced Life Support (PALS)",
    "Certified in Pain Management",
    "Certified in Geriatric Medicine",
    "Certified Diabetes Educator",
  ];

  // Function to generate random availability for 7 days
  const generateAvailability = (doctorId) => {
    const availability = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      // Generate availability for the next 7 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const timeSlots = [];
      for (let j = 0; j < 5; j++) {
        // Generate 5 random time slots for each day
        const hour = 9 + j; // Time between 9 AM to 1 PM
        timeSlots.push(`${hour}:00-${hour + 1}:00`);
      }
      availability.push({ doctorId, date, timeSlots });
    }
    return availability;
  };

  // More detailed and unique bios
  const generateBio = (name, specialization, experience) => {
    return `Dr. ${name} is a renowned specialist in ${specialization}. With over ${experience} in the field, 
    Dr. ${name} has made significant contributions to medical research and patient care. Their approach is centered 
    on empathy, advanced diagnostics, and patient education. In addition to clinical practice, Dr. ${name} has published 
    multiple papers on ${specialization} and often speaks at international conferences. Known for an unyielding commitment 
    to excellence, they are considered a pioneer in modern ${specialization}. Dr. ${name} is dedicated to providing personalized 
    treatment plans to ensure optimal outcomes for their patients. In their spare time, they mentor young physicians and contribute to community health initiatives.`;
  };

  // Create user data for seeding
  const usersData = names.map((name, index) => ({
    name: name,
    email: `${name.split(" ").join("").toLowerCase()}@example.com`,
    password: bcrypt.hashSync("password123", 12),
    role: "doctor",
    languages: ["English", "Spanish"],
    country: "Ghana",
    region: "Northern Region",
    dob: new Date(1985, 1, index + 1),
    city: "Tamale",
    image: sampleImageUrl,
    gender: index % 2 === 0 ? "Male" : "Female",
    phone: `+23355500000${index + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    doctorInfo: {
      specialties: [
        specializations[index % specializations.length],
        specializations[(index + 1) % specializations.length],
      ],
      experience: `${5 + index} years`,
      rate: 100 + index * 20, // Example rate
      rating: Math.round((Math.random() * (5 - 1) + 1) * 10) / 10, // Random rating
      certifications: [
        certifications[index % certifications.length],
        certifications[(index + 1) % certifications.length],
      ],
      bio: generateBio(
        name,
        specializations[index % specializations.length],
        `${5 + index} years`
      ),
    },
  }));

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to database!");

    const db = client.db(dbName);
    const userCollection = db.collection(userCollectionName);
    const availabilityCollection = db.collection(availabilityCollectionName);

    // Insert users data
    const userResult = await userCollection.insertMany(usersData);
    console.log(
      `${userResult.insertedCount} doctor users have been successfully seeded!`
    );

    // Insert availability data
    const availabilityDocs = Object.values(userResult.insertedIds).flatMap(
      (userId) => generateAvailability(userId) // Generate unique availability for each doctor
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
    // Close the connection
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
