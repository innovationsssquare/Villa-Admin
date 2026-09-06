import dns from "node:dns";
import { MongoClient } from "mongodb";

// Set DNS servers to resolve MongoDB SRV issues (e.g. querySrv ECONNREFUSED)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Failed to set DNS servers in mongodb client:", e);
}

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

export default clientPromise;
