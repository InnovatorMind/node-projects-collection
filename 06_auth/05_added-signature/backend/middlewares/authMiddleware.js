import User from '../models/user.js'; // if needed for lookup/auth
import { mySecretKey } from "../controllers/userController.js";
import crypto from "node:crypto";


export default async function checkAuth(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Not logged in!" });
  }

  const [payload, oldSignature] = token.split(".");
  console.log({ payload, oldSignature });

  const jsonPayload = Buffer.from(payload, "base64url").toString();

  const newSignature = crypto
    .createHash("sha256")
    .update(mySecretKey)
    .update(jsonPayload)
    .update(mySecretKey)
    .digest("base64url");
  
  console.log({oldSignature,newSignature});

  if (oldSignature !== newSignature) {
    res.clearCookie("token");
    console.log("Invalid signature");
    return res.status(401).json({ error: "Not logged in!" });
  }

  const { uid, expiry: expiryTimeInSeconds } = JSON.parse(jsonPayload);

  const currentTimeInSeconds = Math.round(Date.now() / 1000);

  console.log(new Date(currentTimeInSeconds * 1000).toString());
  console.log(new Date(expiryTimeInSeconds * 1000).toString());

  if (currentTimeInSeconds > expiryTimeInSeconds) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Not logged in!" });
  }

  try {
    const user = await User.findOne({ uid });
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: "Invalid user ID" });
    }

    // console.log("IN auth middleware - user found:", user.username);
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth check failed:", err);
    res.status(500).json({ error: "Server error during auth check" });
  }
}
