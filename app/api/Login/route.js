import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";
import  connectDB  from "@/lib/dbConnect"; 
import Admin from "@/Model/Adminschema";  

export async function POST(req) {
  const { idToken } = await req.json();

  const decoded = await verifyFirebaseIdToken(idToken);
  if (!decoded) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  const { uid, email, name, picture, firebase } = decoded;

  await connectDB();

  let admin = await Admin.findOne({ firebaseUID: uid });
  if (!admin) {
    admin = await Admin.create({
      firebaseUID: uid,
      email,
      fullName:name,
      profilePic: picture,
      isSuperAdmin:true,
    });
  }

  return Response.json({ success: true, admin: admin ,token:idToken});
}
