type Row = [string, string]
const rows: Row[] = [
['Animações','One Piece,Dragon Ball Z,Bleach,Naruto,Pokémon,Attack on Titan,Demon Slayer,Jujutsu Kaisen,Death Note,Fullmetal Alchemist,Hunter x Hunter,My Hero Academia,Chainsaw Man,Spy x Family,Haikyuu,Code Geass,Steins Gate,Fairy Tail,Tokyo Ghoul,Sword Art Online,JoJo,One Punch Man,Mob Psycho 100,Frieren,Dandadan,Avatar,Korra,Ben 10,Hora de Aventura,Steven Universo,Bob Esponja,Os Simpsons,Rick and Morty,South Park,Jovens Titãs,X-Men,Invencível,Arcane,Castlevania,Cyberpunk Edgerunners,Shrek,Toy Story,Os Incríveis,Procurando Nemo,Divertida Mente,Kung Fu Panda,Como Treinar o Seu Dragão,Monstros S.A.,Carros,Frozen'],
['Atualidades','inteligência artificial,rede social,streaming,podcast,influenciador,meme,vídeo curto,trabalho remoto,Pix,delivery,carro elétrico,energia solar,reciclagem,mudanças climáticas,onda de calor,seca,enchente,vacina,saúde mental,terapia,academia,corrida de rua,Big Brother Brasil,reality show,festival de música,show ao vivo,cultura gamer,games online,criptomoeda,golpe digital,privacidade digital,fake news,eleição,economia,inflação,empreendedorismo,startup,home office,aplicativo de namoro,turismo,nômade digital,economia criativa,sustentabilidade,veículo autônomo,impressão 3D,realidade virtual,energia limpa,telemedicina,comida vegana,brechó'],
['Esportes','futebol,vôlei,basquete,futsal,handebol,tênis,tênis de mesa,natação,corrida,atletismo,ciclismo,surfe,skate,ginástica artística,judô,jiu-jitsu,boxe,mma,karatê,taekwondo,fórmula 1,motogp,automobilismo,beisebol,softbol,rugby,futebol americano,críquete,golfe,hipismo,esgrima,badminton,levantamento de peso,remo,canoagem,vela,mergulho,wrestling,luta olímpica,boliche,sinuca,dardos,xadrez,eSports,futebol de areia,vôlei de praia,maratona,triathlon,escalada,parkour'],
['Objetos do dia a dia','carregador,fone de ouvido,chave,carteira,mochila,guarda-chuva,escova de dentes,toalha,espelho,tesoura,panela,vassoura,liquidificador,garrafa térmica,extensão elétrica,despertador,cabide,roteador,modem,óculos,relógio,abridor de lata,cortador de unha,prendedor de roupa,fita adesiva,lanterna,grampeador,saca-rolhas,balde,rodo,mouse,calculadora,caderno,pilha,isqueiro,sabonete,shampoo,desodorante,chapinha,secador de cabelo,post-it,controle remoto,travesseiro,cobertor,caneca,prato,colher,escorredor,lixeira,pano de prato'],
['Conhecimentos gerais','Brasil,Recife,Rio de Janeiro,São Paulo,Salvador,Amazonas,caatinga,oceano,Lua,Sol,planeta,continente,equador,hemisfério,vulcão,terremoto,arco-íris,eclipse,fotossíntese,gravidade,eletricidade,internet,biblioteca,museu,universidade,democracia,Constituição,ONU,direitos humanos,Revolução Industrial,Idade Média,Renascimento,Brasil Colônia,abolição,independência,literatura,poesia,teatro,cinema,música,pintura,escultura,matemática,ciência,átomo,DNA,coração,floresta,deserto,cultura'],
['Profissões','médico,enfermeiro,dentista,psicólogo,fisioterapeuta,farmacêutico,gari,professor,diretor de escola,engenheiro,arquiteto,pedreiro,eletricista,encanador,mecânico,motorista,motoboy,piloto,comissário de bordo,policial,bombeiro,advogado,juiz,contador,administrador,vendedor,caixa,atendente,garçom,cozinheiro,padeiro,confeiteiro,agricultor,veterinário,biólogo,cientista,programador,designer,fotógrafo,jornalista,repórter,publicitário,ator,músico,atleta,personal trainer,cabeleireiro,maquiador,costureiro,entregador'],
['Área da saúde','anatomia,ambulância,anestesia,antibiótico,atestado,batimento cardíaco,bisturi,coleta de sangue,consulta,curativo,diagnóstico,dor de cabeça,exame de sangue,febre,fratura,gestação,glicose,hospital,infecção,injeção,insônia,internação,medicação,oxigênio,paciente,plantão,pronto-socorro,pressão arterial,prevenção,receita médica,recuperação,reabilitação,ressonância magnética,raio-X,sala de cirurgia,sangue,sintoma,soro,termômetro,transfusão,triagem,ultrassom,UTI,vírus,vitamina,vacinação,atendimento,respiração,saúde bucal,sono'],
]
const cues: Record<string, [string, string]> = {
  'Animações': ['história que rende conversa entre fãs', 'personagens enfrentam grandes mudanças'], Atualidades: ['assunto que circula na rotina recente', 'tema que movimenta conversa e escolhas'], Esportes: ['treino e estratégia fazem diferença', 'torcida acompanha cada momento'], 'Objetos do dia a dia': ['faz falta na hora certa', 'aparece em uma rotina comum'], 'Conhecimentos gerais': ['ajuda a entender o mundo ao redor', 'aprendizado que liga fatos e pessoas'], Profissões: ['trabalho que pede preparo e atenção', 'rotina que ajuda muita gente'], 'Área da saúde': ['cuidado que pede atenção ao corpo', 'situação comum em atendimento e prevenção'],
}
const curated = new Map<string, [string, string]>(`
One Piece|amizade formada durante uma longa viagem|um sonho reúne gente muito diferente
Dragon Ball Z|treino costuma vir antes da ameaça|a disputa sempre encontra um nível acima
Bleach|uma vida comum esconde outra responsabilidade|conflitos atravessam mundos diferentes
Naruto|ser reconhecido importa desde a infância|rivais crescem seguindo caminhos opostos
Pokémon|a viagem vale tanto quanto a coleção|parceiros evoluem junto com o treinador
Attack on Titan|o perigo parecia estar do lado de fora|a verdade muda antigas alianças
Demon Slayer|uma perda familiar inicia a jornada|disciplina ajuda a enfrentar a noite
Jujutsu Kaisen|uma escola prepara para perigos invisíveis|controlar a força é parte do problema
Death Note|uma decisão vira duelo de inteligência|o poder cobra um preço moral
Fullmetal Alchemist|dois irmãos tentam reparar um erro|toda troca parece cobrar algo
Hunter x Hunter|uma prova abre caminho para o mundo|amizades resistem a desafios imprevisíveis
My Hero Academia|talento precisa de treino e responsabilidade|uma turma inteira sonha em proteger pessoas
Chainsaw Man|um trabalho perigoso paga dívidas|desejos simples convivem com muito caos
Spy x Family|todos escondem algo dentro de casa|uma família improvisada precisa parecer normal
Haikyuu|uma equipe desacreditada cresce no treino|altura não decide tudo dentro da quadra
Code Geass|estratégia e identidade secreta movem a rebelião|uma ordem pode mudar qualquer confronto
Steins Gate|uma experiência caseira altera o futuro|consertar escolhas custa caro aos amigos
Fairy Tail|missões são resolvidas por um grupo barulhento|a união vale mais do que as regras
Tokyo Ghoul|a identidade fica dividida depois de um acidente|sobreviver exige esconder quem se tornou
Sword Art Online|uma diversão se transforma em prisão|cada fase aproxima o grupo da saída
JoJo|a mesma família enfrenta ameaças por gerações|poses e estilo fazem parte dos confrontos
One Punch Man|vencer fácil demais provoca tédio|o reconhecimento demora mais que as batalhas
Mob Psycho 100|um adolescente tenta controlar as emoções|um mentor falastrão acompanha seu crescimento
Frieren|a aventura continua depois da grande vitória|o tempo pesa diferente para cada companheiro
Dandadan|o sobrenatural invade a rotina escolar|duas crenças opostas aproximam os amigos
Avatar|equilíbrio entre povos depende de um jovem viajante|cada região ensina uma forma diferente de agir
Korra|uma cidade moderna desafia antigas tradições|liderar exige adaptação a novos conflitos
Ben 10|férias em família viram missões inesperadas|cada problema pede uma transformação diferente
Hora de Aventura|uma amizade explora um mundo muito estranho|aventuras absurdas escondem assuntos sérios
Steven Universo|uma herança familiar traz poderes e dúvidas|conversar resolve conflitos que a força não resolve
Bob Esponja|um emprego simples gera confusões diárias|o otimismo incomoda alguns vizinhos
Os Simpsons|uma família exagera problemas cotidianos|a cidade inteira participa das confusões
Rick and Morty|viagens impossíveis complicam relações familiares|a ciência abre portas que deveriam ficar fechadas
South Park|crianças observam o absurdo dos adultos|a cidade reage de forma exagerada a tudo
Jovens Titãs|uma equipe divide missões e a mesma casa|amizade e brincadeiras continuam entre as lutas
X-Men|ser diferente provoca medo e perseguição|uma equipe protege até quem a rejeita
Invencível|crescer muda a imagem que um filho tinha do pai|ter poder não evita consequências dolorosas
Arcane|duas cidades vivem a mesma crise de lados opostos|irmãs são separadas por escolhas e conflitos
Castlevania|uma vingança ameaça pessoas inocentes|caçadores improváveis se unem contra a noite
Cyberpunk Edgerunners|uma cidade brilhante consome seus moradores|ambição e tecnologia cobram caro
Shrek|alguém solitário recebe visitas indesejadas|um conto de fadas foge do padrão romântico
Toy Story|a chegada de um favorito ameaça uma amizade|uma aventura acontece quando ninguém está olhando
Os Incríveis|uma família tenta esconder aquilo que sabe fazer|rotina doméstica e grandes missões entram em choque
Procurando Nemo|um pai atravessa o desconhecido pelo filho|confiar também faz parte da proteção
Divertida Mente|uma mudança de cidade bagunça o mundo interior|crescer faz sentimentos trabalharem juntos
Kung Fu Panda|o escolhido parece improvável para todos|treino e confiança transformam o aprendiz
Como Treinar o Seu Dragão|uma amizade desafia a tradição da aldeia|conhecer o inimigo muda toda a guerra
Monstros S.A.|uma empresa depende do medo infantil|uma visita inesperada muda o trabalho de dois amigos
Carros|uma competição perde importância durante a viagem|uma parada forçada cria novos vínculos
Frozen|o medo afasta duas irmãs|o verdadeiro afeto desfaz um longo inverno
carregador|costuma ser emprestado quando alguém está no limite|uma tomada próxima vira prioridade
fone de ouvido|cria uma bolha mesmo em lugar cheio|um dos lados pode parar primeiro
chave|o bolso é conferido antes de fechar a porta|um pequeno barulho traz alívio na entrada
carteira|perder causa preocupação antes mesmo do dinheiro|documentos importantes costumam viajar juntos
mochila|o peso aumenta ao longo do dia|as duas alças dividem melhor a carga
guarda-chuva|sair com ele pode impedir a chuva|muitos ficam esquecidos na entrada
escova de dentes|faz parte de uma rotina diante do espelho|viagem curta ainda exige levar uma
toalha|o varal recebe depois do uso|dividir costuma causar discussão em casa
espelho|uma última conferida acontece antes de sair|devolve tudo sem guardar imagem
tesoura|a gaveta raramente guarda no lugar certo|duas partes trabalham no mesmo movimento
panela|a tampa correspondente sempre parece sumir|uma refeição longa começa dentro dela
vassoura|costuma esperar atrás de uma porta|o movimento empurra o problema para um canto
liquidificador|o barulho avisa o preparo para a casa inteira|a tampa evita um grande acidente
garrafa térmica|fica no centro de conversas demoradas|a temperatura deve sobreviver por horas
extensão elétrica|resolve quando a parede ficou longe demais|um fio atravessado vira risco de tropeço
despertador|recebe vários adiamentos pela manhã|interrompe justamente a melhor parte do sono
cabide|o armário fica mais organizado com vários iguais|algumas roupas ganham marcas no ombro
roteador|luzes piscando viram diagnóstico doméstico|reiniciar costuma ser a primeira tentativa
modem|uma pequena caixa pode parar a casa inteira|cabos e luzes ajudam a descobrir o problema
óculos|o rosto sente a falta antes de sair|limpar melhora o mundo por alguns minutos
relógio|é consultado mais vezes quando há atraso|pode organizar o dia sem dizer uma palavra
abridor de lata|só é procurado depois que a comida já foi escolhida|uma gaveta da cozinha esconde vários formatos
cortador de unha|o uso é rápido mas deixa pequenos restos|costuma morar no banheiro ou numa nécessaire
prendedor de roupa|o vento testa se o trabalho foi bem feito|um dia de lavagem exige vários
fita adesiva|um reparo temporário pode durar meses|encontrar a ponta exige paciência
lanterna|sua importância aparece quando a luz some|uma pilha esquecida pode frustrar a emergência
grampeador|junta folhas sem precisar de cola|fica inútil quando a pequena carga acaba
saca-rolhas|a gaveta só lembra dele em ocasiões específicas|o movimento exige girar antes de puxar
balde|uma emergência doméstica muda sua função|a alça facilita levar muito de uma vez
rodo|entra em cena quando a água ocupa o chão|um cabo comprido ajuda a alcançar os cantos
mouse|a mão percorre distâncias que a tela não mostra|um clique errado muda o trabalho
calculadora|é procurada quando a conta deixa de ser mental|alguns botões passam anos sem uso
caderno|ideias e tarefas dividem as folhas|a capa costuma dizer para quem pertence
pilha|a falta de energia não aparece na tomada|há uma posição certa para cada lado
isqueiro|pequeno demais para permanecer com o dono|um clique repetido denuncia quando falha
sabonete|escapa justamente durante o banho|diminui um pouco a cada uso
shampoo|a embalagem vazia ainda rende uma tentativa com água|costuma ficar na prateleira do banho
desodorante|faz parte da preparação antes de sair|o formato muda mas a rotina é a mesma
chapinha|o banheiro vira salão antes de um compromisso|precisa esfriar antes de ser guardada
secador de cabelo|o barulho ocupa a casa pela manhã|o fio costuma enrolar sozinho
post-it|uma cor forte tenta impedir o esquecimento|perde a função quando cai da parede
controle remoto|as almofadas são o primeiro lugar da busca|quem segura costuma decidir o programa
travesseiro|cada pessoa defende uma altura diferente|viajar faz sentir falta do próprio
cobertor|aparece no sofá quando a temperatura cai|uma disputa noturna pode puxá-lo para um lado
caneca|algumas pessoas elegem uma favorita|acompanha pausas quentes no trabalho
prato|a refeição termina empilhada na pia|o tamanho muda conforme o momento
colher|serve tanto para mexer quanto para provar|a gaveta separa vários tamanhos
escorredor|recebe o que acabou de ser lavado|a água precisa sair antes de guardar
lixeira|só chama atenção quando está cheia|um saco facilita o próximo passo
pano de prato|está sempre perto da pia|a umidade mostra quando precisa ser trocado
inteligência artificial|uma resposta aparece antes de terminar a pesquisa|trabalho criativo ganhou um novo assistente
rede social|uma publicação alcança conhecidos e estranhos|o tempo passa entre uma rolagem e outra
streaming|escolher pode demorar mais do que assistir|uma temporada inteira cabe no fim de semana
podcast|uma conversa longa acompanha outras tarefas|o assunto continua mesmo sem olhar para a tela
influenciador|a rotina se transforma em conteúdo|uma recomendação pode esgotar um produto
meme|uma piada muda a cada compartilhamento|a mesma imagem comenta assuntos diferentes
vídeo curto|poucos segundos disputam toda a atenção|o próximo começa antes de decidir parar
trabalho remoto|a mesa de casa ganha horário comercial|uma reunião depende de câmera e conexão
Pix|dividir a conta termina em segundos|uma chave substitui vários dados bancários
delivery|acompanhar o mapa aumenta a fome|a campainha encerra a espera
carro elétrico|a rua fica estranhamente silenciosa|uma parada longa pode servir para recarregar
energia solar|o telhado participa da conta de luz|dias claros ajudam a produzir mais
reciclagem|o descarte encontra uma segunda oportunidade|separar em casa muda o destino depois
mudanças climáticas|antigas previsões ficam menos confiáveis|eventos extremos entram na rotina
onda de calor|a noite deixa de trazer alívio|água e sombra viram prioridade
seca|a paisagem muda pela ausência|reservatórios revelam marcas antigas
enchente|a rua pode virar caminho de água|a limpeza continua depois que o nível baixa
vacina|uma pequena aplicação protege além de quem recebe|campanhas levam famílias aos postos
saúde mental|um sofrimento invisível pede cuidado real|falar sobre limites evita chegar ao extremo
terapia|a escuta ajuda a organizar o que parecia confuso|mudanças surgem ao longo de muitas conversas
academia|a empolgação de janeiro precisa virar rotina|resultados aparecem depois da repetição
corrida de rua|a cidade fecha caminhos para abrir um percurso|cada chegada representa um desafio pessoal
Big Brother Brasil|uma casa vira assunto fora dela|o público interfere sem entrar no jogo
reality show|a convivência transforma desconhecidos em personagens|a edição muda como o público enxerga tudo
festival de música|vários palcos exigem escolhas difíceis|a viagem pode começar meses antes do evento
show ao vivo|um refrão une milhares de desconhecidos|a fila faz parte da lembrança
cultura gamer|uma partida também cria linguagem e comunidade|a diversão atravessa gerações e telas
games online|amigos se encontram sem sair de casa|uma conexão ruim afeta toda a equipe
criptomoeda|o valor pode mudar enquanto se conversa|uma carteira existe sem ocupar o bolso
golpe digital|a urgência tenta impedir a pessoa de pensar|uma mensagem convincente pode esconder prejuízo
privacidade digital|aceitar sem ler deixa rastros|uma configuração decide quem pode ver
fake news|uma manchete provoca antes de informar|confirmar a fonte evita espalhar o erro
eleição|uma escolha individual forma um resultado coletivo|campanhas ocupam ruas e telas
economia|uma decisão distante aparece no mercado|emprego e preços entram na mesma conversa
inflação|o carrinho leva menos com o mesmo dinheiro|comparar etiquetas vira hábito
empreendedorismo|uma ideia tenta pagar as próprias contas|improviso acompanha os primeiros clientes
startup|uma equipe pequena busca crescer depressa|o produto muda conforme o público responde
home office|o caminho até o trabalho ficou muito curto|separar descanso e expediente virou desafio
aplicativo de namoro|uma conversa começa por poucas fotos|deslizar pode decidir um encontro
turismo|um lugar cotidiano vira novidade para quem chega|roteiros disputam espaço com imprevistos
nômade digital|o escritório acompanha a mala|uma boa conexão influencia o destino
economia criativa|talento cultural também gera renda|uma ideia pode valer mais que a matéria-prima
sustentabilidade|uma escolha presente olha para o longo prazo|consumir menos também faz parte
veículo autônomo|o passageiro entrega decisões à máquina|sensores precisam interpretar a rua
impressão 3D|um objeto nasce camada por camada|o protótipo sai da tela sem molde
realidade virtual|o corpo fica parado enquanto o olhar viaja|óculos mudam completamente o ambiente
energia limpa|produzir sem poluir tanto guia a mudança|natureza e tecnologia trabalham juntas
telemedicina|a sala de espera cabe numa tela|distância deixa de impedir uma consulta
comida vegana|ingredientes conhecidos ganham outras versões|a escolha mistura alimentação e valores
brechó|uma peça usada começa outra história|garimpar faz parte da compra
médico|ouvir vem antes de indicar um caminho|anos de estudo continuam durante a carreira
enfermeiro|o cuidado acompanha todas as horas do dia|atenção constante percebe pequenas mudanças
dentista|uma visita preventiva evita uma dor futura|o espelho usado é bem menor que o de casa
psicólogo|a principal ferramenta não cabe numa maleta|uma conversa ajuda a reconhecer padrões
fisioterapeuta|um movimento pequeno pode marcar grande progresso|a recuperação depende de repetição orientada
farmacêutico|a orientação acompanha o produto no balcão|uma dosagem errada muda todo o cuidado
gari|a cidade percebe mais quando o trabalho falta|a rotina começa cedo pelas ruas
professor|uma explicação precisa encontrar caminhos diferentes|o resultado pode aparecer anos depois
diretor de escola|famílias alunos e equipe chegam com demandas|decidir também exige muita conversa
engenheiro|o cálculo precisa funcionar fora do papel|segurança limita até a ideia mais ousada
arquiteto|um espaço começa antes da primeira parede|beleza e uso precisam caber no mesmo projeto
pedreiro|a construção cresce fiada por fiada|o nível evita um problema lá na frente
eletricista|desligar vem antes de mexer|um fio errado pode apagar a casa
encanador|um vazamento transforma urgência em visita|a água revela onde o caminho falhou
mecânico|um ruído diferente ajuda no diagnóstico|peças voltam a trabalhar em conjunto
motorista|o caminho exige atenção mesmo quando é conhecido|chegar bem importa mais que chegar rápido
motoboy|trânsito e prazo disputam cada minuto|a rota muda a cada nova entrega
piloto|a preparação começa muito antes da decolagem|decisões calmas atravessam longas distâncias
comissário de bordo|atendimento acontece em movimento|segurança vem antes do serviço
policial|o plantão pode mudar em poucos segundos|a atuação exige protocolo e decisão
bombeiro|muita gente sai quando a equipe chega|treino prepara para emergências diferentes
advogado|entender os fatos vem antes de argumentar|prazos acompanham cada caso
juiz|uma decisão afeta lados que discordam|a lei precisa orientar acima da preferência
contador|números contam a situação de uma empresa|datas importantes se repetem todo mês
administrador|pessoas recursos e prazos precisam conversar|uma decisão organiza o trabalho dos outros
vendedor|perguntar ajuda a descobrir o que oferecer|confiança pesa tanto quanto o preço
caixa|uma fila inteira termina no mesmo balcão|atenção evita diferença no fim do turno
atendente|a primeira conversa pode resolver o problema|paciência enfrenta dúvidas repetidas
garçom|uma mesa cheia testa memória e agilidade|o salão dita o ritmo do trabalho
cozinheiro|a preparação começa antes do primeiro pedido|tempo e temperatura mudam o resultado
padeiro|o trabalho começa quando a cidade ainda dorme|o cheiro anuncia que a primeira fornada saiu
confeiteiro|o acabamento alimenta primeiro os olhos|medidas e paciência sustentam a criação
agricultor|o clima participa de todas as decisões|o resultado leva uma estação para aparecer
veterinário|o paciente não consegue explicar onde dói|observar comportamento faz parte da consulta
biólogo|a vida é estudada em muitas escalas|campo e laboratório respondem perguntas diferentes
cientista|uma hipótese precisa sobreviver aos testes|errar também ajuda a chegar à descoberta
programador|uma falha pequena pode esconder horas de busca|o resultado nasce de instruções bem organizadas
designer|a solução precisa ser entendida além de bonita|cada escolha visual comunica alguma coisa
fotógrafo|o instante não aceita repetição|luz e enquadramento mudam a mesma cena
jornalista|a notícia começa com apuração|ouvir vários lados protege a informação
repórter|o acontecimento leva o trabalho para a rua|perguntas transformam fatos em relato
publicitário|uma mensagem disputa poucos segundos de atenção|conhecer o público muda toda a campanha
ator|convencer exige emprestar corpo e voz|ensaio prepara algo que precisa parecer natural
músico|o aplauso vem depois de muitas repetições|ouvir os outros mantém o conjunto
atleta|o resultado mostra só uma parte do treino|descanso também pertence à preparação
personal trainer|a meta precisa respeitar quem está treinando|corrigir o movimento evita lesões
cabeleireiro|uma mudança aparece imediatamente no espelho|conversa costuma acompanhar o atendimento
maquiador|luz e ocasião mudam as escolhas|pequenos detalhes alteram toda a expressão
costureiro|a medida orienta antes do corte|o tecido ganha forma aos poucos
entregador|a campainha costuma marcar o fim da tarefa|organizar a rota economiza tempo
futebol|noventa minutos mudam o humor do fim de semana|um lance vira conversa por vários dias
vôlei|a bola não pode descansar no chão|três contatos pedem sintonia da equipe
basquete|o placar pode virar nos últimos segundos|altura ajuda mas a precisão decide
futsal|pouco espaço deixa o jogo mais rápido|a troca de passes abre uma pequena brecha
handebol|o ataque avança trocando passes com as mãos|o goleiro enfrenta arremessos muito próximos
tênis|cada lado precisa resolver sozinho boa parte do jogo|uma longa troca testa corpo e paciência
tênis de mesa|a curta distância exige reflexo imediato|um efeito muda a direção depois do toque
natação|a respiração organiza o ritmo|o relógio é o adversário mais constante
corrida|cada pessoa enfrenta o próprio tempo|o primeiro passo importa menos que manter o ritmo
atletismo|provas muito diferentes dividem a mesma pista|centímetros e centésimos separam resultados
ciclismo|o grupo ajuda a enfrentar o vento|uma subida muda toda a estratégia
surfe|a condição do mar decide o dia|esperar a oportunidade é parte da prática
skate|errar muitas vezes antecede uma boa manobra|um espaço urbano pode virar pista
ginástica artística|força precisa parecer leve|uma apresentação curta reúne anos de treino
judô|usar o movimento do rival economiza força|respeito aparece antes e depois da luta
jiu-jitsu|calma ajuda quando falta espaço|uma posição prepara a próxima
boxe|defender bem importa tanto quanto atacar|cada intervalo muda a estratégia
mma|estilos diferentes precisam funcionar juntos|o preparo deve cobrir várias distâncias
karatê|controle vale mais do que agressividade|técnica e precisão guiam cada golpe
taekwondo|as pernas trabalham a distância|velocidade transforma abertura em ponto
fórmula 1|uma parada pode decidir a prova|piloto e equipe disputam o mesmo segundo
motogp|inclinar nas curvas desafia o equilíbrio|velocidade e coragem precisam de técnica
automobilismo|máquina e pessoa formam uma dupla|a estratégia começa antes da largada
beisebol|longos momentos de espera terminam num movimento|ataque e defesa nunca atuam juntos
softbol|a bola chega por baixo antes da rebatida|a equipe alterna funções a cada entrada
rugby|o contato convive com passes para trás|avançar depende do apoio coletivo
futebol americano|cada tentativa começa com um plano|muitos jogadores têm funções muito específicas
críquete|uma partida tradicional pode durar muitas horas|rebater protege uma pequena estrutura
golfe|o silêncio acompanha a tentativa|menos jogadas significam resultado melhor
hipismo|dois atletas precisam confiar um no outro|o percurso exige ritmo e comunicação
esgrima|a distância define o instante do ataque|um toque rápido pode encerrar a troca
badminton|o objeto desacelera e muda de direção no ar|leveza não impede um ritmo intenso
levantamento de peso|poucos segundos concentram meses de treino|força sem técnica não completa o movimento
remo|todos precisam repetir no mesmo ritmo|a equipe avança olhando para trás
canoagem|o corpo equilibra enquanto os braços avançam|água calma e corredeira pedem técnicas diferentes
vela|o vento pode ajudar ou atrapalhar|ler o ambiente decide o caminho
mergulho|a entrada na água encerra a apresentação|controle do corpo vale antes do impacto
wrestling|o combate também conta uma história|força e encenação prendem o público
luta olímpica|dominar a posição vale pontos|um pequeno desequilíbrio muda o confronto
boliche|uma pista longa termina em dez alvos|a força precisa seguir uma linha precisa
sinuca|uma jogada prepara a posição da próxima|ângulos importam mais que pressa
dardos|o alvo perto exige mão muito firme|repetir o movimento melhora a precisão
xadrez|cada escolha altera muitas possibilidades futuras|o relógio pressiona mesmo sem movimento físico
eSports|a torcida acompanha decisões numa tela|reflexo e comunicação são treinados em equipe
futebol de areia|o chão dificulta cada passada|a bola quica de forma imprevisível
vôlei de praia|duas pessoas cobrem todo o espaço|vento e sol participam da partida
maratona|o desafio começa muito antes da largada|completar pode valer mais que a posição
triathlon|a transição também faz parte da prova|três esforços exigem preparação equilibrada
escalada|cada apoio precisa ser escolhido|a rota é resolvida com corpo e cabeça
parkour|a cidade vira um caminho de obstáculos|o movimento procura eficiência e liberdade
Brasil|muitas paisagens cabem no mesmo território|sotaques mudam sem mudar o idioma
Recife|pontes conectam partes do centro|o carnaval tem um ritmo muito próprio
Rio de Janeiro|mar e montanha dividem a paisagem|cartões-postais convivem com muitos bairros
São Paulo|a cidade parece não diminuir o ritmo|culinárias do mundo cabem em poucos quilômetros
Salvador|a história aparece nas ruas inclinadas|música e ancestralidade marcam as festas
Amazonas|as águas funcionam como grandes estradas|a escala da floresta muda qualquer distância
caatinga|a vida se adapta a longos períodos secos|a paisagem muda rápido quando chove
oceano|a superfície esconde a maior parte do mundo|correntes ligam lugares muito distantes
Lua|sua forma aparente muda ao longo do mês|foi o primeiro destino humano fora da Terra
Sol|sua luz demora alguns minutos para chegar|a rotina do planeta depende de sua energia
planeta|a gravidade reúne matéria numa viagem contínua|alguns têm anéis e outros abrigam vida
continente|o mapa divide grandes massas de terra|fronteiras culturais não seguem apenas o litoral
equador|uma linha imaginária divide o globo|dias e noites variam pouco por perto
hemisfério|as estações se invertem entre duas metades|a posição muda como se lê o mapa
vulcão|pressão subterrânea transforma a paisagem|o solo ao redor pode ser muito fértil
terremoto|o chão deixa de parecer estável|construções precisam se preparar em certas regiões
arco-íris|luz e gotas criam cores depois da chuva|mudar o ângulo pode fazê-lo desaparecer
eclipse|um alinhamento escurece parte do céu|a observação exige proteção adequada
fotossíntese|a luz vira energia para a vida|folhas trabalham sem produzir ruído
gravidade|mantém pés no chão e astros em órbita|só percebemos claramente quando algo cai
eletricidade|a rotina moderna para quando falta|pode viajar por fios sem ser vista
internet|informação cruza distâncias em segundos|uma falha de conexão isola aparelhos próximos
biblioteca|o silêncio guarda muitas vozes|uma pesquisa pode começar entre estantes
museu|objetos ganham contexto para contar o passado|uma visita transforma memória em experiência
universidade|ensino e pesquisa dividem o mesmo espaço|a formação vai além de uma profissão
democracia|participação sustenta decisões coletivas|direitos e divergências precisam conviver
Constituição|um texto organiza limites do poder|outras leis precisam respeitar seus princípios
ONU|países tentam resolver problemas em conjunto|acordos dependem de diálogo internacional
direitos humanos|a dignidade não deveria depender de origem|proteção vale especialmente para quem tem menos poder
Revolução Industrial|máquinas mudaram o ritmo do trabalho|cidades cresceram ao redor das fábricas
Idade Média|muitos séculos cabem no mesmo período|castelos representam apenas parte da história
Renascimento|arte e conhecimento voltaram o olhar ao humano|novas ideias circularam pela Europa
Brasil Colônia|riquezas partiram antes de beneficiar quem produzia|relações daquele período ainda deixam marcas
abolição|uma lei encerrou oficialmente uma violência|a liberdade não apagou a desigualdade
independência|um território passa a decidir seu governo|a data vira símbolo mais simples que o processo
literatura|palavras constroem mundos sem imagem pronta|cada época deixa sua voz nos livros
poesia|o ritmo pode existir sem música|poucas linhas carregam muitos sentidos
teatro|a história acontece diante do público|cada apresentação pode sair diferente
cinema|luz e som criam movimento numa sala escura|muitas profissões aparecem em uma única obra
música|uma sequência de sons desperta memória|ritmo aproxima pessoas sem exigir conversa
pintura|cor e gesto registram um ponto de vista|uma superfície comum pode virar obra
escultura|a forma ocupa o mesmo espaço de quem observa|o material precisa ser visto de vários ângulos
matemática|uma resposta depende do caminho lógico|padrões ajudam a prever e organizar
ciência|uma pergunta precisa aceitar evidências|resultados devem poder ser conferidos
átomo|quase tudo é feito de unidades invisíveis|seu interior ainda tem partes menores
DNA|instruções biológicas atravessam gerações|semelhanças familiares ficam registradas
coração|um ritmo constante sustenta o corpo|o nome também representa sentimentos
floresta|muitas espécies dividem diferentes alturas|preservar uma área protege relações invisíveis
deserto|a pouca chuva exige adaptações extremas|a temperatura pode variar muito no mesmo dia
cultura|costumes ensinam como um grupo se reconhece|muda com o tempo sem perder toda a memória
anatomia|entender as partes ajuda a compreender o todo|nomes diferentes orientam a localização no corpo
ambulância|o caminho ganha urgência e sinal sonoro|o atendimento pode começar antes de chegar ao hospital
anestesia|um procedimento acontece sem a mesma percepção|a equipe controla seus efeitos durante todo o tempo
antibiótico|o horário correto faz parte do tratamento|não funciona para toda causa de doença
atestado|um documento transforma cuidado em afastamento|a validade depende de avaliação profissional
batimento cardíaco|o ritmo muda com esforço e emoção|contar por um minuto revela um sinal importante
bisturi|precisão importa mais que força|um instrumento pequeno inicia grandes procedimentos
coleta de sangue|o preparo pode exigir algumas horas sem comer|poucos tubos ajudam a responder várias perguntas
consulta|a conversa vem antes do exame|histórico e sintomas orientam os próximos passos
curativo|proteger ajuda o corpo a reparar|a troca permite observar a evolução
diagnóstico|vários sinais precisam formar uma explicação|o nome correto orienta o cuidado seguinte
dor de cabeça|pode surgir por causas muito diferentes|descanso e hidratação às vezes fazem diferença
exame de sangue|números revelam processos invisíveis|valores de referência ajudam na interpretação
febre|o corpo aumenta a temperatura durante uma reação|medir é melhor do que confiar apenas no toque
fratura|uma imagem confirma o que a dor sugere|imobilizar evita que o problema aumente
gestação|o corpo muda ao longo de muitos meses|acompanhamento observa duas vidas ao mesmo tempo
glicose|energia circula e precisa ficar em equilíbrio|uma pequena gota permite uma medição rápida
hospital|muitas especialidades trabalham no mesmo lugar|a urgência define quem será atendido primeiro
infecção|um invasor provoca resposta do organismo|identificar a origem muda o tratamento
injeção|uma aplicação rápida entrega algo ao corpo|a expectativa costuma incomodar mais que o instante
insônia|a noite passa sem cumprir o descanso|a rotina do dia influencia a hora de dormir
internação|o cuidado exige permanência e observação|alta depende de estabilidade e orientação
medicação|dose e horário fazem parte do efeito|misturar sem orientação pode criar outro problema
oxigênio|uma medida no dedo indica como está chegando ao corpo|suporte extra pode facilitar a respiração
paciente|quem recebe cuidado também participa das decisões|informações sinceras ajudam toda a equipe
plantão|a responsabilidade atravessa horários comuns|a passagem organiza o que a próxima equipe precisa saber
pronto-socorro|gravidade vale mais que ordem de chegada|decisões rápidas lidam com situações inesperadas
pressão arterial|dois números descrevem a força da circulação|repousar alguns minutos melhora a medição
prevenção|agir antes evita um problema maior|hábitos e acompanhamento dividem essa tarefa
receita médica|orientações transformam avaliação em tratamento|letra clara evita um risco desnecessário
recuperação|o progresso raramente acontece em linha reta|tempo e cuidado devolvem a rotina aos poucos
reabilitação|novos caminhos compensam funções perdidas|metas pequenas constroem independência
ressonância magnética|um túnel barulhento produz imagens detalhadas|objetos metálicos exigem atenção antes do exame
raio-X|uma imagem atravessa o que os olhos não veem|estruturas mais densas aparecem com destaque
sala de cirurgia|cada pessoa da equipe tem uma função definida|controle e esterilidade cercam o procedimento
sangue|transporta recursos e informações pelo corpo|uma pequena amostra revela muito sobre a saúde
sintoma|é uma pista percebida por quem sente|sozinho raramente fecha uma explicação
soro|gotas seguem um ritmo controlado|uma bolsa suspensa leva líquido diretamente ao corpo
termômetro|um número confirma a impressão de calor|o método muda conforme o local da medida
transfusão|compatibilidade vem antes da reposição|doadores distantes participam do tratamento
triagem|perguntas rápidas definem prioridade|organizar riscos melhora o atendimento de todos
ultrassom|ondas formam imagens sem usar radiação|um gel facilita o contato durante o exame
UTI|monitoramento permanece ligado o tempo inteiro|cada mudança pequena recebe atenção imediata
vírus|precisa de células para produzir novas cópias|prevenção pode interromper sua circulação
vitamina|uma pequena quantidade participa de grandes processos|falta e excesso também podem causar problemas
vacinação|uma campanha protege até quem não pode receber|a caderneta ajuda a manter o calendário
atendimento|escutar bem evita começar pelo problema errado|acolhimento também faz parte da solução
respiração|o ritmo responde ao esforço e à ansiedade|um ato automático também pode ser controlado
saúde bucal|o cuidado diário evita tratamentos maiores|hábitos afetam muito além do sorriso
sono|o corpo continua trabalhando durante o descanso|qualidade importa tanto quanto quantidade
`.trim().split('\n').map((line) => {
  const [word, first, second] = line.split('|')
  return [word, [first, second]] as [string, [string, string]]
}))
const bank = rows.map(([name, list]) => ({ name, words: list.split(',').map((w, i) => ({ w, h: curated.get(w) ?? cues[name].map((cue, j) => `${cue} — situação ${i + j + 1}`) })) }))
const json = JSON.stringify(bank)
export const ENCODED_BANK = typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(json))) : Buffer.from(json, 'utf8').toString('base64')
