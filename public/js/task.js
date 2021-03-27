// ! Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const saveData = document.getElementById("save");

// ! Event Listeners
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);
saveData.addEventListener("click", save);

//Functions

async function save() {
  const mTasks = JSON.stringify(tasks)
  const req = await fetch('/save', {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": mTasks
  });
  const res = req.status
  if (res === 200) {
    location.reload()
  } else {
    return
  }
}

function addTodo(e) {
  if (todoInput.value !== '') {
    e.preventDefault();
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.classList.add("uncompleted");
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    const addNew = { [todoInput.value] : "uncompleted" }
    todoInput.value = '';
    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    todoList.appendChild(todoDiv);
    tasks.tasks.push(addNew);
  }
}

function deleteTodo(e) {
  const item = e.target;
  const todo = item.parentElement;
  const update = item.parentNode.querySelector('.todo-item').innerText;
  if (item.classList[0] === "trash-btn") {
    todo.classList.add("poof");
    setTimeout(() => {
      todo.remove();
    }, 500);
    const del = tasks.tasks?.find(e => e[update])
    tasks.tasks = tasks.tasks.filter(e => e != del)
  }
  if (item.classList[0] === "complete-btn") {
    let newValue
    const index = tasks.tasks?.findIndex(e => e[update])
    if (todo.classList[1] == 'completed') {
      todo.classList.replace('completed', 'uncompleted');
      newValue = 'uncompleted'
      tasks.tasks[index][update] = newValue
    } else if (todo.classList[1] == 'uncompleted'){
      todo.classList.replace('uncompleted', 'completed');
      newValue = 'completed'
      tasks.tasks[index][update] = newValue
    }
  }
}