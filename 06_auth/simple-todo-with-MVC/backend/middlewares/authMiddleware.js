import User from '../models/user.js'; // if needed for lookup/auth

export default async function checkAuth(req, res, next) {
  const { uid } = req.cookies;

  if (!uid) {
    return res.status(401).json({ error: "Not logged in (no cookie)" });
  }

  try {
    const user = await User.findOne({ uid });
    // console.log(user);

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
