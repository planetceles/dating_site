document.getElementById("getStartedBtn").addEventListener("click", () => {
    document.getElementById("loginForm").classList.remove("hidden");
});

function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginnPassword").value;

    fetch("/login", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("userId", data.userId);
                alert("Login successful!");
                window.location.href = "/profile.html";
            } else {
                alert("Login failed");
            }
        
        });
    
}