/* =====================================================================
   SCENA 5 — PÂNZA URIAȘĂ ȘI CEI ZECE PAȘI ÎNAPOI
   ---------------------------------------------------------------------
   Intri și nu vezi decât pixeli. Se retrag și rămâne o sală albă cu o pânză
   uriașă, tot pixelată. Pe podea, două tălpi și o poruncă: fă zece pași în
   spate. Cu fiecare pas, tabloul se micșorează pe ecran și se limpezește — asta
   e toată scena: nu te apropii ca să vezi mai bine, te depărtezi.

   Când ajungi la zece, cei trei țărani din tablou prind viață, îți fac cu mâna
   și te strigă. Pe urmă se duc la hambarul de alături și-i deschid ușile.

   Pictura e impresionistă: tușe scurte, așezate pe direcții, cald lângă rece,
   auriu lângă violet. Se pictează o dată pe o pânză ascunsă.
   ===================================================================== */
const PASI_INAPOI = 10;

/* Sala: perete deschis până la o linie de podea, ca într-un muzeu adevărat.
   Pânza atârnă pe perete într-o ramă aurită — nu una desenată, ci aceeași
   sculptură de brâuri din galeria a patra, cu profilul subțiat cât să se
   potrivească unei pânze mari. Pe podea, în locul de unde se privește, o
   pereche de pantofi. */
const PERETE_SALII = '#f4f3ef';
const PODEA_SALII = '#d8d5cc';
const PANTOFI_SALII = '#241d26';

/* Cât din lățimea ramei ține profilul aurit, și cât iese înălțimea ei din
   lățime. A doua se socotește din prima și din forma pânzei, o dată, aici:
   dacă cele două ar fi calculate în locuri diferite, rama și pânza ar începe
   să alunece una față de alta la fiecare schimbare. */
const PROFIL_RAMEI = 0.075;
const INALT_PE_LAT_RAMA = (1 - 2 * PROFIL_RAMEI) * (470 / 760) + 2 * PROFIL_RAMEI;

const ramaMare = { panza: null, marg: 0, latime: 0, inaltime: 0 };

/* Rama mare se pictează o singură dată, la o mărime de referință, și pe urmă se
   întinde cât trebuie. Sculptată din nou la fiecare cadru, ar costa cât toată
   scena — brâurile ei sunt sute de ornamente. */
function pregatesteRamaMare() {
  if (ramaMare.panza) return ramaMare;
  const lat = 1024, inalt = Math.round(lat * INALT_PE_LAT_RAMA);
  const marg = Math.round(lat * PROFIL_RAMEI);      // loc pentru cartușele din colțuri
  const p = document.createElement('canvas');
  p.width = lat + marg * 2; p.height = inalt + marg * 2;
  const pc = p.getContext('2d');
  pictezaRama(pc, { ramaX: p.width / 2, ramaY: p.height / 2, ramaW: lat, ramaH: inalt },
              1, PROFIL_RAMEI);
  /* Golim deschiderea. Rama se pictează pe toată întinderea ei, cu aur și pe
     dinăuntru, fiindcă în galeria a patra peste mijloc vine pânza însăși. Aici
     rama se așază deasupra picturii, așa că prin mijlocul ei trebuie să se vadă.
     Tăiem exact la marginea profilului: brâul cel mai dinăuntru, cu frunzulițe,
     stă ceva mai în afară și rămâne întreg. */
  const gol = Math.round(lat * PROFIL_RAMEI);
  pc.clearRect(marg + gol, marg + gol, lat - gol * 2, inalt - gol * 2);
  ramaMare.panza = p; ramaMare.marg = marg;
  ramaMare.latime = lat; ramaMare.inaltime = inalt;
  return ramaMare;
}

/* Perechea de pe podea, în locul de unde se privește. Se desenează la urmă,
   peste tot ce e pe ecran: cât timp lucrarea acoperă totul, pantofii sunt
   singurul lucru care spune unde stai. Ascunși sub ea, nu-i vedea nimeni tocmai
   la începutul scenei, când e cea mai mare nevoie de ei. */
function pantofiiDePeJos() {
  const lung = Math.min(W, H) * 0.17;
  for (const lats of [-1, 1]) {
    ctx.save();
    ctx.translate(W * 0.5 + lats * lung * 0.3, H - lung * 0.5);
    ctx.rotate(lats * 0.13);
    pantofElegant(ctx, lung);
    ctx.restore();
  }
}

/* Un pantof elegant, văzut de sus și puțin din spate: vârful ascuțit înainte,
   spre lucrare, decolteul deschis spre privitor, tocul în urmă. Urmele de tălpi
   goale nu se vedeau pe podeaua deschisă — un pantof lăcuit se vede. */
