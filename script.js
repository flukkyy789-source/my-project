const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function renderTasks() {
  const search = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  const filtered = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search);
    const matchesFilter =
      filter === "all" ||
      (filter === "done" && task.done) ||
      (filter === "pending" && !task.done);
    return matchesSearch && matchesFilter;
  });

  taskList.innerHTML = "";
  emptyMessage.style.display = filtered.length ? "none" : "block";

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} aria-label="สถานะงาน">
      <div class="task-info">
        <div class="title"></div>
        <div class="date">${task.date ? "กำหนดส่ง: " + task.date : "ไม่ได้กำหนดวันส่ง"}</div>
      </div>
      <button class="delete">ลบ</button>
    `;

    li.querySelector(".title").textContent = task.title;
    li.querySelector("input").addEventListener("change", () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    li.querySelector(".delete").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

function addTask() {
  const title = taskInput.value.trim();
  if (!title) {
    alert("กรุณาใส่ชื่องาน");
    return;
  }

  tasks.push({
    id: Date.now(),
    title,
    date: dateInput.value,
    done: false
  });

  saveTasks();
  taskInput.value = "";
  dateInput.value = "";
  renderTasks();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});
searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);

renderTasks();
