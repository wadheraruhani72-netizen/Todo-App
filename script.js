
const taskTextarea = document.getElementById("task-textarea");
const taskList = document.getElementById("task-list");

document.addEventListener("DOMContentLoaded", renderTasks);

taskTextarea.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const taskText = taskTextarea.value.trim();
    if (taskText === "") return;

    saveTaskToStorage(taskText, false);
    taskTextarea.value = "";
    renderTasks();
  }
});

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTaskToStorage(text, completed) {
  const tasks = getTasks();
  tasks.push({ text, completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  const tasks = getTasks();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    li.appendChild(span);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    // Checkbox for completed status
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
      tasks[index].completed = checkbox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    // Pencil Icon for updating/editing task name
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", function () {
      const newText = prompt("Update task name:", tasks[index].text);
      if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      }
    });

    // Cross Icon for deleting task
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", function () {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    actionsDiv.appendChild(checkbox);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    li.appendChild(actionsDiv);

    taskList.appendChild(li);
  });
}