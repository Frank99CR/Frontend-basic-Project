document.addEventListener("DOMContentLoaded", () => {
  const userId = document.getElementById("userId");
  const userName = document.getElementById("name-input");
  const userLastName = document.getElementById("lastName-input");
  const userEmail = document.getElementById("email-input");
  const userPassword = document.getElementById("password-input");

  const button = document.getElementById("create-button");

  button.addEventListener("click", () => {
    if (
      !userName.value ||
      !userLastName.value ||
      !userEmail.value ||
      !userPassword.value
    ) {
      alert("Please fill in all fields.");
      return;
    }
    const userData2 = {
      name: userName.value,
      data: {
        userLastName: userLastName.value,
        userEmail: userEmail.value,
        userPassword: userPassword.value,
        userAdress: "New York",
        tasks: [],
      },
    };
    createUser(userData2);
  });

  async function createUser(userData2) {
    try {
      const response = await fetch(`https://api.restful-api.dev/objects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData2),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Success:", result);
        alert("User Created!");
        const idUser = result.id;
        alert(`This is your ID to login: ${idUser}`);
        window.location.href = "/finalProject/html/login.html";
      } else {
        console.log("Failed to create user:", result);
        alert("Error creating user: " + result.message);
      }
    } catch (error) {
      console.log("Error:", error);
      alert("An error occurred: " + error.message);
    }
  }
});
