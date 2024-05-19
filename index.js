// Define a class for a Task
class Task {
    constructor(title, description, dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }
}

// Define a class for a Project
class Project {
    constructor(name) {
        this.name = name;
        this.tasks = []; // Array to store tasks for this project
    }

    // Method to add a task to the project
    addTask(title, description, dueDate) {
        const task = new Task(title, description, dueDate);
        this.tasks.push(task);
    }

    // Method to remove a task from the project
    removeTask(taskTitle) {
        this.tasks = this.tasks.filter(task => task.title !== taskTitle);
    }

    getTasks() {
        return this.tasks;
    }
}

// Project Management Functions
let projects = [];

function saveProjectsToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function loadProjectsFromLocalStorage() {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects).map(projectData => {
            const project = new Project(projectData.name);
            project.tasks = projectData.tasks.map(task => new Task(task.title, task.description, task.dueDate));
            return project;
        });
    }
}

function getProjectByName(name) {
    return projects.find(project => project.name === name);
}

function addProject(name) {
    const project = new Project(name);
    projects.push(project);
    saveProjectsToLocalStorage();
    updateDropdown();
}

function removeProject(name) {
    projects = projects.filter(project => project.name !== name);
    saveProjectsToLocalStorage();
}

// Dropdown Handling
function updateDropdown() {
    const projectSelect = document.getElementById('project');
    projectSelect.innerHTML = '';
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        projectSelect.appendChild(option);
    });
}

// Task Management and Event Handling
function Tasks() {
    const addtasks = document.getElementById('addtasks');
    const dialog = document.getElementById('dialog');
    const submit = document.getElementById('submit');

    addtasks.addEventListener("click", () => {
        dialog.showModal();
    });

    submit.addEventListener("click", (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const duedate = document.getElementById('duedate').value;
        const pro = document.getElementById('project').value;

        if (title && description && duedate && pro) {
            let project = getProjectByName(pro);

            if (project) {
                project.addTask(title, description, duedate);
                saveProjectsToLocalStorage();
                console.log(project.tasks);
                displayTasks(pro);
            } else {
                console.error('Project not found');
            }
        }

        dialog.close();
    });
}

function displayTasks(projectName) {
    const project = getProjectByName(projectName);
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';

    if (project) {
        project.getTasks().forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.textContent = `${task.title} - ${task.description} - Due Date: ${task.dueDate}`;
            tasksContainer.appendChild(taskDiv);
        });
    }
}

function initializeDialogHandlers() {
    const addproject = document.getElementById('addproject');
    const dialog = document.getElementById('dialog1');
    const submit = document.getElementById('submit1');

    addproject.addEventListener("click", () => {
        dialog.showModal();
    });

    submit.addEventListener("click", (e) => {
        e.preventDefault();
        dialog.close();
        const name = document.getElementById('name').value;
        addProjectToDashboard(name);
    });
}

function addProjectToDashboard(name) {
    addProject(name);
    loadDashboard();
}

function removeProjectFromDashboard(projectName) {
    removeProject(projectName);
    loadDashboard();
    updateDropdown();
}

function loadDashboard() {
    const container = document.querySelector('.proj');
    container.innerHTML = '';

    projects.forEach(project => {
        const div = document.createElement('div');
        div.textContent = project.name;

        const newButton = document.createElement('button');
        newButton.textContent = 'X';
        newButton.addEventListener('click', () => {
            removeProjectFromDashboard(project.name);
            alert('Project removed!');
        });

        div.appendChild(newButton);
        container.appendChild(div);

        div.addEventListener('click', () => {
            displayTasks(project.name);
        });
    });
}

// Initialization
function initialize() {
    loadProjectsFromLocalStorage();
    initializeDialogHandlers();
    updateDropdown();
    Tasks();
    loadDashboard();
}

initialize();
