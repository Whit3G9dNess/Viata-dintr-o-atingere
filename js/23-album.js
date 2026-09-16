/* ---------- 23. ALBUMUL ----------

   Manualul custodelui are un articol pe care jucăria și-l călca:

     Art. 260 — Nimeni nu pleacă fără să lase o urmă.

   Și totuși pleca. Pictai pe manechinul din sala uleiului, săpai o formă în
   blocul de cărbune, rupeai peretele de colaj, creșteai o grădină întreagă din
   culorile sorbite de elefant — iar la capăt se spărgea globul și nu mai rămânea
   nimic din ele. Jucăria cerea urme și nu ținea niciuna.

   Acum ține. Cât stai într-o sală, jucăria îi face poze din trei în trei sferturi
   de secundă și o păstrează pe cea mai bună. La sfârșit, după ce cioburile
   globului se sting în mijlocul ecranului, se deschide un album și le arată pe
   toate — nu niște poze frumoase făcute de noi, ci **ce ai făcut tu în trecerea
   asta**. Două jucătoare care trec prin aceleași douăsprezece săli ies cu două
   albume care nu seamănă.

   Nu e un cadru ales de noi: e un cadru din ce ai văzut tu, ales după cât de
   multă viață are în el. O ilustrație ar fi fost aceeași pentru toată lumea.

   Pozele stau mici dinadins — trei sute șaizeci de pixeli pe lat. Douăsprezece
   pânze cât ecranul ar fi fost zeci de megaocteți ținuți degeaba, pe un
   calculator de școală, pentru o pagină care se vede treizeci de secunde. */

/* Sălile care ajung în album, în ordinea poveștii. Trecerile scurte —
   întunericul de la început, creșterea punctului, transformarea — nu sunt săli:
   n-ai ce lăsa în ele. */
const SALILE_DIN_ALBUM = [
  'balon', 'minge', 'muzeu', 'galerie', 'campie', 'foc',
  'gheata', 'ulei', 'acuarela', 'colaj', 'carbune', 'vid'
];

const LATIME_POZA = 360;        // pixeli, pe latul pozei

const POZE = {};                // sala → { panza, lat, inalt }
const ORDINEA_POZELOR = [];     // în ordinea în care ai trecut prin ele

/* ---------- CARE CADRU AJUNGE POZĂ ----------

   Prima dată, poza se lua la ieșirea din sală: ultimul cadru desenat acolo. Părea
   limpede, și ieșeau poze urâte — fiindcă ultimul cadru al unei săli **nu e
   sala**, e ieșirea din ea. Ceața care acoperă manechinul din sala uleiului,
   portalul care înghite sala de gheață, negrul spre care se stinge totul. Exact
   lucrul pe care nu-l ții minte dintr-o cameră.

   Acum se încearcă din trei în trei sferturi de secundă, cât stai în sală, și
   rămâne **cel mai bun cadru**, nu ultimul. „Cel mai bun" înseamnă cel cu cea mai
   multă viață în el: se măsoară cât de tare se bat între ele luminile și umbrele,
   și cât de colorat e. Un ecran care se stinge în negru n-are nici una, nici
   alta, și pierde. Sala plină de ce ai făcut tu câștigă.

   Iar cadrele mai noi au un mic avantaj: nota celui vechi scade puțin la fiecare
   încercare. O sală se umple pe măsură ce stai în ea — grădina crește, pictura se
   adună — deci, la două cadre la fel de bune, cel de mai târziu arată mai mult. */
const RITMUL_POZEI = 750;         // ms între două încercări
const SCADEREA_VECHIULUI = 0.97;  // cât pierde nota veche la fiecare încercare

const LATIME_JUDECATA = 64;       // pânza mică pe care se cântărește cadrul

let salaDinCadrulTrecut = null;
let ultimaIncercare = -1e9;
let panzaJudecata = null;

/* Prima citire de pixeli dintr-o pânză, oricât de mică ar fi ea, costă o sută
   șaizeci de milisecunde: abia atunci își pregătește browserul drumul de
   întoarcere dinspre placa video. Următoarele costă una și jumătate.

   Plătim datoria aici, la încărcarea paginii, când pe ecran e încă negru și
   nimeni n-are ce observa. Lăsată pe seama primei săli, ar fi fost o înțepenire
   de-o șesime de secundă în plin joc — și, mai rău, termometrul de fluență ar fi
   luat-o drept înec și ar fi coborât o treaptă de calitate. */
