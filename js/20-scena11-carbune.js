/* ============================================================================
   SCENA A UNSPREZECEA — CĂRBUNE ȘI PASTĂ DE RELIEF: DISTRUGEREA CREATOARE

   Toate sălile de până aici au fost despre **a pune**: culoare, apă, pastă,
   hârtie lipită. Asta e singura despre **a lua**. Radiera scoate cărbunele de pe
   pereți, șpaclul scoate pasta de pe blocul din mijloc, iar lucrarea nu se face
   — se descoperă, sub ce dai la o parte.

   De-aia sala e monocromă și cu contrast absolut: negru-tăciune și alb-ghips,
   nimic între ele. Când singurul lucru pe care îl faci e să îndepărtezi materie,
   culoarea n-ar avea ce spune; tot ce contează e cât de gros e stratul și ce se
   vede dedesubt.

   Și de-aia toate sunetele sunt de frecare: nimic nu pică, nimic nu curge.
   Totul se roade.
   ========================================================================== */

/* ---------- CULORILE ----------
   Două capete și câteva trepte între ele. Nici măcar un gri cald: cărbunele e
   negru-albăstrui, ghipsul e alb-verzui, iar singurul lucru colorat din toată
   sala e butonul roșu de la sfârșit — și tocmai fiindcă e singurul, se vede de
   la o poștă. */
/* Cărbunele e **cald**, nu albăstrui. Întâi îl făcusem cu o umbră de albastru, cum
   iese „negrul" pe orice ecran; în fotografiile cu cărbune adevărat, bățul e ars
   din lemn și trage spre brun-fumuriu. Nuanța asta desparte tăciunele de cerneala
   de tipar.

   Și ghipsul e aproape alb, cu umbrele lui foarte apropiate: în pastă de relief
   nu există gri închis nicăieri, există alb și alb puțin mai întors de la lumină.
   Tot ce se vede acolo se vede din **formă**, nu din culoare. */
const CARBUNE       = '#14120f';
const CARBUNE_MAT   = '#221f1a';
const CARBUNE_PRAF  = '#3a352d';
const GHIPS         = '#f6f5f1';
const GHIPS_UMBRA   = '#dedcd5';
const GHIPS_ADANC   = '#a8a69e';
const LUMINA_LINIE  = '#eef1f4';
const ROSU_BUTON    = '#d81f2a';

const OCHIURI_PERETE = 34;      // cât de fin se socotește curățatul pereților
const OCHIURI_BLOC   = 22;      // cât de fin se socotește răzuitul blocului

const s11 = {
  faza: 'intrare',   // intrare → carbune → relief → buton → colaps → iesire
  t0: 0, ultimulCadru: 0,
  limpezire: 0,
  celule: [],        // cărbunele rămas pe pereți: 1 plin, 0 curățat
  curatat: 0,        // cât s-a curățat, 0..1
  aprinse: [],       // ce linii de lumină s-au descoperit
  rama: 0,           // cât s-a închegat rama luminoasă
  pasta: [],         // grosimea pastei pe bloc
  razuit: 0,         // cât s-a răzuit, 0..1
  buton: 0,          // cât a ieșit butonul la iveală
  colaps: 0,
  praf: [],
  firimituri: [],
  ultimaFrecare: 0,
  vorba: null
};

/* ---------- MĂSURILE SĂLII ---------- */
function geomSala11() {
  const S = Math.min(W, H);
  const blocLat = Math.min(W * 0.40, H * 0.52);
  const blocInalt = blocLat * 0.92;
  return {
    S, blocLat, blocInalt,
    blocX: W * 0.5 - blocLat / 2,
    blocY: H * 0.5 - blocInalt / 2,
    cx: W * 0.5, cy: H * 0.5
  };
}

/* Blocul stă în mijloc; cărbunele e tot restul. Așa se împarte sala în două
   zone fără niciun perete între ele: una se curăță, cealaltă se sapă. */
function inZonaBlocului(x, y) {
  const g = geomSala11();
  return x > g.blocX && x < g.blocX + g.blocLat &&
         y > g.blocY && y < g.blocY + g.blocInalt;
}

/* Numele e `pregatesteMateriaSalii`, nu `pregatesteOchiurile`: sala uleiului are
   de mult o funcție cu numele ăla, pentru ochiurile pelerinei. Toate fișierele se
   încarcă în același domeniu, deci a doua declarație o șterge pe prima.

   S-a văzut pe loc, și nu în sala a unsprezecea: rochia din sala a opta nu se mai
   putea acoperi, fiindcă rețeaua ei nu se mai construia. Testul care caută nume
   duble l-a prins din prima rulare — și tocmai pentru asta a fost scris. */
function pregatesteMateriaSalii() {
  s11.celule = [];
  for (let j = 0; j < OCHIURI_PERETE; j++) {
    const r = [];
    for (let i = 0; i < OCHIURI_PERETE; i++) r.push(1);
    s11.celule.push(r);
  }
  /* Pasta nu pornește netedă: e **aplicată cu șpaclul**, deci are creste și văi
     de la bun început. Netedă, blocul arăta a cutie de polistiren — lumina n-avea
     de ce să se prindă, fiindcă relieful pe un ecran înseamnă numai pante, iar o
     suprafață plată n-are nicio pantă.

     Trei sinusuri cu perioade care nu se împart una la alta, ca peste tot în
     jucărie: așa creasta nu se repetă vizibil și nu iese un carou. */
  /* Grosimea pastei urmează volumul mare: multă pe movile, puțină în văi. Așa
     răzuitul înseamnă ceva — sapi într-un vârf și ai de scos, treci printr-o vale
     și dai repede de gol. */
  s11.pasta = [];
  for (let j = 0; j < OCHIURI_BLOC; j++) {
    const r = [];
    for (let i = 0; i < OCHIURI_BLOC; i++) {
      const u = (i + 0.5) / OCHIURI_BLOC, v = (j + 0.5) / OCHIURI_BLOC;
      const val = 0.42 + inaltimeaMare(u, v) * 0.58
                + samanta(i * 31.7 + j * 13.3) * 0.06;
      r.push(Math.max(0.30, Math.min(1, val)));
    }
    s11.pasta.push(r);
  }
  s11.curatat = 0; s11.razuit = 0;
  s11.aprinse = [];
}

/* ---------- LINIILE DE LUMINĂ DE SUB CĂRBUNE ----------

   Desenul ascuns nu e o imagine: sunt linii care, luate împreună, se dovedesc a
   fi o **ramă** în jurul blocului. E singura formă care poate arăta, în același
   timp, a desen abstract cât timp o descoperi pe bucăți și a lucru cu rost când
   ai terminat — iar asta e chiar tema sălii: nu vezi ce e acolo până nu dai la
   o parte destul. */
function liniileAscunse() {
  const g = geomSala11();
  const de = g.S * 0.055;                       // cât de larg stă rama de bloc
  const x0 = g.blocX - de, y0 = g.blocY - de;
  const x1 = g.blocX + g.blocLat + de, y1 = g.blocY + g.blocInalt + de;
  const linii = [];

  // rama propriu-zisă, tăiată în bucăți: fiecare se aprinde singură
  const laturi = [[x0, y0, x1, y0], [x1, y0, x1, y1],
                  [x1, y1, x0, y1], [x0, y1, x0, y0]];
  for (let l = 0; l < 4; l++) {
    for (let k = 0; k < 4; k++) {
      const a = laturi[l], f0 = k / 4, f1 = (k + 1) / 4;
      linii.push({
        x0: intre(a[0], a[2], f0), y0: intre(a[1], a[3], f0),
        x1: intre(a[0], a[2], f1), y1: intre(a[1], a[3], f1),
        gros: 1
      });
    }
  }
  /* Și, dincolo de ramă, o pânză de linii peste tot peretele, toate îndreptate
     spre bloc. Ele sunt cea mai mare parte a desenului ascuns, și au un rost
     limpede: fără ele, ștergeai un colț oarecare de perete și nu găseai nimic
     acolo — negru sub negru. O sală în care munca nu se plătește decât într-un
     singur loc te învață să nu mai cauți.

     Așa, oriunde ai freca, iese o linie; iar liniile, toate, arată spre mijloc —
     deci cu cât descoperi mai mult, cu atât se vede mai limpede unde e lucrul
     important. Desenul te duce singur acolo, fără să-ți spună nimeni. */
  const cx = g.cx, cy = g.cy;
  for (let k = 0; k < 46; k++) {
    const a = samanta(8100 + k * 3.1), b = samanta(8160 + k * 7.7);
    const un = (k / 46) * Math.PI * 2 + (a - 0.5) * 0.16;
    const de = g.S * (0.52 + b * 0.62);
    const pana = g.S * (0.30 + a * 0.16);
    linii.push({
      x0: cx + Math.cos(un) * de, y0: cy + Math.sin(un) * de * 0.86,
      x1: cx + Math.cos(un) * pana, y1: cy + Math.sin(un) * pana * 0.86,
      gros: 0.34 + b * 0.3
    });
  }

  /* Razele care pleacă din colțurile ramei. Ele fac ca rama să nu pară lipită pe
     perete, ci **săpată în el**. */
  const colturi = [[x0, y0, -1, -1], [x1, y0, 1, -1], [x1, y1, 1, 1], [x0, y1, -1, 1]];
  for (const c of colturi) {
    for (let k = 0; k < 3; k++) {
      const lung = g.S * (0.16 + k * 0.13);
      const un = Math.atan2(c[3], c[2]) + (k - 1) * 0.34;
      linii.push({
        x0: c[0], y0: c[1],
        x1: c[0] + Math.cos(un) * lung, y1: c[1] + Math.sin(un) * lung,
        gros: 0.55
      });
    }
  }
  return linii;
}

