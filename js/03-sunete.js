/* ---------- 3. SUNETELE ----------
   Toate sunetele sunt sintetizate din cod — nu avem nevoie de fișiere audio.
   Contextul audio poate porni doar după prima atingere a utilizatorului. */
let audio = null;
let bufferZgomot = null;   // „zgomot alb" — materia primă pentru pleoscăit și aspirare

function pornesteAudio() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state === 'suspended') audio.resume();
}

// O notă simplă: frecvență, moment de start, durată, volum, formă de undă
function nota(frecventa, cand, durata, volum, tip = 'sine', frecventaFinala = null) {
  const osc = audio.createOscillator();
  osc.type = tip;
  osc.frequency.setValueAtTime(frecventa, cand);
  if (frecventaFinala) osc.frequency.exponentialRampToValueAtTime(frecventaFinala, cand + durata);
  const vol = audio.createGain();
  vol.gain.setValueAtTime(0.0001, cand);
  vol.gain.exponentialRampToValueAtTime(volum, cand + 0.015);
  vol.gain.exponentialRampToValueAtTime(0.0001, cand + durata);
  osc.connect(vol).connect(audio.destination);
  osc.start(cand);
  osc.stop(cand + durata + 0.05);
}

// Un „fâșâit" filtrat — pentru stropi de vopsea și aspirare
function zgomot(cand, durata, volum, frecventaStart, frecventaFinal = null) {
  if (!bufferZgomot) {
    bufferZgomot = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
    const date = bufferZgomot.getChannelData(0);
    for (let i = 0; i < date.length; i++) date[i] = Math.random() * 2 - 1;
  }
  const sursa = audio.createBufferSource();
  sursa.buffer = bufferZgomot;
  sursa.loop = true;
  const filtru = audio.createBiquadFilter();
  filtru.type = 'bandpass';
  filtru.Q.value = 0.9;
  filtru.frequency.setValueAtTime(frecventaStart, cand);
  if (frecventaFinal) filtru.frequency.exponentialRampToValueAtTime(frecventaFinal, cand + durata);
  const vol = audio.createGain();
  vol.gain.setValueAtTime(0.0001, cand);
  vol.gain.exponentialRampToValueAtTime(volum, cand + 0.02);
  vol.gain.exponentialRampToValueAtTime(0.0001, cand + durata);
  sursa.connect(filtru).connect(vol).connect(audio.destination);
  sursa.start(cand);
  sursa.stop(cand + durata + 0.05);
}

// SCENA 1 — sunetul începutului: un „răsărit" sonor
function sunetRasarit() {
  const t = audio.currentTime;
  const bas = audio.createOscillator();
  bas.type = 'sine';
  bas.frequency.setValueAtTime(70, t);
  bas.frequency.exponentialRampToValueAtTime(240, t + 3.5);
  const volBas = audio.createGain();
  volBas.gain.setValueAtTime(0.0001, t);
  volBas.gain.exponentialRampToValueAtTime(0.12, t + 1.2);
  volBas.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);
  bas.connect(volBas).connect(audio.destination);
  bas.start(t); bas.stop(t + 4.6);

  const clinchet = audio.createOscillator();
  clinchet.type = 'triangle';
  clinchet.frequency.setValueAtTime(520, t + 1);
  clinchet.frequency.exponentialRampToValueAtTime(880, t + 3.8);
  const volClinchet = audio.createGain();
  volClinchet.gain.setValueAtTime(0.0001, t + 1);
  volClinchet.gain.exponentialRampToValueAtTime(0.045, t + 2.2);
  volClinchet.gain.exponentialRampToValueAtTime(0.0001, t + 4.4);
  clinchet.connect(volClinchet).connect(audio.destination);
  clinchet.start(t + 1); clinchet.stop(t + 4.5);
}

// Râsul balonului gâdilat: un ping fin urmat de note scurte, săltărețe
function sunetChicotit() {
  const t = audio.currentTime;
  nota(1400, t, 0.05, 0.04, 'sine');
  for (let i = 0; i < 5; i++) {
    const f = 750 + i * 110 + Math.random() * 60;
    nota(f, t + 0.08 + i * 0.075, 0.06, 0.06, 'sine', f * 0.82);
  }
}

// Chemarea balonului când e lăsat singur: două note blânde, ca un „hei, hei"
function sunetChemare() {
  const t = audio.currentTime;
  nota(520, t, 0.12, 0.04, 'sine');
  nota(660, t + 0.16, 0.14, 0.04, 'sine');
}

