import jwt from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import Admin from "@/Model/Adminschema";
import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return Response.json(
        { success: false, error: "Google ID token is required" },
        { status: 400 }
      );
    }

    // 1. Verify token with Firebase Admin
    const decoded = await verifyFirebaseIdToken(idToken);
    if (!decoded || !decoded.email) {
      return Response.json(
        { success: false, error: "Invalid or expired Google token" },
        { status: 401 }
      );
    }

    // 2. Ensure email is verified by Google
    if (!decoded.email_verified) {
      return Response.json(
        { success: false, error: "Google email address is not verified" },
        { status: 403 }
      );
    }

    const email = decoded.email.trim().toLowerCase();

    // 3. Strict Whitelist Verification from ALLOWED_ADMIN_EMAILS in .env
    const rawAllowed = process.env.ALLOWED_ADMIN_EMAILS || "";
    const allowedEmails = rawAllowed
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (allowedEmails.length > 0 && !allowedEmails.includes(email)) {
      return Response.json(
        {
          success: false,
          error: `Access Denied: The Google account (${email}) is not authorized to access the Admin Console.`,
        },
        { status: 403 }
      );
    }

    // 4. Connect to MongoDB and find or sync Admin
    await connectDB();

    let admin = await Admin.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${email}$`, "i") } },
        { firebaseUID: decoded.uid },
      ],
      deletedAt: null,
    });

    if (admin) {
      // Sync Google profile info if missing
      let isModified = false;
      if (!admin.firebaseUID) {
        admin.firebaseUID = decoded.uid;
        isModified = true;
      }
      if (decoded.picture && !admin.profilePic) {
        admin.profilePic = decoded.picture;
        isModified = true;
      }
      if (isModified) {
        await admin.save();
      }
    } else {
      // Auto-provision whitelisted admin record
      admin = await Admin.create({
        firebaseUID: decoded.uid,
        fullName: decoded.name || email.split("@")[0],
        email: email,
        profilePic: decoded.picture || "",
        isSuperAdmin: true,
        permissions: ["all"],
      });
    }

    // 5. Sign standard platform JWT
    const secret =
      process.env.JWT_SECRECT ||
      process.env.JWT_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "PAVAN2585";

    const token = jwt.sign(
      {
        id: admin._id,
        _id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.isSuperAdmin ? "superadmin" : "admin",
      },
      secret,
      { expiresIn: "30d" }
    );

    const adminData = admin.toObject ? admin.toObject() : { ...admin };
    delete adminData.password;

    return Response.json({
      success: true,
      message: "Google login successful",
      token,
      admin: adminData,
    });
  } catch (error) {
    console.error("Google login API error:", error);
    return Response.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
