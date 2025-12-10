"""
NÃO COLOQUE NUMERO DE PROCESSOS ESTROMBÓLICO :)
Limite configurado em MAX_PROC.
Para muitos processos, os tempos são gerados aleatoriamente.

ASS. Davi, Felipe e Icaro
"""

import random
import os
import psutil  # pip install psutil

# ----------------- CONFIG -----------------
MAX_PROC = 100000   # limite de segurança
USA_CHEGADA_ALEATORIA = True  # arrival aleatório entre 0 e n_proc/2
# ------------------------------------------

processos = []

# medição real de CPU/RAM do programa
proc_psutil = psutil.Process(os.getpid())

def medir_recursos(msg=""):
    cpu = psutil.cpu_percent(interval=0.1)  # uso global da CPU em %
    mem_mb = proc_psutil.memory_info().rss / (1024 * 1024)  # MB de RAM do processo
    print(f"\n[{msg}] CPU: {cpu:.1f}% | RAM: {mem_mb:.2f} MB")


n_proc = int(input('Quant Processos: '))

if n_proc > MAX_PROC:
    print(f"Limite máximo de processos é {MAX_PROC}. Tente de novo com menos.")
    raise SystemExit

# Essa função cria processos
# Para n_proc >= 10 gera tempos aleatórios
# Para n_proc < 10 lê do usuário
def criar_processos(n_proc):
    print("\n=== Criando processos ===")
    if n_proc >= 10:
        for i in range(1, n_proc + 1):
            tempo_execucao = random.uniform(1, 1000)
            if USA_CHEGADA_ALEATORIA:
                arrival = random.randint(0, n_proc // 2)
            else:
                arrival = 0  # todo mundo chega no tempo 0

            processos.append({
                "id": i,
                "arrival": arrival,
                "burst": tempo_execucao,
                "remaining": tempo_execucao,
                "waiting": 0.0,
                "turnaround": 0.0,
                "completion": 0.0,
            })
    else:
        for i in range(1, n_proc + 1):
            tempo_execucao = float(input(f'Tempo do processo {i}: '))
            arrival = int(input(f'Chegada do processo {i} (ms): '))
            processos.append({
                "id": i,
                "arrival": arrival,
                "burst": tempo_execucao,
                "remaining": tempo_execucao,
                "waiting": 0.0,
                "turnaround": 0.0,
                "completion": 0.0,
            })

    print(f"{len(processos)} processos criados.\n")


# SJF PREEMPTIVO (SRTF) COM SIMULAÇÃO DE TEMPO DISCRETO
def sjf_preemptivo():
    print("=== Iniciando SJF Preemptivo (SRTF) ===")

    tempo_atual = 0
    concluidos = 0
    n = len(processos)

    # para fins de métrica de CPU
    tempo_ocupado = 0
    tempo_ocioso = 0

    # se quiser visualizar a linha do tempo
    timeline = []  # (tempo, id_processo_ou_None)

    # loop até todos os processos terminarem
    while concluidos < n:
        # pegar todos que já chegaram e não terminaram
        prontos = [p for p in processos if p["arrival"] <= tempo_atual and p["remaining"] > 0]

        if prontos:
            # escolhe o de menor remaining (SRTF)
            prontos.sort(key=lambda p: p["remaining"])
            atual = prontos[0]

            # executa 1 unidade de tempo (pode ser interpretado como 1 ms)
            atual["remaining"] -= 1
            tempo_ocupado += 1
            timeline.append((tempo_atual, atual["id"]))

            # se terminou
            if atual["remaining"] <= 0:
                atual["completion"] = tempo_atual + 1
                atual["turnaround"] = atual["completion"] - atual["arrival"]
                atual["waiting"] = atual["turnaround"] - atual["burst"]
                concluidos += 1
        else:
            # CPU ociosa nesse tick
            tempo_ocioso += 1
            timeline.append((tempo_atual, None))

        tempo_atual += 1

    # métricas agregadas
    total_wait = sum(p["waiting"] for p in processos)
    total_turn = sum(p["turnaround"] for p in processos)
    media_wait = total_wait / n
    media_turn = total_turn / n

    tempo_total = tempo_atual
    # se nunca ficou ocioso, tempo_ocioso vai ser 0
    cpu_util = (tempo_ocupado / tempo_total) * 100 if tempo_total > 0 else 0

    print("\n=== Resultados SJF Preemptivo ===")
    for p in sorted(processos, key=lambda x: x["id"]):
        print(f"P{p['id']}: arrival={p['arrival']:.0f}, burst={p['burst']:.2f}, "
              f"wait={p['waiting']:.2f}, turnaround={p['turnaround']:.2f}, "
              f"completion={p['completion']:.2f}")

    print("\n=== Timeline ===")
    linha = " ".join(
        f"P{pid}" if pid is not None else "_"
        for (_, pid) in timeline
    )
    print(linha)

    print(f"\nMédia de espera: {media_wait:.2f}")
    print(f"Média de turnaround: {media_turn:.2f}")
    print(f"Tempo total da simulação: {tempo_total} unidades")
    print(f"Tempo ocupado: {tempo_ocupado} | Tempo ocioso: {tempo_ocioso}")
    print(f"Utilização lógica da CPU (simulada): {cpu_util:.2f}%\n")

    return media_wait, media_turn, cpu_util

# --------- MAIN FLOW ---------
medir_recursos("inicio (antes de criar processos)")
criar_processos(n_proc)
medir_recursos("apos criar processos")
sjf_preemptivo()
medir_recursos("apos SJF preemptivo")