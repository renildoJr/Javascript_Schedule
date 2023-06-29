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

const tabelasContainer = document.querySelector('.tabelas-container');

const calendarMonths = ['january', 'february', 'march', 'april', 'may', 'junho', 'july', 'august', 'september', 'october', 'november', 'december']
const calendarDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const lastDayCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0 ).getDate();
const firstDayCurrentMonth = new Date().getDay();
const currentMonth = new Date().getMonth();

const lastDayPreviousMonth = new Date(new Date().getFullYear(), currentMonth, 0 ).getDate();

let lastDays = [];

for(let day = lastDayPreviousMonth - 7; day <= lastDayPreviousMonth; day ++) {
    lastDays.push(day)
}

lastDays = lastDays.splice(firstDayCurrentMonth)

for(let sem = 0, day = lastDays[0]; sem < 5; sem ++) {
    const table = document.createElement('table');
    const tr = document.createElement('th');
    for(let i = 0; i < 7; i++) {
        if(day < lastDays[lastDays.length - 1]) {
            tr.innerHTML += `<th>${calendarDays[i]} ${day}</th>`;
            day++;
        }else {
            day = 1
            tr.innerHTML += `<th>${calendarDays[i]} ${day}</th>`;
        }
    }
    table.appendChild(tr);
    tabelasContainer.appendChild(table)
}