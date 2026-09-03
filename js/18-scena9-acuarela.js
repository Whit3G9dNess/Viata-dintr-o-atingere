/* ============================================================================
   SCENA A NOUA — SALA ACUARELEI

   Tema: hazardul fluid. Experiența: culorile pe bază de apă, relaxarea,
   dizolvarea, curgerea, scufundarea.

   Sala a opta a fost despre pastă: materie groasă, pusă cu cuțitul, care rămâne
   exact unde ai lăsat-o. Aici e pe dos, și tocmai asta se învață: **apa duce
   pigmentul unde vrea ea.** Tu dai apa; desenul se face singur.

   De-aia nu se pictează nimic în sala asta. Pe perete stă o foaie cu un desen
   grafic uscat — linii și puncte, palide, absorbite în hârtie. Jucătorul nu are
   pensulă: are un pulverizator. Stropește, iar liniile se dizolvă în laviu și
   punctele se prefac în spumă, în bărci, în soare. Nimic din ce apare n-a fost
   desenat de mâna lui — și totuși nimic n-ar fi apărut fără ea.

   Așa se simte acuarela: nu conduci, însoțești.
   ========================================================================== */

/* ---------- CULORILE ----------
   Trei pigmenți uscați pe hârtie, și cei doi în care se desfac la udare. Puțini
   dinadins: o acuarelă cu zece culori se face noroi, fiindcă apa le amestecă pe
   toate. Un laviu frumos are două-trei culori și mult alb de hârtie. */
const ALBASTRU_STERS = '#9db4cc';
const GRI_PERLAT     = '#c6c3bd';
const ROZ_CORAL      = '#e5a798';
const INDIGO_UD      = '#3f5c8c';
const CORAL_UD       = '#e2745a';
const HARTIE_BUMBAC  = '#f7f4ec';
const HARTIE_UMBRA   = '#ded8ca';

const OCHIURI_FOAIE = 22;        // cât de fin se socotește udarea foii

const s9 = {
  faza: 'intrare',     // intrare → uscat → inundat → plonjon → sedimentare → ziar → iesire
  t0: 0, ultimulCadru: 0,
  limpezire: 0,        // cât s-a limpezit sala la intrare
  celule: [],          // udarea, ochi cu ochi: 0 uscat, 1 leoarcă
  udare: 0,            // cât din foaie e udă, 0..1
  stropiri: 0,
  stropi: [],          // stropii care zboară acum prin aer
  siroaie: [],         // șiroaiele care se preling de pe foaie pe perete
  inundare: 0,         // cât a inundat marea podeaua
  plonjon: 0,          // cât de adânc ai coborât
  sedimentare: 0,      // cât s-au uscat culorile în fibre
  vorba: null,
  ultimaStropire: 0
};

/* ---------- MĂSURILE SĂLII ---------- */
function geomSala9() {
  const S = Math.min(W, H);
  const podea = H * 0.78;                 // unde peretele întâlnește podeaua

  /* Foaia: fixată pe perete, cu proporția unui bloc de acuarelă. Măsura ei
     pleacă de la înălțime, nu de la lățime, și din trei motive care se văd
     toate dacă lipsesc:

     - deasupra trebuie să încapă vorba sălii, care altfel cade peste hârtie;
     - dedesubt trebuie să rămână perete pentru șiroaie — iar șiroaiele sunt
       jumătate din ce are scena de arătat;
     - podeaua trebuie să se vadă înainte de a se face lac, altfel inundarea
       n-are ce să acopere.

     Prima oară am socotit-o din lățime și, pe un ecran lat, foaia ieșea cu
     capul afară din ecran și-i rămânea sub ea o podea goală de-o treime. */
  const foaieInalt = Math.min(H * 0.50, W * 0.36);
  const foaieLat = foaieInalt / 0.72;
  const foaieX = W * 0.5 - foaieLat / 2;
  const foaieY = H * 0.13;

  return {
    S, podea, foaieX, foaieY, foaieLat, foaieInalt,
    /* Pulverizatorul stă pe podea, la dreapta foii — nu agățat pe perete. Un
       obiect care plutește lângă lucrare arată a decor; unul pus jos, la
       îndemână, arată a unealtă lăsată acolo pentru tine. */
    pulvX: Math.min(W - S * 0.10, foaieX + foaieLat + S * 0.17),
    pulvY: podea + H * 0.055,
    pulvInalt: Math.min(H * 0.24, S * 0.30)
  };
}

/* Unde cade un ochi al foii, în fracțiuni. */
function ochiulFoii(i, j) {
  return { u: (i + 0.5) / OCHIURI_FOAIE, v: (j + 0.5) / OCHIURI_FOAIE };
}

function pregatesteOchiurileFoii() {
  s9.celule = [];
  for (let j = 0; j < OCHIURI_FOAIE; j++) {
    const rand = [];
    for (let i = 0; i < OCHIURI_FOAIE; i++) rand.push(0);
    s9.celule.push(rand);
  }
  s9.udare = 0;
}

/* Cât de udă e hârtia într-un punct dat în fracțiuni. Se ia din ochiul cel mai
   apropiat, netezit cu vecinii: apa nu se oprește la marginea unui pătrat. */
function udarealaFoaie(u, v) {
  if (!s9.celule.length) return 0;
  const fi = u * OCHIURI_FOAIE - 0.5, fj = v * OCHIURI_FOAIE - 0.5;
  const i0 = Math.floor(fi), j0 = Math.floor(fj);
  const ax = fi - i0, ay = fj - j0;
  const la = function (i, j) {
    if (i < 0 || j < 0 || i >= OCHIURI_FOAIE || j >= OCHIURI_FOAIE) return 0;
    return s9.celule[j][i];
  };
  return intre(intre(la(i0, j0), la(i0 + 1, j0), ax),
               intre(la(i0, j0 + 1), la(i0 + 1, j0 + 1), ax), ay);
}

/* Apa pulverizată udă hârtia în jurul locului atins, mai tare în mijloc.

   Și se **întinde singură**, puțin, la fiecare cadru: asta e chiar purtarea
   hârtiei ude, care trage apa din vecini prin fibre. Fără întindere, ai fi avut
   pete de udare cu marginea tăiată — adică exact ce nu face niciodată apa. */
function udaFoaia(x, y, raza) {
  const g = geomSala9();
  const u = (x - g.foaieX) / g.foaieLat, v = (y - g.foaieY) / g.foaieInalt;
  if (u < -0.1 || u > 1.1 || v < -0.1 || v > 1.1) return false;
  const ru = raza / g.foaieLat, rv = raza / g.foaieInalt;
  let atins = false;
  for (let j = 0; j < OCHIURI_FOAIE; j++) {
    for (let i = 0; i < OCHIURI_FOAIE; i++) {
      const o = ochiulFoii(i, j);
      const d = Math.hypot((o.u - u) / ru, (o.v - v) / rv);
      if (d > 1) continue;
      const cat = (1 - d) * 0.55;
      if (cat > 0) { s9.celule[j][i] = Math.min(1, s9.celule[j][i] + cat); atins = true; }
    }
  }
  return atins;
}

const RASPANDIRE = 0.06;   // cât trage fibra din vecinul mai ud
const SCURGERE = 0.012;    // cât trage gravitația în jos, peste răspândire

/* Apa se mută dintr-un ochi în altul, dar nu se pierde și nu se face din nimic.

   Prima socoteală trăgea fiecare ochi spre media vecinilor, cu vecinul de
   deasupra cântărind mai greu — arăta bine și era greșită: **media nu conservă
   nimic.** Din foaie se evaporau opt procente la fiecare zece secunde, așa că
   nu puteai s-o uzi niciodată de tot: stropeai într-un capăt și se usca în
   celălalt mai repede decât apucai să ajungi acolo. Sala nu se termina, și nu
   se vedea de ce.

   Acum apa curge **între perechi de vecini**: cât iese dintr-un ochi, exact
   atâta intră în celălalt. Gravitația e un al doilea curent, tot între doi
   vecini, tot conservat. Pe rândul de jos n-are unde să ducă apa, și ea se
   adună acolo — exact locul de unde pornesc șiroaiele. */
function raspandesteApa() {
  if (!s9.celule.length) return;
  const N = OCHIURI_FOAIE, cel = s9.celule, dif = [];
  for (let j = 0; j < N; j++) {
    const r = [];
    for (let i = 0; i < N; i++) r.push(0);
    dif.push(r);
  }

  // mută apa dintr-un ochi în vecin, fără să treacă peste cât încape acolo
  const muta = function (i0, j0, i1, j1, cat) {
    if (cat <= 0) return;
    const loc = 1 - (cel[j1][i1] + dif[j1][i1]);
    const chiar = Math.min(cat, Math.max(0, loc));
    dif[j0][i0] -= chiar;
    dif[j1][i1] += chiar;
  };

  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const a = cel[j][i];
      if (i + 1 < N) {
        const b = cel[j][i + 1];
        if (a > b) muta(i, j, i + 1, j, (a - b) * RASPANDIRE);
        else muta(i + 1, j, i, j, (b - a) * RASPANDIRE);
      }
      if (j + 1 < N) {
        const b = cel[j + 1][i];
        if (a > b) muta(i, j, i, j + 1, (a - b) * RASPANDIRE);
        else muta(i, j + 1, i, j, (b - a) * RASPANDIRE);
        muta(i, j, i, j + 1, a * SCURGERE);
      }
    }
  }

  let suma = 0;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const v = Math.max(0, Math.min(1, cel[j][i] + dif[j][i]));
      cel[j][i] = v;
      suma += v;
    }
  }
  s9.udare = suma / (N * N);
}

