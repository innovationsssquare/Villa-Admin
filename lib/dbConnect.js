import dns from "node:dns";
import mongoose from "mongoose";

// Set DNS servers to resolve MongoDB SRV issues (e.g. querySrv ECONNREFUSED)
try {
  dns.setDefaultResultOrder?.("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  console.warn("Failed to set DNS servers in dbConnect:", e);
}

const dbConnect = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    dns.setDefaultResultOrder?.("ipv4first");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {}
  await mongoose.connect(process.env.MONGODB_URI);
};

export default dbConnect;
