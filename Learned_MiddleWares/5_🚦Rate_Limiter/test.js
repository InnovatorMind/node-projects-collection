// ✅ GET Route
fetch("http://localhost:4000/", {
  method: "GET",
})
  .then((res) => res.text())
  .then((data) => console.log("Public route:", data))
  .catch((err) => console.error("Error (public):", err));