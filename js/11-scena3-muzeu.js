/* =====================================================================
   SCENA 3 — MUZEUL SECRET (atmosferă dadaistă, umor absurd)
   Elefantul devine muzeu și îți dă un plic → scrisoare → sonerie, apoi
   urmează comedia butonului „NU MĂ APĂSA", cu inactivitate escaladată,
   până se deschide ușa muzeului (care ascunde galeriile Scenelor 4–12).
   ===================================================================== */

// ---- sunete de scenă ----
function sunetSonerie() { if (!audio) return; const t = audio.currentTime; nota(660, t, 0.25, 0.08, 'sine'); nota(520, t + 0.28, 0.4, 0.08, 'sine'); }
function sunetEroare()  { if (!audio) return; nota(150, audio.currentTime, 0.2, 0.13, 'square', 80); }
function sunetTicTac()  { if (!audio) return; nota(1400, audio.currentTime, 0.03, 0.05, 'square'); }
function sunetHartie()  { if (!audio) return; zgomot(audio.currentTime, 0.16, 0.09, 2800, 1400); }
function sunetClunc()   { if (!audio) return; nota(120, audio.currentTime, 0.16, 0.11, 'triangle', 55); }
function sunetUsa()     { if (!audio) return; nota(90, audio.currentTime, 1.2, 0.1, 'sawtooth', 150); }
function sunetAburi()   { if (!audio) return; zgomot(audio.currentTime, 1.4, 0.13, 1800, 350); }
function sunetOftat()   { if (!audio) return; zgomot(audio.currentTime, 0.9, 0.06, 900, 260); }

// ---- starea Scenei 3 ----
/* Paleta muzeului-atelier. Un muzeu de artă de la 1900 nu e albastru și gri:
   are fier forjat verde-liană, alamă lustruită și geamuri colorate. Aceleași
   culori țin laolaltă ușa, ferestrele, bilețelele și grădina — de-aia stau
   într-un singur loc, nu împrăștiate prin desene. */
const VERDE_LIANA = '#5f7d4f';
const VERDE_CATIFEA = '#3a5a40';        // catifeaua hainei de custode
const VERDE_UMBRA = '#2a4430';
const ROZ_OBRAZ = 'rgba(240, 128, 138, 0.55)';
const ROZ_URECHE = '#8fb4de';
const ALAMA = '#c9a227';
const CREM_HARTIE = '#f4efe2';
const PIELE_VECHE = '#5a3a24';          // legătura tomului de instrucțiuni
const CULORI_BUZUNAR = ['#6b2f4a', '#2f5a6b', '#6b532f', '#3d2f6b',
                        '#2f6b45', '#6b3a2f', '#4a2f6b', '#2f4a6b', '#6b2f38'];
const CULORI_VITRALIU = ['#7fb2a6', '#e0a33e', '#b5495b', '#4a7ba7'];

const s3 = {
  faza: 'intro', t0: 0, ultimaActiune: 0,
  plicX: 0, plicY: 0,
  butonX: 0, butonY: 0, butonR: 0, butonBaza: { x: 0, y: 0 }, butonFuge: false,
  manualPagina: 1, articol: 0,
  presari: 0, refuzArmat: false,
  bilet: null,                 // biletul curent {text,x,y,rest,unghi,w,h,viata}
  laturaBilet: -1,             // în ce margine cade următorul bilet
  aSunatChemarea: false,       // clopoțelul buzunarului sună o singură dată
  vizitat: false,              // ai fost măcar o dată în galerie
  urmatoareaPasare: 0,         // când cântă următoarea pasăre
  cantecePasari: 0,
  incercari: 0,                // de câte ori ai atins pe lângă cercel
  cercelInPalma: false,        // custodele l-a scos din ureche și ți-l întinde
  diploma: null,               // diploma mare, întinsă de trompă
  stralucire: 0,               // cât e de aprins rubinul din cercel
  chemare: 0,                  // cât de tare cheamă buzunarele la atins
  manualDeschidere: 0,         // cât e deschis tomul spre privitor
  nivelInactiv: 0, ultimTic: 0,
  usa: 0
};
/* Manualul nu e doar o glumă birocratică. Sub forma lui de regulament stufos,
   el chiar spune cum se vizitează atelierul: că se atinge, că nu se corectează,
   că greșeala e material de lucru. Cine îl răsfoiește iese știind ce are de
   făcut în galerii — iar gluma e că exact asta scrie într-un act oficial. */
const ARTICOLE_MANUAL = [
  ['Art. 1',   'Vizitatorul are dreptul să atingă tot ce vede. Ceea ce nu suportă atingerea nu este artă, este mobilier.'],
  ['Art. 12',  'În atelier nu se corectează. Se continuă.'],
  ['Art. 23',  'Orice pată făcută din greșeală devine, prin prezenta, intenție.'],
  ['Art. 47',  'Este strict interzis să vă cereți scuze pentru ce ați desenat.'],
  ['Art. 88',  'Culoarea nu se cere de la administrație. Se ia.'],
  ['Art. 104', 'Cine se plictisește are dreptul să strice ceva frumos și să facă altceva din el.'],
  ['Art. 156', 'Tăcerea din fața pânzei albe nu se socotește pierdere de timp. Se socotește lucrare în curs.'],
  ['Art. 201', 'Fiecare galerie este un atelier. Nu se vizitează cu mâinile la spate.'],
  ['Art. 260', 'Nimeni nu pleacă fără să lase o urmă. Urma poate fi oricât de mică.'],
  ['Art. 318', 'Semnează că ai luat la cunoștință, trăgând custodele de cercel. Toate drepturile de autor sunt rezervate vizitatorului creator.']
];

function faza3(nume) { s3.faza = nume; s3.t0 = performance.now(); }
function actiune3(acum) { s3.ultimaActiune = acum; s3.nivelInactiv = 0; }

// ---- text & bilete ----
function textIncadrat(text, x, y, latMax, hLinie, font, culoare, aliniere = 'center') {
  ctx.font = font; ctx.fillStyle = culoare; ctx.textAlign = aliniere; ctx.textBaseline = 'top';
  const cuv = text.split(' '); let linie = '', yy = y;
  for (const c of cuv) {
    const test = linie ? linie + ' ' + c : c;
    if (ctx.measureText(test).width > latMax && linie) { ctx.fillText(linie, x, yy); linie = c; yy += hLinie; }
    else linie = test;
  }
  if (linie) ctx.fillText(linie, x, yy);
  return yy + hLinie;
}
const DURATA_BILET = 5200;    // cât stă un bilet pe ecran
const STINGERE_BILET = 700;   // și cât durează până se topește de tot

function aratBilet(text, w = 250, h = 120) {
  w = Math.min(ecran(w), W * 0.42); h = ecran(h);
  s3.laturaBilet = -s3.laturaBilet;
  s3.bilet = {
    text, w, h, latura: s3.laturaBilet,
    x: W * 0.5 + (Math.random() * 2 - 1) * W * 0.1,
    y: -h,
    rest: H * 0.30 + Math.random() * H * 0.12,
    unghi: (Math.random() * 2 - 1) * 0.08,
    nascut: performance.now(),
    viata: 1
  };
  s3.bilet.xRost = s3.bilet.x;
  if (audio) sunetHartie();
}

/* Unde se așază biletul: sus, într-o margine, niciodată peste custode. Pe
   chipul lui n-are ce căuta o hârtie — acolo te uiți. Bilețelele se duc pe rând
   în stânga și în dreapta, ca două care vin unul după altul să nu se acopere. */
function loculBiletului(b) {
  const lat = b.latura || -1;
  return {
    x: lat < 0 ? b.w / 2 + 16 : W - b.w / 2 - 16,
    y: b.h / 2 + 18
  };
}

/* Conturul unei fișe art nouveau: creștetul se ridică într-un arc de biciuiră,
   poalele se rotunjesc scurt. Numai curbe — o etichetă dreptunghiulară ar sta
   ca un post-it lipit peste o clădire de la 1900. */
function traseuFisa(w, h) {
  const a = Math.min(w, h) * 0.20, r = Math.min(w, h) * 0.10;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2 + a);
  ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + a, -h / 2 - a * 0.35);
  ctx.quadraticCurveTo(0, -h / 2 - a * 0.8, w / 2 - a, -h / 2 - a * 0.35);
  ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + a);
  ctx.lineTo(w / 2, h / 2 - r);
  ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  ctx.lineTo(-w / 2 + r, h / 2);
  ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  ctx.closePath();
}

// Liane de fier forjat pe margini și o floare de alamă în creștet.
function ornamentFisa(w, h) {
  ctx.strokeStyle = VERDE_LIANA; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  for (const lat of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(lat * (w / 2 - 11), h / 2 - 13);
    ctx.quadraticCurveTo(lat * (w / 2 - 4), 0, lat * (w / 2 - 15), -h / 2 + 15);
    ctx.quadraticCurveTo(lat * (w / 2 - 28), -h / 2 + 3, lat * (w / 2 - 36), -h / 2 + 12);
    ctx.stroke();
  }
  ctx.fillStyle = ALAMA;
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + k / 5 * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 5, -h / 2 - 3 + Math.sin(a) * 5, 4.4, 2.8, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = VERDE_LIANA;
  ctx.beginPath(); ctx.arc(0, -h / 2 - 3, 2.6, 0, Math.PI * 2); ctx.fill();
}

function deseneazaBilet() {
  const b = s3.bilet; if (!b) return;
  const varsta = performance.now() - b.nascut;
  if (varsta > DURATA_BILET + STINGERE_BILET) { s3.bilet = null; return; }
  b.viata = varsta > DURATA_BILET ? 1 - (varsta - DURATA_BILET) / STINGERE_BILET : 1;

  const loc = loculBiletului(b);
  if (b.y < loc.y - 4) b.y += Math.min(4.5, (loc.y - b.y) * 0.22 + 1.4);   // cade ca hârtia
  else b.y += (loc.y - b.y) * 0.12;
  b.x += (loc.x - b.x) * 0.12;

  ctx.save();
  ctx.globalAlpha = Math.max(0, b.viata);
  ctx.translate(b.x, b.y); ctx.rotate(b.unghi);
  ctx.shadowColor = 'rgba(0,0,0,0.28)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = CREM_HARTIE;
  traseuFisa(b.w, b.h); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = VERDE_LIANA; ctx.lineWidth = 2;
  traseuFisa(b.w - 11, b.h - 11); ctx.stroke();
  ctx.strokeStyle = ALAMA; ctx.lineWidth = 1;
  traseuFisa(b.w - 19, b.h - 19); ctx.stroke();
  ornamentFisa(b.w, b.h);
  textIncadrat(b.text, 0, -b.h / 2 + ecran(22), b.w - ecran(48), ecran(21), scrisGeorgia(16), '#2b2b2b');
  ctx.restore();
}

// ---- geometria muzeului (elefant transformat în clădire) ----
/* Muzeul nu e o clădire: e chiar elefantul, așezat pe fund, cu fața la jucător,
   îmbrăcat în haina lui de custode. Haina e ușa, buzunarele ei sunt galeriile,
   iar soneria e cercelul din urechea dreaptă. Aici stau toate măsurile lui. */
function geomMuzeu() {
  /* Stă aproape, foarte aproape: cât să-i vezi genele. Un custode mic, undeva
     în mijlocul ecranului, nu te privește — se uită în gol. */
  const S = Math.min(W * 0.86, H * 1.06);        // cât de mare stă pe ecran
  const cx = W * 0.5;
  const talpa = Math.min(H * 0.99, H * 0.42 + S * 0.62);   // unde atinge pământul
  const corpW = S * 0.60, corpH = S * 0.44;
  const corpY = talpa - corpH * 0.52;            // centrul corpului
  const capR = S * 0.20;
  const capY = corpY - corpH * 0.46 - capR * 0.62;
  const urecheRX = capR * 0.66, urecheRY = capR * 0.92, urecheX = capR * 1.14;
  const lobUreche = capY + urecheRY * 0.78;      // de unde atârnă cercelul

  // haina de pe piept: de sub bărbie până aproape de labe
  /* E o **vestă**, nu un palton: se termină pe burtă, nu la labe. Croită până
     jos, capătul ei cădea acolo unde trupul se îngustează, iar tăietura la
     elipsă i-o reteza drept — de-aia arăta a placă verde lipită pe el. */
  const hainaW = corpW * 0.74, hainaH = talpa - corpH * 0.30 - (capY + capR * 1.02);
  const hainaX = cx - hainaW / 2, hainaY = capY + capR * 1.02;

  return {
    S, cx, talpa, corpW, corpH, corpY, capR, capY,
    urecheRX, urecheRY, urecheX, lobUreche,
    hainaW, hainaH, hainaX, hainaY,
    // linia de unde începe iarba, pentru grădină
    vpy: H * 0.52,
    // cât loc ocupă pe ecran — de asta se feresc bilețelele
    fx: cx, fw: corpW + 2 * urecheX,
    top: capY - capR * 1.6, bottom: talpa
  };
}

