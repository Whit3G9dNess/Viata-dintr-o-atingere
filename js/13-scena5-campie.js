/* =====================================================================
   SCENA 5 — PÂNZA URIAȘĂ ȘI CEI ZECE PAȘI ÎNAPOI
   ---------------------------------------------------------------------
   Intri și nu vezi decât pixeli. Se retrag și rămâne o sală albă cu o pânză
   uriașă, tot pixelată. Pe podea, două tălpi și o poruncă: fă zece pași în
   spate. Cu fiecare pas, tabloul se micșorează pe ecran și se limpezește — asta
   e toată scena: nu te apropii ca să vezi mai bine, te depărtezi.

   Când ajungi la zece, cei trei țărani din tablou prind viață, îți fac cu mâna
   și te strigă. Pe urmă se duc la casa de alături și-i deschid ușile.

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

/* Albastrul caselor de pe Valea Bistriței și din Bucovina. Nu e o alegere de
   gust: e culoarea cu care se dădea lemnul la casele de aici — stâlpi, arcade,
   cercevele, ușă — și fără ea casa nu mai e de nicăieri. */
const ALBASTRU_CASA = '#1560bd';
const ALBASTRU_UMBRA = '#0e4185';
const ALBASTRU_LUMINA = '#4d90d8';

/* Măsurile casei cu pridvor, socotite într-un singur loc. Ușile se deschid exact
   în golul lăsat pentru ele; socotite în două locuri, s-ar despărți — și s-ar
   vedea, fiindcă tocmai pe ușa aceea intri la capătul drumului. */
function geomCasa(w, h) {
  /* Casa stă în dreapta, în planul al doilea. Era în față, jos, aproape de
     marginea pânzei — și de acolo strivea oamenii: un zid cât toată înălțimea
     lor, la doi pași în spate.

     Mărimea nu se mai scrie de mână, ci iese din depărtare, ca la țărani. Măsura
     e omul: la locul unde stă casa, un om ar avea `omAcolo`; peretele ei e cam de
     două ori atât, iar casa e de vreo două ori și jumătate mai lată decât înaltă.
     Așa casa și oamenii se măsoară cu aceeași unitate, și nu se mai poate
     întâmpla ca unii să pară de altă lume decât cealaltă. */
  const oriz = h * ORIZONT_TABLOU;
  const talpa = h * 0.55;              // unde calcă pe pământ, mult mai sus decât oamenii
  const omAcolo = h * INALT_TARAN_LA_MARGINE * (talpa - oriz) / (h - oriz);
  const inalt = omAcolo * 1.9;         // peretele văruit
  const lat = inalt * 2.5;
  const soclu = inalt * 0.225;         // piatra de râu de sub perete
  const x = w * 0.70;
  const sus = talpa - soclu - inalt;
  const usaW = lat * 0.15, usaH = inalt * 0.78;
  const usaX = x + lat * 0.375;
  const usaY = talpa - soclu - usaH;
  return { x, lat, talpa, soclu, inalt, sus, usaX, usaY, usaW, usaH };
}

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
/* Amesteca doua culori scrise in hex. Perspectiva aeriana cere asta la tot
   pasul: cu cat un lucru e mai departe, cu atat culoarea lui se trage mai mult
   spre albastrul aerului dintre noi si el. */
function amesteca(a, b, cat) {
  const c1 = parseInt(a.slice(1), 16), c2 = parseInt(b.slice(1), 16);
  const k = Math.max(0, Math.min(1, cat));
  const r = Math.round(((c1 >> 16) & 255) * (1 - k) + ((c2 >> 16) & 255) * k);
  const g = Math.round(((c1 >> 8) & 255) * (1 - k) + ((c2 >> 8) & 255) * k);
  const b2 = Math.round((c1 & 255) * (1 - k) + (c2 & 255) * k);
  return `rgb(${r}, ${g}, ${b2})`;
}

/* Mijlocul unei case din planul secundar, pe latimea panzei. */
function cx0(cz, w) { return w * cz.x; }

