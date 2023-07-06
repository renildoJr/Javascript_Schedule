export class Task {
    defaultColor = '#F2F2F2';

    static getTasks() {
        const tasks = localStorage.getItem('Routine');
        return JSON.parse(tasks) || [];
    }

    static newTask(name = 'unknown', horarios = [], dias = [], color = this.defaultColor, updatedId = null) {
        const tasks = this.getTasks();
        // validar para ver se o nome da tarefa já existe no localstorage
        // validar para ver se há confilito de horarios + dias com outras tarefas existentes
        
        const newTask = {
            id: updatedId !== null ? updatedId : Math.round(Math.random() * 1000),
            name,
            horarios,
            dias,
            color
            // 0 false 
            // 1 true
            // 2 
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

    static editTask(id, name, horarios, dias, color) {
        const tasks = this.getTasks();
        console.log(tasks);
        const task = this.getTask(id);
        // remove task
        this.removeTask(id);
       
        // add new
        return this.newTask(name, horarios, dias, color, id);

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
// Task.newTask('breakfest', [1200], [3, 6, 5, 7], '#baf786');
// Task.editTask(195, 'watch tv', [1800, 1200, 900], [8, 6, 5, 21, 13], 'orangered');
// Task.removeTask(810)

function save(data) {
    return localStorage.setItem('Routine', JSON.stringify(data))
}

