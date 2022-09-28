'use strict';
/* BOTÔES

* cadastrar categoria => o usuário poderá customizar a categoria com cores, nivel de importancia, etc...

* adicionar horário => abre um modal para o susário digitar o horário
* após adicionado o horário, gerará um tr com 8 tds.

evento no td => exceto td[0], abrirá um modal perguntando que tipo de dado será adicionado á rotina, perguntará qual categoria existente será utilizada.

clique no td[0] => abrirá uma janela para alteração do horário

*/

const tabela = document.querySelector(".tabela-dr");
const overlay = document.querySelector(".overlay");
const modalHora = document.querySelector(".modal#horario-modal");
const modalRotina = document.querySelector(".modal#rotina-modal");
const btnConfirmaHora = document.querySelector(".modal .btn-confirmar#confirma-hora");
const btnFecharJanela = document.querySelector(".btn-fechar_janela");
const btnNothing = document.querySelectorAll(".btnAddHora");
const catgorias = [];

const displayModal = modal => { 
    modal.classList.add("mostrar"); 
    overlay.classList.add("mostrar");
    btnFecharJanela.addEventListener("click", ()=>{ closeModal(modal) });
};

const closeModal = modal => {
    modal.classList.remove("mostrar");
    overlay.classList.remove("mostrar");
}

const adicionarHorario = ()=> {
    const hora = document.querySelector(".modal .hora").value;
    console.log(hora)
    closeModal(modalHora);
    tabela.innerHTML+=`
    <tr>
        <td>${hora}</td>
        <td></td>                
        <td></td>                
        <td></td>                
        <td></td>                
        <td></td>                
        <td></td>                
        <td></td>                
    </tr>
    <tr>
        <td><button class="btnAddHora">adicionar hora</button></td>
        <td></td>                
        <td></td>                
        <td></td>                
        <td></td>                
        <td></td>                
        <td></td>                
        <td></td>                
    </tr>`;
    
    // criar função adicionar horario
        // criar variavel hora = <input class="hora"/>
        // ao apertar em confirmar, a tabela receberá um <tr> com 8 tds dentro, 
        // no td[0] será computado o valor inserido em hora
}


// class Catg {
//     constructor(nome, cor, imp) {
//         this.nome = nome;
//         this.cor = cor;
//         this.imp = imp;
//     }
// }

btnNothing.forEach(btn=> btn.addEventListener("click", ()=>{ displayModal(modalHora) }));
btnConfirmaHora.addEventListener("click", adicionarHorario);