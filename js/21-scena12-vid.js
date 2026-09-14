/* ============================================================================
   SCENA A DOUĂSPREZECEA — VIDUL POTENȚIAL, ȘI BUCLA INFINITĂ

   Ultima sală, și singura fără nimic în ea. Nu are pereți, nu are texturi, nu
   are geometrie: e negrul absolut de dinainte ca muzeul să fie desenat — adică
   exact ecranul cu care a început jucăria.

   Toate celelalte unsprezece săli au fost despre materie: pastă, apă, cărbune,
   hârtie lipită. Asta e despre **codul sursă**, adică despre ce era acolo
   înainte de materie. De-aia nu se desenează nimic în ea. Un vid cu ceva în el
   n-ar mai fi vid, ar fi o cameră întunecată.

   Și, fiindcă e ultima, are voie să glumească. Muzeul tocmai a fost supt într-un
   buton; aici cineva îți șoptește că o luăm de la capăt și că data viitoare
   elefantul va fi roz. Distrugerea, în locul ăsta, nu e un sfârșit: e
   ocazia de a desena realitatea din nou.
   ========================================================================== */

const s12 = {
  faza: 'tacere',    // tacere → punct → flash → iesire
  t0: 0, ultimulCadru: 0,
  batere: 0,         // unde suntem în bătaia inimii, 0..1
  apropiere: 0,      // cât de aproape e mâna de punct
  aSoptit: false,
  cuvinte: 0,        // cât s-a ivit fraza șoptită
  flash: 0
};

/* Două șoapte, și una dintre ele.

   Prima oară prin vid, mai urmează un tur întreg: acolo promisiunea are ce să
   țină, iar elefantul chiar iese roz. A doua oară nu mai urmează un tur — după
   el vine globul de sticlă și numele. O promisiune făcută atunci n-ar avea cum
   să fie ținută, iar toată sala asta stă pe regula că **o glumă spusă
   jucătorului și neținută e mai rea decât una nespusă**.

   Așa că, la ultima trecere, rămâne numai întrebarea. Și ea sună altfel: prima
   oară e o glumă cu o promisiune după ea, a doua oară e o întrebare adevărată,
   pusă în gol, fără nimic care s-o îndulcească. */
/* Textul stă în `js/00-limbi.js`, ca tot ce citește jucătorul. Se cere cu
   `T(...)` **la desen**, nu o dată la încărcare: altfel, schimbată limba, ar
   rămâne cel de la pornire. */

/* Mai urmează un tur după ăsta? `turul` se ridică abia la ieșirea din vid, deci
   aici el arată încă turul care tocmai s-a terminat. */
function maiUrmeazaUnTur() { return turul < TURURI_PANA_LA_FINAL; }
function soaptaVidului() {
  return T(maiUrmeazaUnTur() ? 'vid.soaptaCuPromisiune' : 'vid.soaptaSimpla');
}

/* ---------- UNDE E PUNCTUL ----------
   Fix în mijloc, ca în prima scenă. Nu „aproape la mijloc": deja-vu-ul se face
   din potriveală exactă, iar un punct mutat cu treizeci de pixeli e alt punct. */
function loculPunctului() {
  return { x: W * 0.5, y: H * 0.5, r: Math.min(W, H) * 0.012 };
}

/* Cât de aproape e mâna. Se socotește pe o rază mare: sala e goală, deci
   apropierea trebuie să înceapă să se simtă cu mult înainte de a ajunge acolo —
   altfel n-ai afla niciodată că punctul te așteaptă. */
function apropiereaDePunct() {
  if (cursor.x < -100) return 0;
  const p = loculPunctului();
  const d = Math.hypot(cursor.x - p.x, cursor.y - p.y);
  return Math.max(0, Math.min(1, 1 - d / (Math.min(W, H) * 0.46)));
}

/* ---------- INTRAREA ȘI IEȘIREA ---------- */
function intraInVid(acum) {
  stare = 'vid';
  s12.faza = 'tacere'; s12.t0 = acum; s12.ultimulCadru = acum;
  s12.batere = 0; s12.apropiere = 0; s12.aSoptit = false;
  s12.cuvinte = 0; s12.flash = 0;
  opresteLinisteaIncordata();
  opresteNatura();
  opresteMuzicaMuzeu();
}

