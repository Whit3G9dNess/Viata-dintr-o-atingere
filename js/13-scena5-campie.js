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

const TEXT_FISA_IMPRESIONISM =
  'Impresionismul este un curent artistic apărut în Franța secolului al XIX-lea, ' +
  'caracterizat prin captarea impresiilor vizuale de moment și a jocului de lumină ' +
  'prin tușe rapide și libere de culoare.';

/* Contrastul cald-rece, ținut discret: o notă de portocaliu pe unde bate lumina,
   una de albastru în umbra din partea cealaltă. Sala rămâne albă — nu se
   colorează, doar prinde viață. Un perete de un singur gri e o coală de hârtie,
   oricâte gradiente ar avea, fiindcă lumina adevărată n-are niciodată o singură
   temperatură. */
const CALD_SALII = '#f6d9b8';
const RECE_SALII = '#c3cfe0';

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
  faza: 'pixeli', t0: 0, ultimulCadru: 0,
  pasi: 0, claritate: 0, latimeTablou: 0,
  ramaSeVede: false,               // aurul a intrat în ecran, deci a apărut și sala
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

  /* Căpițele de fân. Prima încercare le-a făcut tot din tușe, ca restul
     câmpului, cu aceeași paletă — și s-au topit în grâu fără urmă. O căpiță se
     vede fiindcă are o formă și un ton al ei: trup plin, cu vârful aprins de
     soare și poalele în umbră, iar peste el câteva fire răzlețe. Cea din față e
     mare și jos; cele din spate, mărunte și lângă orizont. */
  const CAPITE = [
    { fx: 0.155, fy: 0.735, r: 0.145 },
    { fx: 0.605, fy: 0.615, r: 0.082 },
    { fx: 0.40, fy: 0.555, r: 0.055 },
    { fx: 0.815, fy: 0.735, r: 0.072 }   // în fața hambarului, nu în spatele lui
  ];
  for (let k = 0; k < CAPITE.length; k++) {
    const cap = CAPITE[k];
    const cx = w * cap.fx, cy = h * cap.fy, r = h * cap.r;

    // umbra lungă spre dreapta: soarele stă jos, în stânga
    c.fillStyle = 'rgba(104, 82, 118, 0.42)';
    c.beginPath();
    c.ellipse(cx + r * 0.55, cy + r * 0.07, r * 1.35, r * 0.22, 0.03, 0, Math.PI * 2);
    c.fill();

    // trupul căpiței: o cupolă cu vârf, nu un con ascuțit
    const fan = c.createLinearGradient(cx - r * 0.8, cy - r * 1.6, cx + r * 0.9, cy);
    /* Mai deschisă decât grâul din jur, altfel se topește în el. Prima încercare
       avea poalele mai închise decât câmpul, și căpița din față dispărea cu
       totul: o formă se vede prin ce o desparte de fond, nu prin conturul ei. */
    fan.addColorStop(0, '#fdf3d2');
    fan.addColorStop(0.42, '#f0d183');
    fan.addColorStop(1, '#c39a48');
    c.fillStyle = fan;
    c.beginPath();
    c.moveTo(cx - r, cy);
    c.bezierCurveTo(cx - r * 0.94, cy - r * 0.8, cx - r * 0.42, cy - r * 1.52, cx, cy - r * 1.62);
    c.bezierCurveTo(cx + r * 0.42, cy - r * 1.52, cx + r * 0.94, cy - r * 0.8, cx + r, cy);
    c.quadraticCurveTo(0.5 * (cx - r) + 0.5 * (cx + r), cy + r * 0.16, cx - r, cy);
    c.closePath();
    c.fill();

    // firele răzlețe, care rup silueta ca s-o facă de fân, nu de lut
    campDeTuse(c, cx - r * 0.86, cy - r * 1.45, r * 1.72, r * 1.3, 22, -1.2, 0.9,
               r * 0.44, r * 0.09,
               ['#fdf3d2', '#f2d78f', '#dcb45e'], 940 + k * 71);
    // creasta aprinsă din vârf
    campDeTuse(c, cx - r * 0.3, cy - r * 1.66, r * 0.6, r * 0.4, 14, -0.95, 0.6,
               r * 0.34, r * 0.09, ['#fdf1c8', '#f6e2a4'], 980 + k * 37);
    // țăpușa din creștet
    c.strokeStyle = '#8a6a2e';
    c.lineWidth = Math.max(1, r * 0.045);
    c.beginPath();
    c.moveTo(cx + r * 0.02, cy - r * 1.6);
    c.lineTo(cx - r * 0.04, cy - r * 1.84);
    c.stroke();
  }

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
  /* Volumul catrinței: lumina prinde șoldul din stânga, dreapta rămâne în umbră.
     Fără el, dungile stau pe o placă plată și se vede că e un decupaj. */
  const rotunjime = c.createLinearGradient(-latJos, 0, latJos, 0);
  rotunjime.addColorStop(0, 'rgba(255, 246, 226, 0.28)');
  rotunjime.addColorStop(0.42, 'rgba(255, 246, 226, 0)');
  rotunjime.addColorStop(1, 'rgba(48, 26, 20, 0.32)');
  c.fillStyle = rotunjime;
  c.beginPath();
  c.moveTo(-latSus, sus); c.lineTo(latSus, sus);
  c.lineTo(latJos, jos); c.lineTo(-latJos, jos);
  c.closePath(); c.fill();

  // poalele iei, ieșind albe de sub catrință
  c.fillStyle = PORT_ROMANESC.panza;
  c.beginPath();
  c.moveTo(-latJos * 0.94, jos); c.lineTo(latJos * 0.94, jos);
  c.lineTo(latJos * 0.90, jos + s * 0.042); c.lineTo(-latJos * 0.90, jos + s * 0.042);
  c.closePath(); c.fill();
}

