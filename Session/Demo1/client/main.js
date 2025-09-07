
(async function fetchData(params) {
    const response = await fetch("http://localhost:3000/dashboard/",  {
        credentials: "include"  // 👈 send and receive cookies
    });
    const data = await response.text();
    console.log(data);
    document.getElementById("para").innerText = data;
})();