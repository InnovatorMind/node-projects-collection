// 1. ✅ Manual Error via next(new Error)
fetch("http://localhost:4000/manual-error")
  .then((res) => res.json())
  .then((data) => console.log("Manual error route:", data))
  .catch((err) => console.error("Error (manual-error):", err));

// 2. 🔥 Error via throw
fetch("http://localhost:4000/throw-error")
  .then((res) => res.json())
  .then((data) => console.log("Throw error route:", data))
  .catch((err) => console.error("Error (throw-error):", err));

// 3. ⏳ Async Error
fetch("http://localhost:4000/async-error")
  .then((res) => res.json())
  .then((data) => console.log("Async error route:", data))
  .catch((err) => console.error("Error (async-error):", err));

// 4. ❌ Invalid JSON Body (POST /bad-json)
fetch("http://localhost:4000/bad-json", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  // Invalid JSON body on purpose (missing closing quote & bracket)
  body: '{"invalidJson": true',
})
  .then((res) => res.json())
  .then((data) => console.log("Bad JSON POST:", data))
  .catch((err) => console.error("Error (bad-json):", err));

// 5. ✅ Valid JSON Body (for comparison)
fetch("http://localhost:4000/bad-json", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ validJson: true }),
})
  .then((res) => res.text())
  .then((data) => console.log("Valid JSON POST:", data))
  .catch((err) => console.error("Error (valid-json):", err));
