export class Task {

    static getTasks() {
        const tasks = localStorage.getItem('Routine');
        return JSON.parse(tasks) || [];
    }

    static newTask(name = 'unknown', horarios = [], dias = [], color = defaultColor) {
        const tasks = this.getTasks()
        const newTask = {
            id: Math.round(Math.random() * 1000),
            name,
            horarios,
            dias,
            color
        };

        tasks.push(newTask);
        return save(tasks);
    }

    static getTask(id) {
        const tasks = this.getTasks()
        const task = tasks.find(task => task.id === id)  || false;
        return task;
    }

}

function save(data) {
    return localStorage.setItem('Routine', JSON.stringify(data))
}

