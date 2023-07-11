// localStorage.clear()
// Task.newTask('Go Bowling', 830, [18, 11, 15], [], 'orangered');
// Task.newTask('Watch Anime', 925, [10, 11, 23, 12], [], '#000000') 
// Task.newTask('watch tv', 1200, [7, 8, 12, 23], [], '#ab4e91');
// Task.newTask('play game', 2300, [3, 6, 15, 18], [], '#8ef3f3');
// Task.newTask('sleep', 100, [2, 5, 7, 8, 9, 16], [], '#70cbba');

'use strict';
import { Task } from "./TaskApi.js";
const tasks = Task.getTasks();
const date = new Date();
const mesAtual = new Date(date.getFullYear(), date.getMonth()).getMonth();
const lastDay = new Date(date.getFullYear(), mesAtual + 1, 0).getDate();
const firstDayOfWeek = new Date(date.getFullYear(), mesAtual).getDay();
const weeks = [[], [], [], [], [], [], []];
const today = date.getDate();

for(let d = 1, dia = firstDayOfWeek; d <= lastDay; d++) {
    weeks[dia].push({dia: d, semana: getWeekNumber(d) , tasks: []})
    if(dia > weeks.length - 2) {
        dia = 0;
    }else {
        dia ++;
    }
}

updateDailyStatus();

// Salva as o ID das tarefas no array tasks (da variável weeks) correspondente aos dias de cada tarefa
// ATENÇÃO: Adaptar esse código para uma só Task, quando for criada ou modificada
// PERF: Este código só deverá ser executado uma só vez a cada task criada ou modificada.
tasks.forEach(task => 
   task.days.forEach(day => {
        for(const week of weeks) {
            const weekDay = week.find(obj => obj.dia === day);
            if(weekDay) {
                weekDay.tasks.push(task.id);
            }
        }
   })
);

renderCalendarHTML();

 // // Renderização HTML do calendário (Semana atual)
 function renderCalendarHTML() {
    const semana = listWeeks(getWeekNumber(today));
    const calendarDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const tabela = document.querySelector('.tabelas-container table');
    const thead = document.createElement('tr');
    const lastDayMesPassado = new Date(date.getFullYear(), mesAtual, 0).getDate();
    const tasksSemanaAtual = new Set();
    let ultimosDiasMesPassado = [];
    let diaSMesSeguinte = 1; // Melhorar isso mas tarde
    let novoIndex = 0;
    let tasksHours = [];
    let index = 7;
    
    for(let i = 0, dia = lastDayMesPassado - 6; i < 7; i++) {
        ultimosDiasMesPassado.push(dia);
        dia++;
    }
    
    ultimosDiasMesPassado = ultimosDiasMesPassado.splice(listWeeks(0).length);
    thead.innerHTML = `<th></th>`;
    
    calendarDays.map((dia, index) => {
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
        // Verifica se a data é igual á data atual para aplicar a classe "today"
        thead.innerHTML+=`<th class="date${data === today ? ' today' : ''}">${dia} ${data}</th>`;
    })
    
    tabela.appendChild(thead)
        
    semana.forEach(obj => {
        obj.tasks.forEach(taskId => tasksSemanaAtual.add(taskId));
    })

    // Acessar horários dos itens
    tasksSemanaAtual.forEach(taskId => {
        const task = Task.getTask(taskId);
        tasksHours.push(task.hour)
    });

    tasksHours = tasksHours.sort(((a, b) => a - b));

    // renderizar as rows HTML de horarios
    tasksHours.forEach(hora => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="hora">${formatHours(hora)}</td>`;

        if(semana.length < index ) {
            for(let i = 0; i < ultimosDiasMesPassado.length; i++)
            tr.innerHTML+=`<td></td>`;
            index++;
        }

        semana.forEach((obj, index) => {
            // Descobrir a task correspondente ao do horário iterado
            const td = document.createElement('td');
            let taskAtual = false;
            let taskName = '';
            let done = null;
            let notDone = null;

            for(const taskId of obj.tasks) {
                const task = Task.getTask(taskId);
                if(task.hour === hora){
                    taskAtual = task;
                    break;
                }
            }
            
            td.setAttribute('class', 'task');
         
            if(taskAtual) {
                taskName = taskAtual.name;
                done = taskAtual.status.find(status => (status.day === semana[index].dia) && (status.done === true)) || null;
                notDone = taskAtual.status.find(status => (status.day === semana[index].dia) && (status.done === false)) || null;
                td.setAttribute('style', `background: ${taskAtual ? taskAtual.color : ''}`);
                if(done) {
                    td.setAttribute('style', `background: #21d942`);
                }else if(notDone) {
                    td.setAttribute('style', 'background: red');
                }
            }

            td.innerHTML = taskName;
            td.addEventListener('click', ()=> {taskClick(obj.dia, taskAtual)});
            tr.appendChild(td);
        })

        tabela.appendChild(tr);
    });

}

