export class Task {
    defaultColor = '#F2F2F2';

    static getTasks() {
        const tasks = localStorage.getItem('Routine');
        return JSON.parse(tasks) || [];
    }

    static newTask(name = 'unknown', horarios = [], dias = [], status = [], color = this.defaultColor, updatedId = null) {
        const tasks = this.getTasks();
        // validar para ver se o nome da tarefa já existe no localstorage
        // validar para ver se há confilito de horarios + dias com outras tarefas existentes
        
        const newTask = {
            id: updatedId !== null ? updatedId : Math.round(Math.random() * 1000),
            name,
            horarios,
            dias,
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

    static editTask(id, name, horarios, dias, status, color) {
        // remove task
        this.removeTask(id);
        // add new
        return this.newTask(name, horarios, dias, status, color, id);

    }

    static removeTask(id) {
        const tasks = this.getTasks();
        const currentTask = tasks.find(task => task.id === id);

        if(!currentTask) {
            throw Error('Task não encontrada');
        }

        tasks.splice(tasks.indexOf(currentTask), 1);
        return save(tasks);

    }

}

function save(data) {
    return localStorage.setItem('Routine', JSON.stringify(data))
}

