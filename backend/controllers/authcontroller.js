import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    throw new Error("Authentication configuration error");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    console.log("[registerUser] req.body:", req.body);
    // accept either `fullName` or `full_name` from clients
    const { fullName, full_name, email, password } = req.body;
    const name = fullName || full_name || "";

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name: name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      token: generateToken(user._id),
    });

   } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({ error: error.message });
   }
};

export const loginUser = async (req, res) => {
  try {
    console.log("[loginUser] req.body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    return res.json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};