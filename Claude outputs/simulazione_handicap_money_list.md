# Simulazione: impatto della nuova regola handicap sulla Money List 2026

Ricalcolo retrospettivo di tutta la stagione 2026 (gara 1 del 1° febbraio → gara 36 del 14 novembre), applicando la nuova regola di bonus/malus sull'handicap di gioco a ogni risultato già acquisito, per vedere come sarebbe cambiata la classifica finale della Money List.

## La regola simulata

Dopo ogni gara, l'handicap di gioco "evolve" così (coefficiente 0.1, par 72):

- netto ≤ 72 → handicap **si abbassa** subito di 0.1 × (72 − netto)
- 72 < netto ≤ 76 → **zona franca**, nessuna variazione
- netto > 76 → handicap **si alza** di 0.1 × (netto − 76)

Il valore resta decimale "dietro le quinte" e viene arrotondato a intero solo quando serve per calcolare il netto di una gara (con la stessa regola già in uso sul sito: decimale ≤ 0,5 giù, ≥ 0,6 su).

**Punto di partenza:** per ciascun giocatore, l'handicap simulato parte dal suo vero HCP di gioco (EGA + eventuale tee) nella sua primissima gara storica, poi evolve per conto proprio gara dopo gara ignorando i successivi aggiornamenti reali dell'EGA federale. L'EGA ufficiale non viene mai toccato: questa è una simulazione "di laboratorio" solo per vedere l'effetto sulla Money List.

Ho verificato la simulazione confrontandola con un ricalcolo della Money List **reale** (stessi dati, stessa logica di calcolo del sito, nessuna nuova regola): il totale scatolette assegnate nei due scenari coincide esattamente (280 in entrambi i casi), il che conferma che il confronto è corretto — cambia solo *chi* vince, non *quante* scatolette vengono distribuite in totale.

## Money List reale (come è andata davvero)

| Pos | Giocatore | Scatolette |
|---|---|---|
| 1 | Alessio Mangili | 46 |
| 2 | Giorgio Pantano | 45 |
| 3 | Andrea Faraglia | 31 |
| 4 | Massimo Festa | 31 |
| 5 | Vincenzo Verità | 28 |
| 6 | Bepi Cenati | 14 |
| 7 | Emiliano Piemonti | 12 |
| 8 | Franco Rizzo | 12 |
| 9 | Paolo De Roia | 12 |
| 10 | Alberto Ricci | 11 |
| 11 | Carlo De Roia | 10 |
| 12 | Ettore Nicoletto | 7 |
| 13 | Gabriele Cocinelli | 6 |
| 14 | Franco Serafin | 4 |
| 15 | Paolo Tedesco | 4 |
| 16 | Massimo Franco | 3 |
| 17 | Nicola Luce | 3 |
| 18 | Stefano Passilongo | 1 |
| 19-23 | Federico Taucer, Massimiliano Murè, Mirko Rado, Paolo Zuliani, Renzo Fabretti | 0 |

## Money List simulata (con la nuova regola)

| Pos | Giocatore | Scatolette | HCP gioco sim. finale |
|---|---|---|---|
| 1 | Alessio Mangili | 54 | 11 |
| 2 | Andrea Faraglia | 30 | 13 |
| 3 | Giorgio Pantano | 28 | 2 |
| 4 | Vincenzo Verità | 26 | 11 |
| 5 | Massimo Festa | 25 | 9 |
| 6 | Emiliano Piemonti | 20 | 29 |
| 7 | Bepi Cenati | 17 | 22 |
| 8 | Franco Rizzo | 14 | 14 |
| 9 | Alberto Ricci | 12 | 10 |
| 10 | Ettore Nicoletto | 11 | 13 |
| 11 | Paolo De Roia | 11 | 14 |
| 12 | Carlo De Roia | 8 | 5 |
| 13 | Gabriele Cocinelli | 8 | 14 |
| 14 | Franco Serafin | 6 | 15 |
| 15 | Paolo Tedesco | 4 | 21 |
| 16 | Massimo Franco | 3 | 1 |
| 17 | Nicola Luce | 3 | 1 |
| 18 | Federico Taucer | 0 | 14 |
| 19 | Massimiliano Murè | 0 | 24 |
| 20 | Mirko Rado | 0 | 17 |
| 21 | Paolo Zuliani | 0 | 13 |
| 22 | Renzo Fabretti | 0 | 26 |
| 23 | Stefano Passilongo | 0 | 11 |