/* Ce se întâmplă dacă nu izbutești să apeși cercelul și te plictisești.

   Răspunsul jocului nu e să te certe, ci să te ajute. Cu fiecare atingere pe
   lângă, custodele se apleacă spre degetul tău ceva mai mult, iar locul în care
   socotim că l-ai nimerit se lărgește. După opt încercări își scoate cercelul
   din ureche și ți-l întinde cu trompa, mare cât să nu-l poți rata. E un
   custode amabil, nu un paznic. */
const PRAG_PALMA = 8;

function ajutorulCustodelui() {
  return Math.min(1, s3.incercari / PRAG_PALMA);
}

function peButon(x, y) {
  const larg = 1.5 + ajutorulCustodelui() * 1.6;
  return Math.hypot(x - s3.butonX, y - s3.butonY) < s3.butonR * larg;
}

/* O atingere care n-a nimerit cercelul. Nu e nepăsare — dimpotrivă, e semn că
   jucătorul chiar încearcă — așa că oprim ceasul care-l ia peste picior. */
function rateazaCercelul(acum) {
  actiune3(acum);
  s3.incercari++;
  if (audio && s3.incercari % 3 === 0) sunetAtingere();
}

function intrareScena3(acum) {
  /* Baloanele rămase pe cer pleacă odată cu tine și se fac nori pe drum. Nicio
     culoare sorbită de elefant nu se pierde — nici cele pe care n-ai apucat
     să le atingi. */
  for (const b of baloaneCuloare) if (b.pluteste) faNor(b);
  baloaneCuloare.length = 0;

  stare = 'muzeu'; faza3('intro'); actiune3(acum);
  s3.plicX = W * 0.5; s3.plicY = H * 0.5;
  const g = geomMuzeu();
  // soneria e cercelul din urechea lui dreaptă
  s3.butonBaza = { x: g.cx + g.urecheX + g.urecheRX * 0.15, y: g.lobUreche + g.capR * 0.3 };
  s3.butonX = s3.butonBaza.x; s3.butonY = s3.butonBaza.y;
  s3.butonR = g.capR * 0.17;
  s3.bilet = null; s3.presari = 0; s3.refuzArmat = false; s3.butonFuge = false;
  s3.manualPagina = 1; s3.articol = 0; s3.nivelInactiv = 0; s3.usa = 0;
  s3.diploma = null; s3.stralucire = 0; s3.chemare = 0; s3.manualDeschidere = 0;
  s3.laturaBilet = -1; s3.aSunatChemarea = false;
  s3.incercari = 0; s3.cercelInPalma = false;
  s3.vizitat = false;
  s3.urmatoareaPasare = acum + 2500; s3.cantecePasari = 0;
  if (audio) sunetClunc();
  /* Aici nu cântă nimic. Muzeul e înăuntru, în galerii; noi stăm afară, pe
     iarbă, în fața custodelui — și afară se aud păsările, nu Mozart. */
  opresteMuzicaMuzeu();
  /* Afară, pe iarbă: numai păsările. Muzica e a muzeului, iar muzeul e
     înăuntru, în galerii — aici stăm în grădină, în fața custodelui. */
  pornesteNatura(false);
}

/* Fundalul scenei a treia: cer cald și o pajiște verde. Aici a ajuns lumea
   după ce culorile aspirate s-au întors în ea — n-are rost să fie cenușie. */
/* ---------- PEISAJUL SCENEI A TREIA ----------
   Un desiș adevărat are sute de frunze, ceață între straturi și lumină care
   se pierde în depărtare. Prea mult ca să fie desenat de șaizeci de ori pe
   secundă. Îl pictăm o singură dată pe o pânză ascunsă, cu tot cu ceață, și
   pe urmă doar îl copiem. Se repictează numai când se schimbă fereastra. */
const fundal3 = { panza: null, latime: 0, inaltime: 0 };

/* Un pâlc de frunziș: nu o elipsă, ci un ghem de bulgări mici, ca marginea să
   fie zdrențuită și să semene cu frunzele, nu cu un balon. */
function palcFrunzis(c, x, y, rx, ry, culoare, cati) {
  c.fillStyle = culoare;
  for (let k = 0; k < cati; k++) {
    const a = (k * 2.39996);                       // unghiul de aur: împrăștiere uniformă
    const d = Math.sqrt((k + 0.5) / cati);
    c.beginPath();
    c.ellipse(x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d,
              rx * (0.34 - d * 0.14), ry * (0.42 - d * 0.18), a, 0, Math.PI * 2);
    c.fill();
  }
}

function copacDeZare(c, x, y, h, trunchi, frunza) {
  c.strokeStyle = trunchi; c.lineCap = 'round';
  c.lineWidth = Math.max(1.5, h * 0.055);
  c.beginPath();
  c.moveTo(x, y);
  c.quadraticCurveTo(x + h * 0.06, y - h * 0.5, x + h * 0.02, y - h * 0.78);
  c.stroke();
  palcFrunzis(c, x + h * 0.02, y - h * 0.86, h * 0.34, h * 0.26, frunza, 9);
}

