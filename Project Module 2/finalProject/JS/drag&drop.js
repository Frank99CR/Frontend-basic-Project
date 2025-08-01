const button = document.getElementById("add-button");
const task = document.getElementById("task");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTask = document.getElementById("modal-task");
const saveTask = document.getElementById("save-task");
const removeTask = document.getElementById("remove-task");
const creationDate = document.getElementById("creation-date");
const buttonOff = document.getElementById("signoff-button");
const userNameElement = document.getElementById("user-name");

let currentItem = null;

const addTask = async () => {
  const time = new Date().toLocaleString();
  const item = document.createElement("div");
  item.className = "list-item";
  item.setAttribute("draggable", "true");
  item.setAttribute("data-id", Date.now());
  item.setAttribute("data-time", time);
  item.setAttribute("data-status", "left");
  item.textContent = task.value;
  item.addEventListener("click", openModal);
  item.addEventListener("dragstart", dragStart);
  item.addEventListener("dragend", dragEnd);

  const list = document.getElementById("left");
  list.appendChild(item);
  await addTaskToUser(item, "left");

  task.value = "";
};

button.addEventListener("click", addTask);

const addTaskToUser = async (task) => {
  try {
    const userId = localStorage.getItem("userID");

    const response = await fetch(
      `https://api.restful-api.dev/objects/${userId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching user data");
    }

    const userData = await response.json();

    const taskData = {
      id: task.getAttribute("data-id"),
      time: task.getAttribute("data-time"),
      content: task.textContent,
      status: task.getAttribute("data-status"),
    };

    if (!userData.data.tasks) {
      userData.data.tasks = [];
    }

    userData.data.tasks.push(taskData);

    const updateResponse = await fetch(
      `https://api.restful-api.dev/objects/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Error updating user data");
    }

    const updatedUserData = await updateResponse.json();
    console.log("User data updated successfully:", updatedUserData);
    // alert("Task added to user's task list!");
  } catch (error) {
    console.error("Error adding task to user:", error);
  }
};

