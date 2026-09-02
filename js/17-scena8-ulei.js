/* ============================================================================
   SCENA A OPTA — SALA DE ULEI

   Tema: amprenta fizică. O lucrare în ulei nu e o imagine, e **materie** — o
   pastă care stă pe pânză, care se usucă zile întregi, care se ia pe deget dacă
   o atingi.

   Sala e desenată **în linie și necolorată**: o galerie clasică, cu vitrine,
   pilaștri, o firidă în fund și, pe un podium cu funii de catifea, o pelerină
   regală. Totul e contur, ca într-o planșă rămasă neterminată.

   Asta e toată ideea, și e alta decât în celelalte săli. Până aici te-ai uitat
   la lucrări gata făcute. Aici lucrarea **nu există încă** — există un desen, o
   trusă de ustensile și un cerc cromatic. Jucătorul alege cu ce și cu ce
   culoare, și pune pasta el. Un muzeu în care se pune mâna e o glumă; un muzeu
   în care exponatul e neterminat și tu ești cel care-l termină e altceva.

   Când pelerina e acoperită de tot, sub podium se deschide o trapă și culoarea
   se scurge în ea. Pe acolo se coboară în sala a noua, a acuarelei: uleiul
   diluat devine apă.
   ========================================================================== */

/* ---------- CULORILE ---------- */
/* Cercul cromatic, cu douăsprezece raze: cele trei primare, cele trei binare
   dintre ele, și cele șase terțiare. E cercul care se învață la școală și cel
   care se vede în orice atelier — nu un șir de culori alese după gust.

   Ordinea contează: fiecare culoare stă între cele două din care se face. Cine
   se uită la el învață asta fără să-i spună nimeni. */
const CERC_CROMATIC = [
  '#f2e11c',   // galben
  '#f0b31b',   // galben-portocaliu
  '#eb7a1c',   // portocaliu
  '#e0491e',   // roșu-portocaliu
  '#d8202a',   // roșu
  '#a51d5c',   // roșu-violet
  '#6c2a8e',   // violet
  '#3a3a96',   // albastru-violet
  '#1a5fa8',   // albastru
  '#128a7d',   // albastru-verde
  '#1a9a3c',   // verde
  '#8dbd21'    // galben-verde
];

const LINIE_SALA    = '#3a332a';   // creionul cu care se conturează lucrurile
const LINIE_SUBTIRE = '#7a7062';
const HARTIE        = '#f6f2e8';

/* ---------- CULORILE SĂLII ----------

   Sala e **colorată**, și numai pelerina rămâne albă. Așa a devenit, și e mult
   mai bine: cât timp toată sala era o schiță nepictată, nu se înțelegea ce
   anume ai de colorat — puteai la fel de bine să mânjești peretele. Cu sala
   pictată și pelerina lăsată în alb, întrebarea nu se mai pune: singurul lucru
   neterminat din cameră strigă la tine de la ușă.

   Culorile sălii sunt calme dinadins — piatră caldă, lemn, alamă. Un muzeu cu
   pereți țipători ar intra în concurență cu ce ai tu de pus pe pelerină, iar
   concursul ăsta nu-l poate câștiga jucătorul. */
const PIATRA_PERETE  = '#dcd4c2';
const PIATRA_UMBRA   = '#c2b8a2';
const PIATRA_LUMINA  = '#ece5d6';
const PANOU_PERETE   = '#d3caB4'.replace('B','b');
const FIRIDA_FUND    = '#a89c85';   // adâncul firidei, mai închis, ca albul să sară
const PODEA_DALA     = '#cfc6b4';
const PODEA_ROST     = '#b3a893';
const TAVAN_STICLA   = '#e6eef2';   // lumina rece care intră prin luminator
const TAVAN_GRINDA   = '#cfc6b6';
const PIATRA_SOCLU   = '#8e8371';
const ALAMA_SALA     = '#c9a24a';

/* Fișa de sală. În celelalte galerii scria ce e curentul; aici scrie ce e
   **materia**, fiindcă sala asta nu e despre un curent, e despre pastă. Și
   pregătește sala următoare: un pigment pe bază de apă e o acuarelă, iar prin
   trapa de sub podium tocmai într-acolo se coboară. */
const TEXT_FISA_PIGMENTI =
  'Culorile pigmentare sunt formate din materie (pigmenți organici sau minerali ' +
  'sintetizați/măcinați și amestecați cu un liant), având o prezență fizică ' +
  'tangibilă. În schimb, culorile spectrale (lumina) sunt unde electromagnetice ' +
  'percepute de ochi.\n' +
  'Pigmenții au nevoie de un liant pentru a fi aplicați. În funcție de acesta, ' +
  'culorile se împart în culori pe bază de apă (acuarelă, tempera, guașă, acrilic) ' +
  'sau pe bază de ulei (pictură în ulei).\n' +
  'Vopseaua poate fi aplicată pe suport (pânză, hârtie, lemn etc.) cu pensula, cu ' +
  'cuțitul de paletă, prin tamponare, prin stropire sau prin presare.';

/* ---------- USTENSILELE ---------- */
/* Șase, și fiecare lasă altceva. Nu sunt șase butoane cu aceeași urmă în altă
   culoare: o pensulă rotundă trage o dungă subțire, o bidinea lasă o bandă cu
   urme de păr, cuțitul de paletă întinde o lopată cu muchii drepte. Alegerea
   uneltei trebuie să se vadă pe perete, altfel n-are rost s-o faci.

   `lung` și `gros` sunt măsurate în unitatea de tușă; `fire` spune câte dâre de
   păr lasă; `cutit` dacă e lopată de pastă. */
/* Trei feluri de unealtă, câte două din fiecare — și fiecare fel lasă **altă
   formă de pată**, nu aceeași pată în altă mărime.

   Asta a fost greșeala dintâi: toate șase foloseau un singur contur de tușă și
   se deosebeau numai prin lungime și grosime. Alegeai cuțitul de paletă și
   primeai tot o dâră de pensulă, ceva mai lată. Dar o unealtă se cunoaște după
   **capătul** ei: pensula ascuțită lasă o pată care se subțiază în vârf, cea
   pătrată lasă o pată cu capetele tăiate drept, iar cuțitul lasă o lopată de
   pastă cu muchii și cu mult material. Dacă alegerea nu se vede pe perete,
   n-are rost s-o pui în trusă.

   `pasta` spune cât material lasă: pensula ascuțită trage puțin, cuțitul
   îngroașă. `relief` spune cât de tare se vede creasta stratului. */
const USTENSILE = [
  { nume: 'pensulă rotundă mică',  forma: 'ascutit', lung: 1.7, gros: 0.26,
    fire: 1, pasta: 1, relief: 0.55, cutit: false },
  { nume: 'pensulă rotundă mare',  forma: 'ascutit', lung: 2.1, gros: 0.46,
    fire: 2, pasta: 1, relief: 0.7,  cutit: false },
  { nume: 'pensulă pătrată îngustă', forma: 'patrat', lung: 1.15, gros: 0.55,
    fire: 4, pasta: 1, relief: 0.85, cutit: false },
  { nume: 'pensulă pătrată lată',  forma: 'patrat', lung: 1.05, gros: 1.05,
    fire: 7, pasta: 1, relief: 0.9,  cutit: false },
  { nume: 'cuțit de paletă ascuțit', forma: 'cutit', lung: 1.5, gros: 0.72,
    fire: 0, pasta: 3, relief: 1.5,  cutit: true },
  { nume: 'cuțit de paletă lat',   forma: 'cutit', lung: 1.25, gros: 1.35,
    fire: 0, pasta: 4, relief: 1.7,  cutit: true }
];

const OCHIURI_PELERINA = 26;      // cât de fin se socotește acoperirea pelerinei

const s8 = {
  faza: 'intrare',      // intrare → pictezi → scurgere → diluare → iesire
  t0: 0, ultimulCadru: 0,
  vapori: 1,            // aburii calzi de la intrare, cu textul mirosului
  unealta: 1,           // ce ustensilă e în mână
  culoare: 4,           // ce rază din cercul cromatic e aleasă
  celule: [],           // ochiurile pelerinei: null = în afara ei, false/true = acoperit
  acoperit: 0,          // cât din pelerină s-a acoperit, 0..1
  picaturi: [],
  tuseFacute: 0,
  scurgere: 0,          // cât s-a deschis trapa și s-a scurs culoarea
  perdea: null,
  diluare: 0,
  aSpusTrapa: false,
  vorba: null,
  ultimaTusa: 0
};

/* ---------- MĂSURILE SĂLII ---------- */
function geomSala8() {
  const S = Math.min(W, H);
  const podea = H * 0.62;                  // unde peretele din fund atinge podeaua
  const cornisa = H * 0.14;                // tavanul

  // podiumul rotund din mijloc, văzut în perspectivă
  const podiumCx = W * 0.5, podiumCy = H * 0.855;
  const podiumRx = Math.min(W * 0.20, H * 0.29), podiumRy = podiumRx * 0.27;

  /* Pelerina, întinsă pe podium: gulerul sus, trena revărsată în față. E singura
     suprafață care se socotește la acoperire — restul sălii poate fi mânjit cât
     poftești, dar ea deschide trapa.

     Măsurile ei sunt cele ale unei mantii puse pe un manechin, nu ale unui cort:
     gulerul e îngust, corpul cade drept, și numai **trena** se lățește pe podium.
     La prima încercare o făcusem cât podiumul de lată de sus până jos — ieșea o
     cupolă care înghițea firida, vitrinele și tot restul sălii. */
  /* Lățimea de referință a mantiei. Era aproape cât raza podiumului, iar cu
     trena adăugată pe deasupra ieșea un lucru mai lat decât înalt — adică un
     clopot, nu o haină. O mantie pusă pe manechin e **mai înaltă decât lată**,
     oricât s-ar revărsa poalele: asta e prima măsură după care ochiul o
     recunoaște, înaintea oricărei broderii. */
  const pelLat = podiumRx * 0.58;
  const pelSus = H * 0.235;
  const pelJos = podiumCy + podiumRy * 0.05;

  const trusaLat = Math.min(W * 0.215, S * 0.42);
  const trusaInalt = H * 0.145;
  const cercR = Math.min(W * 0.095, S * 0.18);

  return {
    S, podea, cornisa,
    podiumCx, podiumCy, podiumRx, podiumRy,
    pelCx: podiumCx, pelSus, pelJos, pelLat,
    pelInalt: pelJos - pelSus,

    // trusa de ustensile, sus în stânga
    trusaX: W * 0.028, trusaY: H * 0.09, trusaLat, trusaInalt,

    // cercul cromatic, sub trusă
    cercCx: W * 0.028 + trusaLat * 0.5,
    /* Cercul cromatic sus, uneltele dedesubt. Invers — uneltele deasupra — cozile
       lor lungi ajungeau peste îndemn, iar colțul se citea de-a valma. Așa, se
       citește de sus în jos ca o frază: ce ai de făcut, cu ce culoare, cu ce
       unealtă. */
    cercCy: H * 0.305,
    cercR,

    /* Fișa de sală, pe peretele din fund, sus în dreapta. Aici stă numai unde
       începe și cât e de lată; **înălțimea o dă textul**, măsurată la desen. O
       casetă de înălțime fixă te pune să alegi între a micșora litera până nu se
       mai citește și a lăsa textul să curgă afară din chenar. Caseta se face cât
       trebuie ca să cuprindă ce are de spus, și gata. */
    fisaX: W * 0.665, fisaY: H * 0.145,
    fisaLat: Math.min(W * 0.30, S * 0.56)
  };
}

/* ---------- STRATUL DE VOPSEA AL JUCĂTORULUI ----------
   Tot ce pune rămâne. Nu într-o listă redesenată la fiecare cadru — după o sută
   de tușe s-ar târî — ci pe o pânză ascunsă, peste care fiecare tușă nouă se
   pune o singură dată. Pânza aia se copiază la fiecare cadru dintr-o singură
   mișcare, oricâtă vopsea ar fi pe ea.

   E chiar felul în care lucrează un pictor: nu-și repictează tabloul de la zero
   de fiecare dată când adaugă o tușă. */
const stratulDePictura = { panza: null, latime: 0, inaltime: 0 };

function stratul() {
  if (!stratulDePictura.panza || stratulDePictura.latime !== W ||
      stratulDePictura.inaltime !== H) {
    /* La schimbarea pânzei, ce ai pictat se întinde pe măsura nouă. Pierdut, ar
       fi cea mai urâtă pedeapsă din toată jucăria: singurul loc unde ai făcut
       ceva cu mâna ta s-ar șterge fiindcă ai tras de colțul ferestrei. */
    const vechi = stratulDePictura.panza;
    const vl = stratulDePictura.latime, vi = stratulDePictura.inaltime;
    const p = document.createElement('canvas');
    p.width = W; p.height = H;
    if (vechi && vl && vi) p.getContext('2d').drawImage(vechi, 0, 0, vl, vi, 0, 0, W, H);
    stratulDePictura.panza = p;
    stratulDePictura.latime = W; stratulDePictura.inaltime = H;
  }
  return stratulDePictura.panza;
}

/* ---------- SALA, DESENATĂ ÎN LINIE ---------- */
const salaUlei = { panza: null, latime: 0, inaltime: 0 };

function pregatesteSalaUlei() {
  if (salaUlei.panza && salaUlei.latime === W && salaUlei.inaltime === H) {
    return salaUlei.panza;
  }
  const p = panzaDeLucru(salaUlei, W, H);
  const c = p.getContext('2d');
  c.clearRect(0, 0, W, H);
  pictezaSalaUlei(c);
  salaUlei.latime = W; salaUlei.inaltime = H;
  return p;
}

/* Creionul sălii. Toate liniile se trag cu el, ca desenul să pară făcut de o
   singură mână: aceeași culoare, aceeași apăsare. Grosimea se schimbă numai
   între ce e aproape și ce e departe. */
