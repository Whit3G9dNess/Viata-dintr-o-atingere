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

const LINIE_SALA    = '#2f2a24';   // creionul cu care e desenată sala
const LINIE_SUBTIRE = '#6b6254';
const HARTIE        = '#faf7f0';   // fondul: hârtia pe care s-a desenat

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
const USTENSILE = [
  { nume: 'pensulă rotundă', lung: 1.5, gros: 0.30, fire: 2, cutit: false },
  { nume: 'pensulă lată',    lung: 1.3, gros: 0.70, fire: 5, cutit: false },
  { nume: 'pensulă de tuș',  lung: 2.1, gros: 0.16, fire: 1, cutit: false },
  { nume: 'bidinea',         lung: 1.1, gros: 1.15, fire: 8, cutit: false },
  { nume: 'cuțit ascuțit',   lung: 1.7, gros: 0.42, fire: 0, cutit: true },
  { nume: 'cuțit lat',       lung: 1.2, gros: 0.95, fire: 0, cutit: true }
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
  const pelLat = podiumRx * 0.92;
  const pelSus = H * 0.275;
  const pelJos = podiumCy + podiumRy * 0.15;

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
    cercCy: H * 0.09 + trusaInalt + cercR + H * 0.035,
    cercR,

    // fișa de sală, pe peretele din fund, sus în dreapta
    fisaX: W * 0.70, fisaY: H * 0.175,
    fisaLat: Math.min(W * 0.265, S * 0.52), fisaInalt: H * 0.38,

    // vitrinele, la stânga și la dreapta podiumului
    vitrinaLat: Math.min(W * 0.105, S * 0.19),
    vitrinaSus: H * 0.40, vitrinaJos: H * 0.70,
    vitrinaStX: W * 0.145, vitrinaDrX: W * 0.855
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

  c.fillStyle = HARTIE;
  c.fillRect(0, 0, W, H);
  // o umbră foarte slabă în colțuri, cât să nu fie o coală moartă
  const colt = c.createRadialGradient(W * 0.5, H * 0.45, g.S * 0.3,
                                      W * 0.5, H * 0.45, Math.max(W, H) * 0.78);
  colt.addColorStop(0, 'rgba(0,0,0,0)');
  colt.addColorStop(1, 'rgba(90, 80, 64, 0.13)');
  c.fillStyle = colt;
  c.fillRect(0, 0, W, H);

  peretiiSalii(c, g, gr);
  vitrinaCuVaza(c, g, g.vitrinaStX, gr);
  vitrinaCuVaza(c, g, g.vitrinaDrX, gr);
  podiumulCuFunii(c, g, gr);
  pelerinaInLinie(c, g, gr);
  fisaDeSala8(c, g, gr);
}

/* Peretele din fund, cu firidă în mijloc, pilaștri și lambriu; tavanul cu
   cornișă; podeaua cu dalele ei în perspectivă. E o sală de muzeu clasic —
   aceeași care se vede în orice pinacotecă. */
