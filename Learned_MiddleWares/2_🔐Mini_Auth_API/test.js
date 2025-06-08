// ✅ GET Public Route
fetch("http://localhost:4000/", {
  method: "GET",
})
  .then((res) => res.text())
  .then((data) => console.log("Public route:", data))
  .catch((err) => console.error("Error (public):", err));

// ✅ GET Protected Route (success)
fetch("http://localhost:4000/dashboard", {
  method: "GET",
  headers: {
    "x-auth": "letmein", // ✅ Correct token
  },
})
  .then((res) => res.text())
  .then((data) => console.log("Protected route:", data))
  .catch((err) => console.error("Error (dashboard):", err));

// ❌ GET Protected Route (fail)
fetch("http://localhost:4000/dashboard", {
  method: "GET",
})
  .then((res) => res.json())
  .then((data) => console.log("Protected fail:", data))
  .catch((err) => console.error("Error (unauth):", err));

// ✅ POST Protected Route (with body)
fetch("http://localhost:4000/data", {
  method: "POST",
  headers: {
    "x-auth": "letmein",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "ChatGPT", role: "AI Assistant" }),
})
  .then((res) => res.json())
  .then((data) => console.log("POST success:", data))
  .catch((err) => console.error("Error (POST):", err));
