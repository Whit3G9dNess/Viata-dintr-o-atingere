/* ============================================================================
   SCENA A ZECEA — SALA COLAJULUI: MEMORIA OBIECTELOR

   Tehnică mixtă. Dada și Arte Povera sub o umbrelă steampunk: o încăpere aspră,
   retro-industrială, cu pereții acoperiți în întregime de un asamblaj haotic,
   stratificat, făcut din materiale brute — ziar interbelic, carton ondulat,
   sfoară de cânepă, nasturi de os și de lemn, pânză de sac, clei de oase.

   **Sala asta e despre pipăit, iar pipăitul nu se poate desena.** Aspru, uscat,
   scârțâit și înfundat arată toate la fel pe un ecran. De-aia aici, singura dată
   în toată jucăria, sunetul nu îmbracă scena: el e scena. Fiecare material are
   glasul lui, iar mâna care se plimbă pe perete e singura care le poate deosebi.

   Și de-aia se intră cu ochii închiși: „Închide ochii și simte texturile."
   Sala se stinge într-o umbră sepia, iar lumina rămâne numai în palma ta.
   ========================================================================== */

/* ---------- CULORILE ----------
   Paletă densă, opacă, pur analogică: nimic saturat, nimic rece, niciun alb
   adevărat. Albul cel mai deschis din sală e o hârtie îngălbenită de timp, și
   ăsta e tot rostul: într-o cameră fără alb curat, orice lucru pare vechi. */
const IUTA          = '#a08a5c';
const IUTA_UMBRA    = '#6f5e3a';
const CARTON        = '#b09068';
const CARTON_FATA   = '#c2a179';
const CARTON_MUCHIE = '#87683f';
const ZIAR          = '#e0d3b0';
const ZIAR_UMBRA    = '#c3b085';
const CERNEALA      = '#463c2c';
const SFOARA        = '#9c8455';
const SFOARA_UMBRA  = '#6d5a33';
const OS            = '#e6d9bb';
const LEMN          = '#7b5b34';
const CLEI          = '#c9a765';
const SEPIA         = '#33260f';
const OCRU_CALD     = '#d8a44e';

/* ---------- STAREA ---------- */
const s10 = {
  faza: 'intrare',    // intrare → explorare → desprindere → rupere → iesire
  t0: 0, ultimulCadru: 0,

  scris: null,        // textul bătut la mașină, literă cu literă
  intuneric: 0,       // cât s-a stins sala în umbră sepia
  piese: [],
  activate: 0,
  sfoaraInMana: -1,   // de care sfoară se trage acum
  clapa: 0,           // cât s-a desprins colțul de colaj
  clapaInMana: false,
  rupere: 0,
  fasii: [],
  crapaturi: [],      // cleiul crăpat, unde s-a tras
  ultimaIuta: 0,
  ultimulFosnet: 0
};

/* ---------- CE E PE PERETE ----------

   Așezarea e făcută de mână, nu la întâmplare. Un colaj dadaist e haotic, dar
   haosul lui e ales: bucățile se calcă una pe alta, niciuna nu stă dreaptă, și
   totuși ochiul are unde să se odihnească. Lăsată pe seama întâmplării, ieșea o
   grămadă de gunoi — care e altceva decât Junk Art, deși seamănă. */
const PIESE_PERETE = [
  // ziare interbelice
  { fel: 'ziar',    u: 0.115, v: 0.215, w: 0.225, h: 0.290, unghi: -0.13, sam: 11 },
  { fel: 'ziar',    u: 0.640, v: 0.150, w: 0.205, h: 0.255, unghi:  0.16, sam: 23 },
  { fel: 'ziar',    u: 0.400, v: 0.720, w: 0.245, h: 0.230, unghi: -0.07, sam: 37 },
  // carton ondulat
  { fel: 'carton',  u: 0.320, v: 0.180, w: 0.255, h: 0.310, unghi:  0.08, sam: 51 },
  { fel: 'carton',  u: 0.845, v: 0.480, w: 0.235, h: 0.350, unghi: -0.10, sam: 67 },
  { fel: 'carton',  u: 0.130, v: 0.680, w: 0.230, h: 0.290, unghi:  0.12, sam: 83 },
  // sfori de cânepă, întinse de sus până jos
  { fel: 'sfoara',  u: 0.245, v: 0.5, w: 0.0130, h: 1, unghi: 0, sam: 97 },
  { fel: 'sfoara',  u: 0.545, v: 0.5, w: 0.0155, h: 1, unghi: 0, sam: 109 },
  { fel: 'sfoara',  u: 0.735, v: 0.5, w: 0.0115, h: 1, unghi: 0, sam: 127 },
  // nasturi de os și de lemn
  { fel: 'nasturi', u: 0.475, v: 0.395, w: 0.125, h: 0.125, unghi: 0, sam: 139 },
  { fel: 'nasturi', u: 0.665, v: 0.760, w: 0.115, h: 0.115, unghi: 0, sam: 151 },
  { fel: 'nasturi', u: 0.905, v: 0.170, w: 0.105, h: 0.105, unghi: 0, sam: 167 }
];

/* Straturile de dedesubt: bucăți cu care nu ai ce face, lipite acolo înainte de
   celelalte. N-au niciun rol în joc — și tocmai în asta stă rostul lor.

   Cu numai douăsprezece bucăți pe perete, fiecare lucru pe care îl vezi e un
   lucru de făcut, iar peretele se citește ca o listă de butoane. Un asamblaj
   stratificat are **mai mult decât poți atinge**: asta îl face vechi, și asta te
   face să-l cercetezi cu mâna în loc să-l bifezi cu ochiul. */
const FUNDAL_COLAJ = [
  { fel: 'carton', u: 0.075, v: 0.400, w: 0.230, h: 0.330, unghi:  0.22, sam: 211 },
  { fel: 'ziar',   u: 0.255, v: 0.470, w: 0.190, h: 0.240, unghi: -0.26, sam: 223 },
  { fel: 'carton', u: 0.520, v: 0.290, w: 0.290, h: 0.240, unghi: -0.05, sam: 227 },
  { fel: 'ziar',   u: 0.790, v: 0.760, w: 0.230, h: 0.250, unghi:  0.19, sam: 229 },
  { fel: 'carton', u: 0.620, v: 0.560, w: 0.250, h: 0.300, unghi:  0.14, sam: 233 },
  { fel: 'ziar',   u: 0.930, v: 0.360, w: 0.180, h: 0.290, unghi: -0.20, sam: 239 },
  { fel: 'carton', u: 0.200, v: 0.060, w: 0.260, h: 0.200, unghi: -0.16, sam: 241 },
  { fel: 'ziar',   u: 0.560, v: 0.940, w: 0.210, h: 0.200, unghi:  0.09, sam: 251 },
  { fel: 'carton', u: 0.040, v: 0.930, w: 0.230, h: 0.220, unghi: -0.12, sam: 257 }
];

/* Dârele de clei dintre bucăți. Nu leagă nimic în cod — cleiul nu ține piesele
   la locul lor, ele stau oricum acolo. Îl vezi ca să crezi că le ține, iar la
   sfârșit crapă ca să crezi că le-a ținut. */
const DARE_CLEI = [
  [0.22, 0.33, 0.33, 0.28],
  [0.44, 0.27, 0.60, 0.24],
  [0.36, 0.52, 0.47, 0.44],
  [0.62, 0.60, 0.74, 0.68],
  [0.20, 0.55, 0.28, 0.63],
  [0.78, 0.30, 0.86, 0.38],
  [0.50, 0.74, 0.62, 0.70]
];

function pregatestePiesele() {
  s10.piese = PIESE_PERETE.map(function (p, i) {
    return {
      i: i, fel: p.fel, u: p.u, v: p.v, w: p.w, h: p.h,
      unghi: p.unghi, sam: p.sam,
      activat: false,
      zvac: 0,          // cât de proaspătă e atingerea, 1 → 0
      incretit: 0,      // numai la ziar: cât s-a mototolit
      arc: 0,           // numai la sfoară: cât e trasă acum
      arcTinta: 0       // și unde rămâne după ce i-ai dat drumul
    };
  });
  s10.activate = 0;
}

function geomSala10() {
  return { S: Math.min(W, H) };
}

/* Dreptunghiul unei piese, în pixeli. */
function cutiaPiesei(p) {
  return { cx: p.u * W, cy: p.v * H, w: p.w * W, h: p.h * H };
}

/* Ce piesă e sub deget. Sforile au o socoteală a lor: sunt subțiri și lungi, iar
   o cutie în jurul lor ar acoperi o coloană întreagă de perete. */
