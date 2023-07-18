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

openModal()

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
    const selectedDays = [1, 2, 5];
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

    calendarDays.forEach((day, index) => {
        const th = document.createElement('th');
        const td = document.createElement('td');

        th.innerHTML = `<label for="weekday_${day}">${day}</label>`;
        td.innerHTML = `<input type="checkbox" id="weekday_${day}">`;

        thead.appendChild(th);
        tbody.appendChild(td);

    })

    console.log(selectedDays)

    table.append(thead, tbody);
    modal.append(labelName, inputName, labelHour, inputHour, table, labelColor, inputColor);

    // End
    modal.appendChild(modalBtnEnd);
    overlay.appendChild(modal);


    // let modalTitle = '';
    // const btn_close = document.getElementById('btn_close');
    // const btn_finish = document.getElementById('btn_finish');
    
    // overlay.classList.add('display');

    // overlay.innerHTML = `
    //     <div class="modal">
    //         <button class="btn fa-solid fa-xmark" id="btn_close" onclick="closeModal()"></button>
    //         <h2 class="modal_title" id="modal_title">New Task</h2>
    //         <label for="input_taskName">Name</label>
    //         <input type="text" class="modal_input" id="input_taskName" required>
    //         <label for="input_taskHour">Hour</label>
    //         <input type="time" class="modal_input" id="input_taskHour" min="00:00" max="23:59" value="00:00">
    //         <!-- 
    //             Futuras Opções para Dias: 
    //             * Repetir nos dias selecionados: (ex: seg, qua, qui)
    //             * Selecionar dias manualmente 
    //         -->
    //         <h3>Days of Week</h3>
    //         <div class="modal_options" id="select_days">
    //             <table>
    //                 <thead>
    //                     <th><label for="input_check-sun">Sun</label></th>
    //                     <th><label for="input_check-mon">Mon</label></th>
    //                     <th><label for="input_check-tue">Tue</label></th>
    //                     <th><label for="input_check-wed">Wed</label></th>
    //                     <th><label for="input_check-thu">Thu</label></th>
    //                     <th><label for="input_check-fri">Fri</label></th>
    //                     <th><label for="input_check-sat">Sat</label></th>
    //                 </thead>
    //                 <tbody>
    //                     <td><input class="modal_input input_day" type="checkbox" id="input_check-sun" value="0"></td>
    //                     <td><input class="modal_input input_day" type="checkbox" id="input_check-mon" value="1"></td>
    //                     <td><input class="modal_input input_day" type="checkbox" id="input_check-tue" value="2"></td>
    //                     <td><input class="modal_input input_day" type="checkbox" id="input_check-wed" value="3"></td>
    //                     <td><input class="modal_input input_day" type="checkbox" id="input_check-thu" value="4"></td>
    //                     <td><input class="modal_input input_day" type="checkbox" id="input_check-fri" value="5"></td>
    //                     <td><input class="modal_input input_day" type="checkbox" id="input_check-sat" value="6"></td>
    //                 </tbody>
    //             </table>

    //         </div>
            
    //         <label for="input_taskColor">Color</label>
    //         <input type="color" class="modal_input" id="input_taskColor">

    //         <!-- dias  -->
    //         <!-- prioridade 1-5 -->
    //         <!-- categoria -->
    //         <button class="btn btn_primary" id="btn_finish">Add Task</button>
    //     </div>  
    // `;
    // Add new task
        

    // overlay.classList.add('display');
    // const input_name = document.getElementById('input_taskName');
    // const input_hour = document.getElementById('input_taskHour');
    // const input_color = document.getElementById('input_taskColor');
    // const inputs_weekDays = Array.from(document.getElementsByClassName('input_day'));
    
    // btn_close.addEventListener('click', closeModal);

    // btn_finish.addEventListener('click', () => {
    //     // choosenDays será últil para a função "edit" do CRUD
    //     const choosenDays = [];
    //     const days = [];

    //     // Tratamento do Horário (ex: 16:28 => 1628, 00:42 => 42)
    //     const hour = Number(input_hour.value.replace(':', ''));

    //     // Tratamento dos Checkboxes
    //     inputs_weekDays.forEach(check => {
    //         if(check.checked) {
    //             const ArrDayOfWeek = weeks[Number(check.value)];
    //             choosenDays.push(Number(check.value));
    //             ArrDayOfWeek.forEach(obj => {
    //                 if(obj.dia >= today) {
    //                     days.push(obj.dia);
    //                 }
    //             });
    //         }
    //     })

    //     if(days.length < 1) {
    //         return message(null, "Don't forget adding the days");
    //     }

    //     addNewTask(input_name.value, hour, days, input_color.value);
    // })
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
 * criar um algoritimo para localizar a hora e associar a hora da task
 */