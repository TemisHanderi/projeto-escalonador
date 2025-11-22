const storageKey = "processos";
const form = document.getElementById("form-processo");
const tabela = document.getElementById("tabela");
const btnResetar = document.getElementById("btn-resetar");
const tbody = document.getElementById("corpo-tabela");

function atualizarTabela() {
  let processosSalvos = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Remover thead antigo se existir
  const theadExistente = tabela.querySelector("thead");
  if (theadExistente) theadExistente.remove();

  // Limpar tbody
  tbody.innerHTML = "";

  if (processosSalvos.length === 0) {
    tbody.innerHTML = `
      <tr id="placeholder-row">
          <td colspan="4" class="text-center text-gray-400 py-3">
              Nenhum processo adicionado.
          </td>
      </tr>
    `;
    return;
  }

  // Criar thead só quando houver dados
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr class="text-center border-b border-gray-300">
      <th class="px-4 py-2">Processo</th>
      <th class="px-4 py-2">Chegada</th>
      <th class="px-4 py-2">Execução</th>
      <th class="px-4 py-2">Ação</th>
    </tr>
  `;
  tabela.prepend(thead);

  processosSalvos.forEach((processo, indice) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-gray-200 text-center";

    tr.innerHTML = `
      <td class="py-3">${processo.nome}</td>
      <td class="py-3">${processo.chegada}</td>
      <td class="py-3">${processo.execucao}</td>
      <td class="py-3">
          <button class="cursor-pointer">
              <img src="./assests/delete.svg" alt="Deletar" />
          </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function resetarProcessos() {
  localStorage.removeItem(storageKey);
  tbody.innerHTML = `
    <tr id="placeholder-row">
      <td colspan="4" class="text-center text-gray-400 py-3">
        Nenhum processo adicionado.
      </td>
    </tr>
  `;
  const theadExistente = tabela.querySelector("thead");
  if (theadExistente) theadExistente.remove();

  alert("Todos processos foram removidos.");
}

function enviarProcessos(event) {
  event.preventDefault();

  const nomeProcesso = document.getElementById("processo").value;
  const tempoChegada = parseInt(document.getElementById("chegada").value) || 0;
  const tempoExecucao =
    parseInt(document.getElementById("execucao").value) || 0;

  if (!nomeProcesso || tempoChegada < 0 || tempoExecucao <= 0) {
    alert("Preencha os campos corretamente.");
    return;
  }

  const novoProcesso = {
    nome: nomeProcesso,
    chegada: tempoChegada,
    execucao: tempoExecucao,
  };

  let processosSalvos = JSON.parse(localStorage.getItem(storageKey)) || [];
  processosSalvos.push(novoProcesso);

  localStorage.setItem(storageKey, JSON.stringify(processosSalvos));
  alert("Processo adicionado!");
  form.reset();

  atualizarTabela();
}

form.addEventListener("submit", enviarProcessos);

document.addEventListener("DOMContentLoaded", atualizarTabela);

btnResetar.addEventListener("click", resetarProcessos);