function pantofElegant(c, lung) {
  const L = lung, l = lung * 0.38;
  // umbra de sub el
  c.fillStyle = 'rgba(60, 52, 40, 0.22)';
  c.beginPath();
  c.ellipse(l * 0.08, L * 0.1, l * 0.62, L * 0.46, 0.05, 0, Math.PI * 2);
  c.fill();

  // trupul pantofului, dintr-un contur: vârf ascuțit, talie strânsă, călcâi rotund
  const lac = c.createLinearGradient(-l * 0.5, -L * 0.5, l * 0.5, L * 0.5);
  lac.addColorStop(0, '#3a3140');
  lac.addColorStop(0.35, PANTOFI_SALII);
  lac.addColorStop(1, '#120e14');
  c.fillStyle = lac;
  c.beginPath();
  c.moveTo(0, -L * 0.52);
  c.bezierCurveTo(l * 0.34, -L * 0.44, l * 0.46, -L * 0.14, l * 0.40, L * 0.06);
  c.bezierCurveTo(l * 0.36, L * 0.24, l * 0.42, L * 0.38, l * 0.34, L * 0.46);
  c.quadraticCurveTo(0, L * 0.58, -l * 0.34, L * 0.46);
  c.bezierCurveTo(-l * 0.42, L * 0.38, -l * 0.36, L * 0.24, -l * 0.40, L * 0.06);
  c.bezierCurveTo(-l * 0.46, -L * 0.14, -l * 0.34, -L * 0.44, 0, -L * 0.52);
  c.closePath();
  c.fill();

  // decolteul: gura pantofului, mai întunecată, cu marginea lucioasă
  c.fillStyle = '#0c090e';
  c.beginPath();
  c.ellipse(0, L * 0.2, l * 0.27, L * 0.19, 0, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = 'rgba(226, 214, 232, 0.5)';
  c.lineWidth = Math.max(1, L * 0.014);
  c.beginPath();
  c.ellipse(0, L * 0.2, l * 0.27, L * 0.19, 0, 0, Math.PI * 2);
  c.stroke();

  // lumina de pe boltă, semnul lacului
  const luciu = c.createLinearGradient(-l * 0.3, -L * 0.4, l * 0.1, L * 0.05);
  luciu.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
  luciu.addColorStop(1, 'rgba(255, 255, 255, 0)');
  c.fillStyle = luciu;
  c.beginPath();
  c.ellipse(-l * 0.13, -L * 0.2, l * 0.16, L * 0.2, -0.12, 0, Math.PI * 2);
  c.fill();
  // sclipirea din vârf
  c.fillStyle = 'rgba(255, 255, 255, 0.4)';
  c.beginPath();
  c.ellipse(0, -L * 0.42, l * 0.1, L * 0.055, 0, 0, Math.PI * 2);
  c.fill();

  // tocul, ivit în spatele călcâiului
  c.fillStyle = '#0f0b11';
  c.beginPath();
  c.moveTo(-l * 0.12, L * 0.5);
  c.lineTo(l * 0.12, L * 0.5);
  c.lineTo(l * 0.07, L * 0.72);
  c.lineTo(-l * 0.07, L * 0.72);
  c.closePath();
  c.fill();
}

const s5 = {
  faza: 'pixeli', t0: 0, ultimulCadru: 0, buzunar: 0,
  pasi: 0, claritate: 0, latimeTablou: 0,
  usi: 0, plecare: 0
};

const tabloul = { panza: null, latime: 0, inaltime: 0 };
const compunerea = { panza: null };
const marunt = { panza: null };

/* ---- pictura ---- */

// O tușă: o dâră scurtă de culoare, așezată pe o direcție anume.
function tusa(c, x, y, lung, gros, unghi, culoare, alfa) {
  c.save();
  c.globalAlpha = alfa === undefined ? 1 : alfa;
  c.translate(x, y);
  c.rotate(unghi);
  c.fillStyle = culoare;
  c.beginPath();
  c.ellipse(0, 0, lung / 2, gros / 2, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

// Un aleator cu sămânță: tușele stau pe loc de la o repictare la alta.
function samanta(i) {
  const x = Math.sin(i * 91.7 + 13.1) * 47563.11;
  return x - Math.floor(x);
}

/* Un câmp de tușe: peste o zonă dreptunghiulară se așază sute de dâre scurte,
   toate pe aceeași direcție, cu culori luate dintr-o paletă. De aici vine
   „impresia" — de aproape sunt pete, de departe e grâu. */
function campDeTuse(c, x, y, w, h, cate, unghi, imprastiere, lung, gros, paleta, start) {
  for (let k = 0; k < cate; k++) {
    const a = samanta(start + k * 3.1), b = samanta(start + k * 7.7);
    const u = samanta(start + k * 5.3);
    tusa(c, x + a * w, y + b * h,
         lung * (0.6 + u * 0.8), gros * (0.7 + a * 0.6),
         unghi + (u - 0.5) * imprastiere,
         paleta[Math.floor(b * paleta.length) % paleta.length],
         0.55 + u * 0.4);
  }
}

function pictezaTablou(c, w, h) {
  const oriz = h * 0.44;

  // cerul: cald sus-stânga, rece spre dreapta — contrast simultan
  const cer = c.createLinearGradient(0, 0, w, oriz);
  cer.addColorStop(0, '#f6d9a8');
  cer.addColorStop(0.45, '#eec8b0');
  cer.addColorStop(1, '#b9c8dd');
  c.fillStyle = cer; c.fillRect(0, 0, w, oriz);
  campDeTuse(c, 0, 0, w, oriz, 260, -0.12, 0.5, w * 0.05, h * 0.016,
             ['#fbe6bd', '#f3c9a2', '#e8b8b0', '#cdd6e6', '#f7ead0'], 11);

  // soarele jos, spre stânga: pata caldă de care atârnă toată lumina
  const soare = c.createRadialGradient(w * 0.24, oriz * 0.52, 0, w * 0.24, oriz * 0.52, w * 0.3);
  soare.addColorStop(0, 'rgba(255, 244, 206, 0.9)');
  soare.addColorStop(1, 'rgba(255, 244, 206, 0)');
  c.fillStyle = soare; c.fillRect(0, 0, w, oriz);

  // dealurile din zare, în violet-albastru — recele care ține caldul în frâu
  campDeTuse(c, 0, oriz - h * 0.07, w, h * 0.09, 150, 0.06, 0.4, w * 0.055, h * 0.02,
             ['#9a94c4', '#8fa3c8', '#a99bc0', '#7f8fb4'], 71);

  // grâul: tușe pe diagonală, aur lângă violet
  const camp = c.createLinearGradient(0, oriz, 0, h);
  camp.addColorStop(0, '#d9b768');
  camp.addColorStop(1, '#b98f3f');
  c.fillStyle = camp; c.fillRect(0, oriz, w, h - oriz);
  campDeTuse(c, 0, oriz, w, h - oriz, 900, -0.95, 0.55, h * 0.055, h * 0.012,
             ['#f2d489', '#e0b45e', '#c99a45', '#a97c33', '#8d6f8e', '#6f6b96',
              '#f7e6ae', '#d9a94f'], 131);

  // cărarea care intră în tablou
  campDeTuse(c, w * 0.3, oriz + h * 0.06, w * 0.22, h * 0.5, 220, 1.15, 0.4,
             h * 0.05, h * 0.014, ['#e8cfa0', '#d6b681', '#c3a273', '#efe0bb'], 211);

  // hambarul din dreapta: trupul lui, fără uși
  const hx = w * 0.7, hy = oriz - h * 0.03, hw = w * 0.24, hh = h * 0.34;
  campDeTuse(c, hx, hy, hw, hh, 260, 1.5, 0.3, h * 0.045, h * 0.016,
             ['#a4553f', '#8e4634', '#b96b4c', '#7a3a2c', '#c07a55'], 307);
  // acoperișul
  c.fillStyle = '#5d4033';
  c.beginPath();
  c.moveTo(hx - hw * 0.1, hy);
  c.lineTo(hx + hw * 0.5, hy - hh * 0.34);
  c.lineTo(hx + hw * 1.1, hy);
  c.closePath(); c.fill();
  campDeTuse(c, hx - hw * 0.1, hy - hh * 0.34, hw * 1.2, hh * 0.36, 120, -0.3, 0.4,
             h * 0.04, h * 0.014, ['#6d4c3c', '#54382c', '#7f5b47'], 401);
  // golul ușii, în care se vor deschide canaturile
  c.fillStyle = '#3a281f';
  c.fillRect(hx + hw * 0.26, hy + hh * 0.3, hw * 0.48, hh * 0.7);

  // câțiva plopi în stânga
  for (let k = 0; k < 3; k++) {
    const px = w * (0.06 + k * 0.07);
    campDeTuse(c, px, oriz - h * 0.22 + k * h * 0.02, w * 0.035, h * 0.26, 90, 0.1, 0.5,
               h * 0.03, h * 0.014, ['#6f8a52', '#587244', '#87a066', '#465e39'], 500 + k * 37);
  }

  // lumina care trece peste tot, la sfârșit: unifică tușele
  const suflu = c.createLinearGradient(w * 0.2, 0, w, h);
  suflu.addColorStop(0, 'rgba(255, 236, 190, 0.22)');
  suflu.addColorStop(0.6, 'rgba(255, 236, 190, 0)');
  suflu.addColorStop(1, 'rgba(120, 110, 160, 0.16)');
  c.fillStyle = suflu; c.fillRect(0, 0, w, h);
}

function pregatesteTablou() {
  if (tabloul.panza) return tabloul;
  const w = 760, h = 470;
  const p = document.createElement('canvas');
  p.width = w; p.height = h;
  pictezaTablou(p.getContext('2d'), w, h);
  tabloul.panza = p; tabloul.latime = w; tabloul.inaltime = h;
  return tabloul;
}

/* ---- cei trei țărani și ușile hambarului, desenați vii ---- */

/* Portul, cu culorile lui adevărate. Ele sunt tot ce trebuie ca o siluetă să fie
   recunoscută: pânza nealbită a iei, roșul catrinței, negrul pălăriei și al
   pieptarului, aurul găitanului. Fără ele, un om în tablou e un om de oriunde. */
const PORT_ROMANESC = {
  panza:  '#f1e9d8',      // cămașa și ia, din pânză de casă
  umbra:  '#d9cdb4',      // cutele pânzei
  rosu:   '#a8232b',      // roșul catrinței și al altiței
  visin:  '#7d1a22',      // roșul închis dintre dungi
  negru:  '#1c1714',      // pălăria, pieptarul, dungile negre
  aur:    '#c9a227',      // găitanul și firul galben din catrință
  albastru: '#26418f',    // dunga albastră care se vede la unele catrințe
  piele:  '#dcb389',      // fața și mâinile
  opinca: '#6b4a2f'       // opincile și chimirul
};

/* Catrința: nu o pată roșie, ci o țesătură vărgată. Dungile verticale sunt
   semnul după care se recunoaște de la o poștă, așa că le desenăm una câte una,
   subțiri, negre și aurii pe fond roșu, exact ca la vâlnicul din fotografie. */
function catrinta(c, s, jos, sus, latSus, latJos) {
  c.fillStyle = PORT_ROMANESC.rosu;
  c.beginPath();
  c.moveTo(-latSus, sus); c.lineTo(latSus, sus);
  c.lineTo(latJos, jos); c.lineTo(-latJos, jos);
  c.closePath(); c.fill();

  const cate = 11;
  for (let k = 0; k < cate; k++) {
    const f = (k + 0.5) / cate;
    const xs = intre(-latSus, latSus, f), xj = intre(-latJos, latJos, f);
    const gros = s * (k % 3 === 0 ? 0.018 : 0.011);
    c.fillStyle = k % 4 === 0 ? PORT_ROMANESC.aur
                : (k % 4 === 2 ? PORT_ROMANESC.visin : PORT_ROMANESC.negru);
    c.beginPath();
    c.moveTo(xs - gros, sus); c.lineTo(xs + gros, sus);
    c.lineTo(xj + gros * 1.25, jos); c.lineTo(xj - gros * 1.25, jos);
    c.closePath(); c.fill();
  }
  // poalele iei, ieșind albe de sub catrință
  c.fillStyle = PORT_ROMANESC.panza;
  c.beginPath();
  c.moveTo(-latJos * 0.94, jos); c.lineTo(latJos * 0.94, jos);
  c.lineTo(latJos * 0.90, jos + s * 0.042); c.lineTo(-latJos * 0.90, jos + s * 0.042);
  c.closePath(); c.fill();
}

/* Iţarii bărbatului: pantaloni albi, strâmți, din aceeași pânză ca iea. */
function itari(c, s) {
  c.fillStyle = PORT_ROMANESC.panza;
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.moveTo(lat * s * 0.02, -s * 0.44);
    c.lineTo(lat * s * 0.21, -s * 0.44);
    c.lineTo(lat * s * 0.17, -s * 0.02);
    c.lineTo(lat * s * 0.05, -s * 0.02);
    c.closePath(); c.fill();
  }
  c.strokeStyle = PORT_ROMANESC.umbra;
  c.lineWidth = Math.max(0.6, s * 0.012);
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.moveTo(lat * s * 0.12, -s * 0.42); c.lineTo(lat * s * 0.10, -s * 0.04);
    c.stroke();
  }
}

/* Un țăran în port: ie sau cămașă de pânză cu altiță cusută pe umăr, brâu,
   catrință vărgată ori iţari, opinci. Femeia are năframă albă, bărbatul
   pălărie neagră cu boruri mici și pieptar negru cu găitan auriu. */
function taranIn(c, w, h, tx, ty, marime, tip, salut, acum) {
  const s = h * marime;
  const femeie = tip === 'femeie';
  c.save();
  c.translate(w * tx, h * ty);
  /* În repaus brațul atârnă pe lângă trup, abia depărtat. Cu un unghi mare se
     așeza de-a curmezișul pieptului, ca o curea de raniță. */
  const bratul = salut > 0 ? -1.1 - Math.sin(acum * 0.008) * 0.45 * salut : -0.1;

  // opincile: tălpi mici de piele, cu gurgui
  c.fillStyle = PORT_ROMANESC.opinca;
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.ellipse(lat * s * 0.11, s * 0.01, s * 0.085, s * 0.035, lat * 0.1, 0, Math.PI * 2);
    c.fill();
  }

  if (femeie) {
    // catrința, de la brâu până aproape de pământ
    catrinta(c, s, -s * 0.02, -s * 0.46, s * 0.21, s * 0.26);
  } else {
    itari(c, s);
  }

  // trupul: cămașa de pânză, largă, până sub brâu
  c.fillStyle = PORT_ROMANESC.panza;
  c.beginPath();
  c.moveTo(-s * 0.20, -s * 0.40);
  c.quadraticCurveTo(-s * 0.27, -s * 0.66, -s * 0.22, -s * 0.86);
  c.quadraticCurveTo(0, -s * 0.94, s * 0.22, -s * 0.86);
  c.quadraticCurveTo(s * 0.27, -s * 0.66, s * 0.20, -s * 0.40);
  c.closePath(); c.fill();

  /* Altița: banda deasă cusută de-a curmezișul umărului. E o dungă, nu o pată —
     două pete rotunde pe umeri se citesc ca doi ochi. */
  for (const lat of [-1, 1]) {
    c.save();
    c.translate(lat * s * 0.155, -s * 0.775);
    c.rotate(lat * 0.28);
    c.fillStyle = PORT_ROMANESC.rosu;
    c.fillRect(-s * 0.055, -s * 0.028, s * 0.11, s * 0.056);
    c.fillStyle = PORT_ROMANESC.negru;
    for (let k = -1; k <= 1; k++) {
      c.fillRect(k * s * 0.032 - s * 0.007, -s * 0.028, s * 0.014, s * 0.056);
    }
    c.restore();
  }
  // râurile: șiragurile subțiri care coboară de sub altiță pe mânecă
  c.strokeStyle = PORT_ROMANESC.rosu;
  c.lineWidth = Math.max(0.6, s * 0.013);
  for (const lat of [-1, 1]) {
    for (let k = 0; k < 2; k++) {
      c.beginPath();
      c.moveTo(lat * s * (0.145 + k * 0.038), -s * 0.72);
      c.lineTo(lat * s * (0.175 + k * 0.038), -s * 0.56);
      c.stroke();
    }
  }

  if (!femeie) {
    // pieptarul negru, cu găitan auriu pe margine
    c.fillStyle = PORT_ROMANESC.negru;
    c.beginPath();
    c.moveTo(-s * 0.19, -s * 0.84);
    c.quadraticCurveTo(-s * 0.23, -s * 0.62, -s * 0.19, -s * 0.44);
    c.lineTo(-s * 0.07, -s * 0.44);
    c.lineTo(-s * 0.07, -s * 0.80);
    c.closePath(); c.fill();
    c.beginPath();
    c.moveTo(s * 0.19, -s * 0.84);
    c.quadraticCurveTo(s * 0.23, -s * 0.62, s * 0.19, -s * 0.44);
    c.lineTo(s * 0.07, -s * 0.44);
    c.lineTo(s * 0.07, -s * 0.80);
    c.closePath(); c.fill();
    c.strokeStyle = PORT_ROMANESC.aur;
    c.lineWidth = Math.max(0.6, s * 0.014);
    for (const lat of [-1, 1]) {
      c.beginPath();
      c.moveTo(lat * s * 0.075, -s * 0.80); c.lineTo(lat * s * 0.075, -s * 0.44);
      c.stroke();
    }
  }

  // brâul: roșu la femeie, chimir lat de piele la bărbat
  c.fillStyle = femeie ? PORT_ROMANESC.rosu : PORT_ROMANESC.opinca;
  c.fillRect(-s * 0.21, -s * 0.50, s * 0.42, femeie ? s * 0.07 : s * 0.1);
  if (femeie) {
    c.fillStyle = PORT_ROMANESC.negru;
    for (let k = -2; k <= 2; k++) {
      c.fillRect(k * s * 0.08 - s * 0.008, -s * 0.50, s * 0.016, s * 0.07);
    }
  } else {
    c.fillStyle = PORT_ROMANESC.aur;
    c.fillRect(-s * 0.21, -s * 0.44, s * 0.42, s * 0.012);
  }

  // brațul care salută
  c.save();
  c.translate(s * 0.205, -s * 0.845);
  c.rotate(bratul);
  // mâneca iei: largă la umăr, strânsă la încheietură
  c.fillStyle = PORT_ROMANESC.panza;
  c.beginPath();
  c.moveTo(-s * 0.062, -s * 0.02); c.lineTo(s * 0.062, -s * 0.02);
  c.lineTo(s * 0.036, s * 0.44); c.lineTo(-s * 0.036, s * 0.44);
  c.closePath(); c.fill();
  c.strokeStyle = PORT_ROMANESC.rosu; c.lineWidth = Math.max(0.6, s * 0.014);
  c.beginPath(); c.moveTo(-s * 0.022, s * 0.10); c.lineTo(-s * 0.016, s * 0.36); c.stroke();
  c.fillStyle = PORT_ROMANESC.piele;
  c.beginPath(); c.ellipse(0, s * 0.48, s * 0.042, s * 0.05, 0, 0, Math.PI * 2); c.fill();
  c.restore();

  // celălalt braț, pe lângă corp
  c.fillStyle = PORT_ROMANESC.panza;
  c.beginPath();
  c.moveTo(-s * 0.145, -s * 0.855); c.lineTo(-s * 0.262, -s * 0.828);
  c.lineTo(-s * 0.275, -s * 0.42); c.lineTo(-s * 0.202, -s * 0.42);
  c.closePath(); c.fill();
  c.strokeStyle = PORT_ROMANESC.rosu; c.lineWidth = Math.max(0.6, s * 0.014);
  c.beginPath(); c.moveTo(-s * 0.235, -s * 0.70); c.lineTo(-s * 0.245, -s * 0.48); c.stroke();
  c.fillStyle = PORT_ROMANESC.piele;
  c.beginPath(); c.ellipse(-s * 0.24, -s * 0.375, s * 0.04, s * 0.048, 0, 0, Math.PI * 2); c.fill();

  // gâtul și capul
  c.fillStyle = PORT_ROMANESC.piele;
  c.fillRect(-s * 0.045, -s * 0.94, s * 0.09, s * 0.06);
  c.beginPath();
  c.ellipse(0, -s * 1.02, s * 0.105, s * 0.125, 0, 0, Math.PI * 2);
  c.fill();

  if (femeie) {
    /* Năframa: se leagă peste creștet și pe după obraji, dar lasă fața la
       vedere. Desenată peste tot capul, se face glugă, și din femeie iese un
       om fără chip. */
    c.fillStyle = PORT_ROMANESC.panza;
    // colțul care atârnă pe umăr, desenat primul ca să rămână în spate
    c.beginPath();
    c.moveTo(-s * 0.128, -s * 1.03);
    c.quadraticCurveTo(-s * 0.205, -s * 0.93, -s * 0.175, -s * 0.79);
    c.quadraticCurveTo(-s * 0.115, -s * 0.88, -s * 0.105, -s * 0.99);
    c.closePath(); c.fill();
    // creștetul și obrajii
    c.beginPath();
    c.moveTo(-s * 0.128, -s * 0.95);
    c.quadraticCurveTo(-s * 0.145, -s * 1.16, 0, -s * 1.165);
    c.quadraticCurveTo(s * 0.145, -s * 1.16, s * 0.128, -s * 0.95);
    c.lineTo(s * 0.088, -s * 0.945);
    c.quadraticCurveTo(s * 0.10, -s * 1.10, 0, -s * 1.10);
    c.quadraticCurveTo(-s * 0.10, -s * 1.10, -s * 0.088, -s * 0.945);
    c.closePath(); c.fill();
    // părul care se vede în față, sub năframă
    c.fillStyle = '#4a382a';
    c.beginPath();
    c.ellipse(0, -s * 1.075, s * 0.082, s * 0.03, 0, Math.PI, Math.PI * 2);
    c.fill();
    // firul roșu de pe marginea năframei
    c.strokeStyle = PORT_ROMANESC.rosu;
    c.lineWidth = Math.max(0.6, s * 0.012);
    c.beginPath();
    c.moveTo(-s * 0.115, -s * 1.02);
    c.quadraticCurveTo(0, -s * 1.145, s * 0.115, -s * 1.02);
    c.stroke();
  } else {
    // părul de sub pălărie
    c.fillStyle = '#3d2c1f';
    c.beginPath();
    c.ellipse(0, -s * 1.07, s * 0.10, s * 0.05, 0, Math.PI * 0.95, Math.PI * 2.05);
    c.fill();
    // pălăria neagră, cu borurile mici și calota rotundă
    c.fillStyle = PORT_ROMANESC.negru;
    c.beginPath();
    c.ellipse(0, -s * 1.115, s * 0.205, s * 0.042, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.moveTo(-s * 0.10, -s * 1.115);
    c.quadraticCurveTo(-s * 0.105, -s * 1.235, 0, -s * 1.235);
    c.quadraticCurveTo(s * 0.105, -s * 1.235, s * 0.10, -s * 1.115);
    c.closePath(); c.fill();
    // panglica lucioasă de la baza calotei
    c.strokeStyle = PORT_ROMANESC.aur;
    c.lineWidth = Math.max(0.6, s * 0.012);
    c.beginPath();
    c.moveTo(-s * 0.098, -s * 1.13); c.lineTo(s * 0.098, -s * 1.13);
    c.stroke();
  }

  /* Chipul, abia pomenit: două puncte și o linie. Într-un tablou impresionist,
     de la distanța la care îl privești, atât se și vede dintr-un obraz. */
  c.fillStyle = '#5b4636';
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.ellipse(lat * s * 0.035, -s * 1.035, s * 0.012, s * 0.014, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.strokeStyle = '#a9755d'; c.lineWidth = Math.max(0.5, s * 0.01);
  c.beginPath();
  c.moveTo(-s * 0.025, -s * 0.985);
  c.quadraticCurveTo(0, -s * 0.972, s * 0.025, -s * 0.985);
  c.stroke();

  c.restore();
}

/* Trei oameni, la depărtări diferite de privitor: cel din față mai mare și mai
   jos, cel din spate mai mic și mai sus. Așezați la aceeași înălțime, ar părea
   lipiți pe un perete. */
const TARANI = [
  { x: 0.21, y: 0.94, marime: 0.26, tip: 'barbat' },
  { x: 0.35, y: 0.87, marime: 0.22, tip: 'femeie' },
  { x: 0.47, y: 0.82, marime: 0.19, tip: 'barbat' }
];

function taraniiIn(c, w, h, acum) {
  const salut = s5.faza === 'viu' ? 1 : 0;
  const pleaca = s5.plecare;
  for (let k = 0; k < TARANI.length; k++) {
    const t = TARANI[k];
    // când pleacă spre hambar, se mută spre ușa lui
    const x = intre(t.x, 0.62 + k * 0.035, pleaca);
    const y = intre(t.y, 0.78, pleaca);
    taranIn(c, w, h, x, y, intre(t.marime, t.marime * 0.72, pleaca), t.tip,
            salut * (1 - pleaca), acum + k * 260);
  }
}

// Ușile duble ale hambarului, care se deschid larg.
function usileHambarului(c, w, h, deschidere) {
  const oriz = h * 0.44;
  const hx = w * 0.7, hy = oriz - h * 0.03, hw = w * 0.24, hh = h * 0.34;
  const ux = hx + hw * 0.26, uy = hy + hh * 0.3, uw = hw * 0.48, uh = hh * 0.7;
  for (const lat of [-1, 1]) {
    c.save();
    c.translate(lat < 0 ? ux : ux + uw, uy);
    c.rotate(lat * deschidere * 1.15);
    c.fillStyle = '#7a5136';
    c.fillRect(lat < 0 ? 0 : -uw / 2, 0, uw / 2, uh);
    c.strokeStyle = '#4e3323'; c.lineWidth = Math.max(1, w * 0.003);
    for (let k = 0; k < 3; k++) {
      const dx = (lat < 0 ? 0 : -uw / 2) + uw * 0.08 + k * uw * 0.16;
      c.beginPath(); c.moveTo(dx, 0); c.lineTo(dx, uh); c.stroke();
    }
    c.restore();
  }
  // lumina care iese pe ușa deschisă
  if (deschidere > 0.2) {
    const lum = c.createLinearGradient(ux, uy, ux, uy + uh);
    lum.addColorStop(0, `rgba(255, 236, 180, ${0.5 * deschidere})`);
    lum.addColorStop(1, 'rgba(255, 236, 180, 0)');
    c.fillStyle = lum;
    c.fillRect(ux, uy, uw, uh);
  }
}

/* ---- scena ---- */

function intraInCampie(k, acum) {
  stare = 'campie';
  s5.buzunar = k;
  s5.faza = 'pixeli'; s5.t0 = acum; s5.ultimulCadru = acum;
  s5.pasi = 0; s5.claritate = 0; s5.usi = 0; s5.plecare = 0;
  pregatesteTablou();
  opresteMuzicaMuzeu();
  pornesteMuzicaGalerie();
  pornesteNatura();               // scena e despre aer: vânt și păsări
  if (audio) sunetIntrareGalerie();
}

function click5(acum) {
  if (s5.faza !== 'sala' || s5.pasi >= PASI_INAPOI) return;
  s5.pasi++;
  if (audio) sunetClopotel(520 + s5.pasi * 40);
  if (s5.pasi >= PASI_INAPOI) { s5.faza = 'viu'; s5.t0 = acum; if (audio) sunetDescoperire(); }
}

function actualizeazaCampia(acum) {
  const dt = Math.min(100, acum - (s5.ultimulCadru || acum));
  s5.ultimulCadru = acum;

  if (s5.faza === 'pixeli' && acum - s5.t0 > 2600) { s5.faza = 'sala'; s5.t0 = acum; }
  // claritatea urmează pașii, dar cu o mică lene, ca depărtarea să se simtă
  const tinta = s5.pasi / PASI_INAPOI;
  s5.claritate += (tinta - s5.claritate) * Math.min(1, dt / 260);

  if (s5.faza === 'viu' && acum - s5.t0 > 5200) { s5.faza = 'hambar'; s5.t0 = acum; }
  if (s5.faza === 'hambar') {
    s5.plecare = Math.min(1, s5.plecare + dt / 2600);
    if (s5.plecare >= 1) s5.usi = Math.min(1, s5.usi + dt / 2200);
    if (s5.usi >= 1 && acum - s5.t0 > 9000) intoarceInMuzeuDinCampie(acum);
  }
}

function intoarceInMuzeuDinCampie(acum) {
  s3.vizitate[s5.buzunar] = true;
  stare = 'muzeu';
  faza3('usaDeschisa');
  s3.usa = 1; s3.chemare = 0; s3.aSunatChemarea = false;
  actiune3(acum);
  opresteMuzicaMuzeu();
  pornesteMuzicaMuzeu();
  pornesteNatura();
}

// Pânzele de lucru: una pe care compunem, una minusculă pe care pixelăm.
function panzaDeLucru(care, w, h) {
  if (!care.panza) care.panza = document.createElement('canvas');
  if (care.panza.width !== w) care.panza.width = w;
  if (care.panza.height !== h) care.panza.height = h;
  return care.panza;
}

function deseneazaScena5(t, acum) {
  actualizeazaCampia(acum);
  const T = pregatesteTablou();

  // sala: perete deschis, cu o linie de podea
  const podea = H * 0.8;
  const perete = ctx.createLinearGradient(0, 0, 0, podea);
  perete.addColorStop(0, PERETE_SALII);
  perete.addColorStop(1, '#e3e1da');
  ctx.fillStyle = perete; ctx.fillRect(0, 0, W, podea);
  const jos = ctx.createLinearGradient(0, podea, 0, H);
  jos.addColorStop(0, PODEA_SALII);
  jos.addColorStop(1, '#bfbaae');
  ctx.fillStyle = jos; ctx.fillRect(0, podea, W, H - podea);

  /* Cât de mare se vede rama cu tot cu pânză. Pornește peste marginile
     ecranului — stai cu nasul în lucrare și nu-i vezi nici măcar rama — și se
     strânge repede la primii pași, ca pantofii de pe podea să iasă de sub ea. */
  const stramtare = Math.pow(Math.max(0, Math.min(1, s5.claritate)), 0.6);
  const latRama = intre(W * 1.02, Math.min(W * 0.46, podea * 0.86 / INALT_PE_LAT_RAMA),
                        stramtare);
  const inaltRama = latRama * INALT_PE_LAT_RAMA;
  const gr = latRama * PROFIL_RAMEI;
  const lat = latRama - gr * 2;
  const inalt = inaltRama - gr * 2;
  const rx = W * 0.5 - latRama / 2, ry = podea * 0.47 - inaltRama / 2;
  const x = rx + gr, y = ry + gr;
  s5.latimeTablou = latRama;


  // compunem tabloul cu tot cu oameni, apoi îl pixelăm după cât de departe ești
  const comp = panzaDeLucru(compunerea, T.latime, T.inaltime);
  const cc = comp.getContext('2d');
  cc.clearRect(0, 0, T.latime, T.inaltime);
  cc.drawImage(T.panza, 0, 0);
  usileHambarului(cc, T.latime, T.inaltime, s5.usi);
  taraniiIn(cc, T.latime, T.inaltime, acum);

  if (s5.faza === 'pixeli') {
    /* Pixelii haotici de la intrare: se retrag încet, ca o ceață care se ridică
       de pe un lucru pe care încă nu-l poți numi. */
    const p = Math.min(1, (acum - s5.t0) / 2600);
    const nivel = Math.max(2, Math.round(intre(3, 26, p)));
    const mic = panzaDeLucru(marunt, nivel, Math.max(2, Math.round(nivel * 0.62)));
    const mc = mic.getContext('2d');
    mc.drawImage(comp, 0, 0, mic.width, mic.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(mic, 0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = `rgba(244, 243, 239, ${p * 0.35})`;
    ctx.fillRect(0, 0, W, H);
    pantofiiDePeJos();
    return;
  }

  if (s5.claritate >= 0.995) {
    ctx.drawImage(comp, x, y, lat, inalt);
  } else {
    const nivel = Math.max(6, Math.round(intre(9, 300, Math.pow(s5.claritate, 0.75))));
    const mic = panzaDeLucru(marunt, nivel, Math.max(4, Math.round(nivel * T.inaltime / T.latime)));
    const mc = mic.getContext('2d');
    mc.clearRect(0, 0, mic.width, mic.height);
    mc.drawImage(comp, 0, 0, mic.width, mic.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(mic, x, y, lat, inalt);
    ctx.imageSmoothingEnabled = true;
  }

  // rama aurită, întinsă din ștampila ei peste marginile pânzei
  const R = pregatesteRamaMare();
  const k = latRama / R.latime;
  ctx.drawImage(R.panza, rx - R.marg * k, ry - R.marg * k,
                R.panza.width * k, R.panza.height * k);

  if (s5.faza === 'sala' || s5.faza === 'viu') pantofiiDePeJos();

  // porunca
  if (s5.faza === 'sala') {
    const ramase = PASI_INAPOI - s5.pasi;
    const vorba = ramase === PASI_INAPOI
      ? 'Fă 10 pași în spate.'
      : (ramase > 0 ? 'Încă ' + ramase + (ramase === 1 ? ' pas.' : ' pași.') : '');
    if (vorba) {
      ctx.font = 'bold 22px Georgia';
      const latV = ctx.measureText(vorba).width;
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = CREM_HARTIE;
      /* Porunca stă sub ramă, oriunde ar ajunge poalele ei: la primii pași rama
         coboară până peste podea, iar un rând scris călare pe brâul aurit nu se
         mai citește. Mai jos de pantofi n-are unde, așa că se oprește deasupra
         lor. */
      const subRama = Math.min(H * 0.86, Math.max(H * 0.79, ry + inaltRama + H * 0.045));
      dreptunghi(W * 0.5 - latV / 2 - 20, subRama - 12, latV + 40, 42, 13);
      ctx.restore();
      textIncadrat(vorba, W * 0.5, subRama, W * 0.6, 26, 'bold 22px Georgia', '#3a3327');
    }
  }

  // strigătul lor
  if (s5.faza === 'viu') {
    const vorba = 'De acolo, de departe, ne vezi mai bine?';
    ctx.font = 'bold 22px Georgia';
    const latV = ctx.measureText(vorba).width;
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = CREM_HARTIE;
    dreptunghi(W * 0.5 - latV / 2 - 22, H * 0.84 - 12, latV + 44, 44, 14);
    ctx.restore();
    textIncadrat(vorba, W * 0.5, H * 0.84, W * 0.7, 26, 'bold 22px Georgia', '#3a3327');
  }
  if (s5.faza === 'hambar' && s5.usi > 0.5) {
    textIncadrat('Hai înăuntru.', W * 0.5, H * 0.86, W * 0.5, 26,
                 'bold 21px Georgia', '#4a4132');
  }
}
