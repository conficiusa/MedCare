const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

async function seedUsersAndProfiles() {
  const uri =
    "mongodb+srv://addawebadua:2006adda@medcare.jqcyr.mongodb.net";
  const client = new MongoClient(uri);
  const dbName = "Medcare"; // Replace with your database name
  const userCollectionName = "users"; // The collection name to store the users
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
      certifications: [
        certifications[index % certifications.length],
        certifications[(index + 1) % certifications.length],
      ],
      bio: `Dr. ${name} is a highly qualified specialist in ${
        specializations[index % specializations.length]
      } with extensive experience. Known for their empathy and dedication, Dr. ${name} utilizes the latest medical advancements to ensure the best treatment for their patients. They believe in the importance of a strong doctor-patient relationship and advocate for preventive care and education in health management.`,
    },
  }));

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to database!");

    const db = client.db(dbName);
    const userCollection = db.collection(userCollectionName);

    // Insert users data
    const result = await userCollection.insertMany(usersData);
    console.log(
      `${result.insertedCount} doctor users have been successfully seeded!`
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
