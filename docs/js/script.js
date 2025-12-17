import { calcularSJFPreemptivo } from "./algoritmo.js";

const storageKey = "processos";
const form = document.getElementById("form-processo");
const tabela = document.getElementById("tabela");
const tbody = document.getElementById("corpo-tabela");
const btnResetar = document.getElementById("btn-resetar");
const btnExecutar = document.querySelector("section button.bg-second");
const mediasArticles = document.querySelectorAll(".medias");
const btnExemplos = document.getElementById("btn-exemplos");
const thead = document.getElementById("table-head");

let modoResultado = false;

function atualizarTabela() {
  let processos = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Limpa o tbody (referência reaproveitada)
  tbody.innerHTML = "";

  if (processos.length === 0) {
    modoResultado = false;

    thead.innerHTML = "";

    tbody.innerHTML = `
    <tr id="placeholder-row">
      <td colspan="4" class="text-center text-gray-400 py-6">
        Nenhum processo adicionado.
      </td>
    </tr>
  `;

    mediasArticles.forEach((article) => article.classList.add("hidden"));

    return;
  }

  const headerHTML = modoResultado
    ? `
    <tr class="border-b border-gray-300 text-center">
      <th class="py-5 w-[12.5%]">Processo</th>
      <th class="py-5 w-[12.5%]">Chegada</th>
      <th class="py-5 w-[12.5%]">Execução</th>
      <th class="py-5 w-[12.5%]">Início</th>
      <th class="py-5 w-[12.5%]">Conclusão</th>
      <th class="py-5 w-[12.5%]">Espera</th>
      <th class="py-5 w-[12.5%]">Turnaround</th>
      <th class="py-5 w-[12.5%]">Ação</th>
    </tr>
  `
    : `
    <tr class="border-b border-gray-300 text-center">
      <th class="py-5 w-[25%]">Processo</th>
      <th class="py-5 w-[25%]">Chegada</th>
      <th class="py-5 w-[25%]">Execução</th>
      <th class="py-5 w-[25%]">Ação</th>
    </tr>
  `;

  thead.innerHTML = headerHTML;
  tbody.innerHTML = "";
  processos.forEach((p, i) => {
    tbody.innerHTML += modoResultado
      ? `
      <tr class="border-b border-gray-200 text-center">
        <td class="py-4 w-[12.5%]">${p.nome}</td>
        <td class="py-4 w-[12.5%]">${p.chegada}</td>
        <td class="py-4 w-[13%]">${p.execucao}</td>
        <td class="py-4 w-[12.5%]">${p.inicio}</td>
        <td class="py-4 w-[13%]">${p.conclusao}</td>
        <td class="py-4 w-[12%]">${p.espera}</td>
        <td class="py-4 w-[14%]">${p.turnaround}</td>
        <td class="py-4 w-[12.5%]">
          <button class="btn-deletar cursor-pointer" data-indice="${i}">
            <img src="./assets/delete.svg" />
          </button>
        </td>
      </tr>
    `
      : `
      <tr class="border-b border-gray-200 text-center">
        <td class="py-4 w-[25%]">${p.nome}</td>
        <td class="py-4 w-[25%]">${p.chegada}</td>
        <td class="py-4 w-[27%]">${p.execucao}</td>
        <td class="py-4 w-[27%]">
          <button class="btn-deletar cursor-pointer" data-indice="${i}">
            <img src="./assets/delete.svg" />
          </button>
        </td>
      </tr>
    `;
  });
}

function enviarProcessos(e) {
  e.preventDefault();

  voltarModoNormal();

  const nome = document.getElementById("processo").value;
  const chegada = +document.getElementById("chegada").value;
  const execucao = +document.getElementById("execucao").value;

  if (!nome || chegada < 0 || execucao <= 0) {
    alert("Preencha os campos corretamente.");
    return;
  }

  let processos = JSON.parse(localStorage.getItem(storageKey)) || [];

  processos.push({ nome, chegada, execucao });

  localStorage.setItem(storageKey, JSON.stringify(processos));
  form.reset();

  atualizarTabela();
}

function executarEscalonamento() {
  let processos = JSON.parse(localStorage.getItem(storageKey)) || [];

  if (processos.length === 0) {
    alert("Nenhum processo para executar!");
    return;
  }

  const {
    execucaoTimeline,
    processos: resultado,
    tempoMedioEspera,
    tempoMedioTurnaround,
  } = calcularSJFPreemptivo(processos);

  localStorage.setItem("execucaoTimeline", JSON.stringify(execucaoTimeline));
  localStorage.setItem(storageKey, JSON.stringify(resultado));

  modoResultado = true;

  atualizarTabela();

  exibirMedias(tempoMedioEspera, tempoMedioTurnaround);
  gerarGantt(execucaoTimeline);
}

function resetarProcessos() {
  localStorage.removeItem(storageKey);
  modoResultado = false;
  voltarModoNormal();
}

function deletarProcesso(i) {
  let processos = JSON.parse(localStorage.getItem(storageKey)) || [];
  processos.splice(i, 1);
  localStorage.setItem(storageKey, JSON.stringify(processos));
  localStorage.removeItem("execucaoTimeline");

  voltarModoNormal();
}

function exibirMedias(mediaEspera, mediaTurnaround) {
  document.getElementById("media-espera").textContent = mediaEspera.toFixed(2);
  document.getElementById("media-turnaround").textContent =
    mediaTurnaround.toFixed(2);

  document.querySelectorAll(".medias").forEach((article) => {
    article.classList.remove("hidden");
  });
}

function gerarGantt(execucaoTimeline) {
  const ganttSection = document.getElementById("gantt-section");
  const ganttChart = document.getElementById("gantt-chart");

  ganttChart.innerHTML = "";

  execucaoTimeline.forEach((item) => {
    const bloco = document.createElement("div");
    const duracao = item.fim - item.inicio;

    bloco.className =
      "flex items-center justify-center text-white font-bold shadow-md rounded-xl flex-shrink-0";
    bloco.style.width = `${duracao * 50}px`;
    bloco.style.height = "80px";

    const cores = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    const indice = item.indice;
    bloco.style.backgroundColor = cores[indice % cores.length];

    bloco.textContent = item.nome;

    ganttChart.appendChild(bloco);
  });

  ganttSection.classList.remove("hidden");
}

function voltarModoNormal() {
  modoResultado = false;

  document.getElementById("gantt-section").classList.add("hidden");
  mediasArticles.forEach((article) => article.classList.add("hidden"));

  atualizarTabela();
}

function carregarExemplos() {
  voltarModoNormal();

  const exemplos = gerarProcessos(100);

  localStorage.setItem(storageKey, JSON.stringify(exemplos));
  atualizarTabela();
}

function gerarProcessos(numProcessos) {
  const processos = [];
  const max_execucao = 10;

  for (let i = 0; i < numProcessos; i++) {
    const nomeProcesso = `P${i + 1}`;
    const chegadaProcesso = i;
    const execucaoProcesso = Math.floor(Math.random() * max_execucao) + 1;

    processos.push({
      nome: nomeProcesso,
      chegada: chegadaProcesso,
      execucao: execucaoProcesso,
    });
  }
  return processos;
}

form.addEventListener("submit", enviarProcessos);
btnExecutar.addEventListener("click", executarEscalonamento);
btnResetar.addEventListener("click", resetarProcessos);
btnExemplos.addEventListener("click", carregarExemplos);
document.addEventListener("DOMContentLoaded", atualizarTabela);

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-deletar");
  if (!btn) return;

  const indice = +btn.dataset.indice;
  deletarProcesso(indice);
});