function creion(c, gros, culoare) {
  c.strokeStyle = culoare || LINIE_SALA;
  c.lineWidth = Math.max(0.7, gros);
  c.lineJoin = 'round';
  c.lineCap = 'round';
}

function pictezaSalaUlei(c) {
  const g = geomSala8();
  const gr = Math.max(1, g.S * 0.0022);

  /* Peretele, de sus până la podea: piatră caldă, mai luminată în mijloc, unde
     cade lumina din luminator, și mai închisă spre colțuri. Lumina care se
     termină e tot ce trebuie ca o suprafață plată să pară o cameră. */
  const zid = c.createRadialGradient(W * 0.5, g.podea * 0.55, g.S * 0.1,
                                     W * 0.5, g.podea * 0.55, Math.max(W, H) * 0.72);
  zid.addColorStop(0, PIATRA_LUMINA);
  zid.addColorStop(0.45, PIATRA_PERETE);
  zid.addColorStop(1, PIATRA_UMBRA);
  c.fillStyle = zid;
  c.fillRect(0, 0, W, H);

  /* Fără vitrine pe laturi. Stăteau acolo ca să spună „ești într-un muzeu", dar
     colțul din stânga e al trusei de ustensile și cel din dreapta al fișei de
     sală — iar o vitrină pe jumătate acoperită de o cutie cu pensule nu mai
     spune nimic, doar încarcă. Sala o spune și singură: luminator, coloană cu
     capitel, aplice, cordoane. */
  peretiiSalii(c, g, gr);
  podiumulCuFunii(c, g, gr);
  pelerinaInLinie(c, g, gr);
  fisaDeSala8(c, g, gr);
}

/* Sala, în linie: tavanul cu luminator, peretele din fund cu firidă, panouri,
   coloană cu capitel corintic și o ușă în dreapta; aplicele; podeaua cu dale.

   Totul e desenat numai cu creionul, fără nicio umplere — sala e o coală
   nepictată, și tocmai de-aia jucătorul simte că are voie să pună culoare pe ea.
   O sală deja colorată n-ar cere nimic nimănui. */
function peretiiSalii(c, g, gr) {
  tavanulCuLuminator(c, g, gr);
  peretulDinFund(c, g, gr);
  apliceleDePerete(c, g, gr);
  podeaDeDale(c, g, gr);
}

/* Tavanul. Un luminator mare de sticlă în mijloc, prins într-o ramă de grinzi
   care fug spre fundul sălii.

   Perspectiva se face din două linii: marginea din față a tavanului, largă și
   ieșită din cadru, și cea din fund, strânsă. Tot ce e între ele se interpolează
   — grinzile, ochiurile de sticlă, casetele de pe margini. Desenate una câte una,
   după ochi, ar fi ieșit un tavan care nu se închide nicăieri. */
function tavanulCuLuminator(c, g, gr) {
  const yFata = -H * 0.03, yFund = g.cornisa;
  const fata0 = -W * 0.16, fata1 = W * 1.16;      // marginea din față, lată
  const fund0 = W * 0.10,  fund1 = W * 0.90;      // marginea din fund, strânsă

  // unde cade coloana `u` (0..1) la o adâncime `v` (0 = față, 1 = fund)
  function x(u, v) { return intre(intre(fata0, fata1, u), intre(fund0, fund1, u), v); }
  function y(v) { return intre(yFata, yFund, v); }

  // tăblia tavanului, mai rece decât peretele
  c.fillStyle = TAVAN_GRINDA;
  c.beginPath();
  c.moveTo(fata0, y(0)); c.lineTo(fata1, y(0));
  c.lineTo(fund1, y(1)); c.lineTo(fund0, y(1));
  c.closePath();
  c.fill();

  /* Sticla luminatorului: lumina zilei, rece, care cade în mijlocul sălii. E
     singurul rece din toată camera — de-aia se simte ca lumină, nu ca vopsea. */
  const sticla = c.createLinearGradient(0, y(0), 0, y(1));
  sticla.addColorStop(0, '#f4f9fb');
  sticla.addColorStop(1, TAVAN_STICLA);
  c.fillStyle = sticla;
  c.beginPath();
  c.moveTo(x(0.22, 0.06), y(0.06));
  c.lineTo(x(0.78, 0.06), y(0.06));
  c.lineTo(x(0.78, 0.88), y(0.88));
  c.lineTo(x(0.22, 0.88), y(0.88));
  c.closePath();
  c.fill();

  // grinzile care fug spre fund
  creion(c, gr * 1.1);
  for (const u of [0.06, 0.22, 0.78, 0.94]) {
    c.beginPath();
    c.moveTo(x(u, 0), y(0));
    c.lineTo(x(u, 1), y(1));
    c.stroke();
  }
  // traversele
  for (const v of [0.30, 0.62, 0.86]) {
    c.beginPath();
    c.moveTo(x(0.02, v), y(v));
    c.lineTo(x(0.98, v), y(v));
    c.stroke();
  }

  /* Luminatorul: dreptunghiul dintre grinzile din mijloc, împărțit în ochiuri de
     sticlă. Ochiurile se strâng spre fund odată cu tot tavanul — de-aia se scot
     din aceleași două funcții, nu dintr-o grilă dreaptă. */
  creion(c, gr * 1.4);
  c.beginPath();
  c.moveTo(x(0.22, 0.06), y(0.06));
  c.lineTo(x(0.78, 0.06), y(0.06));
  c.lineTo(x(0.78, 0.88), y(0.88));
  c.lineTo(x(0.22, 0.88), y(0.88));
  c.closePath();
  c.stroke();

  creion(c, gr * 0.7, LINIE_SUBTIRE);
  for (let k = 1; k < 7; k++) {
    const u = intre(0.22, 0.78, k / 7);
    c.beginPath();
    c.moveTo(x(u, 0.06), y(0.06));
    c.lineTo(x(u, 0.88), y(0.88));
    c.stroke();
  }
  for (let k = 1; k < 5; k++) {
    const v = intre(0.06, 0.88, Math.pow(k / 5, 1.25));
    c.beginPath();
    c.moveTo(x(0.22, v), y(v));
    c.lineTo(x(0.78, v), y(v));
    c.stroke();
  }

  // cornișa: trei brâuri paralele, ca la orice sală cu stuc
  creion(c, gr * 1.5);
  c.beginPath();
  c.moveTo(0, g.cornisa); c.lineTo(W, g.cornisa);
  c.stroke();
  creion(c, gr * 0.9);
  for (const dy of [H * 0.012, H * 0.024]) {
    c.beginPath();
    c.moveTo(0, g.cornisa + dy); c.lineTo(W, g.cornisa + dy);
    c.stroke();
  }
}

/* Peretele din fund: firida cu pelerina în mijloc, panouri înalte de-o parte și
   de alta, o coloană cu capitel corintic la dreapta firidei, o ușă în capătul
   din dreapta, și lambriul care leagă totul jos. */
function peretulDinFund(c, g, gr) {
  const sus = g.cornisa + H * 0.026, jos = g.podea;
  const lambriu = jos - H * 0.055;

  creion(c, gr * 1.6);
  c.beginPath();
  c.moveTo(0, jos); c.lineTo(W, jos);
  c.stroke();
  // lambriul de jos, o bandă de piatră mai închisă
  c.fillStyle = PIATRA_SOCLU;
  c.fillRect(0, lambriu, W, jos - lambriu);
  c.fillStyle = 'rgba(255, 250, 236, 0.35)';
  c.fillRect(0, lambriu, W, (jos - lambriu) * 0.16);
  creion(c, gr * 1.1);
  c.beginPath();
  c.moveTo(0, lambriu); c.lineTo(W, lambriu);
  c.stroke();

  /* Firida: o arcadă adâncă în perete, în care stă exponatul. Ea spune „aici e
     lucrarea" fără nicio săgeată — un obiect așezat într-o firidă e, prin însuși
     locul lui, un obiect arătat. */
  const fx = W * 0.5, fw = Math.min(W * 0.30, H * 0.46);
  const fSus = sus + H * 0.045;

  /* Adâncul firidei, umplut cu o piatră mai închisă. El e fondul pe care stă
     pelerina albă — iar un alb pus pe alb nu se vede. */
  const adanc = c.createLinearGradient(0, fSus, 0, jos);
  adanc.addColorStop(0, '#8f8371');
  adanc.addColorStop(0.55, FIRIDA_FUND);
  adanc.addColorStop(1, '#9d917b');
  c.fillStyle = adanc;
  c.beginPath();
  c.moveTo(fx - fw / 2, jos);
  c.lineTo(fx - fw / 2, fSus + fw * 0.46);
  c.quadraticCurveTo(fx - fw / 2, fSus, fx, fSus);
  c.quadraticCurveTo(fx + fw / 2, fSus, fx + fw / 2, fSus + fw * 0.46);
  c.lineTo(fx + fw / 2, jos);
  c.closePath();
  c.fill();

  creion(c, gr * 1.5);
  c.beginPath();
  c.moveTo(fx - fw / 2, jos);
  c.lineTo(fx - fw / 2, fSus + fw * 0.46);
  c.quadraticCurveTo(fx - fw / 2, fSus, fx, fSus);
  c.quadraticCurveTo(fx + fw / 2, fSus, fx + fw / 2, fSus + fw * 0.46);
  c.lineTo(fx + fw / 2, jos);
  c.stroke();
  // conturul dinăuntru, care dă grosimea zidului
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  c.beginPath();
  c.moveTo(fx - fw * 0.43, jos);
  c.lineTo(fx - fw * 0.43, fSus + fw * 0.44);
  c.quadraticCurveTo(fx - fw * 0.43, fSus + fw * 0.05, fx, fSus + fw * 0.05);
  c.quadraticCurveTo(fx + fw * 0.43, fSus + fw * 0.05, fx + fw * 0.43, fSus + fw * 0.44);
  c.lineTo(fx + fw * 0.43, jos);
  c.stroke();

  /* Panourile de perete: dreptunghiuri înalte cu ramă dublă, ca lambriurile de
     stuc din orice pinacotecă. Două în stânga firidei, unul în dreapta — în
     dreapta, restul peretelui e al fișei de sală. */
  for (const [px, plat] of [[W * 0.085, W * 0.12], [W * 0.245, W * 0.115],
                            [W * 0.905, W * 0.10]]) {
    panouDeStuc(c, px - plat / 2, sus + H * 0.05, plat, lambriu - sus - H * 0.10, gr);
  }

  /* Coloana stă la stânga fișei de sală, nu sub ea: sus în dreapta e panoul cu
     text, iar un capitel desenat pe sub el nu se vede, doar încarcă. */
  coloanaCorintica(c, W * 0.635, sus, lambriu, W * 0.038, gr);

  /* Ușa din dreapta: nu duce nicăieri și n-are voie să ducă. E acolo fiindcă o
     sală fără nicio ieșire nu e o sală, e o cutie. */
  const ux = W * 0.98, ulat = W * 0.075, uSus = sus + H * 0.10;
  creion(c, gr * 1.3);
  c.beginPath();
  c.rect(ux - ulat, uSus, ulat * 1.4, jos - uSus);
  c.stroke();
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  c.beginPath();
  c.rect(ux - ulat * 0.86, uSus + H * 0.014, ulat * 1.28, jos - uSus - H * 0.014);
  c.stroke();
}

/* Un panou de stuc: rama pe dinafară, o a doua ramă mai subțire înăuntru, și
   colțurile tăiate. Două linii concentrice sunt tot ce trebuie — un panou plin
   de ornamente ar cere să fie privit, iar el are treabă să stea în spate. */
function panouDeStuc(c, x, y, w, h, gr) {
  if (w <= 0 || h <= 0) return;
  // câmpul panoului, cu o umbră de sus în jos, ca la stucul adevărat
  const camp = c.createLinearGradient(x, y, x + w * 0.5, y + h);
  camp.addColorStop(0, PIATRA_LUMINA);
  camp.addColorStop(1, PANOU_PERETE);
  c.fillStyle = camp;
  c.fillRect(x, y, w, h);
  creion(c, gr * 1.1);
  c.beginPath();
  c.rect(x, y, w, h);
  c.stroke();
  creion(c, gr * 0.7, LINIE_SUBTIRE);
  c.beginPath();
  c.rect(x + w * 0.09, y + w * 0.09, w * 0.82, h - w * 0.18);
  c.stroke();
}

/* Coloana cu capitel corintic. Capitelul nu se desenează frunză cu frunză: din
   depărtare, ce se vede dintr-un corint sunt volutele de la colțuri și două
   rânduri de acantă — trei arce și opt cârlige. Restul e literatură. */
