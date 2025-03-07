// lib/mongodb.ts

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
const kmsProviders = {
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY as string,
		secretAccessKey: process.env.AWS_SECRET as string,
	},
};
const keyVaultNamespace = process.env.KEYVAULT_NAMESPACE as string;
if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local"
	);
}

interface Cached {
	conn: Mongoose | null;
	promise: Promise<Mongoose> | null;
}

const cached: Cached = {
	conn: null,
	promise: null,
};

async function connectToDatabase(): Promise<Mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts: mongoose.ConnectOptions = {
			bufferCommands: false,
			dbName: "Medcare",
			autoEncryption: {
				bypassAutoEncryption: true,
				keyVaultNamespace,
				kmsProviders,
			},
		};

		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongooseInstance) => {
				console.log("Connected to MongoDB");
				return mongooseInstance;
			})
			.catch((error) => {
				console.error("MongoDB Connection error:", error);
				throw new Error("MongoDB Connection failed");
			});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export default connectToDatabase;