(function incalzesteCititulDePixeli() {
  try {
    panzaJudecata = document.createElement('canvas');
    panzaJudecata.width = 8;
    panzaJudecata.height = 8;
    panzaJudecata.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, 8, 8);
  } catch (e) {
    panzaJudecata = null;   // pânză falsă, la teste; nu se încălzește nimic
  }
})();

function incearcaPozaSalii(acum) {
  if (stare !== salaDinCadrulTrecut) {
    salaDinCadrulTrecut = stare;
    /* Vizită nouă, socoteală nouă: dacă treci a doua oară prin sală, poza de
       acum are voie s-o bată pe cea de la prima trecere. */
    if (POZE[stare]) POZE[stare].nota = -1;
    ultimaIncercare = -1e9;
  }
  if (SALILE_DIN_ALBUM.indexOf(stare) === -1) return;
  if (acum - ultimaIncercare < RITMUL_POZEI) return;
  ultimaIncercare = acum;
  pozeazaSala(stare);
}

/* Cât de multă viață e într-o poză: cât se bat luminile cu umbrele, plus cât e
   de colorată. Se numără din doisprezece în doisprezece pixeli — destul cât să
   se vadă diferența dintre o sală și un ecran care se stinge, și destul de puțin
   cât să nu coste nimic la o poză de trei sute șaizeci de pixeli. */