function coloanaCorintica(c, cx, sus, jos, lat, gr) {
  const capSus = sus + H * 0.02, capJos = capSus + lat * 1.15;

  // fusul, din aceeași piatră ca peretele, dar rotund: deci luminat pe o parte
  const rotund = c.createLinearGradient(cx - lat * 0.5, 0, cx + lat * 0.5, 0);
  rotund.addColorStop(0, PIATRA_UMBRA);
  rotund.addColorStop(0.35, PIATRA_LUMINA);
  rotund.addColorStop(1, '#a89d88');
  c.fillStyle = rotund;
  c.beginPath();
  c.moveTo(cx - lat * 0.42, capJos);
  c.lineTo(cx - lat * 0.46, jos);
  c.lineTo(cx + lat * 0.46, jos);
  c.lineTo(cx + lat * 0.42, capJos);
  c.closePath();
  c.fill();
  c.fillStyle = PIATRA_LUMINA;
  c.beginPath();
  c.moveTo(cx - lat * 0.78, capSus);
  c.lineTo(cx + lat * 0.78, capSus);
  c.lineTo(cx + lat * 0.42, capJos);
  c.lineTo(cx - lat * 0.42, capJos);
  c.closePath();
  c.fill();

  // fusul, cu caneluri
  creion(c, gr * 1.3);
  c.beginPath();
  c.moveTo(cx - lat * 0.42, capJos); c.lineTo(cx - lat * 0.46, jos);
  c.moveTo(cx + lat * 0.42, capJos); c.lineTo(cx + lat * 0.46, jos);
  c.stroke();
  creion(c, gr * 0.6, LINIE_SUBTIRE);
  for (const q of [-0.22, 0, 0.22]) {
    c.beginPath();
    c.moveTo(cx + lat * q, capJos + H * 0.01); c.lineTo(cx + lat * q, jos);
    c.stroke();
  }

  // abacul de deasupra capitelului, ușor scobit pe laturi
  creion(c, gr * 1.3);
  c.beginPath();
  c.moveTo(cx - lat * 0.78, capSus);
  c.quadraticCurveTo(cx, capSus + lat * 0.09, cx + lat * 0.78, capSus);
  c.lineTo(cx + lat * 0.78, capSus + lat * 0.13);
  c.quadraticCurveTo(cx, capSus + lat * 0.22, cx - lat * 0.78, capSus + lat * 0.13);
  c.closePath();
  c.stroke();

  // coșul capitelului
  c.beginPath();
  c.moveTo(cx - lat * 0.70, capSus + lat * 0.15);
  c.quadraticCurveTo(cx - lat * 0.40, capJos - lat * 0.05, cx - lat * 0.42, capJos);
  c.lineTo(cx + lat * 0.42, capJos);
  c.quadraticCurveTo(cx + lat * 0.40, capJos - lat * 0.05, cx + lat * 0.70, capSus + lat * 0.15);
  c.stroke();

  /* Volutele din colțuri și două frunze de acantă. Atât — un capitel corintic
     desenat frunză cu frunză, la mărimea la care se vede aici, se face un ghem
     de linii. De departe, dintr-un corint se citesc două cârlige sus și un
     evantai jos. */
  creion(c, gr * 0.75);
  for (const lt of [-1, 1]) {
    c.beginPath();
    c.moveTo(cx + lt * lat * 0.62, capSus + lat * 0.22);
    c.quadraticCurveTo(cx + lt * lat * 0.56, capSus + lat * 0.48,
                       cx + lt * lat * 0.34, capSus + lat * 0.42);
    c.stroke();
    c.beginPath();
    c.moveTo(cx + lt * lat * 0.06, capJos - lat * 0.04);
    c.quadraticCurveTo(cx + lt * lat * 0.34, capJos - lat * 0.32,
                       cx + lt * lat * 0.30, capSus + lat * 0.56);
    c.stroke();
  }
}

/* Aplicele de perete: două lămpi în formă de clopot, de-o parte și de alta a
   firidei. Sunt mărunte, dar fără ele peretele n-are scară — nu știi dacă
   firida e cât o ușă sau cât o casă. */
function apliceleDePerete(c, g, gr) {
  const y = g.cornisa + H * 0.20;
  for (const cx of [W * 0.325, W * 0.582]) {
    const r = Math.min(W * 0.022, H * 0.035);
    creion(c, gr * 1.1);
    // brațul prins în perete
    c.beginPath();
    c.moveTo(cx, y - r * 1.5); c.lineTo(cx, y - r * 0.35);
    c.stroke();
    /* Lumina care iese din aplică. Ea e ce face dintr-o lampă desenată o lampă
       aprinsă — și tot ea spune că în sală e cald. */
    const luminaAplicei = c.createRadialGradient(cx, y + r * 0.4, 0, cx, y + r * 0.4, r * 4.5);
    luminaAplicei.addColorStop(0, 'rgba(255, 232, 170, 0.42)');
    luminaAplicei.addColorStop(1, 'rgba(255, 232, 170, 0)');
    c.fillStyle = luminaAplicei;
    c.beginPath();
    c.arc(cx, y + r * 0.4, r * 4.5, 0, Math.PI * 2);
    c.fill();

    // clopotul, de alamă
    const alama = c.createLinearGradient(cx - r, 0, cx + r, 0);
    alama.addColorStop(0, '#f0d68a');
    alama.addColorStop(0.4, ALAMA_SALA);
    alama.addColorStop(1, '#8a6a25');
    c.fillStyle = alama;
    c.beginPath();
    c.moveTo(cx - r, y + r * 0.75);
    c.quadraticCurveTo(cx - r * 0.9, y - r * 0.55, cx, y - r * 0.55);
    c.quadraticCurveTo(cx + r * 0.9, y - r * 0.55, cx + r, y + r * 0.75);
    c.closePath();
    c.fill();
    creion(c, gr * 1.1);
    c.beginPath();
    c.moveTo(cx - r, y + r * 0.75);
    c.quadraticCurveTo(cx - r * 0.9, y - r * 0.55, cx, y - r * 0.55);
    c.quadraticCurveTo(cx + r * 0.9, y - r * 0.55, cx + r, y + r * 0.75);
    c.stroke();
    creion(c, gr * 0.8, LINIE_SUBTIRE);
    c.beginPath();
    c.ellipse(cx, y + r * 0.75, r, r * 0.22, 0, 0, Math.PI * 2);
    c.stroke();
  }
}

/* Podeaua: dale pătrate care fug spre punctul de fugă. Puține și subțiri — o
   podea desenată apăsat trage ochiul în jos, iar aici ochiul are treabă la
   mijloc. */
function podeaDeDale(c, g, gr) {
  /* Dalele de piatră, cu lumina din luminator căzută pe ele. Podeaua e mai
     închisă decât peretele: altfel camera plutește. */
  const dale = c.createLinearGradient(0, g.podea, 0, H);
  dale.addColorStop(0, PODEA_ROST);
  dale.addColorStop(0.35, PODEA_DALA);
  dale.addColorStop(1, '#b9af9c');
  c.fillStyle = dale;
  c.fillRect(0, g.podea, W, H - g.podea);
  const balta = c.createRadialGradient(W * 0.5, g.podea + H * 0.10, 0,
                                       W * 0.5, g.podea + H * 0.10, Math.max(W, H) * 0.45);
  balta.addColorStop(0, 'rgba(255, 252, 240, 0.40)');
  balta.addColorStop(1, 'rgba(255, 252, 240, 0)');
  c.fillStyle = balta;
  c.fillRect(0, g.podea, W, H - g.podea);

  creion(c, gr * 0.7, LINIE_SUBTIRE);
  for (let k = -8; k <= 8; k++) {
    c.beginPath();
    c.moveTo(W * 0.5 + k * W * 0.066, g.podea);
    c.lineTo(W * 0.5 + k * W * 0.30, H * 1.04);
    c.stroke();
  }
  for (let k = 1; k <= 6; k++) {
    const y = intre(g.podea, H * 1.04, Math.pow(k / 6, 1.8));
    c.beginPath();
    c.moveTo(0, y); c.lineTo(W, y);
    c.stroke();
  }
}

/* Podiumul rotund, cu funii de catifea pe stâlpi și cu plăcuța de sală în față. */
function podiumulCuFunii(c, g, gr) {
  const h2 = H * 0.045;

  /* Podiumul: o piatră închisă, lustruită. Închis dinadins — pelerina albă stă
     pe el, iar o treaptă deschisă i-ar mânca poalele. */
  c.fillStyle = '#6d6353';
  c.beginPath();
  c.moveTo(g.podiumCx - g.podiumRx, g.podiumCy);
  c.lineTo(g.podiumCx - g.podiumRx, g.podiumCy + h2);
  c.ellipse(g.podiumCx, g.podiumCy + h2, g.podiumRx, g.podiumRy, 0, Math.PI, 0, true);
  c.lineTo(g.podiumCx + g.podiumRx, g.podiumCy);
  c.closePath();
  c.fill();
  const blat = c.createLinearGradient(0, g.podiumCy - g.podiumRy, 0, g.podiumCy + g.podiumRy);
  blat.addColorStop(0, '#a1968237'.slice(0, 7));
  blat.addColorStop(0, '#a19682');
  blat.addColorStop(1, '#8b8170');
  c.fillStyle = blat;
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy, g.podiumRx, g.podiumRy, 0, 0, Math.PI * 2);
  c.fill();

  creion(c, gr * 1.4);
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy, g.podiumRx, g.podiumRy, 0, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.moveTo(g.podiumCx - g.podiumRx, g.podiumCy);
  c.lineTo(g.podiumCx - g.podiumRx, g.podiumCy + h2);
  c.moveTo(g.podiumCx + g.podiumRx, g.podiumCy);
  c.lineTo(g.podiumCx + g.podiumRx, g.podiumCy + h2);
  c.stroke();
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy + h2, g.podiumRx, g.podiumRy, 0, 0, Math.PI);
  c.stroke();

  creion(c, gr);
  c.beginPath();
  c.rect(g.podiumCx - g.podiumRx * 0.24, g.podiumCy + h2 * 0.3,
         g.podiumRx * 0.48, h2 * 0.55);
  c.stroke();

  /* Aici stăteau patru stâlpi cu cordon, de jur împrejurul podiumului. I-am
     scos: în fața pelerinei n-au loc. Trena se revarsă tocmai peste locul lor,
     iar un cordon tras peste lucrarea pe care ai de gând s-o pictezi nu mai e
     un semn de muzeu, e un gard între tine și treaba ta.

     Și nici nu lipsesc: firida, podiumul și fișa de sală spun destul de limpede
     că ești într-un muzeu. */
}

/* ---------- PELERINA, ÎN LINIE ---------- */
/* Conturul pelerinei. Se ține într-un singur loc, fiindcă e nevoie de el în
   trei: la desen, la tăiat, și la socotit care ochiuri ale rețelei cad pe ea. */
/* Croiala pelerinei, scrisă o singură dată: pentru fiecare înălțime, cât e de
   lată. Din tabelul ăsta ies **și** conturul desenat, **și** socoteala
   acoperirii — două lucruri care trebuie să spună același adevăr. Scrise de două
   ori, s-ar despărți la prima schimbare: ai fi colorat o pelerină și ai fi
   acoperit alta.

   Ce spun cifrele, citite de sus în jos: gâtul manechinului, gluga care se
   revarsă peste umeri și e cel mai lat lucru de sus, o strângere sub umeri, și
   apoi căderea care se lățește până la poale.

   Strângerea de sub umeri e tot ce deosebește o mantie de un abajur. Fără ea,
   lățimea crește de sus până jos fără să se oprească nicăieri — și orice contur
   care face asta se citește ca un clopot, oricâte broderii i-ai pune pe el. */
const PROFIL_PELERINEI = [
  [0.000, 0.10], [0.028, 0.16], [0.058, 0.46], [0.080, 0.62],
  [0.115, 0.66], [0.190, 0.62], [0.340, 0.66], [0.520, 0.74],
  [0.700, 0.84], [0.860, 0.94], [0.960, 1.00], [1.000, 1.00]
];

function latimeaPelerinei(v) {
  const t = Math.max(0, Math.min(1, v));
  for (let k = 1; k < PROFIL_PELERINEI.length; k++) {
    const a = PROFIL_PELERINEI[k - 1], b = PROFIL_PELERINEI[k];
    if (t <= b[0]) {
      const q = (t - a[0]) / Math.max(0.0001, b[0] - a[0]);
      return intre(a[1], b[1], q);
    }
  }
  return PROFIL_PELERINEI[PROFIL_PELERINEI.length - 1][1];
}

/* Trena. O mantie de ceremonie nu cade la fel de o parte și de alta: ea are o
   coadă lungă, care se revarsă într-o singură parte și se așază pe podium.

   De-aia partea stângă capătă un adaos care crește numai de la brâu în jos.
   Fără el, pelerina e simetrică — și o mantie simetrică, oricât de brodată, se
   citește ca o rochie pusă pe umeraș. */
function adaosulTrenei(v) {
  if (v <= 0.70) return 0;
  const q = (v - 0.70) / 0.30;
  return Math.pow(q, 1.7) * 0.62;
}

function latimeaStanga(v) { return latimeaPelerinei(v) + adaosulTrenei(v); }
function latimeaDreapta(v) { return latimeaPelerinei(v) + adaosulTrenei(v) * 0.14; }

