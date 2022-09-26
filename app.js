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
const btnFecharJanela = document.querySelector(".btn-fechar_janela");