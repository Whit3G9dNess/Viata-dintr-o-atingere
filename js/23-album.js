/* ---------- 23. ALBUMUL ----------

   Manualul custodelui are un articol pe care jucăria și-l călca:

     Art. 260 — Nimeni nu pleacă fără să lase o urmă.

   Și totuși pleca. Pictai pe manechinul din sala uleiului, săpai o formă în
   blocul de cărbune, rupeai peretele de colaj, creșteai o grădină întreagă din
   culorile sorbite de elefant — iar la capăt se spărgea globul și nu mai rămânea
   nimic din ele. Jucăria cerea urme și nu ținea niciuna.

   Acum ține. La ieșirea din fiecare sală se face o poză: ultimul cadru desenat
   acolo, micșorat pe o pânză ascunsă. La sfârșit, după ce cioburile globului se
   sting în mijlocul ecranului, se deschide un album și le arată pe toate — nu
   niște poze frumoase făcute de noi, ci **ce ai făcut tu în trecerea asta**.
   Două jucătoare care trec prin aceleași douăsprezece săli ies cu două albume
   care nu seamănă.

   De ce ultimul cadru, și nu unul ales anume: fiindcă ultimul cadru al unei săli
   e chiar sala așa cum ai lăsat-o. Un cadru ales de noi ar fi fost o ilustrație;
   ăsta e o urmă.

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

/* Sala în care eram la cadrul trecut. Când se schimbă, pe pânză stă încă
   **ultimul cadru al sălii vechi** — nu s-a apucat nimeni să deseneze peste el.
   Ăla e momentul, și e singurul: un cadru mai târziu, sala veche nu mai există
   nicăieri. */
let salaDinCadrulTrecut = null;

function tineMinteSalaParasita() {
  if (stare === salaDinCadrulTrecut) return;
  if (salaDinCadrulTrecut !== null) pozeazaSala(salaDinCadrulTrecut);
  salaDinCadrulTrecut = stare;
}

function pozeazaSala(care) {
  if (SALILE_DIN_ALBUM.indexOf(care) === -1) return;
  if (!W || !H) return;

  let p = POZE[care];
  if (!p) {
    p = POZE[care] = { panza: document.createElement('canvas'), lat: 0, inalt: 0 };
    ORDINEA_POZELOR.push(care);
  }
  /* La al doilea tur se repictează peste prima poză. Cea nouă arată mai mult:
     e aceeași sală, dar cu tot ce ai mai adăugat între timp. */
  p.lat = LATIME_POZA;
  p.inalt = Math.max(1, Math.round(LATIME_POZA * H / W));
  p.panza.width = p.lat;
  p.panza.height = p.inalt;
  try {
    p.panza.getContext('2d').drawImage(panza, 0, 0, p.lat, p.inalt);
  } catch (e) {
    /* O pânză de lățime zero, într-o clipă de redimensionare. Mai bine o poză
       lipsă decât un cadru căzut. */
  }
}

function pozeleAlbumului() {
  return ORDINEA_POZELOR.filter(function (s) { return POZE[s] && POZE[s].lat > 0; });
}

/* ---------- STAREA ALBUMULUI ---------- */

const POZE_PE_PAGINA = 2;

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

function cateFoi() {
  const n = pozeleAlbumului().length;
  return Math.max(1, Math.ceil(n / (POZE_PE_PAGINA * 2)));
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
  const lat = Math.min(W * 0.82, H * 1.35);
  const inalt = lat * 0.62;
  return {
    cx: W * 0.5, cy: H * 0.5,
    lat: lat, inalt: inalt,
    latPagina: lat * 0.5,
    x0: W * 0.5 - lat * 0.5,
    y0: H * 0.5 - inalt * 0.5
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

  const dela = album.foaie * POZE_PE_PAGINA * 2;
  deseneazaPagina(g, 'stanga', poze.slice(dela, dela + POZE_PE_PAGINA), 1);
  deseneazaPagina(g, 'dreapta', poze.slice(dela + POZE_PE_PAGINA, dela + POZE_PE_PAGINA * 2), 1);

  /* Fila care se întoarce: pagina din dreapta se strânge spre cotor, iar sub ea
     se vede deja următoarea. Strânsă cu cosinusul, cum se strânge o foaie
     adevărată văzută din față. */
  if (album.intoarcere > 0) {
    const p = atenuare(album.intoarcere);
    const urmatoarea = (album.foaie + 1) * POZE_PE_PAGINA * 2;
    deseneazaPagina(g, 'dreapta', poze.slice(urmatoarea + POZE_PE_PAGINA,
                                             urmatoarea + POZE_PE_PAGINA * 2), 1);
    ctx.save();
    ctx.translate(g.cx, 0);
    ctx.scale(Math.max(0.02, Math.cos(p * Math.PI * 0.5)), 1);
    ctx.translate(-g.cx, 0);
    deseneazaPagina(g, 'dreapta', poze.slice(dela + POZE_PE_PAGINA,
                                             dela + POZE_PE_PAGINA * 2), 1 - p * 0.25);
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
  const cot = ctx.createLinearGradient(g.cx - g.lat * 0.045, 0, g.cx + g.lat * 0.045, 0);
  cot.addColorStop(0, 'rgba(0, 0, 0, 0)');
  cot.addColorStop(0.5, 'rgba(0, 0, 0, 0.6)');
  cot.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = cot;
  ctx.fillRect(g.cx - g.lat * 0.045, g.y0, g.lat * 0.09, g.inalt);
}

function deseneazaPagina(g, parte, poze, alfa) {
  if (!poze.length) return;
  const x = parte === 'stanga' ? g.x0 : g.cx;
  ctx.save();
  ctx.globalAlpha *= alfa;
  ctx.fillStyle = '#1e1e22';
  ctx.fillRect(x, g.y0, g.latPagina, g.inalt);

  const margine = g.latPagina * 0.09;
  const hLoc = (g.inalt - margine * (POZE_PE_PAGINA + 1)) / POZE_PE_PAGINA;
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

  // cât încape poza în locul ei, păstrându-și proporția
  const k = Math.min(lat / p.lat, inalt / p.inalt) * 0.9;
  const pl = p.lat * k, pi = p.inalt * k;
  const px = x + (lat - pl) / 2, py = y + (inalt - pi) / 2;

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
  const x = g.x0 + g.lat + ecran(26), y = g.cy, r = ecran(11);
  ctx.moveTo(x - r * 0.5, y - r);
  ctx.lineTo(x + r * 0.7, y);
  ctx.lineTo(x - r * 0.5, y + r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
