/* ---------- 6. SCENA 2 — MINGEA, ELEFANTUL ȘI PETELE ---------- */

// Mingea de plajă (fostul balon), cu dungi roșii, albastre și galbene
const minge = {
  x: 0, y: 0,
  vy: 0,
  raza: 0,
  razaStart: 0,           // cât de mare era când s-a desprins din balon
  razaTinta: 0,           // cât de mare ajunge — vizibil mai mare decât balonul
  rotatie: 0,
  sol: 0,                 // înălțimea „pământului" pe care sare
  luminozitate: 0,        // strălucirea de bucurie după o atingere blândă
  sarituriRamase: 0,
  sareDeBucurie: false,
  turtire: 0,             // cât e de îndesată acum, de la atingere sau aterizare
  atinsaInCrestere: false,// ai pus degetul pe ea înainte să apuce să se facă
  mod: 'liber',           // 'liber' | 'fuge' | 'ascunsa' | 'revine'
  timpAscundere: 0,
  ultimaProvocare: 0,
  inBuzunar: false
};

// Elefantul-cub roșu care se plimbă în depărtare
const elefant = {
  x: 0,
  scara: 0.62,            // 0.62 = în depărtare; 1.1 = aproape, în prim-plan
  directie: -1,           // -1 = merge spre stânga, 1 = spre dreapta
  fazaMers: 0,
  stare: 'plimbare',      // 'plimbare' | 'vine' | 'priveste' | 'prinde' | 'aspira' | 'retrage'
  tintaX: 0,
  tintaScara: 0.62,
  inceputPrivit: 0,
  inceputPrindere: 0,
  prindeDe: { x: 0, y: 0 },   // de unde a luat mingea (pentru animația labei)
  razaPrinsa: 0,
  urmatoareaAspirare: 0,
  ultimulClipit: 0,
  urmatorulClipit: 0
};

/* Culorile aspirate nu se pierd. Elefantul le trimite mai departe: ies pe
   creștetul lui ca niște baloane colorate, urcă legănat spre cer și vopsesc
   ușor norii pe lângă care trec. Curățenia nu mai e un timp mort în care nu
   se întâmplă nimic — e momentul în care cerul se colorează.

   Cele care merg în pământ se fac plante de la sine: grădina crește fără să i
   se ceară nimic nimănui. Cele care merg în cer nu: ele urcă, își iau un loc și
   plutesc acolo, legănându-se, până le atingi tu. Norul e al tău, nu al
   ceasului — altfel cerul s-ar umple singur cât te uiți. */
const baloaneCuloare = [];

/* Câte baloane rabdă cerul deodată. Cine nu le atinge n-are de ce să rămână cu
   cerul acoperit: cel mai bătrân se ridică și pleacă, ca un balon scăpat din
   mână, și abia sus se face nor. */
const BALOANE_IN_AER = 12;

let randulCulorii = 0;

/* O culoare sorbită nu se pierde și nu se stinge: iese pe creștetul elefantului
   ca un balon și pleacă undeva anume. Una urcă în cer și se face nor, următoarea
   coboară și se face plantă — pe rând, ca peisajul să crească deopotrivă sus și
   jos. La capătul curățeniei, lumea are mai mult decât avea la început. */
function elibereazaCuloare(culoare, x, y, soarta) {
  const merge = soarta || (randulCulorii++ % 2 === 0 ? 'nor' : 'planta');
  const b = {
    x, y, culoare, soarta: merge,
    /* Cel care urcă spre cer așteaptă un deget, deci trebuie să fie destul de
       mare cât să-l nimerești — mai ales pe telefon. Cel care coboară spre
       pământ nu așteaptă pe nimeni și rămâne mărunt. */
    raza: Math.min(W, H) * (merge === 'nor' ? 0.034 + Math.random() * 0.026
                                            : 0.012 + Math.random() * 0.02),
    faza: Math.random() * Math.PI * 2,
    nascut: performance.now(),
    viata: 1
  };
  if (merge === 'nor') {
    b.tintaX = intre(W * 0.05, W * 0.95, Math.random());
    b.tintaY = orizont() * (0.14 + Math.random() * 0.44);
    b.pluteste = true;                 // sus nu se sparge: așteaptă degetul
    b.deriva = (Math.random() < 0.5 ? -1 : 1) * (0.10 + Math.random() * 0.18);
    b.scapat = false;                  // devine adevărat dacă cerul s-a aglomerat
  } else {
    b.tintaX = intre(W * 0.06, W * 0.94, Math.random());
    b.adancime = 0.1 + Math.random() * 0.85;
    b.tintaY = intre(nivelulSolului(), H, b.adancime);
  }
  baloaneCuloare.push(b);
}

/* Balonul atins se desface în nor, iar norul rămâne vopsit cu culoarea lui.
   Asta se cheamă și când un balon scăpat iese din ecran pe sus. */
