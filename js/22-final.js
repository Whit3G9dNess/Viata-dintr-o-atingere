/* ---------- 22. SFÂRȘITUL: GLOBUL ----------

   Jucăria a început cu un punct care s-a făcut balon de săpun. Se termină cu
   același balon, care nu mai fuge: crește, se face sticlă, și se sparge.

   De ce un glob de Crăciun și nu altceva: e singurul lucru din lume care e în
   același timp **balon** (rotund, ușor, plin de lumină) și **obiect** (are
   greutate, are căpăcel, se sparge în cioburi). Toată jucăria a fost despre
   drumul de la o pată de culoare la un lucru făcut de mână; ultimul obiect
   închide drumul ăsta într-o singură formă.

   Și se sparge, nu se dezumflă. Un balon de săpun dispare fără urmă — nu e nimic
   de ținut minte în el. Sticla lasă cioburi, iar cioburile cad și se strâng
   înapoi în punctul din mijlocul ecranului, de unde a pornit totul.

   Pe urmă rămâne negrul de la început, și un nume. */

const s13 = {
  faza: 'crestere',     // crestere → asteapta → spargere → adunare → album → text
  t0: 0, ultimulCadru: 0,
  raza: 0,              // cât e globul acum
  intuneric: 0,         // cât s-a stins lumea în jurul lui
  cioburi: [],
  scris: 0,             // cât a apărut numele
  aSpus: false,         // s-a arătat îndemnul, dacă a stat prea mult
  chemare: 0
};

/* Cât de mare se face globul: destul cât să fie **un obiect**, nu o bulă. Un
   balon mic pe un ecran mare rămâne o pată; unul cât o palmă are greutate. */
function razaGlobului() { return Math.min(W, H) * 0.16; }
function loculGlobului() { return { x: W * 0.5, y: H * 0.46 }; }

/* Culorile sticlei. Un glob adevărat nu e o singură culoare: e o culoare adâncă,
   una aprinsă unde bate lumina, și aurul căpăcelului. Roșul e ales fiindcă e
   singura culoare pe care negrul de după n-o stinge — se ține minte. */
const GLOB_ADANC   = '#5e1220';
const GLOB_CORP    = '#a81f31';
const GLOB_APRINS  = '#e35a52';
const GLOB_LUMINA  = '#ffd9c6';
const GLOB_AUR     = '#d9a441';
const GLOB_AUR_UMBRA = '#8a6420';

function intraInFinal(acum) {
  stare = 'final';
  s13.faza = 'crestere'; s13.t0 = acum; s13.ultimulCadru = acum;
  s13.raza = balon.razaBaza;
  s13.intuneric = 0; s13.cioburi.length = 0; s13.scris = 0;
  s13.aSpus = false; s13.chemare = 0;
  urma.length = 0;
  opresteNatura();
  opresteMuzicaMuzeu();
  if (audio) sunetSticlaSeFace();
}