// if(today === 1) {
//     //1. armazenar relatório do mês quando localStorage today === 1

//     //2. zera o array da propriedade status das tasks após o envio do relatório mensal
//     tasks.forEach(task => Task.editTask(task.id, task.name, task.horarios, task.dias, task.status = [{dia: today, done: null}], task.color));
// }


// FUNÇÕES

function openModal(edit) {
    const modal = document.createElement('div');
}

function updateDailyStatus() {
    // OBS: ESTE CÓDIGO SÓ DEVERÁ SER EXECUTADO UMA SÓ VEZ, E SEMPRE QUANDO FOR ADICIONADA UMA NOVA TASK
    // ESTE CÓDIGO DEVERÁ SER ADAPITADO PARA UMA TASK SÓ (A NOVA TASK CRIADA), AO INVÉS DE TODAS
    // Adiciona status null relativo aos dias nas novas tasks
    // tasks.forEach(task => {
    //     task.days.forEach(day => {
    //         if(!task.status.find(stat => stat.day === day && stat.done === false)) {
    //             task.status.push({day: day, done: null});
    //             Task.editTask(task.id, task.name, task.hour, task.days, task.status, task.color);
    //         }else {
    //             console.log('já existe')
    //         }      
    //     });
    // });

    // Sempre que o dia é atualizado, as tasks não realizadas recebem o valor false
    tasks.forEach(task => {
        const newStatus = [];
        task.status.forEach((status) => {
            if((status.day < today && status.done === null)) {
                newStatus.push({day: status.day, done: false});
            }else {
                newStatus.push(status)
            }
        });
        Task.editTask(task.id, task.name, task.hour, task.days, newStatus, task.color);
    });
}

function taskClick(dia, task) {
    if(task) {
        const statusExiste = task.status.find(stat => (stat.day === dia) && stat.done !== null);
        if(statusExiste) {
            console.log('Não é possível marcar esta tarefa novamente');
        }else if(dia === today) {
            task.status.push({day: today, done: true}); 
            Task.editTask(task.id, task.name, task.hour, task.days, task.status, task.color);
            return location.reload();
        }
    }else {
        console.log('adicionar nova task');
    }

}

function listWeeks(numSem = 0) {
    const semana = [];
    for(const array of weeks) {
        const obj = array.find(obj => obj.semana === numSem);
        if(obj) {
            semana.push(obj);
        }
    }
    return semana;
}

// Esta função descobre a semana da data especificada por parâmetro
function getWeekNumber(dia) {
    const offsetInicio = (firstDayOfWeek + 6) % 7; // Offset para o primeiro dia da semana
    const ajusteDia = dia + offsetInicio ;
    return Math.floor(ajusteDia / 7);
}

// Validar futuramente caso o input seja: maior que 60, negativo, hora >= 2400, ... 
function formatHours(num) {
    let mask = '00:00';
    num = String(num);
    
    if(num.length < 3) {
        return "00:"+num
    }

    if(num.length === 3) {
        return  '0'+num.charAt(0)+':'+num.substring(1);
    }

    for(let i = 0; i < num.length; i++) {
        mask = mask.replace('0', num[i])
    }

    return mask;
}

/**
 * Adicionar funcionalidades CRUD para o sistema
 * Organizar/Refatorar código
 * Criar interface mais amigável
 */