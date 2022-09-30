'use strict';
const btnFechaModalHora = document.querySelector(".modal#horario-modal .btn-fechar_janela");
const btnConfirmaHora = document.querySelector(".btn-confirmar#confirma-hora");
const overlay = document.querySelector(".overlay");
const modalHora = document.querySelector(".modal#horario-modal");

const abreModalHora = elemento => {
    modalHora.classList.add("mostrar");
    overlay.classList.add("mostrar");
    btnConfirmaHora.addEventListener("click", ()=>{
        const hora = document.querySelector(".modal .hora").value;
        elemento.textContent=hora;
    })
    btnFechaModalHora.addEventListener("click", fecharModalHora);
}

function fecharModalHora () {
    modalHora.classList.remove("mostrar");
    overlay.classList.remove("mostrar");
}