/* ---------- CĂRBUNELE DE PE PEREȚI ----------

   Stratul de cărbune e o pânză neagră peste desen, din care se **șterge** cu
   `destination-out`. E singurul fel cinstit de a face o radieră: orice altceva
   ar însemna să desenezi peste negru cu alb, adică să adaugi în loc să iei — iar
   sala asta e chiar despre deosebirea dintre cele două.

   Rețeaua de ochiuri de alături nu desenează nimic: ea numai numără cât s-a
   curățat, ca sala să știe când e gata. Desenul e pe pânză, socoteala e pe
   rețea, și fiecare face ce știe mai bine. */
const panzaCarbunelui = { panza: null, latime: 0, inaltime: 0 };

function pregatesteCarbunele() {
  /* Se pictează **o singură dată**. Prima oară nu era condiția asta, iar stratul
     se făcea din nou la fiecare cadru — adică tot ce ștergeai se punea la loc în
     șaisprezece milisecunde. Radiera mergea, socoteala arăta optzeci la sută
     curățat, și pe ecran peretele stătea negru ca la început.

     E capcana de fond a oricărei suprafețe pe care se **scrie**: ștampilele
     obișnuite se refac când se schimbă datele, dar asta ține chiar datele. */
  if (panzaCarbunelui.panza && panzaCarbunelui.latime === W &&
      panzaCarbunelui.inaltime === H) {
    return panzaCarbunelui.panza;
  }
  const p = panzaDeLucru(panzaCarbunelui, W, H);
  const c = p.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'source-over';
  c.globalAlpha = 1;
  c.clearRect(0, 0, W, H);

  const fond = c.createLinearGradient(0, 0, W, H);
  fond.addColorStop(0, '#39342c');
  fond.addColorStop(0.5, CARBUNE_PRAF);
  fond.addColorStop(1, '#2e2a23');
  c.fillStyle = fond;
  c.fillRect(0, 0, W, H);

  /* Catifeaua cărbunelui: pete mari și moi, foarte apropiate ca ton. Un negru
     plat arată a gaură în ecran; unul cu materie în el arată a perete. */
  for (let k = 0; k < 260; k++) {
    const a = samanta(7100 + k * 3.1), b = samanta(7160 + k * 7.7);
    const e = samanta(7220 + k * 5.3);
    const r = Math.min(W, H) * (0.04 + e * 0.13);
    const pat = c.createRadialGradient(a * W, b * H, 0, a * W, b * H, r);
    const cul = e > 0.5 ? CARBUNE_PRAF : '#050508';
    pat.addColorStop(0, cul);
    pat.addColorStop(1, cul + '00');
    c.globalAlpha = 0.13 + e * 0.15;
    c.fillStyle = pat;
    c.fillRect(a * W - r, b * H - r, r * 2, r * 2);
  }
  /* Bobul hârtiei. În orice desen în cărbune, primul lucru care se vede nu e
     negrul, ci **granulația**: praful se prinde de vârfurile hârtiei și sare peste
     adâncituri, așa că nicio suprafață nu e plină. Un negru neted e cerneală; unul
     pistruiat e cărbune. */
  c.globalAlpha = 1;
  for (let k = 0; k < 4200; k++) {
    const a = samanta(7300 + k * 3.7), b = samanta(7360 + k * 5.9);
    const e = samanta(7420 + k * 2.3), f = samanta(7480 + k * 1.7);
    c.globalAlpha = 0.06 + e * 0.20;
    c.fillStyle = e > 0.62 ? '#4a443a' : '#080705';
    const r = 1 + f * 2.2;
    c.beginPath();
    c.ellipse(a * W, b * H, r, r * (0.6 + f * 0.7), f * 3, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
  panzaCarbunelui.latime = W; panzaCarbunelui.inaltime = H;
  uitaCadrul();   // pictura asta nu se pune la socoteala fluenței
  return p;
}

/* Radiera: șterge din pânza de cărbune și scade ochiurile de sub ea. */
function stergeCarbune(x, y, raza) {
  if (!panzaCarbunelui.panza) return false;
  const c = panzaCarbunelui.panza.getContext('2d');
  c.save();
  c.globalCompositeOperation = 'destination-out';

  /* Cărbunele nu se ia dintr-o dată și nu se ia tot.

     Întâi ștergeam cu un singur degrade rotund: ieșea o gaură curată, cu marginea
     moale și mijlocul complet gol — adică exact ce **nu** face o radieră pe praf.
     În fotografii se vede altceva: după o trecere rămâne un gri, după a doua unul
     mai deschis, iar bobul hârtiei ține pigment în adâncituri oricât ai freca.

     Deci se șterge cu **boabe**: vreo cincizeci răspândite în pată, fiecare luând
     puțin. Suprapuse, scot mai mult la mijloc și mai puțin pe margini, fără niciun
     degrade — și lasă între ele firișoare neatinse, care sunt chiar cărbunele
     rămas în hârtie. */
  for (let k = 0; k < 54; k++) {
    const a = Math.random(), b = Math.random(), e = Math.random();
    const un = a * Math.PI * 2, d = Math.sqrt(b) * raza * 0.94;
    const px = x + Math.cos(un) * d, py = y + Math.sin(un) * d;
    const r = raza * (0.10 + e * 0.20);
    c.globalAlpha = 0.22 + e * 0.30;
    const g2 = c.createRadialGradient(px, py, 0, px, py, r);
    g2.addColorStop(0, 'rgba(0,0,0,1)');
    g2.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g2;
    c.beginPath();
    c.arc(px, py, r, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();

  let atins = false;
  const ru = raza / W, rv = raza / H;
  const u = x / W, v = y / H;
  for (let j = 0; j < OCHIURI_PERETE; j++) {
    for (let i = 0; i < OCHIURI_PERETE; i++) {
      if (s11.celule[j][i] <= 0) continue;
      const ou = (i + 0.5) / OCHIURI_PERETE, ov = (j + 0.5) / OCHIURI_PERETE;
      if (Math.hypot((ou - u) / ru, (ov - v) / rv) > 1) continue;
      s11.celule[j][i] = Math.max(0, s11.celule[j][i] - 0.55);
      atins = true;
    }
  }
  if (atins) socotesteCuratatul();
  return atins;
}

function socotesteCuratatul() {
  let suma = 0, cate = 0;
  const g = geomSala11();
  for (let j = 0; j < OCHIURI_PERETE; j++) {
    for (let i = 0; i < OCHIURI_PERETE; i++) {
      /* Ochiurile de sub bloc nu se pun la socoteală: acolo nu e cărbune de
         curățat, e pastă de răzuit. Fără scoaterea asta, sala nu s-ar fi putut
         termina niciodată — ai fi frecat la nesfârșit un perete pe care blocul
         îl acoperea oricum. */
      const x = ((i + 0.5) / OCHIURI_PERETE) * W;
      const y = ((j + 0.5) / OCHIURI_PERETE) * H;
      if (inZonaBlocului(x, y)) continue;
      cate++;
      suma += 1 - s11.celule[j][i];
    }
  }
  s11.curatat = cate ? suma / cate : 0;
}

/* ---------- BLOCUL DE PASTĂ ----------

   Un heightmap: fiecare ochi are o grosime, iar șpaclul o scade. Se desenează
   ca fațete cu lumină, nu ca pătrate colorate — pasta de relief se cunoaște
   după **creste**, adică după muchii care prind lumina dintr-o parte și lasă
   umbră în cealaltă. */
function grosimeaPastei(i, j) {
  if (i < 0 || j < 0 || i >= OCHIURI_BLOC || j >= OCHIURI_BLOC) return 0;
  return s11.pasta[j][i];
}

function razuiestePasta(x, y, raza) {
  const g = geomSala11();
  const u = (x - g.blocX) / g.blocLat, v = (y - g.blocY) / g.blocInalt;
  const ru = raza / g.blocLat, rv = raza / g.blocInalt;
  let atins = false;
  for (let j = 0; j < OCHIURI_BLOC; j++) {
    for (let i = 0; i < OCHIURI_BLOC; i++) {
      if (s11.pasta[j][i] <= 0) continue;
      const ou = (i + 0.5) / OCHIURI_BLOC, ov = (j + 0.5) / OCHIURI_BLOC;
      const d = Math.hypot((ou - u) / ru, (ov - v) / rv);
      if (d > 1) continue;
      s11.pasta[j][i] = Math.max(0, s11.pasta[j][i] - (1 - d) * 0.5);
      atins = true;
    }
  }
  if (!atins) return false;

  let suma = 0, cate = 0;
  for (let j = 0; j < OCHIURI_BLOC; j++) {
    for (let i = 0; i < OCHIURI_BLOC; i++) { cate++; suma += 1 - s11.pasta[j][i]; }
  }
  s11.razuit = suma / cate;
  return true;
}

/* Cât de adânc s-a săpat chiar în mijloc — acolo iese butonul. Nu se ia din
   `razuit`, care e media pe tot blocul: poți să razui mult pe margini și deloc
   în centru, iar butonul n-are de ce să apară atunci. */
function sapatInMijloc() {
  let suma = 0, cate = 0;
  const mij = (OCHIURI_BLOC - 1) / 2;
  for (let j = 0; j < OCHIURI_BLOC; j++) {
    for (let i = 0; i < OCHIURI_BLOC; i++) {
      if (Math.hypot(i - mij, j - mij) > OCHIURI_BLOC * 0.22) continue;
      cate++; suma += 1 - s11.pasta[j][i];
    }
  }
  return cate ? suma / cate : 0;
}

const panzaBlocului = { panza: null, latime: 0, inaltime: 0 };
const semnulBlocului = { valoare: -1, cand: -1e9, lat: 0, inalt: 0 };

function semnulPastei() {
  let s = 0;
  for (let j = 0; j < OCHIURI_BLOC; j++) {
    for (let i = 0; i < OCHIURI_BLOC; i++) s += s11.pasta[j][i] * (i + 1) * (j + 1);
  }
  return s;
}

/* Blocul se pictează pe pânza lui și se pune dintr-o mutare, ca laviul din sala
   acuarelei și ca peretele de colaj. Patru sute optzeci de fațete cu creastă și
   umbră, de șaizeci de ori pe secundă, ar fi din nou lagul din sala a doua. */
function panzaBloc(acum) {
  const g = geomSala11();
  const lat = Math.max(2, Math.round(g.blocLat));
  const inalt = Math.max(2, Math.round(g.blocInalt));
  const semn = semnulPastei();
  if (panzaBlocului.panza && semnulBlocului.lat === lat && semnulBlocului.inalt === inalt &&
      (Math.abs(semnulBlocului.valoare - semn) < 0.01 || acum - semnulBlocului.cand < 90)) {
    return panzaBlocului.panza;
  }
  const p = panzaDeLucru(panzaBlocului, lat, inalt);
  const c = p.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.clearRect(0, 0, lat, inalt);
  pictezaBlocul(c, lat, inalt);
  semnulBlocului.valoare = semn;
  semnulBlocului.cand = acum;
  semnulBlocului.lat = lat;
  semnulBlocului.inalt = inalt;
  return p;
}

/* ---------- PASTA, AȘA CUM E PUSĂ ----------

   Pasta de relief nu e un câmp de înălțimi cu zgârieturi peste el: e o grămadă de
   **tușe late trase cu șpaclul**, una peste alta. Fiecare are trei lucruri, și
   toate trei se văd în orice fotografie de impasto gros:

   - **striuri în lungul tușei**, lăsate de muchia uneltei când a târât materia;
   - o **creastă ascuțită** pe marginea de unde s-a ridicat unealta, aproape albă;
   - o **umbră aruncată** dincolo de creastă, pe ce e dedesubt.

   Întâi făcusem un câmp de înălțimi din trei sinusuri, netezit. Ieșea o pernă:
   blocul părea suflat, nu întins. Materia groasă se cunoaște după **drumul mâinii
   care a pus-o**, iar un câmp de sinusuri n-are niciun drum în el. */
/* ---------- VOLUMUL MARE ----------

   Tușele singure nu fac o sculptură: fac o suprafață acoperită cu tușe. Ce
   deosebește un relief de un tapet e că **masa întreagă are formă** — se umflă
   într-o parte, se scobește în alta, și lumina o traversează dintr-un capăt în
   celălalt, nu se oprește la fiecare tușă.

   De-aia sub tușe stă un relief mare, făcut din câteva movile late. El nu se vede
   ca desen — se vede ca **lumină**: partea dinspre stânga sus a fiecărei movile e
   deschisă, cea dinspre dreapta jos e întunecată, și asta peste tot ce e desenat
   deasupra. Așa blocul se ridică de pe perete.

   Și tot de-aia pasta e mai groasă acolo unde movila e mai înaltă: când razui în
   vârful ei ai mai mult de scos decât într-o vale. */
const RELIEFUL_MARE = [
  { u: 0.36, v: 0.34, r: 0.40, h: 1.00 },
  { u: 0.66, v: 0.28, r: 0.30, h: 0.72 },
  { u: 0.58, v: 0.62, r: 0.38, h: 0.88 },
  { u: 0.22, v: 0.70, r: 0.30, h: 0.64 },
  { u: 0.82, v: 0.72, r: 0.26, h: 0.55 },
  { u: 0.46, v: 0.14, r: 0.22, h: 0.44 },
  { u: 0.14, v: 0.44, r: 0.20, h: 0.38 }
];

function inaltimeaMare(u, v) {
  let h = 0.10;
  for (const m of RELIEFUL_MARE) {
    const d = Math.hypot((u - m.u) / m.r, (v - m.v) / m.r);
    if (d >= 1) continue;
    // o movilă lină: se stinge în marginile ei, nu se termină într-o muchie
    const c = 1 - d * d;
    h += m.h * c * c;
  }
  return Math.min(1, h);
}

const TUSE_PASTA = [
  { x0: -0.06, y0: 0.16, cx: 0.42, cy: 0.02, x1: 0.98, y1: 0.20, lat: 0.20, sam: 3 },
  { x0: 1.04, y0: 0.34, cx: 0.50, cy: 0.30, x1: -0.04, y1: 0.42, lat: 0.17, sam: 11 },
  { x0: 0.06, y0: 1.04, cx: 0.22, cy: 0.48, x1: 0.44, y1: -0.04, lat: 0.22, sam: 19 },
  { x0: 0.92, y0: -0.04, cx: 0.72, cy: 0.52, x1: 0.86, y1: 1.04, lat: 0.19, sam: 29 },
  { x0: -0.04, y0: 0.70, cx: 0.46, cy: 0.62, x1: 1.04, y1: 0.76, lat: 0.16, sam: 37 },
  { x0: 0.30, y0: 1.06, cx: 0.54, cy: 0.74, x1: 0.96, y1: 0.52, lat: 0.15, sam: 43 },
  { x0: -0.02, y0: 0.94, cx: 0.40, cy: 0.88, x1: 0.72, y1: 1.06, lat: 0.14, sam: 53 },
  { x0: 0.62, y0: -0.02, cx: 0.34, cy: 0.34, x1: 0.10, y1: 0.60, lat: 0.13, sam: 61 },
  { x0: 1.02, y0: 0.10, cx: 0.66, cy: 0.22, x1: 0.28, y1: 0.14, lat: 0.12, sam: 71 },
  { x0: 0.18, y0: 0.28, cx: 0.52, cy: 0.46, x1: 0.88, y1: 0.38, lat: 0.11, sam: 79 },
  { x0: 0.74, y0: 0.86, cx: 0.44, cy: 0.94, x1: 0.08, y1: 0.78, lat: 0.12, sam: 89 },
  { x0: 0.48, y0: 0.06, cx: 0.60, cy: 0.44, x1: 0.40, y1: 0.86, lat: 0.10, sam: 97 }
];

/* Un punct de pe drumul unei tușe, și încotro merge ea acolo. */
function pePasta(t, q) {
  const u = 1 - q;
  return {
    x: u * u * t.x0 + 2 * u * q * t.cx + q * q * t.x1,
    y: u * u * t.y0 + 2 * u * q * t.cy + q * q * t.y1,
    dx: 2 * u * (t.cx - t.x0) + 2 * q * (t.x1 - t.cx),
    dy: 2 * u * (t.cy - t.y0) + 2 * q * (t.y1 - t.cy)
  };
}

/* O tușă lată de pastă, cu striuri, creastă și umbră. */
function tusaDePasta(c, t, lat, inalt) {
  const PASI = 26;
  const punte = [];
  for (let k = 0; k <= PASI; k++) {
    const q = k / PASI, p = pePasta(t, q);
    const L = Math.hypot(p.dx * lat, p.dy * inalt) || 1;
    const nx = -(p.dy * inalt) / L, ny = (p.dx * lat) / L;
    /* Tușa se subțiază la capătul unde s-a ridicat unealta, nu la amândouă:
       începe gros, unde șpaclul a fost apăsat, și se stinge unde a plecat. */
    const gros = t.lat * Math.min(lat, inalt) * (1 - q * 0.42) *
                 (0.86 + 0.14 * Math.sin(q * 9 + t.sam));
    punte.push({ x: p.x * lat, y: p.y * inalt, nx, ny, gros });
  }

  const margine = function (semn, cat) {
    c.beginPath();
    for (let k = 0; k < punte.length; k++) {
      const p = punte[k];
      const px = p.x + p.nx * p.gros * semn * cat;
      const py = p.y + p.ny * p.gros * semn * cat;
      if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
  };

  c.save();
  c.lineJoin = 'round';
  c.lineCap = 'round';

  /* Umbra aruncată. E cel mai important lucru din toată tușa, și prima oară am
     pus-o prea slăbuță: tușele ieșeau străvezii, ca niște dungi de sticlă mățuită
     una peste alta. În fotografii, fiecare tușă de pastă groasă stă limpede
     **deasupra** celei de dedesubt — și asta se vede numai din umbră.

     Umbra stă aproape de ea, nu departe: pasta e groasă de câțiva milimetri, nu de
     un lat de palmă. O umbră mutată mult ar ridica tușa de pe perete. */
  const d = Math.min(lat, inalt) * 0.008;
  c.save();
  c.translate(d, d * 1.3);
  for (let t2 = 3; t2 >= 1; t2--) {
    c.globalAlpha = 0.16;
    c.strokeStyle = '#6f6d65';
    c.lineWidth = Math.max(2, punte[0].gros * 0.16 * t2);
    c.beginPath();
    for (let k = 0; k < punte.length; k++) {
      const p = punte[k];
      const px = p.x + p.nx * p.gros, py = p.y + p.ny * p.gros;
      if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    for (let k = punte.length - 1; k >= 0; k--) {
      const p = punte[k];
      c.lineTo(p.x - p.nx * p.gros, p.y - p.ny * p.gros);
    }
    c.closePath();
    c.stroke();
  }
  c.restore();

  // corpul tușei
  c.globalAlpha = 1;
  c.beginPath();
  for (let k = 0; k < punte.length; k++) {
    const p = punte[k];
    const px = p.x - p.nx * p.gros, py = p.y - p.ny * p.gros;
    if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
  }
  for (let k = punte.length - 1; k >= 0; k--) {
    const p = punte[k];
    c.lineTo(p.x + p.nx * p.gros, p.y + p.ny * p.gros);
  }
  c.closePath();
  /* Culoarea merge **de-a curmezișul** tușei, nu pe lungul ei: o tușă de pastă e
     rotunjită ca un val, deci are o parte întoarsă spre lumină și una întoarsă de
     la ea. Pusă pe lungime, ea spunea numai „începe aici și se termină acolo",
     adică nimic despre formă. */
  const mij = punte[Math.floor(punte.length / 2)];
  const corp = c.createLinearGradient(
    mij.x - mij.nx * mij.gros, mij.y - mij.ny * mij.gros,
    mij.x + mij.nx * mij.gros, mij.y + mij.ny * mij.gros);
  corp.addColorStop(0, '#ffffff');
  corp.addColorStop(0.28, '#faf9f5');
  corp.addColorStop(0.68, GHIPS_UMBRA);
  corp.addColorStop(1, '#bfbdb5');
  c.fillStyle = corp;
  c.fill();

  /* Striurile: muchia șpaclului nu e netedă, iar fiecare știrbitură a ei lasă un
     șanț pe toată lungimea tușei. Ele merg **cu** tușa, niciodată de-a curmezișul —
     asta le deosebește de o zgârietură făcută după aceea. */
  c.save();
  c.clip();
  const cate = Math.max(5, Math.round(t.lat * 44));
  for (let f = 0; f < cate; f++) {
    const cat = (f + 0.5) / cate * 2 - 1;
    const z = samanta(t.sam * 7.7 + f * 3.1);
    c.globalAlpha = 0.26 + z * 0.34;
    c.strokeStyle = z > 0.5 ? '#ffffff' : amesteca(GHIPS_ADANC, '#6f6d65', 0.45);
    c.lineWidth = Math.max(0.8, punte[0].gros * (0.05 + z * 0.10));
    margine(cat > 0 ? 1 : -1, Math.abs(cat));
    c.stroke();
  }
  c.restore();

  // creasta: muchia dinspre lumină, aproape albă
  c.globalAlpha = 0.9;
  c.strokeStyle = '#ffffff';
  c.lineWidth = Math.max(1.2, punte[0].gros * 0.16);
  margine(-1, 0.97);
  c.stroke();
  // și muchia cealaltă, abia întunecată
  c.globalAlpha = 0.7;
  c.strokeStyle = '#8d8b83';
  c.lineWidth = Math.max(1, punte[0].gros * 0.16);
  margine(1, 0.97);
  c.stroke();

  c.restore();
}

/* Pânza mică pe care se socotește câtă pastă a mai rămas, și cea pe care se
   socotește lumina volumului mare. */
const panzaMastii = { panza: null, latime: 0, inaltime: 0 };
const panzaVolumului = { panza: null, latime: 0, inaltime: 0 };

function pictezaBlocul(c, lat, inalt) {
  /* Întâi se pictează blocul **întreg**, așa cum a fost pus, și abia pe urmă se
     scoate din el ce ai răzuit. Ordinea asta nu e o comoditate: pasta chiar a
     fost pusă toată, iar tu iei din ea. Dacă aș desena numai ce a rămas, fiecare
     tușă ar trebui recroită după fiecare zgârietură — și s-ar vedea, fiindcă
     striurile și creasta ar merge după gaură, nu după mâna care a întins-o. */
  const N = OCHIURI_BLOC;

  // stratul de dedesubt: pastă întinsă subtire, cu urma gletierei
  const fond = c.createLinearGradient(0, 0, lat, inalt);
  fond.addColorStop(0, '#d9d7d0');
  fond.addColorStop(0.6, '#c6c4bc');
  fond.addColorStop(1, '#adaba3');
  c.fillStyle = fond;
  c.fillRect(0, 0, lat, inalt);
  c.save();
  c.globalAlpha = 0.35;
  c.strokeStyle = '#ffffff';
  c.lineWidth = Math.max(0.7, inalt * 0.004);
  for (let k = 0; k < 60; k++) {
    const z = samanta(9100 + k * 3.1);
    c.beginPath();
    c.moveTo(0, z * inalt);
    c.lineTo(lat, z * inalt + (samanta(9160 + k * 5.3) - 0.5) * inalt * 0.03);
    c.stroke();
  }
  c.restore();

  // tușele, una peste alta
  for (const t of TUSE_PASTA) tusaDePasta(c, t, lat, inalt);

  /* Umbrirea de ansamblu: aceeași lumină, dinspre stânga sus, dusă peste toată
     masa. Se socotește pe o pânză mică — patruzeci pe patruzeci — și se întinde
     peste bloc, ca să iasă lină: un volum n-are muchii între zonele lui de umbră.

     Se pun două treceri, fiindcă umbra și lumina nu se fac la fel: umbra
     **înmulțește** (întunecă ce e dedesubt, oricare ar fi), iar lumina se
     **adaugă** (albește crestele fără să le spele culoarea). Puse amândouă la fel,
     ieșea o ceață cenușie peste tot. */
  const NM = 40;
  const mare = panzaDeLucru(panzaVolumului, NM, NM);
  const vc = mare.getContext('2d');
  vc.setTransform(1, 0, 0, 1, 0, 0);
  vc.globalAlpha = 1;
  vc.clearRect(0, 0, NM, NM);
  const pas = 1 / NM;
  for (let j = 0; j < NM; j++) {
    for (let i = 0; i < NM; i++) {
      const u = (i + 0.5) / NM, v = (j + 0.5) / NM;
      const dx = inaltimeaMare(u - pas, v) - inaltimeaMare(u + pas, v);
      const dy = inaltimeaMare(u, v - pas) - inaltimeaMare(u, v + pas);
      const catre = Math.max(-1, Math.min(1, (dx + dy) * 5.5));
      if (catre < 0) {
        vc.fillStyle = 'rgba(58, 56, 50, ' + (-catre * 0.62).toFixed(3) + ')';
      } else {
        vc.fillStyle = 'rgba(255, 255, 255, ' + (catre * 0.50).toFixed(3) + ')';
      }
      vc.fillRect(i, j, 1, 1);
    }
  }
  c.save();
  c.imageSmoothingEnabled = true;
  c.globalCompositeOperation = 'multiply';
  c.globalAlpha = 0.9;
  c.drawImage(mare, 0, 0, NM, NM, 0, 0, lat, inalt);
  c.globalCompositeOperation = 'lighter';
  c.globalAlpha = 0.55;
  c.drawImage(mare, 0, 0, NM, NM, 0, 0, lat, inalt);
  c.restore();

  /* Și o umbră proprie în văile adânci: acolo unde masa coboară mult, lumina nici
     nu mai ajunge. Fără asta, movilele par niște umflături pe o tăblie, nu o
     materie grămădită. */
  vc.clearRect(0, 0, NM, NM);
  for (let j = 0; j < NM; j++) {
    for (let i = 0; i < NM; i++) {
      const h = inaltimeaMare((i + 0.5) / NM, (j + 0.5) / NM);
      if (h > 0.42) continue;
      vc.fillStyle = 'rgba(46, 44, 39, ' + ((0.42 - h) * 1.5).toFixed(3) + ')';
      vc.fillRect(i, j, 1, 1);
    }
  }
  c.save();
  c.imageSmoothingEnabled = true;
  c.globalCompositeOperation = 'multiply';
  c.globalAlpha = 0.75;
  c.drawImage(mare, 0, 0, NM, NM, 0, 0, lat, inalt);
  c.restore();

  // granulația ghipsului, peste tot
  c.save();
  c.globalAlpha = 0.35;
  for (let k = 0; k < 1400; k++) {
    const a = samanta(7600 + k * 3.1), b = samanta(7660 + k * 7.7);
    const e = samanta(7720 + k * 5.3);
    c.fillStyle = e > 0.5 ? '#ffffff' : '#9c9a93';
    c.fillRect(a * lat, b * inalt, 1 + e, 1 + e);
  }
  c.restore();

  /* Acum se scoate ce s-a răzuit. Masca se face pe o pânză de N×N — un pixel de
     ochi — și se întinde peste bloc: marginea iese moale, ca a unei materii
     săpate cu unealta, nu tăiată cu foarfeca. */
  const masca = panzaDeLucru(panzaMastii, N, N);
  const mc = masca.getContext('2d');
  mc.setTransform(1, 0, 0, 1, 0, 0);
  mc.globalAlpha = 1;
  mc.clearRect(0, 0, N, N);
  let ceva = false;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const scos = 1 - s11.pasta[j][i];
      if (scos <= 0.02) continue;
      ceva = true;
      mc.fillStyle = 'rgba(0,0,0,' + Math.min(1, scos * 1.25).toFixed(3) + ')';
      mc.fillRect(i, j, 1, 1);
    }
  }

  if (ceva) {
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.imageSmoothingEnabled = true;
    c.drawImage(masca, 0, 0, N, N, 0, 0, lat, inalt);
    c.restore();

    /* Golul de dedesubt și buza ruptă din jurul lui. Golul se pune **sub** pastă,
       ca să se vadă prin gaura tocmai scoasă; buza, deasupra, fiindcă ea e chiar
       marginea materiei rămase. */
    c.save();
    c.globalCompositeOperation = 'destination-over';
    c.fillStyle = '#0a0908';
    c.fillRect(0, 0, lat, inalt);
    c.restore();

    /* Buza ruptă din jurul craterului: se luminează numai acolo unde deasupra a
       mai rămas pastă. Trasată la fiecare ochi gol, ieșeau dungi albe pe toată
       lățimea găurii — jaluzele, nu materie ruptă. */
    const pw = lat / N, ph = inalt / N;
    c.save();
    c.lineCap = 'round';
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        if (s11.pasta[j][i] > 0.10) continue;
        if (grosimeaPastei(i, j - 1) <= 0.10) continue;
        c.globalAlpha = 0.75;
        c.strokeStyle = '#ffffff';
        c.lineWidth = Math.max(1, ph * 0.22);
        c.beginPath();
        c.moveTo(i * pw, j * ph + ph * 0.08);
        c.lineTo((i + 1) * pw, j * ph + ph * 0.08);
        c.stroke();
        c.globalAlpha = 0.5;
        c.strokeStyle = '#4a4841';
        c.lineWidth = Math.max(0.8, ph * 0.14);
        c.beginPath();
        c.moveTo(i * pw, j * ph + ph * 0.26);
        c.lineTo((i + 1) * pw, j * ph + ph * 0.26);
        c.stroke();
      }
    }
    c.restore();
  }
}

/* ---------- BUTONUL ROȘU ----------
   Singurul lucru colorat din toată sala, și singurul care sună a aparat. Iese
   din mijlocul blocului pe măsură ce pasta de deasupra lui se duce. */
function loculButonului() {
  const g = geomSala11();
  return { x: g.cx, y: g.cy, r: g.S * 0.055 };
}

function deseneazaButonul(c, acum) {
  const q = Math.min(1, s11.buton);
  if (q <= 0.01) return;
  const b = loculButonului();
  const r = b.r * (0.35 + q * 0.65);
  const bat = 0.85 + 0.15 * Math.sin(acum * 0.005);

  c.save();
  // haloul lui, singura culoare care atinge pereții
  c.globalCompositeOperation = 'lighter';
  c.globalAlpha = q * 0.5 * bat;
  const h = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, r * 4.5);
  h.addColorStop(0, 'rgba(216, 31, 42, 0.75)');
  h.addColorStop(1, 'rgba(216, 31, 42, 0)');
  c.fillStyle = h;
  c.fillRect(b.x - r * 4.5, b.y - r * 4.5, r * 9, r * 9);
  c.restore();

  c.save();
  c.globalAlpha = q;
  // soclul metalic în care stă
  c.fillStyle = '#26262b';
  c.beginPath();
  c.ellipse(b.x, b.y + r * 0.12, r * 1.34, r * 1.20, 0, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = '#4a4a52';
  c.lineWidth = Math.max(1, r * 0.07);
  c.stroke();

  // capul bombat
  const cap = c.createRadialGradient(b.x - r * 0.34, b.y - r * 0.40, r * 0.05,
                                     b.x, b.y, r * 1.05);
  cap.addColorStop(0, '#ff8a90');
  cap.addColorStop(0.35, '#ec3340');
  cap.addColorStop(0.8, ROSU_BUTON);
  cap.addColorStop(1, '#7d1018');
  c.fillStyle = cap;
  c.beginPath();
  c.arc(b.x, b.y, r, 0, Math.PI * 2);
  c.fill();

  // luciul: o singură pată, sus la stânga, ca la orice lucru lăcuit
  const lum = c.createRadialGradient(b.x - r * 0.38, b.y - r * 0.44, 0,
                                     b.x - r * 0.38, b.y - r * 0.44, r * 0.62);
  lum.addColorStop(0, 'rgba(255,255,255,0.85)');
  lum.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = lum;
  c.beginPath();
  c.arc(b.x, b.y, r, 0, Math.PI * 2);
  c.fill();

  /* Scrisul de pe el e **digital**, nu de mână: singurul font din toată jucăria
     care nu e Georgia. Tot ce se vede până aici a fost desenat sau scris de
     cineva; ăsta a fost fabricat, și trebuie să se vadă. */
  if (q > 0.55) {
    const marime = Math.max(7, r * 0.30);
    c.globalAlpha = (q - 0.55) / 0.45;
    c.font = 'bold ' + Math.round(marime) + 'px "Courier New", Courier, monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = 'rgba(24, 4, 6, 0.85)';
    c.fillText(T('carbune.apasaMa'), b.x, b.y - marime * 0.55);
    c.fillText(T('carbune.iar'), b.x, b.y + marime * 0.62);
    c.fillStyle = 'rgba(255, 214, 216, 0.92)';
    c.fillText(T('carbune.apasaMa'), b.x, b.y - marime * 0.55 - Math.max(1, r * 0.02));
    c.fillText(T('carbune.iar'), b.x, b.y + marime * 0.62 - Math.max(1, r * 0.02));
  }
  c.restore();
}

/* ---------- PRAFUL ȘI FIRIMITURILE ---------- */
const PRAF_IN_AER = 260;

function facPraf(x, y, cate, negru) {
  if (s11.praf.length > PRAF_IN_AER) {
    s11.praf.splice(0, s11.praf.length - PRAF_IN_AER);
  }
  const S = Math.min(W, H);
  for (let k = 0; k < cate; k++) {
    const a = Math.random(), b = Math.random();
    s11.praf.push({
      x: x + (a - 0.5) * S * 0.05, y: y + (b - 0.5) * S * 0.05,
      vx: (a - 0.5) * 0.9, vy: -0.25 - b * 0.7,
      r: S * (0.0012 + a * 0.0026), viata: 1, negru: negru
    });
  }
}

function facFirimitura(x, y) {
  const S = Math.min(W, H);
  s11.firimituri.push({
    x, y, vx: (Math.random() - 0.5) * 2.4, vy: -1 - Math.random() * 1.6,
    r: S * (0.004 + Math.random() * 0.011),
    unghi: Math.random() * 6.28, rot: (Math.random() - 0.5) * 0.3,
    viata: 1
  });
}

function actualizeazaPulberea(dt) {
  for (let k = s11.praf.length - 1; k >= 0; k--) {
    const p = s11.praf[k];
    p.vy += 0.006 * (dt / 16);
    p.x += p.vx * (dt / 16); p.y += p.vy * (dt / 16);
    p.viata -= dt / 1800;
    if (p.viata <= 0) s11.praf.splice(k, 1);
  }
  const g = geomSala11();
  for (let k = s11.firimituri.length - 1; k >= 0; k--) {
    const f = s11.firimituri[k];
    f.vy += 0.16 * (dt / 16);
    f.x += f.vx * (dt / 16); f.y += f.vy * (dt / 16);
    f.unghi += f.rot * (dt / 16);
    // se opresc pe podeaua de sub bloc, nu cad la nesfârșit
    const podea = g.blocY + g.blocInalt + g.S * 0.10;
    if (f.y > podea) { f.y = podea; f.vy = 0; f.vx *= 0.7; f.rot *= 0.5; }
    f.viata -= dt / 7000;
    if (f.viata <= 0) s11.firimituri.splice(k, 1);
  }
}

function deseneazaPulberea(c) {
  c.save();
  for (const p of s11.praf) {
    c.globalAlpha = p.viata * (p.negru ? 0.42 : 0.55);
    c.fillStyle = p.negru ? CARBUNE_PRAF : GHIPS;
    c.beginPath();
    c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    c.fill();
  }
  for (const f of s11.firimituri) {
    c.globalAlpha = Math.min(1, f.viata * 1.6);
    c.save();
    c.translate(f.x, f.y);
    c.rotate(f.unghi);
    c.fillStyle = GHIPS;
    c.fillRect(-f.r, -f.r * 0.6, f.r * 2, f.r * 1.2);
    c.fillStyle = GHIPS_UMBRA;
    c.fillRect(-f.r, f.r * 0.2, f.r * 2, f.r * 0.4);
    c.restore();
  }
  c.restore();
}

/* ---------- UNEALTA DIN MÂNĂ ----------
   Radiera cât timp cureți, șpaclul cât timp razui. Se vede care e în mână, și
   se vede și că s-a schimbat: e singurul semn că sala a trecut într-o a doua
   parte, fiindcă nimeni nu-ți spune asta cu vorbe. */
function cursorulScenei11() {
  if (stare !== 'carbune') return false;
  if (cursor.x < -100) return true;
  /* La colaps, mâna rămâne goală. O unealtă desenată mai departe, peste un muzeu
     care e supt într-un buton, e singurul lucru din cadru care nu se prăbușește —
     și ajunge ca să strice tot. */
  if (s11.faza === 'colaps' || s11.faza === 'iesire') return true;
  const S = Math.min(W, H);

  ctx.save();
  ctx.translate(cursor.x, cursor.y);
  ctx.rotate(-0.42);

  if (s11.faza === 'carbune' || s11.faza === 'intrare') {
    // radiera: un paralelipiped de cauciuc, tocit la un capăt
    const w = S * 0.055, h = S * 0.032;
    ctx.fillStyle = 'rgba(10,10,12,0.45)';
    ctx.fillRect(-w * 0.42, -h * 0.30, w, h);
    const cau = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
    cau.addColorStop(0, '#f6f4ec');
    cau.addColorStop(0.55, '#ddd9cc');
    cau.addColorStop(1, '#a9a496');
    ctx.fillStyle = cau;
    ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
    ctx.strokeStyle = '#6f6b5f';
    ctx.lineWidth = Math.max(1, S * 0.0016);
    ctx.strokeRect(-w * 0.5, -h * 0.5, w, h);
    // capătul murdar de cărbune, cel cu care ștergi
    ctx.fillStyle = '#2a2a30';
    ctx.fillRect(-w * 0.5, -h * 0.5, w * 0.30, h);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(-w * 0.16, -h * 0.5, w * 0.5, Math.max(1, h * 0.14));
  } else {
    /* Eboșorul, după fotografii: **o buclă de sârmă** prinsă într-un guler de metal,
       pe un mâner de lemn deschis. Nu e un șpaclu de zugrav — aia e o lopată.
       Unealta cu care se scoate materie e o buclă: intră în pastă și taie o felie,
       iar felia iese prin mijlocul ei.

       De-aia se și vede prin ea. O buclă desenată plină ar fi doar o lingură. */
    const L = S * 0.115, G = S * 0.026;

    // umbra uneltei
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(2, G * 0.5);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-L * 0.30 + G * 0.22, G * 0.22);
    ctx.lineTo(L * 0.52 + G * 0.22, G * 0.22);
    ctx.stroke();
    ctx.restore();

    // mânerul de lemn, mai gros la mijloc
    const lemn = ctx.createLinearGradient(0, -G * 0.34, 0, G * 0.34);
    lemn.addColorStop(0, '#efdcb8');
    lemn.addColorStop(0.34, '#e0c89a');
    lemn.addColorStop(0.72, '#c2a375');
    lemn.addColorStop(1, '#9c8055');
    ctx.fillStyle = lemn;
    ctx.beginPath();
    ctx.moveTo(-L * 0.16, -G * 0.20);
    ctx.quadraticCurveTo(L * 0.18, -G * 0.34, L * 0.54, -G * 0.16);
    ctx.quadraticCurveTo(L * 0.60, 0, L * 0.54, G * 0.16);
    ctx.quadraticCurveTo(L * 0.18, G * 0.34, -L * 0.16, G * 0.20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(120, 96, 58, 0.7)';
    ctx.lineWidth = Math.max(0.7, S * 0.0012);
    ctx.stroke();
    // fibra lemnului
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#8a6f45';
    ctx.lineWidth = Math.max(0.5, S * 0.0009);
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.moveTo(-L * 0.12, (k - 1) * G * 0.12);
      ctx.quadraticCurveTo(L * 0.20, (k - 1) * G * 0.16, L * 0.50, (k - 1) * G * 0.10);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // gulerul de metal care strânge sârma
    const guler = ctx.createLinearGradient(0, -G * 0.26, 0, G * 0.26);
    guler.addColorStop(0, '#e8ebee');
    guler.addColorStop(0.45, '#a9aeb4');
    guler.addColorStop(1, '#6e737a');
    ctx.fillStyle = guler;
    dreptunghiIn(ctx, -L * 0.26, -G * 0.24, L * 0.14, G * 0.48, G * 0.08);
    ctx.fill();
    ctx.strokeStyle = '#5a5f66';
    ctx.lineWidth = Math.max(0.6, S * 0.0010);
    ctx.stroke();

    /* Bucla: două sârme care ies din guler, se depărtează și se întorc într-un
       vârf. Se desenează numai conturul, fiindcă prin ea chiar se vede. */
    ctx.strokeStyle = '#cfd4d9';
    ctx.lineWidth = Math.max(1.4, G * 0.14);
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-L * 0.26, -G * 0.14);
    ctx.quadraticCurveTo(-L * 0.52, -G * 0.44, -L * 0.72, -G * 0.10);
    ctx.quadraticCurveTo(-L * 0.80, G * 0.06, -L * 0.66, G * 0.20);
    ctx.quadraticCurveTo(-L * 0.46, G * 0.40, -L * 0.26, G * 0.14);
    ctx.stroke();
    // luciul de pe sârmă
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(0.6, G * 0.05);
    ctx.beginPath();
    ctx.moveTo(-L * 0.30, -G * 0.18);
    ctx.quadraticCurveTo(-L * 0.54, -G * 0.44, -L * 0.70, -G * 0.14);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // felia de pastă prinsă în buclă
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = GHIPS;
    ctx.beginPath();
    ctx.moveTo(-L * 0.66, G * 0.16);
    ctx.quadraticCurveTo(-L * 0.52, G * 0.34, -L * 0.36, G * 0.12);
    ctx.quadraticCurveTo(-L * 0.52, G * 0.02, -L * 0.66, G * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  return true;
}

/* ---------- VORBA SĂLII ---------- */
function spuneScena11(text, cat) {
  s11.vorba = { text, panaLa: (s11.ultimulCadru || 0) + cat };
}

function deseneazaVorba11(acum) {
  if (!s11.vorba || acum > s11.vorba.panaLa) return;
  const stins = Math.min(1, (s11.vorba.panaLa - acum) / 700);
  const marime = Math.max(13, Math.min(W, H) * 0.024);
  ctx.save();
  ctx.globalAlpha = stins * 0.85;
  ctx.font = Math.round(marime) + 'px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = LUMINA_LINIE;
  ctx.fillText(s11.vorba.text, W * 0.5, H * 0.945);
  ctx.restore();
}

/* ---------- INTRAREA ȘI IEȘIREA ---------- */
function intraInCarbune(acum) {
  stare = 'carbune';
  s11.faza = 'intrare'; s11.t0 = acum; s11.ultimulCadru = acum;
  s11.limpezire = 0; s11.rama = 0; s11.buton = 0; s11.colaps = 0;
  s11.praf = []; s11.firimituri = []; s11.vorba = null; s11.ultimaFrecare = 0;
  pregatesteMateriaSalii();
  panzaCarbunelui.latime = 0;
  pregatesteCarbunele();
  semnulBlocului.valoare = -1; semnulBlocului.cand = -1e9;
  opresteAtelierRetro();
  pornesteLinisteaIncordata();
  if (audio) sunetPortal();
}

/* Butonul spune „Apasă-mă iar", și asta nu e o glumă: după ce muzeul e supt
   înăuntru, jucăria **începe din nou**. Nu te scoate la custode, ca celelalte
   săli — nu mai are unde, custodele tocmai a fost înghițit odată cu galeriile
   lui. Te lasă în întunericul de la început, cu balonul care așteaptă. */
function iesiDinCarbune(acum) {
  /* Negrul de la capătul colapsului **este** sala a douăsprezecea: vidul de
     dinainte ca muzeul să fie desenat. Nu se face nicio trecere între ele — una
     se termină în negru absolut, cealaltă începe în negru absolut, și tocmai
     cusătura care nu se vede face deja-vu-ul de acolo. */
  opresteLinisteaIncordata();
  opresteNatura();
  pregatesteMateriaSalii();
  s11.faza = 'intrare';
  pocnetulBalonului = null;
  intraInVid(acum);
}

/* ---------- CE SE ÎNTÂMPLĂ LA ATINGERE ---------- */
function click11(acum) {
  if (s11.faza === 'colaps' || s11.faza === 'iesire') return;

  if (s11.faza === 'buton') {
    const b = loculButonului();
    if (Math.hypot(cursor.x - b.x, cursor.y - b.y) < b.r * 1.5) {
      /* Poza sălii se ia **acum**, înainte de orice, ca să se prăbușească chiar
         imaginea pe care o priveai. Refăcută din desen, ar fi fost o animație
         pusă peste sală, nu sala însăși. */
      iaPozaSalii();
      s11.faza = 'colaps'; s11.t0 = acum; s11.colaps = 0.001;
      s11.vorba = null;
      if (audio) { sunetButonRosu(); sunetVacuum(); opresteLinisteaIncordata(); }
      return;
    }
  }
  freacaCuUnealta(acum);
}

/* Se ține apăsat: și ștersul, și răzuitul sunt mișcări lungi. O radieră apăsată
   o dată nu e o radieră, e o ștampilă. */
function freacaScena11() {
  if (stare !== 'carbune' || !cursor.apasat) return;
  freacaCuUnealta(performance.now());
}

function freacaCuUnealta(acum) {
  if (s11.faza !== 'carbune' && s11.faza !== 'relief') return;
  if (acum - s11.ultimaFrecare < 55) return;
  s11.ultimaFrecare = acum;
  const g = geomSala11();

  if (s11.faza === 'carbune') {
    if (inZonaBlocului(cursor.x, cursor.y)) return;   // blocul nu se șterge
    if (stergeCarbune(cursor.x, cursor.y, g.S * 0.075)) {
      facPraf(cursor.x, cursor.y, 3, true);
      if (audio) sunetRadiera(Math.min(1, 0.4 + cursor.viteza));
      aprindeLiniile();
    }
    return;
  }

  // faza 'relief': se razuie numai blocul
  if (!inZonaBlocului(cursor.x, cursor.y)) return;
  if (razuiestePasta(cursor.x, cursor.y, g.S * 0.055)) {
    facPraf(cursor.x, cursor.y, 2, false);
    if (Math.random() < 0.5) facFirimitura(cursor.x, cursor.y);
    if (audio) {
      sunetRazuire(Math.min(1, 0.4 + cursor.viteza));
      if (Math.random() < 0.25) sunetBulgareDePasta();
    }
  }
}

/* O linie se aprinde când cărbunele de deasupra ei s-a dus. Se verifică pe
   mijlocul ei: o linie descoperită pe jumătate încă nu se vede ca linie. */
function aprindeLiniile() {
  const linii = liniileAscunse();
  for (let k = 0; k < linii.length; k++) {
    if (s11.aprinse[k]) continue;
    const l = linii[k];
    let libere = 0;
    for (let q = 0; q <= 4; q++) {
      const x = intre(l.x0, l.x1, q / 4), y = intre(l.y0, l.y1, q / 4);
      const i = Math.floor((x / W) * OCHIURI_PERETE);
      const j = Math.floor((y / H) * OCHIURI_PERETE);
      if (i < 0 || j < 0 || i >= OCHIURI_PERETE || j >= OCHIURI_PERETE) { libere++; continue; }
      if (s11.celule[j][i] < 0.35) libere++;
    }
    if (libere >= 4) {
      s11.aprinse[k] = 1;
      if (audio) sunetLinieDescoperita(1200 + k * 90);
    }
  }
}

function cateLiniiAprinse() {
  let n = 0;
  for (const a of s11.aprinse) if (a) n++;
  return n;
}

/* ---------- CEASUL ---------- */
function actualizeazaCarbune(acum) {
  const dt = Math.max(0, Math.min(100, acum - (s11.ultimulCadru || acum)));
  s11.ultimulCadru = acum;
  tineLinisteaIncordata();
  actualizeazaPulberea(dt);

  if (s11.faza === 'intrare') {
    s11.limpezire = Math.min(1, s11.limpezire + dt / 1800);
    if (s11.limpezire >= 1) {
      s11.faza = 'carbune'; s11.t0 = acum;
      spuneScena11(T('carbune.stergeNegrul'), 8000);
    }
  }
  else if (s11.faza === 'carbune') {
    /* Rama se socotește numai din cele șaisprezece bucăți ale ei, nu din toată
       pânza de linii: pânza e răsplata pentru căutat, rama e condiția. Altfel ar
       fi trebuit frecat fiecare colț al sălii, iar sala s-ar fi terminat din
       oboseală, nu din înțelegere. */
    let dinRama = 0;
    for (let k = 0; k < 16; k++) if (s11.aprinse[k]) dinRama++;
    s11.rama = dinRama / 16;
    if (s11.rama >= 0.85) {
      s11.faza = 'relief'; s11.t0 = acum;
      if (audio) sunetDescoperire();
      spuneScena11(T('carbune.sapa'), 8000);
    }
  }
  else if (s11.faza === 'relief') {
    s11.buton = Math.max(0, Math.min(1, (sapatInMijloc() - 0.35) / 0.45));
    if (s11.buton >= 1) {
      s11.faza = 'buton'; s11.t0 = acum;
      if (audio) sunetDescoperire();
    }
  }
  else if (s11.faza === 'colaps') {
    s11.colaps = Math.min(1, s11.colaps + dt / 2900);
    if (s11.colaps >= 1) { s11.faza = 'iesire'; s11.t0 = acum; }
  }
  else if (s11.faza === 'iesire' && acum - s11.t0 > 1500) iesiDinCarbune(acum);
}

/* ---------- DESENUL ---------- */
function deseneazaLiniileDeLumina(c, acum) {
  const linii = liniileAscunse();
  c.save();
  c.lineCap = 'round';
  for (let k = 0; k < linii.length; k++) {
    const l = linii[k];
    const aprins = s11.aprinse[k] ? 1 : 0;
    const bat = 0.82 + 0.18 * Math.sin(acum * 0.0018 + k * 0.7);
    const gros = Math.max(1, Math.min(W, H) * 0.0035 * l.gros);

    /* Chiar și nedescoperite, liniile există sub cărbune — foarte stinse. Așa,
       când ștergi, nu apar din senin: se **dezvelesc**, iar asta e deosebirea
       dintre a descoperi și a inventa. */
    c.globalAlpha = aprins ? 0.95 * bat : 0.16;
    c.strokeStyle = LUMINA_LINIE;
    c.lineWidth = gros * (aprins ? 1 : 0.6);
    c.beginPath();
    c.moveTo(l.x0, l.y0);
    c.lineTo(l.x1, l.y1);
    c.stroke();

    if (aprins) {
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = 0.30 * bat;
      c.lineWidth = gros * 4.5;
      c.stroke();
      c.globalCompositeOperation = 'source-over';
    }
  }
  c.restore();
}

function deseneazaScena11(t, acum) {
  const g = geomSala11();

  if (s11.faza === 'colaps' || s11.faza === 'iesire') {
    deseneazaColapsul(acum);
    return;
  }

  // fundul sălii: ghips gol, peste care stau liniile și cărbunele
  /* Sub cărbune e negru curat, nu gri-închis. Câtă vreme fondul a fost aproape
     de culoarea cărbunelui, ștersul nu se vedea deloc: dădeai la o parte un negru
     și găseai alt negru. Contrastul absolut al sălii nu e un mofț de paletă — e
     singurul fel în care se înțelege că ai luat ceva. */
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  deseneazaLiniileDeLumina(ctx, acum);
  ctx.drawImage(pregatesteCarbunele(), 0, 0);

  /* Grosimea plăcii, înainte de fața ei: blocul nu e o imagine lipită pe perete, e
     o lespede care iese din el. Se vede muchia de jos și cea din dreapta — exact
     laturile pe care lumina din stânga sus le lasă în umbră.

     E cel mai ieftin lucru din toată sala și cel mai mult schimbă: o suprafață
     fără grosime rămâne un tablou, oricât relief ai desena pe ea. */
  const gr = g.S * 0.030;
  ctx.save();
  // umbra aruncată pe perete, dincolo de lespede
  const um = ctx.createLinearGradient(g.blocX, g.blocY + g.blocInalt + gr,
                                      g.blocX, g.blocY + g.blocInalt + gr + g.S * 0.13);
  um.addColorStop(0, 'rgba(0,0,0,0.85)');
  um.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = um;
  ctx.fillRect(g.blocX - g.S * 0.03, g.blocY + g.blocInalt + gr,
               g.blocLat + g.S * 0.09, g.S * 0.13);
  const uml = ctx.createLinearGradient(g.blocX + g.blocLat + gr, 0,
                                       g.blocX + g.blocLat + gr + g.S * 0.10, 0);
  uml.addColorStop(0, 'rgba(0,0,0,0.8)');
  uml.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = uml;
  ctx.fillRect(g.blocX + g.blocLat + gr, g.blocY - g.S * 0.01,
               g.S * 0.10, g.blocInalt + gr + g.S * 0.02);

  // latura de jos a lespezii
  const jos = ctx.createLinearGradient(0, g.blocY + g.blocInalt, 0, g.blocY + g.blocInalt + gr);
  jos.addColorStop(0, '#b6b4ac');
  jos.addColorStop(1, '#6d6b64');
  ctx.fillStyle = jos;
  ctx.beginPath();
  ctx.moveTo(g.blocX, g.blocY + g.blocInalt);
  ctx.lineTo(g.blocX + g.blocLat, g.blocY + g.blocInalt);
  ctx.lineTo(g.blocX + g.blocLat + gr, g.blocY + g.blocInalt + gr);
  ctx.lineTo(g.blocX + gr, g.blocY + g.blocInalt + gr);
  ctx.closePath();
  ctx.fill();
  // latura din dreapta
  const dr = ctx.createLinearGradient(g.blocX + g.blocLat, 0, g.blocX + g.blocLat + gr, 0);
  dr.addColorStop(0, '#c9c7c0');
  dr.addColorStop(1, '#83817a');
  ctx.fillStyle = dr;
  ctx.beginPath();
  ctx.moveTo(g.blocX + g.blocLat, g.blocY);
  ctx.lineTo(g.blocX + g.blocLat + gr, g.blocY + gr);
  ctx.lineTo(g.blocX + g.blocLat + gr, g.blocY + g.blocInalt + gr);
  ctx.lineTo(g.blocX + g.blocLat, g.blocY + g.blocInalt);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // fața lespezii
  ctx.drawImage(panzaBloc(acum), g.blocX, g.blocY, g.blocLat, g.blocInalt);

  // muchia de sus, luminată: acolo bate lumina
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(1, g.S * 0.0035);
  ctx.beginPath();
  ctx.moveTo(g.blocX, g.blocY);
  ctx.lineTo(g.blocX + g.blocLat, g.blocY);
  ctx.moveTo(g.blocX, g.blocY);
  ctx.lineTo(g.blocX, g.blocY + g.blocInalt);
  ctx.stroke();
  ctx.restore();

  deseneazaButonul(ctx, acum);
  deseneazaPulberea(ctx);

  if (s11.limpezire < 1) {
    ctx.save();
    ctx.globalAlpha = 1 - s11.limpezire;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  deseneazaVorba11(acum);
}

/* ---------- COLAPSUL ----------

   Tot muzeul e supt în buton. Nu se desenează muzeul din nou: se ia **imaginea
   sălii de dinainte**, se strânge spre gaură și se răsucește. Ce se prăbușește
   trebuie să fie chiar lucrul pe care tocmai îl priveai — altfel n-ar fi
   „muzeul care se strânge", ar fi o animație pusă peste el. */
const panzaColaps = { panza: null, latime: 0, inaltime: 0 };

function iaPozaSalii() {
  const p = panzaDeLucru(panzaColaps, Math.max(2, Math.round(W)),
                                      Math.max(2, Math.round(H)));
  const c = p.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.clearRect(0, 0, W, H);
  c.drawImage(panza, 0, 0);
  panzaColaps.latime = W; panzaColaps.inaltime = H;
  return p;
}

function deseneazaColapsul(acum) {
  const q = Math.min(1, s11.colaps);
  const e = atenuare(q);
  const b = loculButonului();

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  if (panzaColaps.panza) {
    /* Sala se strânge spre buton și se răsucește în drum. Cele două împreună
       fac aspirația: numai micșorată, ar părea că se îndepărtează; numai
       răsucită, că se învârte. Supt înseamnă amândouă deodată. */
    const scara = Math.max(0.001, 1 - e * 0.995);
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(e * 3.4);
    ctx.scale(scara, scara);
    ctx.translate(-b.x, -b.y);
    ctx.globalAlpha = 1 - Math.pow(q, 3.5);
    ctx.drawImage(panzaColaps.panza, 0, 0, W, H);
    ctx.restore();
  }

  /* Dârele care fug spre gaură: liniile pe care le lasă un lucru care trece
     repede pe lângă tine. Ele sunt tot ce transformă o micșorare într-o
     smulgere. */
  ctx.save();
  ctx.lineCap = 'round';
  for (let k = 0; k < 46; k++) {
    const a = samanta(7900 + k * 3.1), z = samanta(7960 + k * 7.7);
    const un = a * Math.PI * 2;
    const de = Math.max(W, H) * (0.10 + z * 0.75) * (1 - e * 0.92);
    const lung = Math.max(W, H) * 0.10 * e * (0.4 + z);
    ctx.globalAlpha = Math.min(1, e * 1.6) * (1 - q * 0.5) * (0.18 + z * 0.3);
    ctx.strokeStyle = k % 5 ? '#ffffff' : ROSU_BUTON;
    ctx.lineWidth = Math.max(0.8, Math.min(W, H) * 0.0024 * (0.4 + z));
    ctx.beginPath();
    ctx.moveTo(b.x + Math.cos(un) * (de + lung), b.y + Math.sin(un) * (de + lung));
    ctx.lineTo(b.x + Math.cos(un) * de, b.y + Math.sin(un) * de);
    ctx.stroke();
  }
  ctx.restore();

  // butonul rămâne ultimul, și se stinge și el
  const r = loculButonului().r * (1 - e * 0.85);
  ctx.save();
  ctx.globalAlpha = Math.max(0, 1 - q * 1.15);
  const cap = ctx.createRadialGradient(b.x - r * 0.3, b.y - r * 0.4, 0, b.x, b.y, r);
  cap.addColorStop(0, '#ff9aa0');
  cap.addColorStop(0.6, ROSU_BUTON);
  cap.addColorStop(1, '#6d0d14');
  ctx.fillStyle = cap;
  ctx.beginPath();
  ctx.arc(b.x, b.y, Math.max(0.5, r), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // la capăt, negru deplin
  ctx.save();
  ctx.globalAlpha = Math.pow(q, 2.4);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
