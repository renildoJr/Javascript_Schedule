export class Task {
    defaultColor = '#F2F2F2';

    static getTasks() {
        const tasks = localStorage.getItem('schedi');
        return JSON.parse(tasks) || [];
    }

    static newTask(name = '', hour = 1000, days = [], status = [], color = this.defaultColor, updatedId = null) {
        const tasks = this.getTasks();
        const nameAlreadyExists = tasks.find(task => String(task.name).toLowerCase() === String(name).toLowerCase());
        let message = '';
        // validar para ver se há confilito de horarios + dias com outras tarefas existentes
        
        // Validações do Nome
        if(name === '') {
            message = 'Please insert a valid name';
        };

        if(nameAlreadyExists) {
            message = 'A task with the same name already exists, choose another name';   
        };

        if(!message) {
            name = name.charAt(0).toUpperCase()+name.substring(1, name.length)
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
            return false;
        }

        return message;
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
        save(tasks);
        return true;

    }

}

function save(data) {
    return localStorage.setItem('schedi', JSON.stringify(data))
}

