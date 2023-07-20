'use strict';
import { Task } from "./TaskApi.js";
const tasks = Task.getTasks();
const date = new Date();
const mesAtual = new Date(date.getFullYear(), date.getMonth()).getMonth();
const lastDay = new Date(date.getFullYear(), mesAtual + 1, 0).getDate();
const firstDayOfWeek = new Date(date.getFullYear(), mesAtual).getDay();
const weeks = [[], [], [], [], [], [], []];
const today = date.getDate();
const overlay = document.querySelector('.overlay');
const btn_addNewTask = document.getElementById('btn_new-task');
const calendarDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

for(let d = 1, dia = firstDayOfWeek; d <= lastDay; d++) {
    weeks[dia].push({dia: d, semana: getWeekNumber(d) , tasks: []})
    if(dia > weeks.length - 2) {
        dia = 0;
    }else {
        dia ++;
    }
}

btn_addNewTask.addEventListener('click', ()=>{openModal('add')});
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
    const tabela = document.querySelector('.tabelas-container table');
    const thead = document.createElement('tr');
    const lastDayLastMonth = new Date(date.getFullYear(), mesAtual, 0).getDate();
    const tasksSemanaAtual = new Set();
    let lastDaysLastMonth = [];
    let diaSMesSeguinte = 1; // Melhorar isso mas tarde
    let novoIndex = 0;
    let tasksHours = [];
    let index = 7;
    
    for(let i = 0, dia = lastDayLastMonth - 6; i < 7; i++) {
        lastDaysLastMonth.push(dia);
        dia++;
    }
    
    lastDaysLastMonth = lastDaysLastMonth.splice(listWeeks(0).length);
    thead.innerHTML = `<th></th>`;
    
    calendarDays.map((dia, index) => {
        let data;
        if(semana[0].semana === 0 && index !== lastDaysLastMonth.length) {
            data = lastDaysLastMonth[index];
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
            for(let i = 0; i < lastDaysLastMonth.length; i++)
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

// openModal()

// FUNÇÕES
function openModal(context) {
    // Global 
    const modal = document.createElement('div');
    const modalTitle = document.createElement('h2');
    const modalBtnClose = document.createElement('button');
    const modalBtnEnd = document.createElement('button');

    modal.setAttribute('class', 'modal');

    modalBtnClose.setAttribute('class', 'btn fa-solid fa-xmark');

    modal.append(modalBtnClose, modalTitle);

    // New Task / Update Task
    const labelName = document.createElement('label');
    const labelHour = document.createElement('label');
    const labelColor = document.createElement('label');
    const inputName = document.createElement('input');
    const inputHour = document.createElement('input');
    const inputColor = document.createElement('input');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const selectedDays = []; // Esta variável estará preenchida, caso "context" for "update"

    // Ideia (fazer uma só vez)
    let title, btnEnd;
    // add task / Edit task
    // let name, 
    
    // add task 
    title = 'Add New Task';
    btnEnd = 'Add task';

    modalTitle.textContent = title;
    modalBtnEnd.textContent = btnEnd; // Add Task only 

    inputName.setAttribute('type', 'text');
    inputName.setAttribute('id', 'inputName');
    labelName.setAttribute('for', 'inputName');
    labelName.textContent = 'Name';

    inputHour.setAttribute('type', 'time');
    inputHour.setAttribute('id', 'inputHour');
    inputHour.setAttribute('value', '00:00');
    inputHour.setAttribute('min', '00:00');
    inputHour.setAttribute('max', '23:59');
    labelHour.setAttribute('for', 'inputHour');
    labelHour.textContent = 'Hour';

    inputColor.setAttribute('type', 'color');
    inputColor.setAttribute('id', 'inputColor');
    labelColor.setAttribute('for', 'inputColor');
    labelColor.textContent = 'Color';

    calendarDays.forEach(day => {
        const th = document.createElement('th');
        const td = document.createElement('td');

        th.innerHTML = `<label for="weekday_${day}">${day}</label>`;
        td.innerHTML = `<input type="checkbox" id="weekday_${day}">`;

        thead.appendChild(th);
        tbody.appendChild(td);

    });
    
    const inputsCheck = Array.from(tbody.getElementsByTagName('input'));
    
    selectedDays.forEach(day => inputsCheck[day].setAttribute("checked", ''));
    inputsCheck.forEach((inputCheck, index) => inputCheck.addEventListener('click', () => {
        checkItem(inputCheck.checked, index);
    }))

    function checkItem(bool, day) {
        if(bool) {
            return selectedDays.push(day);
        }
        return selectedDays.splice(selectedDays.indexOf(day), 1);
    }

    function confirm() {
        if(!selectedDays.length) {
            message(null, "Don't forget adding the day(s)");
            // Escrever um código para focar as áreas dos inputs vazios
        }else {
            const allDays = []; // Adicionando as datas relativas aos dias da semana (selecionados nos checkboxes)
            const hour = Number(inputHour.value.replace(':', '')); // Tratamento do Horário (ex: 16:28 => 1628, 00:42 => 42)
            
            selectedDays.forEach(day => {
                weeks[day].forEach(date => {
                    if(date.dia >= today) {
                        allDays.push(date.dia);
                    }
                })
            })

            addNewTask(inputName.value, hour, allDays, inputColor.value);
        }
    }

    modalBtnEnd.addEventListener('click', confirm);

    table.append(thead, tbody);
    modal.append(labelName, inputName, labelHour, inputHour, table, labelColor, inputColor);
    // End Add && edit 

    // End
    modal.appendChild(modalBtnEnd);
    overlay.appendChild(modal);


    // let modalTitle = '';
    // const btn_close = document.getElementById('btn_close');
    // const btn_finish = document.getElementById('btn_finish');
    
    // overlay.classList.add('display');


   

    //         <!-- dias  -->
    //         <!-- prioridade 1-5 -->
    //         <!-- categoria -->


}

monthCalendar()

function monthCalendar(month) {
    // START Códigos copiados de outra função
    const lastDayLastMonth = new Date(date.getFullYear(), mesAtual, 0).getDate();
    let lastDaysLastMonth = [];
    
    for(let i = 0, dia = lastDayLastMonth - 6; i < 7; i++) {
        lastDaysLastMonth.push(dia);
        dia++;
    }
    
    lastDaysLastMonth = lastDaysLastMonth.splice(listWeeks(0).length);
    // END codigos copiados de outra função
    console.log(lastDaysLastMonth)

    // console.log(calendarDays)
    
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    table.setAttribute('class', 'calendar_table');

    for(let i = 0; i < calendarDays.length; i++) {
        thead.innerHTML += `<th>${calendarDays[i]}</th>`
    }

    let lmd = 0, currentMonthDay = 0;
    
    // First Week 
    const trFirstWeek = document.createElement('tr');
    for(let i = 0; i < calendarDays.length; i++) {
        
        if(lmd < lastDaysLastMonth.length) {
            trFirstWeek.innerHTML += `<td>${lastDaysLastMonth[lmd]}</td>`;
            lmd ++;
        }else {
            trFirstWeek.innerHTML+=`<td>${listWeeks(0)[currentMonthDay].dia}</td>`
            currentMonthDay ++;
        }
        
        console.log(lmd)
        tbody.appendChild(trFirstWeek);
    }
        
    // Partindo da segunda semana até o último dia do mês

    for(let week = 1; week <= 5; week++) {
        const tr = document.createElement('tr');
        for(let i = 0; i < listWeeks(1)[week].length; i++) {
            console.log(i)
        }
        tbody.appendChild(tr);
    }

    // for(let day = currentMonthDay; day <= lastDayLastMonth; day++) {        
    //     for(let weekDay = 0; weekDay < 7; weekDay++) {
    //         // tr.innerHTML += day 
    //     }
    // }

        console.log(listWeeks(0))
        // listWeeks(i).forEach(obj => console.log(obj.dia))

    table.append(thead, tbody);
    overlay.appendChild(table);

    // return table 

}

function closeModal() {
    overlay.classList.remove('display');
}

function addNewTask(name, hour, days, color) {
    const status =  [];
    
    // Gera status "null" para cada data do array "days"
    days.forEach(day => status.push({day: day, done: null}));

    // Salvando a nova task no localstorage
    const newTask = Task.newTask(name, hour, days, status, color);

    if(!newTask){
        message(true, 'New task added successfully');
        return closeModal();
    }

    message(false, newTask);
    return false;
}

function message(type, msg) {
    alert(msg)
}

function updateDailyStatus() {
    // OBS: ESTE CÓDIGO SÓ DEVERÁ SER EXECUTADO UMA SÓ VEZ, PARA TODAS AS TASKS, QUANDO A VARIÁVEL "hoje" FOR IGUAL Á "1"
    // Adiciona status null relativo aos dias nas tasks
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
            const remove = task.status.find(stat => stat.day === today && stat.done === null);
            task.status.splice(task.status.indexOf(remove), 1);
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
    let mask = 'xx:xx';
    num = String(num);

    if(num == "0") {
        return "00:00";
    }
    
    if(num.length < 3) {
        return "00:"+num
    }

    if(num.length == 3) {
        return  '0'+num.charAt(0)+':'+num.substring(1);
    }

    for(let i = 0; i < num.length; i++) {
        mask = mask.replace('x', num[i])
    }


    return mask;
}

/**
 * Adicionar funcionalidades CRUD para o sistema
 * Organizar/Refatorar código
 * Criar interface mais amigável
 * criar um algoritimo para localizar a hora e associar a hora da task
 */