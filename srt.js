import { fetchData, addTask, editTask, deleteTask, completeTask } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    const taskList = document.getElementById('taskList');
    const newTaskInput = document.getElementById('newTask');
    const addTaskButton = document.getElementById('addTask');
    const filterSelect = document.getElementById('filterSelect');

    // Function to refresh task list
    async function refreshTasks() {
        const tasks = await fetchData();
        const filterValue = filterSelect.value;
        const filteredTasks = tasks.filter(task => {
            if (filterValue === 'all') return true;
            if (filterValue === 'completed') return task.completed;
            if (filterValue === 'pending') return !task.completed;
        });
        taskList.innerHTML = filteredTasks.map((task, index) => `
            <li data-index="${index}" class="${task.completed ? 'completed' : ''}">
                <span>${task.name}</span>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
                <button class="complete">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            </li>
        `).join('');
    }

    // Event listener to add a new task
    addTaskButton.addEventListener('click', async () => {
        const newTask = newTaskInput.value;
        if (newTask) {
            await addTask({ name: newTask, completed: false });
            newTaskInput.value = '';
            await refreshTasks();
        }
    });

    // Event delegation for edit, delete, complete buttons
    taskList.addEventListener('click', async (event) => {
        const target = event.target;
        if (target.classList.contains('edit')) {
            const li = target.parentElement;
            const index = li.dataset.index;
            const newName = prompt('Edit task', li.querySelector('span').innerText);
            if (newName !== null) {
                await editTask(index, { name: newName, completed: false });
                await refreshTasks();
            }
        } else if (target.classList.contains('delete')) {
            const li = target.parentElement;
            const index = li.dataset.index;
            await deleteTask(index);
            await refreshTasks();
        } else if (target.classList.contains('complete')) {
            const li = target.parentElement;
            const index = li.dataset.index;
            await completeTask(index);
            await refreshTasks();
        }
    });

    // Event listener for filter select
    filterSelect.addEventListener('change', async () => {
        await refreshTasks();
    });

    // Display tasks on page load
    await refreshTasks();
});