/* ---------- CUM SE DESENEAZĂ ACUARELA ----------

   Trei lucruri fac o pată să pară acuarelă, și niciunul nu e culoarea:

   1. **Marginea strâmbă.** Apa nu curge în cerc. Conturul se face dintr-o rază
      căreia i se adaugă trei sinusuri cu perioade care nu se împart una la alta —
      așa nu se repetă niciodată vizibil și nu iese nici floare, nici stea.
   2. **Marginea mai apăsată decât mijlocul.** Când balta se usucă, pigmentul e
      împins spre margine și se adună acolo. E fix pe dos față de ulei, unde
      creasta prinde lumina la mijloc. Dunga asta închisă pe contur e semnul cel
      mai sigur al acuarelei — fără ea, orice pată e o pată de vopsea.
   3. **Granulația.** Pigmentul se așază în adânciturile hârtiei și lasă
      suprafața pistruiată. De-aia acuarela nu e niciodată netedă. */
function conturDeApa(c, x, y, r, sam, turtire) {
  const t = turtire === undefined ? 1 : turtire;
  c.beginPath();
  const PASI = 44;
  for (let k = 0; k <= PASI; k++) {
    const a = (k / PASI) * Math.PI * 2;
    const val = 1
      + 0.13 * Math.sin(a * 2.0 + sam)
      + 0.09 * Math.sin(a * 3.0 + sam * 1.7)
      + 0.055 * Math.sin(a * 5.0 + sam * 2.3);
    const px = x + Math.cos(a) * r * val;
    const py = y + Math.sin(a) * r * val * t;
    if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
  }
  c.closePath();
}

