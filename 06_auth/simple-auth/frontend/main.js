const responseBox = document.getElementById("response");

// Register Form Submission
document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const res = await fetch("http://localhost:4000/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "/dashboard.html"; // ✅ Redirect after successful register
    } else {
      responseBox.innerText = data.message || "Registration failed!";
    }
  } catch (err) {
    responseBox.innerText = "Registration failed!";
    console.error(err);
  }
});

// Login Form Submission
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:4000/user/login", {
      credentials: "include", 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ Required if using cookies
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "/dashboard.html"; // ✅ Redirect after successful login
      console.log({login: "Sucess"})
    } else {
      responseBox.innerText = data.message || "Login failed!";
    }
  } catch (err) {
    responseBox.innerText = "Login failed!";
    console.error(err);
  }
});

