/* ============================================================================
   SCENA A ȘAPTEA — SALA DE GHEAȚĂ

   Tema: senzația termică prin culoare rece, și designul vestimentar ca artă
   decorativă. Se învață cele trei funcții ale costumului: protecție, utilitate,
   estetică — nu citindu-le de pe un panou, ci pornindu-le una câte una și
   simțind ce se schimbă în cameră după fiecare.

   De ce vine imediat după sala focului: acolo totul era cald, gras, pictat cu
   cuțitul, cu marginile moi de pastă. Aici totul e rece, plat, tăiat — plane
   suprapuse și vectori ascuțiți, cubism și vorticism. Ochiul care tocmai a stat
   cinci minute în galben simte albastrul ăsta ca pe o palmă. Contrastul dintre
   cele două săli e chiar lecția, și niciuna nu l-ar putea da singură.

   Frigul nu se spune, se face: cursorul se mișcă mai greu, marginile ecranului
   prind promoroacă, iar dacă atingi lucrarea cu mâna goală îngheți de-a
   binelea și trebuie să te freci ca să te dezmorțești. Fiecare funcție a
   costumului dezleagă câte una dintre pedepsele astea — și abia atunci se
   înțelege la ce e bun un costum.
   ========================================================================== */

/* ---------- CULORILE ---------- */
/* Pornesc de la un albastru-violet mat, de conservare — culoarea unui depozit
   de muzeu în care nu intră nimeni — și se aprind spre neon pe măsură ce se
   activează funcțiile. Cu cât e costumul mai treaz, cu atât e sala mai vie. */
const ALBASTRU_MAT  = '#2b3566';
const VIOLET_ADANC  = '#3a2e63';
const INDIGO_UMBRA  = '#1a2044';
const NEGRU_RECE    = '#0d1129';
const ARGINT_RECE   = '#a8b6d4';
const OTEL_RECE     = '#6d7ea6';
const ALB_GHEATA    = '#e8f4ff';
const CYAN_NEON     = '#3ef2ff';
const ULTRAVIOLET   = '#a05cff';

/* Cele trei funcții ale costumului, în ordinea în care se cer. Textele lor nu
   stau pe un panou de sală: apar una câte una, la locul obiectului pe care îl
   atingi, și numai cât ține fapta. */
/* Fără subtitluri în paranteză. Le pusesem la toate trei, ca la o fișă de muzeu —
   dar o paranteză care repetă în trei cuvinte ce spune definiția de dedesubt nu
   lămurește nimic, doar mai pune un rând de citit între tine și faptă. Iar
   protecția și-a scurtat definiția: ce face bariera se **vede** pe ecran în
   clipa în care apeși, așa că n-are rost s-o mai și descrii. */
const FUNCTIILE_COSTUMULUI = [
  { cheie: 'protectie', nume: 'FUNCȚIA DE PROTECȚIE',
    text: 'Costumul funcționează ca un scut termic împotriva mediului înconjurător.',
    indemn: 'Atinge fularul.' },
  { cheie: 'utilitate', nume: 'FUNCȚIA DE UTILITATE',
    text: 'Costumul asigură supraviețuirea purtătorului prin generarea de micro-căldură, ' +
          'eliminând rigiditatea și restabilind controlul fluid asupra cursorului în urma ' +
          'conectării vortexurilor.',
    indemn: 'Leagă vortexurile, în ordine.' },
  { cheie: 'estetica', nume: 'FUNCȚIA ESTETICĂ',
    text: 'Costumul își exprimă valoarea vizuală prin îmbinarea formelor ascuțite cu ' +
          'reflexiile luminii albastre, proiectând modele abstracte spectaculoase pe pereți.',
    indemn: 'Pune-i un filtru de stil.' }
];

/* Fișa de sală. Sala e făcută din cubism și vorticism deopotrivă — primul îi dă
   formele descompuse, al doilea le pune în mișcare — dar pe perete scrie numai
   al doilea, fiindcă definiția lui o cuprinde pe a celuilalt. Cubismul rămâne în
   sală acolo unde îi e locul: în costumul desfăcut în față, spate și laturi, care
   se vede fără să scrie nimeni ce e. */
const TEXT_FISA_VORTICISM =
  'Vorticismul este o mișcare artistică britanică de scurtă durată din anii 1910 care ' +
  'combina geometria cubistă cu dinamismul futurist, promovând o estetică dură, ' +
  'industrială și unghiulară inspirată de energia mașinilor și a erei moderne.';

const s7 = {
  faza: 'intrare',      // intrare → sala → portal → zbor
  t0: 0, ultimulCadru: 0,
  promoroaca: 1,        // cât de înghețate sunt marginile ecranului, 1..0
  energie: 0,           // câte funcții s-au aprins, împărțit la trei
  protectie: false, utilitate: false, estetica: false,
  fularDesfacut: 0,     // cât s-a întins fularul în cameră
  filtru: -1,           // ce filtru de stil s-a pus (-1 = niciunul)
  reflexii: 0,          // cât de tare bat reflexiile pe pereți
  nodLegat: 0,          // câte noduri ale puzzle-ului s-au legat
  gresit: 0,            // tremurul de după un nod greșit
  inghetat: false,      // ai atins lucrarea cu mâna goală
  caldura: 0,           // cât ai frecat, 0..1
  ultimulSens: 0, ultimaScuturare: 0,
  tremur: 0,            // cât tremură ecranul
  cioburi: [],          // bucățile de gheață care zboară spre margini
  degetX: -9999, degetY: -9999,   // degetul, așa cum îl simte sala: cu întârziere
  crapatura: 0,         // cât e crăpată rama de gheață a lucrării
  atras: 0,             // cât de tare trage vârtejul de cursor
  zbor: 0,              // cât de departe ai ajuns prin tunel
  vorba: null,          // { text, pana }
  functiaAratata: -1,   // ce funcție se citește în panoul din dreapta
  cereScuturare: false, // toate trei aprinse: mai trebuie zgâlțâită gheața
  puzzleTreaz: false,   // roata a dat drumul la căldură: liniile de forță pot fi legate
  bariera: 0            // cât s-a întins bariera geometrică peste ecran
};

/* ---------- CÂT DE GREU SE MIȘCĂ DEGETUL ----------
   Frigul se simte în deget, nu în ochi. Într-o cameră rece mâna se mișcă mai
   greu — și fiindcă nu putem răci mâna nimănui, răcim cursorul.

   Trei trepte, și fiecare spune altceva:
     0.10 — ai atins lucrarea cu mâna goală și ai înghețat. Aproape nimic nu se
            mai poate face; asta e chiar pedeapsa.
     0.45 — frigul sălii, atâta timp cât costumul n-a fost pornit. Se poate
            umbla, dar se simte că trebuie împins.
     1.00 — după funcția de utilitate. Nu e o răsplată abstractă: e chiar
            lucrul pe care îl face un costum bun.

   Sub 0.45 nu coborâm niciodată în afara înghețului, fiindcă un cursor care nu
   ascultă nu e o senzație, e o defecțiune. */
function mobilitateaDegetului() {
  if (s7.inghetat) return 0.10;
  return s7.utilitate ? 1 : 0.45;
}

/* ---------- MĂSURILE SĂLII ---------- */
function geomSala7() {
  const S = Math.min(W, H);
  /* Punctul din care pornește tot: vârtejul înghețat, adică fuga tuturor
     planurilor și a liniilor de forță. Stă mai sus decât mijlocul ecranului —
     un vârtej cu centrul jos ar arăta a scurgere, nu a suflu. */
  const vx = W * 0.42, vy = H * 0.42;

  /* Costumul stă în dreapta, lângă vârtej, nu peste el. Puse amândouă pe ax, se
     acopereau — iar lucrarea centrală, pe care trebuie s-o atingi ca să înțelegi
     ce înseamnă frigul, se ascundea tocmai în spatele lucrului care te apără de
     el. Acum se văd deodată, și se vede și legătura dintre ele. */
  const costumLat = Math.min(W * 0.15, H * 0.24);
  const costumInalt = costumLat * 2.05;
  const costumX = W * 0.645;
  const costumSus = H * 0.28;

  return {
    S, vx, vy,
    costumX, costumSus, costumLat, costumInalt,
    costumJos: costumSus + costumInalt,
    /* Unde se deschide tunelul. **În costum**, nu în vârtej: vârtejul e lucrarea
       de pe perete, iar ea doar se crapă la sfârșit. Drumul mai departe îl dă
       costumul — asta e chiar poanta sălii, că un obiect de îmbrăcat s-a dovedit
       a fi o ușă. Un tunel deschis în altă parte ar fi lăsat costumul un exponat
       lângă care treci. */
    portalX: costumX,
    portalY: costumSus + costumInalt * 0.42,
    // fularul stă pe umerii costumului, cu capătul liber spre stânga
    fularX: costumX - costumLat * 0.16,
    fularY: costumSus + costumInalt * 0.10,
    fularR: costumLat * 0.42,
    // cele trei plăcuțe de filtru, pe un pupitru sub costum
    // cele trei forme ale funcțiilor, pe un pupitru sub costum
    formaY: H * 0.87,
    formaR: S * 0.042,
    formaX: function (k) { return costumX + (k - 1) * S * 0.115; },
    /* O singură fișă de sală, pe peretele din stânga, la mijlocul lui.

       Au fost două, una sub alta — cubismul deasupra, vorticismul dedesubt.
       Împreună acopereau tot peretele din stânga cu text, și sala începea cu
       șaptezeci de cuvinte de citit înainte să apuci să atingi ceva. Iar cele
       două spun, pe jumătate, același lucru: vorticismul **cuprinde** geometria
       cubistă și-i adaugă mișcarea. Rămâne deci cea care le zice pe amândouă. */
    fisaX: W * 0.018,
    fisaLat: Math.min(W * 0.18, S * 0.38),
    fisaSus: H * 0.5 - H * 0.175,
    fisaInalt: H * 0.35,
    /* Panoul funcției, în dreapta costumului. Aici scrie ce face partea pe care
       tocmai ai atins-o — la înălțimea ei, ca ochiul să nu caute. */
    panouX: W * 0.795,
    panouLat: Math.min(W * 0.19, S * 0.42),
    panouSus: H * 0.24,
    panouInalt: H * 0.46,
    // podeaua fragmentată începe de aici
    podea: H * 0.74
  };
}

/* Nodurile puzzle-ului: cinci opriri pe o spirală care iese din vârtej spre
   stânga, adică prin partea liberă a sălii. Nu în cerc — un cerc de butoane e o
   tastatură; o spirală e chiar linia de forță pe care trebuie s-o refaci. */
const NODURI_PUZZLE = 5;

function nodulPuzzle(k) {
  const g = geomSala7();
  const t = k / (NODURI_PUZZLE - 1);
  const unghi = Math.PI * (0.58 + t * 0.86);
  const raza = g.S * (0.20 + t * 0.20);
  return { x: g.vx + Math.cos(unghi) * raza, y: g.vy + Math.sin(unghi) * raza * 0.9,
           r: g.S * 0.042 };
}

/* ---------- SALA, PICTATĂ O SINGURĂ DATĂ ---------- */
/* Planurile cubiste și vectorii vorticiști nu se schimbă niciodată. Sunt câteva
   sute de muchii; desenate la fiecare cadru ar costa degeaba. */
const salaGheata = { panza: null, latime: 0, inaltime: 0 };

function pregatesteSalaGheata() {
  if (salaGheata.panza && salaGheata.latime === W && salaGheata.inaltime === H) {
    return salaGheata.panza;
  }
  const p = panzaDeLucru(salaGheata, W, H);
  const c = p.getContext('2d');
  c.clearRect(0, 0, W, H);
  pictezaSalaGheata(c);
  salaGheata.latime = W; salaGheata.inaltime = H;
  return p;
}

/* Un plan cubist: un patrulater strâmb, cu muchii drepte și colțuri. Aici nu e
   nicio tușă și niciun contur moale — tot ce se vede în sala asta e **tăiat**.

   E chiar opusul sălii de dinainte, și dinadins: acolo materia era groasă și
   caldă, aici e plată și rece. Un plan cubist nu are relief, are numai margine;
   ochiul nu are de ce să se agațe, și tocmai de-aia i se face frig. */
function planCubist(c, x, y, raza, unghi, culoare, alfa, z) {
  const varfuri = 4 + Math.floor(z(0) * 2);
  c.save();
  c.globalAlpha = alfa;
  c.translate(x, y);
  c.rotate(unghi);
  c.beginPath();
  for (let k = 0; k < varfuri; k++) {
    const a = (k / varfuri) * Math.PI * 2;
    const r = raza * (0.55 + z(k + 1) * 0.75);
    const px = Math.cos(a) * r, py = Math.sin(a) * r * (0.5 + z(k + 6) * 0.7);
    if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
  }
  c.closePath();
  c.fillStyle = culoare;
  c.fill();
  c.restore();
}

