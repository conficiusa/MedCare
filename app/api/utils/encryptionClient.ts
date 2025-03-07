import { MongoClient, ClientEncryption } from "mongodb";

const database = process.env.DATABASE_NAME as string;
const collection = "medicalrecords";
const connectionString = process.env.MONGODB_URI as string;

// Use the Windows DLL with absolute path
const kmsProviders = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET as string,
  },
};

const keyVaultNamespace = process.env.KEYVAULT_NAMESPACE as string;

// Create clients
const regularClient = new MongoClient(connectionString, {
  autoEncryption: {
    bypassAutoEncryption: true,
    keyVaultNamespace,
    kmsProviders,
  },
});
const coll = regularClient.db(database).collection(collection);
const encryption = new ClientEncryption(regularClient, {
  keyVaultNamespace,
  kmsProviders,
});

// Connection state tracking
let regularClientConnected = false;
const connectRegularClient = async (): Promise<MongoClient> => {
  if (!regularClientConnected) {
    await regularClient.connect();
    regularClientConnected = true;
    console.log("Regular MongoDB client connected");
  }
  return regularClient;
};

// Graceful shutdown handler
const closeConnections = async (): Promise<void> => {
  try {
    if (regularClientConnected) {
      await regularClient.close();
      regularClientConnected = false;
      console.log("Regular MongoDB client disconnected");
    }
  } catch (err) {
    console.error("Error closing MongoDB connections:", err);
  }
};

// Register shutdown handlers
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing MongoDB connections...");
  await closeConnections();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Closing MongoDB connections...");
  await closeConnections();
  process.exit(0);
});

export {
  encryption,
  regularClient,
  connectRegularClient,
  closeConnections,
  coll,
};
