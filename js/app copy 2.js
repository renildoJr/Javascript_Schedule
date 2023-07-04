'use strict';
import { Task } from "./TaskApi.js";

const date = new Date();
const mesAtual = new Date(date.getFullYear(), date.getMonth()).getMonth();
const ultimoDia = new Date(date.getFullYear(), mesAtual + 1, 0).getDate();
const primeiroDiaSemana = new Date(date.getFullYear(), mesAtual).getDay();
const diasSemana = [[], [], [], [], [], [], []];

for(let d = 1, dia = primeiroDiaSemana; d <= ultimoDia; d++) {
    diasSemana[dia].push({dia: d, tasks: []})
    if(dia > diasSemana.length - 2) {
        dia = 0;
    }else {
        dia ++;
    }
}

const tasks = Task.getTasks()
// Task.newTask('watch tv', [1200, 1800], [6, 12, 23, 8], 'orange');
// Task.newTask('play game', [2300], [1, 3, 15, 18, 6], 'blue');
// Task.newTask('sleep', [100], [2, 5, 8, 9, 16], 'blue');

tasks.forEach(task => {
    task.dias.forEach(dia => {
        for(const diaSem of diasSemana) {
            const objDia = diaSem.find(obj => obj.dia === dia);
            if(objDia) {
                objDia.tasks.push(task.id);
            }
        }
    })
});

console.log(diasSemana)
const diasCalendario = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const tabelas = document.querySelector('.tabelas-container');

const qntRows = diasSemana.find(dia=> Math.max(dia.length)).length

// for(let i = 0; i < qntRows; i++){
//     const tabela = document.createElement('table');
//     const tabelaRow = document.createElement('tr');
//     tabela.appendChild(tabelaRow);
//     tabelas.appendChild(tabela);
// }

// const trows = tabelas.querySelectorAll('tr');
// console.log(trows)

for(let diaS = 0; diaS < diasSemana.length; diaS++) {

    console.log(diasCalendario[diaS]);
   for(let i = 0; i < diasSemana[diaS].length; i++) {
    //    const dataObj = diasSemana[diaS][i];
    //    trows[i].innerHTML += `<th>${diasCalendario[diaS]} ${dataObj.dia}</th>`
        // tabelas.innerHTML+=`<th>${diasCalendario[diaS]} ${dataObj.dia}</th>`
        // console.log(dataObj.dia)
    }
}

const lastMontDays = [25, 26, 27, 28, 29, 30];

for(let i = 0, l = 0; i < 6; i++){
    const table = document.createElement('table');
    const tr = document.createElement('tr');

    for(let d = 0; d < 7; d++) {
        if(l < lastMontDays.length) {
            tr.innerHTML += `<td>${diasCalendario[d]} ${lastMontDays[l]}</td>`;
            l++;
        }else {
            const dataObj = diasSemana[d][i];
            console.log(dataObj.dia)
            tr.innerHTML += `<td>${diasCalendario[d]} ${dataObj.dia}</td>`;
        }

    }
    
    table.appendChild(tr);
    tabelas.appendChild(table);

}

    // row 0 = dom[0] 2, seg[0] 3, ter[0] 4, qua[0] 5...
    // row 1 dom[1] 8, seg[1] 9, ter[1] 10, qua[1] 11...
    // row 2 dom, seg, ter, qua...
    // row 3 dom, seg, ter, qua...
    // row 4 dom, seg, ter, qua...