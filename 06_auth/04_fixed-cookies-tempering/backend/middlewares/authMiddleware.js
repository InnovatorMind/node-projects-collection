import User from '../models/user.js'; // if needed for lookup/auth

export default async function checkAuth(req, res, next) {
  let { uid } = req.cookies;
  console.log(uid);

  if (!uid) {
    return res.status(401).json({ error: "Not logged in (no cookie)" });
  }

  const { id, expiry: expiryTimeInSeconds } = JSON.parse(
    Buffer.from(uid, "base64url").toString()
  );

  console.log({ id, expiry: expiryTimeInSeconds });
  const currentTimeInSeconds = Math.round(Date.now() / 1000);
  console.log(new Date(currentTimeInSeconds * 1000).toString());
  console.log(new Date(expiryTimeInSeconds * 1000).toString());

  if (currentTimeInSeconds > expiryTimeInSeconds) {
    res.clearCookie("uid");
    return res.status(401).json({ error: "Not logged in!" });
  }

  try {
    uid = id;
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
