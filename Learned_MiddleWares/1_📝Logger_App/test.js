fetch("http://localhost:4000/secret", {
  method: "GET",
  headers: {
    "x-auth": "12345"
  }
})
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
