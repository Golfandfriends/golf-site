// ============================================================
// Golf & Friends — utility condivise tra tutte le pagine
// ============================================================
//
// NOVITÀ: i dati ora arrivano da Firebase (Firestore) invece che dal
// vecchio file data/data.json. La funzione loadData() qui sotto
// ricostruisce un oggetto "data" con ESATTAMENTE la stessa forma di
// prima (data.giocatori, data.gare, data.club, data.premi, ...), così
// tutto il resto del codice in questa pagina e nelle altre continua a
// funzionare senza bisogno di modifiche.

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBaJXWvZNRwEDhWPGLrqUDFY2lZ19UyUyo",
  authDomain: "golf-friends-lignano.firebaseapp.com",
  projectId: "golf-friends-lignano",
  storageBucket: "golf-friends-lignano.firebasestorage.app",
  messagingSenderId: "375170769411",
  appId: "1:375170769411:web:38e47294d63225ffc16436",
  measurementId: "G-LQJCX7TZSS",
};

let _dbPromise = null;

// Carica l'SDK Firebase (via CDN, "import" dinamico: funziona anche
// dentro un normale <script>, non serve dichiarare type="module").
// Lo fa una volta sola e poi riusa sempre la stessa connessione.
function getFirestoreHandles() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = (async () => {
    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js"
    );
    const { getFirestore, collection, getDocs, doc, getDoc } = await import(
      "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js"
    );
    const app = initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);
    return { db, collection, getDocs, doc, getDoc };
  })();
  return _dbPromise;
}

async function loadData() {
  const { db, collection, getDocs, doc, getDoc } = await getFirestoreHandles();

  const [giocatoriSnap, gareSnap, prossimeSnap, galleriaSnap, clubDoc, premiDoc, extraBetDoc] =
    await Promise.all([
      getDocs(collection(db, "giocatori")),
      getDocs(collection(db, "gare")),
      getDocs(collection(db, "prossimeGare")),
      getDocs(collection(db, "galleria")),
      getDoc(doc(db, "info", "club")),
      getDoc(doc(db, "info", "premi")),
      getDoc(doc(db, "info", "extraBet")),
    ]);

  const giocatori = giocatoriSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const gare = gareSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.numero || 0) - (b.numero || 0));

  // Solo eventi da oggi in poi: un evento passato lasciato per sbaglio in
  // "prossimeGare" (es. non rimosso a tempo debito) non deve continuare a
  // occupare i primi posti in home/calendario al posto di quelli veri.
  const oggi = new Date().toISOString().slice(0, 10);
  const prossimeGare = prossimeSnap.docs
    .map((d) => d.data())
    .filter((g) => (g.data || "") >= oggi)
    .sort((a, b) => (a.data || "").localeCompare(b.data || ""));

  const galleria = galleriaSnap.docs.map((d) => d.data());

  return {
    club: clubDoc.exists() ? clubDoc.data() : {},
    giocatori,
    gare,
    prossimeGare,
    moneyList: [],
    premi: premiDoc.exists() ? premiDoc.data() : { unita: "", tabella: [] },
    extraBet: extraBetDoc.exists() ? extraBetDoc.data() : { unita: "", tabella: [] },
    galleria,
    statuto: [],
  };
}

function playerName(data, id) {
  const p = data.giocatori.find((g) => g.id === id);
  return p ? p.nome : id;
}

function formatDateIt(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Evidenzia la voce di menu attiva in base al file corrente
function markActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current) a.setAttribute("aria-current", "page");
  });
}

// Menu mobile (hamburger): sotto i 1024px il menu con tutte le voci
// (Home, Classifica gare, Calendario, ecc.) non entra più su una riga
// sola e diventava una striscia scorrevole orizzontale senza nessuna
// indicazione visiva — la maggior parte delle voci restava nascosta
// fuori schermo e un tocco sulla barra finiva quasi sempre su "Home"
// invece che sulla voce desiderata. Il bottone #nav-toggle (visibile
// solo sotto i 1024px, vedi css/style.css) apre/chiude il menu come
// tendina verticale con tutte le voci ben visibili.
function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", () => {
    setOpen(!links.classList.contains("open"));
  });

  // Chiude il menu se si tocca/clicca fuori (es. sul resto della pagina)
  document.addEventListener("click", (e) => {
    if (!links.classList.contains("open")) return;
    if (links.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });
}

// Inserisce il link WhatsApp del gruppo ovunque ci sia il contenitore #group-links
// (il canale Telegram non è più usato dal gruppo, rimosso su richiesta di Andrea)
function renderGroupLinks(data) {
  document.querySelectorAll("[data-group-links]").forEach((el) => {
    el.innerHTML = `
      <a class="btn btn-whatsapp" href="${data.club.whatsappLink}" target="_blank" rel="noopener">Gruppo WhatsApp</a>
    `;
  });
}

