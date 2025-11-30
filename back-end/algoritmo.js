export function calcularSJFPreemptivo(processos) {
  let tempo = 0;
  const n = processos.length;
  let completos = 0;
  const execRestante = processos.map(p => p.execucao);

  // Inicializa atributos
  processos.forEach(p => {
    p.inicio = null;
    p.conclusao = 0;
    p.espera = 0;
    p.turnaround = 0;
  });

  const execucaoTimeline = [];
  let processoAnterior = null;
  let blocoInicio = 0;

  while (completos < n) {
    let menor = -1;

    for (let i = 0; i < n; i++) {
      if (
        processos[i].chegada <= tempo &&
        execRestante[i] > 0 &&
        (menor === -1 || execRestante[i] < execRestante[menor])
      ) {
        menor = i;
      }
    }

    if (menor === -1) {
      tempo++;
      continue;
    }

    // Registra início de execução do processo
    if (processos[menor].inicio === null) {
      processos[menor].inicio = tempo;
    }

    // Se mudou de processo, fecha bloco anterior
    if (processoAnterior !== null && processoAnterior !== menor) {
      execucaoTimeline.push({
        nome: processos[processoAnterior].nome,
        inicio: blocoInicio,
        fim: tempo,
        indice: processoAnterior
      });
      blocoInicio = tempo;
    }

    execRestante[menor]--;
    processoAnterior = menor;
    tempo++;

    // Se terminou o processo
    if (execRestante[menor] === 0) {
      completos++;
      processos[menor].conclusao = tempo;
      processos[menor].turnaround = tempo - processos[menor].chegada;
      processos[menor].espera =
        processos[menor].turnaround - processos[menor].execucao;

      execucaoTimeline.push({
        nome: processos[menor].nome,
        inicio: blocoInicio,
        fim: tempo,
        indice: menor
      });
      processoAnterior = null;
      blocoInicio = tempo;
    }
  }

  // Cálculo das médias
  const totalEspera = processos.reduce((acc, p) => acc + p.espera, 0);
  const totalTurn = processos.reduce((acc, p) => acc + p.turnaround, 0);

  const tempoMedioEspera = totalEspera / n;
  const tempoMedioTurnaround = totalTurn / n;

  return {
    processos,
    tempoMedioEspera,
    tempoMedioTurnaround,
    execucaoTimeline
  };
}
