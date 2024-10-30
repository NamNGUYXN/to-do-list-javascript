const TODOLIST_APP = 'TODOLIST_APP';

const saveData = (data) => {
    localStorage.setItem(TODOLIST_APP, JSON.stringify(data));
}

const loadData = () => {
    let data = JSON.parse(localStorage.getItem(TODOLIST_APP));
    return data ? data : [];
}

const addTask = (task) => {
    let data = loadData();
    let newTask = {
        task: task,
        isCompleted: false
    };
    data.push(newTask);
    saveData(data);
}

const createTaskItem = (task, isCompleted, index) => {
    return `
        <li class="task-item" is-completed="${isCompleted}" index="${index}">
            <span class="task" onclick="markTaskCompleted(${index});">${task}</span>
            <div class="task-action">
                <button onclick="pushEditTask(${index});">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                </button>
                <button onclick="deleteTask(${index});">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </div>
        </li>
    `;
}

const countTaskCompleted = (quantity) => {
    const result = document.querySelector('.task-result');
    if (quantity == 0) {
        result.innerText = '';
    } else if (quantity == 1) {
        result.innerText = 'Yeah, 1 task is completed';
    } else {
        result.innerText = `Yeah, ${quantity} tasks is completed`;
    }
}

const renderTask = () => {
    let data = loadData();
    let ulListTask = document.querySelector('ul.list-tasks');
    let cntTaskCompleted = 0;
    let dataHTML = data.map((value, index) => {
        if (value.isCompleted) cntTaskCompleted++;
        return createTaskItem(value.task, value.isCompleted, index);
    });
    countTaskCompleted(cntTaskCompleted);
    ulListTask.innerHTML = dataHTML.join('');
}

const markTaskCompleted = (index) => {
    let data = loadData();
    data[index].isCompleted = data[index].isCompleted ? false : true;
    saveData(data);
    renderTask();
}

const deleteTask = (index) => {
    let deleteConfirm = confirm('Would you like to remove this task?');
    if (deleteConfirm) {
        let data = loadData();
        data.splice(index, 1);
        if (data.length == 0) {
            localStorage.removeItem(TODOLIST_APP);
        } else {
            saveData(data);
        }
        renderTask();
    }
}

const pushEditTask = (index) => {
    let data = loadData();
    const task = document.querySelector('input#task');
    task.value = data[index].task;
    task.setAttribute('index', index);
    const btn = document.querySelector('#add_task button');
    btn.innerText = 'Edit task';
}

const editTask = (index, task) => {
    let data = loadData();
    data[index].task = task;
    saveData(data);
}

const formTask = document.forms.add_task;
formTask.addEventListener('submit', (e) => {
    const task = document.querySelector('input#task');
    let taskName = task.value;

    if (taskName.length < 1) {
        alert('Enter your task, please!');
        return false;
    }

    const index = task.getAttribute('index');
    if (index) {
        editTask(index, taskName);
        task.removeAttribute('index');
    } else {
        addTask(taskName);
    }
    renderTask();
    task.value = '';
    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    if (e.which == 27) {
        const task = document.querySelector('input#task');
        task.value = '';
        task.removeAttribute('index');
        const btn = document.querySelector('#add_task button');
        btn.innerText = 'Add task';
    }
});

renderTask();