function peretiiSalii(c, g, gr) {
  creion(c, gr * 1.6);
  c.beginPath();
  c.moveTo(0, g.podea); c.lineTo(W, g.podea);
  c.moveTo(0, g.cornisa); c.lineTo(W, g.cornisa);
  c.stroke();

  // cornișa: trei brâuri paralele, ca la orice sală cu stuc
  creion(c, gr);
  for (const dy of [-H * 0.022, -H * 0.038, H * 0.012]) {
    c.beginPath();
    c.moveTo(0, g.cornisa + dy); c.lineTo(W, g.cornisa + dy);
    c.stroke();
  }
  // casetele tavanului, care fug spre mijloc
  for (let k = 0; k <= 10; k++) {
    const x = W * k / 10;
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(intre(x, W * 0.5, 0.35), g.cornisa - H * 0.038);
    c.stroke();
  }

  // lambriul de jos, de-a lungul peretelui
  creion(c, gr * 1.2);
  c.beginPath();
  c.moveTo(0, g.podea - H * 0.075); c.lineTo(W, g.podea - H * 0.075);
  c.stroke();

  /* Pilaștrii: patru, doi de-o parte și de alta a firidei. Fiecare cu capitel și
     cu caneluri — trei linii verticale, atât e nevoie ca ochiul să citească
     „coloană". */
  for (const px of [W * 0.075, W * 0.30, W * 0.70, W * 0.925]) {
    const lat = W * 0.036;
    creion(c, gr * 1.3);
    c.beginPath();
    c.rect(px - lat / 2, g.cornisa + H * 0.012, lat, g.podea - g.cornisa - H * 0.012);
    c.stroke();
    c.beginPath();
    c.moveTo(px - lat * 0.8, g.cornisa + H * 0.05);
    c.lineTo(px + lat * 0.8, g.cornisa + H * 0.05);
    c.moveTo(px - lat * 0.72, g.cornisa + H * 0.036);
    c.lineTo(px + lat * 0.72, g.cornisa + H * 0.036);
    c.stroke();
    creion(c, gr * 0.7, LINIE_SUBTIRE);
    for (const q of [-0.25, 0, 0.25]) {
      c.beginPath();
      c.moveTo(px + lat * q, g.cornisa + H * 0.06);
      c.lineTo(px + lat * q, g.podea - H * 0.075);
      c.stroke();
    }
  }

  /* Firida din mijloc: o arcadă în peretele din fund, în care stă pelerina. Ea
     spune „exponatul e aici", fără nicio săgeată. */
  const fx = W * 0.5, fw = W * 0.30, fSus = g.cornisa + H * 0.055, fJos = g.podea;
  creion(c, gr * 1.5);
  c.beginPath();
  c.moveTo(fx - fw / 2, fJos);
  c.lineTo(fx - fw / 2, fSus + fw * 0.42);
  c.quadraticCurveTo(fx - fw / 2, fSus, fx, fSus);
  c.quadraticCurveTo(fx + fw / 2, fSus, fx + fw / 2, fSus + fw * 0.42);
  c.lineTo(fx + fw / 2, fJos);
  c.stroke();
  creion(c, gr * 0.9, LINIE_SUBTIRE);
  c.beginPath();
  c.moveTo(fx - fw * 0.44, fJos);
  c.lineTo(fx - fw * 0.44, fSus + fw * 0.42);
  c.quadraticCurveTo(fx - fw * 0.44, fSus + fw * 0.05, fx, fSus + fw * 0.05);
  c.quadraticCurveTo(fx + fw * 0.44, fSus + fw * 0.05, fx + fw * 0.44, fSus + fw * 0.42);
  c.lineTo(fx + fw * 0.44, fJos);
  c.stroke();

  /* Podeaua: dale în perspectivă, care fug spre punctul de fugă. Puține și
     subțiri — o podea desenată prea apăsat trage ochiul în jos, iar aici ochiul
     are treabă în mijloc. */
  creion(c, gr * 0.7, LINIE_SUBTIRE);
  for (let k = -7; k <= 7; k++) {
    c.beginPath();
    c.moveTo(W * 0.5 + k * W * 0.075, g.podea);
    c.lineTo(W * 0.5 + k * W * 0.30, H * 1.02);
    c.stroke();
  }
  for (let k = 1; k <= 5; k++) {
    const y = intre(g.podea, H * 1.02, Math.pow(k / 5, 1.7));
    c.beginPath();
    c.moveTo(0, y); c.lineTo(W, y);
    c.stroke();
  }
}

/* O vitrină de sticlă cu o vază pe soclu. Nu e ornament: ea spune că ești
   într-un muzeu, și tocmai de-aia mânjitul pereților are haz. */