/* Bucla se închide aici. Nu se cheamă nicio „sală a treisprezecea": se cheamă
   chiar începutul, iar muzeul uită tot ce a fost — a fost înghițit cu galerii
   cu tot, în sala dinainte. */
function iesiDinVid(acum) {
  opresteInima();
  /* Și se ține promisiunea. O glumă spusă jucătorului și neținută e mai rea decât
     una nespusă: cine se întoarce anume ca să vadă elefantul roz și îl găsește
     albastru află că sala a mințit, nu că a glumit. */
  turul++;
  elefantulERoz = true;
  if (typeof zugravesteElefantul === 'function') zugravesteElefantul(true);
  incepeJucaria(acum);
}

/* ---------- CE SE ÎNTÂMPLĂ LA ATINGERE ---------- */
function click12(acum) {
  if (s12.faza !== 'punct') return;
  const p = loculPunctului();
  /* Ținta e generoasă: punctul e mic, dar el **e** singurul lucru din sală. Ar fi
     o glumă proastă să ceri ochire într-o cameră în care nu mai e nimic altceva
     de nimerit. */
  if (Math.hypot(cursor.x - p.x, cursor.y - p.y) > Math.min(W, H) * 0.14) return;
  s12.faza = 'flash'; s12.t0 = acum; s12.flash = 0.001;
  if (audio) { sunetFlash(); opresteInima(); }
}

/* ---------- CEASUL ---------- */
function actualizeazaVid(acum) {
  const dt = Math.max(0, Math.min(100, acum - (s12.ultimulCadru || acum)));
  s12.ultimulCadru = acum;
  tineInima();

  if (s12.faza === 'tacere') {
    /* Liniște deplină, întâi. Fără ea, sala a douăsprezecea ar fi doar sala a
       unsprezecea cu lumina stinsă; cu ea, e un loc în care nu s-a întâmplat
       încă nimic. Tăcerea nu e absența sunetului, e primul lucru care se aude. */
    if (acum - s12.t0 > 1900) {
      s12.faza = 'punct'; s12.t0 = acum;
      if (audio) pornesteInima();
    }
    return;
  }

  if (s12.faza === 'punct') {
    s12.batere = (s12.batere + dt / 1150) % 1;
    const tinta = apropiereaDePunct();
    s12.apropiere += (tinta - s12.apropiere) * Math.min(1, dt / 260);

    /* Șoapta vine când te-ai apropiat destul, o singură dată. Cuvintele rămân
       pe ecran după aceea: o glumă spusă în șoaptă și auzită pe jumătate nu e o
       glumă, e o nedumerire. */
    if (!s12.aSoptit && s12.apropiere > 0.52) {
      s12.aSoptit = true;
      if (audio) sunetSoapta(maiUrmeazaUnTur());
    }
    if (s12.aSoptit) s12.cuvinte = Math.min(1, s12.cuvinte + dt / 2400);
    return;
  }

  if (s12.faza === 'flash') {
    s12.flash = Math.min(1, s12.flash + dt / 900);
    if (s12.flash >= 1) { s12.faza = 'iesire'; s12.t0 = acum; }
    return;
  }

  if (s12.faza === 'iesire' && acum - s12.t0 > 260) iesiDinVid(acum);
}

