'use strict';
import { Task } from "./TaskApi.js";

// criar um calendário somente com os dias do mês atual
const tabelas = document.querySelector('.tabelas-container');
const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const mesAtual = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0 ).getMonth();
const primeiroDiaSemana = new Date(new Date().getFullYear(), mesAtual + 0, 1).getDay();
const ultimoDiaMes = new Date(new Date().getFullYear(), mesAtual + 1, 0).getDate();

let dias = 1;
let pos = 0;

tabelas.innerHTML = `<h1>${meses[mesAtual]}</h1>`

for(let i = 0; i < 6; i++) {
    // Semanas
    const tabelaSemana = document.createElement('table');
    const trSemana = document.createElement('tr');
    
    trSemana.innerHTML = `<th class="hora">Horários</th>`

    for(let d = 0; d < diasDaSemana.length; d++) {
        if(pos >= primeiroDiaSemana && pos <= ultimoDiaMes + 5) { // linha original
            trSemana.innerHTML += `<th class="day-task" id="${dias}">${diasDaSemana[d]} ${dias}</th>`;
            dias++;
        }else {
            trSemana.innerHTML += `<th class='dark'>${diasDaSemana[d]}</th>`;
        }
        pos++;
    }

    tabelaSemana.setAttribute('class', 'tabela');
    tabelaSemana.appendChild(trSemana);
    tabelas.appendChild(tabelaSemana);

}

// Task.newTask('Play Games', ['16:30', '23:45'], [null,1,2,3,4,5,6], '#0000C720')
// Task.newTask('Study', ['22:40', '9:30'], [null,null,null,3,null,5,null,null], '#41b2f0')

const tasks = Task.getTasks();
const allTables = Array.from(document.querySelectorAll('.tabela'));

// Remove o último elemento .tabela, se caso a quantidade de classes .dark for igual á 7
if(allTables[allTables.length - 1].querySelectorAll('.dark').length === 7) {
    allTables[allTables.length - 1].remove()
}

// console.log(allTables)

allTables.map(tabela => {
    tasks.forEach(task => {
        task.horarios.forEach((hora, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td class="hora">${hora}</td>`
            for(let i = 0; i < 7; i++) {
                row.innerHTML += `<td>${task.dias[i] !== null ? task.name : ""}</td>`;
            }
            tabela.appendChild(row)

        })
    })
});