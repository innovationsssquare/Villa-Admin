const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  firebaseUID: { type: String, unique: true, sparse: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  mobile: { type: String },
  profilePic: { type: String },
  isSuperAdmin: { type: Boolean, default: false },
  permissions: {
    type: [String],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

delete mongoose.models.Admin;
const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