// Meteo del campo via Open-Meteo (nessuna chiave API richiesta)
async function loadMeteo(data) {
  const targets = document.querySelectorAll("[data-meteo]");
  if (targets.length === 0) return;
  const { campoLat, campoLon, campoNome } = data.club;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${campoLat}&longitude=${campoLon}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto&forecast_days=4`;
    const res = await fetch(url);
    const meteo = await res.json();
    const desc = weatherCodeToText(meteo.current.weather_code);
    const icon = weatherCodeToIcon(meteo.current.weather_code);
    targets.forEach((el) => {
      el.innerHTML = `
        <div class="flex" style="justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="eyebrow">Meteo campo — ${campoNome}</span>
            <h3 style="margin-top:6px;">${icon} ${Math.round(meteo.current.temperature_2m)}°C, ${desc}</h3>
            <p class="muted" style="margin:0;">Vento ${Math.round(meteo.current.wind_speed_10m)} km/h</p>
          </div>
        </div>
        <div class="grid grid-3" style="margin-top:16px; gap:10px;">
          ${meteo.daily.time
            .slice(1, 4)
            .map((day, i) => {
              const d = new Date(day + "T00:00:00");
              const label = d.toLocaleDateString("it-IT", { weekday: "short" });
              const dayIcon = weatherCodeToIcon(meteo.daily.weather_code[i + 1]);
              return `<div class="stat-tile" style="padding:10px 12px;">
                <span class="num" style="font-size:1.2rem;">${dayIcon} ${Math.round(meteo.daily.temperature_2m_max[i + 1])}°</span>
                <span class="label">${label} · min ${Math.round(meteo.daily.temperature_2m_min[i + 1])}° · pioggia ${meteo.daily.precipitation_probability_max[i + 1]}%</span>
              </div>`;
            })
            .join("")}
        </div>
      `;
    });
  } catch (e) {
    targets.forEach((el) => {
      el.innerHTML = `<p class="muted">Meteo non disponibile al momento.</p>`;
    });
  }
}

// Calcola il premio (scatolette ProV1) vinto da una posizione, in base al
// numero di giocatori presenti in quella specifica gara.
// Ritorna 0 se la posizione non vince nulla o se il numero di giocatori è fuori tabella.
function calcolaPremio(data, numGiocatori, posizione) {
  if (!data.premi || !data.premi.tabella) return 0;
  const riga = data.premi.tabella.find((r) => r.giocatori === numGiocatori);
  if (!riga) return 0;
  const chiavi = { 1: "primo", 2: "secondo", 3: "terzo", 4: "quarto" };
  const chiave = chiavi[posizione];
  return chiave ? riga[chiave] || 0 : 0;
}

// Genera l'HTML del badge premio da inserire in una cella di tabella
function badgePremio(scatolette) {
  if (!scatolette || scatolette <= 0) return `<span class="muted">—</span>`;
  return `<span class="premio-badge">
    <span class="pill gold">${scatolette}</span>
    <img src="img/scatola-provv1.png" alt="Scatola Titleist Pro V1" class="premio-thumb">
  </span>`;
}

// Calcola l'HCP di gioco (intero) a partire dall'HCP EGA (decimale),
// con la regola del gruppo: arrotonda per difetto fino a ,5 compreso,
// per eccesso da ,6 in su. Es: 5.5 -> 5, 5.6 -> 6, 8.3 -> 8, 6.8 -> 7.
function hcpGioco(hcpEga) {
  const intero = Math.floor(hcpEga);
  const decimale = Math.round((hcpEga - intero) * 10) / 10; // evita errori di virgola mobile
  return decimale <= 0.5 ? intero : intero + 1;
}

// HCP EGA "effettivo" da usare per calcolare l'HCP di gioco: chi gioca dal
// tee verde ha una detrazione fissa di 4 colpi (regola del gruppo, invece
// di ricalcolare course rating/slope del tee verde). Il tee di ogni
// giocatore viene "congelato" in ciascuna gara al momento dell'inserimento
// dei risultati, esattamente come già avviene per l'HCP EGA — quindi
// cambiare il tee di un giocatore oggi non tocca in alcun modo le gare già
// giocate in passato (che semplicemente non hanno nessun tee congelato e
// vengono trattate come tee giallo, cioè nessuna detrazione).
function hcpEgaEffettivo(hcpEga, tee) {
  return tee === "verde" ? hcpEga - 4 : hcpEga;
}

// Calcola la classifica di una gara a partire dai punteggi lordi:
// Netto = Lordo - HCP di gioco (calcolato dall'HCP EGA del giocatore).
// Ordina per netto crescente (vince chi fa meno colpi netti). In caso di
// pari netto, NON esiste pari merito: vince chi è stato inserito prima
// nell'elenco "risultati" della gara. È compito di chi inserisce
// i dati decidere l'ordine in caso di parità, applicando le regole del golf
// (es. countback sulle ultime 9 buche) — il sito si limita a rispettare
// l'ordine che gli viene dato.
function calcolaClassificaGara(data, gara) {
  const righe = gara.risultati.map((r, indiceInserimento) => {
    const player = data.giocatori.find((g) => g.id === r.giocatore);
    // Se il risultato porta con sé l'HCP EGA usato in quella gara (storico),
    // lo usiamo; altrimenti ricadiamo sull'HCP attuale del giocatore.
    const hcpEga = r.hcpEga !== undefined ? r.hcpEga : player ? player.handicap : 0;
    // Il tee (giallo/verde) usato in QUESTA gara è quello congelato nel
    // risultato stesso (r.tee) — MAI quello attuale del giocatore: una
    // gara vecchia senza tee congelato resta sempre tee giallo (nessuna
    // detrazione), anche se in seguito il giocatore viene impostato su
    // tee verde nel pannello admin.
    // Se il risultato porta con sé l'HCP di gioco già calcolato al tempo
    // (dato storico copiato da un'altra fonte), lo usiamo così com'era —
    // senza ricalcolarlo con la formula attuale del sito. Altrimenti lo
    // calcoliamo noi con la regola in vigore oggi (utile per le gare nuove).
    const hcpG = r.hcpGioco !== undefined ? r.hcpGioco : hcpGioco(hcpEgaEffettivo(hcpEga, r.tee));
    return {
      giocatore: r.giocatore,
      nome: player ? player.nome : r.giocatore,
      lordo: r.lordo,
      hcpEga,
      hcpGioco: hcpG,
      netto: r.lordo - hcpG,
      indiceInserimento,
    };
  });

  // Sort stabile per netto crescente: a parità di netto resta l'ordine
  // di inserimento originale, che vale come spareggio manuale.
  righe.sort((a, b) => a.netto - b.netto || a.indiceInserimento - b.indiceInserimento);

  righe.forEach((r, i) => {
    r.posizione = i + 1;
  });

  return righe;
}

// Somma le scatolette vinte da ogni giocatore in tutte le gare disputate
// (usata sia dalla Money List che dalle Statistiche). Ritorna un array
// { giocatore, totale } ordinato per totale decrescente, solo giocatori
// che hanno vinto almeno una scatoletta.
function calcolaScatoletteTotali(data, includiTutti) {
  const totaliPerGiocatore = {};
  data.gare.forEach((gara) => {
    const righe = calcolaClassificaGara(data, gara);
    righe.forEach((r) => {
      const scatolette = calcolaPremio(data, righe.length, r.posizione);
      totaliPerGiocatore[r.giocatore] = (totaliPerGiocatore[r.giocatore] || 0) + scatolette;
    });
  });
  if (includiTutti) {
    data.giocatori.forEach((p) => {
      if (!(p.id in totaliPerGiocatore)) totaliPerGiocatore[p.id] = 0;
    });
  }
  return Object.entries(totaliPerGiocatore)
    .map(([giocatore, totale]) => ({ giocatore, totale }))
    .filter((r) => includiTutti || r.totale > 0)
    .sort((a, b) => b.totale - a.totale);
}

function inizialiGiocatore(nome) {
  if (!nome) return "?";
  const parti = nome.trim().split(/\s+/);
  const prime = parti.slice(0, 2).map((p) => p[0]);
  return prime.join("").toUpperCase();
}

// Genera un link wa.me con il messaggio già scritto e pronto da inviare:
// apre WhatsApp (app o web) con il messaggio precompilato, l'utente
// sceglie il gruppo e conferma l'invio con un tap. Il messaggio contiene
// solo un link diretto ai risultati completi sul sito (niente elenco
// posizioni nel testo, su richiesta di Andrea), che punta alla card della
// gara in classifica.html tramite ancora #gara-<id>.
function testoWhatsapp(gara, righe) {
  const link = `https://golf-friends-lignano.netlify.app/classifica.html#gara-${gara.id}`;
  const testo = `🏌️ Risultati ${gara.nome} (${formatDateIt(gara.data)})\n${link}`;
  return `https://wa.me/?text=${encodeURIComponent(testo)}`;
}

function weatherCodeToText(code) {
  const map = {
    0: "sereno",
    1: "poco nuvoloso",
    2: "parzialmente nuvoloso",
    3: "coperto",
    45: "nebbia",
    48: "nebbia con brina",
    51: "pioviggine leggera",
    61: "pioggia debole",
    63: "pioggia moderata",
    65: "pioggia forte",
    71: "neve debole",
    80: "rovesci",
    95: "temporale",
  };
  return map[code] || "variabile";
}

function weatherCodeToIcon(code) {
  if (code === 0) return "☀️";
  if (code === 1) return "🌤️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code === 51) return "🌦️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code === 71 || code === 73 || code === 75 || code === 77) return "❄️";
  if (code === 80 || code === 81 || code === 82) return "🌦️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  initNavToggle();
});
