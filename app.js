'use strict';
// TAREFA
// class Task {
//     id;
//     name;
//     prior;
//     category;
//     desc;
//     days = [];
//     hours = [];
//     done = [];
//     justify = [];
//     failed = [];
// }

// function createTask() {
//     const task = new Task();
//     task.id = 12;
//     task.name = 'play castevania';
//     task.prior = 2; 
//     task.category = 'Lazer';
//     task.desc = 'blablalba';
//     task.days = [1, 2, 3, 4, 5, 6];
//     task.hours = [1030, 1123];

//     // console.log(task)
// }
// createTask()

const calendarMonths = ['january', 'february', 'march', 'april', 'may', 'junho', 'july', 'august', 'september', 'october', 'november', 'december'];
const calendarDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const tabelas = document.querySelector('.tabelas-container');
const firstDayOfWeek = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
const lastMonthDay = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
let lastMonthDays = [];
let l = 0;
let day = 0;

for(let d = lastDay - 6; d <= lastMonthDay; d++) {
    lastMonthDays.push(d)
}

lastMonthDays = lastMonthDays.splice(firstDayOfWeek)




for(let i = 0, day = 1; i < 5; i++) {
    const table = document.createElement('table');
    const tr = document.createElement('tr');

    for(let d = 0; d < 7; d++) {
        
        // last month items
        if(l < lastMonthDays.length) {
            tr.innerHTML += `<th>${calendarDays[d]} ${lastMonthDays[l]}</th>`;
            l++
        }else if(day <= lastDay) {
            tr.innerHTML += `<th>${calendarDays[d]} ${day}</th>`;
            day++;
        }else {
            day = 1;
            tr.innerHTML += `<th>${calendarDays[d]} ${day}</th>`;
            day++;
        }
    }

    table.appendChild(tr)
    tabelas.appendChild(table);

}