function faNor(b) {
  nori.push({
    x: b.x,
    y: Math.max(orizont() * 0.06, b.y),
    latime: Math.min(W, H) * (0.09 + Math.random() * 0.11),
    viteza: 0.05 + Math.random() * 0.09,
    culoare: b.culoare,
    tenta: 0.26 + Math.random() * 0.22
  });
}

function actualizeazaBaloaneleDeCuloare() {
  const prag = Math.min(W, H) * 0.03;
  const acum = performance.now();

  /* Dacă s-au adunat prea multe, cel mai bătrân dintre cele care încă așteaptă
     scapă din mână: își schimbă ținta spre marginea de sus a cerului și pleacă. */
  let inAer = 0;
  for (const b of baloaneCuloare) if (b.pluteste && !b.scapat) inAer++;
  if (inAer > BALOANE_IN_AER) {
    let celMaiBatran = null;
    for (const b of baloaneCuloare) {
      if (!b.pluteste || b.scapat) continue;
      if (!celMaiBatran || b.nascut < celMaiBatran.nascut) celMaiBatran = b;
    }
    if (celMaiBatran) {
      celMaiBatran.scapat = true;
      celMaiBatran.tintaY = -celMaiBatran.raza * 4;
    }
  }

  for (let i = baloaneCuloare.length - 1; i >= 0; i--) {
    const b = baloaneCuloare[i];
    b.faza += 0.05;

    /* Cel ajuns la locul lui nu mai are unde să meargă: se leagănă pe loc și
       se plimbă alene într-o parte, ca un balon ținut de un fir nevăzut. */
    if (b.pluteste && !b.scapat && Math.hypot(b.tintaX - b.x, b.tintaY - b.y) < prag) {
      b.x += Math.sin(b.faza * 0.34) * b.deriva;
      b.y += Math.sin(b.faza * 0.51 + 1.1) * 0.35;
      if (b.x < b.raza) b.deriva = Math.abs(b.deriva);
      if (b.x > W - b.raza) b.deriva = -Math.abs(b.deriva);
      continue;
    }

    b.x += (b.tintaX - b.x) * 0.02 + Math.sin(b.faza) * 0.7;   // se leagănă ca fumul
    b.y += (b.tintaY - b.y) * 0.025;

    // balonul scăpat pleacă de tot și abia sus, afară din ecran, se face nor
    if (b.scapat) {
      if (b.y < -b.raza * 2) { faNor(b); baloaneCuloare.splice(i, 1); }
      continue;
    }
    // cel care merge în pământ se face plantă de la sine, ca până acum
    if (!b.pluteste &&
        (Math.hypot(b.tintaX - b.x, b.tintaY - b.y) < prag || acum - b.nascut > 20000)) {
      semeneazaTufa(b.tintaX / W, b.adancime, b.culoare);
      baloaneCuloare.splice(i, 1);
    }
  }
}

/* Balonul de sub deget, dacă e vreunul. Căutăm din cele mai noi spre cele mai
   vechi, ca degetul să-l ia pe cel de deasupra când două se suprapun. */
function balonulDeSub(x, y) {
  for (let i = baloaneCuloare.length - 1; i >= 0; i--) {
    const b = baloaneCuloare[i];
    if (!b.pluteste || b.scapat) continue;
    if (Math.hypot(b.x - x, b.y - y) < b.raza * 1.9) return b;
  }
  return null;
}

// Atins, balonul se sparge moale și din el iese norul.
function spargeBalonul(b) {
  const i = baloaneCuloare.indexOf(b);
  if (i === -1) return false;
  faNor(b);
  baloaneCuloare.splice(i, 1);
  if (audio) sunetBalonSpart();
  return true;
}

/* ---------- GRĂDINA ----------
   Ce coboară din cer se înfige în pământ și crește. Plantele nu se șterg
   niciodată: în scena a treia, muzeul stă în mijlocul grădinii pe care ai
   făcut-o fără să vrei, jucându-te cu mingea.

   Fiecare plantă își ține locul în fracțiuni — `fx` din lățime, `adancime` din
   fâșia de pământ — ca să stea unde trebuie și după o redimensionare, și în
   scena a treia, unde pământul începe de la altă înălțime. */
const gradina = [];
const SOIURI = ['copac', 'floare', 'feriga'];
const MAX_PLANTE = 120;

// De unde începe pământul în scena în care ne aflăm acum.
function nivelulSolului() {
  return stare === 'muzeu' ? geomMuzeu().vpy : orizont();
}

function semeneazaPlanta(fx, adancime, culoare) {
  if (gradina.length >= MAX_PLANTE) return null;
  const p = {
    fx, adancime, culoare,
    soi: SOIURI[Math.floor(Math.random() * SOIURI.length)],
    crestere: 0,
    inaltime: 0.11 + Math.random() * 0.11,   // fracțiune din înălțimea ecranului
    faza: Math.random() * Math.PI * 2
  };
  gradina.push(p);
  // ținem grădina sortată după adâncime chiar de la semănat: la desen n-o mai
  // sortăm de două ori pe cadru, degeaba
  gradina.sort((a, b) => a.adancime - b.adancime);
  return p;
}