/* ---------- DESENUL ---------- */
function deseneazaScena12(t, acum) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  if (s12.faza === 'tacere') return;

  const p = loculPunctului();
  const S = Math.min(W, H);

  if (s12.faza === 'flash' || s12.faza === 'iesire') {
    deseneazaFlashul(acum);
    return;
  }

  /* Pulsul: punctul crește și scade odată cu inima. Bătaia are două vârfuri, ca
     inima însăși — un puls dintr-un singur sinus ar fi o lumină care respiră,
     nu una care bate. */
  const b = s12.batere;
  const lovit = Math.exp(-Math.pow((b - 0.02) * 9, 2)) +
                Math.exp(-Math.pow((b - 0.19) * 11, 2)) * 0.55;
  const cat = 1 + lovit * 0.55 + s12.apropiere * 1.6;
  const r = p.r * cat;

  /* Haloul. Într-un negru absolut, un punct alb fără halou arată a pixel mort;
     cu halou, arată a sursă. Deosebirea e că sursa **luminează ceva**, chiar
     dacă în jurul ei nu e nimic de luminat. */
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const razaHalou = r * (7 + s12.apropiere * 6);
  const h = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, razaHalou);
  h.addColorStop(0, 'rgba(255, 255, 255, ' + (0.30 + lovit * 0.22 + s12.apropiere * 0.20).toFixed(3) + ')');
  h.addColorStop(0.28, 'rgba(226, 232, 240, ' + (0.09 + s12.apropiere * 0.10).toFixed(3) + ')');
  h.addColorStop(1, 'rgba(190, 205, 225, 0)');
  ctx.fillStyle = h;
  ctx.fillRect(p.x - razaHalou, p.y - razaHalou, razaHalou * 2, razaHalou * 2);
  ctx.restore();

  // punctul însuși
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* Fraza șoptită, scrisă. Foarte stinsă, fără casetă și fără chenar: o casetă ar
     face-o un anunț, iar asta e o vorbă spusă la ureche. Stă jos, departe de
     punct, ca să nu se uite nimeni la ea în loc să se uite la el. */
  if (s12.cuvinte > 0) {
    const marime = Math.max(13, S * 0.026);
    ctx.save();
    ctx.globalAlpha = Math.min(0.72, s12.cuvinte * 0.9);
    ctx.font = 'italic ' + Math.round(marime) + 'px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#cfd6e0';
    ctx.fillText(soaptaVidului(), W * 0.5, H * 0.80);
    ctx.restore();
  }

  /* Iar cine stă departe și nu se apropie primește, după o vreme, un semn:
     punctul trage spre el o dâră subțire de lumină, ca o clipire cu ochiul.
     Fără el, cineva ar putea privi un ecran negru cu un punct și nu ar ști
     niciodată că punctul îl așteaptă. */
  if (!s12.aSoptit && acum - s12.t0 > 7000 && s12.apropiere < 0.3 && cursor.x > -100) {
    const q = 0.5 + 0.5 * Math.sin(acum * 0.0022);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.10 + q * 0.14;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, S * 0.0016);
    ctx.setLineDash([S * 0.01, S * 0.028]);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(intre(p.x, cursor.x, 0.6), intre(p.y, cursor.y, 0.6));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

/* Flașul: punctul se face ecran.

   Nu e o albire a imaginii, e **creșterea punctului**. Toată sala a fost despre
   un singur punct alb; ar fi fost o trădare ca la sfârșit el să se stingă și
   ecranul să albească de altundeva. Ce te duce înapoi la început e chiar lucrul
   pe care l-ai atins. */
function deseneazaFlashul(acum) {
  const q = Math.min(1, s12.flash);
  const e = atenuare(q);
  const p = loculPunctului();
  const raza = Math.max(W, H) * 1.15 * e * e;

  ctx.save();
  const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, raza));
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.72, '#ffffff');
  g.addColorStop(0.9, 'rgba(232, 240, 252, 0.85)');
  g.addColorStop(1, 'rgba(200, 220, 250, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(1, raza), 0, Math.PI * 2);
  ctx.fill();

  // razele care fug din el, în ultima clipă
  ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 30; k++) {
    const a = samanta(9700 + k * 3.1), z = samanta(9760 + k * 7.7);
    const un = a * Math.PI * 2;
    const de = raza * (0.5 + z * 0.7);
    ctx.globalAlpha = (1 - q) * 0.5 * (0.3 + z * 0.5);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, Math.min(W, H) * 0.002 * (0.4 + z));
    ctx.beginPath();
    ctx.moveTo(p.x + Math.cos(un) * de * 0.35, p.y + Math.sin(un) * de * 0.35);
    ctx.lineTo(p.x + Math.cos(un) * de, p.y + Math.sin(un) * de);
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------- CURSORUL ----------
   În vid, mâna e o singură luminiță — și ea se stinge cu totul la flaș. N-ar
   avea niciun rost să rămână un cursor desenat peste ecranul care redevine
   începutul jucăriei. */
function cursorulScenei12() {
  if (stare !== 'vid') return false;
  if (s12.faza === 'flash' || s12.faza === 'iesire') return true;
  if (cursor.x < -100) return true;
  const S = Math.min(W, H);
  const r = S * 0.010 * (1 + s12.apropiere * 0.8);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, r * 5);
  g.addColorStop(0, 'rgba(214, 226, 245, 0.55)');
  g.addColorStop(1, 'rgba(214, 226, 245, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, r * 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#e8eefa';
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  return true;
}
