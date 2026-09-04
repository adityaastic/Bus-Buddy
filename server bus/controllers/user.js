import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔹 Token generate karne ka helper
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user?._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user?._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );

  return { accessToken, refreshToken };
};

// 🔹 Login / Signup with Google
const loginOrSignUp = async (req, res) => {
  console.log("Login/Signup request received");
  const { id_token } = req.body;
  console.log("ID Token received:", id_token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("Google ID Token verified");

    const payload = ticket.getPayload();
    const { email, sub: google_id, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ error: "Email not verified by Google" });
    }

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        google_id,
        email,
        name,
        user_photo: picture,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user.toObject());

    res.status(200).json({
      user,
      accessToken,
      refreshToken,
      isNewUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to authenticate with Google." });
  }
};

// 🔹 Refresh Token handler
const refreshToken = async (req, res) => {
  const { refreshToken: reqRefreshToken } = req.body;
  console.log("Refresh token request received");
  if (!reqRefreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(
      reqRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

// 🔹 Phone Login / OTP Bypass (OTP: 1234)
const phoneLogin = async (req, res) => {
  console.log("Phone login request received:", req.body);
  const { phone, otp } = req.body;

  if (!phone || String(phone).trim().length !== 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number" });
  }

  if (otp && String(otp).trim() !== "1234") {
    return res.status(400).json({ error: "Invalid OTP. Use default OTP: 1234" });
  }

  const cleanPhone = String(phone).trim();

  try {
    let user = await User.findOne({ phone: cleanPhone });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        phone: cleanPhone,
        email: `${cleanPhone}@busbuddy.com`,
        name: `User ${cleanPhone.slice(-4)}`,
        user_photo: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user.toObject());

    res.status(200).json({
      user,
      accessToken,
      refreshToken,
      isNewUser,
    });
  } catch (error) {
    console.error("Phone login error:", error);
    res.status(500).json({ error: "Failed to authenticate with phone number." });
  }
};

// ✅ Export loginOrSignUp, phoneLogin & refreshToken
export { loginOrSignUp, phoneLogin, refreshToken };

