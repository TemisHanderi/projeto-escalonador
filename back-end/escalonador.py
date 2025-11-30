"""
	PELO AMOR DE DEUS, NÃO COLOQUE UM NUMERO DE PROCESSOS ***********ESTROMBOLICOS*****
	EU BOTEI 1000000000, E TAVA CORROENDO 4GB DE RAM e SUBINDO!!!!!!!
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
						!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

							!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
								!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	PARA FINS DE TESTE, HABILITAR OS PRINTS
		OBS: OS PRINTS TAO FEIOSOS
  
  ASS. Davi, Felipe e Icaro
"""



import random

processo = []
    
n_proc = int(input('Quant Processos: '))


#Essa funcao verifica se a quantidade processos é grande demais,
#pq dai se for, nao da pra preencher tudo na mao, INUMANAMENTE IMPOSSIVEL
#Tambem cria os processos
def criar_processos(n_proc):
    if n_proc >= 10:

        for i in range(1, n_proc+1):
            tempoExecucao = random.uniform(1, 1000)#Cria valores aleatorios de execução pros processos
            processo.append({
            "id": len(processo) + 1,
            "burst": tempoExecucao,
            }) #Armazena o ID e o tempo de execução bruto(BURST)

    else:
        for i in range(1, n_proc+1):
            tempoExecucao = float(input('Tempo: '))

            processo.append({
            "id": len(processo) + 1,
            "burst": tempoExecucao,
            })
#Essa DEF executa o SJF em si 
def sjf():

    processo.sort(key=lambda p: p['burst'])

    #for p in processo:
       #print(f"ID {p['id']}: {p['burst']} ms")


    tempoEspera = 0
    for p in processo:
        p['tempoEspera'] = tempoEspera # O tempo de espera para o primeiro processo é sempre 0
        p['retorno'] = p['tempoEspera'] + p['burst']
        tempoEspera += p['burst']
        
        # Mas aos processos em diante, independente da quantidade, vai ser sempre
        #um somatório do tempo de espera dos processos anteriores


    #Calculo da medio, padrao
    aux_burst = 0
    aux_tempoEspera = 0
    aux_retorno = 0
    for i in processo:
        aux_burst += i['burst']
        aux_tempoEspera += i['tempoEspera']
        aux_retorno += i['retorno']

    mediaBurst = aux_burst / n_proc
    media_tempoEspera = aux_tempoEspera / n_proc
    mediaRetorno = aux_retorno / n_proc
    
    
    #print('Media B: {}\nMedia E: {}\nMedia R:{}'.format(mediaBurst, media_tempoEspera, mediaRetorno))
    

    return mediaBurst, media_tempoEspera, mediaRetorno
criar_processos(n_proc)
sjf()