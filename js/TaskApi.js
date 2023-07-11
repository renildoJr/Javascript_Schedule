export class Task {
    defaultColor = '#F2F2F2';

    static getTasks() {
        const tasks = localStorage.getItem('schedi');
        return JSON.parse(tasks) || [];
    }

    static newTask(name = 'unknown', hour = 1000, days = [], status = [], color = this.defaultColor, updatedId = null) {
        const tasks = this.getTasks();
        // validar para ver se o nome da tarefa já existe no localstorage
        // validar para ver se há confilito de horarios + dias com outras tarefas existentes
        
        const newTask = {
            id: updatedId !== null ? updatedId : Math.round(Math.random() * 1000),
            name,
            hour,
            days,
            status,
            color
        };

        tasks.push(newTask);
        save(tasks);
        return newTask;
    }

    static getTask(id) {
        const tasks = this.getTasks()
        const task = tasks.find(task => task.id === id)  || false;
        return task;
    }

    static editTask(id, name, hour, days, status, color) {
        // remove task
        this.removeTask(id);
        // add new
        return this.newTask(name, hour, days, status, color, id);

    }

    static removeTask(id) {
        const tasks = this.getTasks();
        const currentTask = tasks.find(task => task.id === id);

        if(!currentTask) {
            throw Error('Task not found!');
        }

        tasks.splice(tasks.indexOf(currentTask), 1);
        return save(tasks);

    }

}

function save(data) {
    return localStorage.setItem('schedi', JSON.stringify(data))
}