## Confronto: chi guadagna e chi perde

| Giocatore | Pos. reale | Pos. simulata | Scat. reale | Scat. simulata | Differenza |
|---|---|---|---|---|---|
| Alessio Mangili | 1 | 1 | 46 | 54 | +8 |
| Giorgio Pantano | 2 | 3 | 45 | 28 | −17 |
| Andrea Faraglia | 3 | 2 | 31 | 30 | −1 |
| Massimo Festa | 4 | 5 | 31 | 25 | −6 |
| Vincenzo Verità | 5 | 4 | 28 | 26 | −2 |
| Bepi Cenati | 6 | 7 | 14 | 17 | +3 |
| Emiliano Piemonti | 7 | 6 | 12 | 20 | +8 |
| Franco Rizzo | 8 | 8 | 12 | 14 | +2 |
| Paolo De Roia | 9 | 11 | 12 | 11 | −1 |
| Alberto Ricci | 10 | 9 | 11 | 12 | +1 |
| Carlo De Roia | 11 | 12 | 10 | 8 | −2 |
| Ettore Nicoletto | 12 | 10 | 7 | 11 | +4 |
| Gabriele Cocinelli | 13 | 13 | 6 | 8 | +2 |
| Franco Serafin | 14 | 14 | 4 | 6 | +2 |
| Paolo Tedesco | 15 | 15 | 4 | 4 | 0 |
| Massimo Franco | 16 | 16 | 3 | 3 | 0 |
| Nicola Luce | 17 | 17 | 3 | 3 | 0 |
| Stefano Passilongo | 18 | 23 | 1 | 0 | −1 |

## Osservazioni

La vetta della classifica **non cambia**: Alessio Mangili resta primo, anzi aumenta il margine (+8 scatolette). Andrea Faraglia sale dal 3° al 2° posto, superando Massimo Festa. Il cambiamento più grande è Giorgio Pantano, che scende dal 2° al 3° posto perdendo 17 scatolette.

C'è però una cosa importante da considerare prima di decidere i parametri definitivi: con questa combinazione (coefficiente 0.1, zona franca 72-76, nessuna zona franca sul lato "miglioramento"), **l'handicap simulato tende a salire nel tempo per quasi tutti**, non solo per chi gioca male. Il meccanismo è asimmetrico: per abbassarsi serve un netto ≤ 72 (un'ottima prestazione), mentre basta un netto > 76 (una giornata solo mediocre, non disastrosa) per alzarsi. Per un giocatore di livello medio-basso, le giornate "mediocri" sono più frequenti delle giornate "ottime", quindi l'handicap tende a salire. Si vede ad esempio con Massimo Festa (handicap reale attorno a 5-6, handicap simulato finale 9) o Emiliano Piemonti (handicap simulato finale 29, molto più alto del suo EGA reale).

Questo significa che, con questi parametri, il correttivo rischia nel tempo di diventare generoso per *quasi tutti* più che penalizzare in modo specifico solo i giocatori di handicap basso — che era l'obiettivo originale. Vale la pena discuterne prima di attivare la regola sul serio: si potrebbe pensare a una zona franca anche sul lato miglioramento (ad esempio nessun abbassamento tra 70 e 72), oppure a un coefficiente diverso sui due lati, oppure semplicemente testarlo per un periodo limitato (la Winter Season sarebbe un buon banco di prova, come già ipotizzato) e osservare come si comporta con dati nuovi prima di deciderlo per la stagione piena.

---
*Nota metodologica: l'handicap di partenza di ciascun giocatore è il suo vero HCP di gioco (EGA + eventuale detrazione tee) registrato alla sua primissima gara in assoluto nello storico. I giocatori ritirati in una gara non hanno contribuito al calcolo del netto di quella gara e il loro handicap simulato non è cambiato quella settimana, esattamente come già fa il sito oggi per lo storico HCP.*