function cataViataEInPoza(c, lat, inalt) {
  let date;
  try {
    if (typeof c.getImageData !== 'function') return 1;
    date = c.getImageData(0, 0, lat, inalt).data;
  } catch (e) {
    return 1;   // pânză falsă, sau una pe care browserul n-o lasă citită
  }
  let n = 0, suma = 0, sumaPatrate = 0, culoare = 0;
  for (let i = 0; i < date.length; i += 4 * 12) {
    const r = date[i], g = date[i + 1], b = date[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    suma += lum;
    sumaPatrate += lum * lum;
    culoare += Math.max(r, g, b) - Math.min(r, g, b);
    n++;
  }
  if (!n) return 0;
  const medie = suma / n;
  const imprastiere = Math.sqrt(Math.max(0, sumaPatrate / n - medie * medie));
  return imprastiere + (culoare / n) * 0.5;
}

function pozeazaSala(care) {
  if (SALILE_DIN_ALBUM.indexOf(care) === -1) return;
  if (!W || !H) return;

  /* Nota se dă pe o pânză **mică de tot**, de șaizeci și patru de pixeli pe lat.
     Citirea pixelilor dintr-o pânză e scumpă — datele trebuie aduse înapoi din
     placa video — iar pe poza întreagă costa unsprezece milisecunde, adică mai
     mult decât un cadru. La fiecare trei sferturi de secundă, asta ar fi însemnat
     un sughiț regulat, și odată cu el coborârea unei trepte de calitate.

     Pe miniatură costă de o sută de ori mai puțin, și nota iese aceeași: luminile,
     umbrele și culoarea se văd la fel de bine dintr-o poză de-o unghie.
     `willReadFrequently` îi spune browserului să țină pânza asta în memoria
     obișnuită, nu în placa video, fiindcă oricum o citim mereu. */
  const latJ = LATIME_JUDECATA;
  const inaltJ = Math.max(1, Math.round(latJ * H / W));
  let judecata;
  try {
    if (!panzaJudecata) panzaJudecata = document.createElement('canvas');
    if (panzaJudecata.width !== latJ || panzaJudecata.height !== inaltJ) {
      panzaJudecata.width = latJ;
      panzaJudecata.height = inaltJ;
    }
    judecata = panzaJudecata.getContext('2d', { willReadFrequently: true });
    judecata.drawImage(panza, 0, 0, latJ, inaltJ);
  } catch (e) {
    /* O pânză de lățime zero, într-o clipă de redimensionare. Mai bine o poză
       lipsă decât un cadru căzut. */
    return;
  }
  const nota = cataViataEInPoza(judecata, latJ, inaltJ);

  let p = POZE[care];
  if (!p) {
    p = POZE[care] = { panza: document.createElement('canvas'), lat: 0, inalt: 0, nota: -1 };
    ORDINEA_POZELOR.push(care);
  }
  p.nota *= SCADEREA_VECHIULUI;
  if (p.lat && nota <= p.nota) return;

  /* Abia acum, când cadrul chiar e mai bun decât ce aveam, se face poza adevărată. */
  const lat = LATIME_POZA;
  const inalt = Math.max(1, Math.round(LATIME_POZA * H / W));
  try {
    if (p.panza.width !== lat || p.panza.height !== inalt) {
      p.panza.width = lat;
      p.panza.height = inalt;
    }
    p.panza.getContext('2d').drawImage(panza, 0, 0, lat, inalt);
  } catch (e) {
    return;
  }
  p.lat = lat;
  p.inalt = inalt;
  p.nota = nota;

  /* Cadrul în care s-a făcut poza nu se pune la socoteala fluenței: e scump o
     singură dată, iar termometrul l-ar lua drept înec. */
  if (typeof uitaCadrul === 'function') uitaCadrul();
}

function pozeleAlbumului() {
  return ORDINEA_POZELOR.filter(function (s) { return POZE[s] && POZE[s].lat > 0; });
}

/* ---------- STAREA ALBUMULUI ---------- */

/* Câte poze încap pe o pagină, și câte pagini se văd deodată.

   Pe lat — calculator, sau telefon culcat — albumul stă deschis ca o carte: două
   pagini alăturate, două poze pe fiecare. În picioare, pe telefon, cartea nu mai
   are unde: două pagini ar tăia lățimea în două, iar pozele au chiar forma
   ecranului, adică sunt și ele în picioare. Ieșeau patru fâșii înalte cât un
   deget, pierdute pe un ecran negru.

   Atunci se arată **o pagină și o poză**, mare cât ecranul. Nu mai e o carte
   deschisă, e un teanc de fotografii prin care treci una câte una — și ăsta e
   chiar felul în care te uiți la poze pe telefon. */
function albumulEDeschisCaOCarte() { return W > H * 1.05; }

const album = {
  deschidere: 0,      // 0 închis, 1 deschis de tot
  foaie: 0,           // a câta filă se vede (0 = prima)
  intoarcere: 0,      // cât e întoarsă fila de acum, 0 → 1
  chemare: 0,         // cât de tare pulsează semnul „mai departe"
  gata: false         // s-a ajuns la capăt
};

function pornesteAlbumul() {
  album.deschidere = 0;
  album.foaie = 0;
  album.intoarcere = 0;
  album.chemare = 0;
  album.gata = false;
}

function pozePeFila() {
  return albumulEDeschisCaOCarte() ? 4 : 1;
}

function cateFoi() {
  const n = pozeleAlbumului().length;
  return Math.max(1, Math.ceil(n / pozePeFila()));
}

function actualizeazaAlbumul(dt) {
  album.deschidere = Math.min(1, album.deschidere + dt / 900);
  album.chemare += dt / 1000;
  if (album.intoarcere > 0) {
    album.intoarcere = Math.min(1, album.intoarcere + dt / 700);
    if (album.intoarcere >= 1) {
      album.intoarcere = 0;
      album.foaie++;
      if (album.foaie >= cateFoi()) album.gata = true;
    }
  }
}

/* O atingere întoarce fila. La ultima, albumul se închide și rămâne numele. */
function atingeAlbumul() {
  if (album.deschidere < 0.85 || album.intoarcere > 0) return false;
  if (album.foaie >= cateFoi() - 1) { album.gata = true; return true; }
  album.intoarcere = 0.001;
  if (typeof sunetFosnetHartie === 'function') sunetFosnetHartie();
  return true;
}

/* ---------- DESENUL ---------- */

/* Măsurile albumului: două pagini alăturate, în mijlocul ecranului negru.
   Cotorul e la mijloc, iar fiecare pagină ține două poze una sub alta. */
function geomAlbum() {
  const carte = albumulEDeschisCaOCarte();
  let lat, inalt;
  if (carte) {
    lat = Math.min(W * 0.82, H * 1.35);
    inalt = lat * 0.62;
  } else {
    /* O pagină, o poză: pagina are forma ecranului, cu un pic în plus pentru
       margini, și se strânge dacă iese din înălțime. */
    lat = W * 0.86;
    inalt = lat * (H / W) * 1.1;
    const inaltMax = H * 0.8;
    if (inalt > inaltMax) { const k = inaltMax / inalt; inalt *= k; lat *= k; }
  }
  const pagini = carte ? 2 : 1;
  return {
    cx: W * 0.5, cy: H * 0.5,
    lat: lat, inalt: inalt,
    pagini: pagini,
    pePagina: carte ? 2 : 1,
    latPagina: lat / pagini,
    x0: W * 0.5 - lat * 0.5,
    y0: H * 0.5 - inalt * 0.5,
    /* Cotorul: la mijloc când sunt două pagini, la marginea din stânga când e
       una singură — de acolo se întoarce fila. */
    cotor: carte ? W * 0.5 : W * 0.5 - lat * 0.5
  };
}

function deseneazaAlbumul(t) {
  const poze = pozeleAlbumului();
  if (!poze.length) return;

  const g = geomAlbum();
  const desc = atenuare(album.deschidere);

  ctx.save();
  /* Albumul se ridică din locul în care s-au stins cioburile și se deschide.
     Nu apare pur și simplu: un lucru care apare e o fereastră, unul care se
     ridică e un obiect. */
  ctx.translate(g.cx, g.cy);
  ctx.scale(0.35 + 0.65 * desc, 0.35 + 0.65 * desc);
  ctx.globalAlpha = Math.min(1, album.deschidere * 1.6);
  ctx.translate(-g.cx, -g.cy);

  copertaAlbumului(g);

  const peFila = pozePeFila();
  const dela = album.foaie * peFila;
  if (g.pagini === 2) {
    deseneazaPagina(g, 'stanga', poze.slice(dela, dela + g.pePagina), 1);
    deseneazaPagina(g, 'dreapta', poze.slice(dela + g.pePagina, dela + peFila), 1);
  } else {
    deseneazaPagina(g, 'dreapta', poze.slice(dela, dela + peFila), 1);
  }

  /* Fila care se întoarce: pagina din dreapta se strânge spre cotor, iar sub ea
     se vede deja următoarea. Strânsă cu cosinusul, cum se strânge o foaie
     adevărată văzută din față. */
  if (album.intoarcere > 0) {
    const p = atenuare(album.intoarcere);
    const urmatoarea = (album.foaie + 1) * peFila;
    const subEa = g.pagini === 2
      ? poze.slice(urmatoarea + g.pePagina, urmatoarea + peFila)
      : poze.slice(urmatoarea, urmatoarea + peFila);
    deseneazaPagina(g, 'dreapta', subEa, 1);
    ctx.save();
    ctx.translate(g.cotor, 0);
    ctx.scale(Math.max(0.02, Math.cos(p * Math.PI * 0.5)), 1);
    ctx.translate(-g.cotor, 0);
    const ceSeIntoarce = g.pagini === 2
      ? poze.slice(dela + g.pePagina, dela + peFila)
      : poze.slice(dela, dela + peFila);
    deseneazaPagina(g, 'dreapta', ceSeIntoarce, 1 - p * 0.25);
    ctx.restore();
  }

  cotorulAlbumului(g);
  ctx.restore();

  if (!album.gata && album.deschidere > 0.9) semnulDeMaiDeparte(g);
}

/* Coperta: carton negru, cu o dungă de lumină pe muchie. Nu e neagră de tot —
   un negru plat pe un fond negru nu se vede deloc. */
function copertaAlbumului(g) {
  const umbra = ctx.createRadialGradient(g.cx, g.cy, g.lat * 0.1, g.cx, g.cy, g.lat * 0.8);
  umbra.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  umbra.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = umbra;
  ctx.fillRect(g.x0 - g.lat * 0.2, g.y0 - g.inalt * 0.3,
               g.lat * 1.4, g.inalt * 1.6);

  ctx.fillStyle = '#16161a';
  ctx.fillRect(g.x0 - g.lat * 0.012, g.y0 - g.inalt * 0.018,
               g.lat * 1.024, g.inalt * 1.036);
  ctx.strokeStyle = 'rgba(190, 185, 175, 0.22)';
  ctx.lineWidth = Math.max(1, ecran(1.2));
  ctx.strokeRect(g.x0 - g.lat * 0.012, g.y0 - g.inalt * 0.018,
                 g.lat * 1.024, g.inalt * 1.036);

  // foile dinăuntru, puțin mai deschise decât coperta
  ctx.fillStyle = '#1e1e22';
  ctx.fillRect(g.x0, g.y0, g.lat, g.inalt);
}

/* Cotorul: o dungă de umbră la mijloc, care face din două pagini o carte. */
function cotorulAlbumului(g) {
  if (g.pagini === 1) return;    // o singură pagină n-are cotor la mijloc
  const cot = ctx.createLinearGradient(g.cx - g.lat * 0.045, 0, g.cx + g.lat * 0.045, 0);
  cot.addColorStop(0, 'rgba(0, 0, 0, 0)');
  cot.addColorStop(0.5, 'rgba(0, 0, 0, 0.6)');
  cot.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = cot;
  ctx.fillRect(g.cx - g.lat * 0.045, g.y0, g.lat * 0.09, g.inalt);
}

function deseneazaPagina(g, parte, poze, alfa) {
  if (!poze.length) return;
  const x = (g.pagini === 2 && parte === 'dreapta') ? g.cx : g.x0;
  ctx.save();
  ctx.globalAlpha *= alfa;
  ctx.fillStyle = '#1e1e22';
  ctx.fillRect(x, g.y0, g.latPagina, g.inalt);

  const margine = g.latPagina * 0.09;
  const hLoc = (g.inalt - margine * (g.pePagina + 1)) / g.pePagina;
  for (let k = 0; k < poze.length; k++) {
    pozaInFolie(POZE[poze[k]],
                x + margine, g.y0 + margine + k * (hLoc + margine),
                g.latPagina - margine * 2, hLoc,
                poze[k]);
  }
  ctx.restore();
}

/* O poză în folia albumului: cartonul alb dedesubt, poza peste el, și un luciu
   subțire de plastic deasupra — foliile de album lucesc, și tocmai luciul ăla
   face diferența dintre „o poză lipită" și „o poză într-un album". */
function pozaInFolie(p, x, y, lat, inalt, samanta) {
  if (!p || !p.lat) return;

  /* Cât încape poza în locul ei, păstrându-și proporția — socotind **cartonul
     întreg**, nu numai imaginea. Cartonul e mai lat jos, ca la o poză instant, iar
     câtă vreme socoteala îl lăsa pe dinafară, poza se așeza prea jos în pagină și
     rămânea un gol deasupra ei. Se vedea urât mai ales pe telefon, unde o pagină
     ține o singură poză și golul era jumătate de ecran. */
  const RAMA_LATURI = 1.06, RAMA_JOS = 0.16;
  const k = Math.min(lat / (p.lat * RAMA_LATURI),
                     inalt / (p.inalt * (RAMA_LATURI + RAMA_JOS))) * 0.96;
  const pl = p.lat * k, pi = p.inalt * k;
  const blocLat = pl * RAMA_LATURI, blocInalt = pi * (RAMA_LATURI + RAMA_JOS);
  const px = x + (lat - blocLat) / 2 + pl * 0.03;
  const py = y + (inalt - blocInalt) / 2 + pi * 0.03;

  /* O înclinare mică, diferită de la o poză la alta, din numele sălii. Pozele
     puse perfect drept arată a catalog; cele înclinate, a album. */
  let s = 0;
  for (let i = 0; i < String(samanta).length; i++) s += String(samanta).charCodeAt(i);
  const unghi = ((s % 100) / 100 - 0.5) * 0.045;

  ctx.save();
  ctx.translate(px + pl / 2, py + pi / 2);
  ctx.rotate(unghi);
  ctx.translate(-pl / 2, -pi / 2);

  // umbra sub carton
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(-pl * 0.03 + ecran(2), -pi * 0.03 + ecran(3),
               pl * 1.06, pi * 1.06 + pi * 0.16);

  // cartonul alb al pozei, cu buza mai lată jos, ca la o poză instant
  ctx.fillStyle = '#efece4';
  ctx.fillRect(-pl * 0.03, -pi * 0.03, pl * 1.06, pi * 1.06 + pi * 0.16);

  ctx.drawImage(p.panza, 0, 0, pl, pi);

  // luciul foliei: o dungă lată, în diagonală
  const luciu = ctx.createLinearGradient(0, 0, pl, pi);
  luciu.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
  luciu.addColorStop(0.35, 'rgba(255, 255, 255, 0.04)');
  luciu.addColorStop(0.55, 'rgba(255, 255, 255, 0.10)');
  luciu.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = luciu;
  ctx.fillRect(0, 0, pl, pi);

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = Math.max(1, ecran(0.8));
  ctx.strokeRect(0, 0, pl, pi);
  ctx.restore();
}

/* Semnul că mai e o filă. Pulsează încet, ca îndemnurile din restul jucăriei —
   aceeași limbă a lucrurilor care se pot atinge. */
function semnulDeMaiDeparte(g) {
  const puls = 0.55 + 0.45 * Math.sin(album.chemare * 2.2);
  ctx.save();
  ctx.globalAlpha = 0.55 * puls;
  ctx.fillStyle = '#e8e2d4';
  ctx.beginPath();
  /* Săgeata stă lângă album, dar niciodată în afara ecranului: pe telefon
     albumul ține aproape toată lățimea. */
  const x = Math.min(g.x0 + g.lat + ecran(26), W - ecran(20));
  const y = g.cy, r = ecran(11);
  ctx.moveTo(x - r * 0.5, y - r);
  ctx.lineTo(x + r * 0.7, y);
  ctx.lineTo(x - r * 0.5, y + r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
