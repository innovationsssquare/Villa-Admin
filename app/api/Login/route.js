import crypto from "crypto";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import Admin from "@/Model/Adminschema";

const verifyPassword = (password, storedPassword) => {
  if (!storedPassword) return false;
  if (!storedPassword.includes(":")) {
    return password === storedPassword;
  }
  const [salt, hash] = storedPassword.split(":");
  const testHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === testHash;
};

export async function POST(req) {
  try {
    const body = await req.json();
    const identifier = (body.email || body.username || "").trim();
    const password = body.password;

    if (!identifier || !password) {
      return Response.json(
        { success: false, error: "Username or email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await Admin.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${identifier}$`, "i") } },
        { fullName: { $regex: new RegExp(`^${identifier}$`, "i") } },
      ],
      deletedAt: null,
    });

    if (!admin) {
      return Response.json(
        { success: false, error: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, admin.password);
    if (!isValid) {
      return Response.json(
        { success: false, error: "Invalid username/email or password" },
        { status: 401 }
      );
    }

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
      { expiresIn: "7d" }
    );

    const adminData = admin.toObject ? admin.toObject() : { ...admin };
    delete adminData.password;

    return Response.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: adminData,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return Response.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