function traseulPelerinei(c) {
  const g = geomSala8();
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const PASI = 34;
  c.beginPath();
  // latura din stânga, de sus în jos, cu tot cu trenă
  for (let k = 0; k <= PASI; k++) {
    const v = k / PASI;
    const x = cx - latimeaStanga(v) * w, y = sus + v * h;
    if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  /* Poalele: un val, ca o baltă de stofă. O mantie lăsată pe jos nu se termină
     pe o linie trasă cu compasul. */
  const st = -latimeaStanga(1), dr = latimeaDreapta(1);
  for (let k = 0; k <= PASI; k++) {
    const q = k / PASI;
    const x = cx + intre(st, dr, q) * w;
    c.lineTo(x, sus + h * (1 + 0.03 * Math.sin(q * Math.PI * 2.6)));
  }
  // și înapoi în sus, pe dreapta
  for (let k = PASI; k >= 0; k--) {
    const v = k / PASI;
    c.lineTo(cx + latimeaDreapta(v) * w, sus + v * h);
  }
  c.closePath();
}

/* Mantia de pe podium, desenată numai cu conturul: gâtul manechinului, gluga
   revărsată, deschizătura din față cu cele două benzi brodate, ceaprazurile cu
   ciucuri pe piept, medalioanele, bordura de la poale și trena.

   E singurul lucru din sală făcut cu grijă de miniaturist — restul e schiță. Ea
   trebuie să ceară să fie colorată, iar un desen care cere culoare e unul în
   care se vede cât s-a lucrat la contur. */
function pelerinaInLinie(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, jos = g.pelJos, w = g.pelLat, h = g.pelInalt;
  const umarY = sus + h * 0.125, umarX = latimeaPelerinei(0.125) * w;

  gatulManechinului(c, g, gr);

  /* Pelerina se umple cu alb înainte de orice linie. Ea e **singurul lucru
     nepictat din toată sala**, iar asta trebuie să se vadă dintr-o privire: o
     pânză albă într-o cameră colorată nu are nevoie de nicio săgeată ca să
     spună „eu sunt de făcut".

     Albul nu e curat, ci ușor gălbui, cu o umbră spre poale: o pânză de in
     amorsată, nu o gaură în ecran. */
  const panza = c.createLinearGradient(0, sus, 0, jos);
  panza.addColorStop(0, '#fffdf7');
  panza.addColorStop(0.55, '#f7f1e2');
  panza.addColorStop(1, '#e8dfcb');
  c.fillStyle = panza;
  traseulPelerinei(c);
  c.fill();

  creion(c, gr * 1.6);
  traseulPelerinei(c);
  c.stroke();

  glugaPelerinei(c, g, gr, umarX, umarY);
  deschizaturaDinFata(c, g, gr, umarY);
  ceaprazurileDePiept(c, g, gr, umarY);
  medalioanePeMantie(c, g, gr);
  borduraPoalelor(c, g, gr);
  cuteleStofei(c, g, gr, umarY);
}

/* Gâtul manechinului: un stâlp scurt care iese din glugă. El e tot ce spune că
   pelerina e **îmbrăcată pe ceva**, nu atârnată într-un cui. */
function gatulManechinului(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const lat = w * 0.085, inalt = h * 0.052;
  creion(c, gr * 1.3);
  c.beginPath();
  c.moveTo(cx - lat * 0.78, sus - inalt);
  c.lineTo(cx - lat, sus + h * 0.02);
  c.lineTo(cx + lat, sus + h * 0.02);
  c.lineTo(cx + lat * 0.78, sus - inalt);
  c.closePath();
  c.stroke();
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  c.beginPath();
  c.ellipse(cx, sus - inalt, lat * 0.78, lat * 0.22, 0, 0, Math.PI * 2);
  c.stroke();
}

/* Gluga: masa care se revarsă peste umeri, cu marginea ei răsfrântă. Se
   desenează ca un scut lat, cu o cută adâncă la mijloc — acolo unde gluga se
   îndoaie peste ceafă. */
/* Gluga. Nu o bonetă lipită peste umeri, ci o **pungă de stofă lăsată pe
   spate**: se ridică mai sus decât gâtul, se rotunjește în spatele lui și se
   varsă peste umeri, iar pe dinăuntru i se vede căptușeala.

   Prima variantă o desenase ca pe o dungă curbă peste umeri, la aceeași
   înălțime cu gulerul — și atunci silueta se citea drept clopot cu capac.
   Gluga trebuie să **iasă din contur în sus**: asta e ce spune, dintr-o
   privire, că lucrul de pe manechin e o mantie cu glugă. */
function glugaPelerinei(c, g, gr, umarX, umarY) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const varf = sus - h * 0.075;                 // vârful glugii, deasupra gâtului
  const jos = sus + h * 0.135;                  // unde se varsă peste piept
  const lat = w * 0.52;

  // masa glugii, văzută din față: se ridică în spatele gâtului
  creion(c, gr * 1.4);
  c.beginPath();
  c.moveTo(cx - lat, jos);
  c.quadraticCurveTo(cx - lat * 1.06, varf + h * 0.03, cx - lat * 0.44, varf);
  c.quadraticCurveTo(cx, varf - h * 0.028, cx + lat * 0.44, varf);
  c.quadraticCurveTo(cx + lat * 1.06, varf + h * 0.03, cx + lat, jos);
  c.stroke();

  /* Deschizătura glugii: un oval întors, prin care se vede căptușeala. Fără el,
     gluga e un sac; cu el, e o glugă lăsată pe spate. */
  creion(c, gr * 1.1);
  c.beginPath();
  c.moveTo(cx - lat * 0.62, jos - h * 0.012);
  c.quadraticCurveTo(cx - lat * 0.66, varf + h * 0.055, cx, varf + h * 0.042);
  c.quadraticCurveTo(cx + lat * 0.66, varf + h * 0.055, cx + lat * 0.62, jos - h * 0.012);
  c.stroke();
  creion(c, gr * 0.7, LINIE_SUBTIRE);
  c.beginPath();
  c.moveTo(cx - lat * 0.50, jos - h * 0.020);
  c.quadraticCurveTo(cx - lat * 0.54, varf + h * 0.078, cx, varf + h * 0.066);
  c.quadraticCurveTo(cx + lat * 0.54, varf + h * 0.078, cx + lat * 0.50, jos - h * 0.020);
  c.stroke();

  // marginea de jos, revărsată peste umeri
  creion(c, gr * 1.25);
  c.beginPath();
  c.moveTo(cx - umarX * 0.99, umarY);
  c.quadraticCurveTo(cx - umarX * 0.60, jos + h * 0.030, cx, jos + h * 0.014);
  c.quadraticCurveTo(cx + umarX * 0.60, jos + h * 0.030, cx + umarX * 0.99, umarY);
  c.stroke();

  // cutele care coboară din glugă pe umeri
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  for (const q of [-0.66, -0.34, 0.34, 0.66]) {
    c.beginPath();
    c.moveTo(cx + lat * q * 0.9, jos - h * 0.01);
    c.quadraticCurveTo(cx + umarX * q * 0.86, jos + h * 0.03,
                       cx + umarX * q * 0.96, umarY + h * 0.012);
    c.stroke();
  }
}

/* Deschizătura din față: pelerina se desface pe mijloc, iar pe cele două
   margini coboară benzile brodate — orfreiele. Ele sunt partea cea mai bogată a
   unei mantii de ceremonie, și tot ele împart suprafața în fâșii: fâșiile sunt
   tocmai ce face colorarea să merite, fiindcă îți dau unde să schimbi culoarea. */
function deschizaturaDinFata(c, g, gr, umarY) {
  desfaFata(c, g, gr, umarY);
}

/* Deschizătura din față, ca pe mantia adevărată: la mijloc se vede **căptușeala**
   — o fâșie deschisă care coboară de sub glugă până la poale — iar de-o parte și
   de alta a ei stau **două benzi late de broderie**, pline de vrejuri.

   Prima variantă le făcuse două dungi subțiri lângă mijloc. Pe mantia adevărată
   ele sunt late cât o palmă și țin toată înălțimea: sunt partea cea mai bogată a
   veșmântului, și tot ele împart suprafața în fâșii — fâșiile fiind tocmai ce
   face colorarea să merite, fiindcă îți dau unde să schimbi culoarea. */