const loadTasks = async () => {
  const userId = localStorage.getItem("userID");

  try {
    const response = await fetch(
      `https://api.restful-api.dev/objects/${userId}`
    );
    const userData = await response.json();
    const tasks = userData.data.tasks || [];

    tasks.forEach((task) => {
      const item = document.createElement("div");
      item.className = "list-item";
      item.setAttribute("draggable", "true");
      item.setAttribute("data-id", task.id);
      item.setAttribute("data-time", task.time);
      item.setAttribute("data-status", task.status);
      item.textContent = task.content;
      item.addEventListener("click", openModal);
      item.addEventListener("dragstart", dragStart);
      item.addEventListener("dragend", dragEnd);

      const column = document.getElementById(task.status);
      if (column) {
        column.appendChild(item);
      }
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
};

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const userId = localStorage.getItem("userID");

    const response = await fetch(
      `https://api.restful-api.dev/objects/${userId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching user data");
    }

    const userData = await response.json();

    const taskToUpdate = userData.data.tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      taskToUpdate.status = newStatus;
    }

    const updateResponse = await fetch(
      `https://api.restful-api.dev/objects/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Error updating task status");
    }

    console.log("Task status updated successfully!");
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

const deleteTaskFromAPI = async (taskId) => {
  const userId = localStorage.getItem("userID");

  try {
    const response = await fetch(
      `https://api.restful-api.dev/objects/${userId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching user data");
    }

    const userData = await response.json();

    const taskIndex = userData.data.tasks.findIndex(
      (task) => task.id === taskId
    );

    if (taskIndex !== -1) {
      userData.data.tasks.splice(taskIndex, 1);
    }

    const updateResponse = await fetch(
      `https://api.restful-api.dev/objects/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Error deleting task");
    }

    console.log("Task deleted successfully!");
  } catch (error) {
    console.error("Error deleting task: ", error);
  }
};

const updateTaskContentFromAPI = async (taskId, updatedContent) => {
  const userId = localStorage.getItem("userID");

  try {
    const response = await fetch(
      `https://api.restful-api.dev/objects/${userId}`
    );

    if (!response.ok) {
      throw new Error("Error fetching user data");
    }

    const userData = await response.json();

    if (userData && userData.data && userData.data.tasks) {
      const taskToUpdate = userData.data.tasks.find(
        (task) => task.id === taskId
      );

      if (taskToUpdate) {
        taskToUpdate.content = updatedContent;

        const updateResponse = await fetch(
          `https://api.restful-api.dev/objects/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );

        if (!updateResponse.ok) {
          throw new Error("Error updating task content in API");
        }

        console.log("Task updated successfully!");
      } else {
        console.log("Task not found!");
      }
    } else {
      console.log("No tasks found in user data.");
    }
  } catch (error) {
    console.log("Error updating task content: ", error);
  }
};

const loadUserName = async () => {
  const userId = localStorage.getItem("userID");

  if (!userId) {
    console.error("User ID not found. Please log in again.");
    window.location.href = "/finalProject/html/login.html";
    return;
  }

  try {
    const response = await fetch(
      `https://api.restful-api.dev/objects/${userId}`
    );

    if (!response.ok) {
      throw new Error("Error fetching user data from API");
    }

    const userData = await response.json();
    console.log(userData);

    const userName = userData.name;
    console.log(userName);
    const userLastName = userData.data.userLastName;
    console.log(userLastName);

    userNameElement.textContent = userName + " " +userLastName;
  } catch (error) {
    console.error("Error fetching user data: ", error);
  }
};

const dragStart = (event) => {
  event.dataTransfer.setData(
    "text/plain",
    event.target.getAttribute("data-id")
  );
  event.target.style.opacity = "0.5";
};

const dragEnd = (event) => {
  event.target.style.opacity = "1";
};

const dragOver = (event) => {
  event.preventDefault();
};

const drop = async (event) => {
  event.preventDefault();

  const id = event.dataTransfer.getData("text/plain");
  const dropzone = event.target;

  if (dropzone.classList.contains("list-container")) {
    const originalElement = document.querySelector(
      `.list-item[data-id="${id}"]`
    );
    if (originalElement) {
      const newElement = document.createElement("div");
      newElement.className = "list-item";
      newElement.setAttribute("draggable", "true");
      newElement.setAttribute("data-id", id);
      newElement.setAttribute(
        "data-time",
        originalElement.getAttribute("data-time")
      );
      newElement.textContent = originalElement.textContent;
      newElement.addEventListener("click", openModal);
      newElement.addEventListener("dragstart", dragStart);
      newElement.addEventListener("dragend", dragEnd);

      let newStatus = "";
      if (dropzone.id === "left") {
        newStatus = "left";
      } else if (dropzone.id === "center") {
        newStatus = "center";
      } else if (dropzone.id === "right") {
        newStatus = "right";
      }

      newElement.setAttribute("data-status", newStatus);

      dropzone.appendChild(newElement);
      originalElement.remove();

      await updateTaskStatus(id, newStatus);
    }
  }
};

const openModal = (event) => {
  currentItem = event.target;
  modalTask.value = currentItem.textContent;
  creationDate.textContent = `Created: ${currentItem.getAttribute(
    "data-time"
  )}`;
  modal.style.display = "block";
};

const closeModalHandler = () => {
  modal.style.display = "none";
};

const saveTaskHandler = async () => {
  if (currentItem) {
    const taskId = currentItem.getAttribute("data-id");
    currentItem.textContent = modalTask.value;
    const updatedValue = currentItem.textContent;
    closeModalHandler();
    await updateTaskContentFromAPI(taskId, updatedValue);
  }
};

const deleteTask = async () => {
  if (currentItem) {
    const taskId = currentItem.getAttribute("data-id");
    currentItem.remove();
    closeModalHandler();
    await deleteTaskFromAPI(taskId);
  }
};

closeModal.addEventListener("click", closeModalHandler);
saveTask.addEventListener("click", saveTaskHandler);
removeTask.addEventListener("click", deleteTask);

const containers = document.querySelectorAll(".list-container");
containers.forEach((container) => {
  container.addEventListener("dragover", dragOver);
  container.addEventListener("drop", drop);
});

if (!localStorage.getItem("authToken")) {
  window.location.href = "/finalProject/html/login.html";
} else {
  console.log("Session Active!");
  loadUserName();
  loadTasks();
}

const logOut = () => {
  localStorage.removeItem("authToken");
  window.location.href = "/finalProject/html/index.html";
};

buttonOff.addEventListener("click", logOut);
