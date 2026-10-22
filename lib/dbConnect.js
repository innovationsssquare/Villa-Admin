import mongoose from "mongoose";

const dbConnect = async () => {
  if (mongoose.connections[0]?.readyState) return;

  const primaryUri = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI;
  if (!primaryUri) {
    throw new Error("MongoDB connection URI is not defined in environment variables (MONGODB_URI_DIRECT or MONGODB_URI)");
  }

  try {
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (directErr) {
    console.warn("Direct MongoDB connect attempt error, trying fallback URI:", directErr.message);
    const fallbackUri = process.env.MONGODB_URI || primaryUri;
    await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 8000,
    });
  }
};

export default dbConnect;