function vitrinaCuVaza(c, g, cx, gr) {
  const lat = g.vitrinaLat, sus = g.vitrinaSus, jos = g.vitrinaJos;
  creion(c, gr * 1.2);

  const adanc = lat * 0.24;
  c.beginPath();
  c.rect(cx - lat / 2, sus, lat, jos - sus);
  c.stroke();
  c.beginPath();
  c.moveTo(cx - lat / 2, sus); c.lineTo(cx - lat / 2 + adanc, sus - adanc * 0.5);
  c.lineTo(cx + lat / 2 + adanc, sus - adanc * 0.5); c.lineTo(cx + lat / 2, sus);
  c.moveTo(cx + lat / 2, jos); c.lineTo(cx + lat / 2 + adanc, jos - adanc * 0.5);
  c.lineTo(cx + lat / 2 + adanc, sus - adanc * 0.5);
  c.stroke();

  creion(c, gr * 1.3);
  c.beginPath();
  c.rect(cx - lat * 0.42, jos, lat * 0.84, H * 0.055);
  c.stroke();

  /* Vaza: gât strâmt, pântec rotund, picior. Trei curbe și o linie — de departe
     e o siluetă care se recunoaște. */
  const vSus = sus + (jos - sus) * 0.22, vJos = jos - (jos - sus) * 0.08;
  const vLat = lat * 0.30;
  creion(c, gr);
  c.beginPath();
  c.moveTo(cx - vLat * 0.34, vSus);
  c.quadraticCurveTo(cx - vLat * 0.2, vSus + (vJos - vSus) * 0.14, cx - vLat, vSus + (vJos - vSus) * 0.44);
  c.quadraticCurveTo(cx - vLat * 1.05, vJos - (vJos - vSus) * 0.14, cx - vLat * 0.4, vJos);
  c.lineTo(cx + vLat * 0.4, vJos);
  c.quadraticCurveTo(cx + vLat * 1.05, vJos - (vJos - vSus) * 0.14, cx + vLat, vSus + (vJos - vSus) * 0.44);
  c.quadraticCurveTo(cx + vLat * 0.2, vSus + (vJos - vSus) * 0.14, cx + vLat * 0.34, vSus);
  c.stroke();
  c.beginPath();
  c.ellipse(cx, vSus, vLat * 0.34, vLat * 0.1, 0, 0, Math.PI * 2);
  c.stroke();
  creion(c, gr * 0.7, LINIE_SUBTIRE);
  c.beginPath();
  c.moveTo(cx - vLat * 0.94, vSus + (vJos - vSus) * 0.5);
  c.quadraticCurveTo(cx, vSus + (vJos - vSus) * 0.56, cx + vLat * 0.94, vSus + (vJos - vSus) * 0.5);
  c.stroke();
}

/* Podiumul rotund, cu funii de catifea pe stâlpi și cu plăcuța de sală în față. */
function podiumulCuFunii(c, g, gr) {
  creion(c, gr * 1.4);
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy, g.podiumRx, g.podiumRy, 0, 0, Math.PI * 2);
  c.stroke();
  const h2 = H * 0.045;
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

  /* Funiile: patru stâlpi în față, cu funia lăsată între ei. Curba ei e tot ce
     trebuie ca să pară grea. */
  const stalpi = [];
  for (let k = 0; k < 4; k++) {
    const a = Math.PI * (0.16 + k * 0.227);
    stalpi.push({
      x: g.podiumCx + Math.cos(a) * g.podiumRx * 1.42,
      y: g.podiumCy + Math.sin(a) * g.podiumRy * 1.5 + H * 0.025
    });
  }
  const inalt = H * 0.10;
  creion(c, gr * 1.2);
  for (const st of stalpi) {
    c.beginPath();
    c.moveTo(st.x, st.y); c.lineTo(st.x, st.y - inalt);
    c.stroke();
    c.beginPath();
    c.ellipse(st.x, st.y, W * 0.014, W * 0.005, 0, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.ellipse(st.x, st.y - inalt, W * 0.007, W * 0.008, 0, 0, Math.PI * 2);
    c.stroke();
  }
  for (let k = 0; k < stalpi.length - 1; k++) {
    const a = stalpi[k], b = stalpi[k + 1];
    c.beginPath();
    c.moveTo(a.x, a.y - inalt * 0.86);
    c.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - inalt * 0.5,
                       b.x, b.y - inalt * 0.86);
    c.stroke();
  }
}