function piesaDeSub(x, y) {
  /* Întâi sforile: ele stau deasupra tuturor — dar numai câtă vreme mai au ceva
     de dat. O sfoară deja încordată rămâne arcuită peste perete și poate ajunge
     fix peste un pâlc de nasturi; câtă vreme continua să prindă atingerile, acele
     nasturi nu se mai puteau porni niciodată și sala rămânea de netrecut. Se
     vedea numai la joc, și numai dacă trăgeai sforile înainte de nasturi.

     O manetă deja trasă nu mai cere nimic de la mână — deci nici n-are de ce să
     i-o ia. */
  for (const p of s10.piese) {
    if (p.fel !== 'sfoara' || p.activat) continue;
    const lat = Math.max(W * 0.02, p.w * W * 1.6);
    if (Math.abs(x - liniaSforii(p, y)) < lat) return p;
  }
  // pe urmă restul, de la cea mai de sus spre cea de dedesubt
  for (let k = s10.piese.length - 1; k >= 0; k--) {
    const p = s10.piese[k];
    if (p.fel === 'sfoara') continue;
    const c = cutiaPiesei(p);
    const dx = x - c.cx, dy = y - c.cy;
    const cs = Math.cos(-p.unghi), sn = Math.sin(-p.unghi);
    const rx = dx * cs - dy * sn, ry = dx * sn + dy * cs;
    if (Math.abs(rx) < c.w / 2 && Math.abs(ry) < c.h / 2) return p;
  }
  return null;
}

/* Unde trece sfoara la înălțimea `y`: dreaptă când e slobodă, arcuită sub mâna
   care trage. Arcul e o parabolă cu vârful la mijloc — o funie prinsă la ambele
   capete nu se îndoaie într-un colț, se umflă. */
function liniaSforii(p, y) {
  const q = Math.max(0, Math.min(1, y / H));
  return p.u * W + p.arc * W * Math.sin(Math.PI * q);
}

/* ---------- TEXTURILE ---------- */

/* Pânza de sac: fundalul tuturor. Se face din fire, nu din zgomot — un zgomot
   fin arată a nisip, iar iuta e țesută: fire groase, inegale, care se văd unul
   câte unul. Firele orizontale sunt mai apăsate decât cele verticale, ca la
   orice pânză bătută pe război. */
function tesePanzaDeSac(c) {
  c.fillStyle = IUTA;
  c.fillRect(0, 0, W, H);

  const pas = Math.max(4, Math.round(Math.min(W, H) * 0.011));

  // bătătura: firele orizontale, care se văd cel mai bine pe orice sac
  c.lineWidth = pas * 0.58;
  for (let y = 0; y < H + pas; y += pas) {
    const z = samanta(2100 + y * 0.7);
    c.globalAlpha = 0.16 + z * 0.22;
    c.strokeStyle = z > 0.5 ? IUTA_UMBRA : '#bda06d';
    c.beginPath();
    c.moveTo(0, y + (z - 0.5) * pas * 0.5);
    c.lineTo(W, y + (samanta(2200 + y * 1.3) - 0.5) * pas * 0.5);
    c.stroke();
  }

  /* Urzeala: fire verticale, dar **tăiate în cusături scurte**, nu trase de sus
     până jos. E chiar țesătura: firul vertical trece pe deasupra câtorva fire
     orizontale, pe urmă pe dedesubt, și se pierde.

     Câtă vreme le-am tras întregi, cu o transparență a lor pe toată înălțimea,
     ieșeau dungi lungi peste dungi lungi — adică stofă scoțiană, nu pânză de
     sac. Un carou se vede de la trei metri; o țesătură nu se vede decât de
     aproape, și tocmai de-aia trebuie pipăită. */
  c.lineWidth = pas * 0.42;
  const salt = pas * 3;
  for (let x = 0; x < W + pas; x += pas) {
    for (let y = -salt; y < H + salt; y += salt) {
      const z = samanta(2300 + x * 0.9 + y * 0.31);
      if (z < 0.42) continue;                       // firul trece pe dedesubt
      c.globalAlpha = 0.10 + z * 0.16;
      c.strokeStyle = z > 0.7 ? IUTA_UMBRA : '#c6ac78';
      const dx = (samanta(2400 + x * 1.7 + y * 0.13) - 0.5) * pas * 0.5;
      c.beginPath();
      c.moveTo(x + dx, y);
      c.lineTo(x + dx, y + salt * (0.55 + z * 0.4));
      c.stroke();
    }
  }

  // scamele care ies din țesătură
  c.globalAlpha = 1;
  for (let k = 0; k < 900; k++) {
    const a = samanta(2500 + k * 3.1), b = samanta(2560 + k * 7.7);
    const e = samanta(2620 + k * 5.3);
    c.globalAlpha = 0.10 + e * 0.22;
    c.strokeStyle = e > 0.5 ? '#d8c493' : '#5d4d2c';
    c.lineWidth = Math.max(0.6, pas * 0.12);
    const x = a * W, y = b * H, l = pas * (0.8 + e * 1.6), un = e * 6.28;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(un) * l, y + Math.sin(un) * l);
    c.stroke();
  }
  c.globalAlpha = 1;
}

/* Marginea ruptă a unei bucăți de hârtie sau de carton: o linie care șovăie.
   E singura deosebire dintre „rupt" și „tăiat", și se vede de la trei metri. */
function conturRupt(c, w, h, sam, cat) {
  const zim = cat === undefined ? 0.035 : cat;
  c.beginPath();
  const laturi = [[-w / 2, -h / 2, w / 2, -h / 2], [w / 2, -h / 2, w / 2, h / 2],
                  [w / 2, h / 2, -w / 2, h / 2], [-w / 2, h / 2, -w / 2, -h / 2]];
  let intai = true;
  for (let l = 0; l < 4; l++) {
    const [x0, y0, x1, y1] = laturi[l];
    const nx = -(y1 - y0), ny = x1 - x0;
    const lung = Math.hypot(nx, ny) || 1;
    for (let k = 0; k <= 9; k++) {
      const f = k / 9;
      const z = samanta(sam * 13.7 + l * 29 + k * 3.1) - 0.5;
      const px = intre(x0, x1, f) + (nx / lung) * z * Math.min(w, h) * zim * 2;
      const py = intre(y0, y1, f) + (ny / lung) * z * Math.min(w, h) * zim * 2;
      if (intai) { c.moveTo(px, py); intai = false; } else c.lineTo(px, py);
    }
  }
  c.closePath();
}

/* O bucată de ziar interbelic. Nu scrie nimic pe ea: la mărimea asta, textul de
   ziar **este** o grilă de dungi, iar litere adevărate desenate mic se fac o
   pastă cenușie mai puțin credibilă decât dungile. Ce se citește de la distanță
   e altceva: titlul gros, coloanele, și albul dintre ele. */
