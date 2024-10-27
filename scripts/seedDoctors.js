const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

async function seedUsersAndProfiles() {
  const uri = "mongodb+srv://addawebadua:2006adda@medcare.jqcyr.mongodb.net";
  const client = new MongoClient(uri);
  const dbName = "Medcare";
  const userCollectionName = "users";
  const availabilityCollectionName = "availabilities";
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
    "Certified in Pain Management",
    "Certified in Geriatric Medicine",
    "Certified Diabetes Educator",
    "Neonatal Resuscitation Program",
    "Certified Asthma Educator",
    "Certified Nephrology Nurse",
    "Certified Pediatric Nurse",
    "Pediatric Advanced Life Support (PALS)",
    "Advanced Trauma Life Support (ATLS)",
    "Certified Midwife",
    "Certified Registered Nurse Anesthetist (CRNA)",
  ];

  const formatTimeSlot = (hour) => {
    const nextHour = hour + 1;
    const formattedCurrentHour = hour <= 12 ? hour : hour - 12;
    const formattedNextHour = nextHour <= 12 ? nextHour : nextHour - 12;
    const period = hour < 12 ? "AM" : "PM";
    const nextPeriod = nextHour < 12 ? "AM" : "PM";
    return `${formattedCurrentHour}:00${period} - ${formattedNextHour}:00${nextPeriod}`;
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8 + Math.floor(Math.random() * 3);
    for (let i = 0; i < 5; i++) {
      slots.push(formatTimeSlot(startHour + i));
    }
    return slots;
  };

  const generateAvailability = (doctorId) => {
    const availability = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i + Math.floor(Math.random() * 3));
      availability.push({ doctorId, date, timeSlots: generateTimeSlots() });
    }
    return availability;
  };

  const generateBio = (name, specialization, experience) => {
    return `Dr. ${name} is a highly skilled ${specialization} specialist with over ${experience} in their field. 
    Known for their innovative treatments, Dr. ${name} combines clinical expertise with a compassionate approach 
    to help patients achieve optimal health. They have authored several peer-reviewed publications on the latest 
    advancements in ${specialization}. Dr. ${name} is passionate about educating patients and promoting preventative 
    healthcare strategies to reduce hospital readmissions.`;
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
      rate: 100 + index * 20,
      rating: Math.round((Math.random() * (5 - 1) + 1) * 10) / 10,
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