/* ---------- PELERINA, ÎN LINIE ---------- */
/* Conturul pelerinei. Se ține într-un singur loc, fiindcă e nevoie de el în
   trei: la desen, la tăiat, și la socotit care ochiuri ale rețelei cad pe ea. */
/* Croiala pelerinei, scrisă o singură dată: pentru fiecare înălțime, cât e de
   lată. Din tabelul ăsta ies **și** conturul desenat, **și** socoteala
   acoperirii — două lucruri care trebuie să spună același adevăr.

   Scrise de două ori, s-ar despărți la prima schimbare: ai fi colorat o pelerină
   și ai fi acoperit alta. (Prima variantă socotea acoperirea citind pixelii
   conturului desenat — corect, dar cel mai scump lucru pe care i-l poți cere
   unei pânze, și cu totul de neîncercat.)

   Ce spun cifrele, citite de sus în jos: gulerul îngust, umerii care sar brusc
   și sunt **cel mai lat lucru de sus**, apoi o strângere la talie, și abia pe
   urmă trena care se revarsă pe podium.

   Strângerea de la mijloc e tot ce deosebește o mantie de un abajur. Fără ea,
   lățimea crește de sus până jos fără să se oprească nicăieri — și orice contur
   care face asta se citește ca un clopot, oricâte broderii i-ai pune pe el. */
