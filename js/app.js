'use strict';
import { Task } from "./TaskApi.js";

const date = new Date();
const mesAtual = new Date(date.getFullYear(), date.getMonth()).getMonth();
const ultimoDia = new Date(date.getFullYear(), mesAtual + 1, 0).getDate();
const primeiroDiaSemana = new Date(date.getFullYear(), mesAtual).getDay();
const diasSemana = [[], [], [], [], [], [], []];
const hoje = date.getDate();
// const hoje = 2;

for(let d = 1, dia = primeiroDiaSemana; d <= ultimoDia; d++) {
    diasSemana[dia].push({dia: d, semana: numeroSemana(d) , tasks: []})
    if(dia > diasSemana.length - 2) {
        dia = 0;
    }else {
        dia ++;
    }
}

const tasks = Task.getTasks();

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
 * 
 * =================
 *      Dúvidas
 * =================
 * Se ficar alguns dias sem mexer no app, as alterações serão serão feitas automaticamente em relação as tasks não feitas?
 * 
 * ===============================
 *      CORREÇÕES A FAZER
 * ===============================
 * corrigir rows duplicadas para tasks com mesmos horários e dias diferentes 
 * 
 * */


/**
 * ==========================================
 *  Planejamento de Done, undone, justify
 * ==========================================
 * (OK) deverá ser criado um array de booleans
 * (OK) sempre quando clicar em uma task, de início ela mudará de cor (done = transparente) e a array done da task terá o valor true, relativo á data da task da task,
 * ex: dias = [4, 5, 6, 9, 12, 13]  done = [false, true, true] // neste exemplo a task do dia 4 não foi realizada, mas nos dias 5 e 6 foram feitas.
 * a tarefa só receberá o valor false apartir das 00:00 do dia seguinte, caso não tenha sido realizada, do contrário, receberá true imediatamente após o clique.
 * Para Justify e undone, undone não terá influência alguma na array done da task. A justified adicionará o valor do dia ex: dias = [4, 5, 6, 9, ...] 
 * done = [true, false, 6, true] a task do dia 4 foi realizada, 5 não foi, "A DO DIA  6 FOI JUSTIFICADA" (recebeu o valor da data), e do dia 9 foi realizada.
 * caso exista mais de uma task da mesma no mesmo dia, o valor deverá ser armazenado em uma array, ex: done = [true, false, [true, true, false], false]
 * 
 * ==== Renderização Provisória =====
 * Tasks undone & futuras = cor normal (sem valor)
 * Tasks done = cor transparente + icone V  (true)
 * Tasks justified = cor preta + (pesquisar icone) (colocar valor refente ao dia da justificativa) 
 * Tasks vencidas = cor vermelha +  icone X (false)
 * 
 * 
 * ===== Restrições =====
 * Não será possível marca uma Task vencida como Done (true), só será possivel justifica-lá
 * Só será possível justificar tarefas vencidas e atuais, não tarefas da data do dia seguinte em diante
 * Não será possível marcar qualquer tarefa do dia seguinte como Done(true) somente a tarefa da data atual
 * 
 * ==== Ideias ====
 * Deixar as tarefas do dia atual com um efeito e animação (como se estivesse brilhando)
 * Terá uma opção de backup das tarefas e seus estados. Irá salvar o arquivo do local stroage em string e o usuário poderá baixar
 * Quando o usuário adicionar uma nova task e tentar adicionar no mesmo horário que outras, ele terá que escolher outro horário e o horário será destacado como "vermelho"
 * 
 * ===== lógicas adicionais =====
 * localstorage armazena a variável "diaSeguinte = hoje + 1" (fazer no contexto do Date() para evitar dia 32 ou coisa parecida), caso "hoje === diaSeguinte (do localstorage)",
 * as as tarefas não feitas terão o valor de false.
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

        // const status = taskAtual[0].status ? taskAtual.status.status : null; // mudar para done
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

function teste(dia, task) {
    if(task) {
        const statusExiste = task.status.find(stat => (stat.dia === dia) && stat.done !== null);
        if(statusExiste) {
            console.log('Não é possível marcar esta tarefa novamente');
        }else if(dia === hoje) {
            task.status.push({dia: hoje, done: true}); 
            Task.editTask(task.id, task.name, task.horarios, task.dias, task.status, task.color);
        }
    }else {
        console.log('adicionar nova task');
    }

    // return location.reload();
}

console.log(hoje)
console.log(hoje + 1)
// localStorage armazena hoje + 1 (amanhã)

if(hoje === 1) {
    //1. armazenar relatório do mês quando localStorage hoje === 1

    //2. zera o array da propriedade status das tasks após o envio do relatório mensal
    tasks.forEach(task => Task.editTask(task.id, task.name, task.horarios, task.dias, task.status = [{dia: hoje, done: null}], task.color));
}


// localStorage.clear()
// Task.newTask('watch tv', [1200], [7, 12, 23, 8], [{dia: hoje, done: null}], '#ab4e91');
// Task.newTask('play game', [2300], [3, 15, 18, 6], [{dia: hoje, done: null}], '#8ef3f3');
// Task.newTask('sleep', [100], [2, 5, 8, 9, 16, 7], [{dia: hoje, done: null}], '#70cbba');

console.log(tasks)