function palmierDeZare(c, x, y, h, culoare) {
  c.strokeStyle = '#4a5c3a'; c.lineCap = 'round';
  c.lineWidth = Math.max(2, h * 0.045);
  c.beginPath();
  c.moveTo(x, y);
  c.quadraticCurveTo(x + h * 0.14, y - h * 0.55, x + h * 0.08, y - h);
  c.stroke();
  c.fillStyle = culoare;
  for (let f = 0; f < 7; f++) {
    const ang = -Math.PI / 2 + (f - 3) * 0.42;
    c.save();
    c.translate(x + h * 0.08, y - h);
    c.rotate(ang);
    c.beginPath();
    c.ellipse(h * 0.26, 0, h * 0.28, h * 0.045, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

/* Desișul, în straturi: cel din fund e mic, spălăcit și tare estompat; fiecare
   strat următor e mai mare, mai verde și mai limpede. Așa se naște adâncimea —
   ochiul citește ceața ca depărtare. */
function deseneazaZare(c) {
  c = c || ctx;
  const oriz = H * 0.52;
  const straturi = [
    { frunza: '#a8c48c', trunchi: '#8fa07e', y: oriz - H * 0.005, h: H * 0.070, pas: 0.048, cetos: 11 },
    { frunza: '#8db06d', trunchi: '#77875f', y: oriz + H * 0.014, h: H * 0.095, pas: 0.068, cetos: 7 },
    { frunza: '#6d9550', trunchi: '#5c6b45', y: oriz + H * 0.038, h: H * 0.125, pas: 0.092, cetos: 4 },
    { frunza: '#557d40', trunchi: '#48562f', y: oriz + H * 0.070, h: H * 0.160, pas: 0.124, cetos: 2 },
    { frunza: '#3f6633', trunchi: '#38431f', y: oriz + H * 0.108, h: H * 0.200, pas: 0.162, cetos: 0.7 }
  ];
  for (let k = 0; k < straturi.length; k++) {
    const st = straturi[k];
    c.filter = st.cetos > 0 ? `blur(${st.cetos}px)` : 'none';
    for (let i = 0; i * st.pas < 1.18; i++) {
      const q = (i * 7.3 + k * 2.1) % 1;                 // împrăștiere fără aleator
      const x = (i * st.pas - 0.09 + q * st.pas * 0.7) * W;
      const h = st.h * (0.72 + q * 0.6);
      if ((i + k) % 5 === 0) palmierDeZare(c, x, st.y, h * 1.15, st.frunza);
      else copacDeZare(c, x, st.y, h, st.trunchi, st.frunza);
    }
  }
  c.filter = 'none';
}

/* Uși de piatră rămase singure în iarbă, fără casă în jur. Nu duc nicăieri și
   nimeni nu le explică — sunt acolo ca lumea să nu pară cuminte. */
function usiSingureInIarba(c) {
  const oriz = H * 0.52;
  const locuri = [
    { x: W * 0.13, h: H * 0.115, cetos: 3.5 },
    { x: W * 0.83, h: H * 0.135, cetos: 2.5 },
    { x: W * 0.66, h: H * 0.085, cetos: 4.5 }
  ];
  for (const u of locuri) {
    c.filter = `blur(${u.cetos}px)`;
    const w = u.h * 0.52, y = oriz + H * 0.055;
    c.fillStyle = 'rgba(120, 126, 116, 0.85)';
    c.beginPath();
    c.moveTo(u.x - w / 2, y);
    c.lineTo(u.x - w / 2, y - u.h * 0.72);
    c.quadraticCurveTo(u.x, y - u.h * 1.12, u.x + w / 2, y - u.h * 0.72);
    c.lineTo(u.x + w / 2, y);
    c.closePath(); c.fill();
    c.fillStyle = 'rgba(38, 44, 40, 0.75)';         // golul dinăuntru, negru
    c.beginPath();
    c.moveTo(u.x - w * 0.32, y);
    c.lineTo(u.x - w * 0.32, y - u.h * 0.66);
    c.quadraticCurveTo(u.x, y - u.h * 0.98, u.x + w * 0.32, y - u.h * 0.66);
    c.lineTo(u.x + w * 0.32, y);
    c.closePath(); c.fill();
  }
  c.filter = 'none';
}

function pictezaFundal3(c) {
  const oriz = H * 0.52;

  // cerul: albastru adânc sus, cald și cețos spre orizont
  const cer = c.createLinearGradient(0, 0, 0, oriz);
  cer.addColorStop(0, '#5c9fd0');
  cer.addColorStop(0.55, '#9fc9e4');
  cer.addColorStop(1, '#f2e3c2');
  c.fillStyle = cer; c.fillRect(0, 0, W, oriz);

  // soarele de după-amiază, jos în stânga, cu halo larg
  const soare = c.createRadialGradient(W * 0.24, oriz * 0.46, 0, W * 0.24, oriz * 0.46, W * 0.42);
  soare.addColorStop(0, 'rgba(255, 246, 214, 0.85)');
  soare.addColorStop(0.35, 'rgba(255, 238, 196, 0.28)');
  soare.addColorStop(1, 'rgba(255, 238, 196, 0)');
  c.fillStyle = soare; c.fillRect(0, 0, W, oriz);

  // munții din fund, aproape topiți în ceață
  c.filter = 'blur(8px)';
  c.fillStyle = 'rgba(150, 176, 186, 0.75)';
  c.beginPath();
  c.moveTo(0, oriz);
  c.lineTo(0, oriz - H * 0.10);
  c.lineTo(W * 0.16, oriz - H * 0.19);
  c.lineTo(W * 0.32, oriz - H * 0.09);
  c.lineTo(W * 0.52, oriz - H * 0.22);
  c.lineTo(W * 0.71, oriz - H * 0.08);
  c.lineTo(W * 0.88, oriz - H * 0.17);
  c.lineTo(W, oriz - H * 0.07);
  c.lineTo(W, oriz);
  c.closePath(); c.fill();
  c.filter = 'none';

  // pajiștea
  const iarba = c.createLinearGradient(0, oriz, 0, H);
  iarba.addColorStop(0, '#7fa957');
  iarba.addColorStop(0.45, '#5d8c40');
  iarba.addColorStop(1, '#2f5227');
  c.fillStyle = iarba; c.fillRect(0, oriz, W, H - oriz);

  // dâmburi line, ca pajiștea să nu se termine cu o linie trasă cu rigla
  c.filter = 'blur(2px)';
  c.fillStyle = '#6f9c4a';
  c.beginPath();
  c.moveTo(0, oriz);
  c.quadraticCurveTo(W * 0.22, oriz - H * 0.045, W * 0.45, oriz + H * 0.005);
  c.quadraticCurveTo(W * 0.72, oriz - H * 0.04, W, oriz + H * 0.01);
  c.lineTo(W, oriz + H * 0.07); c.lineTo(0, oriz + H * 0.07);
  c.closePath(); c.fill();
  c.filter = 'none';

  usiSingureInIarba(c);
  deseneazaZare(c);

  // ceața care se strânge chiar pe linia orizontului
  const pacla = c.createLinearGradient(0, oriz - H * 0.14, 0, oriz + H * 0.16);
  pacla.addColorStop(0, 'rgba(246, 236, 210, 0)');
  pacla.addColorStop(0.42, 'rgba(246, 236, 210, 0.5)');
  pacla.addColorStop(1, 'rgba(246, 236, 210, 0)');
  c.fillStyle = pacla; c.fillRect(0, oriz - H * 0.14, W, H * 0.3);

  // fire de iarbă, tot mai lungi și mai dese spre privitor
  for (let k = 0; k < 260; k++) {
    const q = (k * 0.618) % 1;
    const y = oriz + (H - oriz) * (0.05 + q * q * 0.97);
    const x = ((k * 137.508) % 100) / 100 * W;
    const h = (y - oriz) * 0.07 + 3;
    const lum = 0.06 + ((y - oriz) / (H - oriz)) * 0.14;
    c.strokeStyle = `rgba(226, 244, 190, ${lum})`;
    c.lineWidth = Math.max(1, h * 0.09);
    c.beginPath();
    c.moveTo(x, y);
    c.quadraticCurveTo(x + h * 0.2, y - h * 0.6, x + h * 0.42, y - h);
    c.stroke();
  }

  // pete de lumină care cad printre frunze
  c.filter = 'blur(18px)';
  for (let k = 0; k < 6; k++) {
    const x = W * (0.08 + k * 0.17), y = oriz + (H - oriz) * (0.2 + (k % 3) * 0.26);
    c.fillStyle = 'rgba(255, 248, 205, 0.16)';
    c.beginPath(); c.ellipse(x, y, W * 0.11, H * 0.035, -0.3, 0, Math.PI * 2); c.fill();
  }
  c.filter = 'none';

  // vinieta: colțurile se închid, ochiul rămâne în mijloc
  const colt = c.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.32,
                                      W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
  colt.addColorStop(0, 'rgba(20, 28, 18, 0)');
  colt.addColorStop(1, 'rgba(20, 28, 18, 0.34)');
  c.fillStyle = colt; c.fillRect(0, 0, W, H);
}

function pregatesteFundal3() {
  if (fundal3.panza && fundal3.latime === W && fundal3.inaltime === H) return;
  const p = document.createElement('canvas');
  p.width = W; p.height = H;
  pictezaFundal3(p.getContext('2d'));
  fundal3.panza = p; fundal3.latime = W; fundal3.inaltime = H;
}

/* Norii pe care i-ai vopsit în scena a doua nu s-au dus nicăieri: plutesc și
   deasupra grădinii. Estomparea lor costă mult dacă e cerută la fiecare cadru,
   așa că fiecare culoare își are ștampila ei, înmuiată o singură dată. */
const stampileNori = new Map();

function stampilaNorului(culoare) {
  let st = stampileNori.get(culoare);
  if (st) return st;
  const p = document.createElement('canvas');
  p.width = 256; p.height = 128;
  const c = p.getContext('2d');
  if (c.filter !== undefined) c.filter = 'blur(13px)';
  c.fillStyle = culoare;
  for (const b of [[0.5, 0.66, 0.33, 0.2], [0.66, 0.46, 0.21, 0.16], [0.35, 0.52, 0.17, 0.13]]) {
    c.beginPath();
    c.ellipse(p.width * b[0], p.height * b[1], p.width * b[2], p.height * b[3], 0, 0, Math.PI * 2);
    c.fill();
  }
  st = { panza: p };
  stampileNori.set(culoare, st);
  return st;
}

function deseneazaNoriiPurtati() {
  const acum = performance.now();
  for (const nor of nori) {
    nor.x += nor.viteza;
    if (nor.x - nor.latime * 1.6 > W) nor.x = -nor.latime * 1.6;
    const y = nor.y * 0.62 + Math.sin(acum * 0.0004 + nor.x * 0.01) * 4;
    const lat = nor.latime * 1.9, inalt = lat * 0.5;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(stampilaNorului('#ffffff').panza, nor.x - lat * 0.25, y - inalt * 0.6, lat, inalt);
    if (nor.tenta && detaliuFin()) {
      ctx.globalAlpha = nor.tenta * 0.55;
      ctx.drawImage(stampilaNorului(nor.culoare).panza, nor.x - lat * 0.25, y - inalt * 0.6, lat, inalt);
    }
    ctx.restore();
  }
}

function deseneazaFundal3() {
  pregatesteFundal3();
  ctx.drawImage(fundal3.panza, 0, 0);
  deseneazaNoriiPurtati();
}

/* Unde ajunge vârful trompei. Cât e haina închisă, atârnă în față; când se
   desface, se dă la o parte; iar când custodele întinde diploma, o ține de colț. */
function varfulTrompeiMuzeu() {
  const g = geomMuzeu();
  if (s3.diploma) {
    return { x: s3.diploma.x + s3.diploma.w * 0.42, y: s3.diploma.y - s3.diploma.h * 0.30 };
  }
  // când i-l întinde, trompa e cea care-l ține
  if (s3.cercelInPalma && !s3.butonFuge) {
    return { x: s3.butonBaza.x, y: s3.butonBaza.y - s3.butonR * 1.3 };
  }
  /* Cu haina desfăcută, custodele arată cu trompa spre buzunarul care cheamă.
     Un deget întins spune mai limpede decât orice scris că acolo trebuie apăsat. */
  if (s3.faza === 'usaDeschisa' && s3.chemare > 0.5) {
    const b = geomBuzunar(geomMuzeu());
    return { x: b.cx - b.w * 0.66, y: b.cy };
  }
  const ridicat = s3.usa;
  return {
    x: g.cx - g.capR * (1.0 + ridicat * 0.95),
    y: g.capY + g.capR * (1.95 + ridicat * 0.25)
  };
}

/* Diploma de excelență. Nu un bilețel căzut din tavan, ci o foaie mare pe care
   custodele ți-o întinde cu trompa — cu chenar, sigiliu și tot dichisul. */
function daDiploma() {
  const g = geomMuzeu();
  const w = Math.min(W * 0.42, ecran(470));
  s3.diploma = {
    w, h: w * 0.66, p: 0, nascut: performance.now(),
    x: Math.max(w * 0.55, g.cx - g.corpW * 0.42 - w * 0.28),
    y: g.hainaY + g.hainaH * 0.28
  };
  if (audio) sunetHartie();
}

const DURATA_DIPLOMA = 12000;

function deseneazaDiploma() {
  const d = s3.diploma; if (!d) return;
  const varsta = performance.now() - d.nascut;
  if (varsta > DURATA_DIPLOMA) { s3.diploma = null; return; }
  d.p = Math.min(1, d.p + 0.06);
  const stingere = varsta > DURATA_DIPLOMA - 900 ? (DURATA_DIPLOMA - varsta) / 900 : 1;
  const w = d.w * atenuare(d.p), h = d.h * atenuare(d.p);

  ctx.save();
  ctx.globalAlpha = Math.max(0, stingere);
  ctx.translate(d.x, d.y);
  ctx.rotate(-0.05);
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#f7f0dc';
  dreptunghi(-w / 2, -h / 2, w, h, w * 0.02);
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(2, w * 0.008);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(-w / 2 + w * 0.035, -h / 2 + w * 0.035, w - w * 0.07, h - w * 0.07, w * 0.015);
  else ctx.rect(-w / 2 + w * 0.035, -h / 2 + w * 0.035, w - w * 0.07, h - w * 0.07);
  ctx.stroke();
  ctx.strokeStyle = VERDE_LIANA; ctx.lineWidth = Math.max(1, w * 0.004);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(-w / 2 + w * 0.055, -h / 2 + w * 0.055, w - w * 0.11, h - w * 0.11, w * 0.012);
  else ctx.rect(-w / 2 + w * 0.055, -h / 2 + w * 0.055, w - w * 0.11, h - w * 0.11);
  ctx.stroke();
  // colțuri înflorate
  ctx.fillStyle = ALAMA;
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(sx * (w / 2 - w * 0.045), sy * (h / 2 - w * 0.045), w * 0.018, w * 0.01, sx * sy * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  if (d.p > 0.55) {
    ctx.globalAlpha = Math.max(0, stingere) * (d.p - 0.55) / 0.45;
    textIncadrat('DIPLOMĂ DE EXCELENȚĂ', 0, -h * 0.34, w * 0.8,
                 w * 0.07, `bold ${Math.round(w * 0.055)}px Georgia`, '#8f2c38');
    textIncadrat('Se acordă titlul de Cel Mai Ascultător Jucător. Pentru a ridica premiul, trage de cercel.',
                 0, -h * 0.14, w * 0.74, w * 0.055, `${Math.round(w * 0.042)}px Georgia`, '#2b2b2b');
    ctx.textAlign = 'right'; ctx.fillStyle = '#6b6152';
    ctx.font = `italic ${Math.round(w * 0.034)}px Georgia`;
    ctx.fillText('— Direcțiunea Muzeului', w * 0.4, h * 0.34);
    // sigiliu de ceară cu panglică
    ctx.fillStyle = '#8f2c38';  // (panglica se desenează sub sigiliu, mai jos)
    ctx.beginPath(); ctx.arc(-w * 0.3, h * 0.28, w * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b23a48';
    for (const lat of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(-w * 0.3, h * 0.3);
      ctx.lineTo(-w * 0.3 + lat * w * 0.035, h * 0.42);
      ctx.lineTo(-w * 0.3 + lat * w * 0.008, h * 0.39);
      ctx.closePath(); ctx.fill();
    }
  }
  ctx.restore();

  /* Vârful trompei se vede peste colțul foii: altfel diploma ar pluti singură
     în aer, iar custodele ar sta degeaba lângă ea. */
  const varf = varfulTrompeiMuzeu();
  ctx.save();
  ctx.globalAlpha = Math.max(0, stingere);
  for (let k = 0; k < 5; k++) {
    const q = k / 4;
    ctx.fillStyle = ELEF_FATA;
    ctx.beginPath();
    ctx.arc(varf.x + q * w * 0.06, varf.y + q * h * 0.09, w * (0.032 - q * 0.014), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* Manualul de instrucțiuni: un tom vechi, legat în piele, cu ferecături de
   alamă. Custodele îl scoate din buzunar mic și strâmb, apoi îl deschide spre
   tine, crescând până se poate citi. „d" merge de la 0 (scos) la 1 (deschis). */
function deseneazaManual(d) {
  const g = geomMuzeu();
  const p = atenuare(Math.min(1, Math.max(0, d)));
  /* Cartea se oprește sub bărbia lui: dacă ar sta în mijlocul ecranului i-ar
     acoperi fața, iar el tocmai ți-o arată. Și se trage puțin la stânga, ca să
     nu ascundă cercelul din urechea dreaptă. */
  const wMare = Math.min(W * 0.42, ecran(470));
  const w = intre(Math.min(W, H) * 0.11, wMare, p);
  const h = w * 0.66;
  const yMare = Math.min(H - wMare * 0.34 - 14, g.capY + g.capR + wMare * 0.34 + 6);
  const x = intre(g.cx - g.hainaW * 0.26, g.cx - wMare * 0.13, p);
  const y = intre(g.hainaY + g.hainaH * 0.32, yMare, p);
  const unghi = intre(-0.55, 0, p);
  const deschis = p > 0.5 ? (p - 0.5) / 0.5 : 0;      // cât s-au desfăcut copertele

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(unghi);
  ctx.shadowColor = 'rgba(0,0,0,0.32)'; ctx.shadowBlur = w * 0.05; ctx.shadowOffsetY = h * 0.05;
  ctx.fillStyle = PIELE_VECHE;
  dreptunghi(-w / 2, -h / 2, w, h, w * 0.025);
  ctx.shadowColor = 'transparent';

  // nervurile cotorului
  ctx.fillStyle = '#43291a';
  dreptunghi(-w * 0.035, -h / 2, w * 0.07, h, w * 0.01);
  ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(1, w * 0.004);
  for (let k = 1; k <= 3; k++) {
    ctx.beginPath();
    ctx.moveTo(-w * 0.035, -h / 2 + h * k / 4);
    ctx.lineTo(w * 0.035, -h / 2 + h * k / 4);
    ctx.stroke();
  }

  // ferecăturile de alamă din colțuri
  ctx.fillStyle = ALAMA;
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sx * w * 0.5, sy * h * 0.5);
    ctx.lineTo(sx * (w * 0.5 - w * 0.075), sy * h * 0.5);
    ctx.lineTo(sx * w * 0.5, sy * (h * 0.5 - h * 0.11));
    ctx.closePath(); ctx.fill();
  }

  if (deschis < 0.05) {
    // închis: doar titlul ștanțat în piele și cheutoarea
    ctx.fillStyle = ALAMA;
    dreptunghi(w * 0.34, -h * 0.09, w * 0.14, h * 0.18, w * 0.02);
    ctx.restore();
    return;
  }

  // paginile, două file care se desfac de o parte și de alta a cotorului
  const pw = (w * 0.46) * deschis, ph = h * 0.86;
  for (const lat of [-1, 1]) {
    ctx.fillStyle = '#efe6cd';
    ctx.beginPath();
    ctx.moveTo(lat * w * 0.035, -ph / 2);
    ctx.lineTo(lat * (w * 0.035 + pw), -ph / 2 + h * 0.02);
    ctx.lineTo(lat * (w * 0.035 + pw), ph / 2 - h * 0.02);
    ctx.lineTo(lat * w * 0.035, ph / 2);
    ctx.closePath(); ctx.fill();
    // muchia aurită a filelor
    ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(1, w * 0.005);
    ctx.beginPath();
    ctx.moveTo(lat * (w * 0.035 + pw), -ph / 2 + h * 0.02);
    ctx.lineTo(lat * (w * 0.035 + pw), ph / 2 - h * 0.02);
    ctx.stroke();
  }
  // umbra din scobitura cotorului
  const scobit = ctx.createLinearGradient(-w * 0.09, 0, w * 0.09, 0);
  scobit.addColorStop(0, 'rgba(90, 70, 40, 0)');
  scobit.addColorStop(0.5, 'rgba(90, 70, 40, 0.35)');
  scobit.addColorStop(1, 'rgba(90, 70, 40, 0)');
  ctx.fillStyle = scobit;
  ctx.fillRect(-w * 0.09, -ph / 2, w * 0.18, ph);

  if (deschis > 0.6) {
    ctx.globalAlpha = (deschis - 0.6) / 0.4;
    const lat = w * 0.44;
    textIncadrat('MANUAL DE', -w * 0.27, -ph * 0.40, lat * 0.95,
                 w * 0.05, `bold ${Math.round(w * 0.036)}px Georgia`, '#3a2a18');
    textIncadrat('INSTRUCȚIUNI', -w * 0.27, -ph * 0.40 + w * 0.05, lat * 0.95,
                 w * 0.05, `bold ${Math.round(w * 0.036)}px Georgia`, '#3a2a18');
    textIncadrat('pagina ' + s3.manualPagina + ' / 369', -w * 0.27, -ph * 0.14, lat * 0.9,
                 w * 0.04, `${Math.round(w * 0.03)}px Georgia`, '#8a7a58');
    if (s3.manualPagina >= 369) {
      textIncadrat('Ați parcurs regulamentul. Semnați trăgând custodele de cercel.',
                   w * 0.27, -ph * 0.2, lat * 0.9, w * 0.05,
                   `bold ${Math.round(w * 0.034)}px Georgia`, '#b23a48');
    } else {
      const art = ARTICOLE_MANUAL[s3.articol % ARTICOLE_MANUAL.length];
      textIncadrat(art[0], w * 0.27, -ph * 0.34, lat * 0.9, w * 0.045,
                   `bold ${Math.round(w * 0.03)}px Georgia`, '#8a7a58');
      const jos = textIncadrat(art[1], w * 0.27, -ph * 0.22, lat * 0.86, w * 0.05,
                               `${Math.round(w * 0.032)}px Georgia`, '#2b2b2b');
      textIncadrat('(răsfoiește mai departe)', w * 0.27, jos + w * 0.02, lat * 0.86,
                   w * 0.04, `italic ${Math.round(w * 0.026)}px Georgia`, '#8d8570');
    }
  }
  ctx.restore();
}

/* Bolta orientală a unui buzunar-galerie: umerii ies în afară, creștetul se
   ascute. E aceeași linie ca la o firidă de grădină persană. */
function traseuOgiva(x, y, w, h) {
  const a = h * 0.42;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + a * 0.9);
  ctx.quadraticCurveTo(x - w * 0.04, y + a * 0.24, x + w * 0.26, y + a * 0.1);
  ctx.quadraticCurveTo(x + w * 0.4, y + a * 0.02, x + w * 0.5, y - a * 0.16);
  ctx.quadraticCurveTo(x + w * 0.6, y + a * 0.02, x + w * 0.74, y + a * 0.1);
  ctx.quadraticCurveTo(x + w * 1.04, y + a * 0.24, x + w, y + a * 0.9);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

/* Un singur buzunar, mare, în mijlocul căptușelii.

   Erau nouă, numerotate. Nouă firide mărunte cu cifre pe ele se citeau ca un
   tablou de comandă: nu se vedea că se deschid, se vedea că trebuie alese. Iar
   alegerea era falsă — toate duceau în aceeași galerie. Unul singur, cât o ușă,
   cu scris pe el, spune dintr-o privire și ce e, și că se apasă. */
function geomBuzunar(g) {
  const bw = g.hainaW * 0.46, bh = g.hainaH * 0.44;
  const x = g.cx - bw / 2;
  const y = g.hainaY + g.hainaH * 0.24;
  return { x, y, w: bw, h: bh, cx: x + bw / 2, cy: y + bh / 2, culoare: CULORI_BUZUNAR[0] };
}

/* Buzunarul-galerie: o firidă cu boltă, cât o ușă, cu mătase în adânc, ramă și
   rozetă de alamă, și cuvântul GALERIE scris pe pragul ei. Cheamă la atins —
   pulsează și i se aprinde o aură caldă — ca să se vadă că se deschide, nu că
   se admiră. */
function deseneazaBuzunar(g, chemare, acum) {
  const b = geomBuzunar(g);
  const cheama = chemare;
  const puls = 1 + 0.04 * cheama * Math.sin(acum * 0.005);

  if (cheama > 0.02) {
    /* Pe căptușeala aurie, o aură aurie n-ar spune nimic — de-aia lumina care
       cheamă e albă și caldă, iar peste ea se rotește un inel de sclipiri. */
    const bat = 0.6 + 0.4 * Math.sin(acum * 0.005);
    const halo = ctx.createRadialGradient(b.cx, b.cy, b.w * 0.3, b.cx, b.cy, b.w * 0.95);
    halo.addColorStop(0, `rgba(255, 252, 235, ${0.7 * cheama * bat})`);
    halo.addColorStop(1, 'rgba(255, 252, 235, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(b.cx, b.cy, b.w * 0.95, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * cheama * bat})`;
    ctx.lineWidth = Math.max(1.5, b.w * 0.018);
    traseuOgiva(b.x - b.w * 0.04, b.y - b.h * 0.04, b.w * 1.08, b.h * 1.08);
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * cheama})`;
    for (let f = 0; f < 5; f++) {
      const a = acum * 0.0016 + f * Math.PI * 2 / 5;
      ctx.beginPath();
      ctx.arc(b.cx + Math.cos(a) * b.w * 0.62, b.cy + Math.sin(a) * b.h * 0.62,
              b.w * 0.02, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.save();
  ctx.translate(b.cx, b.cy); ctx.scale(puls, puls); ctx.translate(-b.cx, -b.cy);

  ctx.fillStyle = b.culoare;
  traseuOgiva(b.x, b.y, b.w, b.h); ctx.fill();
  const adanc = ctx.createLinearGradient(0, b.y, 0, b.y + b.h);
  adanc.addColorStop(0, 'rgba(0, 0, 0, 0.62)');
  adanc.addColorStop(0.55, 'rgba(0, 0, 0, 0.12)');
  adanc.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  ctx.fillStyle = adanc;
  traseuOgiva(b.x, b.y, b.w, b.h); ctx.fill();

  ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(2, b.w * 0.028);
  traseuOgiva(b.x, b.y, b.w, b.h); ctx.stroke();

  ctx.fillStyle = ALAMA;                       // rozeta din creștetul bolții
  for (let f = 0; f < 8; f++) {
    const a = f / 8 * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(b.cx + Math.cos(a) * b.w * 0.035, b.y + Math.sin(a) * b.w * 0.035,
                b.w * 0.026, b.w * 0.012, a, 0, Math.PI * 2);
    ctx.fill();
  }

  /* Plăcuța de alamă de pe pragul buzunarului, cu numele lui gravat. Un cuvânt
     scris pe un lucru e cel mai scurt drum spre a ști ce e lucrul acela. */
  const px = b.cx, py = b.y + b.h * 0.86, pw = b.w * 0.62, ph = b.h * 0.16;
  const placa = ctx.createLinearGradient(0, py - ph / 2, 0, py + ph / 2);
  placa.addColorStop(0, '#e8cf8a');
  placa.addColorStop(0.5, ALAMA);
  placa.addColorStop(1, '#8a6a2c');
  ctx.fillStyle = placa;
  dreptunghi(px - pw / 2, py - ph / 2, pw, ph, ph * 0.28);
  ctx.strokeStyle = 'rgba(60, 42, 12, 0.55)';
  ctx.lineWidth = Math.max(1, ph * 0.07);
  ctx.strokeRect(px - pw / 2, py - ph / 2, pw, ph);
  ctx.fillStyle = '#3a2a10';
  ctx.font = `bold ${Math.round(ph * 0.62)}px Georgia`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('GALERIE', px, py + ph * 0.04);

  if (s3.vizitat) {                        // galeria văzută, însemnată cu alamă
    ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(1.6, b.w * 0.026); ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(b.cx - b.w * 0.1, b.y + b.h * 0.34);
    ctx.lineTo(b.cx - b.w * 0.03, b.y + b.h * 0.42);
    ctx.lineTo(b.cx + b.w * 0.11, b.y + b.h * 0.22);
    ctx.stroke();
  }
  ctx.restore();
}

/* Haina de custode. Închisă, e ușa muzeului: două poale de catifea verde cu
   broderie de alamă. Desfăcută, se dă în lături și lasă la vedere căptușeala de
   mătase cu buzunarul cel mare — galeria. „deschidere" merge de la 0 la 1. */
function deseneazaHaina(g, deschidere) {
  const w = g.hainaW, h = g.hainaH, x0 = g.hainaX, y0 = g.hainaY;

  /* Haina se taie la trupul lui. Trupul e o elipsă: se îngustează spre poale, iar
     haina — un dreptunghi — nu se îngusta deloc. Colțurile ei de jos ieșeau în
     afara burții cu o palmă bună, și de-aia arăta lipită pe el ca un abțibild,
     nu îmbrăcată.

     Dar tăietura **se lărgește odată cu deschiderea**. Închisă, vesta e mulată pe
     el și se termină exact unde se termină custodele. Descheiată, poalele se dau
     în lături și atârnă lângă trup, cum atârnă orice haină descheiată — iar dacă
     le-am ține tot în silueta lui, s-ar reteza drept la marginea burții și ar
     arăta ca două bucăți de tablă tăiate cu foarfeca. */
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(g.cx, g.corpY + g.corpH * 0.02 * deschidere,
              g.corpW * 0.495 * (1 + deschidere * 0.95),
              g.corpH * 0.515 * (1 + deschidere * 0.12), 0, 0, Math.PI * 2);
  ctx.clip();

  /* Cămașa și papionul de sub haină. Se văd în scobitura reverului cât timp
     haina e închisă — și **numai atunci**.

     Erau desenate mereu, cu gândul că le acoperă căptușeala când haina se
     desface. Nu le acoperea de tot: în spatele galeriei rămânea o bucată de
     papion, plutind peste mătase ca o pată roșie fără explicație. Ce nu se mai
     vede nu trebuie desenat — și e mai ieftin, pe deasupra. */
  if (deschidere < 0.02) {
  ctx.fillStyle = '#f3ead5';
  ctx.beginPath();
  ctx.moveTo(g.cx - w * 0.17, y0 - h * 0.01);
  ctx.lineTo(g.cx + w * 0.17, y0 - h * 0.01);
  ctx.lineTo(g.cx, y0 + h * 0.26);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = ALAMA;
  const py = y0 + h * 0.045, pw = w * 0.07, pcx = g.cx + w * 0.12;
  ctx.beginPath(); ctx.moveTo(pcx, py); ctx.lineTo(pcx - pw, py - pw * 0.62); ctx.lineTo(pcx - pw, py + pw * 0.62); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(pcx, py); ctx.lineTo(pcx + pw, py - pw * 0.62); ctx.lineTo(pcx + pw, py + pw * 0.62); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8f2c38';
  ctx.beginPath(); ctx.arc(pcx, py, pw * 0.3, 0, Math.PI * 2); ctx.fill();
  }

  // căptușeala de mătase și cele nouă buzunare, doar cât e haina desfăcută
  if (deschidere > 0.02) {
    const acum = performance.now();
    const cx0 = x0 + w * 0.05, cy0 = y0 + h * 0.02, cw = w * 0.90, ch = h * 0.96;
    ctx.save();
    ctx.globalAlpha *= Math.min(1, deschidere * 1.6);

    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx0, cy0, cw, ch, w * 0.06); else ctx.rect(cx0, cy0, cw, ch);
    ctx.clip();
    ctx.fillStyle = '#e6c98d';
    ctx.fillRect(cx0, cy0, cw, ch);
    // zăbrelele de aur ale mătăsii, o rețea de romburi abia ghicită
    ctx.globalAlpha *= 0.22;
    ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(1, w * 0.003);
    for (let d2 = -ch; d2 < cw + ch; d2 += w * 0.075) {
      ctx.beginPath(); ctx.moveTo(cx0 + d2, cy0); ctx.lineTo(cx0 + d2 + ch, cy0 + ch); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx0 + d2, cy0 + ch); ctx.lineTo(cx0 + d2 + ch, cy0); ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(1.5, w * 0.008);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx0, cy0, cw, ch, w * 0.06); else ctx.rect(cx0, cy0, cw, ch);
    ctx.stroke();

    deseneazaBuzunar(g, s3.chemare, acum);
    ctx.restore();
  }

  /* Cele două poale, prinse în balamale la umeri. „i" e sensul dinspre umăr
     spre mijlocul pieptului, ca aceeași croială să meargă și pe stânga, și pe
     dreapta. Închise, se petrec una peste alta; desfăcute, se dau în lături. */
  for (const lat of [-1, 1]) {
    const i = -lat;
    ctx.save();
    ctx.translate(g.cx + lat * w * 0.5, y0);
    /* Poala se rotește puțin și se dă mult în lături. Rotația mare pare mai
       firească, dar duce tivul înapoi spre mijloc și acoperă tocmai buzunarele
       de jos — de-aia unghiul e mic și deplasarea mare. */
    ctx.rotate(lat * deschidere * 0.3);
    ctx.translate(lat * deschidere * w * 0.44, deschidere * h * 0.04);
    /* Descheiată, poala **atârnă**: nu mai stă întinsă pe piept, ci cade de pe
       umăr. Se strânge puțin în lățime, fiindcă stofa nu mai e trasă peste
       burtă, și se lungește puțin, fiindcă a rămas să atârne în voia ei. */
    const d = Math.max(0, Math.min(1, deschidere));
    ctx.scale(1 - d * 0.14, 1 + d * 0.07);

    const catifea = ctx.createLinearGradient(0, 0, i * w * 0.56, h);
    catifea.addColorStop(0, '#4a6e50');
    catifea.addColorStop(0.45, VERDE_CATIFEA);
    catifea.addColorStop(1, VERDE_UMBRA);
    ctx.fillStyle = catifea;
    /* Croiala poalei. Închisă, marginea din față e aproape dreaptă: stofa e
       întinsă pe piept. Descheiată, se bombează în afară și tivul se leagănă — o
       stofă lăsată liberă nu se termină niciodată pe o linie dreaptă. Sunt
       aceleași puncte, mișcate cu `d`. */
    const traseulPoalei = function () {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(i * w * 0.14, -h * 0.04, i * w * 0.30, h * 0.02);   // linia umărului
      ctx.quadraticCurveTo(i * w * 0.46, h * 0.07, i * w * 0.53, h * 0.24);    // reverul coboară în V
      ctx.quadraticCurveTo(i * w * (0.53 + d * 0.16), h * 0.58,
                           i * w * (0.56 + d * 0.05), h * (0.92 + d * 0.04));
      /* Tivul urcă spre marginea din afară, cum urcă orice tiv pe un trup rotund:
         mijlocul burții e mai aproape de tine, deci mai jos pe ecran. Tăiat
         drept, vesta se termina pe o linie orizontală — semnul cel mai sigur că
         un desen e lipit, nu îmbrăcat. */
      ctx.quadraticCurveTo(i * w * (0.50 + d * 0.04), h * (0.86 + d * 0.06),
                           i * w * (0.34 + d * 0.02), h * (0.99 + d * 0.02));
      ctx.quadraticCurveTo(i * w * 0.16, h * (1.04 - d * 0.02), 0, h * 1.0);
      ctx.closePath();
    };
    traseulPoalei();
    ctx.fill();

    // luciul catifelei, o dungă mai deschisă pe lungul poalei
    ctx.save();
    ctx.globalAlpha *= 0.35;
    ctx.fillStyle = '#4e7455';
    ctx.beginPath();
    ctx.moveTo(i * w * 0.08, h * 0.06);
    ctx.quadraticCurveTo(i * w * 0.20, h * 0.5, i * w * 0.10, h * 0.93);
    ctx.lineTo(i * w * 0.26, h * 0.93);
    ctx.quadraticCurveTo(i * w * 0.34, h * 0.5, i * w * 0.24, h * 0.06);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.strokeStyle = VERDE_UMBRA; ctx.lineWidth = Math.max(1.5, w * 0.007);
    traseulPoalei();
    ctx.stroke();

    /* Cutele care se adună pe poala descheiată. O stofă care atârnă se strânge
       în falduri de la umăr în jos; fără ele, poala rămâne o suprafață plată —
       adică o bucată de tablă vopsită în verde. */
    if (d > 0.05) {
      ctx.save();
      traseulPoalei();
      ctx.clip();
      ctx.globalAlpha *= d * 0.5;
      ctx.strokeStyle = VERDE_UMBRA;
      ctx.lineWidth = Math.max(1, w * 0.012);
      for (let k = 0; k < 4; k++) {
        const q = 0.12 + k * 0.13;
        ctx.beginPath();
        ctx.moveTo(i * w * (0.10 + q * 0.5), h * 0.06);
        ctx.quadraticCurveTo(i * w * (0.30 + q * 0.6), h * 0.5,
                             i * w * (0.16 + q * 0.7), h * 0.98);
        ctx.stroke();
      }
      ctx.restore();
    }

    // reverul întors, de mătase mai deschisă
    ctx.fillStyle = '#4e7455';
    ctx.beginPath();
    ctx.moveTo(i * w * 0.30, h * 0.02);
    ctx.quadraticCurveTo(i * w * 0.46, h * 0.07, i * w * 0.53, h * 0.24);
    ctx.quadraticCurveTo(i * w * 0.40, h * 0.20, i * w * 0.32, h * 0.10);
    ctx.closePath(); ctx.fill();

    // broderia de alamă în linie de biciuiră
    ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(1.3, w * 0.006); ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(i * w * 0.42, h * 0.86);
    ctx.quadraticCurveTo(i * w * 0.52, h * 0.62, i * w * 0.34, h * 0.48);
    ctx.quadraticCurveTo(i * w * 0.18, h * 0.34, i * w * 0.28, h * 0.20);
    ctx.stroke();
    ctx.fillStyle = ALAMA;
    ctx.beginPath();
    ctx.ellipse(i * w * 0.28, h * 0.18, w * 0.032, w * 0.016, i * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // nasturii, pe poala care se petrece deasupra
    if (lat === -1) {
      ctx.fillStyle = ALAMA;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.arc(i * w * 0.46, h * (0.36 + k * 0.2), w * 0.026, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  ctx.restore();          // tăietura la trupul custodelui
}

/* Elefantul-muzeu: stă pe fund, cu fața la tine, și te privește. Tot ce era
   clădire e acum el — n-are ferestre, fiindcă are ochi. */
/* Pielea custodelui. Un elefant adevărat nu e o pată de culoare: are lumină pe
   frunte, umbră sub bărbie, cute la încheieturi și pete de pigment. Culorile de
   aici sunt doar capetele degradeurilor — volumul se face din ele. */
const ELEF_FATA = '#4a7fb5', ELEF_SUS = '#84b4de', ELEF_LATERAL = '#2f5885',
      ELEF_INCHIS = '#1d3a5c', ELEF_PATA = 'rgba(28, 56, 88, 0.16)',
      ELEF_MARGINE = 'rgba(196, 228, 255, 0.5)';

// Un aleator cu sămânță fixă: petele de pigment stau pe loc de la un cadru la altul.
function pigment(i) {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/* Pete de pigment risipite peste o formă rotundă. Fără ele pielea arată ca
   plasticul: netedă, uniformă, moartă. */
function petePiele(cx, cy, rx, ry, cate, sământă) {
  if (!detaliuFin()) return;         // petele de pigment costă și se văd abia
  ctx.fillStyle = ELEF_PATA;
  for (let k = 0; k < cate; k++) {
    const a = pigment(sământă + k) * Math.PI * 2;
    const d = Math.sqrt(pigment(sământă + k + 0.5));
    const r = rx * (0.03 + pigment(sământă + k + 0.25) * 0.055);
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * rx * d * 0.86, cy + Math.sin(a) * ry * d * 0.86,
                r, r * 0.72, a, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Câteva cute scurte, acolo unde pielea se strânge.
function cutePiele(x, y, lung, cate, unghi, gros) {
  ctx.strokeStyle = 'rgba(24, 48, 76, 0.22)';
  ctx.lineCap = 'round';
  for (let k = 0; k < cate; k++) {
    ctx.lineWidth = gros;
    const o = (k - (cate - 1) / 2) * gros * 2.6;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(unghi + 1.57) * o, y + Math.sin(unghi + 1.57) * o);
    ctx.quadraticCurveTo(
      x + Math.cos(unghi) * lung * 0.5 + Math.cos(unghi + 1.57) * (o + gros),
      y + Math.sin(unghi) * lung * 0.5 + Math.sin(unghi + 1.57) * (o + gros),
      x + Math.cos(unghi) * lung + Math.cos(unghi + 1.57) * o,
      y + Math.sin(unghi) * lung + Math.sin(unghi + 1.57) * o);
    ctx.stroke();
  }
}

/* Ochiul: sclera umedă, irisul cu raze, pupila, sclipirea ferestrei și o a doua
   sclipire mică. Blândețea unui personaj stă aproape toată în ochi. */
function ochiCustode(g, lat, clipeste, respir) {
  const ox = g.cx + lat * g.capR * 0.38;
  const oy = g.capY - g.capR * 0.1 + respir * 0.6;
  const R = g.capR * 0.235;

  // orbita: o adâncitură abia ghicită în jurul ochiului
  const orbita = ctx.createRadialGradient(ox, oy, R * 0.8, ox, oy, R * 2.1);
  orbita.addColorStop(0, 'rgba(20, 42, 68, 0.28)');
  orbita.addColorStop(1, 'rgba(20, 42, 68, 0)');
  ctx.fillStyle = orbita;
  ctx.beginPath(); ctx.arc(ox, oy, R * 2.1, 0, Math.PI * 2); ctx.fill();

  if (clipeste) {
    ctx.strokeStyle = ELEF_INCHIS; ctx.lineWidth = R * 0.22; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(ox - R, oy); ctx.quadraticCurveTo(ox, oy + R * 0.3, ox + R, oy);
    ctx.stroke();
    return;
  }

  // sclera, uşor umbrită sus de pleoapă
  const alb = ctx.createRadialGradient(ox - R * 0.2, oy - R * 0.3, R * 0.1, ox, oy, R);
  alb.addColorStop(0, '#ffffff');
  alb.addColorStop(0.75, '#f2f5f8');
  alb.addColorStop(1, '#cfd9e2');
  ctx.fillStyle = alb;
  ctx.beginPath(); ctx.ellipse(ox, oy, R * 0.94, R, 0, 0, Math.PI * 2); ctx.fill();

  // irisul: inel de raze, mai deschis la margine
  const ix = ox + lat * R * 0.1, iy = oy + R * 0.07;
  const iris = ctx.createRadialGradient(ix, iy - R * 0.1, R * 0.05, ix, iy, R * 0.62);
  iris.addColorStop(0, '#4d7ea8');
  iris.addColorStop(0.62, '#2b4a6e');
  iris.addColorStop(1, '#16283e');
  ctx.fillStyle = iris;
  ctx.beginPath(); ctx.arc(ix, iy, R * 0.62, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(140, 186, 224, 0.35)'; ctx.lineWidth = R * 0.045;
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(ix + Math.cos(a) * R * 0.24, iy + Math.sin(a) * R * 0.24);
    ctx.lineTo(ix + Math.cos(a) * R * 0.55, iy + Math.sin(a) * R * 0.55);
    ctx.stroke();
  }

  ctx.fillStyle = '#0d1722';
  ctx.beginPath(); ctx.arc(ix, iy, R * 0.29, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';   // sclipirea ferestrei
  ctx.beginPath(); ctx.ellipse(ix - R * 0.22, iy - R * 0.28, R * 0.19, R * 0.14, -0.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';   // a doua sclipire, mică
  ctx.beginPath(); ctx.arc(ix + R * 0.24, iy + R * 0.22, R * 0.09, 0, Math.PI * 2); ctx.fill();

  // pleoapa de sus, care lasă umbră, și linia umedă de jos
  ctx.strokeStyle = ELEF_INCHIS; ctx.lineWidth = R * 0.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(ox, oy, R * 1.04, Math.PI * 1.06, Math.PI * 1.98); ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; ctx.lineWidth = R * 0.07;
  ctx.beginPath(); ctx.arc(ox, oy, R * 0.96, Math.PI * 0.12, Math.PI * 0.88); ctx.stroke();

  // genele
  ctx.strokeStyle = ELEF_INCHIS; ctx.lineWidth = R * 0.09;
  for (let k = 0; k < 4; k++) {
    const a = Math.PI * (1.1 + k * 0.12);
    ctx.beginPath();
    ctx.moveTo(ox + Math.cos(a) * R * 1.02, oy + Math.sin(a) * R * 1.02);
    ctx.quadraticCurveTo(ox + Math.cos(a) * R * 1.3, oy + Math.sin(a) * R * 1.36,
                         ox + Math.cos(a - 0.16) * R * 1.5, oy + Math.sin(a - 0.16) * R * 1.46);
    ctx.stroke();
  }
}

function deseneazaMuzeu(alfa = 1) {
  const g = geomMuzeu();
  const t = performance.now();
  const respir = Math.sin(t * 0.0018) * g.S * 0.007;
  // clipitul e decalat, ca primul cadru al scenei să nu-l prindă cu ochii închiși
  const clipeste = ((t + 2000) % 4200) < 140;
  const u = g.capR;

  ctx.save();
  ctx.globalAlpha = alfa;

  // umbra pe iarbă, moale la margini
  const umbra = ctx.createRadialGradient(g.cx, g.talpa + g.S * 0.012, g.corpW * 0.1,
                                         g.cx, g.talpa + g.S * 0.012, g.corpW * 0.72);
  umbra.addColorStop(0, 'rgba(26, 44, 20, 0.42)');
  umbra.addColorStop(1, 'rgba(26, 44, 20, 0)');
  ctx.fillStyle = umbra;
  ctx.beginPath();
  ctx.ellipse(g.cx, g.talpa + g.S * 0.012, g.corpW * 0.72, g.S * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- urechile, în spatele capului ----
  for (const lat of [-1, 1]) {
    const ex = g.cx + lat * g.urecheX, ey = g.capY;
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(lat * (0.05 + 0.045 * Math.sin(t * 0.0022 + lat)));

    const fataUrechii = ctx.createLinearGradient(-g.urecheRX, -g.urecheRY, g.urecheRX, g.urecheRY);
    fataUrechii.addColorStop(0, lat < 0 ? ELEF_FATA : ELEF_LATERAL);
    fataUrechii.addColorStop(1, lat < 0 ? ELEF_LATERAL : ELEF_INCHIS);
    ctx.fillStyle = fataUrechii;
    ctx.beginPath(); ctx.ellipse(0, 0, g.urecheRX, g.urecheRY, 0, 0, Math.PI * 2); ctx.fill();

    // interiorul urechii, luminat prin transparență ca o foaie subțire
    const interior = ctx.createRadialGradient(-lat * g.urecheRX * 0.2, -g.urecheRY * 0.15, g.urecheRX * 0.1,
                                              0, 0, g.urecheRX * 0.95);
    interior.addColorStop(0, '#a9c6e4');
    interior.addColorStop(0.65, '#7e9fc4');
    interior.addColorStop(1, '#5b7fa8');
    ctx.fillStyle = interior;
    ctx.beginPath();
    ctx.ellipse(-lat * g.urecheRX * 0.16, g.urecheRY * 0.06, g.urecheRX * 0.62, g.urecheRY * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // vinele care se ramifică pe pielea subțire
    /* Vinele urechii pornesc dintr-un singur loc, de la baza ei, și se
       ramifică în evantai. Trase paralel, ar arăta a jaluzea, nu a piele. */
    ctx.strokeStyle = 'rgba(66, 98, 136, 0.28)'; ctx.lineCap = 'round';
    const rx0 = lat * g.urecheRX * 0.34, ry0 = g.urecheRY * 0.52;
    for (let k = 0; k < 5; k++) {
      const desch = (k - 2) * 0.36;
      ctx.lineWidth = g.urecheRX * (0.03 - Math.abs(k - 2) * 0.004);
      ctx.beginPath();
      ctx.moveTo(rx0, ry0);
      ctx.quadraticCurveTo(rx0 - lat * g.urecheRX * 0.22 + desch * g.urecheRX * 0.3,
                           ry0 - g.urecheRY * 0.5,
                           rx0 - lat * g.urecheRX * 0.3 + desch * g.urecheRX * 0.62,
                           ry0 - g.urecheRY * 1.05);
      ctx.stroke();
    }

    petePiele(0, 0, g.urecheRX, g.urecheRY, 5, lat * 31 + 7);

    // marginea răsfrântă, prinsă de lumină
    ctx.strokeStyle = ELEF_MARGINE; ctx.lineWidth = g.S * 0.005;
    ctx.beginPath();
    ctx.ellipse(0, 0, g.urecheRX * 0.99, g.urecheRY * 0.99, 0, Math.PI * 0.9, Math.PI * 1.9);
    ctx.stroke();
    ctx.restore();
  }

  // ---- corpul ----
  const corp = ctx.createRadialGradient(
    g.cx - g.corpW * 0.22, g.corpY - g.corpH * 0.3, g.corpW * 0.06,
    g.cx, g.corpY, g.corpW * 0.62);
  corp.addColorStop(0, ELEF_SUS);
  corp.addColorStop(0.42, ELEF_FATA);
  corp.addColorStop(0.82, ELEF_LATERAL);
  corp.addColorStop(1, ELEF_INCHIS);
  ctx.fillStyle = corp;
  ctx.beginPath();
  ctx.ellipse(g.cx, g.corpY + respir, g.corpW * 0.5, g.corpH * 0.52 - respir, 0, 0, Math.PI * 2);
  ctx.fill();
  petePiele(g.cx, g.corpY, g.corpW * 0.48, g.corpH * 0.5, 11, 3);

  // lumina de contur pe partea dreaptă, unde cade cerul
  ctx.strokeStyle = ELEF_MARGINE; ctx.lineWidth = g.S * 0.006;
  ctx.beginPath();
  ctx.ellipse(g.cx, g.corpY + respir, g.corpW * 0.5, g.corpH * 0.52, 0, -Math.PI * 0.42, Math.PI * 0.3);
  ctx.stroke();

  // ---- labele din față ----
  for (const lat of [-1, 1]) {
    const px = g.cx + lat * g.corpW * 0.3, py = g.talpa - g.S * 0.035;
    const laba = ctx.createLinearGradient(px, py - g.S * 0.06, px, py + g.S * 0.05);
    laba.addColorStop(0, ELEF_FATA);
    laba.addColorStop(1, ELEF_INCHIS);
    ctx.fillStyle = laba;
    ctx.beginPath(); ctx.ellipse(px, py, g.corpW * 0.17, g.S * 0.055, 0, 0, Math.PI * 2); ctx.fill();
    cutePiele(px - g.corpW * 0.1, py - g.S * 0.02, g.corpW * 0.2, 3, 0.05, g.S * 0.004);
    for (let k = -1; k <= 1; k++) {
      const ung = ctx.createLinearGradient(0, py + g.S * 0.01, 0, py + g.S * 0.032);
      ung.addColorStop(0, '#f1f5fa');
      ung.addColorStop(1, '#c2cede');
      ctx.fillStyle = ung;
      ctx.beginPath();
      ctx.ellipse(px + k * g.corpW * 0.055, py + g.S * 0.022, g.corpW * 0.02, g.S * 0.014, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  deseneazaHaina(g, s3.usa);

  // ---- capul ----
  const cap = ctx.createRadialGradient(
    g.cx - u * 0.34, g.capY - u * 0.44, u * 0.08,
    g.cx, g.capY, u * 1.05);
  cap.addColorStop(0, '#9cc4e8');
  cap.addColorStop(0.38, ELEF_SUS);
  cap.addColorStop(0.72, ELEF_FATA);
  cap.addColorStop(1, ELEF_LATERAL);
  ctx.fillStyle = cap;
  ctx.beginPath();
  ctx.ellipse(g.cx, g.capY + respir * 0.6, u * 0.96, u, 0, 0, Math.PI * 2);
  ctx.fill();

  // umbra pe care o lasă bărbia peste piept
  const subBarbie = ctx.createLinearGradient(0, g.capY + u * 0.5, 0, g.capY + u * 1.35);
  subBarbie.addColorStop(0, 'rgba(18, 38, 62, 0)');
  subBarbie.addColorStop(1, 'rgba(18, 38, 62, 0.4)');
  ctx.fillStyle = subBarbie;
  ctx.beginPath();
  ctx.ellipse(g.cx, g.capY + u * 0.62, u * 0.9, u * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // bombeul frunții
  const frunte = ctx.createRadialGradient(g.cx - u * 0.2, g.capY - u * 0.55, u * 0.05,
                                          g.cx - u * 0.15, g.capY - u * 0.5, u * 0.6);
  frunte.addColorStop(0, 'rgba(206, 230, 250, 0.55)');
  frunte.addColorStop(1, 'rgba(206, 230, 250, 0)');
  ctx.fillStyle = frunte;
  ctx.beginPath(); ctx.ellipse(g.cx - u * 0.15, g.capY - u * 0.5, u * 0.55, u * 0.3, 0, 0, Math.PI * 2); ctx.fill();

  petePiele(g.cx, g.capY, u * 0.9, u * 0.95, 8, 51);
  cutePiele(g.cx - u * 0.72, g.capY + u * 0.12, u * 0.22, 3, 0.5, u * 0.02);
  cutePiele(g.cx + u * 0.56, g.capY + u * 0.12, u * 0.22, 3, 2.6, u * 0.02);

  ochiCustode(g, -1, clipeste, respir);
  ochiCustode(g, 1, clipeste, respir);

  // obrajii: rumeneală moale, nu două pete lipite
  for (const lat of [-1, 1]) {
    const bx = g.cx + lat * u * 0.66, by = g.capY + u * 0.34;
    const obraz = ctx.createRadialGradient(bx, by, u * 0.02, bx, by, u * 0.24);
    obraz.addColorStop(0, ROZ_OBRAZ);
    obraz.addColorStop(1, 'rgba(240, 128, 138, 0)');
    ctx.fillStyle = obraz;
    ctx.beginPath(); ctx.ellipse(bx, by, u * 0.24, u * 0.17, 0, 0, Math.PI * 2); ctx.fill();
  }

  // zâmbetul
  ctx.strokeStyle = 'rgba(21, 43, 70, 0.75)'; ctx.lineWidth = u * 0.045; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(g.cx, g.capY + u * 0.3, u * 0.3, Math.PI * 0.18, Math.PI * 0.82);
  ctx.stroke();

  /* ---- trompa ----
     Cât e haina închisă, atârnă în față. Când și-o desface, o dă larg la stânga,
     ca un chelner care ține ușa: altfel și-ar acoperi singur buzunarele. */
  const ridicat = s3.usa;
  const P0 = { x: g.cx, y: g.capY + u * 0.35 };
  const P2 = varfulTrompeiMuzeu();
  const P1 = s3.diploma
    ? { x: intre(P0.x, P2.x, 0.45), y: Math.max(P0.y, P2.y) + u * 0.4 }
    : { x: g.cx - u * (0.1 + ridicat * 1.8), y: g.capY + u * (2.05 - ridicat * 0.75) };

  /* Trompa se desena din douăzeci și șase de cercuri, fiecare cu degradeul lui —
     douăzeci și șase de umpleri pe cadru pentru un singur mădular. Acum e un
     contur închis, cu un singur degradeu peste el, și câteva cute deasupra. */
  const pasi = 16;
  const stanga = [], dreapta = [], mijloc = [];
  for (let k = 0; k <= pasi; k++) {
    const q = k / pasi, r = 1 - q;
    const x = r * r * P0.x + 2 * r * q * P1.x + q * q * P2.x;
    const y = r * r * P0.y + 2 * r * q * P1.y + q * q * P2.y;
    const raza = u * (0.2 - q * 0.13);
    mijloc.push({ x, y, raza });
  }
  for (let k = 0; k < mijloc.length; k++) {
    const a2 = mijloc[k], b2 = mijloc[Math.min(k + 1, mijloc.length - 1)];
    const c2 = mijloc[Math.max(k - 1, 0)];
    const ang = Math.atan2(b2.y - c2.y, b2.x - c2.x) + Math.PI / 2;
    stanga.push({ x: a2.x + Math.cos(ang) * a2.raza, y: a2.y + Math.sin(ang) * a2.raza });
    dreapta.push({ x: a2.x - Math.cos(ang) * a2.raza, y: a2.y - Math.sin(ang) * a2.raza });
  }
  ctx.beginPath();
  ctx.moveTo(stanga[0].x, stanga[0].y);
  for (let k = 1; k < stanga.length; k++) ctx.lineTo(stanga[k].x, stanga[k].y);
  const varf = mijloc[mijloc.length - 1];
  ctx.arc(varf.x, varf.y, varf.raza, 0, Math.PI * 2);
  for (let k = dreapta.length - 1; k >= 0; k--) ctx.lineTo(dreapta[k].x, dreapta[k].y);
  ctx.closePath();
  const pielea = ctx.createLinearGradient(P0.x - u * 0.2, 0, P0.x + u * 0.2, 0);
  pielea.addColorStop(0, ELEF_SUS);
  pielea.addColorStop(0.42, ELEF_FATA);
  pielea.addColorStop(1, ELEF_LATERAL);
  ctx.fillStyle = pielea;
  ctx.fill();

  ctx.strokeStyle = 'rgba(20, 42, 68, 0.22)';   // cutele inelare
  ctx.lineCap = 'round';
  for (let k = 3; k < mijloc.length - 1; k += detaliuFin() ? 2 : 4) {
    const a2 = mijloc[k], b2 = mijloc[k + 1], c2 = mijloc[k - 1];
    const ang = Math.atan2(b2.y - c2.y, b2.x - c2.x) + Math.PI / 2;
    ctx.lineWidth = Math.max(1, u * 0.016);
    ctx.beginPath();
    ctx.moveTo(a2.x + Math.cos(ang) * a2.raza * 0.9, a2.y + Math.sin(ang) * a2.raza * 0.9);
    ctx.lineTo(a2.x - Math.cos(ang) * a2.raza * 0.9, a2.y - Math.sin(ang) * a2.raza * 0.9);
    ctx.stroke();
  }

  // nara din vârf
  ctx.fillStyle = 'rgba(16, 34, 56, 0.55)';
  ctx.beginPath();
  ctx.ellipse(P2.x, P2.y, u * 0.035, u * 0.026, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ---- desen: plicul ----
function deseneazaPlic(x, y, s, alfa = 1) {
  s *= scalaPanzei;               // plicul e măsurat în pixeli de-ai ecranului
  ctx.save(); ctx.globalAlpha = alfa; ctx.translate(x, y);
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#f0e9d8';
  ctx.fillRect(-70 * s, -46 * s, 140 * s, 92 * s);
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#c9bfa6'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-70 * s, -46 * s); ctx.lineTo(0, 8 * s); ctx.lineTo(70 * s, -46 * s); ctx.stroke();
  // sigiliu de ceară
  ctx.fillStyle = '#b23a48'; ctx.beginPath(); ctx.arc(0, 2 * s, 13 * s, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8f2c38'; ctx.font = `${14 * s}px Georgia`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('§', 0, 2 * s);
  ctx.restore();
}

// ---- actualizare Scena 3 ----
function actualizeazaMuzeu(acum) {
  if (s3.faza === 'intro' && acum - s3.t0 > 3200) faza3('plic');

  /* Sala galeriei se pictează din vreme, cât stai cu manualul în mână sau cât te
     cerți cu cercelul. E o sală întreagă — pereți, patru panouri de damasc cu
     sutele lor de motive, pilaștri, candelabru, parchet, inscripția murală — și
     pictată în chiar cadrul în care intri, tot desenul ei cade într-o singură
     clipă, exact în clipa în care ar trebui să se deschidă lin. Aici, în schimb,
     nu se mișcă mai nimic pe ecran, iar sughițul nu se simte.

     Se cheamă la fiecare cadru fără grijă: dacă e deja pictată la mărimea bună,
     funcția se întoarce din prima linie. */
  if (typeof pregatesteSala === 'function' &&
      (s3.faza === 'manual' || s3.faza === 'nuMaApasa' || s3.faza === 'usaDeschisa')) {
    pregatesteSala();
  }

  // păsările: una la câteva secunde, la răstimpuri neregulate, ca să nu se simtă
  // ceasul din spatele lor
  if (naturaScena3 && acum > s3.urmatoareaPasare) {
    s3.urmatoareaPasare = acum + 3500 + Math.random() * 7000;
    s3.cantecePasari++;
    cantecDePasare();
  }

  // inactivitate escaladată (doar când există un buton de apăsat)
  if (s3.faza === 'sonerie' || s3.faza === 'manual' || s3.faza === 'nuMaApasa') {
    const idle = acum - s3.ultimaActiune;
    if (idle > 300000) { faza3('pace'); if (audio) sunetOftat(); return; }
    const niv = idle > 120000 ? 3 : idle > 60000 ? 2 : idle > 30000 ? 1 : 0;
    if (niv > s3.nivelInactiv) {
      s3.nivelInactiv = niv;
      if (niv === 1) aratBilet('Timpul trece. Ce mai stai?');
      if (niv === 2) aratBilet('Ai înghețat? E doar un cercel, nu mușcă. Trage de el!');
    }
    if (niv >= 1 && acum - s3.ultimTic > 1000) { s3.ultimTic = acum; if (audio) sunetTicTac(); }

    // dacă utilizatorul refuză (nu apasă) după avertisment → diploma, apoi butonul fuge
    /* Cercelul se supără fie când îl lași în pace o vreme, fie când îl apeși
       prea des. Înainte se supăra numai de la liniște, iar fiecare apăsare
       repornea socoteala — așa că cine apăsa întruna nu ajungea niciodată la
       partea în care fuge, ci la a cincizecea apăsare, unde scoate aburi și reia
       scena de la capăt. Din afară arăta ca un blocaj: apeși, apeși, și te
       trezești iar la început. */
    if (s3.faza === 'nuMaApasa' && !s3.refuzArmat &&
        (acum - s3.ultimaActiune > 6500 || s3.presari >= 12)) {
      s3.refuzArmat = true;
      daDiploma();
    }
  }

  // butonul care fuge de deget
  if (s3.butonFuge) {
    // cu cât îl ratezi mai des, cu atât fuge mai încet: gluma nu trebuie să se
    // transforme într-un zid
    const oboseala = Math.max(0, 1 - s3.incercari / 6);
    const dx = s3.butonX - cursor.x, dy = s3.butonY - cursor.y, d = Math.hypot(dx, dy);
    if (d < s3.butonR * 4 && d > 0.1 && oboseala > 0) {
      s3.butonX += (dx / d) * 9 * oboseala;
      s3.butonY += (dy / d) * 9 * oboseala;
    }
    const g = geomMuzeu();   // cercelul scăpat nu fuge dincolo de marginile lui
    s3.butonX = Math.max(g.fx - g.fw / 2, Math.min(g.fx + g.fw / 2, s3.butonX));
    s3.butonY = Math.max(g.top, Math.min(g.talpa, s3.butonY));
  } else {
    /* Cercelul atârnă în lănțișor: când degetul se apropie, se lasă spre el ca
       un elastic; când degetul pleacă, se leagănă înapoi la locul lui. */
    const baza = s3.butonBaza;
    const dx = cursor.x - baza.x, dy = cursor.y - baza.y;
    const d = Math.hypot(dx, dy);
    const ajutor = ajutorulCustodelui();
    const raza = s3.butonR * (7 + ajutor * 10);         // simte degetul de mai departe
    const trage = d < raza ? 1 - d / raza : 0;
    const intins = Math.min(d, s3.butonR * (3.4 + ajutor * 4)) * trage;
    const tx = baza.x + (d > 0.1 ? dx / d : 0) * intins;
    const ty = baza.y + (d > 0.1 ? dy / d : 0) * intins;
    s3.butonX += (tx - s3.butonX) * 0.22;
    s3.butonY += (ty - s3.butonY) * 0.22;
  }
  s3.stralucire *= 0.93;                     // rubinul se stinge încet după apăsare

  /* Dacă tot n-a nimerit, custodele nu-l mai lasă să se chinuie: își scoate
     cercelul din ureche și i-l întinde în vârful trompei, mare și în mijloc. */
  if (!s3.cercelInPalma && s3.incercari >= PRAG_PALMA &&
      (s3.faza === 'sonerie' || s3.faza === 'manual')) {
    s3.cercelInPalma = true;
    aratBilet('Ia-l tu, dacă tot nu vrea să se lase prins.');
    if (audio) sunetClopotel(784);
  }
  if (s3.cercelInPalma) {
    const gm = geomMuzeu();
    s3.butonBaza = { x: gm.cx - gm.capR * 1.05, y: gm.capY + gm.capR * 2.05 };
    s3.butonR = gm.capR * 0.3;
  }

  if (s3.usa > 0 && s3.usa < 1 && s3.faza === 'usaDeschisa') s3.usa = Math.min(1, s3.usa + 0.02);
  // tomul se deschide singur spre privitor, odată scos din buzunar
  if (s3.faza === 'manual' && s3.manualDeschidere < 1) s3.manualDeschidere = Math.min(1, s3.manualDeschidere + 0.016);
  // după ce haina s-a desfăcut de tot, buzunarele încep să cheme la atins
  if (s3.faza === 'usaDeschisa' && s3.usa >= 1) {
    s3.chemare = Math.min(1, s3.chemare + 0.006);
    if (!s3.aSunatChemarea && s3.chemare > 0.5) { s3.aSunatChemarea = true; sunetClopotel(1046.5); }
  }
}

// ---- desenarea butonului-sonerie ----
function deseneazaButon(acum) {
  const idle = acum - s3.ultimaActiune;
  const puls = 1 + 0.06 * Math.sin(acum * 0.006);
  const rosuAlarma = s3.nivelInactiv >= 1;
  const g = geomMuzeu();
  // veriga de alamă și lănțișorul care leagă cercelul de lobul urechii
  if (!s3.butonFuge && !s3.cercelInPalma) {
    ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(1.6, s3.butonR * 0.22); ctx.lineCap = 'round';
    const lx = g.cx + g.urecheX + g.urecheRX * 0.1;
    ctx.beginPath();
    ctx.moveTo(lx, g.lobUreche);
    // lănțișorul se curbează cu atât mai mult cu cât cercelul e tras mai departe
    ctx.quadraticCurveTo((lx + s3.butonX) * 0.5 - (s3.butonX - lx) * 0.18,
                         (g.lobUreche + s3.butonY) * 0.5,
                         s3.butonX, s3.butonY - s3.butonR);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(g.cx + g.urecheX + g.urecheRX * 0.1, g.lobUreche, s3.butonR * 0.32, 0, Math.PI * 2);
    ctx.stroke();
  }
  // montura de alamă a pietrei
  ctx.fillStyle = ALAMA;
  ctx.beginPath(); ctx.arc(s3.butonX, s3.butonY, s3.butonR * 1.32, 0, Math.PI * 2); ctx.fill();
  // piatra — rubin, care se aprinde din interior la apăsare
  const r = s3.butonR * (rosuAlarma ? puls : 1) * (1 + s3.stralucire * 0.12);
  const lum = s3.stralucire;
  if (lum > 0.02) {
    const halo = ctx.createRadialGradient(s3.butonX, s3.butonY, r * 0.5, s3.butonX, s3.butonY, r * 3.4);
    halo.addColorStop(0, `rgba(255, 90, 70, ${0.5 * lum})`);
    halo.addColorStop(1, 'rgba(255, 90, 70, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(s3.butonX, s3.butonY, r * 3.4, 0, Math.PI * 2); ctx.fill();
  }
  const grad = ctx.createRadialGradient(s3.butonX - r * 0.3, s3.butonY - r * 0.3, r * 0.1, s3.butonX, s3.butonY, r);
  grad.addColorStop(0, lum > 0.3 ? '#ffd9c4' : (rosuAlarma ? '#ff6a5a' : '#e5533f'));
  grad.addColorStop(1, lum > 0.3 ? '#e03418' : (rosuAlarma ? '#c02818' : '#a52818'));
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(s3.butonX, s3.butonY, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#7a1a10'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = `rgba(255, 255, 255, ${0.55 + lum * 0.4})`;
  ctx.beginPath(); ctx.ellipse(s3.butonX - r * 0.34, s3.butonY - r * 0.36, r * 0.26, r * 0.16, -0.7, 0, Math.PI * 2); ctx.fill();

  // ochi furioși după 1 minut de inactivitate
  if (s3.nivelInactiv >= 2) {
    for (const s of [-1, 1]) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(s3.butonX + s * r * 0.4, s3.butonY - r * 1.6, r * 0.35, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(s3.butonX + s * r * 0.4, s3.butonY - r * 1.55, r * 0.16, 0, Math.PI * 2); ctx.fill();
    }
  }
  // săgeată neon uriașă după 2 minute
  if (s3.nivelInactiv >= 3) {
    ctx.strokeStyle = `rgba(0,255,180,${0.6 + 0.4 * Math.sin(acum * 0.01)})`;
    ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(s3.butonX, s3.butonY - r * 6); ctx.lineTo(s3.butonX, s3.butonY - r * 2.4);
    ctx.moveTo(s3.butonX - r * 0.9, s3.butonY - r * 3.4); ctx.lineTo(s3.butonX, s3.butonY - r * 2.2);
    ctx.lineTo(s3.butonX + r * 0.9, s3.butonY - r * 3.4);
    ctx.stroke();
  }
  // butonul nu scrie nimic pe el: sensul lui vine din bilețele, nu dintr-o etichetă
}

// ---- desen principal Scena 3 ----
function deseneazaScena3(t, acum) {
  actualizeazaMuzeu(acum);
  actualizeazaGradina();
  deseneazaFundal3();
  deseneazaGradina(1, 0, 0.82);      // grădina din spatele clădirii

  if (s3.faza === 'intro') {
    const p = Math.min((acum - s3.t0) / 3200, 1);
    // elefantul se estompează, muzeul apare
    if (p < 0.7) { deseneazaElefantul(t, 1 - p / 0.7); }
    deseneazaMuzeu(Math.max(0, (p - 0.3) / 0.7));
    // plicul zboară de la elefant spre centru
    const px = intre(elefant.x, W * 0.5, p), py = intre(picioareElefant() - 60, H * 0.5, p);
    deseneazaGradina(1, 0.82, 1.01);
    deseneazaPlic(px, py, 0.7 + 0.3 * p, Math.min(1, p * 2));
    return;
  }

  deseneazaMuzeu(1);
  deseneazaGradina(1, 0.82, 1.01);   // grădina din față, în jurul intrării

  if (s3.faza === 'plic') {
    const puls = 1 + 0.05 * Math.sin(acum * 0.005);
    deseneazaPlic(s3.plicX, s3.plicY, puls);
    /* Vorba stă deasupra custodelui, nu sub plic: acolo se uită ochiul când
       intră în scenă, și de acolo n-are ce să acopere. */
    textIncadrat('Ai primit un plic. Deschide-l.', W * 0.5, H * 0.1, W * 0.7, ecran(26),
                 scrisGeorgia(20, 'bold'), CREM_HARTIE);
  }
  else if (s3.faza === 'scrisoare') {
    // scrisoarea oficială
    const textNotificare = 'Stimate jucător, prin prezenta vă notificăm că este de ' +
      'datoria dumneavoastră legală să trageți custodele de cercel.';
    /* Foaia se croiește **după scris**, nu invers. Avea o înălțime fixă, iar de
       când i-a plecat semnătura de la subsol îi rămânea o jumătate de pagină
       goală — iar o hârtie oficială cu jumătate de pagină albă arată a formular
       neterminat, nu a notificare.

       Se măsoară deci întâi câte rânduri iese textul la lățimea dată, și abia pe
       urmă se taie hârtia: titlu, text, și marginile de jur împrejur. */
    const w = Math.min(W * 0.7, ecran(520));
    const latScris = w - ecran(60);
    const marimeText = Math.max(9, Math.round(ecran(19)));
    ctx.font = scrisGeorgia(19);
    const randuri = randuriIncapute(ctx, textNotificare, latScris);
    const susText = ecran(52);
    const h = Math.min(H * 0.62, susText + randuri.length * ecran(28) + ecran(34));
    const x = W * 0.5, y = H * 0.46;

    ctx.save(); ctx.translate(x, y);
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#f7f2e6'; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#b23a48'; ctx.font = scrisGeorgia(20, 'bold'); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('NOTIFICARE OFICIALĂ', 0, -h / 2 + ecran(20));
    textIncadrat(textNotificare, 0, -h / 2 + susText, latScris, ecran(28),
                 scrisGeorgia(19), '#2b2b2b');
    ctx.restore();
    textIncadrat('(atinge scrisoarea)', W * 0.5, y + h / 2 + ecran(16), W * 0.5, ecran(20), scrisGeorgia(15), '#666');
  }
  else if (s3.faza === 'manual') {
    deseneazaManual(s3.manualDeschidere);
    deseneazaButon(acum);
  }
  else if (s3.faza === 'sonerie' || s3.faza === 'nuMaApasa') {
    deseneazaButon(acum);
    if (s3.faza === 'sonerie' && !s3.bilet) {
      /* Pe frunziș, litera singură se pierde. Avea o umbră estompată, cerută de
         trei ori la fiecare cadru — cât toată grădina la un loc. Acum stă pe o
         plăcuță de lumină, care costă o umplere. */
      const vorba = 'Trage-l de cercel.';
      const tx = W * 0.88, ty = H * 0.3;
      ctx.font = scrisGeorgia(19, 'bold');
      const latVorba = ctx.measureText(vorba).width;
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = CREM_HARTIE;
      dreptunghi(tx - latVorba / 2 - ecran(15), ty - ecran(9), latVorba + ecran(30), ecran(36), ecran(11));
      ctx.restore();
      textIncadrat(vorba, tx, ty, W * 0.24, ecran(22), scrisGeorgia(19, 'bold'), '#22301c');
    }
    if (s3.faza === 'nuMaApasa' && s3.butonFuge) {
      textIncadrat('Prinde-l și apasă-l!', W * 0.5, geomMuzeu().top - ecran(10), W * 0.5, ecran(20), scrisGeorgia(18, 'bold'), '#b23a48');
    }
  }
  else if (s3.faza === 'aburi') {
    const p = Math.min((acum - s3.t0) / 2500, 1);
    ctx.fillStyle = `rgba(255,255,255,${p})`; ctx.fillRect(0, 0, W, H);
    if (p > 0.7) {
      ctx.fillStyle = '#555'; ctx.font = scrisGeorgia(26, 'bold'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      textIncadrat('Ai fost înghițit de viu de propria curiozitate.', W * 0.5, H * 0.45, W * 0.7, ecran(34), scrisGeorgia(26, 'bold'), '#555');
      textIncadrat('(atinge pentru a relua)', W * 0.5, H * 0.6, W * 0.5, ecran(22), scrisGeorgia(16), '#999');
    }
    return;
  }
  else if (s3.faza === 'pace') {
    const p = Math.min((acum - s3.t0) / 2000, 1);
    // butonul devine floare
    const x = s3.butonBaza.x, y = s3.butonBaza.y;
    ctx.save(); ctx.translate(x, y);
    ctx.strokeStyle = '#4caf50'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 50 * p); ctx.stroke();
    ctx.fillStyle = '#e57ea8';
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 16 * p, Math.sin(a) * 16 * p, 11 * p, 7 * p, a, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#f6c945'; ctx.beginPath(); ctx.arc(0, 0, 9 * p, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    /* Cui n-a atins nimic i se poate spune că a câștigat prin ignoranță. Cui a
       încercat de douăzeci de ori și n-a izbutit, nu — ar fi o minciună și o
       răutate. Custodele știe diferența. */
    textIncadrat(s3.incercari > 0
      ? 'Ai încercat până s-a făcut floare. Ai câștigat răbdarea, care e mai rară.'
      : 'Felicitări, ai spart bucla prin ignoranță. Ai câștigat iluminarea spirituală.',
      W * 0.5, H * 0.2, W * 0.7, ecran(30), scrisGeorgia(22, 'bold'), '#456');
    return;
  }
  /* Faza 'usaDeschisa' nu mai desenează nimic aici: haina se desface singură,
     iar buzunarele-galerii vin odată cu ea. Descrierea scrisă a dispărut —
     se vede cu ochii ce se întâmplă, nu mai trebuie povestit. */

  deseneazaDiploma();
  deseneazaBilet();
}

// ---- input Scena 3 ----
function click3(acum) {
  const x = cursor.x, y = cursor.y;
  if (s3.faza === 'intro') { faza3('plic'); actiune3(acum); return; }
  if (s3.faza === 'plic') {
    /* Locul de apăsat se socotește din ecran, nu în pixeli ficși. Șaptezeci de
       pixeli erau o fâșie subțire pe un ecran mare: apăsai plicul unde îl
       vedeai, sub mijloc, și nu se întâmpla nimic. */
    if (Math.abs(x - s3.plicX) < W * 0.16 && Math.abs(y - s3.plicY) < H * 0.16) {
      faza3('scrisoare'); actiune3(acum); if (audio) sunetHartie();
    }
    return;
  }
  if (s3.faza === 'scrisoare') { faza3('sonerie'); actiune3(acum); if (audio) sunetHartie(); return; }
  if (s3.faza === 'sonerie') {
    if (peButon(x, y)) { actiune3(acum); s3.stralucire = 1; if (audio) sunetSonerie(); faza3('manual'); s3.manualPagina = 1; s3.manualDeschidere = 0; }
    else rateazaCercelul(acum);
    return;
  }
  if (s3.faza === 'manual') {
    actiune3(acum);
    if (s3.manualPagina < 369) { s3.manualPagina = Math.min(369, s3.manualPagina + 30 + Math.floor(Math.random() * 18)); s3.articol++; if (audio) sunetHartie(); }
    else if (peButon(x, y)) { s3.stralucire = 1; faza3('nuMaApasa'); s3.presari = 0; s3.refuzArmat = false; s3.bilet = null; if (audio) sunetEroare(); aratBilet('NU MĂ APĂSA!'); }
    else rateazaCercelul(acum);
    return;
  }
  if (s3.faza === 'nuMaApasa') {
    if (s3.butonFuge) {
      if (peButon(x, y)) { actiune3(acum); s3.stralucire = 1; s3.butonFuge = false; s3.diploma = null; aratBilet('Bine, mă predau. Ai câștigat spațiul gol.'); faza3('usaDeschisa'); s3.usa = 0.02; if (audio) sunetUsa(); }
      else rateazaCercelul(acum);
      return;
    }
    if (peButon(x, y)) {
      if (s3.refuzArmat) { s3.butonFuge = true; s3.stralucire = 1; s3.diploma = null; actiune3(acum); if (audio) sunetEroare(); return; }
      actiune3(acum); s3.stralucire = 1; s3.presari++;
      if (s3.presari >= 50) { faza3('aburi'); if (audio) sunetAburi(); return; }
      if (audio) sunetEroare();
      const mesaje = ['Știam eu că nu te poți abține. Apasă-mă iar.', 'Serios? Încă o dată?', 'Nu spune că nu te-am avertizat.', 'Ai o mică problemă cu autocontrolul.'];
      aratBilet(mesaje[s3.presari % mesaje.length]);
      return;
    }
    rateazaCercelul(acum);
    return;
  }
  if (s3.faza === 'usaDeschisa' && s3.usa >= 0.9) {
    const b = geomBuzunar(geomMuzeu());
    if (x > b.x && x < b.x + b.w && y > b.y - b.h * 0.1 && y < b.y + b.h) {
      intraInGalerie(acum);
      return;
    }
    actiune3(acum);
    return;
  }
  if (s3.faza === 'aburi') { intrareScena3(acum); return; }   // relansează scena
}


/* Când pânza își schimbă mărimea — fie că tragi de fereastră, fie că a coborât
   o treaptă de calitate — socotelile scenei rămân scrise în măsura veche.
   Cercelul e cazul cel mai vizibil: baza lui e ținută minte în pixeli, iar
   într-o pânză micșorată acei pixeli cad undeva în dreapta, dincolo de ureche.
   Lănțișorul, care se trage de la ureche până la el, se face atunci lung cât
   toată grădina — iar cercelul, cu raza lui de dinainte, se face mare cât o
   roșie. Aici punem totul înapoi la locul lui, în noua măsură. */
laRedimensionare.push(function (kx, ky) {
  if (stare !== 'muzeu') return;
  const g = geomMuzeu();
  const bazaNoua = s3.cercelInPalma
    ? { x: g.cx - g.capR * 1.05, y: g.capY + g.capR * 2.05 }
    : { x: g.cx + g.urecheX + g.urecheRX * 0.15, y: g.lobUreche + g.capR * 0.3 };

  if (s3.butonFuge) {
    // scăpat din ureche, umblă de capul lui: îl mutăm proporțional
    s3.butonX *= kx; s3.butonY *= ky;
  } else {
    // atârnă în lănțișor: păstrăm cât e tras față de bază
    const dx = (s3.butonX - s3.butonBaza.x) * kx;
    const dy = (s3.butonY - s3.butonBaza.y) * ky;
    s3.butonX = bazaNoua.x + dx; s3.butonY = bazaNoua.y + dy;
  }
  s3.butonBaza = bazaNoua;
  s3.butonR = g.capR * (s3.cercelInPalma ? 0.3 : 0.17);

  s3.plicX *= kx; s3.plicY *= ky;
  if (s3.bilet) {
    const b = s3.bilet;
    b.x *= kx; b.xRost *= kx; b.y *= ky; b.rest *= ky;
    b.w *= kx; b.h *= ky;
  }
  if (s3.diploma) {
    const d = s3.diploma;
    d.x *= kx; d.y *= ky; d.w *= kx; d.h *= kx;
  }
});