/* ---------- CEASUL ---------- */
function actualizeazaFinalul(acum) {
  const dt = Math.max(0, Math.min(100, acum - (s13.ultimulCadru || acum)));
  s13.ultimulCadru = acum;

  if (s13.faza === 'crestere') {
    const p = Math.min(1, (acum - s13.t0) / 2600);
    s13.raza = intre(balon.razaBaza, razaGlobului(), atenuare(p));
    if (p >= 1) { s13.faza = 'asteapta'; s13.t0 = acum; }
  }
  else if (s13.faza === 'asteapta') {
    /* Dacă stă prea mult neatins, globul cheamă — la fel ca buzunarul
       custodelui și lupa din galerie. Ultimul gest al jucăriei n-are voie să
       fie unul pe care jucătorul să nu-l găsească. */
    if (acum - s13.t0 > 5000) s13.chemare = Math.min(1, s13.chemare + dt / 2600);
  }
  else if (s13.faza === 'spargere') {
    s13.intuneric = Math.min(1, s13.intuneric + dt / 2600);
    for (const c of s13.cioburi) {
      /* Greutatea sticlei. Era de șapte ori mai mare, și cioburile ieșeau din
         ecran în jumătate de secundă — se spărgea globul și nu se vedea nimic
         căzând. Ea a cerut ca **cioburile să cadă**, adică să se vadă căzând;
         atâta cât să ajungă cam până jos în timpul care li s-a dat. */
      c.vy += dt * 0.00022;
      // aerul le ține puțin în loc, ca pe niște lucruri mici și ușoare
      c.vx *= Math.pow(0.9994, dt);
      c.x += c.vx * dt; c.y += c.vy * dt;
      c.unghi += c.vunghi * dt;
      c.stralucire = Math.max(0, c.stralucire - dt / 1400);
    }
    if (acum - s13.t0 > 1800) { s13.faza = 'adunare'; s13.t0 = acum; }
  }
  else if (s13.faza === 'adunare') {
    /* Cioburile se strâng în mijlocul ecranului și se sting acolo. Punctul acela
       e chiar locul din care a crescut primul punct alb, la începutul jucăriei:
       tot ce s-a făcut din el se întoarce în el. */
    const p = Math.min(1, (acum - s13.t0) / 1500);
    const mij = loculGlobului();
    for (const c of s13.cioburi) {
      c.stins = p;
      c.x = intre(c.x, mij.x, atenuare(p) * 0.9);
      c.y = intre(c.y, mij.y, atenuare(p) * 0.9);
    }
    s13.intuneric = 1;
    if (p >= 1) {
      s13.cioburi.length = 0;
      /* Din locul unde s-au stins cioburile se ridică albumul. Dacă n-a rămas
         nicio poză — cineva a sărit drept la final dintr-un test, sau jucăria
         s-a deschis chiar aici — se trece mai departe, la nume. */
      if (typeof pozeleAlbumului === 'function' && pozeleAlbumului().length) {
        s13.faza = 'album'; s13.t0 = acum;
        pornesteAlbumul();
      } else {
        s13.faza = 'text'; s13.t0 = acum;
      }
    }
  }
  else if (s13.faza === 'album') {
    actualizeazaAlbumul(dt);
    if (album.gata) { s13.faza = 'text'; s13.t0 = acum; s13.scris = 0; }
  }
  else if (s13.faza === 'text') {
    s13.scris = Math.min(1, s13.scris + dt / 2200);
  }
}

/* ---------- CE SE ÎNTÂMPLĂ LA ATINGERE ---------- */
function click13(acum) {
  /* În album, atingerea întoarce fila — nu mai sparge nimic. */
  if (s13.faza === 'album') { atingeAlbumul(); return; }
  if (s13.faza !== 'asteapta' && s13.faza !== 'crestere') return;
  const m = loculGlobului();
  /* Ținta e largă: globul e singurul lucru de pe ecran, iar un ultim gest nu se
     cere ochit. */
  if (Math.hypot(cursor.x - m.x, cursor.y - m.y) > s13.raza * 1.7) return;
  spargeGlobul(cursor.x, cursor.y, acum);
}

/* Cioburile. Un glob spart nu se rupe în bucăți la întâmplare: crapă **de la
   locul lovit**, în felii care pleacă din el ca spițele. De-aia fiecare ciob e o
   pană tăiată din cerc, cu vârful în punctul atins. */
