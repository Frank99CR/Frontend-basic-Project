document.addEventListener("DOMContentLoaded", () => {
  const userId = document.getElementById("userId");
  const userEmail = document.getElementById("email-input");
  const userPassword = document.getElementById("password-input");
  const button = document.getElementById("login-button");

  if (!userId || !userEmail || !userPassword || !button) {
    console.error("One or more elements not found.");
    return;
  }

  button.addEventListener("click", async () => {
    if (!userId.value || !userEmail.value || !userPassword.value) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.restful-api.dev/objects/${userId.value}`
      );

      if (!response.ok) {
        const result = await response.json();
        console.error("Login failed:", result);
        alert("Error during login: " + (result.message || "Unknown error"));
        return;
      }

      const result = await response.json();
      console.log("Login result:", result);
      const userName = result.data.name;

      if (
        result.data &&
        result.data.userEmail === userEmail.value &&
        result.data.userPassword === userPassword.value
      ) {
        alert("Login Successful!");
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userID", userId.value);
        localStorage.setItem("name", userName);
        window.location.href = "/finalProject/html/drag&drop.html";
      } else {
        alert("Incorrect email or password.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred: " + error.message);
    }
  });
});