/* O culoare căzută nu face un fir singuratic, ci o tufă: câteva plante strânse
   una lângă alta, de soiuri și mărimi diferite. Din cinci-șase culori sorbite
   iese astfel un desiș, nu o pajiște rară. */
function semeneazaTufa(fx, adancime, culoare) {
  const cate = 3 + Math.floor(Math.random() * 3);
  const prima = semeneazaPlanta(fx, adancime, culoare);
  for (let i = 1; i < cate; i++) {
    const p = semeneazaPlanta(
      Math.min(0.985, Math.max(0.015, fx + (Math.random() * 2 - 1) * 0.075)),
      Math.min(1, Math.max(0, adancime + (Math.random() * 2 - 1) * 0.12)),
      culoare
    );
    if (p) p.inaltime *= 0.6 + Math.random() * 0.5;
  }
  return prima;
}

function actualizeazaGradina() {
  for (const p of gradina) if (p.crestere < 1) p.crestere = Math.min(1, p.crestere + 0.008);
}

/* Fiecare plantă e făcută din vreo douăzeci de linii și pete. Înmulțit cu
   cincizeci de plante și cu șaizeci de cadre pe secundă, iese o socoteală pe
   care pânza n-o duce — de aici se poticnea jocul. Așa că fiecare soi și
   culoare se desenează O SINGURĂ DATĂ pe o ștampilă ascunsă, iar la fiecare
   cadru ștampila se apasă, înclinată puțin ca planta să se legene. */
const stampilePlante = new Map();
const INALT_STAMPILA = 240;        // toate ștampilele se desenează la mărimea asta

function stampilaPlantei(soi, culoare) {
  const cheie = soi + '|' + culoare;
  let st = stampilePlante.get(cheie);
  if (st) return st;
  const h = INALT_STAMPILA;
  const p = document.createElement('canvas');
  p.width = Math.ceil(h * 1.7);
  p.height = Math.ceil(h * 1.35);
  const c = p.getContext('2d');
  const radacinaX = p.width / 2, radacinaY = p.height - 3;
  c.save();
  c.translate(radacinaX, radacinaY);
  const fals = { culoare, faza: 0 };
  if (soi === 'copac') deseneazaCopac(c, h, 0, fals);
  else if (soi === 'floare') deseneazaFloare(c, h, 0, fals);
  else deseneazaFeriga(c, h, 0, fals);
  c.restore();
  st = { panza: p, radacinaX, radacinaY, inalt: h };
  stampilePlante.set(cheie, st);
  return st;
}

/* Grădina se desenează în două reprize: întâi ce e departe, în spatele
   custodelui, apoi ce e aproape, în fața lui. Așa se vede că el chiar stă
   înăuntrul grădinii, nu în fața unui afiș. */
