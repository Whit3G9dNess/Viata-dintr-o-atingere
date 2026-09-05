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
const CARBUNE       = '#0d0d10';
const CARBUNE_MAT   = '#17171c';
const CARBUNE_PRAF  = '#2b2b33';
const GHIPS         = '#f2f1ec';
const GHIPS_UMBRA   = '#b9b8b2';
const GHIPS_ADANC   = '#77766f';
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
  s11.pasta = [];
  for (let j = 0; j < OCHIURI_BLOC; j++) {
    const r = [];
    for (let i = 0; i < OCHIURI_BLOC; i++) {
      const val = 0.78
        + 0.11 * Math.sin(i * 0.91 + j * 0.37)
        + 0.07 * Math.sin(i * 2.13 - j * 1.71)
        + 0.05 * Math.sin(i * 0.43 + j * 3.07)
        + samanta(i * 31.7 + j * 13.3) * 0.10;
      r.push(Math.max(0.45, Math.min(1, val)));
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
  fond.addColorStop(0, '#2a2a32');
  fond.addColorStop(0.5, CARBUNE_PRAF);
  fond.addColorStop(1, '#222229');
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
  // firele de praf care stau pe suprafață
  c.globalAlpha = 1;
  for (let k = 0; k < 1400; k++) {
    const a = samanta(7300 + k * 3.7), b = samanta(7360 + k * 5.9);
    const e = samanta(7420 + k * 2.3);
    c.globalAlpha = 0.05 + e * 0.16;
    c.fillStyle = e > 0.7 ? '#3d3d47' : '#000000';
    c.fillRect(a * W, b * H, 1 + e * 2, 1 + (1 - e) * 2);
  }
  c.globalAlpha = 1;
  panzaCarbunelui.latime = W; panzaCarbunelui.inaltime = H;
  return p;
}

/* Radiera: șterge din pânza de cărbune și scade ochiurile de sub ea. */
function stergeCarbune(x, y, raza) {
  if (!panzaCarbunelui.panza) return false;
  const c = panzaCarbunelui.panza.getContext('2d');
  c.save();
  c.globalCompositeOperation = 'destination-out';
  /* Marginea ștersăturii nu e netedă: cauciucul lasă o margine roasă, cu praf
     rămas pe ea. De-aia se șterge cu un degrade, nu cu un cerc plin. */
  const g = c.createRadialGradient(x, y, 0, x, y, raza);
  g.addColorStop(0, 'rgba(0,0,0,1)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.92)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g;
  c.fillRect(x - raza, y - raza, raza * 2, raza * 2);
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

/* Pânza mică pe care se socotește lumina, un pixel de fiecare ochi. */
const panzaLuminii = { panza: null, latime: 0, inaltime: 0 };

function pictezaBlocul(c, lat, inalt) {
  /* Relieful se pictează întâi **minúscul** — un pixel de ochi — și pe urmă se
     întinde peste tot blocul, lăsând browserul să netezească între pixeli.

     Prima oară desenasem fiecare ochi ca pe un dreptunghi de-a dreptul pe bloc, și
     ieșea un zid de cărămidă: douăzeci și două pe douăzeci și două de pătrate cu
     muchii drepte. Pasta n-are muchii drepte nicăieri — are pante. Și o pantă
     desenată din pătrate rămâne o scară, oricâte nuanțe i-ai da.

     Crestele, în schimb, se trag **după** întindere și la mărimea adevărată: ele
     trebuie să fie tăioase, fiindcă asta lasă șpaclul în urma lui. Neted peste tot
     și ascuțit pe creste: exact ce e pasta de relief. */
  const N = OCHIURI_BLOC;
  const mic = panzaDeLucru(panzaLuminii, N, N);
  const mc = mic.getContext('2d');
  mc.setTransform(1, 0, 0, 1, 0, 0);
  mc.globalAlpha = 1;
  mc.clearRect(0, 0, N, N);

  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const h = s11.pasta[j][i];
      if (h <= 0.02) { mc.fillStyle = '#08080a'; mc.fillRect(i, j, 1, 1); continue; }
      /* Lumina vine din stânga sus, ca peste tot în jucărie. O pantă întoarsă
         spre ea e albă, una întoarsă de la ea e cenușie — și asta e tot ce
         înseamnă relief pe un ecran. */
      const panta = (grosimeaPastei(i - 1, j) - grosimeaPastei(i + 1, j)) * 1.0 +
                    (grosimeaPastei(i, j - 1) - grosimeaPastei(i, j + 1)) * 1.0;
      const catre = Math.max(-1, Math.min(1, panta * 2.6));
      const baza = catre > 0 ? amesteca(GHIPS, '#ffffff', catre * 0.9)
                             : amesteca(GHIPS, GHIPS_ADANC, -catre * 1.0);
      // câtă pastă a mai rămas: când se subțiază, se vede golul de dedesubt
      mc.fillStyle = amesteca('#14141a', baza, Math.min(1, 0.18 + h * 1.05));
      mc.fillRect(i, j, 1, 1);
    }
  }

  c.imageSmoothingEnabled = true;
  c.drawImage(mic, 0, 0, N, N, 0, 0, lat, inalt);

  // crestele tăioase, la mărimea adevărată
  const pw = lat / N, ph = inalt / N;
  c.save();
  c.lineCap = 'round';
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const h = s11.pasta[j][i];
      if (h <= 0.25) continue;
      const sus = grosimeaPastei(i, j - 1), jos = grosimeaPastei(i, j + 1);
      if (h - sus < 0.06) continue;                 // nu e creastă
      const x = i * pw, y = j * ph;
      c.globalAlpha = Math.min(0.9, (h - sus) * 3.2) * h;
      c.strokeStyle = '#ffffff';
      c.lineWidth = Math.max(1, ph * 0.16);
      c.beginPath();
      c.moveTo(x, y + ph * 0.12);
      c.lineTo(x + pw, y + ph * 0.12);
      c.stroke();
      if (h - jos > 0.06) {
        c.globalAlpha = Math.min(0.7, (h - jos) * 2.6) * h;
        c.strokeStyle = '#3c3c42';
        c.lineWidth = Math.max(1, ph * 0.20);
        c.beginPath();
        c.moveTo(x, y + ph * 0.92);
        c.lineTo(x + pw, y + ph * 0.92);
        c.stroke();
      }
    }
  }
  c.restore();

  /* Găurile: unde pasta s-a dus de tot, se vede golul. Ele se taie **după**
     netezire și cu margine ascuțită — o gaură netezită arată a pată, iar aici
     tocmai muchia spune că materia a fost ruptă, nu ștearsă. */
  c.save();
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      if (s11.pasta[j][i] > 0.06) continue;
      const x = i * pw, y = j * ph;
      c.fillStyle = '#06060a';
      c.beginPath();
      for (let q = 0; q <= 7; q++) {
        const a = (q / 7) * Math.PI * 2;
        const z = samanta(i * 31.1 + j * 17.7 + q * 3.3);
        const r = pw * (0.52 + z * 0.34);
        const px = x + pw * 0.5 + Math.cos(a) * r;
        const py = y + ph * 0.5 + Math.sin(a) * r * (ph / pw);
        if (q === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
      /* Buza ruptă se luminează **numai pe marginea găurii**, adică acolo unde
         deasupra a mai rămas pastă. Trasată la fiecare ochi gol, ieșeau dungi
         albe pe toată lățimea craterului — blocul săpat arăta a jaluzele. O buză
         e o margine; un șir de buze una sub alta nu mai e nimic. */
      if (grosimeaPastei(i, j - 1) > 0.06) {
        c.globalAlpha = 0.6;
        c.strokeStyle = '#ffffff';
        c.lineWidth = Math.max(0.8, ph * 0.14);
        c.beginPath();
        c.moveTo(x, y + ph * 0.06);
        c.lineTo(x + pw, y + ph * 0.06);
        c.stroke();
        c.globalAlpha = 1;
      }
    }
  }
  c.restore();

  // granulația ghipsului
  c.globalAlpha = 0.45;
  for (let k = 0; k < 900; k++) {
    const a = samanta(7600 + k * 3.1), b = samanta(7660 + k * 7.7);
    const e = samanta(7720 + k * 5.3);
    const i = Math.floor(a * N), j = Math.floor(b * N);
    if (s11.pasta[j] === undefined || s11.pasta[j][i] <= 0.08) continue;
    c.fillStyle = e > 0.5 ? '#ffffff' : '#8e8d87';
    c.fillRect(a * lat, b * inalt, 1 + e, 1 + e);
  }
  c.globalAlpha = 1;
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
    c.fillText('APASĂ-MĂ', b.x, b.y - marime * 0.55);
    c.fillText('IAR', b.x, b.y + marime * 0.62);
    c.fillStyle = 'rgba(255, 214, 216, 0.92)';
    c.fillText('APASĂ-MĂ', b.x, b.y - marime * 0.55 - Math.max(1, r * 0.02));
    c.fillText('IAR', b.x, b.y + marime * 0.62 - Math.max(1, r * 0.02));
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
    // șpaclul: o lamă lată de metal, cu mâner
    const w = S * 0.070, h = S * 0.030;
    ctx.fillStyle = 'rgba(10,10,12,0.45)';
    ctx.beginPath();
    ctx.moveTo(-w * 0.46, -h * 0.14);
    ctx.lineTo(w * 0.30, -h * 0.44);
    ctx.lineTo(w * 0.30, h * 0.30);
    ctx.lineTo(-w * 0.46, h * 0.44);
    ctx.closePath();
    ctx.fill();
    const otel = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
    otel.addColorStop(0, '#f0f2f5');
    otel.addColorStop(0.42, '#aeb3ba');
    otel.addColorStop(0.6, '#dfe3e8');
    otel.addColorStop(1, '#70757c');
    ctx.fillStyle = otel;
    ctx.beginPath();
    ctx.moveTo(-w * 0.52, -h * 0.30);
    ctx.lineTo(w * 0.24, -h * 0.58);
    ctx.lineTo(w * 0.24, h * 0.16);
    ctx.lineTo(-w * 0.52, h * 0.30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5c6067';
    ctx.lineWidth = Math.max(1, S * 0.0014);
    ctx.stroke();
    // mânerul de lemn
    ctx.fillStyle = '#3a3129';
    dreptunghiIn(ctx, w * 0.24, -h * 0.40, w * 0.34, h * 0.62, h * 0.16);
    ctx.fill();
    // pasta rămasă pe lamă
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = GHIPS;
    ctx.fillRect(-w * 0.52, -h * 0.28, w * 0.14, h * 0.54);
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
  opresteLinisteaIncordata();
  opresteNatura();
  pregatesteMateriaSalii();
  s11.faza = 'intrare';
  /* Muzeul uită că a fost văzut: a fost supt în buton cu tot cu galerii, deci de
     data asta se deschide din nou de la capăt. */
  s3.vizitat = false;
  pocnetulBalonului = null;
  incepeJucaria(acum);
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
      spuneScena11('Șterge negrul. Sub el a rămas ceva.', 8000);
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
      spuneScena11('Rama arată unde. Sapă în bloc.', 8000);
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

  // blocul din mijloc
  ctx.drawImage(panzaBloc(acum), g.blocX, g.blocY, g.blocLat, g.blocInalt);
  /* Umbra pe care blocul o aruncă pe perete: fără ea, el ar părea desenat pe
     perete, iar sala are nevoie să se vadă că e un **volum** în cameră. */
  ctx.save();
  ctx.globalAlpha = 0.5;
  const um = ctx.createLinearGradient(g.blocX, g.blocY + g.blocInalt,
                                      g.blocX, g.blocY + g.blocInalt + g.S * 0.09);
  um.addColorStop(0, 'rgba(0,0,0,0.75)');
  um.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = um;
  ctx.fillRect(g.blocX - g.S * 0.02, g.blocY + g.blocInalt,
               g.blocLat + g.S * 0.04, g.S * 0.09);
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