function bucataDeZiar(c, p, w, h) {
  c.save();
  conturRupt(c, w, h, p.sam);
  c.clip();

  const foaie = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  foaie.addColorStop(0, ZIAR);
  foaie.addColorStop(0.6, '#d9caa4');
  foaie.addColorStop(1, ZIAR_UMBRA);
  c.fillStyle = foaie;
  c.fillRect(-w / 2, -h / 2, w, h);

  // pete de vreme, mai dese pe margini
  for (let k = 0; k < 26; k++) {
    const a = samanta(p.sam * 7.1 + k * 3.7), b = samanta(p.sam * 11.3 + k * 5.9);
    c.globalAlpha = 0.05 + a * 0.10;
    c.fillStyle = '#9c8752';
    c.beginPath();
    c.ellipse(-w / 2 + a * w, -h / 2 + b * h, w * (0.02 + a * 0.07),
              h * (0.02 + b * 0.05), a * 3, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;

  // titlul, gros și scurt
  c.fillStyle = CERNEALA;
  c.fillRect(-w * 0.40, -h * 0.40, w * 0.72, h * 0.055);
  c.globalAlpha = 0.75;
  c.fillRect(-w * 0.40, -h * 0.30, w * 0.44, h * 0.028);

  // coloanele: rânduri de lungimi inegale, cu spații între paragrafe
  const coloane = 2 + (p.sam % 2);
  const latC = (w * 0.80) / coloane;
  for (let col = 0; col < coloane; col++) {
    let y = -h * 0.21;
    while (y < h * 0.42) {
      const z = samanta(p.sam * 3.3 + col * 41 + y * 0.7);
      if (z > 0.93) { y += h * 0.035; continue; }        // spațiu între paragrafe
      c.globalAlpha = 0.42 + z * 0.25;
      c.fillRect(-w * 0.40 + col * latC, y,
                 latC * (0.62 + z * 0.30), h * 0.011);
      y += h * 0.028;
    }
  }
  c.globalAlpha = 1;
  c.restore();

  // umbra proprie, ca să se vadă că stă **peste** pânză, nu în ea
  c.save();
  c.globalAlpha = 0.30;
  c.strokeStyle = '#3f3218';
  c.lineWidth = Math.max(1, Math.min(w, h) * 0.018);
  conturRupt(c, w, h, p.sam);
  c.stroke();
  c.restore();
}

/* Cartonul ondulat. Ce-l face carton nu e culoarea maro, ci **muchia**: dungile
   ondulei văzute din profil. Fără ea, e o bucată de hârtie groasă. */
function bucataDeCarton(c, p, w, h) {
  c.save();
  conturRupt(c, w, h, p.sam, 0.022);
  c.clip();

  const fata = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  fata.addColorStop(0, CARTON_FATA);
  fata.addColorStop(0.55, CARTON);
  fata.addColorStop(1, CARTON_MUCHIE);
  c.fillStyle = fata;
  c.fillRect(-w / 2, -h / 2, w, h);

  // fibrele lungi din pastă
  for (let k = 0; k < 60; k++) {
    const a = samanta(p.sam * 5.9 + k * 3.1), b = samanta(p.sam * 9.7 + k * 7.3);
    c.globalAlpha = 0.10 + a * 0.14;
    c.strokeStyle = a > 0.5 ? '#8d6f45' : '#cdae86';
    c.lineWidth = Math.max(0.6, Math.min(w, h) * 0.006);
    c.beginPath();
    c.moveTo(-w / 2 + a * w, -h / 2 + b * h);
    c.lineTo(-w / 2 + a * w + w * (0.06 + b * 0.14), -h / 2 + b * h + h * (b - 0.5) * 0.08);
    c.stroke();
  }

  /* Un colț decojit, cu unda la vedere. E amănuntul care spune „carton" într-o
     clipă: sub fața netedă e un gard de valuri. */
  c.globalAlpha = 1;

  /* Unda, la vedere pe toată muchia de jos. Întâi o pusesem numai într-un colț
     decojit, și cartonul rămânea o bucată de hârtie groasă văruită în maro. Ce
     spune „carton" într-o clipă nu e culoarea, e **gardul de valuri** dintre
     cele două fețe: se vede numai din profil, deci trebuie să existe o muchie. */
  const grosU = Math.min(w, h) * 0.085;
  c.fillStyle = '#9d8058';
  c.fillRect(-w / 2, h / 2 - grosU, w, grosU);
  c.strokeStyle = CARTON_MUCHIE;
  c.lineWidth = Math.max(1, Math.min(w, h) * 0.011);
  const pasU = Math.max(3, Math.min(w, h) * 0.048);
  for (let x = -w / 2; x < w / 2; x += pasU) {
    c.beginPath();
    c.moveTo(x, h / 2);
    c.quadraticCurveTo(x + pasU * 0.5, h / 2 - grosU * 1.5, x + pasU, h / 2);
    c.stroke();
  }
  c.globalAlpha = 0.45;
  c.strokeStyle = '#e2c496';
  c.lineWidth = Math.max(0.8, Math.min(w, h) * 0.007);
  for (let x = -w / 2; x < w / 2; x += pasU) {
    c.beginPath();
    c.moveTo(x + pasU * 0.28, h / 2 - grosU * 0.30);
    c.quadraticCurveTo(x + pasU * 0.5, h / 2 - grosU * 1.1,
                       x + pasU * 0.72, h / 2 - grosU * 0.30);
    c.stroke();
  }

  // și un colț decojit, unde fața de deasupra s-a dus și se vede unda întreagă
  c.globalAlpha = 1;
  const cw = w * 0.34, ch = h * 0.26;
  c.fillStyle = '#a3855d';
  c.beginPath();
  c.moveTo(w / 2 - cw, h / 2);
  c.lineTo(w / 2, h / 2 - ch);
  c.lineTo(w / 2, h / 2);
  c.closePath();
  c.fill();
  c.strokeStyle = CARTON_MUCHIE;
  c.lineWidth = Math.max(1, Math.min(w, h) * 0.012);
  for (let x = w / 2 - cw; x < w / 2; x += pasU) {
    const cat = (x - (w / 2 - cw)) / cw;
    c.beginPath();
    c.moveTo(x, h / 2);
    c.quadraticCurveTo(x + pasU * 0.5, h / 2 - ch * cat * 0.7,
                       x + pasU, h / 2 - ch * cat);
    c.stroke();
  }
  c.restore();

  // muchia de sus, groasă: cartonul are grosime, hârtia n-are
  c.save();
  c.globalAlpha = 0.55;
  c.fillStyle = CARTON_MUCHIE;
  c.fillRect(-w / 2, h / 2 - Math.min(w, h) * 0.02, w, Math.min(w, h) * 0.02);
  c.globalAlpha = 0.35;
  c.strokeStyle = '#3f3218';
  c.lineWidth = Math.max(1, Math.min(w, h) * 0.016);
  conturRupt(c, w, h, p.sam, 0.022);
  c.stroke();
  c.restore();
}

/* Un pâlc de nasturi, cusuți grosolan. Unii de os (deschiși, cu patru găuri),
   alții de lemn (închiși, cu două). Ața trecută prin ei se vede — cusutul
   grosolan e chiar ce cere Arte Povera: se vede cum a fost făcut. */
function palcDeNasturi(c, p, w, h, luminat) {
  const cate = 5 + (p.sam % 3);
  for (let k = 0; k < cate; k++) {
    const a = samanta(p.sam * 3.7 + k * 5.3), b = samanta(p.sam * 8.9 + k * 3.1);
    const e = samanta(p.sam * 13.1 + k * 7.7);
    const x = (a - 0.5) * w * 0.9, y = (b - 0.5) * h * 0.9;
    const r = Math.min(w, h) * (0.15 + e * 0.13);
    const deOs = e > 0.45;

    // ața, întâi: trece pe sub nasture
    c.strokeStyle = '#6b5a35';
    c.globalAlpha = 0.7;
    c.lineWidth = Math.max(0.8, r * 0.14);
    c.beginPath();
    c.moveTo(x - r * 2.2, y + r * (a - 0.5) * 2);
    c.lineTo(x + r * 2.0, y + r * (b - 0.5) * 2);
    c.stroke();

    c.globalAlpha = 1;
    const corp = c.createRadialGradient(x - r * 0.3, y - r * 0.35, 0, x, y, r);
    corp.addColorStop(0, deOs ? '#f2e9d2' : '#9a744a');
    corp.addColorStop(0.7, deOs ? OS : LEMN);
    corp.addColorStop(1, deOs ? '#c4b58f' : '#5b4324');
    c.fillStyle = corp;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = deOs ? '#b0a075' : '#4a3519';
    c.lineWidth = Math.max(0.7, r * 0.09);
    c.stroke();

    // adâncitura din mijloc și găurile
    c.globalAlpha = 0.35;
    c.beginPath();
    c.arc(x, y, r * 0.66, 0, Math.PI * 2);
    c.stroke();
    c.globalAlpha = 1;
    c.fillStyle = deOs ? '#7d7050' : '#2e2110';
    const gauri = deOs ? 4 : 2;
    for (let q = 0; q < gauri; q++) {
      const un = (q / gauri) * Math.PI * 2 + (gauri === 2 ? 0 : Math.PI / 4);
      c.beginPath();
      c.arc(x + Math.cos(un) * r * 0.3, y + Math.sin(un) * r * 0.3, r * 0.12, 0, Math.PI * 2);
      c.fill();
    }
    // ața peste el, prin găuri
    c.strokeStyle = '#7a6840';
    c.lineWidth = Math.max(0.8, r * 0.13);
    c.beginPath();
    if (gauri === 2) {
      c.moveTo(x - r * 0.3, y); c.lineTo(x + r * 0.3, y);
    } else {
      c.moveTo(x - r * 0.21, y - r * 0.21); c.lineTo(x + r * 0.21, y + r * 0.21);
      c.moveTo(x + r * 0.21, y - r * 0.21); c.lineTo(x - r * 0.21, y + r * 0.21);
    }
    c.stroke();

    if (luminat) {
      c.save();
      c.globalAlpha = luminat * 0.8;
      c.fillStyle = OCRU_CALD;
      c.beginPath();
      c.arc(x, y, r * 0.34, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  }
  c.globalAlpha = 1;
}

/* Sfoara de cânepă. Trei fire răsucite: se face dintr-o singură linie groasă,
   peste care se pun hașuri oblice: fiecare hașură e o răsucire. O funie desenată
   ca o bară netedă rămâne o bară, oricâtă umbră i-ai pune. */
function franghia(c, p, luminat) {
  const gros = Math.max(3, p.w * W);
  const PASI = 30;
  const puncte = [];
  for (let k = 0; k <= PASI; k++) {
    const y = (k / PASI) * H;
    puncte.push([liniaSforii(p, y), y]);
  }
  const traseu = function () {
    c.beginPath();
    for (let k = 0; k < puncte.length; k++) {
      const [x, y] = puncte[k];
      if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
  };

  c.save();
  c.lineCap = 'round';

  /* Umbra pe perete: trei treceri tot mai late și tot mai stinse, lipite de
     funie. Întâi o făcusem dintr-o singură trecere groasă, mutată cu o grosime
     întreagă în lateral — și ieșea o bară dreaptă alături de funie, mai lată decât
     ea. De departe nu se mai vedeau trei sfori pe perete, ci trei scânduri.

     O umbră aruncată de un lucru subțire, luminat difuz, stă aproape de el și
     n-are muchie. Distanța spune cât de departe e obiectul de perete, iar sfoara
     e **lipită** de perete. */
  c.strokeStyle = '#241a08';
  for (let t = 3; t >= 1; t--) {
    c.globalAlpha = 0.12;
    c.lineWidth = gros * (0.9 + t * 0.42);
    c.save();
    c.translate(gros * 0.34, gros * 0.30);
    traseu();
    c.stroke();
    c.restore();
  }

  // corpul, cu muchiile bine întunecate: o funie e rotundă, deci se stinge repede
  c.globalAlpha = 1;
  const fir = c.createLinearGradient(p.u * W - gros / 2, 0, p.u * W + gros / 2, 0);
  fir.addColorStop(0, '#4e4022');
  fir.addColorStop(0.22, SFOARA_UMBRA);
  fir.addColorStop(0.48, '#b9a271');
  fir.addColorStop(0.72, SFOARA);
  fir.addColorStop(1, '#4e4022');
  c.strokeStyle = fir;
  c.lineWidth = gros;
  traseu();
  c.stroke();

  /* Răsucirea. Nu hașuri drepte de-a curmezișul — alea dau o scăriță — ci
     **șevroane**: fiecare urmă urcă pe o parte a funiei și coboară pe cealaltă,
     fiindcă firul se înfășoară în jurul ei și îi vezi numai jumătate.

     Și sunt dese: pasul răsucirii la o funie de cânepă e cam cât grosimea ei.
     La un pas mai mare ieșea un furtun de grădină. */
  /* Toate răsucirile se trag **dintr-o singură mișcare**, nu una câte una.

     Pasul răsucirii e cam cât grosimea funiei, deci pe o sfoară întinsă de sus
     până jos încap vreo cincizeci; înmulțit cu două treceri și cu trei sfori, sala
     ajunsese la patru sute de operații de desen pe cadru numai din șevroane — mai
     mult decât tot restul încăperii la un loc. Un `stroke` poate trage oricâte
     linii deodată dacă au aceeași culoare și aceeași grosime, iar aici au. */
  c.lineCap = 'butt';
  const pasR = gros * 0.95;
  c.globalAlpha = 0.55;
  c.strokeStyle = '#43371c';
  c.lineWidth = Math.max(0.8, gros * 0.16);
  c.beginPath();
  for (let y = -pasR; y < H + pasR; y += pasR) {
    const x = liniaSforii(p, y);
    c.moveTo(x - gros * 0.48, y + pasR * 0.62);
    c.quadraticCurveTo(x, y + pasR * 0.06, x + gros * 0.48, y - pasR * 0.58);
  }
  c.stroke();
  c.globalAlpha = 0.38;
  c.strokeStyle = '#e0c894';
  c.lineWidth = Math.max(0.6, gros * 0.11);
  c.beginPath();
  for (let y = -pasR; y < H + pasR; y += pasR) {
    const x = liniaSforii(p, y);
    c.moveTo(x - gros * 0.34, y + pasR * 0.76);
    c.quadraticCurveTo(x + gros * 0.06, y + pasR * 0.18, x + gros * 0.42, y - pasR * 0.36);
  }
  c.stroke();

  // scamele de cânepă care ies din răsucire
  c.lineCap = 'round';
  c.globalAlpha = 0.55;
  c.lineWidth = Math.max(0.5, gros * 0.13);
  c.strokeStyle = '#8d7746';
  c.beginPath();
  for (let k = 0; k < 26; k++) {
    const a = samanta(p.sam * 3.1 + k * 5.7), b = samanta(p.sam * 7.3 + k * 3.3);
    const y = a * H, x = liniaSforii(p, y);
    const lat = (b > 0.5 ? 1 : -1) * gros * (0.5 + b * 0.9);
    c.moveTo(x, y);
    c.lineTo(x + lat, y + (b - 0.5) * gros * 1.6);
  }
  c.stroke();

  if (luminat) {
    c.globalCompositeOperation = 'lighter';
    c.globalAlpha = luminat * 0.45;
    c.strokeStyle = OCRU_CALD;
    c.lineWidth = gros * 0.55;
    traseu();
    c.stroke();
  }
  c.restore();
}

/* Dârele de clei de oase: lucioase, chihlimbarii, cu o geană de lumină pe
   creastă. Cleiul uscat nu e mat — e singurul lucru care strălucește în toată
   sala asta mată, și de-aia se vede unde a fost lipit ceva. */
function daraDeClei(c, x0, y0, x1, y1, sam, crapat) {
  const gros = Math.min(W, H) * 0.014;
  const mx = (x0 + x1) / 2 + (samanta(sam) - 0.5) * W * 0.05;
  const my = (y0 + y1) / 2 + (samanta(sam * 1.7) - 0.5) * H * 0.05;

  c.save();
  c.lineCap = 'round';
  c.globalAlpha = 0.42;
  c.strokeStyle = CLEI;
  c.lineWidth = gros;
  c.beginPath();
  c.moveTo(x0, y0);
  c.quadraticCurveTo(mx, my, x1, y1);
  c.stroke();

  // geana de lumină de pe creastă
  c.globalAlpha = 0.55;
  c.strokeStyle = '#f0dfae';
  c.lineWidth = gros * 0.28;
  c.beginPath();
  c.moveTo(x0, y0 - gros * 0.22);
  c.quadraticCurveTo(mx, my - gros * 0.22, x1, y1 - gros * 0.22);
  c.stroke();

  if (crapat > 0) {
    /* Crăpăturile: linii scurte de-a curmezișul dârei, care se înmulțesc pe
       măsură ce se trage. Cleiul de oase nu se întinde — ori ține, ori crapă. */
    c.globalAlpha = Math.min(1, crapat);
    c.strokeStyle = '#4a3a1c';
    c.lineWidth = Math.max(0.8, gros * 0.16);
    const cate = Math.round(3 + crapat * 9);
    for (let k = 0; k < cate; k++) {
      const f = (k + 0.5) / cate;
      const px = (1 - f) * (1 - f) * x0 + 2 * (1 - f) * f * mx + f * f * x1;
      const py = (1 - f) * (1 - f) * y0 + 2 * (1 - f) * f * my + f * f * y1;
      const un = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2 + (samanta(sam + k * 3.1) - 0.5);
      c.beginPath();
      c.moveTo(px - Math.cos(un) * gros * 0.7, py - Math.sin(un) * gros * 0.7);
      c.lineTo(px + Math.cos(un) * gros * 0.7, py + Math.sin(un) * gros * 0.7);
      c.stroke();
    }
  }
  c.restore();
}

/* Relieful unei bucăți lipite: umbra pe care o aruncă pe ce e sub ea, și muchia
   ei luminată dinspre stânga sus.

   Asta e tot ce desparte un colaj de un afiș — și, la prima încercare, sala
   n-avea nici umbre, nici muchii, iar spoturile calde luminau o suprafață
   plată. Degeaba scrie „simte texturile" când nimic nu iese din perete: pe un
   ecran, **relief înseamnă o dungă de lumină lângă una de umbră**, nimic altceva.
   Restul — iuta, ondula, cusutul — sunt amănunte care confirmă ce a spus deja
   muchia. */
function umbraPiesei(c, p, w, h) {
  const d = Math.min(W, H) * 0.012;
  c.save();
  for (let t = 3; t >= 1; t--) {
    c.globalAlpha = 0.13;
    c.fillStyle = '#241a08';
    c.save();
    c.translate(d * t * 0.5, d * t * 0.6);
    conturRupt(c, w + d * (t - 1), h + d * (t - 1), p.sam,
               p.fel === 'carton' ? 0.022 : 0.035);
    c.fill();
    c.restore();
  }
  c.restore();
}

function muchiaPiesei(c, p, w, h) {
  const zim = p.fel === 'carton' ? 0.022 : 0.035;
  const d = Math.max(1, Math.min(W, H) * 0.004);
  c.save();
  conturRupt(c, w, h, p.sam, zim);
  c.clip();
  // geana de lumină pe muchia dinspre stânga sus
  c.globalAlpha = 0.55;
  c.strokeStyle = p.fel === 'ziar' ? '#fff6dd' : '#e6c896';
  c.lineWidth = d * 1.6;
  c.save();
  c.translate(d * 0.7, d * 0.8);
  conturRupt(c, w, h, p.sam, zim);
  c.stroke();
  c.restore();
  // și umbra pe muchia dinspre dreapta jos, înăuntru
  c.globalAlpha = 0.38;
  c.strokeStyle = '#3a2b12';
  c.lineWidth = d * 1.8;
  c.save();
  c.translate(-d * 0.8, -d * 0.9);
  conturRupt(c, w, h, p.sam, zim);
  c.stroke();
  c.restore();
  c.restore();
}

/* ---------- PERETELE, PICTAT O DATĂ ----------
   Asamblajul e static: se schimbă numai ce se întâmplă peste el. Deci se face o
   dată și se pune dintr-o mutare, ca laviul din sala acuarelei. */
const stampaPeretelui = { panza: null, latime: 0, inaltime: 0 };

function pregatestePeretele() {
  if (stampaPeretelui.panza && stampaPeretelui.latime === W &&
      stampaPeretelui.inaltime === H) {
    return stampaPeretelui.panza;
  }
  const p = panzaDeLucru(stampaPeretelui, W, H);
  const c = p.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.clearRect(0, 0, W, H);

  tesePanzaDeSac(c);

  // bucățile, în ordinea în care au fost lipite: întâi straturile de dedesubt
  const puneBucata = function (pi, stins) {
    const cut = cutiaPiesei(pi);
    /* Umbra se pune **în locul bucatii**, nu în colțul pânzei. Prima oară am uitat
       mutarea și toate douăzeci de umbre s-au stivuit una peste alta în originea
       pânzei: o pată neagră în stânga sus, și niciun relief nicăieri. */
    c.save();
    c.globalAlpha = stins;
    c.translate(cut.cx, cut.cy);
    c.rotate(pi.unghi);
    umbraPiesei(c, pi, cut.w, cut.h);
    c.restore();
    c.save();
    c.globalAlpha = stins;
    c.translate(cut.cx, cut.cy);
    c.rotate(pi.unghi);
    if (pi.fel === 'ziar') bucataDeZiar(c, pi, cut.w, cut.h);
    else if (pi.fel === 'carton') bucataDeCarton(c, pi, cut.w, cut.h);
    else if (pi.fel === 'nasturi') palcDeNasturi(c, pi, cut.w, cut.h, 0);
    if (pi.fel !== 'nasturi') muchiaPiesei(c, pi, cut.w, cut.h);
    c.restore();
  };

  /* Straturile vechi se pun mai stinse: au stat sub celelalte și sub praf. Fără
     stingerea asta, un colaj cu douăzeci de bucăți n-are adâncime, are numai
     înghesuială. */
  for (const pi of FUNDAL_COLAJ) puneBucata(pi, 0.72);
  for (const pi of s10.piese) {
    if (pi.fel === 'sfoara') continue;              // sforile se mișcă, stau deasupra
    puneBucata(pi, 1);
  }
  c.globalAlpha = 1;

  // cleiul peste tot, la urmă: el e ce s-a pus ultimul
  for (let k = 0; k < DARE_CLEI.length; k++) {
    const d = DARE_CLEI[k];
    daraDeClei(c, d[0] * W, d[1] * H, d[2] * W, d[3] * H, 300 + k * 17, 0);
  }

  stampaPeretelui.latime = W;
  stampaPeretelui.inaltime = H;
  return p;
}

/* ---------- LUMINA ----------

   Sala e stinsă într-o umbră sepia, iar lumina cade numai în pete calde: câteva
   fixe, pe materiale, și una care merge cu mâna ta.

   Pata din palmă e tot ce leagă textul de la intrare de joc: „închide ochii și
   simte texturile" n-ar însemna nimic într-o cameră luminată. Aici chiar nu vezi
   decât ce atingi. */
const SPOTURI = [
  { u: 0.20, v: 0.30, r: 0.26 },
  { u: 0.66, v: 0.24, r: 0.22 },
  { u: 0.45, v: 0.70, r: 0.24 },
  { u: 0.85, v: 0.52, r: 0.20 }
];

function pictezaLumina(c, acum) {
  const cat = s10.intuneric;
  if (cat <= 0.01) return;

  c.save();
  // umbra sepia peste tot
  c.globalAlpha = cat * 0.70;
  c.fillStyle = SEPIA;
  c.fillRect(0, 0, W, H);

  /* Petele de lumină se **adaugă** peste umbră, nu găuresc umbra. O gaură ar da
     un cerc cu margine; adunarea dă o pată care se stinge, adică lumină. */
  c.globalCompositeOperation = 'lighter';
  const S = Math.min(W, H);
  for (let k = 0; k < SPOTURI.length; k++) {
    const sp = SPOTURI[k];
    const bat = 0.88 + 0.12 * Math.sin(acum * 0.0009 + k * 1.7);
    const r = S * sp.r * bat;
    const g = c.createRadialGradient(sp.u * W, sp.v * H, 0, sp.u * W, sp.v * H, r);
    g.addColorStop(0, 'rgba(228, 176, 88, ' + (0.52 * cat).toFixed(3) + ')');
    g.addColorStop(0.42, 'rgba(186, 130, 54, ' + (0.20 * cat).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(120, 80, 30, 0)');
    c.fillStyle = g;
    c.fillRect(sp.u * W - r, sp.v * H - r, r * 2, r * 2);
  }

  // lumina din palmă
  if (cursor.x > -100) {
    const r = S * 0.26;
    const g = c.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, r);
    g.addColorStop(0, 'rgba(255, 214, 140, ' + (0.86 * cat).toFixed(3) + ')');
    g.addColorStop(0.30, 'rgba(216, 158, 74, ' + (0.34 * cat).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(140, 92, 34, 0)');
    c.fillStyle = g;
    c.fillRect(cursor.x - r, cursor.y - r, r * 2, r * 2);
  }
  c.restore();
}

/* ---------- CE SE VEDE PESTE PERETE ---------- */

/* Ziarul mototolit: cute care pornesc din mijloc. Nu se desenează hârtia din
   nou — se pun peste ea muchiile de lumină și de umbră ale cutelor, fiindcă o
   cută **este** o muchie de lumină lângă una de umbră, nimic altceva. */
function increteste(c, p, cut, cat) {
  const q = Math.min(1, cat);
  c.save();
  c.translate(cut.cx, cut.cy);
  c.rotate(p.unghi);
  const w = cut.w * (1 - q * 0.07), h = cut.h * (1 - q * 0.07);
  conturRupt(c, w, h, p.sam);
  c.clip();

  c.lineCap = 'round';
  for (let k = 0; k < 16; k++) {
    const a = samanta(p.sam * 17.3 + k * 3.1), b = samanta(p.sam * 5.9 + k * 7.7);
    const un = a * Math.PI * 2;
    const lung = Math.max(w, h) * (0.3 + b * 0.55);
    const x0 = (a - 0.5) * w * 0.4, y0 = (b - 0.5) * h * 0.4;
    const x1 = x0 + Math.cos(un) * lung, y1 = y0 + Math.sin(un) * lung;
    const gros = Math.max(1, Math.min(w, h) * 0.014);

    c.globalAlpha = q * (0.30 + b * 0.25);
    c.strokeStyle = '#fdf6dd';
    c.lineWidth = gros;
    c.beginPath();
    c.moveTo(x0, y0);
    c.quadraticCurveTo((x0 + x1) / 2 + (b - 0.5) * lung * 0.3,
                       (y0 + y1) / 2 + (a - 0.5) * lung * 0.3, x1, y1);
    c.stroke();

    c.globalAlpha = q * (0.26 + a * 0.22);
    c.strokeStyle = '#5a4a29';
    c.lineWidth = gros * 0.9;
    c.beginPath();
    c.moveTo(x0 + gros, y0 + gros);
    c.quadraticCurveTo((x0 + x1) / 2 + (b - 0.5) * lung * 0.3 + gros,
                       (y0 + y1) / 2 + (a - 0.5) * lung * 0.3 + gros,
                       x1 + gros, y1 + gros);
    c.stroke();
  }
  c.restore();
}

/* Lumina care răzbate pe la spatele unei piese pornite. Nu e o strălucire pusă
   peste ea — e un halou **în jurul** conturului, adică exact ce se vede când
   ceva luminează dindărăt: obiectul rămâne întunecat, marginea se aprinde. */
function luminaDinSpate(c, p, cut, cat) {
  if (cat <= 0.01) return;
  c.save();
  c.globalCompositeOperation = 'lighter';
  c.translate(cut.cx, cut.cy);
  c.rotate(p.unghi);
  const S = Math.min(W, H);
  for (let t = 3; t >= 1; t--) {
    c.globalAlpha = cat * 0.16 / t;
    c.strokeStyle = OCRU_CALD;
    c.lineWidth = S * 0.012 * t;
    conturRupt(c, cut.w + S * 0.006 * t, cut.h + S * 0.006 * t, p.sam);
    c.stroke();
  }
  c.restore();
}

/* ---------- TEXTUL BĂTUT LA MAȘINĂ ----------

   Litera cu litera, cu păcănit de tastă. Nu e o glumă de stil: un text care apare
   dintr-odată e o notificare, unul care se bate în fața ta e cineva care scrie.
   Sala asta e despre memoria obiectelor, iar o mașină de scris e obiectul care
   ține minte cel mai bine. */
function batLaMasina(text, dupa) {
  s10.scris = { text: text, litere: 0, urmatoarea: 0, gata: false, dupa: dupa || 0 };
}

function actualizeazaScrisul(acum, dt) {
  const sc = s10.scris;
  if (!sc) return;
  if (sc.litere < sc.text.length) {
    if (sc.urmatoarea === 0) sc.urmatoarea = acum + 260;
    if (acum >= sc.urmatoarea) {
      sc.litere++;
      const lit = sc.text[sc.litere - 1];
      if (audio && lit !== ' ') sunetTastaMasina();
      /* Ritmul unei mașini de scris nu e regulat: degetele se opresc, o literă
         vine repezită după alta, iar la spații se face o pauză mai mare. */
      sc.urmatoarea = acum + (lit === ' ' ? 90 : 42 + Math.random() * 78);
      if (lit === '.' || lit === '!') sc.urmatoarea = acum + 420;
    }
  } else if (!sc.gata) {
    sc.gata = true;
    sc.candGata = acum;
    if (audio) sunetCaretMasina();
  }
}

function deseneazaScrisul(acum) {
  const sc = s10.scris;
  if (!sc) return;
  const S = Math.min(W, H);
  const marime = Math.max(13, S * 0.030);
  const stins = sc.gata ? Math.max(0, Math.min(1, 1 - (acum - sc.candGata - sc.dupa) / 900)) : 1;
  if (stins <= 0) { s10.scris = null; return; }

  ctx.save();
  ctx.globalAlpha = stins;
  ctx.font = Math.round(marime) + 'px "Courier New", Courier, monospace';
  const vazut = sc.text.slice(0, sc.litere);
  const lat = ctx.measureText(sc.text).width;
  const x = W * 0.5 - lat / 2, y = H * 0.115;

  // fâșia de hârtie din mașină
  ctx.fillStyle = 'rgba(228, 214, 178, 0.93)';
  dreptunghi(x - marime * 1.2, y - marime * 1.0, lat + marime * 2.4, marime * 2.3,
             marime * 0.18);
  ctx.globalAlpha = stins * 0.5;
  ctx.strokeStyle = '#8a7648';
  ctx.lineWidth = Math.max(1, S * 0.0018);
  ctx.strokeRect(x - marime * 1.2, y - marime * 1.0, lat + marime * 2.4, marime * 2.3);

  /* Literele nu stau perfect pe linie: fiecare ciocănel bate puțin altfel, iar
     panglica dă când mai negru, când mai șters. Aliniate la milimetru, ar fi
     ieșit un font, nu o mașină. */
  ctx.globalAlpha = stins;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  let px = x;
  for (let k = 0; k < vazut.length; k++) {
    const z = samanta(700 + k * 3.7);
    ctx.fillStyle = 'rgba(48, 38, 22, ' + (0.62 + z * 0.38).toFixed(2) + ')';
    ctx.fillText(vazut[k], px, y + marime * 0.72 + (z - 0.5) * marime * 0.10);
    px += ctx.measureText(vazut[k]).width;
  }
  if (!sc.gata) {
    ctx.fillStyle = 'rgba(48, 38, 22, 0.55)';
    ctx.fillRect(px + marime * 0.06, y + marime * 0.80, marime * 0.5, marime * 0.09);
  }
  ctx.restore();
}

/* ---------- RUPTURA ---------- */
function pregatesteFasiile() {
  s10.fasii = [];
  const cate = 9;
  for (let k = 0; k < cate; k++) {
    const z = samanta(4100 + k * 3.7), e = samanta(4160 + k * 7.3);

    /* Marginea fâșiei nu e o tăietură, e o **rupere**: șovăie încolo și încoace
       pe toată înălțimea. Prima oară le tăiasem drept, și peretele nu se destrăma,
       se deschidea ca niște jaluzele. */
    const zimti = [];
    for (let q = 0; q <= 14; q++) {
      zimti.push((samanta(4200 + k * 31 + q * 3.1) - 0.5) * 0.55);
    }

    s10.fasii.push({
      x: (k / cate) * W, lat: W / cate,
      zimti: zimti,
      viteza: 0.85 + z * 1.1,
      deriva: (e - 0.5) * 0.5,
      rotire: (e - 0.5) * 1.9,
      intarziere: z * 0.30
    });
  }
}

/* Traseul unei fâșii, cu marginile zdrențuite. Se folosește ca decupaj: peretele
   se pune întreg pe dedesubt și se vede numai prin fâșie. Așa fiecare bucată de
   colaj rămâne exact cum era — se rup hârtiile pe unde nimeresc, nu pe la mijloc. */
function traseulFasiei(c, f) {
  const n = f.zimti.length - 1;
  c.beginPath();
  for (let q = 0; q <= n; q++) {
    const y = (q / n) * H;
    const x = f.x + f.zimti[q] * f.lat;
    if (q === 0) c.moveTo(x, y - H * 0.02); else c.lineTo(x, y);
  }
  for (let q = n; q >= 0; q--) {
    const y = (q / n) * H;
    const x = f.x + f.lat + f.zimti[n - q] * f.lat;
    c.lineTo(x, q === n ? y + H * 0.02 : y);
  }
  c.closePath();
}

function deseneazaRuptura(acum) {
  const q = Math.min(1, s10.rupere);

  /* Lumina din sala a unsprezecea, care crește pe măsură ce peretele cade. Ea e
     dedesubt: fâșiile se desprind de pe ea, nu din întuneric. */
  const lum = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45,
                                       Math.max(W, H) * 0.78);
  lum.addColorStop(0, '#fffaee');
  lum.addColorStop(0.35, '#f6e4bc');
  lum.addColorStop(0.7, amesteca('#e0bd83', '#a8752f', 0.4));
  lum.addColorStop(1, amesteca('#7d5620', SEPIA, 0.55));
  ctx.fillStyle = lum;
  ctx.fillRect(0, 0, W, H);

  const perete = pregatestePeretele();
  for (const f of s10.fasii) {
    const p = Math.max(0, Math.min(1, (q - f.intarziere) / (1 - f.intarziere)));
    ctx.save();
    if (p > 0) {
      /* Fâșia se desprinde **de sus** și se răsucește în jurul capătului ei de sus,
         cum face o coajă de afiș smulsă de pe zid. Rotită în jurul mijlocului, ar
         cădea ca o scândură — iar hârtia nu cade ca scândura. */
      const e = atenuare(p);
      const pivot = f.x + f.lat / 2;
      ctx.translate(pivot + f.deriva * W * e, H * 1.9 * e * f.viteza * e);
      ctx.rotate(f.rotire * e);
      ctx.scale(1 - e * 0.18, 1);
      ctx.translate(-pivot, 0);
      ctx.globalAlpha = 1 - e * 0.35;
    }
    traseulFasiei(ctx, f);
    ctx.clip();
    ctx.drawImage(perete, 0, 0);
    ctx.restore();
  }

  /* Bucățile mici care se desprind și zboară: sfârșii de hârtie, așchii de carton,
     scame de iută. Ele fac deosebirea dintre „peretele a căzut" și „peretele s-a
     destrămat" — un lucru întreg cade, unul lipit se face bucăți. */
  ctx.save();
  for (let k = 0; k < 60; k++) {
    const a = samanta(4300 + k * 3.1), b = samanta(4360 + k * 7.7);
    const e = samanta(4420 + k * 5.3);
    const cand = Math.max(0, q - a * 0.4) / (1 - a * 0.4);
    if (cand <= 0) continue;
    const cad = atenuare(cand);
    const x = b * W + (e - 0.5) * W * 0.35 * cad;
    const y = a * H + cad * H * (0.7 + e * 1.2);
    if (y > H * 1.05) continue;
    const r = Math.min(W, H) * (0.006 + e * 0.026);
    ctx.save();
    ctx.globalAlpha = Math.min(1, (1 - cand) * 1.6) * 0.9;
    ctx.translate(x, y);
    ctx.rotate((e - 0.5) * 14 * cad);
    ctx.fillStyle = e > 0.62 ? ZIAR : (e > 0.3 ? CARTON : IUTA_UMBRA);
    ctx.fillRect(-r, -r * 0.5, r * 2, r);
    ctx.globalAlpha *= 0.5;
    ctx.fillStyle = '#3a2b12';
    ctx.fillRect(-r, r * 0.2, r * 2, r * 0.3);
    ctx.restore();
  }
  ctx.restore();

  // praful care se ridică din colaj
  ctx.save();
  for (let k = 0; k < 40; k++) {
    const a = samanta(4500 + k * 3.1), b = samanta(4560 + k * 7.7);
    const urcare = (q * (0.6 + a * 1.1) + b) % 1;
    ctx.globalAlpha = (1 - urcare) * 0.20 * q;
    ctx.fillStyle = k % 3 ? '#e6d2a4' : '#8f7442';
    const r = Math.min(W, H) * (0.004 + a * 0.016);
    ctx.beginPath();
    ctx.arc(a * W, H * (1.05 - urcare * 1.2), r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------- MÂNA ----------
   Cursorul devine o mână stilizată. Nu o mână desenată frumos: una **din sârmă**,
   cum s-ar potrivi într-o sală steampunk, cu degetul arătător exact în vârful
   cursorului, ca să știi cu ce atingi. */
function cursorulScenei10() {
  if (stare !== 'colaj') return false;
  if (cursor.x < -100) return true;
  const S = Math.min(W, H);
  const s = S * 0.10;

  /* O mână **plină**, cu contur, nu un desen din sârmă. Prima oară o făcusem din
     câteva linii subțiri și, la mărimea la care stă un cursor, ieșea o mâzăleală:
     ochiul citește forme, nu contururi, iar o mână fără interior nu are formă.

     Arătătorul se termină exact în vârful cursorului, și asta nu e o prefăcătorie:
     acolo se și atinge peretele, deci mâna trebuie să arate unde e adevărul. */
  ctx.save();
  ctx.translate(cursor.x, cursor.y);
  ctx.rotate(-0.30);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.beginPath();
  // arătătorul, de la vârf în jos
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(s * 0.16, s * 0.06, s * 0.19, s * 0.34);
  // dosul mâinii, spre încheietură
  ctx.quadraticCurveTo(s * 0.30, s * 0.30, s * 0.42, s * 0.42);
  ctx.quadraticCurveTo(s * 0.62, s * 0.58, s * 0.60, s * 0.86);
  ctx.quadraticCurveTo(s * 0.56, s * 1.10, s * 0.30, s * 1.14);
  ctx.quadraticCurveTo(s * 0.02, s * 1.16, -s * 0.12, s * 0.96);
  // degetul mare, care iese în afară
  ctx.quadraticCurveTo(-s * 0.34, s * 0.92, -s * 0.30, s * 0.70);
  ctx.quadraticCurveTo(-s * 0.24, s * 0.50, -s * 0.06, s * 0.44);
  ctx.closePath();

  ctx.globalAlpha = 0.60;
  ctx.fillStyle = 'rgba(58, 42, 20, 0.9)';
  ctx.fill();
  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = 'rgba(244, 220, 168, 0.95)';
  ctx.lineWidth = Math.max(1.2, s * 0.055);
  ctx.stroke();

  // încheieturile celorlalte degete, strânse în palmă
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = Math.max(1, s * 0.035);
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.moveTo(s * (0.20 + k * 0.11), s * (0.62 + k * 0.14));
    ctx.quadraticCurveTo(s * (0.44 + k * 0.08), s * (0.60 + k * 0.14),
                         s * (0.50 + k * 0.05), s * (0.78 + k * 0.11));
    ctx.stroke();
  }

  // sclipirea din vârful arătătorului: acolo se atinge
  ctx.globalAlpha = 1;
  const sc = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.30);
  sc.addColorStop(0, 'rgba(255, 240, 200, 0.95)');
  sc.addColorStop(1, 'rgba(255, 240, 200, 0)');
  ctx.fillStyle = sc;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.30, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  return true;
}

/* ---------- INTRAREA ȘI IEȘIREA ---------- */
function intraInColaj(acum) {
  stare = 'colaj';
  s10.faza = 'intrare'; s10.t0 = acum; s10.ultimulCadru = acum;
  s10.intuneric = 0; s10.clapa = 0; s10.clapaInMana = false;
  s10.rupere = 0; s10.fasii = []; s10.crapaturi = [];
  s10.sfoaraInMana = -1; s10.ultimaIuta = 0; s10.ultimulFosnet = 0;
  pregatestePiesele();
  stampaPeretelui.latime = 0;         // peretele se face din nou, cu piese noi
  pregatestePeretele();
  batLaMasina('Închide ochii și simte texturile.', 1400);
  opresteVinilul();
  pornesteAtelierRetro();
  if (audio) sunetPortal();
}

function iesiDinColaj(acum) {
  /* Ruptura duce în sala a unsprezecea. Ea încă nu e făcută, așa că deocamdată
     te scoate înapoi la custode — ca la arsură, ca la vârtej, ca la trapă și ca
     la ziar. Când va fi, aici se schimbă un singur rând. */
  opresteAtelierRetro();
  s3.vizitat = true;
  stare = 'muzeu';
  faza3('usaDeschisa');
  s3.usa = 1; s3.chemare = 0; s3.aSunatChemarea = false;
  actiune3(acum);
  pornesteNatura(false);
}

/* ---------- CE FACE FIECARE MATERIAL ---------- */
function pornestePiesa(p, acum) {
  const eraStinsa = !p.activat;
  p.zvac = 1;

  if (p.fel === 'ziar') {
    p.incretit = Math.min(1, p.incretit + 0.55);
    if (audio) {
      sunetFosnetHartie();
      /* Știrea vine numai o dată de fiecare bucată de ziar, și numai dacă n-a
         mai vorbit alta de curând. Trei crainici deodată nu sunt nostalgie, sunt
         hărmălaie. */
      if (eraStinsa && acum - s10.ultimulFosnet > 4500) {
        s10.ultimulFosnet = acum;
        stireRadio();
      }
    }
  } else if (p.fel === 'carton') {
    if (audio) sunetCarton();
  } else if (p.fel === 'nasturi') {
    if (audio) sunetNasturi();
  }

  if (eraStinsa) {
    p.activat = true;
    s10.activate++;
    crapaCleiulDinJur(p);
  }
}

/* Când o piesă se pornește, cleiul din jurul ei crapă. Legătura e falsă — cleiul
   nu ține nimic — dar e legătura pe care o vede ochiul, și de-aia trebuie făcută:
   dacă ai tras de ceva și n-a cedat nimic în jur, n-ai tras de nimic. */
function crapaCleiulDinJur(p) {
  const c = cutiaPiesei(p);
  let cracnit = false;
  for (let k = 0; k < DARE_CLEI.length; k++) {
    const d = DARE_CLEI[k];
    const mx = (d[0] + d[2]) / 2 * W, my = (d[1] + d[3]) / 2 * H;
    if (Math.hypot(mx - c.cx, my - c.cy) > Math.min(W, H) * 0.28) continue;
    s10.crapaturi[k] = Math.min(1, (s10.crapaturi[k] || 0) + 0.5);
    cracnit = true;
  }
  if (cracnit && audio) sunetCrackClei();
}

/* ---------- ATINGERILE ---------- */
function click10(acum) {
  if (s10.faza === 'rupere' || s10.faza === 'iesire') return;

  // colțul desprins are întâietate: e ieșirea
  if (s10.faza === 'desprindere' && peClapa(cursor.x, cursor.y)) {
    s10.clapaInMana = true;
    return;
  }

  const p = piesaDeSub(cursor.x, cursor.y);
  if (!p) return;
  if (p.fel === 'sfoara') { s10.sfoaraInMana = p.i; return; }
  pornestePiesa(p, acum);
}

/* Trasul de sfoară și desprinsul colțului se țin apăsate, ca pictatul din sala
   uleiului și stropitul din a acuarelei. O manetă trasă cu un clic nu e o manetă. */
function trageDeScena10() {
  if (stare !== 'colaj') return;
  const acum = performance.now();

  if (!cursor.apasat) {
    if (s10.sfoaraInMana >= 0) {
      const p = s10.piese[s10.sfoaraInMana];
      p.arcTinta = p.activat ? p.arc : 0;      // slobodă, se întoarce la loc
      s10.sfoaraInMana = -1;
    }
    s10.clapaInMana = false;
    return;
  }

  if (s10.sfoaraInMana >= 0) {
    const p = s10.piese[s10.sfoaraInMana];
    const dorit = (cursor.x - p.u * W) / W;
    p.arc = Math.max(-0.16, Math.min(0.16, dorit));
    if (audio && Math.random() < 0.4) {
      sunetSfoaraIncordata(Math.abs(p.arc) / 0.16);
    }
    if (!p.activat && Math.abs(p.arc) > 0.105) {
      p.activat = true;
      p.arcTinta = p.arc;
      s10.activate++;
      crapaCleiulDinJur(p);
      if (audio) sunetClopotelBicicleta();
    }
    return;
  }

  if (s10.clapaInMana) {
    const mers = (cursor.y - H * 0.06) / (H * 0.62);
    s10.clapa = Math.max(s10.clapa, Math.max(0, Math.min(1, mers)));
    if (audio && Math.random() < 0.25) sunetCrackClei();
  }
}

/* Iuta se aude la trecere, nu la clic — e fundal, nu obiect. Se rărește: chemată
   la fiecare cadru, ar fi un șuierat continuu, iar o pânză nu șuieră, zgârie. */
function frecaturaIutei(acum) {
  if (stare !== 'colaj' || s10.faza === 'rupere' || s10.faza === 'iesire') return;
  if (!audio || cursor.x < -100) return;
  if (cursor.viteza < 0.18) return;
  if (acum - s10.ultimaIuta < 150 + Math.random() * 200) return;
  if (piesaDeSub(cursor.x, cursor.y)) return;      // numai pe pânza goală
  s10.ultimaIuta = acum;
  sunetIuta(Math.min(1, cursor.viteza / 1.4));
}

/* Colțul desprins din stânga sus: apare abia după ce toate materialele au fost
   pornite, și e singurul loc din sală de unde se poate trage de tot colajul. */
function peClapa(x, y) {
  const S = Math.min(W, H);
  const lat = S * 0.26;
  return x < lat && y < lat * 0.9;
}

/* ---------- CEASUL ---------- */
function actualizeazaColaj(acum) {
  const dt = Math.max(0, Math.min(100, acum - (s10.ultimulCadru || acum)));
  s10.ultimulCadru = acum;
  tineAtelierRetro();
  actualizeazaScrisul(acum, dt);
  frecaturaIutei(acum);

  for (const p of s10.piese) {
    if (p.zvac > 0) p.zvac = Math.max(0, p.zvac - dt / 420);
    if (p.fel === 'sfoara' && s10.sfoaraInMana !== p.i) {
      p.arc += (p.arcTinta - p.arc) * Math.min(1, dt / 90);
    }
  }

  if (s10.faza === 'intrare') {
    s10.intuneric = Math.min(1, s10.intuneric + dt / 2600);
    /* Sala se deschide când s-a stins lumina, **nu** când s-a terminat de scris.
       Întâi așteptam și textul, și ieșea o sală încuiată cinci secunde: întindeai
       mâna spre perete și nu se întâmpla nimic, fără să înțelegi de ce. Un text
       care se stinge singur nu are de ce să țină mâna pe loc — și cu atât mai
       puțin într-o sală al cărei singur îndemn e să pipăi. */
    if (s10.intuneric >= 1) { s10.faza = 'explorare'; s10.t0 = acum; }
  }
  else if (s10.faza === 'explorare') {
    if (s10.activate >= s10.piese.length) {
      s10.faza = 'desprindere'; s10.t0 = acum;
      batLaMasina('Timpul este legat cu sfoară și lipit cu clei. Desprinde straturile.', 5200);
    }
  }
  else if (s10.faza === 'desprindere') {
    if (s10.clapa >= 1) {
      s10.faza = 'rupere'; s10.t0 = acum; s10.rupere = 0.001;
      pregatesteFasiile();
      if (audio) { sunetRupturaMare(); opresteAtelierRetro(); }
    }
  }
  else if (s10.faza === 'rupere') {
    s10.rupere = Math.min(1, s10.rupere + dt / 3600);
    if (s10.rupere >= 1) { s10.faza = 'iesire'; s10.t0 = acum; }
  }
  else if (s10.faza === 'iesire' && acum - s10.t0 > 1500) iesiDinColaj(acum);
}

/* ---------- DESENUL ---------- */
function deseneazaScena10(t, acum) {
  if (s10.faza === 'rupere' || s10.faza === 'iesire') {
    deseneazaRuptura(acum);
    return;
  }

  ctx.drawImage(pregatestePeretele(), 0, 0);

  // ce s-a schimbat de la atingeri: mototolelile, cleiul crăpat, sforile
  for (const p of s10.piese) {
    if (p.fel !== 'ziar' || p.incretit <= 0) continue;
    increteste(ctx, p, cutiaPiesei(p), p.incretit);
  }
  for (let k = 0; k < DARE_CLEI.length; k++) {
    const cat = s10.crapaturi[k] || 0;
    if (cat <= 0) continue;
    const d = DARE_CLEI[k];
    daraDeClei(ctx, d[0] * W, d[1] * H, d[2] * W, d[3] * H, 300 + k * 17, cat);
  }
  for (const p of s10.piese) {
    if (p.fel === 'sfoara') franghia(ctx, p, p.activat ? 0.55 : 0);
  }

  /* Piesele pornite luminează pe la spate. Ele sunt tabla de bord a sălii: după
     ce nu mai rămâne niciuna stinsă, se desprinde colțul. Fără semnul ăsta,
     jucătorul ar trebui să țină minte ce a atins, iar sala e despre atins, nu
     despre ținut minte. */
  for (const p of s10.piese) {
    if (p.fel === 'sfoara' || !p.activat) continue;
    const cut = cutiaPiesei(p);
    const bat = 0.72 + 0.28 * Math.sin(acum * 0.0016 + p.sam);
    luminaDinSpate(ctx, p, cut, bat);
    if (p.fel === 'nasturi') {
      ctx.save();
      ctx.translate(cut.cx, cut.cy);
      palcDeNasturi(ctx, p, cut.w, cut.h, bat * 0.6);
      ctx.restore();
    }
  }

  pictezaLumina(ctx, acum);

  // colțul care se desprinde
  if (s10.faza === 'desprindere') deseneazaClapa(acum);

  deseneazaScrisul(acum);
}

/* Colțul din stânga sus, ridicat de pe perete: se vede dosul pânzei, mai palid,
   și umbra pe care o aruncă peste colaj. */
function deseneazaClapa(acum) {
  const S = Math.min(W, H);
  const lat = S * (0.26 + s10.clapa * 0.55);
  const q = s10.clapa;
  const bat = 0.5 + 0.5 * Math.sin(acum * 0.0022);

  ctx.save();
  // umbra de sub colț
  ctx.globalAlpha = 0.35 + q * 0.25;
  ctx.fillStyle = '#231a08';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(lat * 1.06, 0);
  ctx.quadraticCurveTo(lat * 0.6, lat * 0.6, 0, lat * 0.98);
  ctx.closePath();
  ctx.fill();

  // dosul pânzei, ridicat
  ctx.globalAlpha = 1;
  const dos = ctx.createLinearGradient(0, 0, lat, lat);
  dos.addColorStop(0, '#8e7a4c');
  dos.addColorStop(0.6, '#6f5e39');
  dos.addColorStop(1, '#4e4126');
  ctx.fillStyle = dos;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(lat, 0);
  ctx.quadraticCurveTo(lat * 0.52, lat * 0.52, 0, lat * 0.92);
  ctx.closePath();
  ctx.fill();

  // firele rupte de pe dos și cleiul întins
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = '#d3bd88';
  ctx.lineWidth = Math.max(0.8, S * 0.0022);
  for (let k = 0; k < 16; k++) {
    const a = samanta(4500 + k * 3.7);
    ctx.beginPath();
    ctx.moveTo(lat * (0.1 + a * 0.8), lat * 0.02);
    ctx.lineTo(lat * (0.05 + a * 0.7), lat * (0.5 + a * 0.4));
    ctx.stroke();
  }

  /* Cheamă: un halou care respiră pe colț, cât n-ai apucat de el. Nu clipește —
     în sala asta nimic nu clipește, totul respiră. */
  if (!s10.clapaInMana) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.20 + bat * 0.22;
    const h = ctx.createRadialGradient(lat * 0.3, lat * 0.3, 0, lat * 0.3, lat * 0.3, lat * 0.9);
    h.addColorStop(0, 'rgba(232, 186, 100, 0.9)');
    h.addColorStop(1, 'rgba(232, 186, 100, 0)');
    ctx.fillStyle = h;
    ctx.fillRect(0, 0, lat * 1.2, lat * 1.2);
  }
  ctx.restore();
}
