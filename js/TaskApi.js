export class Task {

    static getTasks() {
        const tasks = localStorage.getItem('Routine');
        return JSON.parse(tasks) || [];
    }

    static newTask(name = 'unknown', horarios = [], dias = [], color = defaultColor) {
        const tasks = this.getTasks()
        console.log(tasks)
        const newTask = {
            name,
            horarios,
            dias,
            color
        };

        tasks.push(newTask);

        return save(tasks);
    }

}

function save(data) {
    return localStorage.setItem('Routine', JSON.stringify(data))
}