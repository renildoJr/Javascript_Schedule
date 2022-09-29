'use strict';
const btnAddHora = document.querySelector(".add-hora");
const btnFechaModal = document.querySelectorAll(".btn-fechar_janela");
const btnConfirma = document.querySelectorAll(".btn-confirmar");
const overlay = document.querySelector(".overlay");
const modalHora = document.querySelector(".modal#horario-modal");
const tabela = document.querySelector(".tabela-dr tbody");
let trID = 0;

const openModal = (modal, index, funcao) => {
    modal.classList.add("mostrar");
    overlay.classList.add("mostrar");
    btnConfirma[index].addEventListener("click", () => {closeModal(modal); funcao()})
    btnFechaModal[index].addEventListener("click", () => {closeModal(modal)})
}

const closeModal = modal => {
    modal.classList.remove("mostrar");
    overlay.classList.remove("mostrar");
}

const addHora = () => {
    tabela.innerHTML+=`<tr class="tabelaHora" id="${trID}"></tr>`;
    const tabelaHora = document.querySelectorAll(".tabelaHora");
    const hora = document.querySelector(".modal .hora").value;

    for(let i = 0; i < 8; i++ ){
        i === 0? tabelaHora[trID].innerHTML+=`<td>${hora}</td>`: tabelaHora[trID].innerHTML+="<td>hello world</td>";
    }
    
    console.log(tabelaHora)

    trID++;
}

btnAddHora.addEventListener("click", ()=>{openModal(modalHora, 0, addHora)});