// SCENA 2 — transformarea balonului în minge: un mic arpegiu magic
function sunetTransformare() {
  const t = audio.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => nota(f, t + i * 0.09, 0.22, 0.06, 'triangle'));
}

// săritura mingii — „boing" de desen animat
function sunetBoing() {
  nota(320, audio.currentTime, 0.28, 0.07, 'triangle', 85);
}

// stropul de vopsea — „pleosc!"
function sunetPleosc() {
  zgomot(audio.currentTime, 0.09, 0.14, 750);
}

/* Balonul de culoare spart sub deget: un pocnet moale și scurt, urmat de foșnetul
   cu care se destramă în nor. Nu un pocnet de balon de petrecere — ăla ar speria
   pe cineva care se uită liniștit la cer. */
function sunetBalonSpart() {
  const t = audio.currentTime;
  nota(430, t, 0.07, 0.05, 'sine', 190);
  zgomot(t + 0.03, 0.42, 0.045, 1500, 420);
}

// mingea fluieră după utilizator (fluier de desen animat: sus, apoi jos)
function sunetFluier() {
  const t = audio.currentTime;
  nota(620, t, 0.18, 0.055, 'sine', 1250);
  nota(1250, t + 0.22, 0.22, 0.055, 'sine', 800);
}

// bucuria mingii: triluri urcătoare
function sunetBucurie() {
  const t = audio.currentTime;
  [660, 880, 1100].forEach((f, i) => nota(f, t + i * 0.09, 0.09, 0.06, 'sine', f * 1.15));
}

// sperietura mingii: un țipăt scurt, apoi fuga
function sunetSperiat() {
  const t = audio.currentTime;
  nota(700, t, 0.1, 0.07, 'sine', 1600);
  nota(1600, t + 0.11, 0.3, 0.05, 'sine', 380);
}

// elefantul aspiră o pată — „sloop!"
function sunetAspirare() {
  const t = audio.currentTime;
  zgomot(t, 0.2, 0.1, 1400, 250);
  nota(850, t, 0.18, 0.045, 'sine', 170);
}

// trompeta elefantului (mic semn că el va conta în scena următoare)
function sunetTrompeta() {
  const t = audio.currentTime;
  nota(196, t, 0.18, 0.07, 'sawtooth', 294);
  nota(294, t + 0.2, 0.3, 0.07, 'sawtooth', 262);
}

/* ---------- MUZICA MUZEULUI ----------
   În scena a treia nu se aude o melodie, ci o respirație: patru sunete lungi
   care se bat între ele, trecute printr-un filtru ce se deschide și se închide
   singur. Se aude abia-abia — cât să nu fie tăcere, nu cât să se asculte. */
let muzica3 = null;

function pornesteFundalSonor(frecvente, taiere, volum) {
  if (!audio || muzica3) return;
  const t = audio.currentTime;
  const vol = audio.createGain();
  vol.gain.setValueAtTime(0.0001, t);
  vol.gain.exponentialRampToValueAtTime(volum, t + 5);
  vol.connect(audio.destination);

  const filtru = audio.createBiquadFilter();
  filtru.type = 'lowpass';
  filtru.frequency.setValueAtTime(taiere, t);
  filtru.Q.setValueAtTime(3, t);
  filtru.connect(vol);

  const voci = [];
  // un acord deschis, fără terță: nu spune nici vesel, nici trist
  for (const f of frecvente) {
    const o = audio.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, t);
    const g = audio.createGain();
    g.gain.setValueAtTime(0.22, t);
    o.connect(g).connect(filtru);
    o.start(t);
    voci.push(o);
  }
  // filtrul se plimbă foarte încet: sala pare că respiră odată cu custodele
  const lent = audio.createOscillator();
  lent.type = 'sine';
  lent.frequency.setValueAtTime(0.06, t);
  const adanc = audio.createGain();
  adanc.gain.setValueAtTime(260, t);
  lent.connect(adanc).connect(filtru.frequency);
  lent.start(t);
  voci.push(lent);

  muzica3 = { voci, vol };
}

// Muzeul respiră mai sus și mai deschis; galeria, jos și adânc, ca o pivniță.
function pornesteMuzicaMuzeu() { pornesteFundalSonor([110, 164.81, 220, 329.63], 620, 0.055); }
function pornesteMuzicaGalerie() { pornesteFundalSonor([65.41, 98, 130.81, 196], 400, 0.07); }

function opresteMuzicaMuzeu() {
  if (!muzica3 || !audio) return;
  const t = audio.currentTime;
  muzica3.vol.gain.cancelScheduledValues(t);
  muzica3.vol.gain.setValueAtTime(0.055, t);
  muzica3.vol.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
  for (const o of muzica3.voci) o.stop(t + 1.6);
  muzica3 = null;
}