/* Un picior: coapsă și gambă dintr-o singură formă, care se leagănă din șold.
   Opinca stă la capătul lui și se leagănă odată cu el — desenată separat, la un
   loc fix, ar rămâne pe pământ în timp ce piciorul pleacă. */
function piciorTaran(c, s, lat, unghi, ridicat, culoare) {
  c.save();
  c.translate(lat * s * 0.105, -s * 0.44);
  c.rotate(unghi);
  const lung = s * 0.44 - ridicat;
  c.fillStyle = culoare;
  c.beginPath();
  c.moveTo(-s * 0.075, 0);
  c.lineTo(s * 0.075, 0);
  c.quadraticCurveTo(s * 0.062, lung * 0.55, s * 0.052, lung);
  c.lineTo(-s * 0.052, lung);
  c.quadraticCurveTo(-s * 0.068, lung * 0.55, -s * 0.075, 0);
  c.closePath();
  c.fill();
  // cuta de pe cracul iţarilor
  c.strokeStyle = PORT_ROMANESC.umbra;
  c.lineWidth = Math.max(0.6, s * 0.011);
  c.beginPath();
  c.moveTo(0, lung * 0.1); c.lineTo(-s * 0.01, lung * 0.92);
  c.stroke();
  // opinca, la capătul piciorului
  c.fillStyle = PORT_ROMANESC.opinca;
  c.beginPath();
  c.ellipse(lat * s * 0.02, lung + s * 0.012, s * 0.085, s * 0.032, lat * 0.12, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

/* O mânecă: largă la umăr, strânsă la încheietură, cu capătul de sus rotunjit și
   îngropat în trup. Tăiată drept și lipită lângă cămașă, umărul se citea ca o
   bucată decupată din altă hârtie. */
function manecaTaran(c, s, lung, lat) {
  c.fillStyle = PORT_ROMANESC.panza;
  c.beginPath();
  c.moveTo(-s * 0.065, -s * 0.06);
  c.quadraticCurveTo(0, -s * 0.11, s * 0.065, -s * 0.06);
  c.quadraticCurveTo(s * 0.055, lung * 0.5, s * 0.036, lung);
  c.quadraticCurveTo(0, lung + s * 0.014, -s * 0.036, lung);
  c.quadraticCurveTo(-s * 0.055, lung * 0.5, -s * 0.065, -s * 0.06);
  c.closePath();
  c.fill();
  // umbra care rotunjește mâneca: fără ea e o fâșie plată
  const umbra = c.createLinearGradient(-s * 0.065, 0, s * 0.065, 0);
  umbra.addColorStop(0, 'rgba(255, 255, 255, 0)');
  umbra.addColorStop(0.6, 'rgba(120, 106, 84, 0)');
  umbra.addColorStop(1, 'rgba(120, 106, 84, 0.28)');
  c.fillStyle = umbra;
  c.fill();
  // râul roșu de pe mânecă
  c.strokeStyle = PORT_ROMANESC.rosu;
  c.lineWidth = Math.max(0.6, s * 0.014);
  c.beginPath();
  c.moveTo(-s * 0.022, lung * 0.22); c.lineTo(-s * 0.016, lung * 0.86);
  c.stroke();
  c.fillStyle = PORT_ROMANESC.piele;
  c.beginPath();
  c.ellipse(0, lung + s * 0.055, s * 0.042, s * 0.05, 0, 0, Math.PI * 2);
  c.fill();
}

/* Un țăran în port: ie sau cămașă de pânză cu altiță cusută pe umăr, brâu,
   catrință vărgată ori iţari, opinci. Femeia are năframă albă, bărbatul pălărie
   neagră cu boruri mici și pieptar negru cu găitan auriu.

   `mers` e cât de tare calcă, de la 0 la 1. Fără el, cei trei alunecau spre
   hambar cu picioarele înțepenite, ca niște decupaje trase pe sfoară.

   Ordinea de desen contează mai mult decât orice altceva aici: întâi picioarele,
   pe urmă mânecile, abia apoi trupul peste ele. Desenate invers, fiecare mădular
   își arăta muchia lipită de cămașă. */
function taranIn(c, w, h, tx, ty, marime, tip, salut, acum, mers) {
  const s = h * marime;
  const femeie = tip === 'femeie';
  const calca = Math.max(0, Math.min(1, mers || 0));

  /* Pasul și săltatul din el. Trupul urcă de două ori pe pas, în clipa în care
     un picior trece pe lângă celălalt — de-aia cosinusul e la dublu. */
  const faza = acum * 0.007;
  const pas = Math.sin(faza) * calca;
  const salt = calca * Math.abs(Math.cos(faza)) * s * 0.022;
  const legan = Math.sin(faza * 2) * calca * 0.03;

  c.save();
  c.translate(w * tx, h * ty - salt);
  c.rotate(legan);

  // umbra de sub el, care se strânge când sare
  c.fillStyle = 'rgba(90, 72, 40, 0.22)';
  c.beginPath();
  c.ellipse(0, s * 0.02, s * 0.2 - salt * 0.6, s * 0.035, 0, 0, Math.PI * 2);
  c.fill();

  // ---- picioarele, primele, ca trupul să le acopere capătul de sus ----
  const culoarePicior = femeie ? PORT_ROMANESC.piele : PORT_ROMANESC.panza;
  /* Pasul, văzut din față. Nu se poate arăta din legănat lateral: rotite în
     lături, picioarele se încrucișează prin mijloc și omul pare că dansează.
     Din față, ce se vede dintr-un pas e că un picior se ridică și se scurtează
     în timp ce celălalt rămâne pe pământ — și că trupul saltă odată cu el.
     De-aia cele două picioare au faze opuse la ridicat, și abia o urmă de
     legănat în lături, cât să nu pară un marș pe loc. */
  for (const lat of [-1, 1]) {
    const undaPasului = Math.sin(faza + (lat < 0 ? 0 : Math.PI));
    const ridicat = Math.max(0, undaPasului) * calca * s * 0.13;
    piciorTaran(c, s, lat, -lat * calca * 0.07 - undaPasului * calca * 0.1,
                ridicat, culoarePicior);
  }

  // ---- mânecile, tot înaintea trupului ----
  /* Brațele nu trec niciodată peste piept. Un braț rotit spre înăuntru se așază
     de-a curmezișul trupului ca o curea de raniță — de-aia unghiul lui rămâne
     de aceeași parte cu umărul din care crește, oricât s-ar legăna. Cele două
     merg în contratimp, ca la orice om care umblă. */
  const bratul = salut > 0 ? -1.1 - Math.sin(acum * 0.008) * 0.45 * salut
                           : -0.2 - pas * 0.22;
  c.save();
  c.translate(s * 0.185, -s * 0.83);
  c.rotate(bratul);
  manecaTaran(c, s, s * 0.42);
  c.restore();

  c.save();
  c.translate(-s * 0.185, -s * 0.83);
  c.rotate(0.2 - pas * 0.22);
  manecaTaran(c, s, s * 0.42);
  c.restore();

  // ---- fusta sau iţarii peste capătul picioarelor ----
  if (femeie) catrinta(c, s, -s * 0.06, -s * 0.46, s * 0.21, s * 0.26);

  // ---- trupul: cămașa de pânză, largă, peste umerii mânecilor ----
  c.fillStyle = PORT_ROMANESC.panza;
  c.beginPath();
  c.moveTo(-s * 0.20, -s * 0.40);
  c.quadraticCurveTo(-s * 0.27, -s * 0.66, -s * 0.215, -s * 0.87);
  c.quadraticCurveTo(0, -s * 0.95, s * 0.215, -s * 0.87);
  c.quadraticCurveTo(s * 0.27, -s * 0.66, s * 0.20, -s * 0.40);
  c.closePath();
  c.fill();
  /* Modelarea cămășii: lumina vine de sus-stânga, ca soarele din tablou. Fără
     ea, trupul e o pată albă decupată, oricât de bine i-ar fi conturul. */
  const trup = c.createLinearGradient(-s * 0.24, -s * 0.95, s * 0.26, -s * 0.4);
  trup.addColorStop(0, 'rgba(255, 252, 242, 0.55)');
  trup.addColorStop(0.45, 'rgba(255, 252, 242, 0)');
  trup.addColorStop(1, 'rgba(122, 108, 86, 0.3)');
  c.fillStyle = trup;
  c.fill();

  // altița: banda deasă cusută de-a curmezișul umărului
  for (const lat of [-1, 1]) {
    c.save();
    c.translate(lat * s * 0.15, -s * 0.79);
    c.rotate(lat * 0.28);
    c.fillStyle = PORT_ROMANESC.rosu;
    c.fillRect(-s * 0.055, -s * 0.028, s * 0.11, s * 0.056);
    c.fillStyle = PORT_ROMANESC.negru;
    for (let k = -1; k <= 1; k++) {
      c.fillRect(k * s * 0.032 - s * 0.007, -s * 0.028, s * 0.014, s * 0.056);
    }
    c.restore();
  }

  if (!femeie) {
    // pieptarul negru, cu găitan auriu pe margine
    c.fillStyle = PORT_ROMANESC.negru;
    for (const lat of [-1, 1]) {
      c.beginPath();
      c.moveTo(lat * s * 0.19, -s * 0.85);
      c.quadraticCurveTo(lat * s * 0.235, -s * 0.62, lat * s * 0.19, -s * 0.44);
      c.lineTo(lat * s * 0.07, -s * 0.44);
      c.lineTo(lat * s * 0.07, -s * 0.81);
      c.closePath();
      c.fill();
    }
    c.strokeStyle = PORT_ROMANESC.aur;
    c.lineWidth = Math.max(0.6, s * 0.014);
    for (const lat of [-1, 1]) {
      c.beginPath();
      c.moveTo(lat * s * 0.075, -s * 0.81); c.lineTo(lat * s * 0.075, -s * 0.44);
      c.stroke();
    }
  }

  /* Brâul: roșu la femeie, chimir lat de piele la bărbat. Se încovoaie pe trup,
     nu stă ca o cărămidă pusă peste: o curbă abia simțită la marginea de sus și
     de jos e tot ce trebuie ca să se vadă că trupul e rotund. */
  const inaltBrau = femeie ? s * 0.07 : s * 0.1;
  const brau = function () {
    c.beginPath();
    c.moveTo(-s * 0.21, -s * 0.50);
    c.quadraticCurveTo(0, -s * 0.50 + s * 0.018, s * 0.21, -s * 0.50);
    c.lineTo(s * 0.21, -s * 0.50 + inaltBrau);
    c.quadraticCurveTo(0, -s * 0.50 + inaltBrau + s * 0.018, -s * 0.21, -s * 0.50 + inaltBrau);
    c.closePath();
  };
  c.fillStyle = femeie ? PORT_ROMANESC.rosu : PORT_ROMANESC.opinca;
  brau(); c.fill();
  const luminaBraului = c.createLinearGradient(-s * 0.21, 0, s * 0.21, 0);
  luminaBraului.addColorStop(0, 'rgba(255, 240, 214, 0.3)');
  luminaBraului.addColorStop(0.45, 'rgba(255, 240, 214, 0)');
  luminaBraului.addColorStop(1, 'rgba(30, 16, 8, 0.34)');
  c.fillStyle = luminaBraului;
  brau(); c.fill();
  if (femeie) {
    c.fillStyle = PORT_ROMANESC.negru;
    for (let k = -2; k <= 2; k++) {
      c.fillRect(k * s * 0.08 - s * 0.008, -s * 0.50, s * 0.016, s * 0.07);
    }
  } else {
    c.fillStyle = PORT_ROMANESC.aur;
    c.fillRect(-s * 0.21, -s * 0.44, s * 0.42, s * 0.012);
  }

  // ---- gâtul și capul ----
  c.fillStyle = PORT_ROMANESC.piele;
  c.fillRect(-s * 0.045, -s * 0.95, s * 0.09, s * 0.07);
  c.fillStyle = 'rgba(120, 92, 66, 0.35)';
  c.fillRect(-s * 0.045, -s * 0.95, s * 0.09, s * 0.022);
  c.fillStyle = PORT_ROMANESC.piele;
  c.beginPath();
  c.ellipse(0, -s * 1.02, s * 0.105, s * 0.125, 0, 0, Math.PI * 2);
  c.fill();

  if (femeie) {
    /* Năframa: se leagă peste creștet și pe după obraji, dar lasă fața la
       vedere. Desenată peste tot capul, se face glugă. */
    c.fillStyle = PORT_ROMANESC.panza;
    c.beginPath();
    c.moveTo(-s * 0.128, -s * 1.03);
    c.quadraticCurveTo(-s * 0.205, -s * 0.93, -s * 0.175, -s * 0.79);
    c.quadraticCurveTo(-s * 0.115, -s * 0.88, -s * 0.105, -s * 0.99);
    c.closePath(); c.fill();
    c.beginPath();
    c.moveTo(-s * 0.128, -s * 0.95);
    c.quadraticCurveTo(-s * 0.145, -s * 1.16, 0, -s * 1.165);
    c.quadraticCurveTo(s * 0.145, -s * 1.16, s * 0.128, -s * 0.95);
    c.lineTo(s * 0.088, -s * 0.945);
    c.quadraticCurveTo(s * 0.10, -s * 1.10, 0, -s * 1.10);
    c.quadraticCurveTo(-s * 0.10, -s * 1.10, -s * 0.088, -s * 0.945);
    c.closePath(); c.fill();
    c.fillStyle = '#4a382a';
    c.beginPath();
    c.ellipse(0, -s * 1.075, s * 0.082, s * 0.03, 0, Math.PI, Math.PI * 2);
    c.fill();
    c.strokeStyle = PORT_ROMANESC.rosu;
    c.lineWidth = Math.max(0.6, s * 0.012);
    c.beginPath();
    c.moveTo(-s * 0.115, -s * 1.02);
    c.quadraticCurveTo(0, -s * 1.145, s * 0.115, -s * 1.02);
    c.stroke();
  } else {
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

/* Trei oameni, la departari diferite de privitor. `statura` e cat e de inalt
   omul in sine, pe langa cat il micsoreaza departarea: fara ea, cei trei erau
   croiti din aceeasi matrita si se vedea. Intr-un grup adevarat unul e lung si
   desirat, altul indesat. Barbatul din fata e cel mai inalt, femeia e cu un cap
   mai scunda, iar cel din spate e un flacaiandru. */
const TARANI = [
  { x: 0.21, y: 0.94, marime: 0.26, statura: 1.12, tip: 'barbat' },
  { x: 0.35, y: 0.87, marime: 0.22, statura: 0.94, tip: 'femeie' },
  { x: 0.47, y: 0.82, marime: 0.19, statura: 0.82, tip: 'barbat' }
];

/* Cat de mare se vede un taran, socotind si statura lui, si cat s-a departat
   spre hambar. Se socoteste intr-un singur loc, ca sa nu ramana vreunul
   nemicsorat: doi care se departeaza si unul care sta pe loc rup departarea, iar
   ochiul vede imediat ca al treilea nu merge nicaieri. */
function marimeTaran(t, pleaca) {
  return t.marime * (t.statura || 1) * intre(1, 0.56, Math.min(1, pleaca || 0));
}

function taraniiIn(c, w, h, acum) {
  const salut = s5.faza === 'viu' ? 1 : 0;
  const pleaca = s5.plecare;
  /* Calcă numai cât sunt pe drum. Pornesc și se opresc lin: un om care începe
     să meargă din prima cu pasul întreg, și se oprește la fel, arată tot a
     păpușă trasă pe sfoară — doar una care dă din picioare. */
  const mers = Math.min(1, Math.sin(Math.min(1, pleaca) * Math.PI) * 2.2);
  for (let k = 0; k < TARANI.length; k++) {
    const t = TARANI[k];
    // când pleacă spre hambar, se mută spre ușa lui
    /* Se duc spre ușa hambarului, care e mai sus și mai departe decât locul lor
       de acum. Înainte coborau spre y = 0.78, adică veneau spre privitor în timp
       ce se micșorau — două lucruri care se bat cap în cap. */
    const x = intre(t.x, 0.655 + k * 0.03, pleaca);
    const y = intre(t.y, 0.70 + k * 0.012, pleaca);
    taranIn(c, w, h, x, y, marimeTaran(t, pleaca), t.tip,
            salut * (1 - pleaca), acum + k * 260, mers);
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

function intraInCampie(acum) {
  stare = 'campie';
  s5.faza = 'pixeli'; s5.t0 = acum; s5.ultimulCadru = acum;
  s5.pasi = 0; s5.claritate = 0; s5.usi = 0; s5.plecare = 0;
  pregatesteTablou();
  opresteMuzicaMuzeu();
  pornesteMuzicaMuzeu();          // tot înăuntru, în muzeu: aceeași piesă
  pornesteNatura(true);           // scena e despre aer: vânt și păsări
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
  s3.vizitat = true;
  stare = 'muzeu';
  faza3('usaDeschisa');
  s3.usa = 1; s3.chemare = 0; s3.aSunatChemarea = false;
  actiune3(acum);
  opresteMuzicaMuzeu();           // ne întoarcem afară, la custode
  pornesteNatura(false);
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

  /* Lumina caldă vine din stânga-sus și se scurge pe podea; recele se strânge în
     dreapta-jos, unde nu ajunge. Amândouă abia se văd — dacă le observi ca
     pe niște culori, sunt prea tari. */
  const cald = ctx.createRadialGradient(W * 0.18, -H * 0.1, 0, W * 0.18, -H * 0.1, H * 1.5);
  cald.addColorStop(0, CALD_SALII);
  cald.addColorStop(1, 'rgba(246, 217, 184, 0)');
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = cald; ctx.fillRect(0, 0, W, H);
  const rece = ctx.createLinearGradient(W * 0.55, H * 0.2, W, H);
  rece.addColorStop(0, 'rgba(195, 207, 224, 0)');
  rece.addColorStop(1, RECE_SALII);
  ctx.globalAlpha = 0.34;
  ctx.fillStyle = rece; ctx.fillRect(0, 0, W, H);
  ctx.restore();

  /* Cât de mare se vede rama cu tot cu pânză. Pornește peste marginile
     ecranului — stai cu nasul în lucrare și nu-i vezi nici măcar rama — și se
     strânge repede la primii pași, ca pantofii de pe podea să iasă de sub ea. */
  /* Cât de mare se vede rama cu tot cu pânză. La intrare, **pânza dinăuntrul
     ramei** — nu rama — acoperă tot ecranul: stai atât de aproape încât nu vezi
     nici rama, nici sala, numai pătratele. Aurul rămâne pe dinafară, iar sala
     apare de sub el abia după câțiva pași.

     De-aia strâmtarea e leneșă la început: cu o curbă iute, rama se ivea din
     primul pas și se pierdea tocmai momentul în care nu știi încă ce privești. */
  const acopera = Math.max(W, H * T.latime / T.inaltime) * 1.03 / (1 - 2 * PROFIL_RAMEI);
  /* Primii trei pași abia o strâng — în ei se limpezesc doar pătratele, și tot
     nu se vede nici rama, nici sala. Restul drumului face toată depărtarea.
     Cu o curbă simplă, oricât de leneșă, rama fie se ivea din primul pas, fie
     nu mai apărea până la ultimul: o putere nu poate fi și înceată la început,
     și iute la sfârșit. */
  const c = Math.max(0, Math.min(1, s5.claritate));
  const stramtare = c < 0.3 ? c * (0.25 / 0.3)
                            : 0.25 + (c - 0.3) * (0.75 / 0.7);
  const latRama = intre(acopera, Math.min(W * 0.46, podea * 0.86 / INALT_PE_LAT_RAMA),
                        stramtare);
  const inaltRama = latRama * INALT_PE_LAT_RAMA;
  const gr = latRama * PROFIL_RAMEI;
  const lat = latRama - gr * 2;
  const inalt = inaltRama - gr * 2;
  /* La intrare, lucrarea stă în mijlocul ecranului, ca să-l acopere de sus până
     jos; pe măsură ce te depărtezi, urcă la locul unui tablou atârnat pe perete.
     Centrată de la bun început ca un tablou, îi rămânea brâul de jos în ecran —
     și se vedea o dungă de aur exact acolo unde nu trebuia să se vadă nimic. */
  const cy = intre(H * 0.5, podea * 0.47, stramtare);
  const rx = W * 0.5 - latRama / 2, ry = cy - inaltRama / 2;
  const x = rx + gr, y = ry + gr;
  s5.latimeTablou = latRama;
  /* Rama „a apărut" când i-au intrat în ecran laturile aurite — atunci se vede
     și sala de sub ea. Sus și jos intră ceva mai târziu, fiindcă pânza e mai
     lată decât înaltă; asta se vede ca o ramă care se închide, nu ca o
     întârziere. */
  s5.ramaSeVede = rx > 0;


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

  /* Fișa de sală, pe peretele din stânga lucrării. Apare odată cu rama: cât
     stai cu nasul în pânză n-ai unde s-o citești, și n-ar avea niciun rost. */
  if (s5.ramaSeVede) {
    fisaDeSala(Math.max(W * 0.115, rx - W * 0.105), ry + inaltRama * 0.3,
               Math.min(W * 0.22, latRama * 0.34),
               'Impresionism', TEXT_FISA_IMPRESIONISM);
  }

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
      /* Porunca stă sub ramă, dar niciodată peste pantofi: ei sunt lucrul la care
         te uiți ca să știi unde stai, iar un rând scris peste ei îi taie în două.
         Dacă locul de sub ramă ajunge prea jos, se mută în stânga lor, pe podea. */
      const susPantofi = H - Math.min(W, H) * 0.17 * 1.02;
      const subRama = Math.max(H * 0.79, ry + inaltRama + H * 0.045);
      const incape = subRama + 21 < susPantofi;
      const cx = incape ? W * 0.5 : W * 0.5 - Math.min(W, H) * 0.17 * 0.62 - latV / 2 - 24;
      const cy = incape ? subRama : Math.min(H - 34, susPantofi + Math.min(W, H) * 0.06);
      dreptunghi(cx - latV / 2 - 20, cy - 12, latV + 40, 42, 13);
      ctx.restore();
      textIncadrat(vorba, cx, cy, W * 0.6, 26, 'bold 22px Georgia', '#3a3327');
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