function pataDeAcuarela(c, x, y, r, culoare, intens, sam, turtire) {
  if (intens <= 0.005 || r <= 0.4) return;
  c.save();

  // corpul petei: tare la margine, stins la mijloc — laviul e translucid
  const miez = c.createRadialGradient(x, y, 0, x, y, r * 1.05);
  miez.addColorStop(0, amesteca(culoare, '#ffffff', 0.34));
  miez.addColorStop(0.62, culoare);
  miez.addColorStop(1, culoare);
  c.globalAlpha = 0.44 * intens;
  c.fillStyle = miez;
  conturDeApa(c, x, y, r, sam, turtire);
  c.fill();

  /* Dunga de pe contur: pigmentul împins de apă spre margine. Se trage cu același
     contur, cu linie groasă tăiată la formă — rămâne numai partea dinăuntru. */
  c.save();
  conturDeApa(c, x, y, r, sam, turtire);
  c.clip();
  c.globalAlpha = 0.30 * intens;
  c.strokeStyle = amesteca(culoare, '#243a52', 0.30);
  c.lineWidth = Math.max(1, r * 0.15);
  conturDeApa(c, x, y, r * 0.99, sam, turtire);
  c.stroke();

  // granulația: pigment adunat în adânciturile hârtiei
  c.globalAlpha = 0.20 * intens;
  c.fillStyle = amesteca(culoare, '#2b3c52', 0.4);
  for (let k = 0; k < 26; k++) {
    const a = samanta(sam * 31.7 + k * 3.1) * Math.PI * 2;
    const d = Math.sqrt(samanta(sam * 17.3 + k * 5.9)) * r * 0.92;
    c.beginPath();
    c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * (turtire || 1),
          Math.max(0.5, r * 0.022), 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
  c.restore();
}

/* ---------- HÂRTIA ----------
   Textura hârtiei de bumbac presate la rece: nu un zgomot mărunt, ci **gropi
   rotunde**, neregulate, cât un fir de nisip. Ea se vede și pe pereți, fiindcă
   sala întreagă e făcută din hârtia asta. */
const hartiaSalii = { panza: null, latime: 0, inaltime: 0 };

function pregatesteHartia() {
  if (hartiaSalii.panza && hartiaSalii.latime === W && hartiaSalii.inaltime === H) {
    return hartiaSalii.panza;
  }
  const p = panzaDeLucru(hartiaSalii, W, H);
  const c = p.getContext('2d');
  c.clearRect(0, 0, W, H);
  const cate = Math.round((W * H) / 900);
  for (let k = 0; k < cate; k++) {
    const a = samanta(5100 + k * 3.1), b = samanta(5160 + k * 7.7);
    const e = samanta(5220 + k * 5.3);
    c.globalAlpha = 0.05 + e * 0.07;
    c.fillStyle = e > 0.5 ? '#ffffff' : '#b9b2a2';
    c.beginPath();
    c.ellipse(a * W, b * H, 1 + e * 2.2, 1 + (1 - e) * 1.8, e * 3, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
  hartiaSalii.latime = W; hartiaSalii.inaltime = H;
  return p;
}

/* ---------- SALA, PICTATĂ O DATĂ ---------- */
const salaAcuarela = { panza: null, latime: 0, inaltime: 0 };

function pregatesteSalaAcuarela() {
  if (salaAcuarela.panza && salaAcuarela.latime === W && salaAcuarela.inaltime === H) {
    return salaAcuarela.panza;
  }
  const p = panzaDeLucru(salaAcuarela, W, H);
  const c = p.getContext('2d');
  c.clearRect(0, 0, W, H);
  pictezaSalaAcuarela(c);
  salaAcuarela.latime = W; salaAcuarela.inaltime = H;
  return p;
}

function pictezaSalaAcuarela(c) {
  const g = geomSala9();

  /* Lumina: albă, difuză, ca o dimineață de primăvară. Nu vine dintr-un bec, ci
     de peste tot — de-aia n-are nicio umbră tare nicăieri. O sală de acuarelă
     luminată cu spoturi ar fi o contradicție: acuarela se uită la lumina zilei. */
  const aer = c.createLinearGradient(0, 0, 0, H);
  aer.addColorStop(0, '#fdfcf8');
  aer.addColorStop(0.55, HARTIE_BUMBAC);
  aer.addColorStop(1, '#efeade');
  c.fillStyle = aer;
  c.fillRect(0, 0, W, H);

  // podeaua, abia mai închisă decât peretele
  c.fillStyle = '#eae4d6';
  c.fillRect(0, g.podea, W, H - g.podea);

  /* Plinta și balta de lumină de pe podea. Sunt singurele două lucruri din sală
     în afară de foaie, și n-au fost puse ca podoabă: fără ele, doi pereți
     întregi de crem rămân o suprafață plată în care nu se înțelege nici cât e de
     mare camera, nici de unde vine lumina. Iar lumina trebuie să se înțeleagă
     de undeva: e albă și difuză, ca o dimineață, și asta e tot ce are sala în
     loc de becuri. */
  const plinta = Math.max(2, g.S * 0.018);
  const pl = c.createLinearGradient(0, g.podea - plinta, 0, g.podea);
  pl.addColorStop(0, '#f3efe4');
  pl.addColorStop(1, '#ded7c6');
  c.fillStyle = pl;
  c.fillRect(0, g.podea - plinta, W, plinta);
  c.strokeStyle = 'rgba(150, 140, 120, 0.45)';
  c.lineWidth = Math.max(1, g.S * 0.0016);
  c.beginPath();
  c.moveTo(0, g.podea); c.lineTo(W, g.podea);
  c.moveTo(0, g.podea - plinta); c.lineTo(W, g.podea - plinta);
  c.stroke();

  // balta de lumină dinspre stânga, lățită pe podea
  const balta = c.createLinearGradient(0, g.podea, W * 0.62, H);
  balta.addColorStop(0, 'rgba(255,255,255,0.55)');
  balta.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = balta;
  c.beginPath();
  c.moveTo(0, g.podea);
  c.lineTo(W * 0.30, g.podea);
  c.lineTo(W * 0.62, H);
  c.lineTo(0, H);
  c.closePath();
  c.fill();

  // colțurile, abia umbrite — atât cât camera să nu fie o coală plată
  const colt = c.createRadialGradient(W * 0.5, H * 0.42, g.S * 0.35,
                                      W * 0.5, H * 0.42, Math.max(W, H) * 0.8);
  colt.addColorStop(0, 'rgba(0,0,0,0)');
  colt.addColorStop(1, 'rgba(120, 112, 92, 0.16)');
  c.fillStyle = colt;
  c.fillRect(0, 0, W, H);

  // textura hârtiei, peste tot
  c.globalAlpha = 0.75;
  c.drawImage(pregatesteHartia(), 0, 0);
  c.globalAlpha = 1;

  // foaia de pe perete, cu umbra ei subțire
  c.fillStyle = 'rgba(140, 130, 110, 0.22)';
  c.fillRect(g.foaieX + g.S * 0.008, g.foaieY + g.S * 0.010, g.foaieLat, g.foaieInalt);
  c.fillStyle = '#fffdf7';
  c.fillRect(g.foaieX, g.foaieY, g.foaieLat, g.foaieInalt);
  c.globalAlpha = 0.9;
  c.drawImage(pregatesteHartia(), 0, 0);
  c.globalAlpha = 1;
  /* Marginea deckle a hârtiei făcute manual: nu tăiată drept, ci ruptă. E
     amănuntul care spune „hârtie de bumbac", nu „carton". */
  c.strokeStyle = 'rgba(150, 138, 116, 0.5)';
  c.lineWidth = Math.max(1, g.S * 0.0016);
  c.beginPath();
  for (let k = 0; k <= 60; k++) {
    const q = k / 60, z = samanta(5400 + k * 3.7);
    const x = g.foaieX + q * g.foaieLat;
    if (k === 0) c.moveTo(x, g.foaieY + (z - 0.5) * g.S * 0.005);
    else c.lineTo(x, g.foaieY + (z - 0.5) * g.S * 0.005);
  }
  for (let k = 0; k <= 60; k++) {
    const q = k / 60, z = samanta(5500 + k * 3.7);
    c.lineTo(g.foaieX + g.foaieLat + (z - 0.5) * g.S * 0.005,
             g.foaieY + q * g.foaieInalt);
  }
  for (let k = 60; k >= 0; k--) {
    const q = k / 60, z = samanta(5600 + k * 3.7);
    c.lineTo(g.foaieX + q * g.foaieLat,
             g.foaieY + g.foaieInalt + (z - 0.5) * g.S * 0.005);
  }
  for (let k = 60; k >= 0; k--) {
    const q = k / 60, z = samanta(5700 + k * 3.7);
    c.lineTo(g.foaieX + (z - 0.5) * g.S * 0.005, g.foaieY + q * g.foaieInalt);
  }
  c.closePath();
  c.stroke();

  // piunezele care o țin
  for (const [fu, fv] of [[0.04, 0.03], [0.96, 0.03], [0.04, 0.97], [0.96, 0.97]]) {
    const x = g.foaieX + fu * g.foaieLat, y = g.foaieY + fv * g.foaieInalt;
    const r = g.S * 0.008;
    const met = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    met.addColorStop(0, '#ffffff');
    met.addColorStop(0.5, '#c9ccd0');
    met.addColorStop(1, '#84898f');
    c.fillStyle = met;
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
}

/* ---------- DESENUL DE PE FOAIE ----------

   Uscat, arată a design grafic minimalist: linii orizontale subțiri și puncte
   răzlețe, în trei culori spălăcite. Nu seamănă cu nimic — și e important să nu
   semene, fiindcă tot rostul scenei e că **apa îi dă înțeles**.

   Fiecare element știe ce va deveni. Nu se schimbă în altceva: se **desface** în
   ce era deja, cum se desface o floare de hârtie pusă în apă. */
/* Liniile nu traversează foaia dintr-o margine în alta: fiecare începe și se
   termină unde vrea ea. E singura deosebire dintre un desen și o coală
   dictando, și am văzut-o abia când le-am făcut pe toate lungi — ieșise un
   caiet de matematică, nu o lucrare.

   Cu atât mai mult, la udare fiecare se întinde până la marginile foii. Zarea se
   deschide: din nouă bucăți de linie răzlețe se face un orizont întreg. */
const LINII_FOAIE = [
  { v: 0.10, gros: 0.016, de: 0.10, pana: 0.55, culoare: ALBASTRU_STERS, uda: INDIGO_UD },
  { v: 0.20, gros: 0.022, de: 0.30, pana: 0.92, culoare: ALBASTRU_STERS, uda: INDIGO_UD },
  { v: 0.31, gros: 0.018, de: 0.08, pana: 0.42, culoare: GRI_PERLAT,     uda: '#8aa0bd' },
  { v: 0.41, gros: 0.026, de: 0.22, pana: 0.80, culoare: ROZ_CORAL,      uda: CORAL_UD },
  { v: 0.50, gros: 0.020, de: 0.55, pana: 0.95, culoare: ROZ_CORAL,      uda: '#e8896c' },
  // linia zării: singura care, și uscată, taie foaia dintr-un capăt în altul
  { v: 0.58, gros: 0.030, de: 0.06, pana: 0.96, culoare: ALBASTRU_STERS, uda: '#4a6f9c' },
  { v: 0.68, gros: 0.022, de: 0.14, pana: 0.62, culoare: ALBASTRU_STERS, uda: '#3f5c8c' },
  { v: 0.79, gros: 0.026, de: 0.35, pana: 0.94, culoare: GRI_PERLAT,     uda: '#5b7ba6' },
  { v: 0.90, gros: 0.020, de: 0.10, pana: 0.70, culoare: ALBASTRU_STERS, uda: '#33507c' }
];

const PUNCTE_FOAIE = [
  // soarele: un punct mare roz-coral, sus în stânga zării
  { u: 0.30, v: 0.44, r: 0.030, rol: 'soare', culoare: ROZ_CORAL, uda: CORAL_UD },
  // bărcile: puncte dese, mărunte, chiar pe linia orizontului
  { u: 0.60, v: 0.575, r: 0.017, rol: 'barca', culoare: GRI_PERLAT, uda: '#2f4666' },
  { u: 0.67, v: 0.578, r: 0.013, rol: 'barca', culoare: GRI_PERLAT, uda: '#2f4666' },
  { u: 0.73, v: 0.572, r: 0.010, rol: 'barca', culoare: GRI_PERLAT, uda: '#3a5274' },
  { u: 0.43, v: 0.576, r: 0.012, rol: 'barca', culoare: GRI_PERLAT, uda: '#35496b' },
  // spuma: grupuri mici de puncte, jos, unde valurile se sparg la țărm
  { u: 0.18, v: 0.76, r: 0.014, rol: 'spuma', culoare: GRI_PERLAT, uda: '#ffffff' },
  { u: 0.27, v: 0.83, r: 0.017, rol: 'spuma', culoare: GRI_PERLAT, uda: '#ffffff' },
  { u: 0.46, v: 0.79, r: 0.013, rol: 'spuma', culoare: GRI_PERLAT, uda: '#ffffff' },
  { u: 0.62, v: 0.86, r: 0.018, rol: 'spuma', culoare: GRI_PERLAT, uda: '#ffffff' },
  { u: 0.78, v: 0.80, r: 0.015, rol: 'spuma', culoare: GRI_PERLAT, uda: '#ffffff' },
  { u: 0.88, v: 0.88, r: 0.012, rol: 'spuma', culoare: GRI_PERLAT, uda: '#ffffff' }
];

/* Laviul gradat de fond: indigo sus, coral la zare, indigo adânc jos. E stratul
   care leagă benzile într-un apus — fără el rămân niște dungi colorate puse una
   lângă alta.

   Se face pe o pânză mică, deoparte, și abia pe urmă se pune pe foaie. Motivul e
   întreaga socoteală: culoarea vine de sus în jos, iar udarea de la stânga la
   dreapta, și un degrade nu poate merge în două direcții deodată. Aici însă
   pot: umplu tot cu degradeul vertical, apoi **șterg** cu unul orizontal, acolo
   unde hârtia e încă uscată. Ștersul e sigur fiindcă e pe pânza mea; făcut
   direct pe ecran, ar fi găurit sala de dedesubt.

   Prima variantă punea douăsprezece dreptunghiuri unul lângă altul, cu un pixel
   de suprapunere. Acolo unde se atingeau, transparența se aduna de două ori și
   rămânea o dungă verticală: douăsprezece linii de caiet peste o mărie. În apă
   nu există muchii verticale, deci nu au ce căuta nici în socoteală. */
const fondulLaviului = { panza: null, latime: 0, inaltime: 0 };
const COLOANE_FOAIE = 12;

function panzaFondului(catGlobal) {
  const LAT = 128, INALT = 128;
  const p = panzaDeLucru(fondulLaviului, LAT, INALT);
  const c = p.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'source-over';
  c.globalAlpha = 1;
  c.clearRect(0, 0, LAT, INALT);

  const fond = c.createLinearGradient(0, 0, 0, INALT);
  fond.addColorStop(0.00, INDIGO_UD);
  fond.addColorStop(0.40, amesteca(INDIGO_UD, CORAL_UD, 0.6));
  fond.addColorStop(0.52, CORAL_UD);
  fond.addColorStop(0.62, amesteca(CORAL_UD, INDIGO_UD, 0.75));
  fond.addColorStop(1.00, '#2b4670');
  c.fillStyle = fond;
  c.fillRect(0, 0, LAT, INALT);

  // acum se scoate culoarea de unde n-a ajuns încă apa
  const masca = c.createLinearGradient(0, 0, LAT, 0);
  for (let q = 0; q <= COLOANE_FOAIE; q++) {
    const fu = q / COLOANE_FOAIE;
    let ud = 0;
    for (let r = 0; r < 5; r++) ud += udarealaFoaie(fu, (r + 0.5) / 5);
    ud = Math.min(1, (ud / 5) * catGlobal * 1.3);
    masca.addColorStop(fu, 'rgba(0,0,0,' + (1 - ud).toFixed(3) + ')');
  }
  c.globalCompositeOperation = 'destination-out';
  c.fillStyle = masca;
  c.fillRect(0, 0, LAT, INALT);
  c.globalCompositeOperation = 'source-over';
  return p;
}

/* O bandă de laviu: o panglică orizontală cu marginile ondulate, subțiată la
   capete, umplută cu un degrade care se stinge și în sus, și în jos.

   Întâi le făcusem din câte șapte pete rotunde puse una lângă alta, fiecare cu
   conturul și cu dunga ei de pigment. Nouă benzi înmulțite cu șapte pete au dat
   șaizeci și trei de contururi suprapuse: nu semăna cu o spălare de acuarelă, ci
   cu un ghem de baloane de săpun. De unde regula, care e a acuarelei, nu a
   codului: **dunga de pigment se adună la marginea bălții, nu în mijlocul ei.**
   O spălare are o singură margine, oricât de mare ar fi. Deci o singură formă,
   și o singură dungă — pe muchia de jos, unde apa stă ultima și lasă pigmentul
   când se retrage.

   Subțierea la capete nu e podoabă: o spălare nu se termină niciodată tăiat
   drept. Iar grosimea urmează udarea de sub ea, așa că banda rămâne firavă
   acolo unde n-ai stropit — de aceea zarea se deschide dinspre mâna ta. */
function bandaDeLaviu(c, x, y, w, h, L, de, pana, ud, catGlobal, k) {
  const yy = y + L.v * h;
  const gros = h * L.gros * (1.7 + ud * 3.4);
  const N = 30;
  const sus = [], jos = [];
  for (let q = 0; q <= N; q++) {
    const f = q / N;
    const fu = de + f * (pana - de);
    const px = x + fu * w;
    // se subțiază spre capete, și acolo unde hârtia e încă uscată
    const udLoc = Math.min(1, udarealaFoaie(fu, L.v) * catGlobal * 1.15);
    /* Capătul benzii se stinge pe o fâșie și atât: lungă câtă vreme hârtia e
       uscată, scurtă când s-a îmbibat.

       Am încercat întâi cu o putere a sinusului, și am tot greșit în amândouă
       felurile: cu puterea mare ieșeau nouă cârnăciori puși unul peste altul,
       cu ea mică ieșeau lespezi cu colțurile tăiate — tot un desen făcut din
       muchii. Și într-un fel, și în celălalt, ochiul vedea marginile benzilor
       în loc să vadă zarea. */
    const marg = intre(0.30, 0.06, ud);
    const capat = Math.min(1, Math.sin(Math.PI * f) / Math.sin(Math.PI * marg));
    const val = 1 + 0.34 * Math.sin(f * 7.1 + k * 2.3)
                  + 0.20 * Math.sin(f * 13.7 + k * 1.1)
                  + 0.12 * Math.sin(f * 23.3 + k * 0.7);
    const gr = gros * val * capat * (0.28 + 0.72 * udLoc);
    sus.push([px, yy - gr]);
    jos.push([px, yy + gr * 0.92]);
  }

  c.save();
  c.beginPath();
  for (let q = 0; q < sus.length; q++) {
    if (q === 0) c.moveTo(sus[q][0], sus[q][1]); else c.lineTo(sus[q][0], sus[q][1]);
  }
  for (let q = jos.length - 1; q >= 0; q--) c.lineTo(jos[q][0], jos[q][1]);
  c.closePath();

  const g2 = c.createLinearGradient(0, yy - gros, 0, yy + gros);
  g2.addColorStop(0, 'rgba(255,255,255,0)');
  g2.addColorStop(0.16, L.uda);
  g2.addColorStop(0.86, L.uda);
  g2.addColorStop(1, 'rgba(255,255,255,0)');
  c.globalAlpha = 0.40 * ud;
  c.fillStyle = g2;
  c.fill();

  // granulația: pigment așezat în adânciturile hârtiei, numai înăuntrul bălții
  c.clip();
  c.globalAlpha = 0.13 * ud;
  c.fillStyle = amesteca(L.uda, '#22344c', 0.45);
  for (let q = 0; q < 70; q++) {
    const a = samanta(800 + k * 17.3 + q * 3.1), b = samanta(860 + k * 5.9 + q * 7.7);
    c.beginPath();
    c.arc(x + (de + a * (pana - de)) * w, yy + (b - 0.5) * gros * 2.0,
          Math.max(0.5, gros * 0.045), 0, Math.PI * 2);
    c.fill();
  }
  c.restore();

  // dunga de pigment de pe muchia de jos, singura margine a spălării
  c.save();
  c.globalAlpha = 0.22 * ud;
  c.strokeStyle = amesteca(L.uda, '#1d2c42', 0.35);
  c.lineWidth = Math.max(0.8, gros * 0.16);
  c.beginPath();
  for (let q = 0; q < jos.length; q++) {
    if (q === 0) c.moveTo(jos[q][0], jos[q][1]); else c.lineTo(jos[q][0], jos[q][1]);
  }
  c.stroke();
  c.restore();
}

/* Desenul, la starea de udare de acum. `catUd` merge de la 0 (uscat, grafic) la
   1 (laviu întreg). Se desenează pe pânza `c`, în dreptunghiul dat — așa aceeași
   funcție face și foaia de pe perete, și oglindirea ei din podea. */
function deseneazaLucrarea(c, x, y, w, h, catGlobal) {
  c.save();
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();

  /* 0. Laviul gradat de fond: indigo sus, coral la zare, indigo adânc jos.
     E stratul care leagă totul într-un apus — fără el, benzile rămân niște
     dungi colorate una lângă alta. Se pune pe coloane, fiecare cu udarea ei, ca
     să se vadă că laviul crește de unde ai stropit, nu deodată peste tot. */
  c.globalAlpha = 0.30;
  c.drawImage(panzaFondului(catGlobal), x, y, w, h);
  c.globalAlpha = 1;

  // 1. benzile: fiecare linie se lățește într-un laviu și se topește în vecina ei
  for (let k = 0; k < LINII_FOAIE.length; k++) {
    const L = LINII_FOAIE[k];
    const ud = Math.min(1, udarealaFoaie(0.5, L.v) * catGlobal * 1.15);
    const yy = y + L.v * h;
    const de = intre(L.de, 0.02, ud), pana = intre(L.pana, 0.98, ud);

    if (ud < 0.98) {
      // partea încă uscată: dunga subțire, grafică
      c.globalAlpha = (1 - ud) * 0.55;
      c.fillStyle = L.culoare;
      c.fillRect(x + w * de, yy - h * L.gros * 0.18, w * (pana - de), h * L.gros * 0.36);
    }
    if (ud > 0.02) bandaDeLaviu(c, x, y, w, h, L, de, pana, ud, catGlobal, k);
  }

  // 2. punctele care capătă sens
  for (let k = 0; k < PUNCTE_FOAIE.length; k++) {
    const P = PUNCTE_FOAIE[k];
    const ud = Math.min(1, udarealaFoaie(P.u, P.v) * catGlobal * 1.2);
    const px = x + P.u * w, py = y + P.v * h;
    const r0 = Math.min(w, h) * P.r;

    if (ud < 0.95) {
      c.globalAlpha = (1 - ud) * 0.6;
      c.fillStyle = P.culoare;
      c.beginPath();
      c.arc(px, py, r0 * (1 - ud * 0.4), 0, Math.PI * 2);
      c.fill();
    }
    if (ud <= 0.02) continue;

    if (P.rol === 'soare') {
      /* Soarele: punctul se întinde într-un halou care se stinge în zare. E
         singurul element care crește **rotund** — restul se lățește sau se
         răsfiră, fiindcă doar soarele e un lucru rotund.

         Și singurul fără dunga închisă pe contur, deși toată sala e făcută din
         ea: pigmentul se strânge la marginea bălții peste tot, dar un soare cu
         cerc întunecat în jur nu mai e soare, e o pată. Lucrul cel mai luminos
         din tablou nu poate avea margine mai închisă decât mijlocul. */
      const R = r0 * (1 + ud * 3.6);
      const halou = c.createRadialGradient(px, py, 0, px, py, R * 1.9);
      halou.addColorStop(0, amesteca(P.uda, '#fff4de', 0.8));
      halou.addColorStop(0.32, P.uda);
      halou.addColorStop(1, 'rgba(255,255,255,0)');
      c.globalAlpha = ud * 0.75;
      c.fillStyle = halou;
      c.beginPath();
      c.arc(px, py, R * 1.9, 0, Math.PI * 2);
      c.fill();
      /* Discul, lăsat aproape alb. În acuarelă lumina nu se pune, se **lasă**:
         hârtia nealbastrită e tot ce ai în loc de alb. De-aia soarele nu e o
         culoare mai tare, ci o gaură mai palidă în laviu. */
      c.globalAlpha = ud * 0.8;
      c.fillStyle = amesteca(P.uda, '#fffaf0', 0.78);
      conturDeApa(c, px, py, R * 0.62, 700 + k * 7.3, 1);
      c.fill();
    } else if (P.rol === 'barca') {
      /* Bărcile: punctul se strânge într-o cocă și scoate un catarg. Nu se
         lățește — se **ascute**. O barcă în depărtare e o virgulă întunecată. */
      const cat = r0 * (1.5 + ud * 1.3);      // înălțimea catargului
      c.globalAlpha = ud * 0.85;
      c.fillStyle = P.uda;
      // coca: o virgulă groasă, cu fundul rotund
      c.beginPath();
      c.moveTo(px - r0 * 1.9, py - r0 * 0.15);
      c.quadraticCurveTo(px, py + r0 * 1.15, px + r0 * 1.9, py - r0 * 0.15);
      c.quadraticCurveTo(px, py + r0 * 0.10, px - r0 * 1.9, py - r0 * 0.15);
      c.closePath();
      c.fill();
      /* Pânza: un triunghi între catarg și provă. Fără ea, punctele de pe zare
         arătau a semne de carte, nu a bărci — o barcă de departe se cunoaște
         după pânză, nu după cocă. */
      c.beginPath();
      c.moveTo(px - r0 * 0.12, py - r0 * 0.2);
      c.lineTo(px - r0 * 0.12, py - cat);
      c.lineTo(px + r0 * 1.25, py - r0 * 0.25);
      c.closePath();
      c.fill();
      c.strokeStyle = P.uda;
      c.lineWidth = Math.max(0.7, r0 * 0.20);
      c.beginPath();
      c.moveTo(px - r0 * 0.12, py - r0 * 0.1);
      c.lineTo(px - r0 * 0.12, py - cat);
      c.stroke();
      // oglindirea ei în apă, tremurată
      c.globalAlpha = ud * 0.28;
      c.beginPath();
      c.moveTo(px - r0 * 1.2, py + r0 * 0.55);
      c.quadraticCurveTo(px, py + r0 * 2.0, px + r0 * 1.2, py + r0 * 0.55);
      c.stroke();
    } else {
      /* Spuma: grupul se răsfiră în multe pete mici și albe, fără margine
         apăsată. Spuma e singurul lucru din tablou care nu are contur — de-aia
         nu se desenează cu `pataDeAcuarela`, ci cu bulbuci. */
      /* Spuma stă pe creasta valului, adunată într-o dungă care urcă și
         coboară. Prima oară o risipisem la întâmplare într-un dreptunghi și
         arăta a praf scăpat pe tablou: spuma nu e împrăștiată, e **înșirată**. */
      c.globalAlpha = ud * 0.75;
      const lat = r0 * 7.0 * (0.5 + ud * 0.5);
      // umbra albăstruie de sub creastă, ca să nu plutească albul în gol
      c.fillStyle = amesteca('#ffffff', ALBASTRU_STERS, 0.55);
      c.beginPath();
      c.ellipse(px, py + r0 * 0.5, lat * 0.52, r0 * 0.45, 0, 0, Math.PI * 2);
      c.fill();
      for (let q = 0; q < 16; q++) {
        const a = samanta(760 + k * 11.3 + q * 3.7);
        const b = samanta(790 + k * 5.9 + q * 7.1);
        const f = (q + a * 0.6) / 16;
        c.fillStyle = q % 4 ? '#ffffff' : amesteca('#ffffff', ALBASTRU_STERS, 0.3);
        c.beginPath();
        c.ellipse(px + (f - 0.5) * lat,
                  py + Math.sin(f * 6.4 + k) * r0 * 0.5 + (b - 0.5) * r0 * 0.45,
                  r0 * (0.30 + a * 0.44), r0 * (0.09 + b * 0.12),
                  0, 0, Math.PI * 2);
        c.fill();
      }
    }
  }

  c.globalAlpha = 1;
  c.restore();
}

/* Ștampila lucrării.

   Laviul întreg înseamnă vreo trei mii de operații de desen: douăsprezece coloane
   de fond, nouă benzi cu câte două contururi de treizeci de puncte, șaptezeci de
   boabe de granulație și o dungă de pigment fiecare, plus soarele, bărcile și
   spuma. Atât o dată e ieftin. De șaizeci de ori pe secundă, și **de două ori**
   pe cadru când podeaua s-a făcut oglindă, e sala a doua de la început: mouse-ul
   în melasă. Aici s-a văzut mai întâi la teste, care s-au împotmolit de tot.

   Deci laviul se pictează pe o pânză a lui și se pune pe perete dintr-o mutare,
   iar oglindirea din podea folosește aceeași pânză, întoarsă — nu se mai
   desenează a doua oară.

   Se reface numai când s-a schimbat ceva, și cel mult de zece ori pe secundă:
   apa se întinde încet, iar un laviu care se îngroașă nu se vede cu ochiul de la
   un cadru la altul. Când foaia stă uscată și n-o atinge nimeni, nu se reface
   deloc. */
const stampaLucrarii = { panza: null, latime: 0, inaltime: 0 };
const semnulLucrarii = { valoare: -1, cand: -1e9, lat: 0, inalt: 0 };

/* Un număr care se schimbă la orice mișcare a apei prin foaie — nu media udării,
   care poate să stea pe loc câtă vreme apa doar se mută dintr-un ochi în altul. */
function semnulUdarii() {
  if (!s9.celule.length) return 0;
  let sum = 0;
  for (let j = 0; j < OCHIURI_FOAIE; j++) {
    for (let i = 0; i < OCHIURI_FOAIE; i++) sum += s9.celule[j][i] * (i + 1) * (j + 1);
  }
  return sum;
}

function panzaLucrarii(acum) {
  const g = geomSala9();
  const lat = Math.max(2, Math.min(760, Math.round(g.foaieLat)));
  const inalt = Math.max(2, Math.round(lat * g.foaieInalt / g.foaieLat));
  const semn = semnulUdarii();
  if (stampaLucrarii.panza && semnulLucrarii.lat === lat && semnulLucrarii.inalt === inalt &&
      (Math.abs(semnulLucrarii.valoare - semn) < 0.01 || acum - semnulLucrarii.cand < 110)) {
    return stampaLucrarii.panza;
  }
  const p = panzaDeLucru(stampaLucrarii, lat, inalt);
  const c = p.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.clearRect(0, 0, lat, inalt);
  deseneazaLucrarea(c, 0, 0, lat, inalt, 1);
  semnulLucrarii.valoare = semn;
  semnulLucrarii.cand = acum;
  semnulLucrarii.lat = lat;
  semnulLucrarii.inalt = inalt;
  return p;
}

/* ---------- PULVERIZATORUL ---------- */
function deseneazaPulverizatorul(c, g, acum) {
  const x = g.pulvX, jos = g.pulvY, h = g.pulvInalt;
  const lat = h * 0.36;

  /* Umbra de sub el. Un obiect fără umbră nu stă pe podea, plutește la un
     centimetru deasupra ei — se vede imediat, chiar dacă nu-ți dai seama de ce. */
  const umbra = c.createRadialGradient(x, jos, 0, x, jos, lat * 1.5);
  umbra.addColorStop(0, 'rgba(120, 112, 92, 0.30)');
  umbra.addColorStop(1, 'rgba(120, 112, 92, 0)');
  c.fillStyle = umbra;
  c.beginPath();
  c.ellipse(x, jos, lat * 1.5, lat * 0.42, 0, 0, Math.PI * 2);
  c.fill();

  // sticla, cu apă înăuntru
  const sticla = c.createLinearGradient(x - lat / 2, 0, x + lat / 2, 0);
  sticla.addColorStop(0, 'rgba(255,255,255,0.9)');
  sticla.addColorStop(0.4, 'rgba(214, 232, 240, 0.75)');
  sticla.addColorStop(1, 'rgba(150, 178, 194, 0.7)');
  c.fillStyle = sticla;
  dreptunghiIn(c, x - lat / 2, jos - h * 0.62, lat, h * 0.62, lat * 0.16);
  c.fill();
  c.strokeStyle = 'rgba(110, 130, 145, 0.8)';
  c.lineWidth = Math.max(1, g.S * 0.0018);
  c.stroke();

  // apa dinăuntru, cu o linie de nivel
  c.fillStyle = 'rgba(126, 178, 202, 0.55)';
  dreptunghiIn(c, x - lat * 0.42, jos - h * 0.40, lat * 0.84, h * 0.38, lat * 0.12);
  c.fill();

  // capul de pulverizare, cu trăgaci
  c.fillStyle = '#7d8894';
  dreptunghiIn(c, x - lat * 0.30, jos - h * 0.80, lat * 0.60, h * 0.20, lat * 0.10);
  c.fill();
  c.beginPath();
  c.moveTo(x - lat * 0.30, jos - h * 0.74);
  c.lineTo(x - lat * 0.92, jos - h * 0.70);
  c.lineTo(x - lat * 0.92, jos - h * 0.62);
  c.lineTo(x - lat * 0.30, jos - h * 0.62);
  c.closePath();
  c.fill();
  // duza
  c.fillStyle = '#5d6874';
  c.fillRect(x + lat * 0.28, jos - h * 0.78, lat * 0.34, h * 0.06);

  /* Cheamă cât timp n-ai stropit încă. Nu clipește: **respiră**. O clipire ar
     zice „apasă aici, repede"; o respirație zice „sunt aici când vrei". */
  if (s9.stropiri < 3) {
    const bat = 0.5 + 0.5 * Math.sin(acum * 0.0028);
    const halo = c.createRadialGradient(x, jos - h * 0.4, 0, x, jos - h * 0.4, h * 0.9);
    halo.addColorStop(0, `rgba(150, 200, 225, ${0.26 * bat})`);
    halo.addColorStop(1, 'rgba(150, 200, 225, 0)');
    c.fillStyle = halo;
    c.beginPath();
    c.arc(x, jos - h * 0.4, h * 0.9, 0, Math.PI * 2);
    c.fill();
  }
}

/* ---------- STROPII ȘI ȘIROAIELE ---------- */
/* Câți stropi pot fi în aer deodată.

   Aceeași scăpare ca norii din scena a doua, și tot așa de greu de văzut: fiecare
   stropire adaugă șaisprezece stropi, iar ei pleacă de la sine după o secundă și
   jumătate — câtă vreme curg cadre printre stropiri. Când nu curg, nu pleacă
   nimeni: la teste, unde foaia se udă dintr-un foc, se adunaseră trei mii și o
   sută, și pe urmă se desenau toți, cadru de cadru.

   Un plafon nu strică nimic — două sute de stropi sunt oricum mai mulți decât poate
   număra ochiul — și scutește sala de singura purtare pe care n-o înțelegi când o
   vezi: merge tot mai greu, cu cât te joci mai mult. */
const STROPI_IN_AER = 220;

function facStropi(x, y) {
  const g = geomSala9();
  if (s9.stropi.length > STROPI_IN_AER) {
    s9.stropi.splice(0, s9.stropi.length - STROPI_IN_AER);
  }
  for (let k = 0; k < 16; k++) {
    const a = samanta(s9.stropiri * 13.7 + k * 3.1);
    const b = samanta(s9.stropiri * 7.3 + k * 5.9);
    s9.stropi.push({
      x: x + (a - 0.5) * g.S * 0.05,
      y: y + (b - 0.5) * g.S * 0.05,
      vx: (a - 0.5) * 1.6, vy: (b - 0.5) * 1.6 - 0.3,
      r: g.S * (0.0016 + a * 0.0028),
      viata: 1
    });
  }
}

function actualizeazaStropii(dt) {
  /* Briza marină: stropii fini sunt suflați pe diagonală. Ea nu e podoabă — e
     lucrul care face aerul să pară aer. Într-o sală în care apa cade numai drept,
     nu se simte nicio adiere. */
  const briza = 0.045 * (0.6 + s9.udare);
  for (let k = s9.stropi.length - 1; k >= 0; k--) {
    const s = s9.stropi[k];
    s.vx += briza * (dt / 16);
    s.vy += 0.055 * (dt / 16);
    s.x += s.vx * (dt / 16);
    s.y += s.vy * (dt / 16);
    s.viata -= dt / 1400;
    if (s.viata <= 0) s9.stropi.splice(k, 1);
  }
}

function facSiroi(u) {
  s9.siroaie.push({
    u,
    lung: 0,
    tinta: 0.25 + Math.random() * 0.75,
    grosime: 0.30 + Math.random() * 0.55,
    unda: Math.random() * 6.28,
    /* Cele mai multe șiroaie sunt albastre, și nu din gust: se scurg din
       marginea de jos a foii, iar acolo e marea. Coralul e sus, la zare, și
       ajunge jos numai când apa a străbătut toată hârtia. */
    culoare: Math.random() < 0.25 ? CORAL_UD : INDIGO_UD
  });
}

function actualizeazaSiroaiele(dt) {
  for (const s of s9.siroaie) {
    if (s.lung < s.tinta) s.lung = Math.min(s.tinta, s.lung + dt / 2600);
  }

  /* Șiroaiele nu pornesc din atingere, ci din îmbibare. Întâi le pusesem pe
     fiecare stropire, și ieșeau toate grămadă acolo unde întâmplarea făcea să
     treci a treia oară — trei bețe lângă un colț și restul foii uscată pe
     dedesubt. Hârtia nu curge de unde ai apucat-o, curge de unde nu mai are
     unde ține apa. */
  if ((s9.faza !== 'uscat' && s9.faza !== 'inundat') || s9.udare < 0.28) return;
  if (s9.siroaie.length >= 18 || Math.random() > dt / 320) return;
  let u = Math.random();
  for (let k = 0; k < 6 && udarealaFoaie(u, 0.94) < 0.45; k++) u = Math.random();
  facSiroi(u);
}

function deseneazaSiroaiele(c, g) {
  /* Șiroaiele se preling **de pe foaie pe perete** — nu se opresc la marginea
     hârtiei. Asta e tot ce trebuie ca să se simtă că e prea multă apă: o
     acuarelă cuminte se termină în ramă, una udă leoarcă dă pe dinafară. */
  const jos = g.foaieY + g.foaieInalt;
  for (const s of s9.siroaie) {
    const x = g.foaieX + s.u * g.foaieLat;
    const lung = s.lung * (g.podea - jos) * 1.6;
    /* Un șiroi nu cade drept: hârtia și peretele nu sunt netede, iar picătura
       șovăie la stânga și la dreapta pe drum. Fără șovăiala asta ieșeau niște
       bețe verticale cu bilă la capăt — termometre, nu culoare scursă. */
    const lat = g.S * 0.0060 * s.grosime;
    const abate = function (q) { return Math.sin(q * 5.2 + s.unda) * lat * 1.7 * q; };
    c.save();
    c.globalAlpha = 0.30;
    const scurgere = c.createLinearGradient(x, jos, x, jos + lung);
    scurgere.addColorStop(0, s.culoare);
    scurgere.addColorStop(0.65, amesteca(s.culoare, HARTIE_BUMBAC, 0.45));
    scurgere.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = scurgere;
    c.beginPath();
    for (let q = 0; q <= 16; q++) {
      const f = q / 16, px = x + abate(f), py = jos + lung * f;
      const gr = lat * (1 - f * 0.55);
      if (q === 0) c.moveTo(px - gr, py); else c.lineTo(px - gr, py);
    }
    for (let q = 16; q >= 0; q--) {
      const f = q / 16, px = x + abate(f), py = jos + lung * f;
      const gr = lat * (1 - f * 0.55);
      c.lineTo(px + gr, py);
    }
    c.closePath();
    c.fill();
    // bobul de la capătul șiroiului, care îl trage în jos
    c.globalAlpha = 0.30;
    c.fillStyle = s.culoare;
    c.beginPath();
    c.ellipse(x + abate(1), jos + lung, lat * 0.9, lat * 1.5, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

/* ---------- PODEAUA CARE SE FACE LAC ---------- */
function deseneazaLaculDePodea(c, g, acum) {
  if (s9.inundare <= 0.01) return;
  const cat = Math.min(1, s9.inundare);
  const sus = intre(H, g.podea, atenuare(cat));

  c.save();
  c.beginPath();
  c.rect(0, sus, W, H - sus);
  c.clip();

  // apa: un albastru adânc, cu lumina zilei pe deasupra
  const apa = c.createLinearGradient(0, sus, 0, H);
  apa.addColorStop(0, amesteca(INDIGO_UD, '#ffffff', 0.55));
  apa.addColorStop(0.5, amesteca(INDIGO_UD, '#ffffff', 0.25));
  apa.addColorStop(1, INDIGO_UD);
  c.globalAlpha = 0.9 * cat;
  c.fillStyle = apa;
  c.fillRect(0, sus, W, H - sus);

  /* Oglindirea: aceeași lucrare, întoarsă cu susul în jos. Nu o copie palidă —
     **exact aceeași funcție de desen**, doar răsturnată. Dacă cineva schimbă
     vreodată tabloul, oglinda îl urmează de la sine; două desene scrise separat
     s-ar fi despărțit la prima schimbare, iar o oglindă care nu seamănă cu
     lucrul oglindit e cel mai supărător lucru cu putință. */
  c.save();
  c.globalAlpha = 0.55 * cat;
  c.translate(0, sus * 2 + g.foaieInalt);
  c.scale(1, -1);
  c.drawImage(panzaLucrarii(acum), g.foaieX, sus, g.foaieLat, g.foaieInalt);
  c.restore();

  /* Valurile care rup oglindirea: dungi orizontale deschise, care se mișcă
     încet. Fără ele, podeaua ar fi o oglindă de sticlă, nu una de apă. */
  c.globalAlpha = 0.3 * cat;
  c.strokeStyle = 'rgba(255,255,255,0.85)';
  for (let k = 0; k < 26; k++) {
    const q = (k + 0.5) / 26;
    const y = intre(sus, H, Math.pow(q, 1.4));
    const unda = Math.sin(acum * 0.0009 + k * 1.7) * W * 0.03;
    c.lineWidth = Math.max(0.8, g.S * 0.0022 * (0.4 + q));
    /* Dunga nu e dreaptă: se leagănă pe verticală, cu vreo doi pixeli. Trase cu
       rigla arătau a hașură de desen tehnic peste un lac altfel liniștit. */
    const x0 = W * 0.5 - W * 0.55 * q + unda, x1 = W * 0.5 + W * 0.55 * q + unda;
    c.beginPath();
    for (let m = 0; m <= 6; m++) {
      const f = m / 6, px = intre(x0, x1, f);
      const py = y + Math.sin(f * 5.3 + k * 2.1 + acum * 0.0011) * g.S * 0.0030;
      if (m === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.stroke();
  }
  c.restore();
}

/* ---------- SCUFUNDAREA ȘI SEDIMENTAREA ---------- */
/* O pată moale, fără contur și fără dungă de pigment. E singurul fel de pată
   care are voie sub apă: dunga de pe margine se face când balta se **usucă**, iar
   sub apă nu se usucă nimic. Câtă vreme am coborât prin aceleași pete ca cele de
   pe hârtie, plonjonul arăta a ghem de baloane de săpun. */
function pataMoale(c, x, y, r, culoare, tarie, turtire) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, culoare);
  g.addColorStop(0.45, culoare);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  c.save();
  c.globalAlpha = tarie;
  c.fillStyle = g;
  c.translate(x, y);
  c.scale(1, turtire);
  c.translate(-x, -y);
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

function deseneazaPlonjonul(c, acum) {
  const p = Math.min(1, s9.plonjon);

  const adanc = c.createLinearGradient(0, 0, 0, H);
  adanc.addColorStop(0, amesteca('#8fc0d6', '#12233d', p));
  adanc.addColorStop(0.55, amesteca('#4a7ea8', '#0d1a2e', p));
  adanc.addColorStop(1, amesteca('#2b527d', '#060b14', p));
  c.fillStyle = adanc;
  c.fillRect(0, 0, W, H);

  /* Razele de la suprafață, care se îngustează și se sting pe măsură ce cobori.
     Ele fac toată deosebirea dintre „apă" și „albastru": lumina care vine de sus
     e singurul lucru care spune încotro e sus. */
  c.save();
  for (let k = 0; k < 7; k++) {
    const a = samanta(6000 + k * 3.7);
    const x0 = W * (0.05 + a * 0.9);
    const raza = c.createLinearGradient(x0, 0, x0 + W * 0.05, H * 0.9);
    raza.addColorStop(0, 'rgba(255,255,255,0.85)');
    raza.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = raza;
    /* Fiecare rază se pune de trei ori, din ce în ce mai lată și mai stinsă.
       Dintr-o singură trecere ieșeau pene tăiate cu foarfeca: lumina printr-o
       apă tulbure n-are muchie, se stinge în lături. */
    for (let t = 0; t < 3; t++) {
      const lat = 1 + t * 1.3;
      c.globalAlpha = (1 - p) * 0.13 / (1 + t * 0.5);
      c.beginPath();
      c.moveTo(x0 - W * 0.012 * lat, 0);
      c.lineTo(x0 + W * 0.012 * lat, 0);
      c.lineTo(x0 + W * (0.10 + 0.012 * (lat - 1)), H * 0.95);
      c.lineTo(x0 + W * (0.02 - 0.012 * (lat - 1)), H * 0.95);
      c.closePath();
      c.fill();
    }
  }
  c.restore();

  /* Vălurile de culoare: multe și subțiri, nu câteva și mari. Urcă pe ecran,
     fiindcă tu cobori. */
  for (let k = 0; k < 46; k++) {
    const a = samanta(5900 + k * 3.1), b = samanta(5960 + k * 7.7);
    const e = samanta(6040 + k * 5.3);
    const urcare = ((p * (0.5 + a * 1.1) + b) % 1);
    const y = H * (1.2 - urcare * 1.4);
    const r = Math.min(W, H) * (0.06 + a * 0.14);
    const cat = (1 - Math.abs(urcare - 0.5) * 1.4) * 0.22;
    if (cat <= 0.005) continue;
    pataMoale(c, W * (0.05 + b * 0.9), y, r,
              e > 0.66 ? CORAL_UD : (e > 0.3 ? INDIGO_UD : '#5f92b8'),
              cat, 0.45 + e * 0.3);
  }

  // bășicile care fug în sus, mai repezi decât vălurile
  c.save();
  for (let k = 0; k < 34; k++) {
    const a = samanta(6200 + k * 3.1), b = samanta(6260 + k * 7.7);
    const urcare = ((p * (1.6 + a * 1.8) + b) % 1);
    const r = Math.min(W, H) * (0.004 + a * 0.010);
    c.globalAlpha = 0.30 * (1 - urcare) + 0.08;
    c.strokeStyle = 'rgba(255,255,255,0.9)';
    c.lineWidth = Math.max(0.7, r * 0.3);
    c.fillStyle = 'rgba(210, 235, 245, 0.35)';
    c.beginPath();
    c.arc(W * (0.04 + b * 0.92) + Math.sin(urcare * 9 + k) * W * 0.01,
          H * (1.1 - urcare * 1.25), r, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  }
  c.restore();

  // adâncul se strânge în jurul tău
  const colt = c.createRadialGradient(W * 0.5, H * 0.45, Math.min(W, H) * (0.5 - p * 0.28),
                                      W * 0.5, H * 0.45, Math.max(W, H) * 0.85);
  colt.addColorStop(0, 'rgba(0,0,0,0)');
  colt.addColorStop(1, 'rgba(3, 8, 18, ' + (0.3 + p * 0.5).toFixed(2) + ')');
  c.fillStyle = colt;
  c.fillRect(0, 0, W, H);
  c.globalAlpha = 1;
}

function deseneazaSedimentarea(c, acum) {
  const p = Math.min(1, s9.sedimentare);

  /* Culorile se usucă și rămân fibrele. Fiecare fir de aici e la început un văl
     de culoare și la sfârșit un fir de bumbac: același lucru, care își pierde
     apa. Nu e o trecere imitată între două desene, e chiar drumul de la baltă la
     hârtie uscată.

     Prima oară făcusem fibrele din aceleași pete lobate ca laviul, doar turtite:
     au ieșit o sută cincizeci de frunze cu contur, unele peste altele, și
     acopereau și ziarul, și tot. O fibră de hârtie e un **fir**: subțire cât o
     linie, atât de palid încât se vede numai fiindcă sunt multe. */
  /* Drumul culorii trece **prin cald**, nu prin gri. Dus de-a dreptul de la
     albastrul adânc la cremul hârtiei, treci exact prin mijlocul lor, adică
     printr-un gri-verzui de apă de spălat vase, și acolo stă jumătate din
     scenă. Cu o oprire pe la brun, aceeași trecere se citește ca o fotografie
     veche care se îngălbenește. */
  const spre = function (rece, brun, hartie) {
    return p < 0.5 ? amesteca(rece, brun, p / 0.5)
                   : amesteca(brun, hartie, (p - 0.5) / 0.5);
  };
  const fond = c.createLinearGradient(0, 0, 0, H);
  fond.addColorStop(0, spre('#12233d', '#4c3a1c', '#efe3c6'));
  fond.addColorStop(1, spre('#060b14', '#2e2210', '#d6c29a'));
  c.fillStyle = fond;
  c.fillRect(0, 0, W, H);

  const S = Math.min(W, H);
  const usuca = atenuare(Math.min(1, p * 1.25));

  /* Două populații, nu una. Întâi le făcusem pe amândouă din aceleași două sute
     șaizeci de puncte — fiecare punct întâi pată, apoi fir — și a ieșit o
     spuzeală: două sute șaizeci de pete potrivite ca mărime pentru un fir sunt
     mult prea multe și mult prea mici pentru niște văluri de culoare. Apa care
     se retrage e puțină și mare; ce rămâne în urma ei e mult și mărunt. */
  c.save();
  if (usuca < 0.97) {
    for (let k = 0; k < 24; k++) {
      const a = samanta(6100 + k * 3.1), b = samanta(6160 + k * 7.7);
      const e = samanta(6220 + k * 5.3);
      pataMoale(c, a * W, b * H, S * (0.20 + e * 0.22),
                e > 0.5 ? INDIGO_UD : CORAL_UD,
                (1 - usuca) * 0.30, 0.55 + e * 0.35);
    }
  }
  /* Firele se trag pe **trepte**, nu unul câte unul.

     Patru sute douăzeci de fire, fiecare cu `beginPath` și `stroke` al lui, fac
     o mie șapte sute de operații de desen pe cadru — de patru ori bugetul cu care
     s-a scos lagul din sala a doua, și timp de cinci secunde încheiate. Dar un
     `stroke` poate trage oricâte linii deodată, dacă au aceeași culoare și
     aceeași transparență. Așa că firele se împart în șase trepte de paloare, se
     adună într-un singur traseu fiecare, și se trag din șase mișcări.

     Ochiul nu are ce pierde: între două trepte alăturate e o diferență de
     transparență de sub două sutimi, iar firele sunt oricum la limita vederii.
     Asta e și toată socoteala din spatele trucului: se rotunjește exact lucrul
     care nu se vede. */
  const TREPTE = 6;
  if (usuca > 0.10) {
    for (let tr = 0; tr < TREPTE; tr++) {
      const e0 = tr / TREPTE, e1 = (tr + 1) / TREPTE, eMij = (e0 + e1) / 2;
      c.globalAlpha = (usuca - 0.10) / 0.9 * (0.05 + eMij * 0.09);
      c.strokeStyle = eMij > 0.5 ? '#b6a179' : '#cdb894';
      c.lineWidth = Math.max(0.5, S * 0.0012);
      c.beginPath();
      for (let k = 0; k < 420; k++) {
        const e = samanta(6520 + k * 5.3);
        if (e < e0 || e >= e1) continue;
        const a = samanta(6400 + k * 3.1), b = samanta(6460 + k * 7.7);
        const f = samanta(6580 + k * 11.3);
        const x = a * W, y = b * H;
        const unghi = (e - 0.5) * 2.4 + (f - 0.5) * usuca * 3.0;
        const lung = S * (0.05 + f * 0.16) * usuca;
        c.moveTo(x - Math.cos(unghi) * lung / 2, y - Math.sin(unghi) * lung / 2);
        c.quadraticCurveTo(x + Math.sin(unghi) * lung * 0.4 * (e - 0.5),
                           y - Math.cos(unghi) * lung * 0.4 * (e - 0.5),
                           x + Math.cos(unghi) * lung / 2, y + Math.sin(unghi) * lung / 2);
      }
      c.stroke();
    }
  }
  c.restore();

  /* Ziarul îngălbenit care plutește în întuneric, la capăt. Apare abia în ultima
     treime: până atunci, ce vezi sunt fibre risipite; pe urmă fibrele se adună
     într-o foaie. El stă **deasupra** firelor, nu îngropat în ele — e lucrul spre
     care merge toată sala, și ultimul lucru pe care îl vezi înainte de a zecea. */
  if (p > 0.55) {
    const q = atenuare(Math.min(1, (p - 0.55) / 0.45));
    const lat = Math.min(W * 0.46, H * 0.62), inalt = lat * 1.32;
    const x = W * 0.5 - lat / 2, y = H * 0.5 - inalt / 2;
    c.save();
    c.translate(W * 0.5, H * 0.5);
    c.rotate(-0.035 + Math.sin(acum * 0.0006) * 0.015);
    c.scale(intre(0.86, 1, q), intre(0.86, 1, q));
    c.translate(-W * 0.5, -H * 0.5);

    /* Umbra, pusă în straturi tot mai largi și mai stinse. Dintr-un singur
       dreptunghi mutat pe diagonală ieșea o umbră de prezentare, cu muchia mai
       ascuțită decât a foii care o face. */
    for (let t = 0; t < 4; t++) {
      const cr = S * 0.004 * t;
      c.globalAlpha = q * 0.10;
      c.fillStyle = 'rgba(40, 30, 12, 1)';
      c.fillRect(x + S * 0.010 - cr, y + S * 0.014 - cr, lat + cr * 2, inalt + cr * 2);
    }

    c.globalAlpha = q;
    c.fillStyle = '#e9dab6';
    c.fillRect(x, y, lat, inalt);
    // pătarea de vârstă, mai galbenă pe margini
    const varsta = c.createRadialGradient(W * 0.5, H * 0.5, lat * 0.2,
                                          W * 0.5, H * 0.5, lat * 0.95);
    varsta.addColorStop(0, 'rgba(0,0,0,0)');
    varsta.addColorStop(1, 'rgba(150, 112, 44, 0.35)');
    c.fillStyle = varsta;
    c.fillRect(x, y, lat, inalt);

    // titlul și coloanele: un ziar de departe e o grilă, nu un text
    c.globalAlpha = q * 0.55;
    c.fillStyle = '#5f5031';
    c.fillRect(x + lat * 0.10, y + inalt * 0.055, lat * 0.80, inalt * 0.026);
    c.globalAlpha = q * 0.40;
    for (let col = 0; col < 3; col++) {
      for (let r = 0; r < 27; r++) {
        const rx = x + lat * (0.08 + col * 0.30);
        const ry = y + inalt * (0.13 + r * 0.031);
        c.fillRect(rx, ry, lat * 0.25 * (0.55 + samanta(6300 + col * 31 + r) * 0.45),
                   inalt * 0.0055);
      }
    }
    c.restore();
  }

  // sepia peste tot, la sfârșit
  if (p > 0.8) {
    c.globalAlpha = (p - 0.8) / 0.2 * 0.5;
    c.fillStyle = '#7a5c30';
    c.fillRect(0, 0, W, H);
  }
  c.globalAlpha = 1;
}

/* ---------- VORBA SCENEI ---------- */
function spuneScena9(text, cat) {
  s9.vorba = { text, panaLa: (s9.ultimulCadru || 0) + cat };
}

function deseneazaVorba9(acum) {
  if (!s9.vorba || acum > s9.vorba.panaLa) return;
  const stins = Math.min(1, (s9.vorba.panaLa - acum) / 700);
  ctx.save();
  ctx.globalAlpha = stins;
  const marime = Math.max(14, Math.min(W, H) * 0.026);
  ctx.font = `${Math.round(marime)}px Georgia`;
  const lat = ctx.measureText(s9.vorba.text).width;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  dreptunghi(W * 0.5 - lat / 2 - marime, H * 0.028, lat + marime * 2, marime * 2.1,
             marime * 0.5);
  ctx.restore();
  textIncadrat(s9.vorba.text, W * 0.5, H * 0.028 + marime * 0.5, W * 0.8,
               marime * 1.4, `${Math.round(marime)}px Georgia`, '#2c3d52');
}

/* ---------- INTRAREA ȘI IEȘIREA ---------- */
function intraInAcuarela(acum) {
  stare = 'acuarela';
  s9.faza = 'intrare'; s9.t0 = acum; s9.ultimulCadru = acum;
  s9.limpezire = 0; s9.stropiri = 0; s9.udare = 0;
  s9.stropi = []; s9.siroaie = []; s9.inundare = 0;
  s9.plonjon = 0; s9.sedimentare = 0; s9.vorba = null;
  pregatesteOchiurileFoii();
  semnulLucrarii.valoare = -1;
  semnulLucrarii.cand = -1e9;
  pregatesteSalaAcuarela();
  opresteAtelierUlei();
  pornestePloaia();
  if (audio) sunetPortal();
}

function iesiDinAcuarela(acum) {
  /* Ziarul duce în sala a zecea. Ea încă nu e făcută, așa că deocamdată te scoate
     înapoi la custode — dar drumul e croit, ca la arsură, ca la vârtej și ca la
     trapă, și când va fi, aici se schimbă un singur rând. */
  oprestePloaia();
  opresteVinilul();
  s3.vizitat = true;
  stare = 'muzeu';
  faza3('usaDeschisa');
  s3.usa = 1; s3.chemare = 0; s3.aSunatChemarea = false;
  actiune3(acum);
  pornesteNatura(false);
}

/* ---------- CE SE ÎNTÂMPLĂ LA ATINGERE ---------- */
function click9(acum) {
  const g = geomSala9();
  const x = cursor.x, y = cursor.y;

  if (s9.faza === 'plonjon' || s9.faza === 'sedimentare' || s9.faza === 'iesire') return;

  if (s9.faza === 'inundat') {
    /* Oglindirea din podea: acolo se plonjează. Tot ce e sub linia apei
       primește atingerea — o țintă mică ar fi cerut ochire, iar scena asta e
       despre abandon, nu despre precizie. */
    if (y > intre(H, g.podea, atenuare(Math.min(1, s9.inundare)))) {
      s9.faza = 'plonjon'; s9.t0 = acum; s9.plonjon = 0.001;
      s9.vorba = null;
      if (audio) { sunetPlonjon(); oprestePloaia(); }
      return;
    }
  }

  stropesteCuApa(x, y, acum);
}

/* Apa pulverizată. Se cheamă și de la atingere, și de la degetul tras — a stropi
   o foaie e o mișcare lungă, nu un clic. */
function stropesteCuApa(x, y, acum) {
  if (s9.faza !== 'uscat' && s9.faza !== 'inundat') return;
  if (acum - s9.ultimaStropire < 90) return;
  s9.ultimaStropire = acum;

  udaFoaia(x, y, geomSala9().foaieLat * 0.16);
  s9.stropiri++;
  facStropi(x, y);
  if (audio) sunetPulverizare();
}

function pulverizeazaScena9() {
  if (stare !== 'acuarela' || !cursor.apasat) return;
  stropesteCuApa(cursor.x, cursor.y, performance.now());
}

/* ---------- CEASUL SCENEI ---------- */
function actualizeazaAcuarela(acum) {
  const dt = Math.max(0, Math.min(100, acum - (s9.ultimulCadru || acum)));
  s9.ultimulCadru = acum;
  tinePicaturileDeApa();
  tineVinilul();
  actualizeazaStropii(dt);
  actualizeazaSiroaiele(dt);
  raspandesteApa();

  if (s9.faza === 'intrare') {
    s9.limpezire = Math.min(1, s9.limpezire + dt / 1600);
    if (s9.limpezire >= 1) {
      s9.faza = 'uscat'; s9.t0 = acum;
      spuneScena9('Acuarela iubește apa. Stropește-o!', 9000);
    }
  }
  else if (s9.faza === 'uscat') {
    if (s9.udare >= 0.72) {
      s9.faza = 'inundat'; s9.t0 = acum;
      spuneScena9('Lumea s-a inversat. Plonjează în reflexie.', 12000);
    }
  }
  else if (s9.faza === 'inundat') {
    s9.inundare = Math.min(1, s9.inundare + dt / 3200);
  }
  else if (s9.faza === 'plonjon') {
    s9.plonjon = Math.min(1, s9.plonjon + dt / 3400);
    if (s9.plonjon >= 1) {
      s9.faza = 'sedimentare'; s9.t0 = acum; s9.sedimentare = 0.001;
      if (audio) pornesteVinilul();
    }
  }
  else if (s9.faza === 'sedimentare') {
    s9.sedimentare = Math.min(1, s9.sedimentare + dt / 5200);
    if (s9.sedimentare >= 1) { s9.faza = 'iesire'; s9.t0 = acum; }
  }
  else if (s9.faza === 'iesire' && acum - s9.t0 > 1400) iesiDinAcuarela(acum);
}

/* ---------- DESENUL ---------- */
function deseneazaScena9(t, acum) {
  const g = geomSala9();

  if (s9.faza === 'plonjon') { deseneazaPlonjonul(ctx, acum); return; }
  if (s9.faza === 'sedimentare' || s9.faza === 'iesire') {
    deseneazaSedimentarea(ctx, acum);
    return;
  }

  ctx.drawImage(pregatesteSalaAcuarela(), 0, 0);
  ctx.drawImage(panzaLucrarii(acum), g.foaieX, g.foaieY, g.foaieLat, g.foaieInalt);
  deseneazaSiroaiele(ctx, g);
  deseneazaLaculDePodea(ctx, g, acum);
  if (s9.faza !== 'inundat') deseneazaPulverizatorul(ctx, g, acum);

  // stropii din aer
  ctx.save();
  for (const s of s9.stropi) {
    ctx.globalAlpha = s.viata * 0.55;
    ctx.fillStyle = 'rgba(190, 220, 235, 0.9)';
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, s.r, s.r * 1.6, Math.atan2(s.vy, s.vx) - Math.PI / 2,
                0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // limpezirea de la intrare
  if (s9.limpezire < 1) {
    ctx.save();
    ctx.globalAlpha = 1 - s9.limpezire;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  deseneazaVorba9(acum);
}