function pictezaSalaGheata(c) {
  const g = geomSala7();

  // fondul: adâncul rece din care se desprind planurile
  const fund = c.createRadialGradient(g.vx, g.vy, 0, g.vx, g.vy, Math.max(W, H) * 0.8);
  fund.addColorStop(0, ALBASTRU_MAT);
  fund.addColorStop(0.45, INDIGO_UMBRA);
  fund.addColorStop(1, NEGRU_RECE);
  c.fillStyle = fund;
  c.fillRect(0, 0, W, H);

  /* Planurile suprapuse. Se împrăștie în jurul vârtejului, dar nu peste el:
     mijlocul rămâne mai gol, ca privirea să aibă unde să cadă. Cele de departe
     sunt mari și mate, cele de aproape mici și mai deschise — așa se citește
     adâncime din niște forme plate. */
  const CULORI = [ALBASTRU_MAT, VIOLET_ADANC, INDIGO_UMBRA, OTEL_RECE, '#243a70', '#4a3d7a'];
  for (let k = 0; k < 90; k++) {
    const a = samanta(7100 + k * 3.7), b = samanta(7170 + k * 6.1);
    const e = samanta(7230 + k * 4.3);
    const unghi = a * Math.PI * 2;
    const dist = (0.12 + Math.pow(b, 0.7) * 0.95) * g.S;
    const x = g.vx + Math.cos(unghi) * dist * 1.35;
    const y = g.vy + Math.sin(unghi) * dist * 0.95;
    const raza = g.S * (0.05 + e * 0.20) * (0.5 + b);
    const z = function (i) { return samanta(7300 + k * 11 + i * 2.7); };
    planCubist(c, x, y, raza, unghi + (e - 0.5) * 1.4,
               CULORI[Math.floor(e * CULORI.length)], 0.16 + e * 0.3, z);
  }

  /* Vectorii vorticiști: linii tăioase care fug din vârtej spre margini. Ele
     fac mișcarea sălii. Un cubism fără ele e o grămadă de cioburi așezate; cu
     ele, cioburile se învârt. */
  for (let k = 0; k < 64; k++) {
    const a = samanta(7500 + k * 5.3), b = samanta(7570 + k * 3.9);
    const unghi = a * Math.PI * 2;
    const de = g.S * (0.10 + b * 0.22);
    const pana = g.S * (0.5 + b * 1.3);
    c.strokeStyle = b > 0.72 ? ARGINT_RECE : (b > 0.4 ? OTEL_RECE : '#3b4a80');
    c.globalAlpha = 0.12 + b * 0.3;
    c.lineWidth = Math.max(0.8, g.S * 0.0035 * (0.4 + b));
    c.beginPath();
    c.moveTo(g.vx + Math.cos(unghi) * de, g.vy + Math.sin(unghi) * de * 0.8);
    c.lineTo(g.vx + Math.cos(unghi + 0.12) * pana, g.vy + Math.sin(unghi + 0.12) * pana * 0.8);
    c.stroke();
  }
  c.globalAlpha = 1;

  /* Podeaua: nu o tablă de șah ca în sala focului, ci o placă de gheață crăpată
     în plăci mari, neregulate. Aceeași funcție — să spună unde stai — dar în
     limba sălii ăsteia. */
  const podea = c.createLinearGradient(0, g.podea, 0, H);
  podea.addColorStop(0, '#222c55');
  podea.addColorStop(1, '#12172f');
  c.fillStyle = podea;
  c.fillRect(0, g.podea, W, H - g.podea);

  for (let k = 0; k < 26; k++) {
    const a = samanta(7700 + k * 4.1), b = samanta(7760 + k * 6.7);
    const y0 = intre(g.podea, H, Math.pow(a, 0.8));
    const x0 = W * (b * 1.4 - 0.2);
    c.strokeStyle = b > 0.5 ? '#3f4f86' : '#182046';
    c.globalAlpha = 0.5 + b * 0.4;
    c.lineWidth = Math.max(1, g.S * 0.0035);
    c.beginPath();
    c.moveTo(x0, y0);
    // crăpăturile din gheață merg în frânturi, nu în curbe
    let px = x0, py = y0;
    for (let j = 0; j < 3; j++) {
      const dj = samanta(7830 + k * 9 + j * 3.3);
      px += (dj - 0.35) * W * 0.22;
      py += (samanta(7890 + k * 7 + j * 2.1) - 0.4) * H * 0.06;
      c.lineTo(px, py);
    }
    c.stroke();
  }
  c.globalAlpha = 1;

  /* Cristalele de pe jos. Fără ele sala arăta a navă spațială: linii neon,
     plane albastre, vârtej — totul spunea „viitor", nimic nu spunea „gheață".
     Trei bolovani de gheață pe podea schimbă cuvântul dintr-o dată, fiindcă ei
     sunt singurul lucru din cameră pe care ochiul îl recunoaște fără să-l
     gândească. Sunt prisme cu fețe, nu pietre: gheața se sparge în plane, ca tot
     restul sălii. */
  for (const cr of cristalelePodelei()) cristalDeGheata(c, cr);

  // fișa de sală, pe peretele din stânga
  fisaDeSala7(c, g.fisaX, g.fisaSus, g.fisaLat, g.fisaInalt,
              'VORTICISM', TEXT_FISA_VORTICISM);

  // linia unde peretele întâlnește podeaua, tăiată drept
  c.strokeStyle = ARGINT_RECE;
  c.globalAlpha = 0.3;
  c.lineWidth = Math.max(1, g.S * 0.004);
  c.beginPath();
  c.moveTo(0, g.podea);
  c.lineTo(W, g.podea);
  c.stroke();
  c.globalAlpha = 1;
}

/* ---------- CRISTALELE DE PE JOS ---------- */
/* Trei, nu mai multe. Un câmp de cristale ar fi un peisaj; trei bucăți lăsate pe
   podea sunt urmele a ceva care s-a spart aici. Stau în planul întâi, în stânga
   și în dreapta drumului, ca să nu intre peste nimic pe care trebuie să apeși. */
function cristalelePodelei() {
  const g = geomSala7();
  return [
    { x: W * 0.13, y: H * 0.90, h: g.S * 0.15, lat: g.S * 0.075 },
    { x: W * 0.28, y: H * 0.82, h: g.S * 0.09, lat: g.S * 0.048 },
    { x: W * 0.93, y: H * 0.88, h: g.S * 0.12, lat: g.S * 0.06 }
  ];
}

