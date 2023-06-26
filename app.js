'use strict';

// // Código Antigo 09/2022
// const btnFechaModalHora = document.querySelector(".modal#horario-modal .btn-fechar_janela");
// const btnConfirmaHora = document.querySelector(".btn-confirmar#confirma-hora");
// const overlay = document.querySelector(".overlay");
// const modalHora = document.querySelector(".modal#horario-modal");

// const abreModalHora = elemento => {
//     modalHora.classList.add("mostrar");
//     overlay.classList.add("mostrar");
//     btnConfirmaHora.addEventListener("click", ()=>{
//         const hora = document.querySelector(".modal .hora").value;
//         elemento.textContent = hora;
//     })
//     btnFechaModalHora.addEventListener("click", fecharModalHora);
// }

// function fecharModalHora () {
//     modalHora.classList.remove("mostrar");
//     overlay.classList.remove("mostrar");
// }

// novo Código - 06/2023

// TAREFA

class Task {
    id;
    name;
    prior;
    category;
    desc;
    days = [];
    hours = [];
    done = [];
    justify = [];
    failed = [];
}

function createTask() {
    const task = new Task();

    task.id = 12;
    task.name = 'play castevania';
    task.prior = 2; 
    task.category = 'Lazer';
    task.desc = 'blablalba';
    task.days = [1, 2, 3, 4, 5, 6];
    task.hours = [1030, 1123];

    console.log(task)
}

createTask()

