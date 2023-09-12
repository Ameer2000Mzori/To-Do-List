import "./styles/main.css";

const addBtn = document.getElementById('add-button');
const todoTask = document.getElementsByClassName('todotask-wrap')[0];
const clearBtn = document.getElementsByClassName('clear-btn')[0];

// Check if there is existing data in local storage and initialize toDoObject accordingly
const toDoObject = JSON.parse(localStorage.getItem('toDoObject')) || {};

// Function to update local storage with the latest toDoObject data
function updateLocalStorage() {
  localStorage.setItem('toDoObject', JSON.stringify(toDoObject));
}

// Function to populate HTML with data from toDoObject
function populateHTML() {
  todoTask.innerHTML = ''; // Clear the existing content

  let count = 1; // Initialize the count for sequential numbers

  for (const key in toDoObject) {
    if (toDoObject.hasOwnProperty(key)) {
      const inputValue = toDoObject[key].todo;
      const isChecked = toDoObject[key].checked ? 'checked' : '';

      const div = document.createElement('div');
      div.innerHTML = `
        <div class="todotask">
          <input class="input-checkbox" type="checkbox" id="${key}" ${isChecked} />
          <label for="${key}" class="label-text">${inputValue}</label>
          <button class="delete-btn" data-key="${key}">
            <img class="delete-img" src="./icons/delete.png" alt="" data-key="${key}" />
          </button>
        </div>
      `;

      const checkbox = div.querySelector('.input-checkbox');
      checkbox.addEventListener('change', handleCheckBoxChange);

      const removeButton = div.querySelector('.delete-btn');
      removeButton.addEventListener('click', handleRemoveTodo);

      const deleteImage = div.querySelector('.delete-img');
      deleteImage.addEventListener('click', handleRemoveTodo);

      todoTask.appendChild(div);

      // Apply text-decoration if the task is checked
      if (toDoObject[key].checked) {
        const labelText = div.querySelector('.label-text');
        labelText.style.textDecoration = 'line-through';
      }

      count++; // Increment the count for the next todo
    }
  }
}

// Call populateHTML to load existing data when the page loads
populateHTML();

addBtn.addEventListener('click', (event) => {
  let inputValue = document.getElementById('input-text').value;

  if (!inputValue) {
    alert('Please enter something');
  } else {
    event.preventDefault();
    console.log(inputValue);

    // Find the next available key by checking existing keys
    let newKey = `toDo${1}`;
    while (toDoObject[newKey]) {
      newKey = `toDo${parseInt(newKey.replace('toDo', '')) + 1}`;
    }

    const newToDo = {
      todo: inputValue,
      checked: false, // Initialize the checked property to false
    };
    toDoObject[newKey] = newToDo;
    updateLocalStorage(); // Update local storage when a new task is added
    populateHTML(); // Refresh the HTML content with the updated data

    console.log(toDoObject);
  }
});

function handleCheckBoxChange(event) {
  const checkbox = event.target;
  const key = checkbox.id;
  toDoObject[key].checked = checkbox.checked; // Update the checked property in the object
  updateLocalStorage(); // Update local storage with the new checked state

  const labelText = checkbox.nextElementSibling; // Get the label next to the checkbox
  if (checkbox.checked) {
    labelText.style.textDecoration = 'line-through'; // Apply line-through text decoration
  } else {
    labelText.style.textDecoration = 'none'; // Remove text decoration
  }
}

function handleRemoveTodo(event) {
  const keyToRemove = event.target.getAttribute('data-key');
  if (keyToRemove) {
    delete toDoObject[keyToRemove]; // Remove the todo from the object
    updateLocalStorage(); // Update local storage
    renumberTodos(); // Renumber todos after deletion
    populateHTML(); // Refresh the HTML content with the updated data
  }
}

clearBtn.addEventListener('click', clearHandler); // Remove parentheses after clearHandler

// Function to clear checked todos
function clearHandler() {
  for (const key in toDoObject) {
    if (toDoObject.hasOwnProperty(key) && toDoObject[key].checked) {
      delete toDoObject[key]; // Remove the checked todo from the object
    }
  }
  updateLocalStorage(); // Update local storage
  renumberTodos(); // Renumber todos after deletion
  populateHTML(); // Refresh the HTML content with the updated data
}

// Function to renumber todos sequentially
function renumberTodos() {
  let count = 1;
  for (const key in toDoObject) {
    if (toDoObject.hasOwnProperty(key)) {
      const newKey = `toDo${count}`;
      if (key !== newKey) {
        toDoObject[newKey] = toDoObject[key];
        delete toDoObject[key];
      }
      count++;
    }
  }
  updateLocalStorage();
}