function desfaFata(c, g, gr, umarY) {
  const cx = g.pelCx, jos = g.pelJos, w = g.pelLat, h = g.pelInalt;
  const sus = g.pelSus + h * 0.145;
  const josDesch = jos - h * 0.085;

  /* Cât e de lată deschizătura la înălțimea `t`: strâmtă sub glugă, lată la
     poale — mantia se desface pe măsură ce cade. */
  const desch = function (t) { return w * intre(0.055, 0.235, Math.pow(t, 1.25)); };
  const banda = function (t) { return w * intre(0.075, 0.135, t); };

  // căptușeala din mijloc, mai deschisă decât restul
  c.save();
  c.fillStyle = '#fffdf6';
  c.beginPath();
  for (let k = 0; k <= 24; k++) {
    const t = k / 24, y = intre(sus, josDesch, t);
    if (k === 0) c.moveTo(cx - desch(t), y); else c.lineTo(cx - desch(t), y);
  }
  for (let k = 24; k >= 0; k--) {
    const t = k / 24, y = intre(sus, josDesch, t);
    c.lineTo(cx + desch(t), y);
  }
  c.closePath();
  c.fill();
  c.restore();
  creion(c, gr * 1.2);
  for (const lat of [-1, 1]) {
    c.beginPath();
    for (let k = 0; k <= 24; k++) {
      const t = k / 24, y = intre(sus, josDesch, t);
      if (k === 0) c.moveTo(cx + lat * desch(t), y); else c.lineTo(cx + lat * desch(t), y);
    }
    c.stroke();
  }

  // marginea dinafară a celor două benzi late de broderie
  creion(c, gr * 1.3);
  for (const lat of [-1, 1]) {
    c.beginPath();
    for (let k = 0; k <= 24; k++) {
      const t = k / 24, y = intre(sus, josDesch, t);
      const x = cx + lat * (desch(t) + banda(t));
      if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
  }

  /* Vrejurile dinăuntrul benzilor: cârcei care se răsucesc de-a lungul lor, cu
     câte o floare la fiecare cotitură. Așa arată o broderie cu fir de aur de la
     doi pași — nu ca un lanț de romburi trase la riglă. */
  creion(c, gr * 0.6, LINIE_SUBTIRE);
  for (const lat of [-1, 1]) {
    for (let k = 0; k < 9; k++) {
      const t = (k + 0.5) / 9;
      const y = intre(sus, josDesch, t);
      const mij = cx + lat * (desch(t) + banda(t) * 0.5);
      const b = banda(t) * 0.5;
      const inaltOchi = (josDesch - sus) / 9 * 0.46;
      c.beginPath();
      c.moveTo(mij - b * 0.7, y + inaltOchi);
      c.quadraticCurveTo(mij - b * 0.95, y, mij, y - inaltOchi);
      c.quadraticCurveTo(mij + b * 0.95, y, mij + b * 0.7, y + inaltOchi);
      c.stroke();
      c.beginPath();
      c.arc(mij, y + inaltOchi * 0.35, b * 0.26, 0, Math.PI * 2);
      c.stroke();
    }
  }
}

/* Ceaprazurile de pe piept: rânduri de găitan prinse de la o bandă la alta, cu
   câte un ciucure la fiecare capăt. Ele sunt semnul cel mai tare al unei mantii
   de ceremonie — fără ele, orice cădere de stofă e o pelerină de ploaie. */
function ceaprazurileDePiept(c, g, gr, umarY) {
  const cx = g.pelCx, w = g.pelLat, h = g.pelInalt;
  /* Pe mantia adevărată ceaprazurile nu trec peste piept dintr-o parte în alta:
     sunt **două șiruri**, câte unul pe fiecare jumătate, alături de benzile
     brodate, cu ciucurele atârnând spre afară. Trase de la un umăr la altul, ar
     închide deschizătura — și atunci mantia n-ar mai putea fi îmbrăcată. */
  const sus = g.pelSus + h * 0.185;
  const RANDURI = 5;
  for (const lat of [-1, 1]) {
    for (let k = 0; k < RANDURI; k++) {
      const t = k / (RANDURI - 1);
      const y = sus + t * h * 0.125;
      const dinauntru = w * intre(0.125, 0.185, t);
      const dinafara = w * intre(0.30, 0.375, t);
      creion(c, gr * 1.15);
      c.beginPath();
      c.moveTo(cx + lat * dinauntru, y);
      c.quadraticCurveTo(cx + lat * (dinauntru + dinafara) * 0.5, y + h * 0.008,
                         cx + lat * dinafara, y - h * 0.004);
      c.stroke();
      // ciucurele de la capătul dinafară
      creion(c, gr * 0.8, LINIE_SUBTIRE);
      c.beginPath();
      c.moveTo(cx + lat * dinafara, y - h * 0.004);
      c.lineTo(cx + lat * dinafara, y + h * 0.024);
      c.stroke();
      c.beginPath();
      c.ellipse(cx + lat * dinafara, y + h * 0.030, w * 0.020, h * 0.014, 0, 0, Math.PI * 2);
      c.stroke();
      creion(c, gr * 0.5, LINIE_SUBTIRE);
      for (const q of [-0.5, 0, 0.5]) {
        c.beginPath();
        c.moveTo(cx + lat * dinafara + w * 0.020 * q, y + h * 0.026);
        c.lineTo(cx + lat * dinafara + w * 0.024 * q, y + h * 0.044);
        c.stroke();
      }
    }
  }
}

/* Medalioanele brodate, împrăștiate pe umeri și pe cădere — nu înșirate pe o
   singură linie. Pe mantiile de încoronare ele stau răzleț, ca stelele pe un
   cer: dacă le pui la rând, se citesc ca nasturii unei haine. */
function medalioanePeMantie(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const LOCURI = [
    [-0.40, 0.235], [0.40, 0.235],
    [-0.315, 0.395], [0.335, 0.415],
    [-0.475, 0.545], [0.470, 0.560],
    [-0.385, 0.700], [0.400, 0.715],
    [-0.640, 0.820], [0.560, 0.845]
  ];
  for (const [fx, fy] of LOCURI) {
    const x = cx + fx * w, y = sus + fy * h;
    const r = w * 0.058;
    creion(c, gr * 1.05);
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
    creion(c, gr * 0.65, LINIE_SUBTIRE);
    c.beginPath(); c.arc(x, y, r * 0.52, 0, Math.PI * 2); c.stroke();
    // crucea dinăuntru, cu brațe egale
    c.beginPath();
    c.moveTo(x - r * 0.52, y); c.lineTo(x + r * 0.52, y);
    c.moveTo(x, y - r * 0.52); c.lineTo(x, y + r * 0.52);
    c.stroke();
    // razele dintre cercuri
    c.beginPath();
    for (let q = 0; q < 8; q++) {
      const a = (q / 8) * Math.PI * 2 + Math.PI / 8;
      c.moveTo(x + Math.cos(a) * r * 0.56, y + Math.sin(a) * r * 0.56);
      c.lineTo(x + Math.cos(a) * r * 0.94, y + Math.sin(a) * r * 0.94);
    }
    c.stroke();
  }
}

/* Bordura de la poale: o bandă lată care urmează marginea de jos a mantiei, cu
   un motiv care se repetă. Ea închide desenul — o mantie care se termină pe o
   linie goală arată tăiată cu foarfeca, nu croită. */
function borduraPoalelor(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const PASI = 40;
  const st = -latimeaStanga(1), dr = latimeaDreapta(1);

  // marginea de sus a bordurii, mai înăuntru cu o palmă
  creion(c, gr * 1.1);
  c.beginPath();
  for (let k = 0; k <= PASI; k++) {
    const q = k / PASI;
    const x = cx + intre(st * 0.965, dr * 0.955, q) * w;
    const y = sus + h * (1 + 0.03 * Math.sin(q * Math.PI * 2.6)) - h * 0.115;
    if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  c.stroke();

  // motivul: cârlige legate între ele, ca meandrul grecesc simplificat
  creion(c, gr * 0.6, LINIE_SUBTIRE);
  for (let k = 0; k < 26; k++) {
    const q = (k + 0.5) / 26;
    const x = cx + intre(st * 0.965, dr * 0.955, q) * w;
    const y = sus + h * (1 + 0.03 * Math.sin(q * Math.PI * 2.6)) - h * 0.058;
    /* Motivul bordurii: o palmetă între două cârlige, repetată. La bordura lată
       a mantiei adevărate se vede un vrej continuu, nu niște cârlige răzlețe. */
    const r = w * 0.034;
    c.beginPath();
    c.moveTo(x - r, y + r * 0.62);
    c.quadraticCurveTo(x - r * 0.5, y - r * 0.7, x, y - r * 0.2);
    c.quadraticCurveTo(x + r * 0.5, y - r * 0.7, x + r, y + r * 0.62);
    c.stroke();
    c.beginPath();
    c.arc(x, y + r * 0.30, r * 0.22, 0, Math.PI * 2);
    c.stroke();
  }
}

/* Cutele stofei: pleacă de sub glugă și se răsfiră spre poale, urmând căderea.
   Se opresc înainte de bordură, nu o taie — o cută care iese din stofă e o
   zgârietură. */
function cuteleStofei(c, g, gr, umarY) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  creion(c, gr * 0.85, LINIE_SUBTIRE);
  for (let k = 0; k < 11; k++) {
    const t = (k + 0.5) / 11;
    const de = (t - 0.5) * 2;                       // -1 stânga, 1 dreapta
    const vSus = 0.20, vJos = 0.90;
    const latSus = de * latimeaPelerinei(vSus) * 0.80;
    // cutele din stânga se duc odată cu trena, deci ajung mai departe
    const latJos = de < 0 ? de * latimeaStanga(vJos) * 0.86
                          : de * latimeaDreapta(vJos) * 0.86;
    c.beginPath();
    c.moveTo(cx + latSus * w, sus + vSus * h);
    c.quadraticCurveTo(cx + intre(latSus, latJos, 0.45) * w, sus + 0.60 * h,
                       cx + latJos * w, sus + vJos * h);
    c.stroke();
  }
}

function ochiulPelerinei(i, j) {
  const g = geomSala8();
  const w = g.pelLat * 2 * latimeaPelerinei(0.96), h = g.pelInalt * 1.03;
  return {
    x: g.pelCx - w / 2 + (i + 0.5) * w / OCHIURI_PELERINA,
    y: g.pelSus + (j + 0.5) * h / OCHIURI_PELERINA
  };
}

/* Care ochiuri cad **pe** pelerină. Se socotește din croială: la înălțimea
   ochiului, pelerina e lată de atât — deci ochiul e pe ea dacă e mai aproape de
   ax decât atât. O singură înmulțire, fără nicio citire de pânză. */
function pregatesteOchiurile() {
  const g = geomSala8();
  s8.celule = [];
  for (let i = 0; i < OCHIURI_PELERINA; i++) {
    for (let j = 0; j < OCHIURI_PELERINA; j++) {
      const o = ochiulPelerinei(i, j);
      const v = (o.y - g.pelSus) / g.pelInalt;
      const inauntru = v >= 0 && v <= 1 &&
                       Math.abs(o.x - g.pelCx) <= latimeaPelerinei(v) * g.pelLat;
      s8.celule[i * OCHIURI_PELERINA + j] = inauntru ? false : null;
    }
  }
}

/* ---------- FIȘA DE SALĂ ---------- */
/* Fișa de sală. **Caseta se face cât textul, nu textul cât caseta.**

   Înainte caseta avea o înălțime scrisă de mână, iar litera se micșora până
   încăpea în ea: la un text lung ieșeau litere de opt pixeli într-un chenar cu
   loc gol dedesubt, fiindcă micșorarea se oprea la prag. E pe dos. Un panou de
   muzeu se face cât are de spus.

   Deci: alegem o literă care se citește (potrivită după ecran, nu după casetă),
   rupem textul pe lățimea dată, socotim câte rânduri ies — și abia atunci știm
   cât e de înaltă caseta. */
function inaltimeaFisei(c, g) {
  const marime = marimeaFisei(g);
  c.save();
  c.font = Math.round(marime) + 'px Georgia';
  const paragrafe = TEXT_FISA_PIGMENTI.split('\n');
  let inalt = g.fisaLat * 0.06;                 // marginea de sus
  for (const par of paragrafe) {
    inalt += randuriInCaseta(c, par, g.fisaLat * 0.86).length * marime * 1.42;
    inalt += marime * 0.75;                     // pauza dintre paragrafe
  }
  c.restore();
  return inalt + g.fisaLat * 0.04;              // marginea de jos
}

/* Litera fișei: destul de mare cât s-o citești de la un metru, dar nu atât cât
   să facă din panou un afiș. Se ia din ecran, fiindcă de ecran ține cititul. */
function marimeaFisei(g) {
  return Math.max(11, Math.min(g.fisaLat * 0.055, g.S * 0.021));
}

function fisaDeSala8(c, g, gr) {
  const x = g.fisaX, y = g.fisaY, w = g.fisaLat;
  const h = inaltimeaFisei(c, g);
  c.save();
  c.fillStyle = 'rgba(255, 254, 250, 0.92)';
  c.fillRect(x, y, w, h);
  creion(c, gr * 1.4);
  c.strokeRect(x, y, w, h);
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  c.strokeRect(x + w * 0.025, y + w * 0.018, w * 0.95, h - w * 0.036);
  c.restore();

  /* Trei paragrafe, cu o singură mărime de literă pentru toate. Căutată pentru
     fiecare în parte, primul ar ieși mare și ultimul mărunt — iar o fișă scrisă
     cu trei litere diferite arată a colaj. */
  const marime = marimeaFisei(g);
  let yy = y + w * 0.06;
  for (const par of TEXT_FISA_PIGMENTI.split('\n')) {
    yy = scrieInCaseta(c, par, x + w * 0.5, yy, w * 0.86, h, marime, '', '#3a342c');
    yy += marime * 0.75;
  }
}

/* ---------- USTENSILELE ---------- */
/* Șase unelte așezate **peste desen**, nu într-o cutie.

   Aveau o casetă albă cu chenar, ca o paletă de program de desen. Dar sala e o
   coală de hârtie, iar pe o coală uneltele stau pur și simplu puse — răsfirate,
   ușor înclinate, cum le lasă cineva care tocmai a pus mâna pe ele. Caseta le
   făcea să pară un meniu; fără ea, par la îndemână.

   Și sunt singurele lucruri **colorate** din toată sala nepictată. Asta nu e
   înfrumusețare: culoarea lor spune, fără niciun cuvânt, că ele sunt lucrurile
   cu care se aduce culoare aici. Ochiul le găsește din prima, oriunde ar fi. */
/* Culorile sunt luate de pe unelte adevărate, nu alese după gust: coadă de fag
   nelăcuit — pal, gălbui, aproape alb pe muchia luminată; virolă de alamă la
   pensulele rotunde și late; virolă de argint, cu nituri, la bidinele și la
   cuțite; păr de porc crem la pensulele de ulei, păr sintetic chihlimbariu la
   bidinele; lamă de oțel, îndoită la gât, la cuțitele de paletă.

   Le pusesem întâi cozi roșii, negre și maro-închis, ca la creioanele colorate.
   Arătau a jucărie. O unealtă de pictor e un lucru de lucru: lemn crud, metal și
   păr — iar tocmai fiindcă ea e singurul obiect colorat dintr-o sală nedesenată,
   e cu atât mai important să fie **adevărată**. */
const LEMN_UNEALTA  = '#e2cda4';   // fagul, în plină lumină
const LEMN_UMBRA8   = '#b99b6a';
const ALAMA_UNEALTA = '#d9a93c';
const ARGINT_UNEALTA = '#c5cad0';
const PAR_PORC      = '#f0e2c0';   // păr crem, la pensulele de ulei
const PAR_SINTETIC  = '#e8a13c';   // păr chihlimbariu, la bidinele
const OTEL_UNEALTA  = '#c9ced3';

/* Unde stă fiecare unealtă: locul, înclinarea și mărimea. Sunt răsfirate în
   evantai, ca niște pensule lăsate una peste alta — nu aliniate ca la raft. */
function locurileUneltelor() {
  const g = geomSala8();
  const S = g.S;
  /* Uneltele stau **sub** îndemn, nu peste el: cozile lor sunt lungi și urcă
     mult deasupra mijlocului, iar așezate mai sus scriau peste litere. */
  const x0 = W * 0.048, y0 = H * 0.585;
  const pas = Math.min(W * 0.040, S * 0.076);
  const inalt = Math.min(H * 0.20, S * 0.32);
  const locuri = [];
  for (let k = 0; k < USTENSILE.length; k++) {
    const t = k / (USTENSILE.length - 1);
    locuri.push({
      x: x0 + k * pas,
      y: y0 + Math.sin(t * Math.PI) * H * 0.016,
      unghi: (t - 0.5) * 0.42,
      inalt: inalt * (0.94 + Math.sin(t * Math.PI) * 0.1)
    });
  }
  return locuri;
}

function deseneazaTrusa(acum) {
  const g = geomSala8();
  const gr = Math.max(1, g.S * 0.0022);
  const locuri = locurileUneltelor();

  indemnulScenei8(g, locuri);

  for (let k = 0; k < USTENSILE.length; k++) {
    const L = locuri[k];
    const aleasa = s8.unealta === k;
    ctx.save();
    ctx.translate(L.x, L.y + (aleasa ? -H * 0.022 : 0));
    ctx.rotate(L.unghi + (aleasa ? -L.unghi * 0.6 : 0));

    /* Cea aleasă se ridică, se îndreaptă și primește sub ea o pată din culoarea
       cu care lucrezi acum. Nu un chenar: o urmă de vopsea, adică chiar lucrul
       pe care unealta îl face. */
    if (aleasa) {
      const cul = CERC_CROMATIC[s8.culoare % CERC_CROMATIC.length];
      ctx.save();
      ctx.globalAlpha = 0.85;
      /* O urmă mică, chiar sub vârful uneltei — nu o pată lată alături, care
         ieșea ca o gură roșie pusă pe podea. Ea spune două lucruri deodată: care
         unealtă e în mână și cu ce culoare lucrează. */
      pastaCuUnealta(ctx, 0, L.inalt * 0.60, L.inalt * 0.30, L.inalt * 0.10,
                     0.06, cul, USTENSILE[k].forma, USTENSILE[k].relief);
      ctx.restore();
    }
    // umbra ei pe hârtie, ca să stea deasupra desenului, nu în el
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#3a3228';
    ctx.beginPath();
    ctx.ellipse(L.inalt * 0.05, L.inalt * 0.5, L.inalt * 0.10, L.inalt * 0.035, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    deseneazaUnealta(ctx, k, 0, 0, L.inalt, gr);
    ctx.restore();
  }
}

/* Îndemnul. Nu mai stă ca un titlu de ziar deasupra unei cutii: e scris pe o
   tușă de vopsea trasă cu bidineaua, ca și cum cineva ar fi vopsit un petic de
   perete anume ca să scrie pe el. Se potrivește cu ce cere — „lasă-ți amprenta"
   — fiindcă e chiar o amprentă.

   Scris pe două rânduri, cu al doilea mai mic: primul e invitația, al doilea
   explicația. Puse la fel, se citesc ca o singură frază lungă. */
function indemnulScenei8(g, locuri) {
  const x = W * 0.032, y = H * 0.062;
  const lat = Math.min(W * 0.30, g.S * 0.56);
  /* Destul de înaltă cât să încapă **amândouă** rândurile cu tot cu coada
     literelor. Era cât un rând și jumătate, iar al doilea ieșea din vopsea. */
  const inalt = H * 0.082;

  ctx.save();
  // tușa de vopsea de sub scris, dintr-o pastă caldă
  ctx.globalAlpha = 0.88;
  const banda = ctx.createLinearGradient(x, y, x + lat, y + inalt);
  banda.addColorStop(0, '#f0c86a');
  banda.addColorStop(0.55, '#e8b04a');
  banda.addColorStop(1, '#d9963a');
  ctx.fillStyle = banda;
  ctx.beginPath();
  ctx.moveTo(x, y + inalt * 0.30);
  ctx.quadraticCurveTo(x + lat * 0.22, y - inalt * 0.12, x + lat * 0.58, y + inalt * 0.06);
  ctx.quadraticCurveTo(x + lat * 0.86, y + inalt * 0.20, x + lat, y + inalt * 0.02);
  ctx.lineTo(x + lat * 0.985, y + inalt * 0.92);
  ctx.quadraticCurveTo(x + lat * 0.6, y + inalt * 1.16, x + lat * 0.24, y + inalt * 0.98);
  ctx.quadraticCurveTo(x + lat * 0.08, y + inalt * 0.90, x, y + inalt * 1.02);
  ctx.closePath();
  ctx.fill();
  // creasta de sus a tușei, cât să se vadă că e pastă, nu dreptunghi
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = '#fff3d0';
  ctx.lineWidth = Math.max(1, inalt * 0.10);
  ctx.beginPath();
  ctx.moveTo(x + lat * 0.04, y + inalt * 0.26);
  ctx.quadraticCurveTo(x + lat * 0.3, y + inalt * 0.02, x + lat * 0.62, y + inalt * 0.16);
  ctx.stroke();
  ctx.restore();

  const marimeMare = Math.max(13, Math.min(g.S * 0.026, lat * 0.062));
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#4a2c10';
  ctx.font = `bold ${Math.round(marimeMare)}px Georgia`;
  ctx.fillText('Spațiul este pânza ta.', x + lat * 0.5, y + inalt * 0.38);
  ctx.font = `italic ${Math.round(marimeMare * 0.80)}px Georgia`;
  ctx.fillStyle = '#5e3a16';
  ctx.fillText('Lasă-ți amprenta. Personalizează spațiul.',
               x + lat * 0.5, y + inalt * 0.70);
  ctx.restore();
}

/* O unealtă, desenată după cele adevărate: coada lungă de fag, virola, și
   capătul care lucrează. Ce le deosebește e chiar capătul — de-aia el se
   desenează cu grijă, iar coada e o dungă de lemn. */
function deseneazaUnealta(c, k, cx, cy, inalt, gr) {
  const u = USTENSILE[k % USTENSILE.length];
  const lat = inalt * 0.26;
  c.save();
  c.translate(cx, cy);

  if (u.cutit) cutitDePaleta(c, u, inalt, lat, gr);
  else pensula(c, u, inalt, lat, gr);

  c.restore();
}

/* Coada de fag: lungă, subțiată spre capătul de sus, cu o muchie luminată în
   stânga și una în umbră în dreapta. Lemnul nelăcuit n-are luciu, deci nu are
   sclipire — are doar cele două fețe. */
function coadaDeFag(c, latSus, latJos, sus, jos) {
  const lemn = c.createLinearGradient(-latJos, 0, latJos, 0);
  lemn.addColorStop(0, '#fdf6e6');
  lemn.addColorStop(0.30, LEMN_UNEALTA);
  lemn.addColorStop(1, LEMN_UMBRA8);
  c.fillStyle = lemn;
  c.beginPath();
  c.moveTo(-latSus, sus + latSus * 0.6);
  c.quadraticCurveTo(0, sus - latSus * 0.5, latSus, sus + latSus * 0.6);
  c.lineTo(latJos, jos);
  c.lineTo(-latJos, jos);
  c.closePath();
  c.fill();
}

function pensula(c, u, inalt, lat, gr) {
  const patrat = u.forma === 'patrat';
  const lata = u.gros > 0.9;                     // bidineaua
  const latVirola = lat * (0.18 + u.gros * 0.30);
  const virolaSus = inalt * 0.02, virolaJos = inalt * 0.19;

  coadaDeFag(c, lat * 0.075, latVirola * 0.92, -inalt * 0.5, virolaSus);

  /* Virola. La pensulele de ulei e de alamă și se lățește ușor spre păr; la
     bidinele e de argint, cu trei brâuri și cu nituri — exact cum se vede pe
     ele. */
  const met = c.createLinearGradient(-latVirola, 0, latVirola, 0);
  if (lata) {
    met.addColorStop(0, '#f2f5f8'); met.addColorStop(0.4, ARGINT_UNEALTA);
    met.addColorStop(1, '#7e858d');
  } else {
    met.addColorStop(0, '#fdf0c8'); met.addColorStop(0.4, ALAMA_UNEALTA);
    met.addColorStop(1, '#8a6a25');
  }
  c.fillStyle = met;
  c.beginPath();
  c.moveTo(-latVirola * 0.80, virolaSus);
  c.lineTo(latVirola * 0.80, virolaSus);
  c.lineTo(latVirola, virolaJos);
  c.lineTo(-latVirola, virolaJos);
  c.closePath();
  c.fill();
  creion(c, gr * 0.7);
  c.stroke();
  if (lata) {
    creion(c, gr * 0.55, 'rgba(70,78,86,0.8)');
    for (const q of [0.30, 0.52, 0.74]) {
      const y = intre(virolaSus, virolaJos, q);
      const l = intre(latVirola * 0.80, latVirola, q);
      c.beginPath(); c.moveTo(-l, y); c.lineTo(l, y); c.stroke();
    }
    // niturile
    c.fillStyle = '#8b939b';
    for (const q of [-0.5, 0.5]) {
      c.beginPath();
      c.arc(latVirola * q, intre(virolaSus, virolaJos, 0.62), Math.max(0.8, gr * 0.9), 0, Math.PI * 2);
      c.fill();
    }
  }

  /* Părul. Aici se vede felul uneltei: **ascuțit** se strânge într-un vârf,
     **pătrat** se termină retezat drept. Asta e chiar deosebirea care se simte
     pe perete când pictezi, deci trebuie să se vadă și în unealtă. */
  const lp = latVirola * 1.02;
  const varf = inalt * (patrat ? 0.47 : 0.54);
  const par = c.createLinearGradient(0, virolaJos, 0, varf);
  const bazaPar = lata ? PAR_SINTETIC : PAR_PORC;
  par.addColorStop(0, lata ? '#f6c882' : '#fdf6e4');
  par.addColorStop(0.55, bazaPar);
  par.addColorStop(1, lata ? '#c07a1e' : '#cbb183');
  c.fillStyle = par;
  c.beginPath();
  if (patrat) {
    c.moveTo(-latVirola * 0.96, virolaJos);
    c.lineTo(-lp, varf - inalt * 0.03);
    c.quadraticCurveTo(-lp * 0.9, varf, -lp * 0.72, varf);
    c.lineTo(lp * 0.72, varf);
    c.quadraticCurveTo(lp * 0.9, varf, lp, varf - inalt * 0.03);
    c.lineTo(latVirola * 0.96, virolaJos);
  } else {
    c.moveTo(-latVirola * 0.96, virolaJos);
    c.quadraticCurveTo(-lp * 1.05, intre(virolaJos, varf, 0.45),
                       -lp * 0.34, intre(virolaJos, varf, 0.80));
    c.quadraticCurveTo(-lp * 0.10, varf * 0.99, 0, varf);
    c.quadraticCurveTo(lp * 0.10, varf * 0.99, lp * 0.34, intre(virolaJos, varf, 0.80));
    c.quadraticCurveTo(lp * 1.05, intre(virolaJos, varf, 0.45),
                       latVirola * 0.96, virolaJos);
  }
  c.closePath();
  c.fill();
  creion(c, gr * 0.7);
  c.stroke();

  // firele de păr
  creion(c, gr * 0.45, lata ? 'rgba(150,88,16,0.55)' : 'rgba(150,128,88,0.5)');
  for (let q = 1; q < u.fire + 1; q++) {
    const t = q / (u.fire + 1);
    c.beginPath();
    c.moveTo(intre(-latVirola * 0.9, latVirola * 0.9, t), virolaJos + inalt * 0.01);
    c.lineTo(intre(-lp * 0.82, lp * 0.82, t), varf - inalt * 0.02);
    c.stroke();
  }
}

/* Cuțitul de paletă. Trei lucruri îl fac să fie el și nu un cuțit de bucătărie:
   coada în formă de picătură, **cu o gaură** la capăt; gâtul de oțel îndoit — de
   asta îi zice „cotit", și tocmai el ține degetele deasupra pastei; și lama
   subțire, în formă de mistrie. */
function cutitDePaleta(c, u, inalt, lat, gr) {
  const latCoada = lat * 0.30;
  const gatSus = -inalt * 0.06, gatJos = inalt * 0.10;

  // coada, picătură cu gaură
  const lemn = c.createLinearGradient(-latCoada, 0, latCoada, 0);
  lemn.addColorStop(0, '#fdf6e6');
  lemn.addColorStop(0.30, LEMN_UNEALTA);
  lemn.addColorStop(1, LEMN_UMBRA8);
  c.fillStyle = lemn;
  c.beginPath();
  c.moveTo(0, -inalt * 0.52);
  c.quadraticCurveTo(latCoada * 1.1, -inalt * 0.36, latCoada * 0.92, -inalt * 0.06);
  c.quadraticCurveTo(latCoada * 0.8, gatSus + inalt * 0.02, latCoada * 0.5, gatSus + inalt * 0.03);
  c.lineTo(-latCoada * 0.5, gatSus + inalt * 0.03);
  c.quadraticCurveTo(-latCoada * 0.8, gatSus + inalt * 0.02, -latCoada * 0.92, -inalt * 0.06);
  c.quadraticCurveTo(-latCoada * 1.1, -inalt * 0.36, 0, -inalt * 0.52);
  c.closePath();
  c.fill();
  creion(c, gr * 0.7);
  c.stroke();
  // gaura de agățat
  c.fillStyle = 'rgba(120, 100, 70, 0.55)';
  c.beginPath();
  c.arc(0, -inalt * 0.40, latCoada * 0.20, 0, Math.PI * 2);
  c.fill();
  creion(c, gr * 0.5, 'rgba(120,100,70,0.9)');
  c.stroke();

  // inelul de argint de la gât
  const met = c.createLinearGradient(-latCoada * 0.55, 0, latCoada * 0.55, 0);
  met.addColorStop(0, '#f2f5f8'); met.addColorStop(0.4, ARGINT_UNEALTA);
  met.addColorStop(1, '#7e858d');
  c.fillStyle = met;
  c.fillRect(-latCoada * 0.55, gatSus + inalt * 0.01, latCoada * 1.1, inalt * 0.045);
  creion(c, gr * 0.6);
  c.strokeRect(-latCoada * 0.55, gatSus + inalt * 0.01, latCoada * 1.1, inalt * 0.045);

  // gâtul îndoit
  creion(c, gr * 1.6, '#9aa1a8');
  c.beginPath();
  c.moveTo(0, gatSus + inalt * 0.055);
  c.quadraticCurveTo(lat * 0.10, gatJos - inalt * 0.01, -lat * 0.02, gatJos);
  c.stroke();

  // lama, mistrie subțire
  const latLama = lat * (0.34 + u.gros * 0.42);
  const varf = inalt * 0.52;
  const otel = c.createLinearGradient(-latLama, gatJos, latLama, varf);
  otel.addColorStop(0, '#f4f7fa');
  otel.addColorStop(0.45, OTEL_UNEALTA);
  otel.addColorStop(1, '#8d949b');
  c.fillStyle = otel;
  c.beginPath();
  c.moveTo(-lat * 0.02, gatJos);
  c.quadraticCurveTo(-latLama * 0.9, gatJos + inalt * 0.07, -latLama, gatJos + inalt * 0.14);
  c.quadraticCurveTo(-latLama * 0.6, varf, 0, varf);
  c.quadraticCurveTo(latLama * 0.6, varf, latLama, gatJos + inalt * 0.14);
  c.quadraticCurveTo(latLama * 0.9, gatJos + inalt * 0.07, -lat * 0.02, gatJos);
  c.closePath();
  c.fill();
  creion(c, gr * 0.7);
  c.stroke();
  // sclipirea de pe lamă
  c.strokeStyle = 'rgba(255,255,255,0.8)';
  c.lineWidth = Math.max(0.8, gr * 1.1);
  c.beginPath();
  c.moveTo(-latLama * 0.30, gatJos + inalt * 0.14);
  c.quadraticCurveTo(-latLama * 0.16, varf * 0.72, latLama * 0.06, varf * 0.86);
  c.stroke();
}

function deseneazaCercul(acum) {
  const g = geomSala8();
  const gr = Math.max(1, g.S * 0.0022);
  const cx = g.cercCx, cy = g.cercCy, R = g.cercR;

  ctx.save();
  for (let k = 0; k < CERC_CROMATIC.length; k++) {
    const a0 = (k / CERC_CROMATIC.length) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((k + 1) / CERC_CROMATIC.length) * Math.PI * 2 - Math.PI / 2;
    const aleasa = s8.culoare === k;
    const r = R * (aleasa ? 1.12 : 1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a0, a1);
    ctx.closePath();
    ctx.fillStyle = CERC_CROMATIC[k];
    ctx.fill();
    creion(ctx, aleasa ? gr * 2.4 : gr, aleasa ? LINIE_SALA : 'rgba(255,255,255,0.75)');
    ctx.stroke();
  }
  // golul din mijloc, în care se vede culoarea aleasă
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.34, 0, Math.PI * 2);
  ctx.fillStyle = CERC_CROMATIC[s8.culoare];
  ctx.fill();
  creion(ctx, gr * 1.6);
  ctx.stroke();
  ctx.restore();
}

/* ---------- PICĂTURILE ---------- */
/* Vopseaua e atât de groasă încât câteva picături grele se preling. Nu cad: se
   **târăsc**, cu opriri — o picătură de ulei care alunecă lin arată a apă. */
function facPicatura(x, y, culoare, lung) {
  s8.picaturi.push({
    x, y, culoare,
    lung: lung || Math.min(W, H) * (0.03 + Math.random() * 0.09),
    mers: 0, viteza: 0.00006 + Math.random() * 0.00012,
    lat: Math.min(W, H) * (0.004 + Math.random() * 0.006),
    stat: 0
  });
}

function actualizeazaPicaturile(dt) {
  for (let k = s8.picaturi.length - 1; k >= 0; k--) {
    const p = s8.picaturi[k];
    if (p.stat > 0) { p.stat -= dt; continue; }
    p.mers += p.viteza * dt * (1 + s8.diluare * 6);
    if (Math.random() < 0.004) p.stat = 200 + Math.random() * 900;
    if (p.mers >= 1) s8.picaturi.splice(k, 1);
  }
}

function deseneazaPicaturile() {
  ctx.save();
  for (const p of s8.picaturi) {
    const cap = p.y + p.lung * p.mers;
    ctx.strokeStyle = p.culoare;
    ctx.globalAlpha = (1 - p.mers * 0.4) * (1 - s8.diluare * 0.6);
    ctx.lineWidth = p.lat;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, cap);
    ctx.stroke();
    ctx.fillStyle = p.culoare;
    ctx.beginPath();
    ctx.ellipse(p.x, cap, p.lat * 0.85, p.lat * 1.25, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- TUȘA JUCĂTORULUI ---------- */
/* Se pune pe stratul ascuns, o singură dată, și rămâne acolo. Forma ei ține de
   unealta din mână: pensula lasă o urmă cu fire, cuțitul o lopată cu muchii
   drepte. Dacă toate ar lăsa aceeași pată, alegerea uneltei ar fi un decor. */
/* Conturul unei pete, după felul uneltei. `z` e zvâcnetul: aceleași numere mici
   trase la sorți din locul petei, ca să nu iasă două pete identice, dar nici să
   nu tremure de la un cadru la altul.

   — **ascuțit**: se umflă la mijloc și se subțiază în amândouă capetele, cu un
     vârf lung înainte. Așa lasă o pensulă rotundă, care are păr până la un fir.
   — **pătrat**: capete tăiate drept, laturi aproape paralele, colțuri abia
     strâmbe. Așa lasă o pensulă cu vârful retezat.
   — **cuțit**: o lopată — muchie dreaptă și lungă pe o parte, material împins
     grămadă pe cealaltă, cu colțurile ridicate. */
function traseulUneltei(c, forma, L, G, z) {
  c.beginPath();
  if (forma === 'ascutit') {
    c.moveTo(-L * (1 + z(0) * 0.1), G * (z(1) - 0.5) * 0.3);
    c.quadraticCurveTo(-L * 0.35, -G * (0.9 + z(2) * 0.35),
                       L * 0.2, -G * (0.75 + z(3) * 0.3));
    c.quadraticCurveTo(L * 0.75, -G * (0.4 + z(4) * 0.25),
                       L * (1.15 + z(5) * 0.2), G * (z(6) - 0.5) * 0.25);
    c.quadraticCurveTo(L * 0.75, G * (0.4 + z(7) * 0.25),
                       L * 0.2, G * (0.75 + z(8) * 0.3));
    c.quadraticCurveTo(-L * 0.35, G * (0.9 + z(9) * 0.35),
                       -L * (1 + z(0) * 0.1), G * (z(1) - 0.5) * 0.3);
  } else if (forma === 'patrat') {
    c.moveTo(-L, -G * (0.9 + z(0) * 0.2));
    c.lineTo(L * (0.96 + z(1) * 0.08), -G * (0.86 + z(2) * 0.24));
    c.lineTo(L * (1.0 + z(3) * 0.06), G * (0.9 + z(4) * 0.2));
    c.lineTo(-L * (0.98 + z(5) * 0.06), G * (0.86 + z(6) * 0.24));
    c.closePath();
  } else {
    c.moveTo(-L * (1 + z(0) * 0.12), -G * (0.55 + z(1) * 0.3));
    c.lineTo(L * (0.55 + z(2) * 0.25), -G * (0.95 + z(3) * 0.25));
    c.lineTo(L * (1.05 + z(4) * 0.12), -G * (0.15 + z(5) * 0.35));
    c.lineTo(L * (0.95 + z(6) * 0.15), G * (0.55 + z(7) * 0.35));
    c.lineTo(-L * (0.1 + z(8) * 0.3), G * (1.0 + z(9) * 0.25));
    c.lineTo(-L * (0.85 + z(10) * 0.2), G * (0.75 + z(11) * 0.3));
    c.closePath();
  }
}

/* O pată de pastă pusă cu o unealtă anume. E soră cu `pataDePasta` din sala
   focului, dar cu conturul ales după unealtă și cu creasta pe măsura ei. */
function pastaCuUnealta(c, x, y, lung, gros, unghi, culoare, forma, relief) {
  const L = Math.max(1, lung / 2), G = Math.max(0.6, gros / 2);
  const z = function (i) { return zvacnet(x, y, i); };

  c.save();
  c.translate(x, y);
  c.rotate(unghi);

  traseulUneltei(c, forma, L, G, z);
  c.fillStyle = culoare;
  c.fill();

  /* Creasta și umbra stau înăuntrul petei, ca să urmeze muchia ei strâmbă. Se
     fac din același contur, mutat puțin, trasat gros și tăiat la forma petei:
     din tot conturul mutat rămâne numai dunga care cade pe muchie. */
  c.save();
  traseulUneltei(c, forma, L, G, z);
  c.clip();
  c.save();
  c.translate(0, G * 0.55);
  traseulUneltei(c, forma, L, G, z);
  c.restore();
  c.strokeStyle = 'rgba(255, 255, 255, ' + (0.30 * relief).toFixed(3) + ')';
  c.lineWidth = G * 0.36;
  c.stroke();
  c.save();
  c.translate(0, -G * 0.55);
  traseulUneltei(c, forma, L, G, z);
  c.restore();
  c.strokeStyle = 'rgba(20, 12, 6, ' + (0.24 * relief).toFixed(3) + ')';
  c.lineWidth = G * 0.30;
  c.stroke();
  c.restore();

  c.restore();
}

function lasaTusa(x, y, unghi, marime) {
  const c = stratul().getContext('2d');
  const u = USTENSILE[s8.unealta % USTENSILE.length];
  const culoare = CERC_CROMATIC[s8.culoare % CERC_CROMATIC.length];

  const lung = marime * u.lung * (0.85 + Math.random() * 0.3);
  const gros = marime * u.gros * (0.85 + Math.random() * 0.3);

  c.save();
  c.globalAlpha = 1;
  pastaCuUnealta(c, x, y, lung, gros, unghi, culoare, u.forma, u.relief);

  if (u.cutit) {
    /* Cuțitul de paletă nu trage o dungă, **întinde un strat**: pe lângă lopata
       cea mare mai lasă câteva alături, împinse în lături, cu marginea
       neregulată. De-aia `pasta` e trei-patru la cuțite și unu la pensule —
       diferența de densitate se vede tocmai din câtă materie rămâne pe perete. */
    for (let k = 0; k < u.pasta; k++) {
      const q = (Math.random() - 0.5) * 0.9;
      const lateral = (Math.random() - 0.5) * gros * 0.8;
      pastaCuUnealta(c,
        x + Math.cos(unghi) * lung * q - Math.sin(unghi) * lateral,
        y + Math.sin(unghi) * lung * q + Math.cos(unghi) * lateral,
        lung * (0.55 + Math.random() * 0.55), gros * (0.55 + Math.random() * 0.6),
        unghi + (Math.random() - 0.5) * 0.35, culoare, u.forma, u.relief);
    }
  } else {
    // firele de păr: dâre subțiri de-a lungul tușei
    c.globalAlpha = 0.5;
    for (let k = -u.fire; k <= u.fire; k += 2) {
      const d = k * gros * 0.1;
      c.strokeStyle = k % 4 ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.14)';
      c.lineWidth = Math.max(0.7, gros * 0.06);
      c.beginPath();
      c.moveTo(x - Math.cos(unghi) * lung * 0.42 - Math.sin(unghi) * d,
               y - Math.sin(unghi) * lung * 0.42 + Math.cos(unghi) * d);
      c.lineTo(x + Math.cos(unghi) * lung * 0.42 - Math.sin(unghi) * d,
               y + Math.sin(unghi) * lung * 0.42 + Math.cos(unghi) * d);
      c.stroke();
    }
    c.globalAlpha = 1;
  }
  c.restore();

  s8.tuseFacute++;
  /* Cuțitul cu pastă groasă scapă mai des pe jos decât o pensulă subțire. */
  if (Math.random() < 0.25 * u.pasta) {
    facPicatura(x + (Math.random() - 0.5) * gros, y + gros * 0.4, culoare);
  }
  acoperaPelerina(x, y, Math.max(lung, gros) * 0.55);
}

/* Ce ochiuri ale pelerinei a acoperit tușa. Se socotește pe rețea, nu pe pixeli. */
function acoperaPelerina(x, y, raza) {
  if (s8.acoperit >= 1) return;
  const g = geomSala8();
  if (x < g.pelCx - g.pelLat - raza || x > g.pelCx + g.pelLat + raza ||
      y < g.pelSus - raza || y > g.pelJos + raza) return;
  let atinse = 0, cate = 0, dinTotal = 0;
  for (let i = 0; i < OCHIURI_PELERINA; i++) {
    for (let j = 0; j < OCHIURI_PELERINA; j++) {
      const k = i * OCHIURI_PELERINA + j;
      const st = s8.celule[k];
      if (st === null || st === undefined) continue;
      dinTotal++;
      if (!st) {
        const o = ochiulPelerinei(i, j);
        if (Math.hypot(x - o.x, y - o.y) < raza) { s8.celule[k] = true; atinse++; }
      }
      if (s8.celule[k]) cate++;
    }
  }
  if (!atinse || !dinTotal) return;
  s8.acoperit = cate / dinTotal;
  if (audio) sunetPlescait();
}

/* ---------- TRAPA DE SUB PODIUM ---------- */
/* Când pelerina e acoperită de tot, vopseaua nu mai stă: podiumul se desface și
   culoarea se scurge în gaura de sub el.

   E singurul lucru care putea urma. Vopseaua de ulei e grea și udă; dacă pui
   destulă într-un loc, curge — iar dacă locul e un podium cu o trapă dedesubt,
   curge acolo. Iar ce e dedesubt e apă: uleiul diluat devine acuarelă, adică
   sala următoare. */
function facPerdeaua() {
  const g = geomSala8();
  const x = Math.round(g.pelCx - g.pelLat);
  const y = Math.round(g.pelSus);
  const w = Math.round(g.pelLat * 2), h = Math.round(g.pelInalt * 1.06);
  const p = document.createElement('canvas');
  p.width = Math.max(2, w); p.height = Math.max(2, h);
  const c = p.getContext('2d');
  c.drawImage(pregatesteSalaUlei(), x, y, w, h, 0, 0, w, h);
  c.drawImage(stratul(), x, y, w, h, 0, 0, w, h);
  s8.perdea = { panza: p, x, y, w, h };
}

function deseneazaTrapa(acum) {
  if (s8.scurgere <= 0) return;
  const g = geomSala8();
  const p = atenuare(Math.min(1, s8.scurgere));

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(g.podiumCx, g.podiumCy, g.podiumRx * 0.9 * p, g.podiumRy * 0.9 * p,
              0, 0, Math.PI * 2);
  ctx.save();
  ctx.clip();
  const adanc = ctx.createLinearGradient(0, g.podiumCy - g.podiumRy, 0, g.podiumCy + g.podiumRy);
  adanc.addColorStop(0, '#14100a');
  adanc.addColorStop(0.5, '#2a2016');
  adanc.addColorStop(1, '#0c0906');
  ctx.fillStyle = adanc;
  ctx.fillRect(g.podiumCx - g.podiumRx, g.podiumCy - g.podiumRy * 2,
               g.podiumRx * 2, g.podiumRy * 4);

  /* Apa de dedesubt: pete pastelate care se mișcă încet, tot mai luminoase pe
     măsură ce trapa se deschide. Ea e chiar începutul sălii a noua, văzut de
     sus, prin gaură. */
  const lumina = Math.max(0, p - 0.3) / 0.7;
  if (lumina > 0) {
    const PASTEL = ['#cfe0f0', '#dff0e2', '#f6e6c0', '#e4d6f0', '#f6c9c0'];
    for (let k = 0; k < 12; k++) {
      const a = samanta(13100 + k * 3.7), b = samanta(13170 + k * 6.1);
      const x = g.podiumCx + (a - 0.5) * g.podiumRx * 1.4 +
                Math.sin(acum * 0.0006 + k) * g.podiumRx * 0.1;
      const y = g.podiumCy + (b - 0.5) * g.podiumRy * 1.4;
      const raza = g.podiumRx * (0.14 + b * 0.24);
      const bal = ctx.createRadialGradient(x, y, 0, x, y, raza);
      const cul = PASTEL[Math.floor(a * PASTEL.length)];
      bal.addColorStop(0, cul);
      bal.addColorStop(1, cul + '00');
      ctx.globalAlpha = 0.55 * lumina;
      ctx.fillStyle = bal;
      ctx.beginPath();
      ctx.arc(x, y, raza, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  creion(ctx, Math.max(2, g.S * 0.005));
  ctx.stroke();

  /* Pelerina, cu vopseaua ta pe ea, se lasă în gaură: poza ei alunecă în jos și
     se strânge, ca o stofă trasă printr-o pâlnie. Ce curge e chiar munca ta. */
  if (s8.perdea && p < 1) {
    const pd = s8.perdea;
    const dy = Math.pow(p, 1.6) * (g.podiumCy - pd.y);
    const strans = 1 - Math.pow(p, 1.3) * 0.8;
    ctx.save();
    ctx.globalAlpha = 1 - p * 0.25;
    ctx.drawImage(pd.panza, pd.x + pd.w * (1 - strans) * 0.5, pd.y + dy,
                  pd.w * strans, pd.h * (1 - Math.pow(p, 1.5) * 0.6));
    ctx.restore();
  }

  // firele de culoare care se preling în gaură, înaintea restului
  for (let k = 0; k < 18; k++) {
    const z = samanta(13300 + k * 5.7), z2 = samanta(13360 + k * 3.9);
    const cat = Math.max(0, Math.min(1, (p - z2 * 0.3) / 0.7));
    if (cat <= 0) continue;
    const x = g.podiumCx + (z - 0.5) * g.podiumRx * 1.5;
    const de = g.podiumCy - g.podiumRy * 0.6;
    const lung = g.podiumRy * (1.2 + z2 * 2) * cat;
    ctx.strokeStyle = CERC_CROMATIC[Math.floor(z * CERC_CROMATIC.length)];
    ctx.globalAlpha = 0.9 * (1 - cat * 0.3);
    ctx.lineWidth = g.podiumRx * (0.014 + z2 * 0.03);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, de - lung * 0.2);
    ctx.lineTo(x, de + lung);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- CURSORUL ---------- */
/* Unealta din mână, desenată la vârful degetului, cu culoarea aleasă în capăt.
   Cursorul obișnuit — luminița caldă — n-ar spune nici cu ce lucrezi, nici cu ce
   culoare, adică tocmai cele două lucruri pe care le-ai ales. */
function cursorulScenei8() {
  if (stare !== 'ulei') return false;
  if (cursor.x < -100) return true;
  const g = geomSala8();
  const inalt = g.S * 0.11;

  ctx.save();
  ctx.translate(cursor.x, cursor.y);
  ctx.rotate(-0.5);
  ctx.translate(0, -inalt * 0.5);
  deseneazaUnealta(ctx, s8.unealta, 0, 0, inalt, Math.max(1.2, g.S * 0.003));
  ctx.restore();

  ctx.save();
  ctx.fillStyle = CERC_CROMATIC[s8.culoare];
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.ellipse(cursor.x, cursor.y, g.S * 0.012, g.S * 0.016, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  return true;
}

/* ---------- VAPORII DE LA INTRARE ---------- */
/* Mirosul nu se poate da printr-un ecran, dar se poate **spune** — și tocmai
   asta e gluma: un senzor olfactiv simulat, adică o etichetă de muzeu pentru
   ceva ce n-are cum să ajungă la tine. */
function deseneazaVaporii(acum) {
  if (s8.vapori <= 0.01) return;
  const g = geomSala8();
  const p = s8.vapori;
  ctx.save();
  for (let k = 0; k < 22; k++) {
    const a = samanta(11700 + k * 3.7), b = samanta(11770 + k * 5.9);
    const urcare = ((acum * (0.00004 + a * 0.00007) + b) % 1);
    const x = W * a + Math.sin(acum * 0.0006 + k) * W * 0.04;
    const y = intre(H * 1.02, H * 0.2, urcare);
    const raza = g.S * (0.06 + b * 0.12) * (0.5 + urcare);
    ctx.globalAlpha = 0.08 * p * Math.sin(Math.min(1, urcare * 1.4) * Math.PI * 0.9);
    const abur = ctx.createRadialGradient(x, y, 0, x, y, raza);
    abur.addColorStop(0, 'rgba(200, 186, 158, 0.9)');
    abur.addColorStop(1, 'rgba(200, 186, 158, 0)');
    ctx.fillStyle = abur;
    ctx.beginPath();
    ctx.arc(x, y, raza, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- VORBELE SĂLII ---------- */
function spuneScena8(text, cat, cursiv) {
  s8.vorba = { text, pana: performance.now() + (cat || 4600), cursiv: !!cursiv };
}

function deseneazaVorba8(acum) {
  if (!s8.vorba || acum > s8.vorba.pana) return;
  const g = geomSala8();
  const stinge = Math.min(1, (s8.vorba.pana - acum) / 700);
  const lat = Math.min(W * 0.46, ecran(500));
  const y = H * 0.045;

  ctx.save();
  ctx.globalAlpha = stinge * 0.94;
  ctx.fillStyle = 'rgba(255, 253, 248, 0.95)';
  ctx.fillRect(W * 0.5 - lat / 2, y - H * 0.026, lat, H * 0.058);
  creion(ctx, Math.max(1, g.S * 0.002));
  ctx.strokeRect(W * 0.5 - lat / 2, y - H * 0.026, lat, H * 0.058);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = stinge;
  textIncadrat(s8.vorba.text, W * 0.5, y - H * 0.012, lat - ecran(40), ecran(22),
               `${s8.vorba.cursiv ? 'italic' : 'bold'} ${Math.max(Math.round(ecran(11)), Math.round(g.S * 0.019))}px Georgia`,
               LINIE_SALA);
  ctx.restore();
}

/* ---------- INTRAREA ---------- */
function intraInUlei(acum) {
  stare = 'ulei';
  s8.faza = 'intrare'; s8.t0 = acum; s8.ultimulCadru = acum;
  s8.vapori = 1; s8.unealta = 1; s8.culoare = 4;
  s8.acoperit = 0; s8.scurgere = 0; s8.perdea = null;
  s8.picaturi.length = 0; s8.tuseFacute = 0; s8.diluare = 0;
  s8.aSpusTrapa = false; s8.vorba = null; s8.ultimaTusa = 0;
  const c = stratul().getContext('2d');
  c.clearRect(0, 0, W, H);
  pregatesteSalaUlei();
  pregatesteOchiurile();
  opresteTurbina();
  opresteClipocitul();
  pornesteAtelierUlei();
  if (audio) sunetPortal();
  spuneScena8('[Senzor olfactiv simulat: Aromă densă de ulei de in, ' +
              'esență de terebentină și sicativ]', 7000, true);
}

function iesiDinUlei(acum) {
  /* Trapa duce în sala a noua, a acuarelei. Ea încă nu e făcută, așa că
     deocamdată te scoate înapoi la custode — dar drumul e croit, ca la arsură și
     ca la vârtej, și când va fi, aici se schimbă un singur rând. */
  opresteAtelierUlei();
  opresteClipocitul();
  s3.vizitat = true;
  stare = 'muzeu';
  faza3('usaDeschisa');
  s3.usa = 1; s3.chemare = 0; s3.aSunatChemarea = false;
  actiune3(acum);
  pornesteNatura(false);
}

/* ---------- CE SE ÎNTÂMPLĂ LA ATINGERE ---------- */
/* Care unealtă e sub deget. Fără casetă nu mai există un dreptunghi în care să
   cazi, așa că se caută cea mai apropiată — dar numai dacă degetul e destul de
   aproape de ea. Altfel, orice atingere din colțul din stânga sus ar schimba
   pensula fără să vrei, chiar când voiai să pictezi acolo. */
function peTrusa(x, y) {
  const locuri = locurileUneltelor();
  let cea = -1, ceaMai = Infinity;
  for (let k = 0; k < locuri.length; k++) {
    const L = locuri[k];
    const dx = x - L.x, dy = y - L.y;
    // unealta e înaltă și îngustă: cercul de prindere se turtește pe lățime
    const d = Math.hypot(dx / (L.inalt * 0.22), dy / (L.inalt * 0.58));
    if (d < ceaMai) { ceaMai = d; cea = k; }
  }
  return ceaMai <= 1 ? cea : -1;
}

function peCerc(x, y) {
  const g = geomSala8();
  if (Math.hypot(x - g.cercCx, y - g.cercCy) > g.cercR * 1.14) return -1;
  let a = Math.atan2(y - g.cercCy, x - g.cercCx) + Math.PI / 2;
  while (a < 0) a += Math.PI * 2;
  return Math.floor((a / (Math.PI * 2)) * CERC_CROMATIC.length) % CERC_CROMATIC.length;
}

function click8(acum) {
  const x = cursor.x, y = cursor.y;
  if (s8.faza === 'scurgere' || s8.faza === 'diluare' || s8.faza === 'iesire') return;

  const u = peTrusa(x, y);
  if (u >= 0) {
    s8.unealta = u;
    if (audio) sunetCleios();
    spuneScena8('Ai luat: ' + USTENSILE[u].nume + '.', 2600);
    return;
  }
  const k = peCerc(x, y);
  if (k >= 0) {
    s8.culoare = k;
    if (audio) sunetPlescait();
    return;
  }

  /* Oriunde altundeva: pui pastă. Peste tot, nu numai pe pelerină — sala e a ta,
     iar dacă vopseaua s-ar prinde doar pe exponat, „spațiul este pânza ta" ar fi
     o vorbă goală. Numai că acoperirea se socotește pe pelerină: ea e lucrarea
     neterminată, iar restul e al tău. */
  puneTusa(x, y, acum);
}

function puneTusa(x, y, acum) {
  const g = geomSala8();
  const unghi = (samanta(Math.round(x) * 3.1 + Math.round(y) * 7.7) - 0.5) * 3.14;
  lasaTusa(x, y, unghi, g.S * 0.055);
  s8.ultimaTusa = acum;
  if (audio) {
    if (s8.tuseFacute % 3 === 0) sunetSlosh(); else sunetCleios();
  }
  if (s8.faza === 'intrare') { s8.faza = 'pictezi'; s8.t0 = acum; }
}

/* Mâna trasă cu butonul apăsat: dâra continuă. Fără ea, „lasă-ți amprenta" ar fi
   însemnat o sută de clicuri — o corvoadă, nu o libertate. */
function pensuleazaScena8() {
  if (stare !== 'ulei' || !cursor.apasat) return;
  if (s8.faza === 'scurgere' || s8.faza === 'diluare' || s8.faza === 'iesire') return;
  const acum = performance.now();
  if (acum - s8.ultimaTusa < 45) return;
  if (peTrusa(cursor.x, cursor.y) >= 0 || peCerc(cursor.x, cursor.y) >= 0) return;
  puneTusa(cursor.x, cursor.y, acum);
}

/* ---------- CEASUL SCENEI ---------- */
function actualizeazaUleiul(acum) {
  const dt = Math.max(0, Math.min(100, acum - (s8.ultimulCadru || acum)));
  s8.ultimulCadru = acum;
  tinePicaturileDeUlei();
  tineClipocitul();
  actualizeazaPicaturile(dt);
  s8.vapori = Math.max(0.1, s8.vapori - dt / 9000);

  if (s8.faza === 'pictezi') {
    if (s8.acoperit >= 1) {
      facPerdeaua();
      s8.faza = 'scurgere'; s8.t0 = acum; s8.scurgere = 0.001;
      if (audio) { sunetSlosh(); sunetPlescait(); }
      spuneScena8('Pelerina e acoperită. Culoarea nu mai stă — se scurge.', 6000);
    } else if (!s8.aSpusTrapa && s8.tuseFacute === 12) {
      s8.aSpusTrapa = true;
      spuneScena8('Acoperă pelerina de tot: ea e lucrarea neterminată.', 6000);
    }
  }

  if (s8.faza === 'scurgere') {
    s8.scurgere = Math.min(1, s8.scurgere + dt / 3400);
    if (Math.random() < dt / 80) {
      const g = geomSala8();
      facPicatura(g.podiumCx + (Math.random() - 0.5) * g.podiumRx * 1.6, g.podiumCy,
                  CERC_CROMATIC[Math.floor(Math.random() * CERC_CROMATIC.length)],
                  g.S * (0.02 + Math.random() * 0.05));
    }
    if (s8.scurgere >= 1) {
      s8.faza = 'diluare'; s8.t0 = acum;
      if (audio) { opresteAtelierUlei(); pornesteClipocitul(); }
      /* Aici nu se mai scrie nimic. Culoarea curge prin trapă, se aude apa, iar
         imaginea se înmoaie sub ochii tăi — un rând care ar spune „cobori în apă,
         culorile se desfac" ar traduce în cuvinte exact lucrul pe care tocmai îl
         vezi întâmplându-se. Ce se poate arăta nu se scrie. */
    }
  }

  if (s8.faza === 'diluare') {
    s8.diluare = Math.min(1, s8.diluare + dt / 4200);
    if (s8.diluare >= 1) { s8.faza = 'iesire'; s8.t0 = acum; }
  }
  if (s8.faza === 'iesire' && acum - s8.t0 > 900) iesiDinUlei(acum);
}

/* ---------- DILUAREA ---------- */
/* Sfârșitul scenei, și puntea spre acuarelă. Marginile dure ale tușelor se
   înmoaie, culorile se lasă în apă și se răspândesc una într-alta.

   Se face cu o singură unealtă: pânza pictată se micșorează pe o pânză de lucru
   și se întinde la loc. Fiecare trecere pierde muchiile — asta **e** înmuierea,
   nu o imitație a ei. */
const panzaDiluata = { panza: null, latime: 0, inaltime: 0 };

function deseneazaDiluarea(acum) {
  const p = atenuare(Math.min(1, s8.diluare));
  const lw = Math.max(2, Math.round(W / (1 + p * 22)));
  const lh = Math.max(2, Math.round(H / (1 + p * 22)));
  const q = panzaDeLucru(panzaDiluata, lw, lh);
  const qc = q.getContext('2d');
  qc.clearRect(0, 0, lw, lh);
  qc.drawImage(stratul(), 0, 0, lw, lh);

  ctx.save();
  ctx.drawImage(q, 0, 0, W, H);

  const PASTEL = ['#f6c9c0', '#cfe0f0', '#dff0e2', '#f6e6c0', '#e4d6f0'];
  for (let k = 0; k < 26; k++) {
    const a = samanta(11900 + k * 3.7), b = samanta(11970 + k * 6.1);
    const e = samanta(12030 + k * 4.3);
    const x = W * a + Math.sin(acum * 0.0004 + k) * W * 0.05 * p;
    const y = H * b + Math.cos(acum * 0.0003 + k * 1.7) * H * 0.05 * p;
    const raza = Math.min(W, H) * (0.1 + e * 0.3) * (0.3 + p);
    const bal = ctx.createRadialGradient(x, y, 0, x, y, raza);
    const cul = PASTEL[Math.floor(e * PASTEL.length)];
    bal.addColorStop(0, cul);
    bal.addColorStop(1, cul + '00');
    ctx.globalAlpha = 0.16 * p;
    ctx.fillStyle = bal;
    ctx.beginPath();
    ctx.arc(x, y, raza, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = Math.pow(p, 2.2) * 0.9;
  ctx.fillStyle = '#f4f1e8';
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- DESENUL ---------- */
function deseneazaScena8(t, acum) {
  const g = geomSala8();

  ctx.drawImage(pregatesteSalaUlei(), 0, 0);

  if (s8.faza === 'diluare' || s8.faza === 'iesire') {
    deseneazaDiluarea(acum);
  } else {
    // ce a pictat jucătorul, peste desenul în linie
    ctx.drawImage(stratul(), 0, 0);
    deseneazaTrapa(acum);
    deseneazaPicaturile();
    deseneazaTrusa(acum);
    deseneazaCercul(acum);
  }

  deseneazaVaporii(acum);
  deseneazaVorba8(acum);

  /* Cât din pelerină ai acoperit — o bară subțire sub podium. Fără ea, „acoperă
     pelerina" e o poruncă fără răspuns: colorezi și nu știi cât mai ai. */
  if (s8.faza === 'pictezi' && s8.tuseFacute > 3) {
    const lat = g.podiumRx * 1.4, x = g.podiumCx - lat / 2, y = H * 0.965;
    ctx.save();
    ctx.fillStyle = 'rgba(40, 36, 30, 0.12)';
    ctx.fillRect(x, y, lat, H * 0.012);
    ctx.fillStyle = CERC_CROMATIC[s8.culoare];
    ctx.fillRect(x, y, lat * s8.acoperit, H * 0.012);
    creion(ctx, Math.max(1, g.S * 0.0018));
    ctx.strokeRect(x, y, lat, H * 0.012);
    ctx.restore();
  }
}