function cristalDeGheata(c, cr) {
  const x = cr.x, y = cr.y, h = cr.h, w = cr.lat;

  // umbra: un plan turtit, nu o pată moale
  c.fillStyle = 'rgba(8, 12, 30, 0.55)';
  c.beginPath();
  c.moveTo(x - w * 1.1, y);
  c.lineTo(x + w * 0.9, y - h * 0.04);
  c.lineTo(x + w * 1.5, y + h * 0.10);
  c.lineTo(x - w * 0.7, y + h * 0.12);
  c.closePath();
  c.fill();

  /* Trei fețe: una spre lumină, una în umbră, una spre privitor. Vârful nu stă
     în ax — un cristal cu vârful la mijloc arată desenat; unul cu vârful pieziș
     arată crescut. */
  const varfX = x + w * 0.22, varfY = y - h;
  const fete = [
    { pct: [[-1, 0], [-0.25, -0.16], [0.22, -1], [-0.55, -0.12]], culoare: '#9dc8ee' },
    { pct: [[-0.25, -0.16], [0.95, 0.02], [0.22, -1]], culoare: '#5f8fc4' },
    { pct: [[-0.55, -0.12], [0.22, -1], [-0.1, -0.55]], culoare: '#cfe9ff' }
  ];
  for (const f of fete) {
    c.beginPath();
    for (let k = 0; k < f.pct.length; k++) {
      const px = x + f.pct[k][0] * w, py = y + f.pct[k][1] * h;
      if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.closePath();
    c.fillStyle = f.culoare;
    c.globalAlpha = 0.9;
    c.fill();
  }
  // muchiile, care fac gheața să pară tăiată
  c.strokeStyle = ALB_GHEATA;
  c.globalAlpha = 0.75;
  c.lineWidth = Math.max(1, w * 0.06);
  c.beginPath();
  c.moveTo(x - w, y);
  c.lineTo(varfX, varfY);
  c.lineTo(x + w * 0.95, y + h * 0.02);
  c.moveTo(varfX, varfY);
  c.lineTo(x - w * 0.25, y - h * 0.16);
  c.stroke();
  c.globalAlpha = 1;
}

/* ---------- FIȘELE DE SALĂ ---------- */
/* Două casete pe peretele din stânga, cu curentele din care e făcută sala. Ca în
   galeriile de dinainte, se scriu **pe perete**, nu pe un panou care plutește:
   litera stă direct pe planurile cubiste, iar rama e tot un plan, tăiat. */
function fisaDeSala7(c, x, y, w, h, titlu, text) {
  c.save();
  // fondul: un patrulater ușor strâmb, ca tot ce e în sala asta
  c.beginPath();
  c.moveTo(x, y + h * 0.02);
  c.lineTo(x + w, y);
  c.lineTo(x + w * 0.985, y + h);
  c.lineTo(x + w * 0.012, y + h * 0.975);
  c.closePath();
  c.fillStyle = 'rgba(14, 20, 48, 0.86)';
  c.fill();
  c.strokeStyle = ARGINT_RECE;
  c.globalAlpha = 0.55;
  c.lineWidth = Math.max(1, w * 0.008);
  c.stroke();
  c.globalAlpha = 1;

  // colțul tăiat din dreapta sus: semnul sălii, repetat mărunt
  c.beginPath();
  c.moveTo(x + w * 0.82, y + h * 0.005);
  c.lineTo(x + w, y);
  c.lineTo(x + w * 0.995, y + h * 0.11);
  c.closePath();
  c.fillStyle = CYAN_NEON;
  c.globalAlpha = 0.35;
  c.fill();
  c.globalAlpha = 1;
  c.restore();

  const marime = Math.max(9, w * 0.088);
  const jos = scrieInCaseta(c, titlu, x + w * 0.5, y + h * 0.06, w * 0.86,
                            h * 0.18, marime * 1.05, 'bold', CYAN_NEON);
  scrieInCaseta(c, text, x + w * 0.5, jos + h * 0.03, w * 0.86,
                h * 0.86 - (jos - y), marime, '', '#cfdcf4');
}

/* Scrisul din casetele sălii a șaptea.

   Nu poate folosi `textIncadrat`: ăla scrie numai pe pânza jocului, iar fișele
   de perete se pictează o dată, pe ștampilă. Și mai are ceva pe deasupra —
   **își caută mărimea**. Definiția cubismului are treizeci și cinci de cuvinte,
   iar caseta e cât e; scrisă la o mărime aleasă din burtă, curgea afară din
   chenar pe ecranele înguste, adică tocmai acolo unde caseta e mai mică. Aici
   se strânge litera până încape, ca la fișele din galeria a patra. */
function randuriInCaseta(c, text, latMax) {
  const cuvinte = String(text).split(' ');
  const randuri = [];
  let linie = '';
  for (const cuv of cuvinte) {
    const incercare = linie ? linie + ' ' + cuv : cuv;
    if (c.measureText(incercare).width > latMax && linie) { randuri.push(linie); linie = cuv; }
    else linie = incercare;
  }
  if (linie) randuri.push(linie);
  return randuri;
}

function scrieInCaseta(c, text, cx, y, latMax, inaltMax, marimeMax, stil, culoare) {
  let marime = marimeMax;
  let randuri = [];
  for (let k = 0; k < 16; k++) {
    c.font = (stil ? stil + ' ' : '') + Math.round(marime) + 'px Georgia';
    randuri = randuriInCaseta(c, text, latMax);
    if (randuri.length * marime * 1.42 <= inaltMax || marime <= 8) break;
    marime *= 0.93;
  }
  c.save();
  c.font = (stil ? stil + ' ' : '') + Math.round(marime) + 'px Georgia';
  c.fillStyle = culoare;
  c.textAlign = 'center';
  c.textBaseline = 'top';
  let yy = y;
  for (const r of randuri) { c.fillText(r, cx, yy); yy += marime * 1.42; }
  c.restore();
  return yy;
}

/* ---------- VÂRTEJUL ÎNGHEȚAT ---------- *//* ---------- VÂRTEJUL ÎNGHEȚAT ---------- */
/* Inima sălii: liniile de forță care se rotesc încet în jurul unui gol. Se
   mișcă, deci nu poate sta pe ștampilă — dar e ieftin, sunt numai linii.

   Cu cât se aprind mai multe funcții, cu atât se învârte mai repede și mai în
   culoare: la început e argintiu și aproape nemișcat (conservare), la sfârșit e
   cyan și ultraviolet și duduie. */
function deseneazaVartejul(acum) {
  const g = geomSala7();
  const viteza = 0.00012 + s7.energie * 0.00042 + s7.crapatura * 0.0009;
  const rot = acum * viteza;
  const brate = 7;

  ctx.save();
  for (let b = 0; b < brate; b++) {
    const baza = rot + (b / brate) * Math.PI * 2;
    for (let k = 0; k < 9; k++) {
      const t = k / 9;
      const raza = g.S * (0.07 + t * 0.42);
      const unghi = baza + t * 2.1;
      const x = g.vx + Math.cos(unghi) * raza;
      const y = g.vy + Math.sin(unghi) * raza * 0.78;
      const unghi2 = baza + (t + 0.14) * 2.1;
      const raza2 = g.S * (0.07 + (t + 0.14) * 0.42);
      ctx.strokeStyle = s7.energie > 0.6 ? CYAN_NEON : (s7.energie > 0.3 ? '#7fd8ff' : ARGINT_RECE);
      ctx.globalAlpha = (0.24 + (1 - t) * 0.5) * (0.62 + s7.energie * 0.38);
      ctx.lineWidth = Math.max(1.2, g.S * 0.009 * (1 - t * 0.6));
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(g.vx + Math.cos(unghi2) * raza2, g.vy + Math.sin(unghi2) * raza2 * 0.78);
      ctx.stroke();
    }
  }

  // golul din mijloc, care se aprinde odată cu energia
  const ochi = ctx.createRadialGradient(g.vx, g.vy, 0, g.vx, g.vy, g.S * 0.14);
  ochi.addColorStop(0, `rgba(62, 242, 255, ${0.1 + s7.energie * 0.4})`);
  ochi.addColorStop(0.5, `rgba(160, 92, 255, ${0.06 + s7.energie * 0.2})`);
  ochi.addColorStop(1, 'rgba(160, 92, 255, 0)');
  ctx.fillStyle = ochi;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(g.vx, g.vy, g.S * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ---------- COSTUMUL ---------- */
/* Un palton cubist: umeri rigizi, tăiați în unghi, corpul din plane suprapuse.
   Nu e un desen de haină, e o **structură** — cum arată un costum când îl pui
   într-o sală de artă decorativă și nu într-un dulap.

   Umerii sunt partea care spune tot. Un palton cu umerii rotunzi e o haină
   moale, purtată; unul cu umerii tăiați drept e o armură — și exact asta
   trebuie să se citească înainte să apeși pe ceva. */
function deseneazaCostumul(acum) {
  const g = geomSala7();
  const x = g.costumX, y = g.costumSus, w = g.costumLat, h = g.costumInalt;
  const puls = 1 + 0.02 * Math.sin(acum * 0.002);

  ctx.save();

  /* Piesele răzlețe ale costumului. Cubismul nu arată un obiect dintr-un singur
     loc: îl desface și pune laturile una lângă alta, ca să le vezi pe toate
     deodată. De-aia aici, lângă haina văzută din față, stau **spatele** ei,
     **profilul** din latură și un **petic de căptușeală** — bucăți care în
     realitate n-au cum să se vadă în același timp.

     Nu sunt un ornament: exact asta face un tipar de croitorie, care desface
     haina în fețe, spate, mâneci și o întinde pe masă. Cubismul și croitoria
     descompun același lucru, iar sala asta le pune una peste alta. */
  deseneazaPieseleCubiste(acum);

  // umbra pe podea: un plan, nu o pată
  ctx.fillStyle = 'rgba(6, 9, 24, 0.55)';
  ctx.beginPath();
  ctx.moveTo(x - w * 0.7, g.costumJos + h * 0.02);
  ctx.lineTo(x + w * 0.8, g.costumJos + h * 0.01);
  ctx.lineTo(x + w * 0.55, g.costumJos + h * 0.07);
  ctx.lineTo(x - w * 0.5, g.costumJos + h * 0.08);
  ctx.closePath();
  ctx.fill();

  /* Corpul paltonului: patru panouri verticale, tăiate, cu revere și o curea
     peste mijloc. Fără ele, cele câteva fațete ale primei încercări se citeau
     drept doi craci de pantalon — un costum trebuie să se recunoască drept
     costum înainte să apeși pe el, altfel toată lecția despre funcțiile lui
     vorbește despre altceva. */
  const umarY = y + h * 0.10;
  const panouri = [
    [[-0.74, 0.10], [-0.30, 0.07], [-0.34, 0.98], [-0.60, 1.0]],
    [[-0.30, 0.07], [-0.01, 0.09], [-0.02, 1.0], [-0.34, 0.98]],
    [[-0.01, 0.09], [0.30, 0.07], [0.34, 1.0], [-0.02, 1.0]],
    [[0.30, 0.07], [0.74, 0.10], [0.60, 1.0], [0.34, 1.0]]
  ];
  const tonuri = ['#2a3268', '#3d4884', '#333c74', '#222a5a'];
  /* Panourile se desenează fiecare cu muchia lui, într-o singură bucată. Cât
     costumul e întreg nu se vede nicio deosebire; când se desface, muchia pleacă
     odată cu panoul ei, în loc să rămână desenată pe locul gol. */
  for (let k = 0; k < panouri.length; k++) {
    cuBucata(10 + k, acum, function () {
      ctx.beginPath();
      for (let j = 0; j < panouri[k].length; j++) {
        const px = x + panouri[k][j][0] * w * puls, py = y + panouri[k][j][1] * h;
        if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = tonuri[k];
      ctx.fill();
      ctx.strokeStyle = s7.estetica ? CYAN_NEON : ARGINT_RECE;
      ctx.globalAlpha = s7.estetica ? 0.85 : 0.45;
      ctx.lineWidth = Math.max(1, g.S * 0.0035);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }

  // reverele: două pene care cad din guler pe piept
  for (const lat of [-1, 1]) {
    cuBucata(15 + lat, acum, function () {
    ctx.beginPath();
    ctx.moveTo(x + lat * w * 0.05, y + h * 0.07);
    ctx.lineTo(x + lat * w * 0.40, umarY + h * 0.01);
    ctx.lineTo(x + lat * w * 0.20, y + h * 0.34);
    ctx.closePath();
    ctx.fillStyle = '#4d5a9c';
    ctx.fill();
    ctx.strokeStyle = s7.estetica ? CYAN_NEON : ARGINT_RECE;
    ctx.globalAlpha = s7.estetica ? 0.9 : 0.5;
    ctx.lineWidth = Math.max(1, g.S * 0.003);
    ctx.stroke();
    ctx.globalAlpha = 1;
    });
  }

  /* În locul curelei, un **ornament de cristale**. O curea e un obiect de
     utilitate: strânge haina, atât. Broderia ar fi fost din altă lume — port
     popular, cald, țesut. Aici, într-o sală de gheață, podoaba unui costum nu
     poate fi decât tăiată din același material ca sala: cristal cu fețe.

     Și e chiar obiectul funcției estetice. Ea nu spune „fă-l frumos", spune
     „uită-te la el ca la o lucrare" — iar un șir de cristale pe mijlocul hainei
     e lucrul care cere să fie privit. Din el pleacă, mai încolo, reflexiile de
     pe pereți. */
  cuBucata(18, acum, function () { ornamentDeCristale(ctx, g, acum); });

  // tivul de jos, îngroșat: acolo se termină haina, nu se pierde în podea
  cuBucata(14, acum, function () {
    ctx.strokeStyle = s7.estetica ? CYAN_NEON : ARGINT_RECE;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = Math.max(1.6, g.S * 0.006);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.60, g.costumJos);
    ctx.lineTo(x + w * 0.60, g.costumJos);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  /* Mânecile. Fără ele paltonul era o cutie cu o curea peste mijloc: se vedea
     un obiect geometric, nu o haină. O mânecă atârnată de umăr, cu cotul frânt,
     e semnul după care ochiul recunoaște o haină înainte de orice altceva — și
     scena asta se sprijină pe faptul că **știi** că e un costum. */
  for (const lat of [-1, 1]) {
    cuBucata(20 + lat, acum, function () {
    const ux = x + lat * w * 0.70 * puls, uy = umarY + h * 0.01;
    const cotX = x + lat * w * 0.86, cotY = y + h * 0.40;
    const mansetaX = x + lat * w * 0.74, mansetaY = y + h * 0.62;
    ctx.beginPath();
    ctx.moveTo(ux, uy);
    ctx.lineTo(ux + lat * w * 0.22, uy + h * 0.03);
    ctx.lineTo(cotX + lat * w * 0.12, cotY);
    ctx.lineTo(mansetaX + lat * w * 0.14, mansetaY);
    ctx.lineTo(mansetaX - lat * w * 0.06, mansetaY + h * 0.015);
    ctx.lineTo(cotX - lat * w * 0.10, cotY - h * 0.01);
    ctx.lineTo(ux - lat * w * 0.02, uy + h * 0.10);
    ctx.closePath();
    ctx.fillStyle = lat < 0 ? '#2e3770' : '#242c5e';
    ctx.fill();
    ctx.strokeStyle = s7.estetica ? CYAN_NEON : ARGINT_RECE;
    ctx.globalAlpha = s7.estetica ? 0.8 : 0.4;
    ctx.lineWidth = Math.max(1, g.S * 0.003);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // manșeta: o bandă tăiată la capătul mânecii
    ctx.fillStyle = OTEL_RECE;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.moveTo(mansetaX + lat * w * 0.14, mansetaY);
    ctx.lineTo(mansetaX - lat * w * 0.06, mansetaY + h * 0.015);
    ctx.lineTo(mansetaX - lat * w * 0.05, mansetaY + h * 0.05);
    ctx.lineTo(mansetaX + lat * w * 0.15, mansetaY + h * 0.036);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    });
  }

  // nasturii: patru plăcuțe pe deschizătura din față, sub guler
  cuBucata(23, acum, function () {
  ctx.fillStyle = OTEL_RECE;
  for (let k = 0; k < 4; k++) {
    const ny = y + h * (0.19 + k * 0.085);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.045, ny);
    ctx.lineTo(x + w * 0.045, ny - h * 0.004);
    ctx.lineTo(x + w * 0.04, ny + h * 0.03);
    ctx.lineTo(x - w * 0.05, ny + h * 0.034);
    ctx.closePath();
    ctx.fill();
  }
  });

  // umerii rigizi: două pene ascuțite care ies în afară
  for (const lat of [-1, 1]) {
    cuBucata(25 + lat, acum, function () {
    ctx.beginPath();
    ctx.moveTo(x + lat * w * 0.74 * puls, umarY);
    ctx.lineTo(x + lat * w * 0.96 * puls, umarY - h * 0.04);
    ctx.lineTo(x + lat * w * 0.76, umarY + h * 0.07);
    ctx.closePath();
    ctx.fillStyle = OTEL_RECE;
    ctx.fill();
    });
  }

  // gulerul, deschis ca o pâlnie: de aici pornește fularul
  cuBucata(28, acum, function () {
  ctx.beginPath();
  ctx.moveTo(x - w * 0.26, umarY);
  ctx.lineTo(x - w * 0.12, y - h * 0.02);
  ctx.lineTo(x + w * 0.12, y - h * 0.02);
  ctx.lineTo(x + w * 0.26, umarY);
  ctx.closePath();
  ctx.fillStyle = '#4d5a9c';
  ctx.fill();
  ctx.strokeStyle = ARGINT_RECE;
  ctx.globalAlpha = 0.6;
  ctx.stroke();
  ctx.globalAlpha = 1;
  });

  ctx.restore();
}

/* ---------- COSTUMUL CARE SE DESFACE ---------- */
/* Când se deschide portalul în pieptul costumului, haina nu se stinge: se
   **desface în bucăți** care se depărtează și se strâng la loc, la nesfârșit.

   E chiar figura cubistă, dusă până la capăt. Toată scena a arătat un obiect
   descompus și reașezat — spatele lângă față, latura lângă piept. Acum obiectul
   face singur ce a făcut pictorul cu el: se ia în bucăți și se recompune,
   iar din golul rămas la mijloc se vede drumul mai departe.

   Fiecare bucată pleacă în direcția ei, cu ritmul ei — perioade care nu se
   împart una la alta, ca să nu respire toate deodată ca un acordeon. */
function cuBucata(k, acum, f) {
  if (s7.faza !== 'portal') { f(); return; }
  const g = geomSala7();
  const z = samanta(9100 + k * 5.7), z2 = samanta(9160 + k * 3.3);
  const val = 0.5 - 0.5 * Math.cos(acum * (0.0007 + z * 0.0009) + k * 1.7);
  const cat = s7.atras * val;
  const a = z * Math.PI * 2;
  ctx.save();
  ctx.translate(Math.cos(a) * g.costumLat * 1.5 * cat,
                Math.sin(a) * g.costumInalt * 0.55 * cat);
  ctx.rotate((z2 - 0.5) * 1.3 * cat);
  ctx.globalAlpha *= 1 - cat * 0.35;
  f();
  ctx.restore();
}

/* ---------- ORNAMENTUL DE CRISTALE ---------- */
/* Șirul de cristale de peste mijlocul costumului. Șapte fețe tăiate, de mărimi
   care nu se repetă, aplecate care încotro — un colier de gheață, nu un rând de
   nasturi. Cât funcția estetică doarme, sunt mate, ca niște pietre nespălate;
   când se aprinde, prind culoarea filtrului și ard.

   Locul lor spune și el ceva: taie haina exact la mijloc, adică acolo unde ochiul
   se oprește oricum. Un ornament pus într-un colț ar fi fost un amănunt; pus în
   ax, e chiar subiectul. */
function ornamentDeCristale(c, g, acum) {
  const x = g.costumX, y = g.costumSus, w = g.costumLat, h = g.costumInalt;
  const y0 = y + h * 0.52;
  const CATE = 7;
  const aprins = s7.estetica;
  const filtru = FILTRE_DE_STIL[Math.max(0, s7.filtru)];

  // salba pe care stau: o dungă subțire, abia văzută, ca să nu plutească
  c.strokeStyle = OTEL_RECE;
  c.globalAlpha = 0.55;
  c.lineWidth = Math.max(1, g.S * 0.0025);
  c.beginPath();
  c.moveTo(x - w * 0.52, y0 + h * 0.004);
  c.lineTo(x + w * 0.54, y0 - h * 0.006);
  c.stroke();
  c.globalAlpha = 1;

  for (let k = 0; k < CATE; k++) {
    const t = (k + 0.5) / CATE;
    const z = samanta(8900 + k * 7.3), z2 = samanta(8960 + k * 4.1);
    const cx = intre(x - w * 0.50, x + w * 0.52, t);
    const cy = y0 + (z - 0.5) * h * 0.012;
    // cel din mijloc e cel mai mare: o salbă are o piatră de căpătâi
    const marime = w * (0.055 + 0.05 * Math.sin(t * Math.PI)) * (0.8 + z2 * 0.4);
    const inclin = (z - 0.5) * 0.9;

    c.save();
    c.translate(cx, cy);
    c.rotate(inclin);
    /* Fiecare cristal are trei fețe, ca și bolovanii de pe podea: una spre
       lumină, una în umbră, una spre tine. Din trei fețe se citește volum; din
       una, un romb desenat. */
    const fete = [
      { p: [[0, -1], [0.62, -0.12], [0, 0.25]], c: aprins ? filtru.culoare : '#8fa8d0' },
      { p: [[0, -1], [-0.6, -0.05], [0, 0.25]], c: aprins ? ALB_GHEATA : '#c3d6ee' },
      { p: [[-0.6, -0.05], [0, 0.25], [0.62, -0.12], [0, 1]], c: aprins ? '#6fb6e8' : '#5f7bab' }
    ];
    for (const f of fete) {
      c.beginPath();
      for (let j = 0; j < f.p.length; j++) {
        const px = f.p[j][0] * marime, py = f.p[j][1] * marime;
        if (j === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.closePath();
      c.fillStyle = f.c;
      c.globalAlpha = aprins ? 0.95 : 0.8;
      c.fill();
    }
    // muchiile, tăioase
    c.strokeStyle = aprins ? ALB_GHEATA : ARGINT_RECE;
    c.globalAlpha = aprins ? 0.95 : 0.5;
    c.lineWidth = Math.max(0.8, marime * 0.09);
    c.beginPath();
    c.moveTo(0, -marime); c.lineTo(0.62 * marime, -0.12 * marime);
    c.lineTo(0, marime); c.lineTo(-0.6 * marime, -0.05 * marime);
    c.closePath();
    c.moveTo(0, -marime); c.lineTo(0, 0.25 * marime);
    c.stroke();

    /* Scânteia de pe vârf, numai când e aprins: fiecare cristal clipește pe
       socoteala lui, la răstimpuri care nu se împart unul la altul — un șir care
       clipește la unison ar fi un lanț de becuri. */
    if (aprins) {
      const clipeste = Math.max(0, Math.sin(acum * (0.0018 + z * 0.0022) + k * 2.1));
      c.globalAlpha = clipeste * 0.9;
      c.strokeStyle = ALB_GHEATA;
      c.lineWidth = Math.max(0.8, marime * 0.11);
      const raza = marime * (0.7 + clipeste * 0.7);
      c.beginPath();
      c.moveTo(-raza, -marime * 0.3); c.lineTo(raza, -marime * 0.3);
      c.moveTo(0, -marime * 0.3 - raza); c.lineTo(0, -marime * 0.3 + raza);
      c.stroke();
    }
    c.globalAlpha = 1;
    c.restore();
  }
}

/* ---------- PIESELE RĂZLEȚE ---------- */
/* Spatele, latura și căptușeala, așezate nefiresc lângă haina văzută din față.
   Fiecare stă puțin strâmb și puțin deasupra celeilalte: dacă ar fi aliniate
   cuminte, ar arăta a planșă de instrucțiuni, nu a lucrare. */
function deseneazaPieseleCubiste(acum) {
  const g = geomSala7();
  const x = g.costumX, y = g.costumSus, w = g.costumLat, h = g.costumInalt;
  const linie = s7.estetica ? CYAN_NEON : ARGINT_RECE;

  /* 1. SPATELE hainei, ridicat în stânga sus. Se recunoaște după cusătura din
        mijloc și după gulerul văzut pe dinapoi — două semne care pe față nu
        există. */
  cuBucata(0, acum, function () {
  ctx.save();
  ctx.translate(x - w * 1.02, y + h * 0.28);
  ctx.rotate(-0.13);
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(-w * 0.42, -h * 0.16);
  ctx.lineTo(w * 0.40, -h * 0.19);
  ctx.lineTo(w * 0.34, h * 0.30);
  ctx.lineTo(-w * 0.38, h * 0.33);
  ctx.closePath();
  ctx.fillStyle = '#1e2652';
  ctx.fill();
  ctx.strokeStyle = linie;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = Math.max(1, g.S * 0.003);
  ctx.stroke();
  // cusătura din mijlocul spatelui
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.175);
  ctx.lineTo(-w * 0.02, h * 0.315);
  ctx.stroke();
  // gulerul văzut pe dinapoi: o bandă lipită de muchia de sus
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#4d5a9c';
  ctx.beginPath();
  ctx.moveTo(-w * 0.20, -h * 0.175);
  ctx.lineTo(w * 0.20, -h * 0.185);
  ctx.lineTo(w * 0.17, -h * 0.115);
  ctx.lineTo(-w * 0.17, -h * 0.105);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  });

  /* 2. LATURA: haina văzută din profil, o felie îngustă cu umărul ieșit în
        afară. Pusă lângă cea din față, ochiul le citește ca pe același obiect
        întors — asta e toată șmecheria cubistă. */
  cuBucata(1, acum, function () {
  ctx.save();
  ctx.translate(x + w * 1.06, y + h * 0.52);
  ctx.rotate(0.10);
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(-w * 0.10, -h * 0.34);
  ctx.lineTo(w * 0.16, -h * 0.37);
  ctx.lineTo(w * 0.13, h * 0.33);
  ctx.lineTo(-w * 0.14, h * 0.36);
  ctx.closePath();
  ctx.fillStyle = '#28305e';
  ctx.fill();
  ctx.strokeStyle = linie;
  ctx.globalAlpha = 0.5;
  ctx.stroke();
  // umărul care iese din profil
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = OTEL_RECE;
  ctx.beginPath();
  ctx.moveTo(-w * 0.10, -h * 0.34);
  ctx.lineTo(w * 0.16, -h * 0.37);
  ctx.lineTo(w * 0.26, -h * 0.30);
  ctx.lineTo(-w * 0.06, -h * 0.27);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  });

  /* 3. CĂPTUȘEALA: un petic din **interiorul** hainei, cu buzunarul lui și cu
        cusăturile la vedere. Se pune peste poale, ca și cum haina ar fi
        întoarsă pe dos chiar în locul ăla. */
  cuBucata(2, acum, function () {
  ctx.save();
  ctx.translate(x - w * 0.62, y + h * 0.80);
  ctx.rotate(0.22);
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(-w * 0.30, -h * 0.13);
  ctx.lineTo(w * 0.32, -h * 0.16);
  ctx.lineTo(w * 0.28, h * 0.14);
  ctx.lineTo(-w * 0.33, h * 0.16);
  ctx.closePath();
  ctx.fillStyle = s7.estetica ? '#5a4a9e' : '#3f3a72';
  ctx.fill();
  ctx.strokeStyle = linie;
  ctx.globalAlpha = 0.6;
  ctx.stroke();
  // buzunarul de dinăuntru
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = ALB_GHEATA;
  ctx.lineWidth = Math.max(1, g.S * 0.0025);
  ctx.beginPath();
  ctx.moveTo(-w * 0.14, -h * 0.03);
  ctx.lineTo(w * 0.14, -h * 0.045);
  ctx.lineTo(w * 0.12, h * 0.07);
  ctx.lineTo(-w * 0.15, h * 0.085);
  ctx.closePath();
  ctx.stroke();
  // cusăturile: liniuțe scurte, la pas egal, cum se coase o căptușeală
  ctx.globalAlpha = 0.5;
  for (let k = 0; k < 9; k++) {
    const tx = -w * 0.28 + k * w * 0.07;
    ctx.beginPath();
    ctx.moveTo(tx, -h * 0.115);
    ctx.lineTo(tx + w * 0.03, -h * 0.115);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
  });
}

/* ---------- CE PARTE A COSTUMULUI AI ATINS ----------
   Costumul nu e un buton, e un obiect cu părți — iar fiecare parte poartă altă
   funcție. Ăsta e chiar felul în care se învață: nu citești o listă de trei
   funcții, ci pui degetul pe guler, pe corp, pe mânecă, și afli de fiecare dată
   la ce e bună bucata aia.

   Ordinea contează: fularul se caută primul, fiindcă el iese în afara siluetei
   și de-aia e cel mai ușor de nimerit din greșeală. */
function parteaCostumului(x, y) {
  const g = geomSala7();
  const cx = g.costumX, cy = g.costumSus, w = g.costumLat, h = g.costumInalt;
  /* Cutia de atins cuprinde și piesele răzlețe: spatele din stânga, latura din
     dreapta, căptușeala de peste poale. Ele sunt tot costumul — dacă n-ar
     răspunde la deget, ar fi decor, iar sala tocmai spune că nu sunt. */
  const peCostum = x > cx - w * 1.5 && x < cx + w * 1.32 &&
                   y > cy - h * 0.06 && y < g.costumJos + h * 0.02;

  /* Fularul are dreptul lui de trecere, dar numai **sus**, la guler. Îi dădusem
     o rază de două ori și ceva cât el, ca să fie ușor de nimerit — și atunci
     înghițea și pieptul: apăsai pe nasturi și ți se aprindea protecția. Un
     obiect care fură atingerile vecinilor lui face din trei părți una. */
  const laGuler = y < cy + h * 0.24;
  if (laGuler && Math.hypot(x - g.fularX, y - g.fularY) < g.fularR * 1.9) return 0;
  if (!peCostum) return -1;
  if (laGuler) return 0;
  /* Pieptul cu nasturii și reverele: partea care se vede și care se judecă —
     estetica. Poalele și mânecile: partea cu care te miști — utilitatea. */
  return y < cy + h * 0.55 ? 2 : 1;
}

/* ---------- PANOUL FUNCȚIEI ---------- */
/* La dreapta costumului, la înălțimea lui. Aici scrie ce face partea pe care
   tocmai ai atins-o, și dacă funcția e pornită sau nu.

   Stă lângă costum, nu în josul ecranului: un text despre mâneca pe care tocmai
   ai atins-o, scris la doi metri de ea, cere să faci legătura singur. */
function deseneazaPanoulFunctiei(acum) {
  const g = geomSala7();
  const x = g.panouX, y = g.panouSus, w = g.panouLat, h = g.panouInalt;
  const are = s7.functiaAratata >= 0;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.02);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w * 0.985, y + h);
  ctx.lineTo(x + w * 0.012, y + h * 0.975);
  ctx.closePath();
  ctx.fillStyle = 'rgba(14, 20, 48, 0.86)';
  ctx.fill();
  ctx.strokeStyle = are ? CYAN_NEON : ARGINT_RECE;
  ctx.globalAlpha = are ? 0.8 : 0.35;
  ctx.lineWidth = Math.max(1, w * 0.008);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  const marime = Math.max(9, w * 0.084);
  if (!are) {
    scrieInCaseta(ctx, 'Atinge o parte a costumului ca să afli ce face.',
                  x + w * 0.5, y + h * 0.36, w * 0.84, h * 0.5, marime, '', '#8ea2c8');
    return;
  }

  const f = FUNCTIILE_COSTUMULUI[s7.functiaAratata];
  const pornita = [s7.protectie, s7.utilitate, s7.estetica][s7.functiaAratata];

  let jos = scrieInCaseta(ctx, f.nume, x + w * 0.5, y + h * 0.05, w * 0.86,
                          h * 0.18, marime * 1.06, 'bold',
                          pornita ? CYAN_NEON : ALB_GHEATA);
  jos = scrieInCaseta(ctx, f.text, x + w * 0.5, jos + h * 0.035, w * 0.86,
                      h * 0.56, marime, '', '#cfdcf4');
  /* Sub definiție, un singur rând: ce ai de făcut, sau că e gata. Cine a citit
     ce face funcția vrea imediat s-o pornească, iar dacă nu-i spune nimeni cum,
     se întoarce la pipăit. */
  scrieInCaseta(ctx, pornita ? '✓ pornită' : f.indemn,
                x + w * 0.5, jos + h * 0.03, w * 0.86, h * 0.16, marime, 'bold',
                pornita ? CYAN_NEON : ULTRAVIOLET);
}

/* ---------- FULARUL ---------- */
/* Nu un fular desenat, ci un fular **geometric**: o bandă frântă în segmente
   drepte, care se strânge lângă guler cât timp e adunat și se desface în toată
   camera când îl pui la treabă.

   E singurul obiect din sală care își schimbă forma, nu doar culoarea, și de-aia
   el e cel care poartă prima funcție: se **vede** ce face un costum. */
function segmenteleFularului(cat) {
  const g = geomSala7();
  const p = atenuare(Math.min(1, Math.max(0, cat)));
  const puncte = [{ x: g.fularX, y: g.fularY }];
  const N = 9;
  for (let k = 1; k <= N; k++) {
    const t = k / N;
    // strâns: se învârte scurt în jurul gulerului. desfăcut: taie toată sala.
    /* Strâns, fularul se colăcește de două ori în jurul gulerului: raza abia se
       schimbă, unghiul se duce. Cu raza crescătoare — cum era întâi — ieșea o
       spirală largă, adică un semn de întrebare atârnat de umăr. */
    const razaStransa = g.fularR * (0.6 + 0.3 * Math.sin(t * 7.2));
    /* Desfăcut, fularul taie camera de-a curmezișul — dar rămâne **în** ea.
       Întins mai departe, capătul lui ieșea prin marginea de sus a ecranului, iar
       un fular care se termină afară din tablou nu se mai vede că e un fular. */
    const razaLarga = g.S * (0.14 + t * 0.44);
    const raza = intre(razaStransa, razaLarga, p);
    const unghi = intre(0.9 + t * 9.4, 2.72 + t * 1.15, p);
    puncte.push({
      x: g.fularX + Math.cos(unghi) * raza,
      y: g.fularY + Math.sin(unghi) * raza * intre(1, 0.42, p)
    });
  }
  return puncte;
}

function deseneazaFularul(acum) {
  const g = geomSala7();
  const puncte = segmenteleFularului(s7.fularDesfacut);
  const cheama = !s7.protectie ? (0.55 + 0.45 * Math.sin(acum * 0.005)) : 0;

  ctx.save();
  // banda: două linii paralele, frânte, cu miezul plin între ele
  for (let strat = 0; strat < 2; strat++) {
    ctx.beginPath();
    for (let k = 0; k < puncte.length; k++) {
      const p = puncte[k];
      if (k === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = strat === 0
      ? (s7.protectie ? CYAN_NEON : '#8fa8d8')
      : (s7.protectie ? ULTRAVIOLET : '#5566a8');
    ctx.globalAlpha = strat === 0 ? 0.95 : 0.6;
    ctx.lineWidth = Math.max(2, g.S * (strat === 0 ? 0.016 : 0.028));
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // franjurii de la capăt: trei ace drepte, ca la un fular tăiat, nu tricotat
  const ultim = puncte[puncte.length - 1], penultim = puncte[puncte.length - 2];
  const dx = ultim.x - penultim.x, dy = ultim.y - penultim.y;
  const d = Math.max(0.001, Math.hypot(dx, dy));
  for (let k = -1; k <= 1; k++) {
    ctx.strokeStyle = s7.protectie ? CYAN_NEON : '#8fa8d8';
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = Math.max(1, g.S * 0.004);
    ctx.beginPath();
    ctx.moveTo(ultim.x, ultim.y);
    ctx.lineTo(ultim.x + (dx / d) * g.S * 0.05 + k * (dy / d) * g.S * 0.02,
               ultim.y + (dy / d) * g.S * 0.05 - k * (dx / d) * g.S * 0.02);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  /* Cât timp nu l-ai pus, fularul cheamă: un romb care pulsează în jurul lui.
     E singurul lucru din sală care se mișcă atunci, deci ochiul se duce la el
     fără să fie nevoie de o săgeată desenată. */
  if (cheama > 0) {
    ctx.strokeStyle = CYAN_NEON;
    ctx.globalAlpha = 0.25 + cheama * 0.5;
    ctx.lineWidth = Math.max(1, g.S * 0.004);
    /* Rombul care cheamă stă strâns în jurul fularului, nu în jurul costumului:
       la o rază de o dată și jumătate din fular ajungea peste umerii paltonului,
       și atunci nu mai arăta spre fular, arăta spre tot. */
    const r = g.fularR * (0.95 + cheama * 0.25);
    ctx.beginPath();
    ctx.moveTo(g.fularX, g.fularY - r);
    ctx.lineTo(g.fularX + r, g.fularY);
    ctx.lineTo(g.fularX, g.fularY + r);
    ctx.lineTo(g.fularX - r, g.fularY);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/* ---------- PUZZLE-UL LINIILOR DE FORȚĂ ---------- */
/* Cinci noduri pe o spirală, care trebuie legate **în ordine**. Cel care
   urmează pulsează; cel greșit zguduie sala și te lasă să încerci iar.

   De ce în ordine și nu oricum: o linie de forță are un sens: pleacă din vârtej
   și se duce în afară. Legată de-a valma, nu mai e o linie, e un desen. Iar
   jucătorul care urmărește pulsul învață sensul fără să-i spună nimeni. */
function deseneazaPuzzleul(acum) {
  if (s7.utilitate && s7.nodLegat >= NODURI_PUZZLE) {
    // odată rezolvat, rămâne o linie aprinsă: se vede ce ai făcut
    deseneazaLantulNodurilor(1);
    return;
  }
  const g = geomSala7();
  deseneazaLantulNodurilor(0.85);

  for (let k = 0; k < NODURI_PUZZLE; k++) {
    const n = nodulPuzzle(k);
    const legat = k < s7.nodLegat;
    /* Cât liniile dorm — adică până apeși roata — niciun nod nu e „următorul":
       se văd toate, dar stinse, ca un mecanism nealimentat. Pulsând dinainte,
       ar chema la o faptă care încă nu se poate face. */
    const urmator = s7.puzzleTreaz && k === s7.nodLegat;
    const puls = urmator ? 0.5 + 0.5 * Math.sin(acum * 0.006) : 0;

    ctx.save();
    // nodul e un romb, nu un cerc: în sala asta nu există rotunjimi
    const r = n.r * (1 + puls * 0.22);
    ctx.beginPath();
    ctx.moveTo(n.x, n.y - r);
    ctx.lineTo(n.x + r, n.y);
    ctx.lineTo(n.x, n.y + r);
    ctx.lineTo(n.x - r, n.y);
    ctx.closePath();
    /* Nodurile nelegate se vedeau abia-abia: albastru închis pe albastru închis.
       Un puzzle ale cărui piese nu se disting nu e greu, e ascuns. */
    ctx.fillStyle = legat ? 'rgba(62, 242, 255, 0.55)' : 'rgba(70, 88, 150, 0.75)';
    ctx.fill();
    ctx.strokeStyle = legat ? CYAN_NEON : (urmator ? ALB_GHEATA : ARGINT_RECE);
    ctx.globalAlpha = legat ? 1 : (urmator ? 0.6 + puls * 0.4 : (s7.puzzleTreaz ? 0.8 : 0.4));
    ctx.lineWidth = Math.max(1.4, g.S * 0.004);
    ctx.stroke();

    // miezul: un punct ascuțit, care arată că nodul e viu
    if (legat || urmator) {
      ctx.fillStyle = legat ? ALB_GHEATA : CYAN_NEON;
      ctx.globalAlpha = legat ? 0.9 : 0.3 + puls * 0.6;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y - r * 0.32);
      ctx.lineTo(n.x + r * 0.32, n.y);
      ctx.lineTo(n.x, n.y + r * 0.32);
      ctx.lineTo(n.x - r * 0.32, n.y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function deseneazaLantulNodurilor(tarie) {
  if (s7.nodLegat < 1) return;
  const g = geomSala7();
  ctx.save();
  /* Lanțul e alb, nu cyan: cyan-ul e culoarea vârtejului, iar peste brațele lui
     aprinse o linie cyan se pierde. Ce ai făcut tu trebuie să se deosebească de
     ce era acolo dinainte. */
  ctx.strokeStyle = ALB_GHEATA;
  ctx.lineWidth = Math.max(1.5, g.S * 0.007);
  ctx.lineJoin = 'miter';
  ctx.globalAlpha = 0.9 * tarie;
  ctx.beginPath();
  for (let k = 0; k < s7.nodLegat; k++) {
    const n = nodulPuzzle(k);
    if (k === 0) ctx.moveTo(n.x, n.y); else ctx.lineTo(n.x, n.y);
  }
  ctx.stroke();
  // și o dâră mai lată sub ea, ca linia să pară că arde
  ctx.globalAlpha = 0.22 * tarie;
  ctx.lineWidth = Math.max(3, g.S * 0.018);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- CELE TREI FORME DE SUB COSTUM ---------- */
/* Sub costum stau trei forme geometrice, una pentru fiecare funcție. Apeși pe
   una: în caseta din dreapta se scrie ce face funcția aceea, iar pe costum se
   întâmplă **altceva de fiecare dată**. Nu sunt trei butoane identice care fac
   același lucru cu altă culoare — fiecare are forma ei și fapta ei:

     scutul    → costumul se face armură: fularul se desface în cameră și
                 promoroaca pleacă de pe ecran.
     roata     → costumul dă drumul la micro-căldură: liniile de forță din
                 vârtej se trezesc și abia atunci pot fi legate.
     prisma    → costumul își arată valoarea: muchiile taie lumina albastră în
                 modele pe pereți.

   Formele nu sunt la întâmplare. Un scut se recunoaște că apără, o roată
   dințată că lucrează, o prismă că desface lumina — și așa cele trei funcții se
   țin minte după siluetă, nu după rândul scris sub ele. */
const FORME_FUNCTIILOR = [
  { forma: 'scut', culoare: CYAN_NEON },
  { forma: 'roata', culoare: '#7fd8ff' },
  { forma: 'prisma', culoare: ULTRAVIOLET }
];

/* Filtrele de stil rămân, dar nu mai sunt de ales: prisma le trece pe rând, la
   fiecare apăsare. Trei tăieturi ale aceleiași lumini. */
const FILTRE_DE_STIL = [
  { nume: 'PRIZMĂ', culoare: CYAN_NEON },
  { nume: 'ULTRAVIOLET', culoare: ULTRAVIOLET },
  { nume: 'ARGINT', culoare: ALB_GHEATA }
];

function traseulFormei(c, forma, x, y, r) {
  c.beginPath();
  if (forma === 'scut') {
    // scut: umerii drepți sus, vârful jos — se citește „apără" dintr-o privire
    c.moveTo(x - r * 0.86, y - r * 0.78);
    c.lineTo(x + r * 0.86, y - r * 0.78);
    c.lineTo(x + r * 0.7, y + r * 0.3);
    c.lineTo(x, y + r);
    c.lineTo(x - r * 0.7, y + r * 0.3);
    c.closePath();
  } else if (forma === 'roata') {
    // roată dințată: opt dinți drepți, ca la orice mașinărie vorticistă
    const dinti = 8;
    for (let k = 0; k < dinti * 2; k++) {
      const a = (k / (dinti * 2)) * Math.PI * 2 - Math.PI / 2;
      const rr = k % 2 === 0 ? r : r * 0.68;
      const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
      if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.closePath();
  } else {
    // prismă: un triunghi culcat, cu vârful spre dreapta, ca cea care desface lumina
    c.moveTo(x - r * 0.8, y + r * 0.7);
    c.lineTo(x, y - r * 0.9);
    c.lineTo(x + r * 0.9, y + r * 0.55);
    c.closePath();
  }
}

function deseneazaFormeleFunctiilor(acum) {
  const g = geomSala7();
  const pornite = [s7.protectie, s7.utilitate, s7.estetica];

  ctx.save();
  // pupitrul: o bară tăiată, nu o consolă
  ctx.fillStyle = 'rgba(24, 32, 70, 0.8)';
  ctx.beginPath();
  ctx.moveTo(g.formaX(0) - g.formaR * 1.9, g.formaY + g.formaR * 1.3);
  ctx.lineTo(g.formaX(2) + g.formaR * 1.9, g.formaY + g.formaR * 1.2);
  ctx.lineTo(g.formaX(2) + g.formaR * 1.6, g.formaY + g.formaR * 2.0);
  ctx.lineTo(g.formaX(0) - g.formaR * 1.6, g.formaY + g.formaR * 2.1);
  ctx.closePath();
  ctx.fill();

  for (let k = 0; k < FORME_FUNCTIILOR.length; k++) {
    const f = FORME_FUNCTIILOR[k];
    const x = g.formaX(k), y = g.formaY;
    const aprinsa = pornite[k];
    /* Cheamă numai forma care urmează la rând. Pulsând toate trei deodată, ochiul
       n-ar ști de unde să înceapă — iar cele trei funcții se învață în ordine:
       întâi te aperi, pe urmă te miști, abia la urmă te uiți la tine. */
    const urmatoare = !aprinsa && pornite.slice(0, k).every(function (p) { return p; });
    const puls = urmatoare ? 0.5 + 0.5 * Math.sin(acum * 0.005) : 0;
    const r = g.formaR * (1 + (aprinsa ? 0.12 : puls * 0.12));

    traseulFormei(ctx, f.forma, x, y, r);
    ctx.fillStyle = aprinsa ? f.culoare : 'rgba(36, 46, 92, 0.9)';
    ctx.globalAlpha = aprinsa ? 0.45 : 0.9;
    ctx.fill();
    ctx.strokeStyle = aprinsa ? ALB_GHEATA : f.culoare;
    ctx.globalAlpha = aprinsa ? 1 : (0.45 + puls * 0.5);
    ctx.lineWidth = Math.max(1.2, g.S * 0.0035);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // semnul că e pornită: un punct plin în mijloc
    if (aprinsa) {
      ctx.fillStyle = ALB_GHEATA;
      traseulFormei(ctx, f.forma, x, y, r * 0.32);
      ctx.fill();
    }
  }
  ctx.restore();
}

/* Reflexiile de pe pereți, după ce s-a pus filtrul./* Reflexiile de pe pereți, după ce s-a pus filtrul. Muchiile costumului taie
   lumina și o aruncă în evantai — modele abstracte, nu pete: tot ce iese dintr-o
   muchie dreaptă e drept. */
function deseneazaReflexiile(acum) {
  if (s7.reflexii <= 0.01) return;
  const g = geomSala7();
  const f = FILTRE_DE_STIL[Math.max(0, s7.filtru)];
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 22; k++) {
    const a = samanta(7900 + k * 4.7), b = samanta(7960 + k * 6.3);
    const unghi = -0.4 + a * 3.9 + Math.sin(acum * 0.0004 + k) * 0.05;
    const lung = g.S * (0.3 + b * 0.75);
    const lat = g.S * (0.012 + b * 0.05);
    /* Reflexiile pleacă din **ornamentul de cristale**, nu din toată haina: ele
       sunt lumina tăiată de fețele lui. Împrăștiate de peste tot, n-ar mai avea
       o pricină pe care s-o vezi. */
    const x0 = g.costumX + (a - 0.5) * g.costumLat * 1.02;
    const y0 = g.costumSus + g.costumInalt * 0.52 + (b - 0.5) * g.costumInalt * 0.05;
    ctx.globalAlpha = (0.05 + b * 0.10) * s7.reflexii;
    ctx.fillStyle = k % 3 === 0 ? ALB_GHEATA : f.culoare;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + Math.cos(unghi) * lung - Math.sin(unghi) * lat,
               y0 + Math.sin(unghi) * lung + Math.cos(unghi) * lat);
    ctx.lineTo(x0 + Math.cos(unghi) * lung + Math.sin(unghi) * lat,
               y0 + Math.sin(unghi) * lung - Math.cos(unghi) * lat);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- PROMOROACA DE PE MARGINI ---------- */
/* Rama de gheață a ecranului. Nu o vignetă întunecată, ci **cristale**: ace
   drepte care cresc dinspre margini spre mijloc, cum se prinde bruma pe geam.
   Cu cât stai mai mult fără costum, cu atât nu se schimbă nimic — nu se
   îngroașă, fiindcă o pedeapsă care crește singură e o pedeapsă pentru cine
   citește încet. Se duce numai când pui fularul. */
/* Conturul barierei la mărimea de acum: un poligon tăiat, care pleacă din fular.
   Nu un cerc — în sala asta nu există rotunjimi, iar o barieră rotundă ar fi
   singura formă moale din toată camera. */
function traseulBarierei(c, cat) {
  const g = geomSala7();
  const raza = Math.pow(Math.min(1, Math.max(0, cat)), 0.75) * Math.hypot(W, H) * 1.15;
  const laturi = 7;
  c.beginPath();
  for (let k = 0; k <= laturi; k++) {
    const a = (k / laturi) * Math.PI * 2 + 0.3;
    const r = raza * (0.86 + 0.14 * Math.sin(k * 2.3));
    const x = g.fularX + Math.cos(a) * r, y = g.fularY + Math.sin(a) * r * 0.92;
    if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  c.closePath();
  return raza;
}

function deseneazaBariera(acum) {
  if (s7.bariera <= 0 || s7.bariera >= 1) return;
  const g = geomSala7();
  ctx.save();
  // muchia care mătură: o linie groasă, aprinsă, plus două ecouri în urma ei
  for (let k = 0; k < 3; k++) {
    const cat = s7.bariera - k * 0.06;
    if (cat <= 0) continue;
    traseulBarierei(ctx, cat);
    ctx.strokeStyle = k === 0 ? ALB_GHEATA : CYAN_NEON;
    ctx.globalAlpha = (k === 0 ? 0.9 : 0.3 / k) * (1 - s7.bariera * 0.4);
    ctx.lineWidth = Math.max(1.5, g.S * (k === 0 ? 0.012 : 0.005));
    ctx.lineJoin = 'miter';
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function deseneazaPromoroaca(acum) {
  if (s7.promoroaca <= 0.01) return;
  const g = geomSala7();
  const p = s7.promoroaca;

  ctx.save();
  /* Bruma se desenează numai **în afara** barierei. Tăietura asta e chiar
     curățenia despre care vorbește fișa funcției: nu se stinge peste tot
     deodată, ci pleacă din locul prin care a trecut bariera. */
  if (s7.bariera > 0 && s7.bariera < 1) {
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    traseulBarierei(ctx, s7.bariera);
    ctx.clip('evenodd');
  }
  /* Ceața stă pe margini și lasă mijlocul liber. Prima dată o întindeam peste
     tot ecranul: sala dispărea sub ea, iar promoroaca nu mai era o ramă, era o
     perdea. O ramă îngheață privirea; o perdea o oprește — și un jucător care nu
     vede nimic nu simte frig, simte că s-a stricat ceva. */
  const rama = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.42,
                                        W * 0.5, H * 0.5, Math.max(W, H) * 0.72);
  rama.addColorStop(0, 'rgba(200, 232, 255, 0)');
  rama.addColorStop(0.6, `rgba(170, 214, 255, ${0.10 * p})`);
  rama.addColorStop(1, `rgba(226, 244, 255, ${0.44 * p})`);
  ctx.fillStyle = rama;
  ctx.fillRect(0, 0, W, H);

  // acele de brumă, crescute din cele patru margini spre mijloc
  for (let k = 0; k < 130; k++) {
    const a = samanta(8100 + k * 3.3), b = samanta(8170 + k * 5.9);
    const e = samanta(8230 + k * 4.1);
    const latura = Math.floor(a * 4);
    let x, y, dx, dy;
    if (latura === 0) { x = W * b; y = 0; dx = (e - 0.5) * 0.7; dy = 1; }
    else if (latura === 1) { x = W * b; y = H; dx = (e - 0.5) * 0.7; dy = -1; }
    else if (latura === 2) { x = 0; y = H * b; dx = 1; dy = (e - 0.5) * 0.7; }
    else { x = W; y = H * b; dx = -1; dy = (e - 0.5) * 0.7; }
    /* Acele sunt scurte și dese lângă margine, nu lungi și răzlețe. Bruma
       crește din ramă spre mijloc și se subțiază: dacă ajunge până în centru,
       nu mai e brumă pe geam, e o pădure de ace pe ecran. */
    const lung = g.S * (0.02 + e * e * 0.10) * p;
    ctx.strokeStyle = ALB_GHEATA;
    ctx.globalAlpha = (0.10 + e * 0.3) * p;
    ctx.lineWidth = Math.max(0.7, g.S * 0.002 * (0.4 + e));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx * lung, y + dy * lung);
    // ramurile acului: bruma nu crește dreaptă, se ramifică
    for (const lat of [-1, 1]) {
      const mij = 0.45 + e * 0.3;
      ctx.moveTo(x + dx * lung * mij, y + dy * lung * mij);
      ctx.lineTo(x + dx * lung * mij + (dy * lat + dx * 0.5) * lung * 0.32,
                 y + dy * lung * mij + (-dx * lat + dy * 0.5) * lung * 0.32);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- CURSORUL DE GHEAȚĂ ---------- */
/* Cât ești înghețat, degetul nu mai e o luminiță caldă: e un cub de gheață
   pixelat, greu, care se târăște după mână. Se desenează în locul cursorului
   obișnuit — de-aia funcția întoarce `true`, ca bucla să știe că s-a ocupat
   altcineva de el.

   Pixelat dinadins. Un cub neted ar fi un obiect; unul cu pixeli mari e un
   obiect **stricat**, înghețat în ecran — și senzația asta o vrem. */
function cursorulScenei7() {
  if (stare !== 'gheata') return false;
  if (s7.degetX < -100) return true;
  const g = geomSala7();
  const x = s7.degetX, y = s7.degetY;

  if (!s7.inghetat) {
    // dezghețat: un vârf ascuțit, rece, dar viu
    const r = g.S * 0.016;
    ctx.save();
    ctx.strokeStyle = s7.utilitate ? CYAN_NEON : ARGINT_RECE;
    ctx.lineWidth = Math.max(1.4, g.S * 0.003);
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r); ctx.lineTo(x - r, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = s7.utilitate ? 'rgba(62, 242, 255, 0.45)' : 'rgba(168, 182, 212, 0.3)';
    ctx.fill();
    ctx.restore();
    return true;
  }

  // înghețat: cubul
  const s = g.S * 0.05;
  const pix = Math.max(2, s * 0.16);
  ctx.save();
  ctx.translate(x, y);

  /* Cele trei fețe ale unui cub izometric. Cu una singură ar fi un pătrat; cu
     trei, ochiul citește volum — și un volum rece atârnat de mână se simte greu. */
  const fete = [
    { pct: [[0, -1], [0.87, -0.5], [0, 0], [-0.87, -0.5]], culoare: '#cfe9ff' },  // capacul
    { pct: [[-0.87, -0.5], [0, 0], [0, 1], [-0.87, 0.5]], culoare: '#7fb4e0' },   // stânga
    { pct: [[0.87, -0.5], [0, 0], [0, 1], [0.87, 0.5]], culoare: '#5b8fc9' }      // dreapta
  ];
  for (const f of fete) {
    ctx.beginPath();
    for (let k = 0; k < f.pct.length; k++) {
      const px = f.pct[k][0] * s, py = f.pct[k][1] * s;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = f.culoare;
    ctx.globalAlpha = 0.92;
    ctx.fill();

    // pixelii: pătrățele mari, tăiate la forma feței
    ctx.save();
    ctx.clip();
    for (let ix = -2; ix <= 2; ix++) {
      for (let iy = -2; iy <= 3; iy++) {
        const z = samanta(8400 + ix * 13 + iy * 7 + f.pct[0][0] * 31);
        if (z < 0.55) continue;
        ctx.globalAlpha = 0.10 + z * 0.22;
        ctx.fillStyle = z > 0.8 ? '#ffffff' : '#2f5f96';
        ctx.fillRect(ix * pix, iy * pix, pix, pix);
      }
    }
    ctx.restore();
  }
  // muchiile cubului, tăiate drept
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = ALB_GHEATA;
  ctx.lineWidth = Math.max(1, s * 0.06);
  ctx.beginPath();
  ctx.moveTo(0, -s); ctx.lineTo(0.87 * s, -0.5 * s); ctx.lineTo(0.87 * s, 0.5 * s);
  ctx.lineTo(0, s); ctx.lineTo(-0.87 * s, 0.5 * s); ctx.lineTo(-0.87 * s, -0.5 * s);
  ctx.closePath();
  ctx.moveTo(0, -s); ctx.lineTo(0, 0); ctx.lineTo(0, s);
  ctx.moveTo(-0.87 * s, -0.5 * s); ctx.lineTo(0, 0); ctx.lineTo(0.87 * s, -0.5 * s);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
  return true;
}

/* ---------- INDICATORUL DE TEMPERATURĂ ---------- */
/* Cât ești înghețat, jos apare o bară care se umple pe măsură ce freci. Nu un
   termometru rotund: o bară tăiată în trepte, în limba sălii.

   Fără ea, „scutură mouse-ul" e o poruncă fără răspuns: freci și nu știi dacă
   folosește la ceva. Cu ea, fiecare zvâcnitură se vede — și atunci nu mai e o
   corvoadă, e o luptă pe care o câștigi. */
function deseneazaTermometrul(acum) {
  if (!s7.inghetat && !s7.cereScuturare) return;
  const g = geomSala7();
  const lat = Math.min(W * 0.42, ecran(440));
  const inalt = H * 0.032;
  const x = W * 0.5 - lat / 2, y = H * 0.9;
  const TREPTE = 14;

  ctx.save();
  ctx.fillStyle = 'rgba(12, 18, 44, 0.8)';
  ctx.beginPath();
  ctx.moveTo(x - inalt * 0.5, y);
  ctx.lineTo(x + lat, y - inalt * 0.12);
  ctx.lineTo(x + lat + inalt * 0.5, y + inalt);
  ctx.lineTo(x, y + inalt * 1.1);
  ctx.closePath();
  ctx.fill();

  for (let k = 0; k < TREPTE; k++) {
    const plin = (k + 1) / TREPTE <= s7.caldura;
    const tx = x + (k / TREPTE) * lat;
    const tw = (lat / TREPTE) * 0.78;
    ctx.fillStyle = plin
      ? (k > TREPTE * 0.7 ? '#ffd07a' : (k > TREPTE * 0.4 ? CYAN_NEON : '#7fb4e0'))
      : 'rgba(60, 76, 130, 0.5)';
    ctx.beginPath();
    ctx.moveTo(tx + inalt * 0.16, y + inalt * 0.14);
    ctx.lineTo(tx + tw + inalt * 0.16, y + inalt * 0.1);
    ctx.lineTo(tx + tw, y + inalt * 0.86);
    ctx.lineTo(tx, y + inalt * 0.9);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  textIncadrat(s7.inghetat ? 'Freacă! Mișcă mâna repede, stânga-dreapta.'
                          : 'Scutură! Mișcă mâna repede, stânga-dreapta.',
               W * 0.5, y - H * 0.05, Math.min(W * 0.6, ecran(600)), ecran(26),
               `bold ${Math.max(Math.round(ecran(13)), Math.round(g.S * 0.024))}px Georgia`,
               ALB_GHEATA);
}

/* ---------- CIOBURILE ---------- */
/* Când se sparge gheața, bucățile zboară spre margini. Nu se opresc și nu cad:
   ies din ecran și gata — o gheață care se sparge și pe urmă se adună la loc pe
   jos ar cere să te uiți la ea, iar tu tocmai te-ai eliberat. */
function facCioburi(cx, cy, cate) {
  for (let k = 0; k < cate; k++) {
    const a = (k / cate) * Math.PI * 2 + Math.random() * 0.4;
    const v = Math.min(W, H) * (0.006 + Math.random() * 0.016);
    s7.cioburi.push({
      x: cx, y: cy,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v - Math.min(W, H) * 0.002,
      r: Math.min(W, H) * (0.008 + Math.random() * 0.022),
      rot: Math.random() * Math.PI, vrot: (Math.random() - 0.5) * 0.3,
      viata: 1
    });
  }
}

function deseneazaCioburile() {
  ctx.save();
  for (const c of s7.cioburi) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.globalAlpha = Math.max(0, c.viata) * 0.9;
    ctx.fillStyle = '#cfe9ff';
    ctx.beginPath();
    ctx.moveTo(0, -c.r);
    ctx.lineTo(c.r * 0.7, c.r * 0.2);
    ctx.lineTo(-c.r * 0.3, c.r);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = ALB_GHEATA;
    ctx.globalAlpha = Math.max(0, c.viata) * 0.6;
    ctx.lineWidth = Math.max(0.8, c.r * 0.14);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

/* ---------- RAMA DE GHEAȚĂ ȘI PORTALUL ---------- */
/* Lucrarea centrală e chiar vârtejul, iar rama ei e o placă de gheață. Se crapă
   pe măsură ce se aprind funcțiile, și la sfârșit se sparge de tot: atunci
   costumul se desface într-un tunel de linii, adică într-un drum. */
function deseneazaRamaDeGheata(acum) {
  const g = geomSala7();
  const r = g.S * 0.34;
  ctx.save();
  ctx.strokeStyle = ALB_GHEATA;
  ctx.globalAlpha = 0.35 - s7.crapatura * 0.3;
  ctx.lineWidth = Math.max(2, g.S * 0.012);
  ctx.beginPath();
  ctx.moveTo(g.vx - r, g.vy - r * 0.8);
  ctx.lineTo(g.vx + r, g.vy - r * 0.8);
  ctx.lineTo(g.vx + r * 0.86, g.vy + r * 0.8);
  ctx.lineTo(g.vx - r * 0.86, g.vy + r * 0.8);
  ctx.closePath();
  ctx.stroke();

  // crăpăturile: frânturi drepte care pleacă din colțuri spre mijloc
  const cate = Math.round(s7.crapatura * 12);
  for (let k = 0; k < cate; k++) {
    const a = samanta(8600 + k * 5.1), b = samanta(8660 + k * 3.7);
    ctx.strokeStyle = ALB_GHEATA;
    ctx.globalAlpha = 0.25 + b * 0.5;
    ctx.lineWidth = Math.max(1, g.S * 0.003);
    let px = g.vx + (a - 0.5) * r * 1.9, py = g.vy + (b - 0.5) * r * 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    for (let j = 0; j < 3; j++) {
      px += (samanta(8720 + k * 9 + j * 3.1) - 0.5) * r * 0.5;
      py += (samanta(8780 + k * 7 + j * 2.3) - 0.5) * r * 0.4;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function deseneazaPortalul(acum) {
  const g = geomSala7();
  const px = g.portalX, py = g.portalY;
  const inele = 16;
  ctx.save();
  for (let k = 0; k < inele; k++) {
    /* Inelele vin spre tine: fiecare pornește din mijloc și crește, iar când
       ajunge la marginea ecranului o ia altul de la capăt. Din asta iese
       senzația de tunel — nu din desenul unui tunel. */
    const t = ((k / inele) + (acum * (0.00016 + s7.zbor * 0.0016)) % 1) % 1;
    const raza = g.S * 0.04 + Math.pow(t, 2.2) * Math.max(W, H) * 1.1;
    const laturi = 6;
    ctx.strokeStyle = k % 3 === 0 ? ULTRAVIOLET : CYAN_NEON;
    ctx.globalAlpha = (1 - t) * 0.7 * (0.3 + s7.crapatura * 0.7);
    ctx.lineWidth = Math.max(1, g.S * 0.006 * (1 - t * 0.6));
    ctx.beginPath();
    for (let j = 0; j <= laturi; j++) {
      const a = (j / laturi) * Math.PI * 2 + t * 1.4;
      const x = px + Math.cos(a) * raza, y = py + Math.sin(a) * raza * 0.86;
      if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // razele care fug pe lângă tine
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2;
    ctx.strokeStyle = ARGINT_RECE;
    ctx.globalAlpha = 0.1 + s7.zbor * 0.4;
    ctx.lineWidth = Math.max(0.8, g.S * 0.003);
    ctx.beginPath();
    ctx.moveTo(px + Math.cos(a) * g.S * 0.06, py + Math.sin(a) * g.S * 0.05);
    ctx.lineTo(px + Math.cos(a) * Math.max(W, H), py + Math.sin(a) * Math.max(W, H) * 0.86);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- VORBELE SĂLII ---------- */
/* Un singur rând, la locul lui, care ține câteva secunde și pe urmă pleacă. În
   sala asta nu există bilețele căzute din tavan ca la custode: aici totul e
   tăiat drept, deci și vorba stă într-o bandă tăiată. */
function spuneScena7(text, cat) {
  s7.vorba = { text, pana: performance.now() + (cat || 4200) };
}

function deseneazaVorba(acum) {
  if (!s7.vorba || acum > s7.vorba.pana) return;
  const g = geomSala7();
  const stinge = Math.min(1, (s7.vorba.pana - acum) / 600);
  const lat = Math.min(W * 0.54, ecran(560));
  const y = H * 0.09;

  ctx.save();
  ctx.globalAlpha = stinge;
  ctx.fillStyle = 'rgba(12, 18, 44, 0.85)';
  ctx.beginPath();
  ctx.moveTo(W * 0.5 - lat / 2, y - H * 0.032);
  ctx.lineTo(W * 0.5 + lat / 2, y - H * 0.038);
  ctx.lineTo(W * 0.5 + lat / 2 - H * 0.012, y + H * 0.052);
  ctx.lineTo(W * 0.5 - lat / 2 + H * 0.012, y + H * 0.058);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = CYAN_NEON;
  ctx.globalAlpha = stinge * 0.6;
  ctx.lineWidth = Math.max(1, g.S * 0.002);
  ctx.stroke();
  ctx.globalAlpha = stinge;
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = stinge;
  textIncadrat(s7.vorba.text, W * 0.5, y - H * 0.014, lat - ecran(60), ecran(26),
               `bold ${Math.max(Math.round(ecran(13)), Math.round(g.S * 0.024))}px Georgia`,
               ALB_GHEATA);
  ctx.restore();
}

/* ---------- INTRAREA ---------- */
function intraInGheata(acum) {
  stare = 'gheata';
  s7.faza = 'intrare'; s7.t0 = acum; s7.ultimulCadru = acum;
  s7.promoroaca = 1; s7.energie = 0;
  s7.protectie = false; s7.utilitate = false; s7.estetica = false;
  s7.fularDesfacut = 0; s7.filtru = -1; s7.reflexii = 0;
  s7.nodLegat = 0; s7.gresit = 0;
  s7.inghetat = false; s7.caldura = 0; s7.ultimulSens = 0; s7.ultimaScuturare = acum;
  s7.tremur = 0; s7.cioburi.length = 0;
  s7.degetX = cursor.x; s7.degetY = cursor.y;
  s7.crapatura = 0; s7.atras = 0; s7.zbor = 0;
  s7.vorba = null; s7.functiaAratata = -1; s7.cereScuturare = false;
  s7.puzzleTreaz = false; s7.bariera = 0;
  pregatesteSalaGheata();
  opresteFocul();
  opresteTurbina();
  pornesteViscolul();
  if (audio) sunetPortal();
  spuneScena7('Pune-ți fularul virtual!', 6000);
}

function iesiDinGheata(acum) {
  /* Vârtejul duce în sala a opta. Drumul era croit cu un singur rând de
     schimbat, cum scria — și s-a schimbat.

     Și trecerea are un rost, ca și cea de dinainte: ieși dintr-o sală în care
     nimic nu se poate atinge fără să înghețe și intri într-una în care ți se
     spune că muzeul e pânza ta. Sala a șaptea îți ia libertatea ca s-o simți;
     a opta ți-o dă înapoi cu vârf și îndesat. */
  opresteViscolul();
  opresteTurbina();
  intraInUlei(acum);
}

/* ---------- CE SE ÎNTÂMPLĂ LA ATINGERE ---------- */
function click7(acum) {
  const g = geomSala7();
  const x = s7.degetX, y = s7.degetY;
  if (s7.faza === 'zbor') return;

  // în portal: sari
  if (s7.faza === 'portal') {
    if (Math.hypot(x - g.portalX, (y - g.portalY) * 1.15) < g.S * 0.42) {
      s7.faza = 'zbor'; s7.t0 = acum;
      if (audio) { sunetGheataCrapata(); pornesteTurbina(); }
      return;
    }
  }

  /* Cât ești înghețat, atingerea nu face nimic. Nu e o scăpare: e chiar
     lecția. Din îngheț nu ieși apăsând mai tare, ieși frecând. */
  if (s7.inghetat) return;

  /* Costumul: fiecare parte își spune funcția în panoul din dreapta. Fularul o
     și **pornește** pe a lui, fiindcă e singura care se face dintr-o atingere;
     celelalte două se citesc aici și se pornesc altundeva — la vortexuri și la
     pupitrul cu filtre. */
  const parte = parteaCostumului(x, y);
  if (parte >= 0) {
    s7.functiaAratata = parte;
    if (parte === 0 && !s7.protectie) {
      s7.protectie = true;
      s7.energie = numaraFunctiile() / 3;
      if (audio) sunetMetalic(1320);
      spuneScena7('Fularul s-a desfăcut. Promoroaca pleacă de pe ecran.', 4600);
    } else if (audio) {
      sunetMetalic(660 + parte * 220);
    }
    return;
  }

  // nodurile: se leagă numai după ce roata a dat drumul la căldură
  if (!s7.utilitate && s7.puzzleTreaz) {
    for (let k = 0; k < NODURI_PUZZLE; k++) {
      const n = nodulPuzzle(k);
      if (Math.hypot(x - n.x, y - n.y) > n.r * 1.9) continue;
      if (k === s7.nodLegat) {
        s7.nodLegat++;
        if (audio) sunetMetalic(880 + k * 180);
        if (s7.nodLegat >= NODURI_PUZZLE) {
          s7.utilitate = true;
          s7.energie = numaraFunctiile() / 3;
          s7.functiaAratata = 1;
          if (audio) sunetMetalic(1760);
          spuneScena7('Vortexurile s-au legat. Degetul se mișcă iar liber.', 4600);
        }
      } else {
        /* Nodul greșit nu pedepsește: zguduie o clipă și lasă lanțul întreg.
           Un puzzle care se strică de la prima greșeală nu se mai încearcă. */
        s7.gresit = 1;
        s7.tremur = Math.max(s7.tremur, 0.4);
        if (audio) sunetInghet();
      }
      return;
    }
  }

  /* Cele trei forme de sub costum. Fiecare scrie definiția funcției ei în caseta
     din dreapta — și face altceva pe costum. */
  for (let k = 0; k < FORME_FUNCTIILOR.length; k++) {
    if (Math.hypot(x - g.formaX(k), y - g.formaY) > g.formaR * 1.7) continue;
    s7.functiaAratata = k;

    if (k === 0) {
      if (!s7.protectie) {
        s7.protectie = true;
        spuneScena7('Scutul: fularul se desface în cameră, promoroaca pleacă.', 4800);
      }
      if (audio) sunetMetalic(1320);
    } else if (k === 1) {
      /* Roata nu leagă ea liniile — le **trezește**. Costumul dă drumul la
         căldură, iar vârtejul, până atunci înțepenit, începe să ceară să fie
         refăcut. Fapta rămâne a ta; a mașinii e numai să facă fapta cu
         putință. */
      if (!s7.utilitate && !s7.puzzleTreaz) {
        s7.puzzleTreaz = true;
        spuneScena7('Roata: micro-căldura a pornit. Leagă acum liniile de forță.', 5200);
      }
      if (audio) sunetMetalic(880);
    } else {
      s7.filtru = (s7.filtru + 1) % FILTRE_DE_STIL.length;
      if (!s7.estetica) {
        s7.estetica = true;
        spuneScena7('Prisma: muchiile taie lumina în modele pe pereți.', 4800);
      }
      if (audio) sunetMetalic(1046 + s7.filtru * 240);
    }
    s7.energie = numaraFunctiile() / 3;
    return;
  }

  /* Lucrarea centrală, atinsă cu mâna goală. Aici e toată lecția scenei: fără
     costum, frigul te ia. */
  if (Math.hypot(x - g.vx, (y - g.vy) * 1.2) < g.S * 0.42) {
    if (!s7.protectie) {
      s7.inghetat = true;
      s7.caldura = 0;
      s7.tremur = Math.max(s7.tremur, 0.5);
      if (audio) sunetInghet();
      spuneScena7('Ai atins gheața cu mâna goală. Freacă-te ca să te dezmorțești!', 5200);
    } else if (!s7.utilitate || !s7.estetica) {
      spuneScena7('Costumul te apără, dar încă nu te ajută. Mai are două funcții.', 4200);
    }
  }
}

function numaraFunctiile() {
  return (s7.protectie ? 1 : 0) + (s7.utilitate ? 1 : 0) + (s7.estetica ? 1 : 0);
}

/* ---------- CEASUL SCENEI ---------- */
function actualizeazaGheata(acum) {
  const dt = Math.max(0, Math.min(100, acum - (s7.ultimulCadru || acum)));
  s7.ultimulCadru = acum;
  tinePasiiPeZapada();

  /* Degetul sălii: aleargă după cursorul adevărat, dar cu cât e mai frig, cu
     atât mai încet. Nu atingem `cursor` — el e al întregii jucării, iar o scenă
     n-are voie să strice unealta celorlalte. */
  const mob = mobilitateaDegetului();
  const g0 = geomSala7();
  /* Cât nu s-a mișcat încă nicio mână, cursorul jocului stă la -9999. Degetul
     sălii n-are ce căuta acolo: ar zbura din ecran în primul cadru. */
  let tintaX = cursor.x > -100 ? cursor.x : (s7.degetX > -100 ? s7.degetX : W * 0.5);
  let tintaY = cursor.x > -100 ? cursor.y : (s7.degetY > -100 ? s7.degetY : H * 0.5);

  /* În portal, vârtejul trage. Nu de deget — de **ținta** lui: locul spre care
     se duce nu mai e mâna ta, ci undeva între mână și mijlocul vârtejului.

     Trasă direct de deget, atracția nu se simțea deloc: degetul aleargă după
     mână cu mult mai multă putere decât putea să tragă vârtejul, iar dacă i-am
     fi dat vârtejului putere cât mâinii, mâna n-ar mai fi însemnat nimic. Așa,
     amândouă se aud: te duci unde vrei, dar ești tras. */
  if (s7.faza === 'portal') {
    const k = 0.45 * s7.atras;
    tintaX = intre(tintaX, g0.portalX, k);
    tintaY = intre(tintaY, g0.portalY, k);
  }

  if (s7.degetX < -100) { s7.degetX = tintaX; s7.degetY = tintaY; }
  s7.degetX += (tintaX - s7.degetX) * Math.min(1, mob * (dt / 16) * 0.35);
  s7.degetY += (tintaY - s7.degetY) * Math.min(1, mob * (dt / 16) * 0.35);

  s7.gresit = Math.max(0, s7.gresit - dt / 500);
  s7.tremur = Math.max(0, s7.tremur - dt / 400);
  s7.energie = numaraFunctiile() / 3;

  /* Bariera. Fișa funcției spune că **se extinde o barieră geometrică ce curăță
     promoroaca de pe ecran** — deci trebuie să se vadă cum o curăță, nu doar să
     dispară bruma singură. Bariera pleacă din fular și mătură ecranul; în urma
     ei nu mai e brumă, fiindcă bruma se desenează numai **în afara** ei.

     E felul cel mai scurt de a arăta la ce e bun un costum: o linie care trece
     prin cameră, și dincoace de ea nu mai e frig. */
  if (s7.protectie) {
    s7.fularDesfacut = Math.min(1, s7.fularDesfacut + dt / 900);
    s7.bariera = Math.min(1, s7.bariera + dt / 1300);
    if (s7.bariera >= 1) s7.promoroaca = 0;
  }
  if (s7.estetica) s7.reflexii = Math.min(1, s7.reflexii + dt / 1200);

  // rama de gheață se crapă odată cu funcțiile aprinse
  s7.crapatura = intre(s7.crapatura, numaraFunctiile() / 3, Math.min(1, dt / 600));

  // cioburile zboară spre margini și ies din ecran
  for (let k = s7.cioburi.length - 1; k >= 0; k--) {
    const c = s7.cioburi[k];
    c.x += c.vx * (dt / 16); c.y += c.vy * (dt / 16);
    c.vy += Math.min(W, H) * 0.00012 * (dt / 16);
    c.rot += c.vrot * (dt / 16);
    c.viata -= dt / 1400;
    if (c.viata <= 0 || c.x < -W * 0.2 || c.x > W * 1.2 || c.y > H * 1.2) {
      s7.cioburi.splice(k, 1);
    }
  }

  if (s7.faza === 'intrare' && acum - s7.t0 > 1200) { s7.faza = 'sala'; s7.t0 = acum; }

  // frecarea: fiecare schimbare de sens a mâinii încălzește
  if (s7.inghetat) {
    /* Se judecă **întâi** dacă s-a umplut și abia pe urmă se scade. Invers —
       cum era la început — căldura scădea sub unu chiar în cadrul în care
       ajunsese la unu, și pragul nu se atingea niciodată: frecai la nesfârșit cu
       bara plină. */
    if (s7.caldura >= 1) {
      s7.inghetat = false;
      s7.caldura = 0;
      s7.tremur = 1;
      facCioburi(s7.degetX, s7.degetY, 22);
      if (audio) sunetGheataCrapata();
      spuneScena7('Te-ai dezmorțit. Costumul ăsta are trei funcții — pornește-le.', 5000);
    } else {
      s7.caldura = Math.max(0, s7.caldura - dt / 5200);   // frigul îți ia înapoi
    }
  }

  /* Toate trei aprinse — dar rama nu se sparge singură. Mai trebuie o
     scuturare, și ea nu e o formalitate: e chiar figura de la începutul scenei,
     cerută a doua oară.

     Prima dată ai frecat ca să scapi din îngheț — un gest de nevoie, ca să nu
     rămâi blocat. Acum freci ca să spargi gheața de pe lucrare — același gest,
     dar de data asta ai costumul pornit și îl faci ca să treci mai departe. Din
     aceeași mișcare iese întâi frica, pe urmă puterea; asta n-ar spune-o
     niciun text de pe perete. */
  if (s7.faza === 'sala' && numaraFunctiile() === 3 && s7.crapatura > 0.9 &&
      !s7.cereScuturare && !s7.inghetat) {
    s7.cereScuturare = true;
    s7.caldura = 0;
    spuneScena7('Costumul e pornit. Acum scutură: sparge gheața de pe lucrare!', 8000);
  }
  if (s7.cereScuturare && s7.caldura >= 1) {
    s7.cereScuturare = false;
    s7.caldura = 0;
    s7.faza = 'portal'; s7.t0 = acum;
    s7.tremur = 1;
    facCioburi(geomSala7().vx, geomSala7().vy, 34);
    facCioburi(geomSala7().portalX, geomSala7().portalY, 20);
    if (audio) { sunetGheataCrapata(); opresteViscolul(); pornesteTurbina(); }
    spuneScena7('Sari în vârtej!', 9000);
  }

  if (s7.faza === 'portal') {
    /* Cursorul e tras spre mijloc. Nu i se ia mâna din mână — se trage numai
       puțin, cât să se simtă că vârtejul are putere, dar să poți încă alege. */
    s7.atras = Math.min(1, s7.atras + dt / 2200);
  }

  if (s7.faza === 'zbor') {
    s7.zbor = Math.min(1, s7.zbor + dt / 2200);
    if (s7.zbor >= 1) iesiDinGheata(acum);
  }
}

/* Frecarea, măsurată pe mâna adevărată, nu pe cea întârziată: cine scutură
   mouse-ul scutură repede, iar degetul sălii n-ar apuca niciodată să-l urmeze.
   Se cheamă din ascultătorul de mișcare. */
function frecareaScenei7(dx) {
  if (stare !== 'gheata') return;
  if (!s7.inghetat && !s7.cereScuturare) return;
  const sens = dx > 0 ? 1 : -1;
  const acum = performance.now();
  if (Math.abs(dx) < 2) return;
  if (sens !== s7.ultimulSens) {
    // o schimbare de sens: atât se cheamă o frecare
    const rapid = acum - s7.ultimaScuturare < 400 ? 1 : 0.4;
    s7.caldura = Math.min(1, s7.caldura + 0.055 * rapid);
    s7.ultimaScuturare = acum;
    s7.ultimulSens = sens;
    if (audio && Math.random() < 0.3) nota(220 + s7.caldura * 900, audio.currentTime,
                                          0.05, 0.03, 'triangle', 1800);
  }
}

/* ---------- DESENUL ---------- */
function deseneazaScena7(t, acum) {
  const g = geomSala7();

  ctx.save();
  // tremurul ecranului, la spart și la greșeală
  if (s7.tremur > 0.01) {
    ctx.translate((Math.random() - 0.5) * g.S * 0.03 * s7.tremur,
                  (Math.random() - 0.5) * g.S * 0.03 * s7.tremur);
  }

  ctx.drawImage(pregatesteSalaGheata(), 0, 0);

  if (s7.faza === 'portal' || s7.faza === 'zbor') {
    /* Vârtejul de pe perete rămâne — el s-a crăpat, atât. Ce s-a schimbat e
       costumul, care s-a făcut drum. Ștergându-l pe primul odată cu al doilea,
       s-ar fi pierdut tocmai comparația: lucrarea a rămas lucrare, haina a
       devenit ieșire. */
    deseneazaVartejul(acum);
    deseneazaRamaDeGheata(acum);
    deseneazaPortalul(acum);
  } else {
    deseneazaVartejul(acum);
    deseneazaRamaDeGheata(acum);
    deseneazaPuzzleul(acum);
  }

  if (s7.faza !== 'zbor') {
    deseneazaReflexiile(acum);
    /* În portal, costumul nu se stinge: se **desface**. Fiecare bucată pleacă din
       locul ei și se întoarce, iar prin golul de la mijloc se vede tunelul. Un
       manechin rămas solid în gura unei uși ar fi arătat a obstacol; unul topit
       de tot ar fi lăsat ușa fără pricină. Descompus și recompus, se vede că
       drumul iese chiar din el. */
    ctx.save();
    if (s7.faza === 'portal') ctx.globalAlpha = Math.max(0.45, 1 - s7.atras * 0.4);
    deseneazaCostumul(acum);
    deseneazaFularul(acum);
    ctx.restore();
    if (s7.faza !== 'portal') {
      deseneazaFormeleFunctiilor(acum);
      deseneazaPanoulFunctiei(acum);
      /* Fără etichetă sub costum. O pusesem ca să se știe din prima ce e obiectul,
         dar între timp costumul a căpătat mâneci, nasturi, revere, curea de
         cristale și mânecile lui răzlețe — se recunoaște singur. Un nume scris
         sub un lucru care se vede ce e nu lămurește, doar spune că autorul
         n-avea încredere în desen. */
    }
  }

  deseneazaCioburile();
  ctx.restore();

  /* Zborul: tunelul se năpustește peste tot ecranul și albește. Ce urmează nu
     mai e sala asta, deci n-are rost s-o mai vedem. */
  if (s7.faza === 'zbor') {
    ctx.save();
    ctx.fillStyle = `rgba(232, 244, 255, ${Math.pow(s7.zbor, 2.4)})`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  deseneazaBariera(acum);
  deseneazaPromoroaca(acum);
  deseneazaTermometrul(acum);
  deseneazaVorba(acum);

  /* Scrisul de jos: ce mai e de făcut, într-un rând. Se schimbă odată cu ce ai
     pornit, ca să nu-ți ceară niciodată ceva ce ai făcut deja. */
  if (s7.faza === 'sala' && !s7.inghetat && !s7.cereScuturare) {
    const cate = numaraFunctiile();
    let indemn = null;
    if (!s7.protectie) indemn = 'Sub costum sunt trei forme. Apasă-le: fiecare pornește altă funcție.';
    else if (!s7.utilitate) indemn = s7.puzzleTreaz
      ? 'Leagă liniile de forță, în ordine, de la vârtej în afară.'
      : 'Apasă roata dințată: a doua funcție a costumului.';
    else if (!s7.estetica) indemn = 'Apasă prisma: a treia funcție a costumului.';
    if (indemn) {
      textIncadrat(indemn, W * 0.5, H * 0.945, Math.min(W * 0.7, ecran(700)), ecran(26),
                   `bold ${Math.max(Math.round(ecran(13)), Math.round(g.S * 0.023))}px Georgia`,
                   cate === 0 ? ALB_GHEATA : CYAN_NEON);
    }
  }
  if (s7.faza === 'portal') {
    textIncadrat('Sari în vârtej!', g.portalX, g.portalY + g.S * 0.34,
                 Math.min(W * 0.4, ecran(400)), ecran(30),
                 `bold ${Math.max(Math.round(ecran(15)), Math.round(g.S * 0.032))}px Georgia`,
                 ALB_GHEATA);
  }
}