function deseneazaGradina(alfa = 1, minAdancime = 0, maxAdancime = 1.01) {
  const sol = nivelulSolului();
  const acum = performance.now();
  const g = stare === 'muzeu' ? geomMuzeu() : null;
  for (const p of gradina) {                 // deja sortată după adâncime
    if (p.adancime < minAdancime || p.adancime >= maxAdancime) continue;
    if (p.crestere <= 0.001) continue;
    /* În fața custodelui rămâne o cărare: buruiana care l-ar acoperi nu se
       desenează. O grădină lăsată de capul ei ar înghiți exact haina pe care
       trebuie s-o vezi desfăcându-se. */
    if (g && p.adancime >= 0.82 && Math.abs(p.fx * W - g.cx) < g.fw * 0.45) continue;

    const departare = 0.4 + 0.6 * p.adancime;   // ce e mai jos e mai aproape, deci mai mare
    const h = H * p.inaltime * departare * p.crestere;
    const x = p.fx * W, y = intre(sol, H, p.adancime);
    if (x < -h || x > W + h) continue;          // ce a rămas afară din ecran
    const st = stampilaPlantei(p.soi, p.culoare);
    const scara = h / st.inalt;

    ctx.save();
    // umbra la rădăcină: pe pământul negru nu se vede, dar pe iarbă desprinde
    // planta de fundal, care altfel e tot verde
    ctx.globalAlpha = alfa * 0.22;
    ctx.fillStyle = '#12240e';
    ctx.beginPath(); ctx.ellipse(x, y, h * 0.3, h * 0.07, 0, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = alfa;
    ctx.translate(x, y);
    ctx.rotate(Math.sin(acum * 0.0016 + p.faza) * 0.05);
    ctx.scale(scara, scara);
    ctx.drawImage(st.panza, -st.radacinaX, -st.radacinaY);
    ctx.restore();
  }
}

function deseneazaCopac(c, h, legan, p) {
  c.strokeStyle = '#4a5c3a'; c.lineWidth = Math.max(2.4, h * 0.085); c.lineCap = 'round';
  c.beginPath();
  c.moveTo(0, 0);
  c.quadraticCurveTo(legan * 0.4, -h * 0.42, legan, -h * 0.6);
  c.stroke();
  c.lineWidth = Math.max(1.6, h * 0.05);                   // două crengi
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.moveTo(legan * 0.7, -h * 0.5);
    c.quadraticCurveTo(legan + lat * h * 0.16, -h * 0.6, legan + lat * h * 0.26, -h * 0.72);
    c.stroke();
  }
  /* Coroana: patru bulgări de verde suprapuși, ca frunzișul să nu fie o bilă.
     Culoarea sorbită nu vopsește tot copacul — ar ieși un pom de plastic —
     ci se așază pe el ca o floare, în câteva locuri. */
  c.fillStyle = VERDE_LIANA;
  c.beginPath(); c.ellipse(legan, -h * 0.78, h * 0.42, h * 0.30, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(legan - h * 0.22, -h * 0.86, h * 0.27, h * 0.21, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#7a9b5e';
  c.beginPath(); c.ellipse(legan + h * 0.22, -h * 0.72, h * 0.24, h * 0.19, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(legan + h * 0.04, -h * 0.96, h * 0.21, h * 0.16, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = p.culoare;
  for (let k = 0; k < 6; k++) {
    const a = p.faza + k * 2.2;
    c.beginPath();
    c.arc(legan + Math.cos(a) * h * 0.30, -h * 0.82 + Math.sin(a) * h * 0.19, h * 0.055, 0, Math.PI * 2);
    c.fill();
  }
}

function deseneazaFloare(c, h, legan, p) {
  c.strokeStyle = VERDE_LIANA; c.lineWidth = Math.max(1.5, h * 0.045); c.lineCap = 'round';
  c.beginPath();
  c.moveTo(0, 0);
  c.quadraticCurveTo(legan * 0.6, -h * 0.55, legan, -h * 0.85);
  c.stroke();
  c.fillStyle = VERDE_LIANA;
  for (const lat of [-1, 1]) {          // două frunze pe tulpină
    c.beginPath();
    c.ellipse(lat * h * 0.12 + legan * 0.4, -h * 0.45, h * 0.13, h * 0.055, lat * 0.7, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = p.culoare;
  for (let k = 0; k < 5; k++) {         // corola
    const a = k / 5 * Math.PI * 2 + p.faza;
    c.beginPath();
    c.ellipse(legan + Math.cos(a) * h * 0.10, -h * 0.85 + Math.sin(a) * h * 0.10,
              h * 0.085, h * 0.05, a, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = ALAMA;
  c.beginPath(); c.arc(legan, -h * 0.85, h * 0.05, 0, Math.PI * 2); c.fill();
}

function deseneazaFeriga(c, h, legan, p) {
  c.lineCap = 'round';
  for (let k = -4; k <= 4; k++) {
    const inc = k * 0.19;
    c.strokeStyle = k % 3 === 0 ? p.culoare : (k % 2 === 0 ? VERDE_LIANA : '#7a9b5e');
    c.lineWidth = Math.max(1.6, h * 0.05) * (1 - Math.abs(k) * 0.08);
    const vx = Math.sin(inc) * h * 0.62 + legan;
    const vy = -h * (0.78 - Math.abs(k) * 0.075);
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(Math.sin(inc) * h * 0.28 + legan * 0.5, -h * 0.52, vx, vy);
    c.stroke();
    if (Math.abs(k) <= 2) {             // frunzulițele, doar la cele din față
      c.lineWidth = Math.max(1, h * 0.022);
      for (let j = 1; j <= 3; j++) {
        const t = j / 4;
        const mx = intre(0, vx, t) + Math.sin(inc) * h * 0.06;
        const my = intre(0, vy, t) - h * 0.05 * t;
        c.beginPath();
        c.moveTo(mx, my);
        c.lineTo(mx + Math.cos(inc + 1.2) * h * 0.11, my - h * 0.06);
        c.stroke();
      }
    }
  }
}

function deseneazaBaloaneleDeCuloare() {
  const t = performance.now();
  for (const b of baloaneCuloare) {
    const a = Math.max(0, b.viata);
    ctx.save();

    /* Cel care așteaptă un deget respiră: se umflă și se dezumflă abia simțit.
       Un balon care stă perfect nemișcat pare pictat pe cer, iar pe ce pare
       pictat nimeni nu apasă. */
    const asteapta = b.pluteste && !b.scapat;
    const suflu = asteapta ? 1 + Math.sin(t * 0.0024 + b.faza) * 0.06 : 1;
    const r = b.raza * suflu;

    if (asteapta) {
      // ațișoara, ca la balonul din deschidere
      ctx.globalAlpha = a * 0.4;
      ctx.strokeStyle = b.culoare;
      ctx.lineWidth = Math.max(1, r * 0.09);
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + r);
      ctx.quadraticCurveTo(b.x + Math.sin(b.faza * 0.4) * r * 0.7, b.y + r * 2.1,
                           b.x + Math.sin(b.faza * 0.4) * r * 0.3, b.y + r * 3.2);
      ctx.stroke();
    }

    ctx.globalAlpha = a * 0.55;
    ctx.fillStyle = b.culoare;
    ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = a * 0.4;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(b.x - r * 0.3, b.y - r * 0.34, r * 0.26, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

// Petele de vopsea lăsate de săriturile mingii
const pete = [];
const CULORI_PETE = ['#f57c00', '#43a047', '#8e24aa', '#e53935', '#fdd835', '#1e88e5'];
const PETE_PENTRU_ELEFANT = 15;   // la câte pete vine elefantul să facă curat (puține → curățenie scurtă)

// „unitatea de măsură" a elefantului: totul e desenat în multipli de u,
// ca să-l putem mări/micșora doar schimbând scara
function unitateElefant(scara) { return Math.min(W, H) * 0.0027 * scara; }

// unde sunt picioarele elefantului: pe orizont când e departe, mai jos când e aproape
function picioareElefant() {
  const p = Math.max(0, Math.min(1, (elefant.scara - 0.62) / 0.48));
  return intre(orizont() + 6, H * 0.86, p);
}

// Geometria trompei: pornește de sub cap și se întinde spre o „țintă".
// În timpul aspirării, ținta este chiar pata de culoare la rând — așa trompa
// se mișcă după fiecare pată, ca un furtun viu.
function geometriaTrompei(t) {
  const u = unitateElefant(elefant.scara);
  const sx = elefant._sx || 1, sy = elefant._sy || 1, offY = elefant._offY || 0;
  // trompa pornește din bot; adăugăm deplasarea corpului ca să rămână lipită de cap
  const bazaX = elefant.x + elefant.directie * 112 * u * sx;
  const bazaY = picioareElefant() + offY - 56 * u * sy;

  let tintaX, tintaY, lungime = 94 * u;
  // în timpul aspirării: urmărește pata în zbor, altfel anticipează cea mai apropiată
  let pataActiva = null;
  if (elefant.stare === 'aspira') {
    let best = Infinity;
    for (const p of pete) {
      if (p.aspirata && p.progres >= 1) continue;
      const d = Math.hypot(p.x - bazaX, p.y - bazaY);
      const scor = p.aspirata ? d - 1e6 : d;   // pata în zbor are prioritate absolută
      if (scor < best) { best = scor; pataActiva = p; }
    }
  }
  if (elefant.stare === 'prinde' && elefant.trompaTinta) {
    // la prindere, trompa se întinde spre minge și o duce în buzunar
    tintaX = elefant.trompaTinta.x; tintaY = elefant.trompaTinta.y;
    lungime = Math.min(Math.hypot(tintaX - bazaX, tintaY - bazaY), 160 * u);
  } else if (pataActiva) {
    tintaX = pataActiva.x;
    tintaY = pataActiva.y;
    // trompa se întinde cartoon-ish spre pată, dar nu la nesfârșit
    const d = Math.hypot(tintaX - bazaX, tintaY - bazaY);
    lungime = Math.min(d * 0.9, 150 * u);
  } else {
    // în repaus atârnă lung în jos, curbându-se înainte ca un cârlig
    const leagan = Math.sin(t * 0.0025) * 10 * u;
    tintaX = bazaX + elefant.directie * (40 * u + leagan);
    tintaY = bazaY + 82 * u;   // spre pământ
  }
  const dx = tintaX - bazaX, dy = tintaY - bazaY;
  const d = Math.hypot(dx, dy) || 1;
  return {
    u, bazaX, bazaY,
    varfX: bazaX + (dx / d) * lungime,
    varfY: bazaY + (dy / d) * lungime
  };
}

// Netezim vârful trompei: în loc să sară brusc de la o pată la alta, alunecă
// lin spre țintă — mișcarea la aspirare devine firească, ca un furtun viu.
function actualizeazaTrompa() {
  const g = geometriaTrompei(performance.now());
  if (!elefant.varfNet) { elefant.varfNet = { x: g.varfX, y: g.varfY }; return; }
  const k = elefant.stare === 'aspira' ? 0.16 : (elefant.stare === 'prinde' ? 0.3 : 0.45);
  elefant.varfNet.x += (g.varfX - elefant.varfNet.x) * k;
  elefant.varfNet.y += (g.varfY - elefant.varfNet.y) * k;
}

// vârful trompei (netezit) — acolo „zboară" petele când sunt aspirate
function varfulTrompei() {
  if (elefant.varfNet) return { x: elefant.varfNet.x, y: elefant.varfNet.y };
  const g = geometriaTrompei(performance.now());
  return { x: g.varfX, y: g.varfY };
}

// buzunarul de pe burta elefantului — acolo intră mingea
function buzunarElefant() {
  const u = unitateElefant(elefant.scara);
  return { x: elefant.x + elefant.directie * 33 * u, y: picioareElefant() - 57 * u };
}

function adaugaPata(x, y, marime) {
  if (pete.length >= 60) return;
  const culoare = CULORI_PETE[Math.floor(Math.random() * CULORI_PETE.length)];
  // fiecare pată e un „blob" neregulat: un miez + câțiva stropi în jur
  const stropi = [];
  const cati = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < cati; i++) {
    stropi.push({
      dx: (Math.random() * 2 - 1) * marime * 1.4,
      dy: (Math.random() * 2 - 1) * marime * 1.4,
      r: marime * (0.15 + Math.random() * 0.4)
    });
  }
  pete.push({ x, y, marime, culoare, stropi, aspirata: false, progres: 0 });
}

/* Săritura mingii se măsoară în raza ei, nu în pixeli.

   Constantele erau alese pe vremea când mingea era pe jumătate cât e acum. Cu
   mingea mărită, aceleași cifre însemnau un salt de 12% din raza ei în primul
   cadru — reacționa pe loc, dar arăta moale, ca și cum ar fi întârziat. Acum
   sare cam cât ea de înaltă, la fel pe orice ecran. */
function gravitatiaMingii() { return minge.raza * 0.016; }
function saltulMingii(cat) { return -minge.raza * cat; }

function actualizeazaMingea(acum) {
  minge.turtire *= 0.82;                 // îndesarea se destinde repede
  if (minge.turtire < 0.004) minge.turtire = 0;
  if (minge.inBuzunar) return;

  if (minge.mod === 'liber') {
    // gravitație și sărituri
    if (minge.y < minge.sol || minge.vy < 0) {
      minge.vy += gravitatiaMingii();
      minge.y += minge.vy;
      minge.rotatie += 0.06;
      // în zbor, mingea bucuroasă scutură stropi de vopsea pe traiectorie
      if (minge.sareDeBucurie && Math.random() < 0.05) {
        adaugaPata(minge.x + (Math.random() * 2 - 1) * 50,
                   minge.y + minge.raza * 0.6,
                   4 + Math.random() * 8);
      }
      if (minge.y >= minge.sol) {
        // aterizare
        minge.y = minge.sol;
        if (minge.sareDeBucurie) {
          // pleosc! — pete mari la aterizare
          const cate = 1 + Math.floor(Math.random() * 2);
          for (let i = 0; i < cate; i++) {
            adaugaPata(minge.x + (Math.random() * 2 - 1) * minge.raza * 2,
                       minge.y + minge.raza * (0.3 + Math.random() * 0.5),
                       10 + Math.random() * 22);
          }
          if (audio) sunetPleosc();
        }
        if (minge.sarituriRamase > 0) {
          minge.sarituriRamase--;
          minge.vy = saltulMingii(0.24 + Math.random() * 0.09);
          minge.turtire = 0.7;                 // se îndeasă când lovește pământul
          if (audio) sunetBoing();
        } else {
          minge.vy = 0;
          minge.sareDeBucurie = false;
        }
      }
    } else {
      // pe sol: o legănare ușoară, ca și cum abia își stăpânește energia
      minge.rotatie = Math.sin(acum * 0.002) * 0.12;
      if (minge.razaTinta) minge.raza = minge.razaTinta * (1 + 0.022 * Math.sin(acum * 0.003));
    }

    minge.luminozitate *= 0.985;

    /* Mingea nu mai țopăie singură. E o jucărie care așteaptă, nu una care se
       agită: dacă sare de la sine, atingerea ta nu mai înseamnă nimic. Din când
       în când doar fluieră, fără să se miște din loc. */
    const elefantLiber = elefant.stare === 'plimbare';
    if (elefantLiber && acum - minge.ultimaProvocare > 9000 && minge.vy === 0 && minge.y >= minge.sol) {
      minge.ultimaProvocare = acum;
      if (audio) (Math.random() < 0.5 ? sunetFluier : sunetChicotit)();
      minge.luminozitate = 0.6;
    }
  }
  else if (minge.mod === 'fuge') {
    // fuge speriată în spatele elefantului
    const b = buzunarElefant();
    minge.x += (b.x - minge.x) * 0.09;
    minge.y += (b.y - minge.y) * 0.09;
    minge.rotatie += 0.35;   // se rostogolește panicată
    if (Math.hypot(b.x - minge.x, b.y - minge.y) < 20) {
      minge.mod = 'ascunsa';
      minge.timpAscundere = acum;
    }
  }
  else if (minge.mod === 'ascunsa') {
    // stă pitită după elefant și trage cu ochiul
    const b = buzunarElefant();
    minge.x = b.x - elefant.directie * unitateElefant(elefant.scara) * 60;
    minge.y = b.y + Math.sin(acum * 0.004) * 4;
    if (acum - minge.timpAscundere > 3000) minge.mod = 'revine';
  }
  else if (minge.mod === 'revine') {
    /* Se întoarce timidă, cu sărituri mici. Înainte, întoarcerea se termina
       numai când două lucruri se nimereau în același cadru: să fie aproape de
       locul ei și să atingă pământul. Dar sărea din nou la fiecare aterizare, iar
       apropierea mergea cu pași din ce în ce mai mici — așa că putea să țopăie
       pe loc zeci de secunde. Acum aterizarea o oprește pe loc, iar dacă tot n-a
       ajuns, un răgaz o aduce înapoi oricum. */
    const tintaX = W * 0.42;
    minge.x += (tintaX - minge.x) * 0.06;
    const ajunsa = Math.abs(minge.x - tintaX) < 15 || acum - minge.timpAscundere > 7000;
    minge.rotatie += 0.04;
    if (minge.y < minge.sol || minge.vy < 0) {
      minge.vy += gravitatiaMingii();
      minge.y += minge.vy;
      if (minge.y >= minge.sol) {
        minge.y = minge.sol;
        minge.vy = 0;
        minge.turtire = 0.45;
        if (audio) sunetBoing();
      }
    } else if (!ajunsa) {
      minge.vy = saltulMingii(0.1);   // hop, hop, hop...
    } else {
      minge.mod = 'liber';
      minge.vy = 0;
      minge.raza = minge.razaTinta || minge.raza;
      minge.ultimaProvocare = acum;   // nu provoacă imediat, e încă timidă
    }
  }
}

/* Stanga jos e a scrisului: acolo sta definitia petei de culoare, iar un elefant
   care trece peste un text il face de necitit — si textul e tocmai lucrul pe care
   scena il are de spus.

   Marginea nu e o fractiune scrisa de mana, ci se socoteste din locul scrisului
   si din latimea elefantului. Asa, daca se muta vreodata textul, se muta si
   elefantul dupa el, fara sa mai caute nimeni cifra potrivita. */
const MARGINEA_ELEFANTULUI = { dreapta: 0.9 };

/* Cat de departe spre stanga ajunge silueta, socotit din mijlocul elefantului.
   Capul si trompa stau pe partea aia, deci nu e simetric: masurat pe desen, in
   unitatile lui, ca sa tina si cand se apropie si creste. */
function intindereaSpreStanga() { return unitateElefant(elefant.scara) * 118; }

/* Unde se opreste, ca sa nu intre cu capul in scris. Nu mai mult de 0.86 din
   latime: pe un ecran ingust ar fi impins pana afara din cadru. */
function margineaDinStanga() {
  const dreaptaScrisului = W * 0.235 + Math.min(W * 0.34, 420) / 2 + W * 0.012;
  return Math.min(W * 0.86, dreaptaScrisului + intindereaSpreStanga());
}

function actualizeazaElefantul(acum) {
  /* Pasul ține de cât se mișcă, nu de cât trece ceasul. Cu o cadență fixă,
     picioarele umblau de vreo trei ori pe secundă în timp ce trupul înainta cu
     o treime de pixel — și elefantul părea că aleargă isteric pe loc. Când stă,
     abia se leagănă: atât cât să respire, nu cât să bată pasul. */
  const merge = elefant.stare === 'plimbare' || elefant.stare === 'vine' ||
                elefant.stare === 'retrage';
  elefant.fazaMers += merge ? 0.022 : 0.004;
  actualizeazaTrompa();   // netezește vârful trompei (mișcare firească)

  // clipitul: din când în când, ochiul se închide o clipită
  if (acum > elefant.urmatorulClipit) {
    elefant.ultimulClipit = acum;
    elefant.urmatorulClipit = acum + 2500 + Math.random() * 2500;
  }

  if (elefant.stare === 'plimbare') {
    elefant.x += elefant.directie * 0.35;
    if (elefant.x < margineaDinStanga()) elefant.directie = 1;
    if (elefant.x > W * MARGINEA_ELEFANTULUI.dreapta) elefant.directie = -1;

    // au apărut destule culori? elefantul devine curios și se apropie
    if (pete.length >= PETE_PENTRU_ELEFANT && minge.mod === 'liber' && !minge.inBuzunar) {
      elefant.stare = 'vine';
      const parte = elefant.x >= minge.x ? 1 : -1;   // se apropie din partea în care e deja
      elefant.tintaX = minge.x + parte * Math.min(W, H) * 0.26;
      elefant.directie = -parte;                     // și se întoarce spre minge
      elefant.tintaScara = 1.1;
    }
  }
  else if (elefant.stare === 'vine') {
    /* Tinta se socoteste din nou in fiecare cadru, nu o data la plecare: pe drum
       elefantul se apropie si creste, si odata cu el creste si locul de care are
       nevoie ca sa nu intre cu capul in scris. Socotita o singura data, tinta
       ramane in urma marginii — elefantul impinge in ea la nesfarsit, nu ajunge
       niciodata, si mingea nu mai e ridicata: jocul se opreste acolo. */
    const tinta = Math.max(margineaDinStanga(), elefant.tintaX);
    elefant.x += (tinta - elefant.x) * 0.02;
    elefant.scara += (elefant.tintaScara - elefant.scara) * 0.02;
    if (Math.abs(elefant.x - tinta) < 5 && Math.abs(elefant.scara - elefant.tintaScara) < 0.02) {
      elefant.stare = 'priveste';
      elefant.inceputPrivit = acum;
      elefant.urmatorulClipit = acum + 300;   // clipește curios spre utilizator
    }
  }
  else if (elefant.stare === 'priveste') {
    // o pauză: elefantul se uită la utilizator, apoi trece la treabă
    if (acum - elefant.inceputPrivit > 1500) {
      elefant.stare = 'prinde';
      elefant.inceputPrindere = acum;
      elefant.prindeDe = { x: minge.x, y: minge.y };
      elefant.razaPrinsa = minge.raza;
    }
  }
  else if (elefant.stare === 'prinde') {
    // trompa se întinde spre minge, o apucă și o ridică în buzunarul vestei
    const p = Math.min((acum - elefant.inceputPrindere) / 1400, 1);
    const b = buzunarElefant();
    let tx, ty;
    if (p < 0.4) {
      tx = elefant.prindeDe.x; ty = elefant.prindeDe.y;   // se întinde spre minge
    } else {
      const q = atenuare((p - 0.4) / 0.6);                // o ridică spre buzunar
      tx = intre(elefant.prindeDe.x, b.x, q);
      ty = intre(elefant.prindeDe.y, b.y, q);
      minge.raza = intre(elefant.razaPrinsa, unitateElefant(elefant.scara) * 12, q);
    }
    elefant.trompaTinta = { x: tx, y: ty };
    // mingea stă în vârful trompei, ca și cum trompa ar ține-o
    const varf = varfulTrompei();
    minge.x = varf.x; minge.y = varf.y;
    if (p >= 1) {
      minge.inBuzunar = true;
      elefant.trompaTinta = null;
      elefant.stare = 'aspira';
      elefant.urmatoareaAspirare = acum + 400;
    }
  }
  else if (elefant.stare === 'aspira') {
    const varf = varfulTrompei();
    // ritm alert: trompa înșfacă mereu pata cea mai apropiată de vârful ei
    if (acum > elefant.urmatoareaAspirare) {
      let cea = null, best = Infinity;
      for (const p of pete) {
        if (p.aspirata) continue;
        const d = Math.hypot(p.x - varf.x, p.y - varf.y);
        if (d < best) { best = d; cea = p; }
      }
      if (cea) {
        cea.aspirata = true;
        cea.startX = cea.x; cea.startY = cea.y;   // punctul de plecare, curat
        cea.unghiSpirala = Math.random() * Math.PI * 2;
        if (audio) sunetAspirare();
        elefant.urmatoareaAspirare = acum + 120;   // ritm rapid, hipnotic
      }
    }
    // petele aspirate se rotesc în spirală și sunt sorbite accelerat în nară
    const uu = unitateElefant(elefant.scara);
    for (let i = pete.length - 1; i >= 0; i--) {
      const pata = pete[i];
      if (!pata.aspirata) continue;
      pata.progres += 0.14;
      const f = pata.progres * pata.progres;                     // accelerează spre final
      const bx = intre(pata.startX, varf.x, f);
      const by = intre(pata.startY, varf.y, f);
      const raza = (1 - pata.progres) * 20 * uu;                 // spirala se strânge
      const a = pata.unghiSpirala + pata.progres * 9;            // se rotește spre nară
      pata.x = bx + Math.cos(a) * raza;
      pata.y = by + Math.sin(a) * raza;
      if (pata.progres >= 1) {
        // pata a ajuns în trompă; culoarea ei iese pe creștet și pleacă spre cer
        elibereazaCuloare(pata.culoare, elefant.x + elefant.directie * 8 * uu,
                          picioareElefant() - 150 * uu);
        pete.splice(i, 1);
      }
    }
    if (pete.length === 0) {
      // curățenia s-a terminat; se retrage mulțumit în depărtare, cu mingea în buzunar
      elefant.stare = 'retrage';
      elefant.tintaX = W * 0.68;
      elefant.tintaScara = 0.62;
      elefant.directie = elefant.x < W * 0.68 ? 1 : -1;
    }
  }
  else if (elefant.stare === 'retrage') {
    const tinta = Math.max(margineaDinStanga(), elefant.tintaX);
    elefant.x += (tinta - elefant.x) * 0.015;
    elefant.scara += (elefant.tintaScara - elefant.scara) * 0.015;
    if (Math.abs(elefant.x - tinta) < 8 && Math.abs(elefant.scara - elefant.tintaScara) < 0.02) {
      elefant.stare = 'plimbare';
      /* Cand se intoarce la plimbare, porneste tot spre stanga: din dreapta spre
         stanga, ca la intrare. La intamplare, jumatate din reluari il trimiteau
         inapoi spre marginea din dreapta, unde nu mai are unde merge. */
      elefant.directie = -1;
    }
  }

  /* Si, la urma de tot, o oprire ferma. Oricine l-ar chema spre stanga — mingea,
     o pata, drumul lui —, aici se opreste. E singurul loc din care nu poate scapa
     nicio stare noua, adaugata mai tarziu si uitand de scris. */
  elefant.x = Math.max(margineaDinStanga(), elefant.x);
}
