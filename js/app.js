'use strict';
import { Task } from "./TaskApi.js";
const tasks = Task.getTasks();
const date = new Date();
const mesAtual = new Date(date.getFullYear(), date.getMonth()).getMonth();
const ultimoDia = new Date(date.getFullYear(), mesAtual + 1, 0).getDate();
const primeiroDiaSemana = new Date(date.getFullYear(), mesAtual).getDay();
const diasSemana = [[], [], [], [], [], [], []];
const hoje = date.getDate();

PROVresetTasks()

for(let d = 1, dia = primeiroDiaSemana; d <= ultimoDia; d++) {
    diasSemana[dia].push({dia: d, semana: numeroSemana(d) , tasks: []})
    if(dia > diasSemana.length - 2) {
        dia = 0;
    }else {
        dia ++;
    }
}

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

// renderizar as rows HTML de horarios
horariosSemanaAtual.forEach(hora => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="hora">${formatHoras(hora)}</td>`;

    if(semana.length < index ) {
        for(let i = 0; i < ultimosDiasMesPassado.length; i++)
        tr.innerHTML+=`<td></td>`;
        index++;
    }

    semana.forEach((obj, index) => {
        // Descobrir a task correspondente ao do horário iterado
        let taskAtual = false;
        let taskName = '';
        let done = null;
        let notDone = null;

        for(const taskId of obj.tasks) {
            const task = Task.getTask(taskId);
            if(task.horarios.find(horario => horario === hora)){
                taskAtual = task;
                break;
            }
        }

        if(taskAtual) {
            taskName = taskAtual.name;
            done = taskAtual.status.find(status => (status.dia === semana[index].dia) && (status.done === true)) || null;
            notDone = taskAtual.status.find(status => (status.dia === semana[index].dia) && (status.done === false)) || null;
        }

        const td = document.createElement('td');
        td.setAttribute('class', 'task');
        td.setAttribute('style', `background: ${taskAtual ? taskAtual.color : ''}`);

        if(done) {
            td.setAttribute('style', `background: #21d942`);
        }else if(notDone) {
            td.setAttribute('style', 'background: red');
        }

        td.innerHTML = taskName;
        td.addEventListener('click', ()=>{teste(obj.dia, taskAtual)});
        tr.appendChild(td);
    })

    tabela.appendChild(tr);
});


// console.log(tasks)

// if(hoje === 1) {
//     //1. armazenar relatório do mês quando localStorage hoje === 1

//     //2. zera o array da propriedade status das tasks após o envio do relatório mensal
//     tasks.forEach(task => Task.editTask(task.id, task.name, task.horarios, task.dias, task.status = [{dia: hoje, done: null}], task.color));
// }


// localStorage.clear()
// Task.newTask('watch tv', [1200], [7, 8, 12, 23], [], '#ab4e91');
// Task.newTask('play game', [2300], [3, 6, 15, 18], [], '#8ef3f3');
// Task.newTask('sleep', [100], [2, 5, 7, 8, 9, 16], [], '#70cbba');

// FUNÇÕES

function PROVresetTasks() {
    // OBS: ESTE CÓDIGO SÓ DEVERÁ SER EXECUTADO UMA SÓ VEZ, E SEMPRE QUANDO FOR ADICIONADA UMA NOVA TASK
    // ESTE CÓDIGO DEVERÁ SER ADAPITADO PARA UMA TASK SÓ (A NOVA TASK CRIADA), AO INVÉS DE TODAS
    // Adiciona status null relativo aos dias nas novas tasks
    // tasks.forEach(task => {
    //     task.dias.forEach(dia => {
    //         if(!task.status.find(stat => stat.dia === dia && stat.done === false)) {
    //             task.status.push({dia: dia, done: null});
    //             Task.editTask(task.id, task.name, task.horarios, task.dias, task.status, task.color);
    //         }else {
    //             console.log('já existe')
    //         }      
    //     });
    // });

    // Sempre que o dia é atualizado, as tasks não realizadas recebem o valor false
    tasks.forEach(task => {
        const newStatus = [];
        task.status.forEach((status) => {
            if((status.dia < hoje && status.done === null)) {
                newStatus.push({dia: status.dia, done: false});
            }else {
                newStatus.push(status)
            }
        });
        Task.editTask(task.id, task.name, task.horarios, task.dias, newStatus, task.color);
    });
}

function teste(dia, task) {
    if(task) {
        const statusExiste = task.status.find(stat => (stat.dia === dia) && stat.done !== null);
        if(statusExiste) {
            console.log('Não é possível marcar esta tarefa novamente');
        }else if(dia === hoje) {
            task.status.push({dia: hoje, done: true}); 
            Task.editTask(task.id, task.name, task.horarios, task.dias, task.status, task.color);
            return location.reload();
        }
    }else {
        console.log('adicionar nova task');
    }

}

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

// Esta função descobre a semana da data especificada
function numeroSemana(dia) {
    const offsetInicio = (primeiroDiaSemana + 6) % 7; // Offset para o primeiro dia da semana
    const ajusteDia = dia + offsetInicio ;
    return Math.floor(ajusteDia / 7);
}

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