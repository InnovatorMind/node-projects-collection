const responseBox = document.getElementById("response");

// Register Form Submission
document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("registerEmail").value;
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const res = await fetch("http://localhost:4000/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
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

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:4000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ Required if using cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "/dashboard.html"; // ✅ Redirect after successful login
      console.log({ login: "Success" });
    } else {
      responseBox.innerText = data.message || "Login failed!";
    }
  } catch (err) {
    responseBox.innerText = "Login failed!";
    console.error(err);
  }
});
