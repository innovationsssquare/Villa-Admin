import mongoose from "mongoose";

// Direct standard replica set URI (bypasses Windows DNS SRV ECONNREFUSED issues)
const DIRECT_MONGODB_URI =
  "mongodb://innovationsssquare:Pavan%402585@villaandcamping-shard-00-00.qckc1.mongodb.net:27017,villaandcamping-shard-00-01.qckc1.mongodb.net:27017,villaandcamping-shard-00-02.qckc1.mongodb.net:27017/villaandcamping?ssl=true&authSource=admin&replicaSet=atlas-eqs7jo-shard-0&retryWrites=true&w=majority";

const dbConnect = async () => {
  if (mongoose.connections[0]?.readyState) return;

  const primaryUri = process.env.MONGODB_URI_DIRECT || DIRECT_MONGODB_URI;

  try {
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (directErr) {
    console.warn("Direct MongoDB connect attempt error, trying fallback URI:", directErr.message);
    const fallbackUri = process.env.MONGODB_URI || DIRECT_MONGODB_URI;
    await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 8000,
    });
  }
};

export default dbConnect;

