// Element Selection
const todoForm = document.querySelector("#todo_form");
const todoInput = document.querySelector("#todo_input");
const todoList = document.querySelector("#todo_list");
const editForm = document.querySelector("#edit_form");
const searchInput = document.querySelector("#search_input");
const clearQuery = document.querySelector("#clear_query");
const editInput = document.querySelector("#edit_input");
const cancelEditBtn = document.querySelector("#cancel_edit_btn");
const filterBtn = document.querySelector("#filter_select");

let oldInputValue;

//Functions
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finished_todo");
  doneBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon>';
  todo.appendChild(doneBtn);
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit_todo");
  editBtn.innerHTML = '<ion-icon name="create-outline"></ion-icon>';
  todo.appendChild(editBtn);
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove_todo");
  deleteBtn.innerHTML = '<ion-icon name="close-circle-outline"></ion-icon>';
  todo.appendChild(deleteBtn);

  //Local Storage data
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text: text, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerHTML = text;

      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getQueryTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    const lowerCaseQuery = search.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;
    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

//Events

//Add ToDo
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

//Todo button functionallity
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finished_todo")) {
    parentEl.classList.toggle("done");
    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove_todo")) {
    parentEl.remove();
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit_todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

//Cancel edit button functopnallity
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

//Edit form method
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    //Update
    updateTodo(editInputValue);
  }

  toggleForms();
});

//Query Input & Method
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getQueryTodos(search);
});

//Clear query value
clearQuery.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

//Filter by select value
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

//Local Storage functions
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

//Local Storage
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const loadTodos = (todo) => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text !== todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) => {
    todo.text === todoText ? (todo.done = !todo.done) : null;
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) => {
    todo.text === todoOldText ? (todo.text = todoNewText) : null;
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
