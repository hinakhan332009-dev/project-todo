const API = "http://localhost:5000/api";

/* ===================== REGISTER ===================== */
async function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  document.getElementById("msg").innerText = data.message;

  if (res.ok) {
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  }
}

/* ===================== LOGIN ===================== */
async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "tasks.html";
  } else {
    document.getElementById("msg").innerText = data.message;
  }
}

/* ===================== TOKEN ===================== */
function getToken() {
  return localStorage.getItem("token");
}

/* ===================== LOAD TASKS ===================== */
async function loadTasks() {
  const res = await fetch(`${API}/tasks/my`, {
    headers: { Authorization: getToken() }
  });

  const tasks = await res.json();

  let html = "";

  tasks.forEach(task => {
    html += `
      <div class="task">
        <h4>${task.title}</h4>
        <p>${task.description}</p>
        <p>Status: ${task.completed ? "Done" : "Pending"}</p>

        <button onclick="editTask('${task._id}', '${task.title}', '${task.description}')">Edit</button>
        <button onclick="completeTask('${task._id}')">Complete</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;
  });

  if (tasks.length === 0) {
    document.getElementById("taskList").innerHTML =
      "<p>No tasks yet. Add your first task!</p>";
  } else {
    document.getElementById("taskList").innerHTML = html;
  }
}

/* ===================== ADD TASK ===================== */
async function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken()
    },
    body: JSON.stringify({ title, description })
  });

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";

  loadTasks();
}

/* ===================== EDIT TASK ===================== */
async function editTask(id, oldTitle, oldDescription) {
  const title = prompt("Edit Title:", oldTitle);
  const description = prompt("Edit Description:", oldDescription);

  if (!title || !description) return;

  await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken()
    },
    body: JSON.stringify({ title, description })
  });

  loadTasks();
}

/* ===================== COMPLETE TASK ===================== */
async function completeTask(id) {
  await fetch(`${API}/tasks/${id}/complete`, {
    method: "PUT",
    headers: { Authorization: getToken() }
  });

  loadTasks();
}

/* ===================== DELETE TASK ===================== */
async function deleteTask(id) {
  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: getToken() }
  });

  loadTasks();
}

/* ===================== LOGOUT ===================== */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

/* ===================== AUTO LOAD ===================== */
if (window.location.pathname.includes("tasks")) {
  loadTasks();
}