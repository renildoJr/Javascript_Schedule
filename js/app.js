'use strict';
import { Task } from "./TaskApi.js";

const date = new Date();
const mesAtual = new Date(date.getFullYear(), date.getMonth()).getMonth();
const ultimoDia = new Date(date.getFullYear(), mesAtual + 1, 0).getDate();
const primeiroDiaSemana = new Date(date.getFullYear(), mesAtual).getDay();
const diasSemana = [[], [], [], [], [], [], []];

for(let d = 1, dia = primeiroDiaSemana; d <= ultimoDia; d++) {
    diasSemana[dia].push({dia: d, semana: numeroSemana(d) , tasks: []})
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

const semana = listaSemana(1) // Tornar isso dinâmico mas tarde (o Date escolherá automáticamente de acordo com a semana atual)
// SE SETAR semana com parâmetro === 5 resultará em erro

thead.innerHTML = `<th></th>`;

let novoIndex = 0;
diasCalendario.map((dia, index) => {
    let data;
    if(semana[0].semana === 0 && index !== ultimosDiasMesPassado.length) {
        data = ultimosDiasMesPassado[index];
    }else {
        const objSemana = semana[novoIndex];
        data = objSemana.dia; //CORRIGIR ESTE ERRO AQUI
        novoIndex ++;
    }
    thead.innerHTML+=`<th>${dia} ${data}</th>`;
})

tabela.appendChild(thead)

// Esta função descobre a semana da data especificada
function numeroSemana(dia) {
    const offsetInicio = (primeiroDiaSemana + 6) % 7; // Offset para o primeiro dia da semana
    const ajusteDia = dia + offsetInicio ;
    return Math.floor(ajusteDia / 7);
}

// Próximo Passo: 
// adicionar dinamicamente novas rows para a variavel "HTML" tabela
// As rows serão adicionadas de acordo com a quantidade de horarios de cada task
//(OK) criar um método para acessar o objeto task através do id de propriedades "tasks" do objeto semana[index].objeto.tasks 

/**
 * (OK) as tasks deverão ser exibidas de acordo com seu determinado dia (task.dias[index] === diasSemana[index].obj.dia)
 * (OK) atenção: os dias devem ser de acordo com os dias da semanta atual
 * (OK) Detectar os horários: 
 * (OK) exibir as rows + horarios em ordem crescente
 */

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
horariosSemanaAtual = horariosSemanaAtual.sort();
// renderizar as rows HTML de horarios
horariosSemanaAtual.forEach(hora => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="hora">${hora}</td>`;

    if(semana.length < index ) {
        for(let i = 0; i < ultimosDiasMesPassado.length; i++)
        tr.innerHTML+=`<td></td>`;
        index++;
        console.log(index)
    }

    semana.forEach(obj => {
        // Descobrir a task correspondente áo do horário iterado
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
})

console.log(Task.getTasks())

// Variáves que serão utilizadas
// console.log(tabela);
// console.log(semana)
// console.log(diasSemana)
// console.log(tasks)

// const task = obj.tasks.reduce((acc, item) => {
//     const taskAtual = Task.getTask(item)
//     if(taskAtual.horarios.find(itemHora => itemHora === hora)) {
//         console.log(taskAtual.horarios.find(itemHora => console.log(itemHora === hora)))
//         // console.log(taskAtual.horarios.find(horar => horar === hora))
//         console.log(taskAtual+" "+hora)
//         return acc = Task.getTask(item);
//     }
// },{})