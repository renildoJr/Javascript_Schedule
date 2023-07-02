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

function taskCalendar() {
    const calendarMonths = ['january', 'february', 'march', 'april', 'may', 'junho', 'july', 'august', 'september', 'october', 'november', 'december'];
    const calendarDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const tabelas = document.querySelector('.tabelas-container');
    const firstDayOfWeek = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
    const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const lastMonthDay = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
    let lastMonthDays = [];
    let l = 0;
    
    for(let d = lastDay - 6; d <= lastMonthDay; d++) {
        lastMonthDays.push(d)
    }
    
    lastMonthDays = lastMonthDays.splice(firstDayOfWeek)
    
    for(let i = 0, day = 1; i < 5; i++) {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const tr2 = document.createElement('tr');
    
        table.setAttribute('class', 'tabela')

        tr.innerHTML = `<th>Hours</th>`
        
        for(let d = 0; d < 7; d++) {
            // last month items
            if(l < lastMonthDays.length) {
                tr.innerHTML += `<th>${calendarDays[d]} ${lastMonthDays[l]}</th>`;
                l++
            // New Month items
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
        table.appendChild(tr2)
        tabelas.appendChild(table);
    
    }

}



const defaultColor = '#f2f2f2';

taskCalendar();

import { Task } from "./TaskApi.js";

// Task.newTask('Play Games', ['16:30', '23:45'], [null,1,2,3,4,5,6], '#0000C720')
// Task.newTask('Study', ['22:40', '9:30'], [null,null,null,3,null,5,null,null], '#41b2f0')

// ==================================================

console.log(Task.getTasks());

const tasks = Task.getTasks();

const tabelasRoutine = document.querySelectorAll('.tabela')

tabelasRoutine.forEach(tabela => {
    tasks.map(task => {
        const dias = task.dias;
        for(const hora of task.horarios) {
            const row = document.createElement('tr');
            row.innerHTML = `<td class="hora">${hora}</td>`
            for(let i = 0; i < 7; i++) {
                    row.innerHTML += `<td ${dias[i]!==null ? "class='task'" : ''}" style="background:${dias[i]!==null ? task.color : defaultColor}":${task.color}">${dias[i] !== null ? task.name : ''}</td>`;
            }
            tabela.appendChild(row)
        }
    })
})

// FAZER COM QUE ESSA TABELA RECEBA O INDEX IGUAL AO DO MES ATUAL
const tabelaMesAtual = document.querySelectorAll('.tabela')[1]; // tESTE
tabelaMesAtual.style.border="5px solid red"; // TESTE

// const tasksTabelaMesAtual = document.querySelectorAll('.task');
tasksHTML = document.querySelectorAll('.task');

tasksHTML.forEach((task, index) => {
    // console.log(`${task.textContent} ${index} `+(task.style.backgroundColor))
    
    // Mudar a cor do elemento acréscentando 34 ao valor do hexadecimal do elemento
    task.addEventListener('click', () => test(task.textContent, index));
})

// TESTE para pegar ID referente a data

// Ver como converter RGBA para HEXADECIMAL
// Ideias  para tabelas: dar highlight na tabela da semana atual, SÓ PODERÃO SER CLICÁVEIS OS ELEMENTOS DA TABELA DO MÊS ATUAL 

// opacity value:
// 34

function test(nome, id) {
    alert(nome+' '+id)
}