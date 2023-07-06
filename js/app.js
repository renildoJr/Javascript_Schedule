'use strict';
import { Task } from "./TaskApi.js";

const date = new Date();
const mesAtual = new Date(date.getFullYear(), date.getMonth()).getMonth();
const ultimoDia = new Date(date.getFullYear(), mesAtual + 1, 0).getDate();
const primeiroDiaSemana = new Date(date.getFullYear(), mesAtual).getDay();
const diasSemana = [[], [], [], [], [], [], []];
const hoje = date.getDate();

for(let d = 1, dia = primeiroDiaSemana; d <= ultimoDia; d++) {
    diasSemana[dia].push({dia: d, semana: numeroSemana(d) , tasks: []})
    if(dia > diasSemana.length - 2) {
        dia = 0;
    }else {
        dia ++;
    }
}

const tasks = Task.getTasks();
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

/**
 * ===============================
 *      CORREÇÕES A FAZER
 * ===============================
 * corrigir data duplicada para tasks com mesmos horários e dias diferentes 
 * 
 * */


/**
 * ==========================================
 *  Planejamento de Done, undone, justify
 * ==========================================
 * deverá ser criado uum array de booleans
 * o tamanho da array será relatica á quantidade de dias da array "dias"
 * todos os valores se iniciarão em false
 * 
 * ==== Renderização Provisória =====
 * Tasks undone & futuras = cor normal 
 * Tasks done = cor transparente + icone V 
 * Tasks justified = cor preta + (pesquisar icone) 
 * Tasks vencidas = cor vermelha +  icone X
 * 
 * ===== Restrições =====
 * Não será possível marca uma Task vencida como Done (true), só será possivel justifica-lá
 * Só será possível justificar tarefas vencidas e atuais, não tarefas da data do dia seguinte em diante
 * Não será possível marcar qualquer tarefa do dia seguinte como Done(true) somente a tarefa da data atual
 * 
 * ==== Ideias ====
 * Deixar as tarefas do dia atual com um efeito e animação (como se estivesse brilhando)
*/
 

// Renderização HTML do calendário (Semana atual)
const diasCalendario = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const tabela = document.querySelector('table');
const thead = document.createElement('tr');

function listaSemana(numSem = 0) {
    const semana = [];
    for(const array of diasSemana) {
        const obj = array.find(obj => obj.semana === numSem);
        if(obj) {
            semana.push(obj);
        }
    }
    return semana;
}

// Renderização HTML do calendário (Semana atual)

const ultimoDiaMesPassado = new Date(date.getFullYear(), mesAtual, 0).getDate();

let ultimosDiasMesPassado = [];

for(let i = 0, dia = ultimoDiaMesPassado - 6; i < 7; i++) {
    ultimosDiasMesPassado.push(dia);
    dia++;
}

ultimosDiasMesPassado = ultimosDiasMesPassado.splice(listaSemana(0).length);

// limitar até 5
const semana = listaSemana(numeroSemana(hoje));

thead.innerHTML = `<th></th>`;

let diaSMesSeguinte = 1; // Melhorar isso mas tarde
let novoIndex = 0;
diasCalendario.map((dia, index) => {
    let data;
    if(semana[0].semana === 0 && index !== ultimosDiasMesPassado.length) {
        data = ultimosDiasMesPassado[index];
    }else {
        const objSemana = semana[novoIndex];
        if(objSemana) {
            data = objSemana.dia; //CORRIGIR ESTE ERRO AQUI

        }else {
            data = diaSMesSeguinte; //CORRIGIR ESTE ERRO AQUI
            diaSMesSeguinte++;
        }
        novoIndex ++;
    }
    // Verifica se a data é igual á data atual para aplicar a classe "hoje"
    thead.innerHTML+=`<th class="${data === hoje ? 'hoje' : ''}">${dia} ${data}</th>`;
})

tabela.appendChild(thead)

// Esta função descobre a semana da data especificada
function numeroSemana(dia) {
    const offsetInicio = (primeiroDiaSemana + 6) % 7; // Offset para o primeiro dia da semana
    const ajusteDia = dia + offsetInicio ;
    return Math.floor(ajusteDia / 7);
}

const tasksSemanaAtual = new Set();

semana.forEach(obj => {
    obj.tasks.forEach(taskId => tasksSemanaAtual.add(taskId));
})

let horariosSemanaAtual = [];

// Acessar horários dos itens
tasksSemanaAtual.forEach(taskId => {
    const task = Task.getTask(taskId);
    task.horarios.forEach(hora => {horariosSemanaAtual.push(hora)})
});


let index = 7;
horariosSemanaAtual = horariosSemanaAtual.sort(((a, b) => a - b));

function formatHoras(num) {
    num = String(num);
    
    if(num.length === 3) {
        return  '0'+num.charAt(0)+':'+num.substring(1);
    }

    let mask = '00:00';
    for(let i = 0; i < num.length; i++) {
        mask = mask.replace('0', num[i])
    }

    return mask;
    
}

// renderizar as rows HTML de horarios
horariosSemanaAtual.forEach(hora => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="hora">${formatHoras(hora)}</td>`;

    if(semana.length < index ) {
        for(let i = 0; i < ultimosDiasMesPassado.length; i++)
        tr.innerHTML+=`<td></td>`;
        index++;
    }

    semana.forEach(obj => {
        // Descobrir a task correspondente ao do horário iterado
        let taskAtual = false;
        let taskName = '';

        for(const taskId of obj.tasks) {
            const task = Task.getTask(taskId);
            if(task.horarios.find(horario => horario === hora)){
                taskAtual = task;
                break;
            }
        }

        if(taskAtual) {
            taskName = taskAtual.name;
        }

        tr.innerHTML += `<td class="task" style="background: ${taskAtual ? taskAtual.color : ''}">${taskName}</td>`;

    })

    tabela.appendChild(tr);
});