function spargeGlobul(x, y, acum) {
  const m = loculGlobului();
  const r = s13.raza;
  const CATE = 16;
  s13.cioburi.length = 0;
  const unghiLovit = Math.atan2(y - m.y, x - m.x);

  for (let k = 0; k < CATE; k++) {
    const a0 = (k / CATE) * Math.PI * 2 + samanta(900 + k * 3.1) * 0.22;
    const a1 = ((k + 1) / CATE) * Math.PI * 2 + samanta(900 + (k + 1) * 3.1) * 0.22;
    const mij = (a0 + a1) / 2;
    /* Cele dinspre lovitură pleacă mai tare: acolo a intrat degetul. */
    const catreLovit = Math.cos(mij - unghiLovit);
    const putere = (0.075 + samanta(940 + k * 7.7) * 0.075) * (0.7 + catreLovit * 0.6);
    s13.cioburi.push({
      x: m.x + Math.cos(mij) * r * 0.45,
      y: m.y + Math.sin(mij) * r * 0.45,
      vx: Math.cos(mij) * putere * (0.5 + samanta(970 + k * 5.3) * 0.7),
      vy: Math.sin(mij) * putere * (0.5 + samanta(1010 + k * 5.3) * 0.7) - 0.055,
      unghi: 0,
      vunghi: (samanta(1050 + k * 3.7) - 0.5) * 0.0035,
      a0: a0 - mij, a1: a1 - mij,           // pana, socotită față de mijlocul ei
      r: r,
      stralucire: 1,
      stins: 0,
      sam: k
    });
  }
  s13.faza = 'spargere'; s13.t0 = acum;
  if (audio) sunetGlobSpart();
}

/* ---------- DESENUL ---------- */
function deseneazaScena13(t, acum) {
  actualizeazaFinalul(acum);

  // fondul: lumea de la începutul jucăriei, care se stinge în negru
  deseneazaFundal(1);
  if (s13.intuneric > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, s13.intuneric);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  if (s13.faza === 'crestere' || s13.faza === 'asteapta') deseneazaGlobul(t, acum);
  if (s13.faza === 'spargere' || s13.faza === 'adunare') cioburileGlobului(t);
  if (s13.faza === 'album') deseneazaAlbumul(t);
  if (s13.faza === 'text') deseneazaNumele();
}

/* Globul: sticlă suflată, cu adâncime. Ce face un cerc să pară sticlă nu e
   strălucirea, ci **trei lucruri deodată**: partea de sus mai deschisă (lumina
   care intră), o dungă închisă jos-interior (peretele din spate, văzut prin
   sticlă), și o pată albă mică și tare sus-stânga (reflexul ferestrei). Fără
   dunga închisă, globul arată a bilă de plastic. */