const PROFIL_PELERINEI = [
  [0.00, 0.17], [0.045, 0.48], [0.09, 0.62], [0.20, 0.55],
  [0.38, 0.50], [0.58, 0.58], [0.75, 0.72], [0.88, 0.95],
  [0.96, 1.15], [1.00, 1.00]
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

function traseulPelerinei(c) {
  const g = geomSala8();
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const PASI = 30;
  c.beginPath();
  // latura din stânga, de sus în jos
  for (let k = 0; k <= PASI; k++) {
    const v = k / PASI;
    const x = cx - latimeaPelerinei(v) * w, y = sus + v * h;
    if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  /* Poalele: un val, ca o baltă de stofă. O mantie lăsată pe jos nu se termină
     pe o linie trasă cu compasul. */
  for (let k = 0; k <= PASI; k++) {
    const q = k / PASI;
    const x = cx + (q - 0.5) * 2 * latimeaPelerinei(1) * w;
    c.lineTo(x, sus + h * (1 + 0.022 * Math.sin(q * Math.PI * 3)));
  }
  // și înapoi în sus, pe dreapta
  for (let k = PASI; k >= 0; k--) {
    const v = k / PASI;
    c.lineTo(cx + latimeaPelerinei(v) * w, sus + v * h);
  }
  c.closePath();
}

/* Mantia regală de pe podium, desenată numai cu conturul: guler de hermină,
   corpul cu broderie, medalioane, trena revărsată în față.

   E singurul lucru din sală făcut cu grijă de miniaturist — restul e schiță. Ea
   trebuie să ceară să fie colorată, iar un desen care cere culoare e unul în
   care se vede cât s-a lucrat la contur. */
function pelerinaInLinie(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, jos = g.pelJos, w = g.pelLat, h = g.pelInalt;
  const umarY = sus + h * 0.09, umarX = latimeaPelerinei(0.09) * w;
  const trenaX = latimeaPelerinei(0.96) * w;

  creion(c, gr * 1.5);
  traseulPelerinei(c);
  c.stroke();

  /* Gulerul de hermină: o bandă lată peste umeri, cu o scobitură la gât și cu
     cozile lui negre. E semnul cel mai tare al unei mantii regale — fără el,
     orice cădere de stofă e o pelerină de ploaie. */
  const gulJos = sus + h * 0.115;
  creion(c, gr * 1.3);
  c.beginPath();
  c.moveTo(cx - w * 0.17, sus);
  c.quadraticCurveTo(cx - umarX * 0.8, sus, cx - umarX, umarY);
  c.quadraticCurveTo(cx - umarX * 0.62, gulJos + h * 0.02, cx - w * 0.13, gulJos);
  c.quadraticCurveTo(cx, gulJos + h * 0.03, cx + w * 0.13, gulJos);
  c.quadraticCurveTo(cx + umarX * 0.62, gulJos + h * 0.02, cx + umarX, umarY);
  c.quadraticCurveTo(cx + umarX * 0.8, sus, cx + w * 0.17, sus);
  c.stroke();
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  for (let k = 0; k < 7; k++) {
    const t = (k + 0.5) / 7;
    const x = cx + (t - 0.5) * umarX * 1.5;
    const y = sus + h * (0.03 + Math.sin(t * Math.PI) * 0.016);
    c.beginPath();
    c.moveTo(x, y); c.lineTo(x, y + h * 0.026);
    c.moveTo(x - w * 0.018, y + h * 0.009); c.lineTo(x + w * 0.018, y + h * 0.009);
    c.stroke();
  }

  /* Deschizătura din față: un V care pleacă din guler și coboară până la trenă.
     Prin el se vede căptușeala — banda mai îngustă dinăuntru. O mantie se
     poartă peste ceva, deci se desface: fără deschizătură, silueta rămâne un
     sac cu guler. */
  const desV = function (cat) {
    for (const lat of [-1, 1]) {
      c.beginPath();
      c.moveTo(cx + lat * w * 0.13 * cat, gulJos);
      c.quadraticCurveTo(cx + lat * w * 0.30 * cat, sus + h * 0.45,
                         cx + lat * w * 0.44 * cat, jos - h * 0.10);
      c.stroke();
    }
  };
  creion(c, gr * 1.2);
  desV(1);
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  desV(0.62);

  /* Medalioanele brodate, înșirate pe cele două margini ale deschizăturii — ca
     pe mantiile de încoronare, unde tot ce e prețios stă pe margine. Ele rup
     suprafața în bucăți mărunte, iar bucățile mărunte sunt tocmai cele care fac
     colorarea să merite: îți dau unde să schimbi culoarea. */
  for (const lat of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const t = 0.14 + k * 0.24;
      const x = cx + lat * w * intre(0.105, 0.36, t);
      const y = intre(gulJos + h * 0.02, jos - h * 0.12, t);
      const r = w * 0.062;
      creion(c, gr);
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
      creion(c, gr * 0.7, LINIE_SUBTIRE);
      c.beginPath(); c.arc(x, y, r * 0.5, 0, Math.PI * 2); c.stroke();
      c.beginPath();
      for (let q = 0; q < 6; q++) {
        const a = (q / 6) * Math.PI * 2;
        c.moveTo(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5);
        c.lineTo(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9);
      }
      c.stroke();
    }
  }

  /* Cutele stofei: pleacă de sub guler și se răsfiră în trenă. Se opresc la
     marginea de jos, nu o taie — o cută care iese din stofă e o zgârietură. */
  creion(c, gr * 0.85, LINIE_SUBTIRE);
  for (let k = 0; k < 9; k++) {
    const t = (k + 0.5) / 9;
    c.beginPath();
    /* Cutele merg pe croială, nu în linie dreaptă de la guler la poale: se
       string acolo unde se strânge stofa și se răsfiră acolo unde se revarsă.
       Cutele drepte trag ochiul înapoi spre clopot chiar și peste un contur
       corect — ele sunt cele care spun cel mai tare cum cade materialul. */
    for (let q = 0; q <= 16; q++) {
      const vv = intre(0.13, 0.99, q / 16);
      const x = cx + (t - 0.5) * 1.75 * latimeaPelerinei(vv) * w;
      const y = sus + vv * h;
      if (q === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
  }

  /* Tivul brodat, o bandă de-a lungul poalelor revărsate. El desparte trena de
     podium — fără el, stofa s-ar topi în lemnul de dedesubt. */
  c.beginPath();
  c.moveTo(cx - trenaX * 0.93, jos - h * 0.055);
  c.quadraticCurveTo(cx - trenaX * 0.5, jos - h * 0.005, cx, jos + h * 0.005);
  c.quadraticCurveTo(cx + trenaX * 0.5, jos - h * 0.005, cx + trenaX * 0.93, jos - h * 0.055);
  c.stroke();
}

/* Unde cade un ochi al rețelei de acoperire. */
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
function fisaDeSala8(c, g, gr) {
  const x = g.fisaX, y = g.fisaY, w = g.fisaLat, h = g.fisaInalt;
  c.save();
  c.fillStyle = 'rgba(255, 254, 250, 0.92)';
  c.fillRect(x, y, w, h);
  creion(c, gr * 1.4);
  c.strokeRect(x, y, w, h);
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  c.strokeRect(x + w * 0.025, y + h * 0.018, w * 0.95, h * 0.964);
  c.restore();

  /* Trei paragrafe, despărțite unul de altul, cu o singură mărime de literă
     pentru toate. Căutată pentru fiecare în parte, primul ar ieși mare și
     ultimul mărunt — iar o fișă scrisă cu trei litere diferite arată a colaj. */
  const paragrafe = TEXT_FISA_PIGMENTI.split('\n');
  const marime = marimePotrivita(c, paragrafe, w * 0.86, h * 0.86, w * 0.062);
  let yy = y + h * 0.07;
  for (const par of paragrafe) {
    yy = scrieInCaseta(c, par, x + w * 0.5, yy, w * 0.86, h, marime, '', '#3a342c');
    yy += marime * 0.65;
  }
}

/* Mărimea de literă la care toate paragrafele încap în casetă. */
function marimePotrivita(c, paragrafe, latMax, inaltMax, marimeMax) {
  let marime = marimeMax;
  for (let k = 0; k < 20; k++) {
    c.font = Math.round(marime) + 'px Georgia';
    let inalt = 0;
    for (const par of paragrafe) {
      inalt += randuriInCaseta(c, par, latMax).length * marime * 1.42 + marime * 0.65;
    }
    if (inalt <= inaltMax || marime <= 8) break;
    marime *= 0.94;
  }
  return marime;
}

/* ---------- TRUSA DE USTENSILE ---------- */
/* Sus în stânga, o cutie cu șase unelte desenate în linie. Se alege una cu
   degetul; cea aleasă se îngroașă și primește un fond.

   Deasupra cutiei stă îndemnul — acolo, nu în josul ecranului, fiindcă el
   vorbește despre ce ai în mână. */
function deseneazaTrusa(acum) {
  const g = geomSala8();
  const gr = Math.max(1, g.S * 0.0022);
  const x = g.trusaX, y = g.trusaY, w = g.trusaLat, h = g.trusaInalt;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 253, 248, 0.9)';
  ctx.fillRect(x, y, w, h);
  creion(ctx, gr * 1.4);
  ctx.strokeRect(x, y, w, h);

  for (let k = 0; k < USTENSILE.length; k++) {
    const cw = w / USTENSILE.length;
    const cxk = x + (k + 0.5) * cw;
    const aleasa = s8.unealta === k;
    if (aleasa) {
      ctx.fillStyle = 'rgba(40, 36, 30, 0.10)';
      ctx.fillRect(x + k * cw + cw * 0.06, y + h * 0.05, cw * 0.88, h * 0.9);
    }
    deseneazaUnealta(ctx, k, cxk, y + h * 0.5, h * 0.78, aleasa ? gr * 2 : gr * 1.1);
  }
  ctx.restore();

  textIncadrat('Spațiul este pânza ta. Lasă-ți amprenta. Personalizează spațiul.',
               x + w * 0.5, y - H * 0.062, w * 1.3, ecran(21),
               `bold ${Math.max(Math.round(ecran(11)), Math.round(g.S * 0.018))}px Georgia`,
               LINIE_SALA);
}

/* O unealtă, desenată în linie: coadă, virolă, și capătul care lucrează. Ce le
   deosebește e chiar capătul — de-aia el se desenează cu grijă, iar coada e o
   dungă. */
function deseneazaUnealta(c, k, cx, cy, inalt, gr) {
  const u = USTENSILE[k % USTENSILE.length];
  const lat = inalt * 0.24;
  c.save();
  c.translate(cx, cy);
  creion(c, gr);

  c.beginPath();
  c.moveTo(-lat * 0.16, -inalt * 0.5);
  c.lineTo(lat * 0.16, -inalt * 0.5);
  c.lineTo(lat * 0.12, inalt * 0.06);
  c.lineTo(-lat * 0.12, inalt * 0.06);
  c.closePath();
  c.stroke();

  if (u.cutit) {
    /* Cuțitul de paletă: lama e un triunghi lung, cu gâtul îndoit. Se recunoaște
       după cotul dintre mâner și lamă — fără el ar fi un cuțit de bucătărie. */
    c.beginPath();
    c.moveTo(-lat * 0.12, inalt * 0.06);
    c.lineTo(-lat * 0.1, inalt * 0.14);
    c.lineTo(-lat * (u.gros * 0.7), inalt * 0.2);
    c.lineTo(0, inalt * 0.5);
    c.lineTo(lat * (u.gros * 0.7), inalt * 0.2);
    c.lineTo(lat * 0.1, inalt * 0.14);
    c.lineTo(lat * 0.12, inalt * 0.06);
    c.closePath();
    c.stroke();
  } else {
    c.beginPath();
    c.rect(-lat * 0.2, inalt * 0.06, lat * 0.4, inalt * 0.1);
    c.stroke();
    const lp = lat * (0.16 + u.gros * 0.4);
    c.beginPath();
    c.moveTo(-lat * 0.2, inalt * 0.16);
    c.lineTo(lat * 0.2, inalt * 0.16);
    c.lineTo(lp, inalt * 0.48);
    c.lineTo(-lp, inalt * 0.48);
    c.closePath();
    c.stroke();
    creion(c, gr * 0.6, LINIE_SUBTIRE);
    for (let q = 1; q < u.fire; q++) {
      const t = q / u.fire;
      c.beginPath();
      c.moveTo(intre(-lat * 0.2, lat * 0.2, t), inalt * 0.18);
      c.lineTo(intre(-lp, lp, t), inalt * 0.46);
      c.stroke();
    }
  }
  c.restore();
}

/* ---------- CERCUL CROMATIC ---------- */
/* Sub trusă. Douăsprezece raze, în ordinea de pe roată — fiecare culoare între
   cele două din care se face.

   E singurul lucru colorat din toată sala cât timp n-ai pus tu vopsea: hârtia e
   albă, uneltele sunt în linie, iar culoarea stă strânsă aici, ca pe o paletă.
   De-aia se și vede din prima ce ai de făcut cu ea. */
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
function lasaTusa(x, y, unghi, marime) {
  const c = stratul().getContext('2d');
  const u = USTENSILE[s8.unealta % USTENSILE.length];
  const culoare = CERC_CROMATIC[s8.culoare % CERC_CROMATIC.length];

  const lung = marime * u.lung * (0.85 + Math.random() * 0.3);
  const gros = marime * u.gros * (0.85 + Math.random() * 0.3);

  c.save();
  c.globalAlpha = 1;
  pataDePasta(c, x, y, lung, gros, unghi, culoare, 1, 1);

  if (u.cutit) {
    /* Cuțitul întinde pasta: pe lângă lopata mare, încă două alături, ca stratul
       să aibă marginea neregulată. Un cuțit lasă un strat, nu o dungă. */
    for (let k = 0; k < 2; k++) {
      const q = (Math.random() - 0.5) * 0.6;
      pataDePasta(c, x + Math.cos(unghi) * lung * q, y + Math.sin(unghi) * lung * q,
                  lung * (0.5 + Math.random() * 0.5), gros * (0.5 + Math.random() * 0.7),
                  unghi + (Math.random() - 0.5) * 0.3, culoare, 1, 1);
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
  if (Math.random() < 0.25) {
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
function peTrusa(x, y) {
  const g = geomSala8();
  if (x < g.trusaX || x > g.trusaX + g.trusaLat ||
      y < g.trusaY || y > g.trusaY + g.trusaInalt) return -1;
  return Math.min(USTENSILE.length - 1,
                  Math.floor((x - g.trusaX) / (g.trusaLat / USTENSILE.length)));
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
      spuneScena8('Cobori în apă. Culorile se desfac.', 6000);
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