/* ---------- NATURA DIN JURUL CUSTODELUI ----------
   Muzeul nu stă într-o sală, ci într-o grădină. Peste acordul lung se aude
   vântul prin frunze — zgomot alb trecut printr-un filtru care se plimbă
   singur, ca rafalele — și, din când în când, o pasăre. */
let naturaScena3 = null;

function pregatesteZgomotul() {
  if (bufferZgomot) return;
  bufferZgomot = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
  const date = bufferZgomot.getChannelData(0);
  for (let i = 0; i < date.length; i++) date[i] = Math.random() * 2 - 1;
}

function pornesteNatura() {
  if (!audio || naturaScena3) return;
  const t = audio.currentTime;
  pregatesteZgomotul();

  const sursa = audio.createBufferSource();
  sursa.buffer = bufferZgomot;
  sursa.loop = true;

  const filtru = audio.createBiquadFilter();
  filtru.type = 'bandpass';
  filtru.Q.setValueAtTime(0.55, t);
  filtru.frequency.setValueAtTime(1150, t);

  const vol = audio.createGain();
  vol.gain.setValueAtTime(0.0001, t);
  vol.gain.exponentialRampToValueAtTime(0.03, t + 7);

  // rafalele: filtrul se plimbă foarte încet, ca frunzișul care se apleacă
  const rafala = audio.createOscillator();
  rafala.type = 'sine';
  rafala.frequency.setValueAtTime(0.075, t);
  const catDeTare = audio.createGain();
  catDeTare.gain.setValueAtTime(560, t);
  rafala.connect(catDeTare).connect(filtru.frequency);
  rafala.start(t);

  sursa.connect(filtru).connect(vol).connect(audio.destination);
  sursa.start(t);
  naturaScena3 = { sursa, rafala, vol };
}

function opresteNatura() {
  if (!naturaScena3 || !audio) return;
  const t = audio.currentTime;
  naturaScena3.vol.gain.cancelScheduledValues(t);
  naturaScena3.vol.gain.setValueAtTime(0.03, t);
  naturaScena3.vol.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
  naturaScena3.sursa.stop(t + 1.3);
  naturaScena3.rafala.stop(t + 1.3);
  naturaScena3 = null;
}

/* O pasăre: două-trei silabe scurte, care urcă sau coboară. Nicio pasăre nu
   cântă la fel de două ori, așa că silabele se aleg de fiecare dată. */
function cantecDePasare() {
  if (!audio) return;
  const t = audio.currentTime;
  const inalt = 2100 + Math.random() * 1500;
  const silabe = 2 + Math.floor(Math.random() * 3);
  for (let k = 0; k < silabe; k++) {
    const cand = t + k * (0.085 + Math.random() * 0.075);
    const urca = Math.random() < 0.6;
    nota(urca ? inalt : inalt * 1.35, cand, 0.075, 0.02, 'sine',
         urca ? inalt * 1.45 : inalt * 0.78);
  }
}

// Un clopoțel curat, pentru ce cheamă la atins: buzunarul care se aprinde.
function sunetClopotel(frecventa = 880) {
  if (!audio) return;
  const t = audio.currentTime;
  nota(frecventa, t, 1.7, 0.055, 'sine');
  nota(frecventa * 1.5, t + 0.05, 1.2, 0.028, 'sine');
}

// Ușa care se cască spre galerie: un val adânc, care coboară.
function sunetIntrareGalerie() {
  if (!audio) return;
  const t = audio.currentTime;
  nota(180, t, 2.2, 0.07, 'sine', 60);
  zgomot(t, 1.4, 0.05, 900, 180);
}

// Clipa în care te recunoști: un singur sunet curat, și pe urmă tăcere.
function sunetDescoperire() {
  if (!audio) return;
  const t = audio.currentTime;
  nota(1318.5, t, 2.6, 0.06, 'sine');
  nota(1975.5, t + 0.06, 2.0, 0.03, 'sine');
}

// Rama care se cască în portal: un val care urcă.
function sunetPortal() {
  if (!audio) return;
  const t = audio.currentTime;
  nota(120, t, 2.6, 0.08, 'sine', 900);
  zgomot(t + 0.2, 2.2, 0.06, 300, 3000);
}

// Atingerea de fiecare zi: un ciocănit abia auzit, cât să simți că ai atins ceva.
function sunetAtingere() {
  if (!audio) return;
  nota(1600, audio.currentTime, 0.045, 0.022, 'sine', 900);
}
