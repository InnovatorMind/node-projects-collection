import usersData from './usersDB.json' with {type: "json"}

export default function checkAuth(req, res, next) {
  const { uid } = req.cookies;
  const user = usersData.find((user) => user.uid === uid);
  if (!uid || !user) {
    console.log("yes");
    return res.status(401).json({ error: "Not logged!" });
  }
  console.log("IN auth middleware");
  next()
}
