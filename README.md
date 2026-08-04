# Golf & Friends — sito del gruppo

Sito statico (HTML + CSS + JS, nessun framework, nessun backend da gestire).
Tutti i contenuti — giocatori, gare, calendario, money list, galleria — sono
in un unico file: `data/data.json`. Per aggiornare i dati non serve toccare
il codice: basta modificare quel file.

## Struttura del progetto

```
golf-site/
├── index.html          Home: prossima gara, meteo, ultima classifica
├── classifica.html      Storico gare con tabella risultati
├── calendario.html      Prossime gare + archivio gare giocate
├── money-list.html      Classifica vincite stagionali
├── giocatori.html        Profili giocatori e handicap
├── statistiche.html      Grafici (Chart.js): punti, andamento, money list
├── galleria.html          Galleria foto/ricordi
├── css/style.css         Stile del sito (tema "scorecard da golf")
├── js/common.js          Funzioni condivise (caricamento dati, meteo, nav)
├── data/data.json        TUTTI i dati del sito — modifica qui
└── img/                  Cartella per le tue foto reali
```

## Come modificare i dati

Apri `data/data.json` con un editor di testo (anche il Blocco Note va bene,
ma è più comodo con VS Code) e modifica le sezioni:

- `club` — nome gruppo, campo, coordinate GPS (per il meteo), link WhatsApp/Telegram
- `giocatori` — elenco soci con **HCP EGA** (quello che aggiorni tu manualmente dopo ogni variazione)
- `gare` — gare giocate, con il solo punteggio **lordo** per ciascun giocatore
- `prossimeGare` — gare in calendario non ancora giocate
- `moneyList` — totale vinto da ciascun giocatore
- `premi.tabella` — scaglioni scatolette per numero di giocatori (usata per il calcolo automatico)
- `galleria` — voci della galleria (per ora tinte unite, sostituibili con foto vere)

## Come funziona il calcolo del punteggio

Il sito calcola tutto da solo a partire da due soli dati che inserisci tu:
**HCP EGA** del giocatore (in `giocatori`) e **Lordo** segnato in gara (in
`gare` → `risultati`).

1. **HCP di gioco** — arrotondamento dell'HCP EGA con la regola del gruppo:
   per difetto fino a ,5 compreso, per eccesso da ,6 in su.
   Es: 8,3 → 8 · 6,8 → 7 · 5,5 → 5 · 5,6 → 6
2. **Netto** = Lordo − HCP di gioco
3. **Posizione** — classifica ordinata per netto crescente (vince chi fa
   meno colpi netti), con gestione automatica dei pari merito
4. **Premio** — scatolette ProV1 assegnate in base alla posizione e al
   numero di giocatori in gara (tabella in `data.premi.tabella`)

Per inserire il risultato di una gara ti basta quindi aggiungere, per ogni
giocatore, solo il colpo **lordo** segnato — HCP di gioco, netto,
posizione e premio compaiono automaticamente ovunque nel sito.

**Importante:** il file deve restare JSON valido (virgole, virgolette doppie).
Se non sei sicuro dopo una modifica, incolla il contenuto su
[jsonlint.com](https://jsonlint.com) per controllare che non ci siano errori.

## Aggiungere foto vere alla galleria

1. Metti le immagini nella cartella `img/` (es. `img/aperitivo-cup-2026.jpg`)
2. In `galleria.html`, nel blocco che genera `.gallery-tile`, sostituisci
   `style="background-color:${item.colore};"` con
   `style="background-image:url('img/nomefile.jpg'); background-size:cover; background-position:center;"`

## Come provarlo sul computer prima di pubblicarlo

I dati vengono caricati con `fetch()`, che per motivi di sicurezza del
browser non funziona se apri semplicemente il file `index.html` con doppio
click (protocollo `file://`). Serve un piccolo server locale:

**Con Python (quasi sempre già installato):**
```
cd golf-site
python3 -m http.server 8000
```
Poi apri `http://localhost:8000` nel browser.

**Con VS Code:** installa l'estensione "Live Server" e clicca "Go Live".

## Come pubblicarlo online (gratis)

Le opzioni più semplici, senza bisogno di comprare hosting:

1. **Netlify** (consigliato, il più semplice): vai su netlify.com, crea un
   account gratuito, trascina l'intera cartella `golf-site` nella pagina
   "Deploys". In pochi secondi ottieni un link pubblico tipo
   `ibogeyboys.netlify.app`. Puoi collegare anche un dominio tuo, se lo comprate.
2. **GitHub Pages**: carica la cartella su un repository GitHub e attiva
   Pages nelle impostazioni del repo (gratuito, richiede un account GitHub).
3. **Vercel**: alternativa simile a Netlify.

## Meteo del campo

Il meteo in home usa l'API gratuita [Open-Meteo](https://open-meteo.com/),
che non richiede chiave API né registrazione. Le coordinate del campo si
impostano in `data.json` → `club.campoLat` / `club.campoLon`.

## Prossimi passi possibili

- Modulo di iscrizione alle gare (richiede un piccolo backend o un servizio
  tipo Google Forms/Airtable integrato)
- Login riservato ai soci per inserire i risultati da smartphone
- Notifiche automatiche sul gruppo quando esce una nuova classifica

Se in futuro volete uno di questi, si può costruire come passo successivo:
richiedono un minimo di backend che questa versione statica non ha.
