const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

async function seedUsersAndProfiles() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  const dbName = "Medcare"; // Replace with your database name
  const userCollectionName = "users"; // The collection name to store the users
  const profileCollectionName = "doctors"; // The collection name to store profiles
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
    street: `Street ${index + 1}`,
    digitalAddress: `DA-000-${index + 1}`,
    image: sampleImageUrl,
    gender: index % 2 === 0 ? "Male" : "Female",
    phone: `+23355500000${index + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
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

    // Retrieve inserted user IDs
    const insertedIds = result.insertedIds;

    // Prepare profiles data
    const profilesData = Object.keys(insertedIds).map((key, index) => ({
      userId: insertedIds[key],
      specialization: specializations[index % specializations.length], // Cycle through specializations
      bio: `Dr. ${names[index]} is a highly qualified specialist in ${
        specializations[index % specializations.length]
      } with extensive experience. They are committed to providing exceptional care and improving patient outcomes. Known for their empathy and dedication, Dr. ${
        names[index]
      } utilizes the latest medical advancements and practices to ensure the best treatment for their patients. They believe in the importance of a strong doctor-patient relationship and advocate for preventive care and education in health management.`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert profiles data
    const profileCollection = db.collection(profileCollectionName);
    const profileResult = await profileCollection.insertMany(profilesData);
    console.log(
      `${profileResult.insertedCount} profiles have been successfully created for the doctors!`
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
