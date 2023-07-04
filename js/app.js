'use strict';
import { Task } from "./TaskApi.js";

const date = new Date();
const mesAtual = new Date(date.getFullYear(), date.getMonth()).getMonth();
const ultimoDia = new Date(date.getFullYear(), mesAtual + 1, 0).getDate();
const primeiroDiaSemana = new Date(date.getFullYear(), mesAtual).getDay();
const diasSemana = [[], [], [], [], [], [], []];



for(let d = 1, dia = primeiroDiaSemana, sem = 0; d <= ultimoDia; d++) {
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

const diasCalendario = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const tabela = document.querySelector('table');
const thead = document.createElement('tr');

diasCalendario.map(dia => {
    thead.innerHTML+=`<th>${dia}</th>`
})

tabela.appendChild(thead)

console.log(diasSemana)


// ALGORITIMO PARA DESCOBRIR A SEMANA DO DIA ESPECIFICADO DO MES ATUAL
function getWeekOfMonth(day) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7; // Offset para o primeiro dia da semana
    const adjustedDay = day + startOffset - 1;
  
    return Math.floor(adjustedDay / 7);
  }
  
  // Exemplo de uso:
  const day = 70; // Dia especificado no mês atual
  
  const weekNumber = getWeekOfMonth(day);
  console.log(`Semana ${weekNumber}`);