function tusa(c, x, y, lung, gros, unghi, culoare, alfa) {
  c.save();
  /* Transparenta tusei se *inmulteste* cu cea din jur, nu o inlocuieste. Scrisa
     absolut, orice incercare de a trece o pensula mai usoara peste ceva — pui
     globalAlpha mai mic si chemi campDeTuse — nu avea niciun efect: fiecare tusa
     isi punea la loc transparenta ei si casa se umplea de bulgari. Aceeasi
     capcana ca la manuta-balon, unde lasa un oval alb dupa ce se spargea. */
  const stinsul = c.globalAlpha;
  c.globalAlpha = (alfa === undefined ? 1 : alfa) * stinsul;
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

  /* Satul din planul secundar. Fara el, campul era doar un camp: grau, un copac,
     o casa — putea fi oriunde. Cateva acoperisuri si un pilc de copaci intre
     zare si oameni spun ca astia au de unde veni si unde se intoarce, iar dealul
     din spate capata masura.

     Prima oara le-am pus chiar pe linia orizontului, cat un bob de mazare. Erau
     acolo, dar nu se vedeau: la marimea la care se arata tabloul pe ecran, ajungeau
     de cativa pixeli si se stergeau cu totul in albastru. Un lucru pe care nu-l vezi
     nu e sugerat, e lipsa. Planul secundar e mai incoace, iar acolo au voie sa fie
     cat o palma — tot fara ferestre si fara olane, ca sa nu sara in fata.

     Culorile se trag spre albastrul aerului cu atat mai mult cu cat casa e mai
     departe: asa lucreaza perspectiva aeriana, si tot ea leaga satul de dealuri. */
  const CASE_IN_ZARE = [
    { x: 0.055, d: 0.62, s: 1.05 }, { x: 0.150, d: 0.34, s: 0.86 },
    { x: 0.245, d: 0.78, s: 0.78 }, { x: 0.330, d: 0.20, s: 0.70 },
    { x: 0.395, d: 0.50, s: 0.80 }, { x: 0.470, d: 0.74, s: 0.62 },
    { x: 0.545, d: 0.28, s: 0.95 }, { x: 0.900, d: 0.56, s: 0.80 },
    { x: 0.965, d: 0.86, s: 0.62 }
  ];
  const ADANC = h * 0.14;   // cat tine planul secundar, de la zare in jos
  for (let k = 0; k < CASE_IN_ZARE.length; k++) {
    const cz = CASE_IN_ZARE[k];
    /* `d` e cat de departe sta: 0 lipit de zare, 1 la marginea planului secundar.
       Din el ies deodata si locul, si marimea, si cat de spalacita e culoarea —
       trei lucruri care in natura vin din acelasi singur lucru, departarea. */
    const cy = oriz + ADANC * cz.d;
    const marime = (0.5 + cz.d * 0.5) * cz.s;
    const cw = w * 0.105 * marime, ch = h * 0.088 * marime;
    /* Cat de spalacita e culoarea. Prima oara le-am facut aproape albastre de
       tot: erau acolo, dar nu se vedeau, si un lucru pe care nu-l vezi nu e
       sugerat, e lipsa. */
    const pierdut = 0.44 - cz.d * 0.24;

    // umbra pe grau, ca sa stea pe pamant, nu pe el
    c.fillStyle = `rgba(110, 96, 138, ${0.2 + cz.d * 0.1})`;
    c.beginPath();
    c.ellipse(cx0(cz, w) + cw * 0.1, cy + ch * 0.06, cw * 0.62, ch * 0.1, 0, 0, Math.PI * 2);
    c.fill();

    // peretele varuit, cu latura din umbra
    c.fillStyle = amesteca('#f6ecd6', '#93a0c2', pierdut * 0.8);
    c.fillRect(cx0(cz, w) - cw / 2, cy - ch * 0.55, cw, ch * 0.55);
    c.fillStyle = amesteca('#c9b898', '#8590b4', pierdut * 0.9);
    c.fillRect(cx0(cz, w) + cw * 0.22, cy - ch * 0.55, cw * 0.28, ch * 0.55);
    /* Acoperisul e singurul lucru care da caracter unei case de departe: dupa el
       stii ca e un sat, si nu niste pietre albe. De-aia se spalaceste mai putin
       decat peretii — daca se trage tot in albastru, ramane o pata cenusie si nu
       se mai citeste nimic. */
    c.fillStyle = amesteca('#a85b34', '#8a92b8', pierdut * 0.62);
    c.beginPath();
    c.moveTo(cx0(cz, w) - cw * 0.66, cy - ch * 0.55);
    c.lineTo(cx0(cz, w) - cw * 0.06, cy - ch * 1.02);
    c.lineTo(cx0(cz, w) + cw * 0.72, cy - ch * 0.55);
    c.closePath();
    c.fill();
    // o dunga de lumina pe muchia acoperisului: soarele bate din stanga
    c.strokeStyle = amesteca('#f0c49c', '#a8b0cc', pierdut * 0.7);
    c.lineWidth = Math.max(0.8, ch * 0.05);
    c.beginPath();
    c.moveTo(cx0(cz, w) - cw * 0.66, cy - ch * 0.55);
    c.lineTo(cx0(cz, w) - cw * 0.06, cy - ch * 1.02);
    c.stroke();
  }

  /* Pilcurile de copaci dintre case. Cresc mai sus decat acoperisurile, ca intr-un
     sat adevarat, si sunt tot pete — doua tuse si un trunchi. */
  const COPACI_IN_ZARE = [
    { x: 0.020, d: 0.70, s: 1.05 }, { x: 0.105, d: 0.22, s: 0.75 },
    { x: 0.200, d: 0.50, s: 0.95 }, { x: 0.290, d: 0.82, s: 0.80 },
    { x: 0.365, d: 0.32, s: 0.88 }, { x: 0.435, d: 0.62, s: 1.00 },
    { x: 0.505, d: 0.40, s: 0.85 }, { x: 0.590, d: 0.72, s: 0.95 },
    { x: 0.655, d: 0.30, s: 0.78 }, { x: 0.845, d: 0.38, s: 0.85 },
    { x: 0.955, d: 0.64, s: 1.05 }
  ];
  for (let k = 0; k < COPACI_IN_ZARE.length; k++) {
    const t = COPACI_IN_ZARE[k];
    const ty = oriz + ADANC * t.d;
    const marime = (0.5 + t.d * 0.5) * t.s;
    const tr = h * 0.055 * marime;
    const tx = w * t.x;
    const pierdut = 0.42 - t.d * 0.22;
    // trunchiul, o dunga scurta
    c.strokeStyle = amesteca('#5a4630', '#8590b4', pierdut + 0.1);
    c.lineWidth = Math.max(0.9, tr * 0.16);
    c.beginPath();
    c.moveTo(tx, ty); c.lineTo(tx, ty - tr * 1.05);
    c.stroke();
    /* Coroana, din cinci pete asezate neregulat. Cu trei pete puse una peste
       alta ieseau acadele: bile verzi identice pe betisoare, aliniate ca intr-o
       gradina de plastic. Un pom vazut de departe are o parte mai grea, alta mai
       rara, si nu seamana cu vecinul lui. */
    for (let q = 0; q < 5; q++) {
      const a = samanta(2400 + k * 11.3 + q * 3.7), b = samanta(2470 + k * 7.9 + q * 5.1);
      const e = samanta(2530 + k * 4.3 + q * 9.1);
      c.fillStyle = amesteca(['#6f8f52', '#587a45', '#82a05f', '#4e6b3a', '#93ab63'][q],
                             '#93a0c2', pierdut + b * 0.14);
      c.beginPath();
      c.ellipse(tx + (a - 0.5) * tr * 1.15, ty - tr * (0.95 + b * 0.85),
                tr * (0.34 + a * 0.3), tr * (0.3 + e * 0.34),
                (a - 0.5) * 0.8, 0, Math.PI * 2);
      c.fill();
    }
  }

  /* Ordinea de aici e ordinea depărtării, nu ordinea în care ne-au venit ideile.
     Ce e mai departe se pune primul, ca ce e mai aproape să treacă peste el.
     Înainte plopii se desenau la urmă și cădeau peste căpița din stânga — un
     copac crescut în vârful unei căpițe — iar casa acoperea căpița din fața
     lui. Pe o pânză, cine acoperă pe cine spune unde stă fiecare; greșit,
     adâncimea se rupe, oricât de bine ar fi pictat fiecare lucru în parte. */

  /* Copacul din stânga. Erau trei plopișori mărunți, unul lângă altul, care de
     departe se citeau ca un tufiș — nimic nu spunea cât e de înalt, fiindcă nu
     avea trunchi, iar coroana nu se ridica mai sus decât un om.

     Unul singur, mare, rezolvă tot: trunchiul îi dă înălțimea, coroana îi dă
     greutatea, iar oamenii care trec pe lângă el spun cât e de mare. Stă în
     spatele lor, cu rădăcina mai sus pe câmp — de-aia se și desenează aici, cu
     mult înaintea oamenilor. */
  /* Putin mai spre dreapta decat as fi pus din instinct: coroana tine w*0.11 in
     lateral, si de la 0.145 ii iesea o treime din ea afara din panza. */
  const cpX = w * 0.175, cpTalpa = h * 0.70, cpSus = h * 0.085;
  const cpInalt = cpTalpa - cpSus;

  // trunchiul: se subțiază de jos în sus, cu o îndoitură, ca orice copac crescut
  const scoarta = c.createLinearGradient(cpX - w * 0.02, 0, cpX + w * 0.02, 0);
  scoarta.addColorStop(0, '#6b5237');
  scoarta.addColorStop(0.45, '#4e3b26');
  scoarta.addColorStop(1, '#2f2418');
  c.fillStyle = scoarta;
  c.beginPath();
  c.moveTo(cpX - w * 0.0135, cpTalpa);
  c.bezierCurveTo(cpX - w * 0.010, cpTalpa - cpInalt * 0.35,
                  cpX - w * 0.007, cpTalpa - cpInalt * 0.6,
                  cpX - w * 0.004, cpTalpa - cpInalt * 0.86);
  c.lineTo(cpX + w * 0.004, cpTalpa - cpInalt * 0.86);
  c.bezierCurveTo(cpX + w * 0.008, cpTalpa - cpInalt * 0.6,
                  cpX + w * 0.011, cpTalpa - cpInalt * 0.35,
                  cpX + w * 0.015, cpTalpa);
  c.closePath();
  c.fill();
  /* Scoarta, in tuse verticale. Fara ele trunchiul e o pana de lemn turnata
     dintr-o bucata — singurul lucru neted intr-un tablou facut tot din pete. */
  campDeTuse(c, cpX - w * 0.014, cpTalpa - cpInalt * 0.88, w * 0.028, cpInalt * 0.88,
             40, -1.57, 0.4, h * 0.05, h * 0.006,
             ['#6b5237', '#3f3122', '#7d6242', '#2f2418'], 1210);
  // trei crengi care ies din trunchi spre coroană
  c.strokeStyle = '#3f3122';
  c.lineCap = 'round';
  for (const [q, lat, lung] of [[0.5, -1, 0.9], [0.62, 1, 0.85], [0.74, -1, 0.7]]) {
    c.lineWidth = Math.max(1.4, w * 0.007 * lung);
    c.beginPath();
    c.moveTo(cpX, cpTalpa - cpInalt * q);
    c.quadraticCurveTo(cpX + lat * w * 0.035, cpTalpa - cpInalt * (q + 0.10),
                       cpX + lat * w * 0.062 * lung, cpTalpa - cpInalt * (q + 0.16));
    c.stroke();
  }

  /* Coroana: pâlcuri de tușe, nu o bilă verde. Fiecare pâlc e o rămurea prinsă de
     lumină pe o parte și lăsată în umbră pe cealaltă, iar între ele rămân goluri
     prin care se vede cerul — un copac fără goluri arată a burete. */
  const PALCURI = [
    { fx: 0.00, fy: 0.34, r: 0.115, l: 1.0 },
    { fx: -0.09, fy: 0.46, r: 0.095, l: 0.7 },
    { fx: 0.10, fy: 0.44, r: 0.100, l: 0.85 },
    { fx: -0.05, fy: 0.60, r: 0.088, l: 0.6 },
    { fx: 0.07, fy: 0.62, r: 0.082, l: 0.75 },
    { fx: 0.00, fy: 0.20, r: 0.078, l: 1.0 },
    { fx: -0.11, fy: 0.29, r: 0.070, l: 0.8 },
    { fx: 0.11, fy: 0.28, r: 0.074, l: 0.9 }
  ];
  /* Doua treceri peste fiecare palc: intai una deasa, care face masa, apoi una
     rara pe deasupra, cu tuse mai mari si mai deschise, care prinde lumina.
     Cu o singura trecere de patruzeci de tuse, coroana ramanea o mana de frunze
     razlete — se vedea cerul prin ea mai mult decat frunzisul. */
  for (let k = 0; k < PALCURI.length; k++) {
    const p = PALCURI[k];
    const px = cpX + w * p.fx, py = cpSus + cpInalt * p.fy, pr = h * p.r;
    const paleta = p.l > 0.8
      ? ['#8fae5c', '#a6c06e', '#7a9a4c', '#c2d489', '#9dba68']
      : (p.l > 0.65 ? ['#6f9048', '#88a85a', '#5c7c3c', '#7f9c52']
                    : ['#4e6b34', '#5f7f40', '#3d5628', '#556f3a']);
    campDeTuse(c, px - pr, py - pr * 0.82, pr * 2, pr * 1.64, 130, -0.5, 1.6,
               h * 0.034, h * 0.021, paleta, 1300 + k * 61);
    campDeTuse(c, px - pr * 0.86, py - pr * 0.7, pr * 1.72, pr * 1.4, 34, -0.9, 1.9,
               h * 0.042, h * 0.016,
               p.l > 0.8 ? ['#c2d489', '#d6e0a2'] : ['#8fae5c', '#a6c06e'],
               1380 + k * 47);
  }
  /* Cateva frunze razlete chiar la marginea coroanei, ca sa nu para taiata cu
     foarfeca. Cat coroana, nu mai mult: prima oara se imprastiau pe o cutie cu
     mult mai lata decat copacul si ramanea o dunga verde plutind singura pe cer,
     in stanga, lipita de nimic. */
  campDeTuse(c, cpX - w * 0.062, cpSus + cpInalt * 0.10, w * 0.124, cpInalt * 0.52,
             30, -0.5, 2.2, h * 0.022, h * 0.013,
             ['#8fae5c', '#6f9048', '#a6c06e'], 1450);

  // umbra copacului pe grâu
  c.fillStyle = 'rgba(104, 88, 130, 0.28)';
  c.beginPath();
  c.ellipse(cpX + w * 0.03, cpTalpa + h * 0.006, w * 0.075, h * 0.016, 0.04, 0, Math.PI * 2);
  c.fill();

  /* Casa cu pridvor. Înainte aici sta un hambar, iar la capătul drumului
     jucătorul era poftit într-o dugheană — o șură cu ușa neagră. O casă e altceva:
     te primește. Casa asta e cea de pe Valea Bistriței și din Bucovina: pereți
     văruiți alb, soclu de piatră de râu, acoperiș de olane roșii în patru ape cu
     un turn peste pridvor, și tot lemnul dat cu albastru — stâlpi, arcade
     traforate, cercevele, ușă. Albastrul acela nu e o alegere de gust: e culoarea
     cu care se dădea lemnul la casele de aici, și fără ea casa nu mai e de nicăieri.

     Toate măsurile ies din `geomCasa`, ca ușile să se deschidă exact în golul
     lăsat pentru ele — dacă s-ar socoti în două locuri, s-ar despărți. */
  const K = geomCasa(w, h);

  // umbra casei pe iarbă, spre dreapta
  c.fillStyle = 'rgba(96, 74, 108, 0.25)';
  c.beginPath();
  c.ellipse(K.x + K.lat * 0.6, K.talpa + h * 0.012, K.lat * 0.62, h * 0.022, 0, 0, Math.PI * 2);
  c.fill();

  // ---- soclul de piatră de râu ----
  c.fillStyle = '#9a938a';
  c.fillRect(K.x, K.talpa - K.soclu, K.lat, K.soclu);
  for (let k = 0; k < 26; k++) {
    const a = samanta(700 + k * 3.7), b = samanta(700 + k * 6.1);
    c.fillStyle = ['#b3aca1', '#857f77', '#c2bcb2', '#6f6a63'][k % 4];
    const px = K.x + a * K.lat, py = K.talpa - K.soclu * (0.2 + b * 0.6);
    const prx = K.soclu * (0.18 + b * 0.2), pry = K.soclu * (0.13 + a * 0.12);
    c.beginPath();
    c.ellipse(px, py, prx, pry, a * 2, 0, Math.PI * 2);
    c.fill();
    // rostul de mortar și lumina de pe creasta pietrei
    c.strokeStyle = 'rgba(238, 234, 226, 0.55)';
    c.lineWidth = Math.max(0.5, K.soclu * 0.05);
    c.beginPath();
    c.ellipse(px, py, prx, pry, a * 2, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = 'rgba(255, 253, 246, 0.4)';
    c.beginPath();
    c.ellipse(px - prx * 0.25, py - pry * 0.35, prx * 0.4, pry * 0.3, a * 2, 0, Math.PI * 2);
    c.fill();
  }

  // ---- peretele văruit ----
  const var_ = c.createLinearGradient(K.x, K.sus, K.x + K.lat, K.talpa);
  var_.addColorStop(0, '#fffdf6');
  var_.addColorStop(0.55, '#f3eee1');
  var_.addColorStop(1, '#d9d2c2');
  c.fillStyle = var_;
  c.fillRect(K.x, K.sus, K.lat, K.talpa - K.soclu - K.sus);

  // ---- fereastra din peretele plin, cu ancadrament alb și cercevele albastre ----
  const fx = K.x + K.lat * 0.79, fy = K.sus + K.inalt * 0.28;
  const fw = K.lat * 0.14, fh = K.inalt * 0.36;
  c.fillStyle = '#ffffff';
  c.fillRect(fx - fw * 0.14, fy - fh * 0.12, fw * 1.28, fh * 1.2);
  c.fillStyle = ALBASTRU_CASA;
  c.fillRect(fx, fy, fw, fh);
  /* Sticla nu e o placă bleu: oglindește cerul sus și se întunecă spre pervaz,
     iar peste ea trece o dungă de lumină, ca la orice geam adevărat. */
  const sticla = c.createLinearGradient(fx, fy, fx + fw * 0.5, fy + fh);
  sticla.addColorStop(0, '#dbe9f2');
  sticla.addColorStop(0.5, '#9fb8ca');
  sticla.addColorStop(1, '#5d7385');
  c.fillStyle = sticla;
  c.fillRect(fx + fw * 0.1, fy + fh * 0.09, fw * 0.8, fh * 0.82);
  c.fillStyle = 'rgba(255, 255, 255, 0.4)';
  c.beginPath();
  c.moveTo(fx + fw * 0.12, fy + fh * 0.62);
  c.lineTo(fx + fw * 0.52, fy + fh * 0.1);
  c.lineTo(fx + fw * 0.68, fy + fh * 0.1);
  c.lineTo(fx + fw * 0.28, fy + fh * 0.62);
  c.closePath();
  c.fill();
  // cercevelele: patru ochiuri
  c.fillStyle = ALBASTRU_CASA;
  c.fillRect(fx + fw * 0.46, fy + fh * 0.09, fw * 0.08, fh * 0.82);
  c.fillRect(fx + fw * 0.1, fy + fh * 0.45, fw * 0.8, fh * 0.06);
  c.fillStyle = ALBASTRU_LUMINA;
  c.fillRect(fx + fw * 0.46, fy + fh * 0.09, fw * 0.03, fh * 0.82);
  c.fillRect(fx + fw * 0.1, fy + fh * 0.45, fw * 0.8, fh * 0.02);
  // pervazul, cu umbra lui pe perete
  c.fillStyle = '#ffffff';
  c.fillRect(fx - fw * 0.18, fy + fh * 1.02, fw * 1.36, fh * 0.07);
  c.fillStyle = 'rgba(120, 106, 88, 0.28)';
  c.fillRect(fx - fw * 0.18, fy + fh * 1.09, fw * 1.36, fh * 0.05);

  // ---- pridvorul: parapetul văruit cu coama albastră ----
  const px0 = K.x + K.lat * 0.04, px1 = K.usaX - K.lat * 0.03;
  const pSus = K.talpa - K.soclu - K.inalt * 0.36;
  c.fillStyle = '#fbf7ec';
  c.fillRect(px0, pSus, px1 - px0, K.talpa - K.soclu - pSus);
  c.fillStyle = ALBASTRU_CASA;
  c.fillRect(px0, pSus, px1 - px0, K.inalt * 0.045);

  // ---- ușa: golul întunecat în care se vor deschide canaturile ----
  c.fillStyle = '#ffffff';
  c.fillRect(K.usaX - K.usaW * 0.16, K.usaY - K.usaH * 0.07, K.usaW * 1.32, K.usaH * 1.09);
  const golUsa = c.createLinearGradient(K.usaX, K.usaY, K.usaX, K.usaY + K.usaH);
  golUsa.addColorStop(0, '#241a12');
  golUsa.addColorStop(1, '#3f2f22');
  c.fillStyle = golUsa;
  c.fillRect(K.usaX, K.usaY, K.usaW, K.usaH);

  // ---- stâlpii pridvorului, cu capiteluri crestate ----
  /* Stâlpii pridvorului. Erau subțiri cât o așchie și albaștri deschis pe perete
     alb: nu se vedeau. Un pridvor se recunoaște după stâlpi — dacă ei nu se văd,
     casa e doar un zid cu o ușă. */
  for (const q of [0.05, 0.285, 0.53]) {
    const sx = K.x + K.lat * q, sw = K.lat * 0.055;
    const trup = c.createLinearGradient(sx, 0, sx + sw, 0);
    trup.addColorStop(0, ALBASTRU_LUMINA);
    trup.addColorStop(0.35, ALBASTRU_CASA);
    trup.addColorStop(1, ALBASTRU_UMBRA);
    c.fillStyle = trup;
    c.fillRect(sx, K.sus + K.inalt * 0.04, sw, K.talpa - K.soclu - K.sus - K.inalt * 0.04);
    // crestăturile de pe fusul stâlpului
    c.fillStyle = 'rgba(10, 44, 92, 0.5)';
    for (let r = 0; r < 3; r++) {
      c.fillRect(sx, K.sus + K.inalt * (0.30 + r * 0.16), sw, K.inalt * 0.02);
    }
    // capitelul: o pernă lățită sub grindă
    c.fillStyle = ALBASTRU_CASA;
    c.fillRect(sx - sw * 0.42, K.sus + K.inalt * 0.04, sw * 1.84, K.inalt * 0.075);
    c.fillStyle = ALBASTRU_LUMINA;
    c.fillRect(sx - sw * 0.42, K.sus + K.inalt * 0.04, sw * 1.84, K.inalt * 0.018);
  }

  // ---- arcadele traforate dintre stâlpi ----
  c.fillStyle = ALBASTRU_CASA;
  c.fillRect(K.x, K.sus, K.lat * 0.60, K.inalt * 0.055);
  for (let k = 0; k * (K.lat * 0.028) < K.lat * 0.58; k++) {
    const ax = K.x + K.lat * 0.012 + k * K.lat * 0.028;
    c.beginPath();
    c.moveTo(ax, K.sus + K.inalt * 0.055);
    c.lineTo(ax + K.lat * 0.011, K.sus + K.inalt * 0.115);
    c.lineTo(ax + K.lat * 0.022, K.sus + K.inalt * 0.055);
    c.closePath();
    c.fill();
  }

  // ---- acoperișul: patru ape de olane, cu turnul peste pridvor ----
  const streasina = K.sus - K.inalt * 0.02;
  const coama = K.sus - K.inalt * 0.5;
  const olan = c.createLinearGradient(K.x, coama, K.x + K.lat, streasina);
  olan.addColorStop(0, '#e08a4e');
  olan.addColorStop(0.5, '#c25f34');
  olan.addColorStop(1, '#8f3f24');
  c.fillStyle = olan;
  c.beginPath();
  c.moveTo(K.x - K.lat * 0.055, streasina);
  c.lineTo(K.x + K.lat * 0.26, coama);
  c.lineTo(K.x + K.lat * 0.80, coama);
  c.lineTo(K.x + K.lat * 1.055, streasina);
  c.closePath();
  c.fill();
  // turnul piramidal de deasupra intrării
  c.beginPath();
  c.moveTo(K.x + K.lat * 0.30, coama + K.inalt * 0.02);
  c.lineTo(K.x + K.lat * 0.53, coama - K.inalt * 0.42);
  c.lineTo(K.x + K.lat * 0.78, coama + K.inalt * 0.02);
  c.closePath();
  c.fill();
  /* Olanele, una câte una. Casa e lucrul cel mai mare din tablou; pictată din
     dungi late, în timp ce oamenii sunt lucrați cu chip și cu cusături, iese pe
     dos: cu cât un lucru e mai mare, cu atât ochiul îi cere mai mult amănunt, nu
     mai puțin. Fiecare rând e un șir de solzi, decalat față de cel de sub el. */
  const randuri = 9;
  for (let r = 0; r < randuri; r++) {
    const q0 = r / randuri, q1 = (r + 1) / randuri;
    const stX = intre(K.x - K.lat * 0.055, K.x + K.lat * 0.26, q0);
    const drX = intre(K.x + K.lat * 1.055, K.x + K.lat * 0.80, q0);
    const y0 = intre(streasina, coama, q0), y1 = intre(streasina, coama, q1);
    const inaltRand = y0 - y1;
    const cate = Math.max(6, Math.round((drX - stX) / (K.lat * 0.045)));
    const latOlan = (drX - stX) / cate;
    for (let k = 0; k < cate; k++) {
      const ox = stX + (k + (r % 2 ? 0.5 : 0)) * latOlan;
      c.fillStyle = ['#d9793f', '#c25f34', '#e08a4e', '#a94c2a'][(k + r) % 4];
      c.beginPath();
      c.moveTo(ox, y0);
      c.lineTo(ox + latOlan, y0);
      c.lineTo(ox + latOlan, y0 - inaltRand * 0.5);
      c.quadraticCurveTo(ox + latOlan * 0.5, y0 - inaltRand * 1.1,
                         ox, y0 - inaltRand * 0.5);
      c.closePath();
      c.fill();
      c.strokeStyle = 'rgba(112, 44, 22, 0.35)';
      c.lineWidth = Math.max(0.5, K.inalt * 0.004);
      c.beginPath();
      c.moveTo(ox, y0); c.lineTo(ox, y0 - inaltRand * 0.6);
      c.stroke();
    }
  }
  // creasta de var de pe coamă, ca la casele văruite
  c.strokeStyle = 'rgba(240, 232, 214, 0.75)';
  c.lineWidth = Math.max(1, K.inalt * 0.016);
  c.beginPath();
  c.moveTo(K.x + K.lat * 0.26, coama);
  c.lineTo(K.x + K.lat * 0.80, coama);
  c.stroke();

  // ---- streașina de lemn albastru, cu console crestate ----
  c.fillStyle = ALBASTRU_CASA;
  c.fillRect(K.x - K.lat * 0.05, streasina, K.lat * 1.1, K.inalt * 0.05);
  c.fillStyle = ALBASTRU_UMBRA;
  for (let k = 0; k * (K.lat * 0.055) < K.lat * 1.05; k++) {
    c.fillRect(K.x - K.lat * 0.04 + k * K.lat * 0.055, streasina + K.inalt * 0.05,
               K.lat * 0.014, K.inalt * 0.03);
  }

  // ---- fruntarul traforat de sub turn ----
  c.fillStyle = ALBASTRU_CASA;
  c.beginPath();
  c.moveTo(K.x + K.lat * 0.31, coama + K.inalt * 0.02);
  c.lineTo(K.x + K.lat * 0.53, coama - K.inalt * 0.30);
  c.lineTo(K.x + K.lat * 0.76, coama + K.inalt * 0.02);
  c.lineTo(K.x + K.lat * 0.76, coama + K.inalt * 0.10);
  c.lineTo(K.x + K.lat * 0.31, coama + K.inalt * 0.10);
  c.closePath();
  c.fill();
  c.fillStyle = '#f6efdd';
  for (let k = 0; k < 3; k++) {
    c.fillRect(K.x + K.lat * (0.45 + k * 0.045), coama - K.inalt * 0.13,
               K.lat * 0.022, K.inalt * 0.10);
  }

  // ---- treptele de piatră ----
  for (let k = 0; k < 3; k++) {
    c.fillStyle = ['#b7b0a5', '#a29b91', '#8d867d'][k];
    c.fillRect(K.usaX - K.usaW * (0.2 + k * 0.14), K.talpa - K.soclu + k * K.soclu * 0.34,
               K.usaW * (1.4 + k * 0.28), K.soclu * 0.36);
  }

  // ---- pensula peste toată casa, ca să intre în pictură ----
  /* Pensula peste casă — dar fără niciun cenușiu. Un perete proaspăt văruit n-are
     pete sure pe el: are lumină caldă pe partea dinspre soare și umbră albăstruie
     pe cealaltă. Cenușiul neutru, oricât de puțin, se citește ca murdărie, nu ca
     umbră, și strica tocmai lucrul de care se agață ochiul la o casă de la noi —
     albul ei. */
  // umbra streșinii, căzută pe var
  const subStr = c.createLinearGradient(0, K.sus, 0, K.sus + K.inalt * 0.22);
  subStr.addColorStop(0, 'rgba(126, 132, 150, 0.32)');
  subStr.addColorStop(1, 'rgba(126, 132, 150, 0)');
  c.fillStyle = subStr;
  c.fillRect(K.x, K.sus, K.lat, K.inalt * 0.22);

  /* Pensula trece și peste casă, dar abia-abia: destul cât să nu iasă din pictură,
     nu atât cât să-i mănânce muchiile. Cu tușe late, casa — lucrul cel mai mare
     din tablou — ieșea pictată mai grosolan decât oamenii de lângă ea, adică pe
     dos față de cum lucrează ochiul. */
  campDeTuse(c, K.x - K.lat * 0.05, coama - K.inalt * 0.42, K.lat * 1.1,
             K.talpa - coama + K.inalt * 0.42, 46, 1.4, 0.5, h * 0.016, h * 0.006,
             ['rgba(255, 252, 242, 0.2)', 'rgba(255, 240, 214, 0.18)',
              'rgba(214, 122, 74, 0.14)', 'rgba(150, 186, 224, 0.14)'], 307);

  // cărarea care intră în tablou
  campDeTuse(c, w * 0.3, oriz + h * 0.06, w * 0.22, h * 0.5, 220, 1.15, 0.4,
             h * 0.05, h * 0.014, ['#e8cfa0', '#d6b681', '#c3a273', '#efe0bb'], 211);

  /* Pensula trece si peste casa. Pana aici, casa era singurul lucru din tablou
     desenat — contururi curate, culori intinse plat, olane numarate — intr-un
     peisaj facut numai din pete. Se citea ca un decupaj lipit peste pictura, si
     tocmai despre asta era vorba: „este pictata impresionist. Doar taranii sunt
     realisti". Tusele nu ascund casa, ii rup doar marginile si ii sparg
     suprafetele, atat cat sa fie de aceeasi mana cu restul.

     Culorile sunt luate din ea insasi: alb de var, albastru de tamplarie, rosu de
     olane. O paleta straina ar mansti-o, nu ar picta-o. */
  const KC = geomCasa(w, h);
  c.save();
  /* Usor de tot. Prima incercare a fost cu tuse pline, si casa s-a umplut de
     bulgari rosii — parea stropita cu noroi, nu pictata. O pensula care se vede
     mai tare decat lucrul peste care trece nu picteaza, murdareste: destul cat sa
     rupa conturul si sa sparga suprafata plata, si sa se opreasca acolo.
     Fiecare culoare pe locul ei: rosul numai pe acoperis, varul si albastrul
     numai pe pereti. O singura cutie peste toata casa arunca olane pe pereti. */
  c.globalAlpha = 0.26;
  campDeTuse(c, KC.x - KC.lat * 0.05, KC.sus - KC.inalt * 0.04,
             KC.lat * 1.10, KC.inalt * 0.44,
             70, -0.25, 1.2, h * 0.022, h * 0.009,
             ['#c0553a', '#a8462f', '#e8956b', '#f0c49c'], 1610);
  c.globalAlpha = 0.22;
  campDeTuse(c, KC.x - KC.lat * 0.02, KC.sus + KC.inalt * 0.40,
             KC.lat * 1.04, (KC.talpa + KC.soclu) - (KC.sus + KC.inalt * 0.40),
             90, -0.4, 1.5, h * 0.02, h * 0.009,
             ['#f2ece0', '#ded4c0', '#b6a893', ALBASTRU_LUMINA, '#8d7f6c'], 1660);
  c.restore();

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

/* ---- cei trei țărani și ușile casei, desenați vii ---- */

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

/* Chipul. Era un cerc de culoarea pielii cu două puncte și o linie — de ajuns
   cât oamenii erau cât degetul, mult prea puțin de când perspectiva i-a făcut de
   trei ori mai mari.

   Un obraz nu e rotund: craniul e lat la tâmple și se strânge spre bărbie, cu
   pomeții ieșiți în afară. Lumina vine din stânga-sus, ca soarele din tablou, așa
   că partea dreaptă a feței stă în umbră, iar sub bărbie cade o umbră pe gât.
   Ochiul are pleoapă, iris și o scânteie; nasul se vede din umbra lui, nu dintr-o
   linie; gura are buza de sus mai închisă decât cea de jos.

   Toate măsurile sunt în `s`, mărimea omului, ca fața să se strângă odată cu el
   când se depărtează. */
function chipTaran(c, s, femeie, acum, dinSpate) {
  const cy = -s * 1.02, rx = s * 0.105, ry = s * 0.128;

  // craniul: un ou, lat la tâmple, îngustat spre bărbie
  const obraz = c.createLinearGradient(-rx, cy - ry, rx * 0.8, cy + ry);
  obraz.addColorStop(0, '#f0cda6');
  obraz.addColorStop(0.45, PORT_ROMANESC.piele);
  obraz.addColorStop(1, '#b78e63');
  c.fillStyle = obraz;
  c.beginPath();
  c.moveTo(0, cy - ry);
  c.bezierCurveTo(rx * 1.02, cy - ry * 0.92, rx * 1.06, cy + ry * 0.12, rx * 0.70, cy + ry * 0.64);
  c.bezierCurveTo(rx * 0.40, cy + ry * 1.06, -rx * 0.40, cy + ry * 1.06, -rx * 0.70, cy + ry * 0.64);
  c.bezierCurveTo(-rx * 1.06, cy + ry * 0.12, -rx * 1.02, cy - ry * 0.92, 0, cy - ry);
  c.closePath();
  c.fill();

  // umbra de sub pălărie sau năframă, pe frunte
  const subBor = c.createLinearGradient(0, cy - ry, 0, cy - ry * 0.15);
  subBor.addColorStop(0, 'rgba(96, 64, 34, 0.42)');
  subBor.addColorStop(1, 'rgba(96, 64, 34, 0)');
  c.fillStyle = subBor;
  c.beginPath();
  c.ellipse(0, cy - ry * 0.5, rx * 0.98, ry * 0.55, 0, 0, Math.PI * 2);
  c.fill();

  // părul, ivit de sub acoperământ, la tâmple
  c.fillStyle = femeie ? '#4a382a' : '#3d2c1f';
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.moveTo(lat * rx * 0.98, cy - ry * 0.42);
    c.quadraticCurveTo(lat * rx * 1.12, cy - ry * 0.02, lat * rx * 0.86, cy + ry * 0.22);
    c.quadraticCurveTo(lat * rx * 0.82, cy - ry * 0.2, lat * rx * 0.72, cy - ry * 0.5);
    c.closePath();
    c.fill();
  }

  if (dinSpate) {
    /* Ceafa. Cand pleaca spre casa, oamenii se intorc cu spatele — nimeni nu
       merge cu spatele inainte, si un chip care te priveste in timp ce se
       departeaza strica tot drumul.

       De la spate nu se schimba mai nimic din port: camasa, pieptarul, braul,
       altita sunt la fel si pe dinapoi. Se schimba capul, si atat: in locul
       ochilor, al nasului si al gurii vine parul, iar ceafa ramane in umbra,
       fiindca soarele bate din fata tabloului. */
    const par = femeie ? '#4b3524' : '#3b2a1c';
    c.fillStyle = par;
    c.beginPath();
    c.ellipse(0, cy - ry * 0.12, rx * 0.94, ry * 0.9, 0, 0, Math.PI * 2);
    c.fill();
    if (femeie) {
      // conciul strans sub naframa, cu nodul lui
      c.fillStyle = PORT_ROMANESC.panza;
      c.beginPath();
      c.ellipse(0, cy - ry * 0.3, rx * 0.98, ry * 0.82, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = 'rgba(120, 96, 66, 0.35)';
      c.beginPath();
      c.ellipse(0, cy + ry * 0.42, rx * 0.5, ry * 0.3, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = par;
      c.fillRect(-rx * 0.13, cy + ry * 0.5, rx * 0.26, ry * 0.55);
    } else {
      // cateva suvite peste ceafa, sub borul palariei
      c.strokeStyle = '#2c1f14';
      c.lineWidth = Math.max(0.5, s * 0.008);
      for (let k = -2; k <= 2; k++) {
        c.beginPath();
        c.moveTo(k * rx * 0.3, cy - ry * 0.2);
        c.quadraticCurveTo(k * rx * 0.34, cy + ry * 0.4, k * rx * 0.26, cy + ry * 0.72);
        c.stroke();
      }
    }
    // umbra pe ceafa: lumina vine din fata tabloului, deci spatele capului sta in umbra
    const umbraCefei = c.createRadialGradient(0, cy - ry * 0.4, 0, 0, cy, ry * 1.3);
    umbraCefei.addColorStop(0, 'rgba(40, 28, 18, 0)');
    umbraCefei.addColorStop(1, 'rgba(40, 28, 18, 0.45)');
    c.fillStyle = umbraCefei;
    c.beginPath();
    c.ellipse(0, cy - ry * 0.12, rx * 0.96, ry * 0.94, 0, 0, Math.PI * 2);
    c.fill();
    // urechile, la marginea siluetei
    c.fillStyle = '#c99a6d';
    for (const lat of [-1, 1]) {
      c.beginPath();
      c.ellipse(lat * rx * 0.93, cy, rx * 0.13, ry * 0.2, 0, 0, Math.PI * 2);
      c.fill();
    }
    return;
  }

  // sprâncenele
  c.strokeStyle = femeie ? '#5a4432' : '#4a3524';
  c.lineWidth = Math.max(0.8, s * 0.011);
  c.lineCap = 'round';
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.moveTo(lat * rx * 0.66, cy - ry * 0.30);
    c.quadraticCurveTo(lat * rx * 0.36, cy - ry * 0.40, lat * rx * 0.14, cy - ry * 0.30);
    c.stroke();
  }

  /* Ochii. Clipesc rar și amândoi odată — un om care nu clipește deloc se uită
     ca o păpușă, iar unul care clipește des pare speriat. */
  const clipeste = ((acum + (femeie ? 1700 : 0)) % 4600) < 130;
  for (const lat of [-1, 1]) {
    const ox = lat * rx * 0.40, oy = cy - ry * 0.10;
    if (clipeste) {
      c.strokeStyle = '#6b503a';
      c.lineWidth = Math.max(0.8, s * 0.009);
      c.beginPath();
      c.moveTo(ox - rx * 0.2, oy); c.quadraticCurveTo(ox, oy + ry * 0.06, ox + rx * 0.2, oy);
      c.stroke();
      continue;
    }
    // albul ochiului
    c.fillStyle = '#f6efe4';
    c.beginPath();
    c.ellipse(ox, oy, rx * 0.19, ry * 0.115, 0, 0, Math.PI * 2);
    c.fill();
    // irisul și pupila
    c.fillStyle = femeie ? '#6a4a2c' : '#4f3a24';
    c.beginPath();
    c.arc(ox + rx * 0.02, oy, ry * 0.085, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#20150c';
    c.beginPath();
    c.arc(ox + rx * 0.02, oy, ry * 0.042, 0, Math.PI * 2);
    c.fill();
    // scânteia: fără ea, privirea e stinsă
    c.fillStyle = 'rgba(255, 255, 255, 0.9)';
    c.beginPath();
    c.arc(ox - rx * 0.03, oy - ry * 0.035, ry * 0.028, 0, Math.PI * 2);
    c.fill();
    // pleoapa de sus, care taie puțin din ochi
    c.strokeStyle = 'rgba(90, 66, 44, 0.75)';
    c.lineWidth = Math.max(0.7, s * 0.008);
    c.beginPath();
    c.moveTo(ox - rx * 0.19, oy - ry * 0.03);
    c.quadraticCurveTo(ox, oy - ry * 0.15, ox + rx * 0.19, oy - ry * 0.03);
    c.stroke();
  }

  // nasul: se vede din umbra lui, nu dintr-o linie trasă
  c.fillStyle = 'rgba(150, 106, 66, 0.35)';
  c.beginPath();
  c.moveTo(rx * 0.05, cy - ry * 0.06);
  c.quadraticCurveTo(rx * 0.20, cy + ry * 0.20, rx * 0.02, cy + ry * 0.30);
  c.quadraticCurveTo(-rx * 0.06, cy + ry * 0.24, -rx * 0.02, cy + ry * 0.02);
  c.closePath();
  c.fill();
  c.fillStyle = 'rgba(255, 242, 222, 0.5)';
  c.beginPath();
  c.ellipse(-rx * 0.04, cy + ry * 0.1, rx * 0.05, ry * 0.13, -0.1, 0, Math.PI * 2);
  c.fill();

  // pomeții, îmbujorați de soare și de vânt
  c.fillStyle = femeie ? 'rgba(206, 108, 96, 0.3)' : 'rgba(190, 104, 78, 0.22)';
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.ellipse(lat * rx * 0.56, cy + ry * 0.22, rx * 0.26, ry * 0.16, lat * 0.2, 0, Math.PI * 2);
    c.fill();
  }

  // gura: buza de sus mai închisă decât cea de jos
  c.fillStyle = '#a45a4c';
  c.beginPath();
  c.moveTo(-rx * 0.26, cy + ry * 0.55);
  c.quadraticCurveTo(-rx * 0.12, cy + ry * 0.48, 0, cy + ry * 0.54);
  c.quadraticCurveTo(rx * 0.12, cy + ry * 0.48, rx * 0.26, cy + ry * 0.55);
  c.quadraticCurveTo(rx * 0.10, cy + ry * 0.70, -rx * 0.10, cy + ry * 0.70);
  c.closePath();
  c.fill();
  c.fillStyle = 'rgba(232, 150, 132, 0.6)';
  c.beginPath();
  c.ellipse(0, cy + ry * 0.635, rx * 0.16, ry * 0.055, 0, 0, Math.PI * 2);
  c.fill();

  // umbra bărbiei pe gât
  c.fillStyle = 'rgba(126, 88, 54, 0.32)';
  c.beginPath();
  c.ellipse(0, cy + ry * 1.02, rx * 0.5, ry * 0.16, 0, 0, Math.PI);
  c.fill();
}

/* Culoarea de sub pensulă la o anumită înălțime de pe trup. Tușele care se
   așază peste figură nu se împrăștie la voia întâmplării: fiecare cade acolo
   unde e culoarea ei, altfel omul iese mânjit, nu pictat. `u` merge de la 0 în
   creștet la 1 la tălpi. */
function culoareLaInaltime(u, femeie, zar, dinAx) {
  /* `zar` e un număr între 0 și 1, luat din sămânța tușei — nu din `Math.random`.
     Cu zaruri aruncate la fiecare cadru, culorile tușelor săreau de la una la
     alta de șaizeci de ori pe secundă, și pictura clocotea. */
  if (u < 0.14) return femeie ? PORT_ROMANESC.panza : PORT_ROMANESC.negru;
  if (u < 0.24) return PORT_ROMANESC.piele;
  /* `dinAx` spune cât de departe de mijloc cade tușa, de la 0 la 1. Fără ea, o
     tușă neagră de pieptar putea să cadă pe mâneca albă, iar una albă pe pieptar:
     amândouă ies sure, și omul pare murdar, nu pictat. Pieptarul stă la mijloc,
     mânecile pe laturi — fiecare culoare rămâne la ea acasă. */
  if (u < 0.60) {
    if (femeie) return PORT_ROMANESC.panza;
    return dinAx < 0.5 ? (zar < 0.5 ? PORT_ROMANESC.negru : '#2b2521')
                       : PORT_ROMANESC.panza;
  }
  if (u < 0.68) return femeie ? PORT_ROMANESC.rosu : PORT_ROMANESC.opinca;
  if (u < 0.96) return femeie ? (zar < 0.5 ? PORT_ROMANESC.rosu : PORT_ROMANESC.visin)
                              : PORT_ROMANESC.panza;
  return PORT_ROMANESC.opinca;
}

/* Tușele de peste figură. Câmpul, cerul, căpițele — tot tabloul e făcut din
   dâre scurte de culoare; numai oamenii erau forme pline, cu muchii tăiate, și
   se vedeau lipiți pe pictură ca niște decupaje. Peste fiecare trec acum vreo
   patruzeci de tușe care iau culoarea de sub ele, rup conturul și îl leagă de
   restul pânzei.

   Sămânța e legată de om, nu de ceas: altfel tușele ar fierbe de la un cadru la
   altul, și pictura ar clocoti. */
function tuseDeTaran(c, s, femeie, samantaOmului) {
  /* Puține și subțiri. Patruzeci de tușe groase peste un om lăsau pe cămașa albă
     niște pete sure — mânjeau tocmai lucrul pe care îl voiam limpede: oamenii
     sunt singurii din tablou lucrați în amănunt, cu chip și cu cusături, și
     pensula n-are voie să le ia amănuntul înapoi. Atât cât să nu pară decupați,
     nu atât cât să pară murdari. */
  const cate = 18;
  for (let k = 0; k < cate; k++) {
    const a = samanta(samantaOmului + k * 2.7);
    const b = samanta(samantaOmului + k * 5.3 + 11);
    const q = samanta(samantaOmului + k * 8.1 + 23);
    const u = b;                                  // înălțimea pe trup, de la creștet
    // peste obraz nu trece pensula: acolo detaliul e tot ce spune cine e omul
    if (u > 0.12 && u < 0.27) continue;
    const razna = 0.62 - 0.28 * Math.abs(u - 0.5) * 2;
    const lat = (a - 0.5) * s * razna;
    const y = -s * 1.24 + u * s * 1.28;
    const dinAx = Math.min(1, Math.abs(a - 0.5) * 2);
    tusa(c, lat, y,
         s * (0.06 + q * 0.07), s * (0.014 + q * 0.016),
         -1.45 + (q - 0.5) * 1.1,
         culoareLaInaltime(u, femeie, samanta(samantaOmului + k * 13.7 + 41), dinAx),
         0.08 + q * 0.1);
  }
}

/* Un țăran în port: ie sau cămașă de pânză cu altiță cusută pe umăr, brâu,
   catrință vărgată ori iţari, opinci. Femeia are năframă albă, bărbatul pălărie
   neagră cu boruri mici și pieptar negru cu găitan auriu.

   `mers` e cât de tare calcă, de la 0 la 1. Fără el, cei trei alunecau spre
   casă cu picioarele înțepenite, ca niște decupaje trase pe sfoară.

   Ordinea de desen contează mai mult decât orice altceva aici: întâi picioarele,
   pe urmă mânecile, abia apoi trupul peste ele. Desenate invers, fiecare mădular
   își arăta muchia lipită de cămașă. */
function taranIn(c, w, h, tx, ty, marime, tip, salut, acum, mers, samantaOmului, pleaca) {
  const s = h * marime;
  const femeie = tip === 'femeie';
  const calca = Math.max(0, Math.min(1, mers || 0));

  /* Pasul și săltatul din el. Trupul urcă de două ori pe pas, în clipa în care
     un picior trece pe lângă celălalt — de-aia cosinusul e la dublu. */
  const faza = acum * 0.007;
  const pas = Math.sin(faza) * calca;
  const salt = calca * Math.abs(Math.cos(faza)) * s * 0.022;
  const legan = Math.sin(faza * 2) * calca * 0.03;

  /* Intoarcerea spre casa. Nu o clipire de la fata la ceafa, ci o rasucire: cat
     tine, omul se ingusteaza pana se vede din muchie, apoi se largeste la loc —
     acelasi lucru care se intampla si cu canaturile usii, si din acelasi motiv,
     ca panza e plata si nu are adancime in care sa se roteasca ceva.
     La jumatatea rasucirii, cand oricum nu se vede aproape nimic, chipul lasa
     locul cefei. */
  const intors = Math.max(0, Math.min(1, ((pleaca || 0) - 0.02) / 0.13));
  const dinSpate = intors > 0.5;
  const ingustare = intors > 0 && intors < 1
    ? Math.max(0.14, Math.abs(Math.cos(intors * Math.PI))) : 1;

  c.save();
  c.translate(w * tx, h * ty - salt);
  c.rotate(legan);
  if (ingustare < 1) c.scale(ingustare, 1);

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
  chipTaran(c, s, femeie, acum, dinSpate);

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

  // pensula trece peste tot omul, ca peste restul tabloului
  /* (chipul s-a desenat mai sus, cu fata sau cu ceafa, dupa cum merge) */
  tuseDeTaran(c, s, femeie, (samantaOmului || 0) * 97.3 + 5);

  /* Și, la urmă, câteva fire de grâu cresc peste tălpi și peste poale. Fără ele,
     omul stă *pe* pictură, ca un decupaj așezat deasupra; cu ele, stă *în* ea —
     câmpul trece prin fața lui, așa cum trece prin fața oricui stă în lan.
     Ăsta e lucrul care lipsea, nu încă un strat de tușe peste haine. */
  const samGrau = (samantaOmului || 0) * 53.9 + 71;
  for (let k = 0; k < 14; k++) {
    const a = samanta(samGrau + k * 3.3), b = samanta(samGrau + k * 7.1);
    tusa(c, (a - 0.5) * s * 0.66, s * (0.06 - b * 0.26),
         s * (0.16 + b * 0.16), s * (0.016 + a * 0.018),
         -1.35 + (a - 0.5) * 0.7,
         ['#e8cf8a', '#d6b681', '#f2dc9d', '#c9a24a'][k % 4],
         0.5 + b * 0.4);
  }

  c.restore();
}

/* Trei oameni, la departari diferite de privitor. `statura` e cat e de inalt
   omul in sine, pe langa cat il micsoreaza departarea: fara ea, cei trei erau
   croiti din aceeasi matrita si se vedea. Intr-un grup adevarat unul e lung si
   desirat, altul indesat. Barbatul din fata e cel mai inalt, femeia e cu un cap
   mai scunda, iar cel din spate e un flacaiandru. */
/* Cei trei, așezați pe câmp. `y` e locul unde calcă, iar din el iese mărimea —
   nu invers.

   `statura` a rămas, dar acum e numai cât e omul de înalt în sine, și **nu merge
   în pas cu depărtarea**: cel din spate e un bărbat lung, cea din mijloc e mai
   scundă, cel din față e de statură obișnuită. Înainte scădea odată cu
   depărtarea și se aduna peste ea, așa că cel din fund ieșea de două ori mai mic
   decât cel din față — o depărtare pe care ochiul o citea ca pe o greșeală, nu
   ca pe o distanță. */
/* Doi oameni, o femeie si un barbat. Erau trei, si al treilea nu spunea nimic
   in plus: statea intre ceilalti doi ca sa umple locul. Doi se citesc dintr-o
   privire — el mai in fata, ea mai in adanc — si intre ei ramane camp, care e
   tocmai subiectul tabloului. */
const TARANI = [
  { x: 0.255, y: 0.935, statura: 1.00, tip: 'barbat' },
  { x: 0.430, y: 0.815, statura: 0.94, tip: 'femeie' }
];

/* Cât de mare se vede un om care stă pe câmp.

   Regula e a perspectivei, nu a gustului: într-un tablou cu un singur punct de
   fugă, un om de aceeași statură se vede cu atât mai mare cu cât calcă mai
   departe de linia orizontului. Înălțimea lui e proporțională cu depărtarea de
   la orizont până la tălpi. Scrisă de mână, mărime cu mărime, socoteala iese
   mereu puțin strâmbă — și se vede, fiindcă ochiul cunoaște regula asta chiar
   dacă n-o știe pe nume. */
const ORIZONT_TABLOU = 0.44;          // unde stă linia orizontului, din înălțime
const INALT_TARAN_LA_MARGINE = 0.47;  // cât ar măsura un om care calcă chiar în față

function marimeTaran(t, pleaca) {
  const departare = Math.max(0.02, t.y - ORIZONT_TABLOU);
  const laMargine = 1 - ORIZONT_TABLOU;
  const dinPerspectiva = INALT_TARAN_LA_MARGINE * (departare / laMargine);
  /* La capătul drumului stau în pragul casei, adică mult mai departe decât la
     început — deci mult mai mici. Cât de mici, o spune tot regula depărtării:
     acolo unde e casa, un om măsoară cam un sfert din cât măsoară aici, în față. */
  return dinPerspectiva * (t.statura || 1) * intre(1, 0.23, Math.min(1, pleaca || 0));
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
    // când pleacă spre casă, se mută spre ușa ei
    /* Se duc spre ușa casei, care e mai sus și mai departe decât locul lor
       de acum. Înainte coborau spre y = 0.78, adică veneau spre privitor în timp
       ce se micșorau — două lucruri care se bat cap în cap. */
    const x = intre(t.x, 0.775 + k * 0.018, pleaca);
    const y = intre(t.y, 0.565 + k * 0.006, pleaca);
    taranIn(c, w, h, x, y, marimeTaran(t, pleaca), t.tip,
            salut * (1 - pleaca), acum + k * 260, mers, k + 1, pleaca);
  }
}

/* Ușa casei: două canaturi albastre cu tăblii, care se dau în lături. Era o ușă
   de șură, din scânduri brune bătute în cuie — se potrivea cu hambarul, nu cu o
   casă în care ești poftit. */
/* Usile casei, care se deschid la capatul drumului.

   Se roteau, pur si simplu: fiecare canat se invartea in jurul balamalei cu
   `c.rotate`. Dar pe o pinza plata nu exista adancime in care sa se roteasca, asa
   ca amandoua se rasturnau lateral — doua scanduri care cad, nu o usa care se
   deschide.

   O usa vazuta din fata face altceva: nu se inclina deloc, ci se *ingusteaza*.
   Canatul ramane drept si vertical, iar latimea lui pe care o mai vezi scade cu
   cosinusul unghiului, pana cand, deschis de tot, nu mai vezi decat muchia. Ce
   creste in loc e golul negru dintre canaturi, si dungita de lemn a muchiei, cu
   atat mai lata cu cat usa e mai deschisa. Asta face ochiul sa citeasca „se
   deschide", nu rotatia. */
function usileCasei(c, w, h, deschidere) {
  const K = geomCasa(w, h);
  const ux = K.usaX, uy = K.usaY, uw = K.usaW, uh = K.usaH;
  const unghi = Math.max(0, Math.min(1, deschidere)) * 1.32;
  const ramas = Math.cos(unghi);      // cat din latimea canatului se mai vede
  const muchie = Math.sin(unghi);     // cat din grosimea lui a iesit la vedere

  /* Intai golul: intunericul tindei, care se lumineaza dinauntru. Se vede numai
     pe unde s-au dat canaturile la o parte, fiindca peste el vin ele. */
  const tinda = c.createLinearGradient(ux, uy, ux, uy + uh);
  tinda.addColorStop(0, '#241c15');
  tinda.addColorStop(1, '#120d09');
  c.fillStyle = tinda;
  c.fillRect(ux, uy, uw, uh);

  if (deschidere > 0.05) {
    /* Lumina din casa. Cade pe pragul de jos, nu pe tot golul: asa se simte ca
       vine dinauntru, de la o lampa asezata pe masa, nu ca e o folie galbena
       lipita peste usa. */
    const lum = c.createRadialGradient(ux + uw / 2, uy + uh * 0.72, 0,
                                       ux + uw / 2, uy + uh * 0.72, uh * 0.72);
    lum.addColorStop(0, `rgba(255, 226, 158, ${0.72 * deschidere})`);
    lum.addColorStop(0.55, `rgba(232, 176, 96, ${0.3 * deschidere})`);
    lum.addColorStop(1, 'rgba(232, 176, 96, 0)');
    c.fillStyle = lum;
    c.fillRect(ux, uy, uw, uh);
  }

  for (const lat of [-1, 1]) {
    /* Balamaua sta la tocul din partea ei, iar canatul se ingusteaza *spre*
       balama. Stanga tine de la ux spre dreapta, dreapta de la ux+uw spre
       stanga — de-aia semnul intra numai in capetele intervalului, nu in scara:
       amandoua se scurteaza la fel, doar ca fiecare spre partea ei. */
    const bx = lat < 0 ? ux : ux + uw;
    c.save();
    c.translate(bx, uy);
    c.scale(ramas, 1);
    const x0 = lat < 0 ? 0 : -uw / 2;

    // canatul: fata vopsita, cu lumina dinspre stanga sus
    const lemn = c.createLinearGradient(x0, 0, x0 + uw / 2, uh);
    lemn.addColorStop(0, ALBASTRU_LUMINA);
    lemn.addColorStop(0.4, ALBASTRU_CASA);
    lemn.addColorStop(1, ALBASTRU_UMBRA);
    c.fillStyle = lemn;
    c.fillRect(x0, 0, uw / 2, uh);
    // cele doua tablii, una sus si una jos
    c.fillStyle = ALBASTRU_UMBRA;
    c.fillRect(x0 + uw * 0.06, uh * 0.07, uw * 0.38, uh * 0.36);
    c.fillRect(x0 + uw * 0.06, uh * 0.52, uw * 0.38, uh * 0.4);
    c.fillStyle = ALBASTRU_LUMINA;
    c.fillRect(x0 + uw * 0.08, uh * 0.09, uw * 0.34, uh * 0.32);
    c.fillRect(x0 + uw * 0.08, uh * 0.54, uw * 0.34, uh * 0.36);
    // clanta de alama, pe marginea libera — pleaca odata cu canatul
    c.fillStyle = '#c9a227';
    c.beginPath();
    c.arc(x0 + (lat < 0 ? uw * 0.44 : uw * 0.06), uh * 0.5, uw * 0.03, 0, Math.PI * 2);
    c.fill();
    c.restore();

    if (muchie > 0.02) {
      /* Grosimea canatului, iesita la vedere. Fara ea, usa deschisa arata ca o
         hartie taiata: se ingusteaza pana dispare, fara sa fi fost vreodata din
         lemn. E umbrita, fiindca sta intoarsa dinspre soare. */
      const liber = lat < 0 ? ux + uw / 2 * ramas : ux + uw - uw / 2 * ramas;
      c.fillStyle = 'rgba(30, 40, 58, 0.62)';
      c.fillRect(liber - (lat < 0 ? 0 : uw * 0.075 * muchie), uy,
                 uw * 0.075 * muchie, uh);
    }
  }

  /* Pragul: o dunga de piatra tocita de atatea intrari, care leaga golul de
     drum. Se vede numai cand usa e deschisa — inainte, canaturile il acopera. */
  if (deschidere > 0.15) {
    c.fillStyle = `rgba(168, 152, 128, ${0.5 * deschidere})`;
    c.fillRect(ux, uy + uh - uh * 0.022, uw, uh * 0.022);
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
  /* Cand usile s-au deschis, orice atingere pe tablou te duce inauntru. Pe tot
     tabloul, nu numai pe usa: usa e mica in panza, iar cine nu nimereste de doua
     ori crede ca nu se poate intra. */
  if (s5.faza === 'casa' && s5.usi > 0.75) {
    const T = pregatesteTablou();
    if (typeof intraInFoc === 'function') intraInFoc(acum);
    return;
  }
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

  if (s5.faza === 'viu' && acum - s5.t0 > 5200) { s5.faza = 'casa'; s5.t0 = acum; }
  if (s5.faza === 'casa') {
    s5.plecare = Math.min(1, s5.plecare + dt / 2600);
    if (s5.plecare >= 1) s5.usi = Math.min(1, s5.usi + dt / 2200);
    /* Usa ramane deschisa si asteapta. Inainte, dupa noua secunde te lua de mana
       si te ducea inapoi la custode — dar la capatul drumului sta o usa deschisa
       intr-o casa in care tocmai au intrat doi oameni, si singurul lucru firesc
       e sa intri dupa ei. De-aia scena nu se mai incheie singura: se incheie
       cand atingi usa.

       Sala a sasea se picteaza din vreme, cat timp inca se deschid usile: altfel
       primul cadru de acolo ar picta toata rotonda si intrarea s-ar simti ca o
       poticnire. Aceeasi lectie ca la galerie. */
    if (s5.usi > 0.3 && typeof pregatesteSalaFocului === 'function') pregatesteSalaFocului();
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
  usileCasei(cc, T.latime, T.inaltime, s5.usi);
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

  /* Fișa de sală, pictată chiar pe peretele din stânga lucrării, ca o inscripție
     murală — nu agățată în fața lui pe un carton. Apare odată cu rama: cât stai
     cu nasul în pânză n-ai unde s-o citești, și n-ar avea niciun rost. */
  if (s5.ramaSeVede) {
    const lat = Math.min(W * 0.2, Math.max(W * 0.12, rx - W * 0.055));
    const inalt = Math.min(inaltRama * 0.78, podea * 0.52);
    fisaPePanou(ctx, rx - lat - W * 0.028, ry + inaltRama * 0.5 - inalt / 2,
                lat, inalt, 'Impresionism', TEXT_FISA_IMPRESIONISM, null, true);
  }

  if (s5.faza === 'sala' || s5.faza === 'viu') pantofiiDePeJos();

  // porunca
  if (s5.faza === 'sala') {
    const ramase = PASI_INAPOI - s5.pasi;
    const vorba = ramase === PASI_INAPOI
      ? 'Fă 10 pași în spate.'
      : (ramase > 0 ? 'Încă ' + ramase + (ramase === 1 ? ' pas.' : ' pași.') : '');
    if (vorba) {
      ctx.font = scrisGeorgia(22, 'bold');
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
      textIncadrat(vorba, cx, cy, W * 0.6, ecran(26), scrisGeorgia(22, 'bold'), '#3a3327');
    }
  }

  /* Strigatul lor, scris. A fost o vreme rostit cu vocea calculatorului — se
     auzea, dar suna a robot, nu a om care striga peste camp. Mai bine citit. */
  if (s5.faza === 'viu') {
    const vorba = 'De acolo, de departe, ne vezi mai bine? Hai cu noi!';
    ctx.font = scrisGeorgia(22, 'bold');
    const latV = ctx.measureText(vorba).width;
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = CREM_HARTIE;
    dreptunghi(W * 0.5 - latV / 2 - 22, H * 0.84 - 12, latV + 44, 44, 14);
    ctx.restore();
    textIncadrat(vorba, W * 0.5, H * 0.84, W * 0.7, ecran(26), scrisGeorgia(22, 'bold'), '#3a3327');
  }
  if (s5.faza === 'casa' && s5.usi > 0.5) {
    textIncadrat('Hai înăuntru.', W * 0.5, H * 0.86, W * 0.5, 26,
                 scrisGeorgia(21, 'bold'), '#4a4132');
  }
}