function deseneazaGlobul(t, acum) {
  const m = loculGlobului();
  const r = s13.raza;
  const cat = Math.max(0, Math.min(1, (r - balon.razaBaza) /
                                      Math.max(1, razaGlobului() - balon.razaBaza)));
  const legan = Math.sin(t * 0.0012) * 0.045 * cat;

  ctx.save();
  ctx.translate(m.x, m.y);
  ctx.rotate(legan);

  // haloul cald din jur — și chemarea, dacă stă prea mult neatins
  const bat = 0.7 + 0.3 * Math.sin(t * 0.0035);
  const halou = ctx.createRadialGradient(0, 0, r * 0.8, 0, 0, r * (2.0 + s13.chemare * 0.7));
  halou.addColorStop(0, `rgba(255, 214, 170, ${(0.14 + s13.chemare * 0.26) * bat})`);
  halou.addColorStop(1, 'rgba(255, 214, 170, 0)');
  ctx.fillStyle = halou;
  ctx.beginPath();
  ctx.arc(0, 0, r * (2.0 + s13.chemare * 0.7), 0, Math.PI * 2);
  ctx.fill();

  // corpul de sticlă
  const corp = ctx.createRadialGradient(-r * 0.32, -r * 0.38, r * 0.06, 0, 0, r);
  corp.addColorStop(0, amestecaFinal(GLOB_LUMINA, GLOB_APRINS, 1 - cat * 0.35));
  corp.addColorStop(0.42, GLOB_CORP);
  corp.addColorStop(1, GLOB_ADANC);
  ctx.globalAlpha = 0.35 + cat * 0.65;
  ctx.fillStyle = corp;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // peretele din spate, văzut prin sticlă: o seceră închisă, jos-interior
  ctx.globalAlpha = 0.5 * cat;
  ctx.fillStyle = GLOB_ADANC;
  ctx.beginPath();
  ctx.ellipse(r * 0.10, r * 0.30, r * 0.80, r * 0.62, -0.35, Math.PI * 0.05, Math.PI * 0.95);
  ctx.fill();

  /* Curcubeul balonului nu se pierde de tot: rămâne o dungă subțire pe muchie,
     ca o amintire a ce a fost lucrul ăsta înainte să se facă sticlă. */
  ctx.globalAlpha = (1 - cat) * 0.7 + 0.12;
  if (ctx.createConicGradient) {
    const curcubeu = ctx.createConicGradient(t * 0.0004, 0, 0);
    curcubeu.addColorStop(0.00, 'rgba(255, 150, 180, 0.5)');
    curcubeu.addColorStop(0.30, 'rgba(255, 220, 130, 0.5)');
    curcubeu.addColorStop(0.60, 'rgba(150, 255, 190, 0.5)');
    curcubeu.addColorStop(0.85, 'rgba(180, 190, 255, 0.5)');
    curcubeu.addColorStop(1.00, 'rgba(255, 150, 180, 0.5)');
    ctx.strokeStyle = curcubeu;
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  }
  ctx.lineWidth = Math.max(1, r * 0.035);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.985, 0, Math.PI * 2);
  ctx.stroke();

  // reflexul ferestrei: mic, tare, sus-stânga. El singur spune „sticlă".
  ctx.globalAlpha = cat;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.36, -r * 0.42, r * 0.15, r * 0.095, -0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = cat * 0.45;
  ctx.beginPath();
  ctx.ellipse(-r * 0.20, -r * 0.55, r * 0.07, r * 0.04, -0.7, 0, Math.PI * 2);
  ctx.fill();

  // căpăcelul de alamă și cârligul, care cresc odată cu globul
  ctx.globalAlpha = cat;
  capaculGlobului(r, cat);
  ctx.restore();

  if (s13.chemare > 0.45 && !s13.aSpus) s13.aSpus = true;
  if (s13.aSpus) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, s13.chemare) * (0.55 + 0.45 * bat);
    textIncadrat(T('final.atingeL'), W * 0.5, m.y + r * 2.1,
                 W * 0.6, Math.max(ecran(20), Math.min(W, H) * 0.03),
                 `italic ${Math.max(13, Math.round(Math.min(W, H) * 0.026))}px Georgia`,
                 '#3a332a');
    ctx.restore();
  }
}

/* Căpăcelul: un gât scurt, o coroană cu nervuri și un cârlig. Fără el, un cerc
   roșu e o bilă; cu el, e un glob care a atârnat undeva. */
function capaculGlobului(r, cat) {
  const lat = r * 0.30, inalt = r * 0.20;
  const sus = -r * 0.98;
  const capac = ctx.createLinearGradient(-lat / 2, 0, lat / 2, 0);
  capac.addColorStop(0, GLOB_AUR_UMBRA);
  capac.addColorStop(0.4, GLOB_AUR);
  capac.addColorStop(1, GLOB_AUR_UMBRA);
  ctx.fillStyle = capac;
  ctx.fillRect(-lat / 2, sus - inalt, lat, inalt + r * 0.05);

  // nervurile coroanei
  ctx.strokeStyle = `rgba(90, 62, 16, ${0.55 * cat})`;
  ctx.lineWidth = Math.max(0.6, r * 0.012);
  for (let k = -2; k <= 2; k++) {
    ctx.beginPath();
    ctx.moveTo(k * lat * 0.19, sus - inalt * 0.92);
    ctx.lineTo(k * lat * 0.19, sus + r * 0.03);
    ctx.stroke();
  }

  // cârligul
  ctx.strokeStyle = GLOB_AUR;
  ctx.lineWidth = Math.max(1, r * 0.030);
  ctx.beginPath();
  ctx.arc(0, sus - inalt - r * 0.075, r * 0.075, Math.PI * 0.15, Math.PI * 1.85);
  ctx.stroke();
}

