import express from "express";
import { loginOrSignUp, refreshToken, phoneLogin } from "../controllers/user.js";
const router = express.Router();
router.post("/login", loginOrSignUp);
router.post("/phone-login", phoneLogin);
router.post("/refresh", refreshToken);
export default router;