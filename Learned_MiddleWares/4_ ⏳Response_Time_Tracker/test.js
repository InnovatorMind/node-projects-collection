// 1. ✅ Test Home Route
fetch("http://localhost:4000/")
  .then((res) => res.text())
  .then((data) => console.log("Home route:", data))
  .catch((err) => console.error("Error (home):", err));

// 2. ⚡ Test Fast Route
fetch("http://localhost:4000/fast")
  .then((res) => res.text())
  .then((data) => console.log("Fast route:", data))
  .catch((err) => console.error("Error (fast):", err));

// 3. 🐢 Test Slow Route
fetch("http://localhost:4000/slow")
  .then((res) => res.text())
  .then((data) => console.log("Slow route:", data))
  .catch((err) => console.error("Error (slow):", err));