/* Un ciob: pana tăiată din cerc, cu muchiile aprinse. Sticla nu se vede prin
   culoare, ci prin **muchie**: partea tăiată prinde lumina și e mai deschisă
   decât fața. */
function cioburileGlobului(t) {
  ctx.save();
  for (const c of s13.cioburi) {
    const stins = 1 - c.stins;
    if (stins <= 0.01) continue;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.unghi);
    const sc = 1 - c.stins * 0.75;
    ctx.scale(sc, sc);
    ctx.globalAlpha = stins;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(-c.r * 0.45, 0, c.r, c.a0, c.a1);
    ctx.closePath();

    const fata = ctx.createLinearGradient(0, -c.r * 0.4, 0, c.r * 0.4);
    fata.addColorStop(0, GLOB_APRINS);
    fata.addColorStop(0.5, GLOB_CORP);
    fata.addColorStop(1, GLOB_ADANC);
    ctx.fillStyle = fata;
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 226, 210, ${0.35 + c.stralucire * 0.5})`;
    ctx.lineWidth = Math.max(0.8, c.r * 0.022);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

/* Numele, pe negru. Nimic altceva: nici chenar, nici ornament, nici cursor.
   Un generic se citește în liniște. */
/* Rândul se traduce; numele, nu. */
const FINAL_RAND2 = 'Feliks Iacoblev-Barău';

function deseneazaNumele() {
  const p = atenuare(Math.min(1, s13.scris));
  const S = Math.min(W, H);
  ctx.save();
  ctx.globalAlpha = p;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = 'rgba(214, 208, 196, 0.85)';
  ctx.font = `italic ${Math.max(12, Math.round(S * 0.028))}px Georgia`;
  ctx.fillText(T('final.rand1'), W * 0.5, H * 0.47 - S * 0.035);

  ctx.fillStyle = 'rgba(244, 238, 226, 0.96)';
  ctx.font = `${Math.max(16, Math.round(S * 0.046))}px Georgia`;
  ctx.fillText(FINAL_RAND2, W * 0.5, H * 0.47 + S * 0.030);

  // o linie subțire între ele, cât numele — singurul ornament îngăduit
  const lat = ctx.measureText(FINAL_RAND2).width;
  ctx.globalAlpha = p * 0.45;
  ctx.strokeStyle = 'rgba(214, 208, 196, 1)';
  ctx.lineWidth = Math.max(1, S * 0.0015);
  ctx.beginPath();
  ctx.moveTo(W * 0.5 - lat * 0.34, H * 0.47 - S * 0.008);
  ctx.lineTo(W * 0.5 + lat * 0.34, H * 0.47 - S * 0.008);
  ctx.stroke();
  ctx.restore();
}

/* Pe negru, la generic, nu se mai plimbă nimic: cursorul luminos ar fi singurul
   lucru care se mișcă pe ecran, și ar cere să fie urmărit.

   **Albumul face excepție**, și trebuie să facă: acolo mai ai ceva de făcut —
   întorci filele cu degetul. Fără cursor nu se vedea unde ești, fiindcă și cel
   de sistem e ascuns de pagină: rămâneai să întorci pagini pe ghicite. Cursorul
   se ascunde abia la generic, unde nu mai e nimic de atins. */
function cursorulFinal() {
  return stare === 'final' && (s13.faza === 'adunare' || s13.faza === 'text');
}

/* Amestec de culori, numai pentru sala asta: `amesteca` stă în sala a cincea și
   n-are de ce să fie chemată de aici pentru două degradeuri. */
function amestecaFinal(a, b, cat) {
  const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
  const c = Math.max(0, Math.min(1, cat));
  const r = Math.round(((A >> 16) & 255) * (1 - c) + ((B >> 16) & 255) * c);
  const g = Math.round(((A >> 8) & 255) * (1 - c) + ((B >> 8) & 255) * c);
  const bl = Math.round((A & 255) * (1 - c) + (B & 255) * c);
  return `rgb(${r}, ${g}, ${bl})`;
}
