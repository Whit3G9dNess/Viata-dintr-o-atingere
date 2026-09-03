/* ============================================================================
   SCENA A OPTA — SALA DE ULEI

   Tema: amprenta fizică. O lucrare în ulei nu e o imagine, e **materie** — o
   pastă care stă pe pânză, care se usucă zile întregi, care se ia pe deget dacă
   o atingi.

   Sala e desenată **în linie și necolorată**: o galerie clasică, cu vitrine,
   pilaștri, o firidă în fund și, pe un podium cu funii de catifea, o pelerină
   regală. Totul e contur, ca într-o planșă rămasă neterminată.

   Asta e toată ideea, și e alta decât în celelalte săli. Până aici te-ai uitat
   la lucrări gata făcute. Aici lucrarea **nu există încă** — există un desen, o
   trusă de ustensile și un cerc cromatic. Jucătorul alege cu ce și cu ce
   culoare, și pune pasta el. Un muzeu în care se pune mâna e o glumă; un muzeu
   în care exponatul e neterminat și tu ești cel care-l termină e altceva.

   Când pelerina e acoperită de tot, sub podium se deschide o trapă și culoarea
   se scurge în ea. Pe acolo se coboară în sala a noua, a acuarelei: uleiul
   diluat devine apă.
   ========================================================================== */

/* ---------- CULORILE ---------- */
/* Cercul cromatic, cu douăsprezece raze: cele trei primare, cele trei binare
   dintre ele, și cele șase terțiare. E cercul care se învață la școală și cel
   care se vede în orice atelier — nu un șir de culori alese după gust.

   Ordinea contează: fiecare culoare stă între cele două din care se face. Cine
   se uită la el învață asta fără să-i spună nimeni. */
const CERC_CROMATIC = [
  '#f2e11c',   // galben
  '#f0b31b',   // galben-portocaliu
  '#eb7a1c',   // portocaliu
  '#e0491e',   // roșu-portocaliu
  '#d8202a',   // roșu
  '#a51d5c',   // roșu-violet
  '#6c2a8e',   // violet
  '#3a3a96',   // albastru-violet
  '#1a5fa8',   // albastru
  '#128a7d',   // albastru-verde
  '#1a9a3c',   // verde
  '#8dbd21'    // galben-verde
];

const LINIE_SALA    = '#3a332a';   // creionul cu care se conturează lucrurile
const LINIE_SUBTIRE = '#7a7062';
const HARTIE        = '#f6f2e8';

/* ---------- CULORILE SĂLII ----------

   Sala e **colorată**, și numai pelerina rămâne albă. Așa a devenit, și e mult
   mai bine: cât timp toată sala era o schiță nepictată, nu se înțelegea ce
   anume ai de colorat — puteai la fel de bine să mânjești peretele. Cu sala
   pictată și pelerina lăsată în alb, întrebarea nu se mai pune: singurul lucru
   neterminat din cameră strigă la tine de la ușă.

   Culorile sălii sunt calme dinadins — piatră caldă, lemn, alamă. Un muzeu cu
   pereți țipători ar intra în concurență cu ce ai tu de pus pe pelerină, iar
   concursul ăsta nu-l poate câștiga jucătorul. */
const PIATRA_PERETE  = '#dcd4c2';
const PIATRA_UMBRA   = '#c2b8a2';
const PIATRA_LUMINA  = '#ece5d6';
const PANOU_PERETE   = '#d3cab4';
const FIRIDA_FUND    = '#a89c85';   // adâncul firidei, mai închis, ca albul să sară
const PODEA_DALA     = '#cfc6b4';
const PODEA_ROST     = '#b3a893';
const TAVAN_STICLA   = '#e6eef2';   // lumina rece care intră prin luminator
const TAVAN_GRINDA   = '#cfc6b6';
const PIATRA_SOCLU   = '#8e8371';
const ALAMA_SALA     = '#c9a24a';

/* Fișa de sală. În celelalte galerii scria ce e curentul; aici scrie ce e
   **materia**, fiindcă sala asta nu e despre un curent, e despre pastă. Și
   pregătește sala următoare: un pigment pe bază de apă e o acuarelă, iar prin
   trapa de sub podium tocmai într-acolo se coboară. */
const TEXT_FISA_PIGMENTI =
  'Culorile pigmentare sunt formate din materie (pigmenți organici sau minerali ' +
  'prelucrați și amestecați cu un liant), având o prezență fizică ' +
  'tangibilă. În schimb, culorile spectrale (lumina) sunt unde electromagnetice ' +
  'percepute de ochi.\n' +
  'Pigmenții au nevoie de un liant pentru a fi aplicați. În funcție de acesta, ' +
  'culorile se împart în culori pe bază de apă (acuarelă, tempera, guașă, acrilic) ' +
  'sau pe bază de ulei.\n' +
  'Vopseaua poate fi aplicată pe suport (pânză, hârtie, lemn etc.) cu pensula, cu ' +
  'cuțitul de paletă, prin tamponare, prin stropire sau prin presare.';

/* ---------- USTENSILELE ---------- */
/* Șase, și fiecare lasă altceva. Nu sunt șase butoane cu aceeași urmă în altă
   culoare: o pensulă rotundă trage o dungă subțire, o bidinea lasă o bandă cu
   urme de păr, cuțitul de paletă întinde o lopată cu muchii drepte. Alegerea
   uneltei trebuie să se vadă pe perete, altfel n-are rost s-o faci.

   `lung` și `gros` sunt măsurate în unitatea de tușă; `fire` spune câte dâre de
   păr lasă; `cutit` dacă e lopată de pastă. */
/* Trei feluri de unealtă, câte două din fiecare — și fiecare fel lasă **altă
   formă de pată**, nu aceeași pată în altă mărime.

   Asta a fost greșeala dintâi: toate șase foloseau un singur contur de tușă și
   se deosebeau numai prin lungime și grosime. Alegeai cuțitul de paletă și
   primeai tot o dâră de pensulă, ceva mai lată. Dar o unealtă se cunoaște după
   **capătul** ei: pensula ascuțită lasă o pată care se subțiază în vârf, cea
   pătrată lasă o pată cu capetele tăiate drept, iar cuțitul lasă o lopată de
   pastă cu muchii și cu mult material. Dacă alegerea nu se vede pe perete,
   n-are rost s-o pui în trusă.

   `pasta` spune cât material lasă: pensula ascuțită trage puțin, cuțitul
   îngroașă. `relief` spune cât de tare se vede creasta stratului. */
/* Cinci, și atât: **subțire ascuțită, groasă ascuțită, subțire pătrată, groasă
   pătrată, cuțit de paletă**. Erau șase, cu două cuțite — dar al doilea cuțit nu
   aducea nimic: două lopeți de pastă se deosebesc numai prin lățime, iar lățimea
   o dă oricum mărimea tușei. O trusă în care două unelte fac același lucru te
   pune să alegi degeaba.

   Perechile ascuțit/pătrat, în schimb, se justifică singure: subțirea trage o
   linie, groasa acoperă o suprafață. Aceeași formă de pată, altă cantitate. */
const USTENSILE = [
  { nume: 'pensulă subțire cu vârf ascuțit', forma: 'ascutit', lung: 1.8, gros: 0.22,
    fire: 1, pasta: 1, relief: 0.5,  cutit: false },
  { nume: 'pensulă groasă cu vârf ascuțit',  forma: 'ascutit', lung: 2.0, gros: 0.62,
    fire: 3, pasta: 1, relief: 0.75, cutit: false },
  { nume: 'pensulă subțire cu vârf pătrat',  forma: 'patrat',  lung: 1.20, gros: 0.36,
    fire: 3, pasta: 1, relief: 0.8,  cutit: false },
  { nume: 'pensulă groasă cu vârf pătrat',   forma: 'patrat',  lung: 1.05, gros: 1.10,
    fire: 7, pasta: 1, relief: 0.95, cutit: false },
  { nume: 'cuțit de paletă',                 forma: 'cutit',   lung: 1.4, gros: 1.0,
    fire: 0, pasta: 4, relief: 1.7,  cutit: true }
];

const OCHIURI_PELERINA = 26;      // cât de fin se socotește acoperirea pelerinei

const s8 = {
  faza: 'intrare',      // intrare → pictezi → viata → trapa → scurgere → diluare → iesire
  viata: 0,             // cât a prins viață și a plecat manechinul
  trapa: 0,             // cât s-a deschis capacul rotund al podiumului
  t0: 0, ultimulCadru: 0,
  vapori: 1,            // aburii calzi de la intrare, cu textul mirosului
  unealta: 1,           // ce ustensilă e în mână
  culoare: 4,           // ce rază din cercul cromatic e aleasă
  celule: [],           // ochiurile pelerinei: null = în afara ei, false/true = acoperit
  acoperit: 0,          // cât din pelerină s-a acoperit, 0..1
  picaturi: [],
  tuseFacute: 0,
  scurgere: 0,          // cât s-a deschis trapa și s-a scurs culoarea
  perdea: null,
  diluare: 0,
  aSpusTrapa: false,
  vorba: null,
  ultimaTusa: 0
};

/* ---------- MĂSURILE SĂLII ---------- */
/* Cât e de lată firida din fundul sălii. Se ține într-un singur loc fiindcă din
   ea ies și arcada, și locul celor două coloane, și tăietura pentru pastă — trei
   lucruri care trebuie să spună aceeași măsură.

   E ceva mai îngustă decât ar cere ochiul: cu firida largă, coloana din dreapta
   ajungea sub fișa de sală și se pierdea cu totul. O intrare flancată de o
   singură coloană nu e flancată. */
function latimeaFiridei() { return Math.min(W * 0.235, H * 0.38); }

/* Unde stau cele două coloane care flanchează intrarea din fundul sălii.

   Era una singură, pusă alături de firidă, care începea de sub cornișă și se
   oprea în lambriu — adică o coloană care nu ține nimic și nu se sprijină pe
   nimic. O coloană e un lucru care **duce o greutate până în pământ**: are bază,
   fus și capitel, și merge de la podea până la ce sprijină. Două, de-o parte și
   de alta a intrării, spun și de ce sunt acolo: ele încadrează ușa. */
function coloaneleIntrarii() {
  const fw = latimeaFiridei();
  const lat = Math.min(W * 0.042, fw * 0.20);
  return {
    lat,
    stanga: W * 0.5 - fw / 2 - lat * 0.85,
    dreapta: W * 0.5 + fw / 2 + lat * 0.85
  };
}

/* ---------- REGISTRUL DIN STÂNGA ----------

   Îndemnul, cercul cromatic și uneltele stăteau împrăștiate peste sală, fiecare
   la un loc socotit separat — și se călcau: cercul peste scris, uneltele peste
   cerc. Când trei lucruri își aleg locul fiecare pe cont propriu, mai devreme sau
   mai târziu se ciocnesc.

   Acum au **un registru al lor**: o coloană care le ține pe toate trei, una sub
   alta, cu spații socotite din înălțimea ei. Nimic nu se mai poate suprapune,
   fiindcă nimic nu-și mai alege locul singur.

   Și e limpede că **nu face parte din sală**: un panou de sticlă fumurie, cu
   colțuri rotunjite, care plutește peste expoziție. Uneltele nu sunt exponate, ci
   ce ai tu în mână — iar lucrurile din mâna ta stau într-un strat deasupra
   lumii, nu în ea. */
function geomRegistru() {
  const S = Math.min(W, H);
  const lat = Math.min(W * 0.235, H * 0.44);
  const x = W * 0.022, y = H * 0.045;
  const inalt = H * 0.90;
  const margine = lat * 0.075;

  const textInalt = Math.min(H * 0.115, lat * 0.42);
  const cercR = Math.min((lat - margine * 2) * 0.44, H * 0.135);
  const unelteInalt = Math.min(H * 0.20, S * 0.30);

  const textY = y + margine;
  const cercCy = textY + textInalt + margine * 1.2 + cercR;
  const unelteY = cercCy + cercR + margine * 1.4 + unelteInalt * 0.5;

  return {
    x, y, lat, inalt, margine,
    textX: x + margine, textY, textLat: lat - margine * 2, textInalt,
    cercCx: x + lat * 0.5, cercCy, cercR,
    unelteX: x + margine * 1.3, unelteY, unelteInalt,
    unelteLat: lat - margine * 2.6
  };
}

function geomSala8() {
  const S = Math.min(W, H);
  const podea = H * 0.62;                  // unde peretele din fund atinge podeaua
  const cornisa = H * 0.14;                // tavanul

  // podiumul rotund din mijloc, văzut în perspectivă
  const podiumCx = W * 0.5, podiumCy = H * 0.855;
  const podiumRx = Math.min(W * 0.215, H * 0.31), podiumRy = podiumRx * 0.27;

  /* Pelerina, întinsă pe podium: gulerul sus, trena revărsată în față. E singura
     suprafață care se socotește la acoperire — restul sălii poate fi mânjit cât
     poftești, dar ea deschide trapa.

     Măsurile ei sunt cele ale unei mantii puse pe un manechin, nu ale unui cort:
     gulerul e îngust, corpul cade drept, și numai **trena** se lățește pe podium.
     La prima încercare o făcusem cât podiumul de lată de sus până jos — ieșea o
     cupolă care înghițea firida, vitrinele și tot restul sălii. */
  /* Lățimea de referință a mantiei. Era aproape cât raza podiumului, iar cu
     trena adăugată pe deasupra ieșea un lucru mai lat decât înalt — adică un
     clopot, nu o haină. O mantie pusă pe manechin e **mai înaltă decât lată**,
     oricât s-ar revărsa poalele: asta e prima măsură după care ochiul o
     recunoaște, înaintea oricărei broderii. */
  /* Rochia e **piesa centrală**, și trebuie să se vadă din prima că e. Cu cât e
     mai mare, cu atât despărțiturile ei — corsaj, mâneci, jupă — sunt suprafețe
     pe care chiar ai loc să pictezi; iar o rochie care abia acoperă podiumul nu
     cere să fie pictată, cere să fie privită de aproape. */
  const pelLat = podiumRx * 0.94;
  /* Rochia începe mai jos decât înainte: deasupra ei trebuie să încapă **capul
     manechinului**. El e lucrul care spune, dintr-o privire, că veșmântul e
     îmbrăcat pe ceva — iar un știft de lemn, cât aveam, nu spune nimic. */
  const pelSus = H * 0.285;
  const pelJos = podiumCy + podiumRy * 0.05;

  const trusaLat = Math.min(W * 0.215, S * 0.42);
  const trusaInalt = H * 0.145;
  const cercR = Math.min(W * 0.095, S * 0.18);

  return {
    S, podea, cornisa,
    podiumCx, podiumCy, podiumRx, podiumRy,
    pelCx: podiumCx, pelSus, pelJos, pelLat,
    pelInalt: pelJos - pelSus,

    // trusa de ustensile, sus în stânga
    trusaX: W * 0.028, trusaY: H * 0.09, trusaLat, trusaInalt,

    // cercul cromatic, sub trusă
    /* Cercul și uneltele își iau locul din registru, nu de aici: acolo sunt
       socotite toate trei deodată, deci nu se pot călca. */
    cercCx: geomRegistru().cercCx,
    cercCy: geomRegistru().cercCy,
    cercR: geomRegistru().cercR,

    /* Fișa de sală, pe peretele din fund, sus în dreapta. Aici stă numai unde
       începe și cât e de lată; **înălțimea o dă textul**, măsurată la desen. O
       casetă de înălțime fixă te pune să alegi între a micșora litera până nu se
       mai citește și a lăsa textul să curgă afară din chenar. Caseta se face cât
       trebuie ca să cuprindă ce are de spus, și gata. */
    fisaX: W * 0.665, fisaY: H * 0.145,
    fisaLat: Math.min(W * 0.30, S * 0.56)
  };
}

/* ---------- STRATUL DE VOPSEA AL JUCĂTORULUI ----------
   Tot ce pune rămâne. Nu într-o listă redesenată la fiecare cadru — după o sută
   de tușe s-ar târî — ci pe o pânză ascunsă, peste care fiecare tușă nouă se
   pune o singură dată. Pânza aia se copiază la fiecare cadru dintr-o singură
   mișcare, oricâtă vopsea ar fi pe ea.

   E chiar felul în care lucrează un pictor: nu-și repictează tabloul de la zero
   de fiecare dată când adaugă o tușă. */
const stratulDePictura = { panza: null, latime: 0, inaltime: 0 };

function stratul() {
  if (!stratulDePictura.panza || stratulDePictura.latime !== W ||
      stratulDePictura.inaltime !== H) {
    /* La schimbarea pânzei, ce ai pictat se întinde pe măsura nouă. Pierdut, ar
       fi cea mai urâtă pedeapsă din toată jucăria: singurul loc unde ai făcut
       ceva cu mâna ta s-ar șterge fiindcă ai tras de colțul ferestrei. */
    const vechi = stratulDePictura.panza;
    const vl = stratulDePictura.latime, vi = stratulDePictura.inaltime;
    const p = document.createElement('canvas');
    p.width = W; p.height = H;
    if (vechi && vl && vi) p.getContext('2d').drawImage(vechi, 0, 0, vl, vi, 0, 0, W, H);
    stratulDePictura.panza = p;
    stratulDePictura.latime = W; stratulDePictura.inaltime = H;
  }
  return stratulDePictura.panza;
}

/* ---------- SALA, DESENATĂ ÎN LINIE ---------- */
const salaUlei = { panza: null, latime: 0, inaltime: 0 };

function pregatesteSalaUlei() {
  if (salaUlei.panza && salaUlei.latime === W && salaUlei.inaltime === H) {
    return salaUlei.panza;
  }
  const p = panzaDeLucru(salaUlei, W, H);
  const c = p.getContext('2d');
  c.clearRect(0, 0, W, H);
  pictezaSalaUlei(c);
  salaUlei.latime = W; salaUlei.inaltime = H;
  return p;
}

/* Creionul sălii. Toate liniile se trag cu el, ca desenul să pară făcut de o
   singură mână: aceeași culoare, aceeași apăsare. Grosimea se schimbă numai
   între ce e aproape și ce e departe. */
function creion(c, gros, culoare) {
  c.strokeStyle = culoare || LINIE_SALA;
  c.lineWidth = Math.max(0.7, gros);
  c.lineJoin = 'round';
  c.lineCap = 'round';
}

/* ---------- PASTA GROASĂ A SĂLII ----------

   Sala nu e vopsită cu suprafețe netede, ci **pictată în ulei, cu pastă groasă**:
   fiecare bucată de perete, de podea, de tavan e o îngrămădire de lespezi de
   vopsea puse cu cuțitul, una peste alta.

   Ce face pasta să fie pastă nu e culoarea, ci **muchia**: fiecare tușă are o
   creastă care prinde lumina pe latura de sus și o umbră pe cea de jos. Asta o
   ridică de pe pânză. O suprafață întinsă uniform, oricât de frumos colorată,
   rămâne o suprafață; o sută de lespezi cu creastă și umbră se ridică din pânză
   și cer să fie atinse.

   Iar rostul aici e limpede: sala e pictată în pastă, pelerina din mijloc e
   pânză goală. Ochiul vede cu ce s-a lucrat peste tot în cameră și înțelege, fără
   niciun cuvânt, ce are de făcut cu lucrul rămas alb. */

/* O lespede de pastă: corpul, creasta luminată de sus, umbra de jos, și câteva
   dâre subțiri lăsate de muchia cuțitului. */
function lespedeDePasta(c, x, y, lung, gros, unghi, culoare, zar) {
  const L = Math.max(1.2, lung / 2), G = Math.max(0.8, gros / 2);
  const z = function (i) { return samanta(zar * 7.3 + i * 3.1); };

  c.save();
  c.translate(x, y);
  c.rotate(unghi);

  /* Conturul: un patrulater cu capete tăiate strâmb, ca lama cuțitului când
     ridică vopseaua. Capetele drepte ar da niște cărămizi. */
  const traseu = function () {
    c.beginPath();
    c.moveTo(-L * (0.94 + z(0) * 0.14), -G * (0.72 + z(1) * 0.4));
    c.lineTo(L * (0.90 + z(2) * 0.2), -G * (0.94 + z(3) * 0.22));
    c.lineTo(L * (1.02 + z(4) * 0.1), G * (0.55 + z(5) * 0.45));
    c.lineTo(-L * (0.86 + z(6) * 0.22), G * (0.90 + z(7) * 0.26));
    c.closePath();
  };

  traseu();
  c.fillStyle = culoare;
  c.fill();

  c.save();
  traseu();
  c.clip();
  // creasta: același contur mutat în jos, trasat gros — rămâne numai muchia de sus
  c.save();
  c.translate(0, G * 0.62);
  traseu();
  c.restore();
  /* Creasta e blândă. Cu ea tare, fiecare tușă se desprindea de vecina ei și
     toată sala se făcea o grămadă de moloz colorat. Pe pasta adevărată, lumina
     de pe muchie e o dungă subțire, nu o jumătate albă. */
  c.strokeStyle = amesteca(culoare, '#ffffff', 0.30);
  c.lineWidth = G * 0.34;
  c.stroke();
  // umbra: același truc, mutat în sus
  c.save();
  c.translate(0, -G * 0.66);
  traseu();
  c.restore();
  c.strokeStyle = amesteca(culoare, '#241c12', 0.22);
  c.lineWidth = G * 0.28;
  c.stroke();

  /* Dârele lăsate de muchie, de-a lungul tușei. Ele sunt ce se vede pe pasta
     trasă cu cuțitul lat: linii paralele, foarte fine, care urmează mișcarea. */
  c.lineWidth = Math.max(0.5, G * 0.13);
  for (let k = -1; k <= 1; k++) {
    const d = k * G * 0.42 + (z(8 + k) - 0.5) * G * 0.2;
    c.strokeStyle = k < 0 ? amesteca(culoare, '#ffffff', 0.18)
                          : amesteca(culoare, '#241c12', 0.14);
    c.beginPath();
    c.moveTo(-L * 0.86, d);
    c.quadraticCurveTo(0, d + (z(11 + k) - 0.5) * G * 0.3, L * 0.9, d);
    c.stroke();
  }
  c.restore();
  c.restore();
}

/* Un câmp de lespezi peste o zonă: le împrăștie, le dă direcția zonei și le ia
   culoarea dintr-o paletă. Aceeași unealtă face și peretele, și podeaua, și
   tavanul — se schimbă doar direcția și culorile. */
function campDePasta(c, x, y, w, h, cate, unghi, imprastiere, lung, gros, paleta, start) {
  for (let k = 0; k < cate; k++) {
    const a = samanta(start + k * 3.1), b = samanta(start + k * 7.7);
    const u = samanta(start + k * 5.3);
    lespedeDePasta(c, x + a * w, y + b * h,
                   lung * (0.55 + u * 0.9), gros * (0.7 + a * 0.7),
                   unghi + (u - 0.5) * imprastiere,
                   paleta[Math.floor(b * paleta.length) % paleta.length],
                   start + k);
  }
}

/* ---------- SALA, ÎN CHEIE MODERNĂ ----------

   Sala a fost o vreme o pinacotecă clasică: cornișă, panouri de stuc, coloane
   corintice, aplice de alamă, și totul acoperit cu pastă groasă de ulei. Pasta
   n-a mers — de aproape se citea a moloz, iar arhitectura se îneca sub ea.

   Ce a rămas e altceva, și e mai bun pentru ce are scena de făcut: **un spațiu de
   expunere contemporan**. Fond de culoare plină, un disc mare în spatele
   exponatului, podea închisă cu oglindire, un con de lumină care cade de sus.
   Fără textură, fără ornament: forme mari și culoare curată.

   De ce e mai bun: costumul e alb și e singurul lucru nepictat din cameră. Ca
   să se vadă, are nevoie de **contrast, nu de companie**. O sală bogată în
   detalii îl concurează; o sală din două-trei pete mari de culoare îl împinge în
   față. Muzeele de costum fac exact asta, și nu din modă — din necesitate.

   Culorile fondului sunt reci și adânci: indigo, teal. Albul pus pe rece pare și
   mai alb, iar galbenul, roșul și portocaliul pe care le va aduce jucătorul vor
   sări cu atât mai tare cu cât fondul e mai depărtat de ele pe roata culorilor. */
const FOND_SUS      = '#1b2740';
const FOND_JOS      = '#20404f';
const DISC_CALD     = '#e0703c';
const DISC_INTERIOR = '#f2a154';
const PODEA_MODERN  = '#141b24';
const PODIUM_MODERN = '#e9e4d8';
const LUMINA_CON    = 'rgba(255, 244, 214, ';

function pictezaSalaUlei(c) {
  const g = geomSala8();
  const gr = Math.max(1, g.S * 0.0022);

  fondulSalii(c, g);
  disculDinSpate(c, g);
  conulDeLumina(c, g);
  podeaModerna(c, g);
  podiumulCuFunii(c, g, gr);
  pelerinaInLinie(c, g, gr);
  fisaDeSala8(c, g, gr);
}

/* Fondul: o singură pată mare, de la indigo la teal. Nu are nicio linie — un
   spațiu modern nu se desenează, se colorează. */
function fondulSalii(c, g) {
  const cer = c.createLinearGradient(0, 0, W * 0.25, H);
  cer.addColorStop(0, FOND_SUS);
  cer.addColorStop(0.55, '#1d3348');
  cer.addColorStop(1, FOND_JOS);
  c.fillStyle = cer;
  c.fillRect(0, 0, W, H);
}

/* Discul cald din spatele exponatului. E cel mai simplu lucru din sală și cel
   care lucrează cel mai mult: rotund pe fond drept, cald pe rece, mare cât
   trebuie ca să cuprindă rochia. Din el rochia albă iese ca dintr-o fereastră.

   Are un halou în jur, ca discurile pictate să nu pară decupate cu foarfeca. */
function disculDinSpate(c, g) {
  const cx = g.pelCx, cy = g.pelSus + g.pelInalt * 0.42;
  const r = Math.min(W * 0.30, H * 0.42);

  const halou = c.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.55);
  halou.addColorStop(0, 'rgba(224, 112, 60, 0.34)');
  halou.addColorStop(1, 'rgba(224, 112, 60, 0)');
  c.fillStyle = halou;
  c.beginPath();
  c.arc(cx, cy, r * 1.55, 0, Math.PI * 2);
  c.fill();

  const disc = c.createRadialGradient(cx - r * 0.25, cy - r * 0.30, r * 0.05, cx, cy, r);
  disc.addColorStop(0, DISC_INTERIOR);
  disc.addColorStop(0.65, DISC_CALD);
  disc.addColorStop(1, '#b8532a');
  c.fillStyle = disc;
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fill();

  /* Un inel subțire, mai deschis, puțin în interior: singurul ornament din toată
     sala. Un disc gol e o pată; un disc cu un inel e un obiect. */
  c.strokeStyle = 'rgba(255, 226, 186, 0.5)';
  c.lineWidth = Math.max(1.5, r * 0.012);
  c.beginPath();
  c.arc(cx, cy, r * 0.90, 0, Math.PI * 2);
  c.stroke();
}

/* Conul de lumină care cade de sus pe exponat. El leagă tavanul de podium și
   spune de unde vine lumina — fără el, discul plutește și rochia n-are motiv
   să fie luminată. */
function conulDeLumina(c, g) {
  const cx = g.pelCx;
  const sus = c.createLinearGradient(0, 0, 0, g.podiumCy);
  sus.addColorStop(0, LUMINA_CON + '0.22)');
  sus.addColorStop(0.7, LUMINA_CON + '0.07)');
  sus.addColorStop(1, LUMINA_CON + '0)');
  c.fillStyle = sus;
  c.beginPath();
  c.moveTo(cx - W * 0.055, 0);
  c.lineTo(cx + W * 0.055, 0);
  c.lineTo(cx + W * 0.30, g.podiumCy + H * 0.02);
  c.lineTo(cx - W * 0.30, g.podiumCy + H * 0.02);
  c.closePath();
  c.fill();

  // proiectorul din tavan, o siluetă mică și neagră
  c.fillStyle = '#0d1218';
  c.fillRect(cx - W * 0.020, 0, W * 0.040, H * 0.030);
  c.beginPath();
  c.moveTo(cx - W * 0.028, H * 0.030);
  c.lineTo(cx + W * 0.028, H * 0.030);
  c.lineTo(cx + W * 0.018, H * 0.052);
  c.lineTo(cx - W * 0.018, H * 0.052);
  c.closePath();
  c.fill();
}

/* Podeaua: închisă, lucioasă, cu oglindirea discului și a podiumului. Oglindirea
   e ce face dintr-o bandă închisă o **podea** — și tot ea dublează culoarea
   caldă, adică o duce jos, sub exponat, unde altfel n-ar ajunge. */
function podeaModerna(c, g) {
  c.fillStyle = PODEA_MODERN;
  c.fillRect(0, g.podea, W, H - g.podea);

  // oglindirea discului, întinsă și estompată
  c.save();
  c.beginPath();
  c.rect(0, g.podea, W, H - g.podea);
  c.clip();
  const cx = g.pelCx;
  const r = Math.min(W * 0.30, H * 0.42);
  const oglinda = c.createLinearGradient(0, g.podea, 0, H);
  oglinda.addColorStop(0, 'rgba(224, 112, 60, 0.30)');
  oglinda.addColorStop(0.55, 'rgba(224, 112, 60, 0.08)');
  oglinda.addColorStop(1, 'rgba(224, 112, 60, 0)');
  c.fillStyle = oglinda;
  c.beginPath();
  c.ellipse(cx, g.podea, r * 0.95, (H - g.podea) * 0.85, 0, 0, Math.PI * 2);
  c.fill();

  // linia de îmbinare dintre perete și podea, singura linie din sală
  c.strokeStyle = 'rgba(255, 255, 255, 0.10)';
  c.lineWidth = Math.max(1, g.S * 0.003);
  c.beginPath();
  c.moveTo(0, g.podea); c.lineTo(W, g.podea);
  c.stroke();
  c.restore();
}

/* Podiumul: un cilindru scund, deschis la culoare, care ridică exponatul din
   întunericul podelei. Deschis dinadins — rochia albă are nevoie de ceva pe care
   să stea fără să se piardă. */
function podiumulCuFunii(c, g, gr) {
  const h2 = H * 0.042;

  // umbra de sub podium, care îl așază pe podea
  c.fillStyle = 'rgba(0, 0, 0, 0.45)';
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy + h2 * 1.25, g.podiumRx * 1.12, g.podiumRy * 1.1,
            0, 0, Math.PI * 2);
  c.fill();

  // fața cilindrului
  const fata = c.createLinearGradient(g.podiumCx - g.podiumRx, 0, g.podiumCx + g.podiumRx, 0);
  fata.addColorStop(0, '#a9a293');
  fata.addColorStop(0.35, '#d2ccbe');
  fata.addColorStop(1, '#8e887b');
  c.fillStyle = fata;
  c.beginPath();
  c.moveTo(g.podiumCx - g.podiumRx, g.podiumCy);
  c.lineTo(g.podiumCx - g.podiumRx, g.podiumCy + h2);
  c.ellipse(g.podiumCx, g.podiumCy + h2, g.podiumRx, g.podiumRy, 0, Math.PI, 0, true);
  c.lineTo(g.podiumCx + g.podiumRx, g.podiumCy);
  c.closePath();
  c.fill();

  // blatul
  const blat = c.createLinearGradient(0, g.podiumCy - g.podiumRy, 0, g.podiumCy + g.podiumRy);
  blat.addColorStop(0, PODIUM_MODERN);
  blat.addColorStop(1, '#c7c1b3');
  c.fillStyle = blat;
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy, g.podiumRx, g.podiumRy, 0, 0, Math.PI * 2);
  c.fill();
}

/* ---------- PELERINA, ÎN LINIE ---------- */
/* Conturul pelerinei. Se ține într-un singur loc, fiindcă e nevoie de el în
   trei: la desen, la tăiat, și la socotit care ochiuri ale rețelei cad pe ea. */
/* ---------- EXPONATUL: O ROCHIE DE RENAȘTERE ----------

   Pe manechin a stat o vreme o mantie de ceremonie. N-a mers, și merită spus de
   ce, fiindcă e o lecție de desen, nu un capriciu:

   **o mantie n-are talie.** Conturul ei se lărgește de sus până jos fără să se
   oprească nicăieri, iar orice contur care face asta se citește ca un clopot —
   oricâte broderii, medalioane și ceaprazuri i-ai pune pe el. Am încercat de trei
   ori: cu glugă, cu trenă, cu bordură lată. De fiecare dată, de la doi pași,
   rămânea un abajur bogat ornamentat.

   O rochie de Renaștere are exact lucrul care lipsea: **o strângere**. Corsaj
   strâmt, talie ascuțită, și de acolo fusta care se deschide conic. Silueta se
   recunoaște înainte să apuci să te uiți la detalii — iar aici tocmai asta
   trebuie, fiindcă exponatul stă în mijlocul sălii și se vede de la intrare.

   Și mai are un folos, care ține de joc: rochia vine **cu despărțituri
   firești** — corsaj, mâneci bufante, mâneci strâmte, stomacher, fustă,
   jupa dinăuntru care se vede prin deschizătura din față. Fiecare e o suprafață
   închisă în care poți pune altă culoare. Suprafețele astea sunt tocmai ce face
   colorarea să merite; o pată mare și netedă nu-ți dă nimic de hotărât.

   (Numele din cod a rămas `pelerina` — el înseamnă acum „veșmântul de pe
   manechin", oricare ar fi el. E numele pe care îl știu și testele, și rețeaua
   care socotește acoperirea.) */

/* Croiala, scrisă o singură dată: pentru fiecare înălțime, cât e de lată. Din
   tabelul ăsta ies **și** conturul desenat, **și** socoteala acoperirii — două
   lucruri care trebuie să spună același adevăr. Scrise de două ori, s-ar
   despărți la prima schimbare: ai fi colorat o rochie și ai fi acoperit alta.

   Citit de sus în jos: gâtul, umerii, mânecile bufante — cel mai lat lucru de
   sus —, strângerea de sub ele, talia (locul cel mai îngust din tot desenul), și
   fusta care se deschide până la poale. */
const PROFIL_PELERINEI = [
  /* Proporțiile sunt luate de pe manechinele adevărate, nu alese din ochi.
     Pe un manechin îmbrăcat, **talia stă cam la o treime** din înălțimea
     veșmântului, nu la jumătate: deasupra ei e un trup scurt și îngust, dedesubt
     o fustă lungă. Mutată prea jos — cum era, la 0.43 — corsajul se lungește,
     fusta se scurtează, și rochia arată a rochiță de păpușă cu bustul prea mare.

     Iar mânecile nu trec de jumătatea lățimii de la poale. Le făcusem aproape
     două treimi: silueta ieșea în formă de romb, cu umerii cât șoldurile. */
  [0.000, 0.062], [0.045, 0.085],
  [0.075, 0.230], [0.105, 0.360],                   // umerii, cu aripioarele
  [0.165, 0.455], [0.230, 0.430],                   // mâneca-balon, până la cot
  [0.285, 0.290], [0.325, 0.170],                   // se strânge spre încheietură
  [0.345, 0.125],                                   // talia — o treime din înălțime
  [0.430, 0.335], [0.550, 0.565], [0.700, 0.785],
  [0.850, 0.925], [0.950, 0.982], [1.000, 1.000]
];

function latimeaPelerinei(v) {
  const t = Math.max(0, Math.min(1, v));
  for (let k = 1; k < PROFIL_PELERINEI.length; k++) {
    const a = PROFIL_PELERINEI[k - 1], b = PROFIL_PELERINEI[k];
    if (t <= b[0]) {
      const q = (t - a[0]) / Math.max(0.0001, b[0] - a[0]);
      return intre(a[1], b[1], q);
    }
  }
  return PROFIL_PELERINEI[PROFIL_PELERINEI.length - 1][1];
}

/* Trena. Fusta se revarsă puțin mai mult într-o parte, ca o rochie așezată pe
   manechin de o mână care a aranjat-o. Simetrică perfect, arată a desen tehnic. */
function adaosulTrenei(v) {
  if (v <= 0.72) return 0;
  const q = (v - 0.72) / 0.28;
  return Math.pow(q, 1.8) * 0.30;
}

function latimeaStanga(v) { return latimeaPelerinei(v) + adaosulTrenei(v); }
function latimeaDreapta(v) { return latimeaPelerinei(v) + adaosulTrenei(v) * 0.35; }

/* Talia. Ea e cheia întregii siluete: deasupra ei totul se strânge, dedesubt
   totul se deschide. În portretele de epocă vârful corsajului coboară chiar sub
   talie, într-un V lung — și tocmai V-ul ăla face ca fusta să pară de două ori
   mai largă decât e. */
const TALIA = 0.345;

function traseulPelerinei(c) {
  const g = geomSala8();
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const PASI = 40;
  c.beginPath();
  for (let k = 0; k <= PASI; k++) {
    const v = k / PASI;
    const x = cx - latimeaStanga(v) * w, y = sus + v * h;
    if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  /* Poalele: un val, ca o fustă lungă lăsată pe podium. O rochie nu se termină
     pe o linie trasă cu compasul. */
  const st = -latimeaStanga(1), dr = latimeaDreapta(1);
  for (let k = 0; k <= PASI; k++) {
    const q = k / PASI;
    c.lineTo(cx + intre(st, dr, q) * w,
             sus + h * (1 + 0.026 * Math.sin(q * Math.PI * 2.4)));
  }
  for (let k = PASI; k >= 0; k--) {
    const v = k / PASI;
    c.lineTo(cx + latimeaDreapta(v) * w, sus + v * h);
  }
  c.closePath();
}

function pelerinaInLinie(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, jos = g.pelJos, w = g.pelLat, h = g.pelInalt;

  gatulManechinului(c, g, gr);

  /* Rochia se umple cu alb înainte de orice linie. Ea e **singurul lucru
     nepictat din toată sala**, iar asta trebuie să se vadă dintr-o privire: o
     pânză albă într-o cameră pictată nu are nevoie de nicio săgeată ca să spună
     „eu sunt de făcut".

     Albul nu e curat, ci ușor gălbui, cu o umbră spre poale: pânză de in
     amorsată, nu o gaură în ecran. */
  const panza = c.createLinearGradient(0, sus, 0, jos);
  panza.addColorStop(0, '#fffdf7');
  panza.addColorStop(0.55, '#f7f1e2');
  panza.addColorStop(1, '#e8dfcb');
  c.fillStyle = panza;
  traseulPelerinei(c);
  c.fill();

  formaDeSubRochie(c, g);

  creion(c, gr * 1.6);
  traseulPelerinei(c);
  c.stroke();

  fustaCuDeschizatura(c, g, gr);
  corsajulSiDecolteul(c, g, gr);
  manecileBufante(c, g, gr);
  braulCuPietre(c, g, gr);
  capatulManechinului(c, g, gr);
}

/* ---------- MANECHINUL ----------

   Un cap-ou alb, fără față, pe un gât subțire, cu umerii rotunzi ieșind din
   decolteu. Așa arată manechinele din muzeele de costum: nu au trăsături,
   fiindcă nu ele sunt de privit, dar au **cap** — și tocmai capul face ca tot ce
   e sub el să se citească drept haină.

   Aveam un știft de lemn cu un buton deasupra. Din el nu se înțelegea nimic:
   rochia părea atârnată într-un cui. Un cap și doi umeri, chiar și fără față,
   pun un om acolo — iar din clipa aia rochia are un dedesubt.

   Manechinul stă **în afara** conturului rochiei, deci nu intră în socoteala
   acoperirii: nu-l pictezi, nici din greșeală. E de porțelan alb, iar rochia e
   pânză albă — se deosebesc prin ton: porțelanul e mai rece și mai lucios, cu o
   sclipire ascuțită; pânza e caldă și mată. */
function capatulManechinului(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const gatJos = sus + h * 0.055;
  const gatSus = sus - h * 0.105;
  const rCap = w * 0.155;
  const capCy = gatSus - rCap * 0.86;

  const portelan = function (x0, y0, x1, y1) {
    const grd = c.createLinearGradient(x0, y0, x1, y1);
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(0.42, '#f2f0ec');
    grd.addColorStop(1, '#c9c5bd');
    return grd;
  };

  /* Umerii: două movile rotunde care ies din decolteu. Ele sunt jumătatea de sus
     a trupului, și fără ele gâtul crește direct din rochie ca o tulpină. */
  c.fillStyle = portelan(cx - w * 0.30, sus, cx + w * 0.26, gatJos + h * 0.05);
  c.beginPath();
  c.moveTo(cx - w * 0.235, sus + h * 0.075);
  c.quadraticCurveTo(cx - w * 0.215, sus + h * 0.005, cx - w * 0.105, gatJos - h * 0.020);
  c.lineTo(cx + w * 0.105, gatJos - h * 0.020);
  c.quadraticCurveTo(cx + w * 0.215, sus + h * 0.005, cx + w * 0.235, sus + h * 0.075);
  c.closePath();
  c.fill();
  creion(c, gr * 1.1);
  c.stroke();

  // gâtul
  c.fillStyle = portelan(cx - w * 0.075, 0, cx + w * 0.075, 0);
  c.beginPath();
  c.moveTo(cx - w * 0.070, gatJos);
  c.quadraticCurveTo(cx - w * 0.062, gatSus + h * 0.03, cx - w * 0.055, gatSus);
  c.lineTo(cx + w * 0.055, gatSus);
  c.quadraticCurveTo(cx + w * 0.062, gatSus + h * 0.03, cx + w * 0.070, gatJos);
  c.closePath();
  c.fill();
  creion(c, gr * 1.1);
  c.stroke();
  // umbra gâtului pe piept, care îl desprinde de umeri
  const subGat = c.createLinearGradient(0, gatJos - h * 0.03, 0, gatJos + h * 0.01);
  subGat.addColorStop(0, 'rgba(120, 112, 100, 0)');
  subGat.addColorStop(1, 'rgba(120, 112, 100, 0.35)');
  c.fillStyle = subGat;
  c.fillRect(cx - w * 0.075, gatJos - h * 0.03, w * 0.15, h * 0.04);

  /* Capul: un ou întors, mai lat sus decât jos, fără nicio trăsătură. Netezimea
     lui e chiar rostul: un manechin cu față ar deveni un personaj, iar aici
     personajul ești tu. */
  c.fillStyle = portelan(cx - rCap, capCy - rCap, cx + rCap * 0.8, capCy + rCap * 1.2);
  c.beginPath();
  c.moveTo(cx, capCy - rCap * 1.12);
  c.bezierCurveTo(cx + rCap * 1.02, capCy - rCap * 1.02,
                  cx + rCap * 0.92, capCy + rCap * 0.62,
                  cx + rCap * 0.34, capCy + rCap * 1.02);
  c.bezierCurveTo(cx + rCap * 0.12, capCy + rCap * 1.14,
                  cx - rCap * 0.12, capCy + rCap * 1.14,
                  cx - rCap * 0.34, capCy + rCap * 1.02);
  c.bezierCurveTo(cx - rCap * 0.92, capCy + rCap * 0.62,
                  cx - rCap * 1.02, capCy - rCap * 1.02,
                  cx, capCy - rCap * 1.12);
  c.closePath();
  c.fill();
  creion(c, gr * 1.15);
  c.stroke();

  // sclipirea de porțelan, sus-stânga: ea spune „lucios", deci „nu e stofă"
  c.save();
  c.globalAlpha = 0.75;
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.ellipse(cx - rCap * 0.34, capCy - rCap * 0.42, rCap * 0.22, rCap * 0.34, -0.5, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

/* Mâna manechinului, ieșind din mânecă: o palmă albă, cu degetele strânse, cum
   stau la manechinele de muzeu. Nu se desenează degete unul câte unul — la
   mărimea asta, o palmă cu un deget mare și o adâncitură între degete e tot ce se
   citește, iar cinci degete desenate ar face o mănușă de cauciuc. */
function manaManechinului(c, g, gr, lat) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const x = cx + lat * w * 0.185, y = sus + h * 0.445;
  const rx = w * 0.048, ry = h * 0.042;

  const grd = c.createLinearGradient(x - rx, y - ry, x + rx, y + ry);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(0.45, '#f2f0ec');
  grd.addColorStop(1, '#c6c2ba');
  c.fillStyle = grd;
  c.beginPath();
  c.moveTo(x - rx * 0.7, y - ry);
  c.quadraticCurveTo(x + rx * 0.9, y - ry * 0.6, x + rx * 0.75, y + ry * 0.5);
  c.quadraticCurveTo(x + rx * 0.3, y + ry * 1.15, x - rx * 0.5, y + ry * 0.8);
  c.quadraticCurveTo(x - rx * 1.0, y + ry * 0.2, x - rx * 0.7, y - ry);
  c.closePath();
  c.fill();
  creion(c, gr * 0.95);
  c.stroke();
  // adâncitura dintre degete și degetul mare
  creion(c, gr * 0.6, LINIE_SUBTIRE);
  c.beginPath();
  c.moveTo(x + rx * 0.1, y - ry * 0.5);
  c.quadraticCurveTo(x + rx * 0.45, y + ry * 0.1, x + rx * 0.25, y + ry * 0.75);
  c.stroke();
}

/* ---------- MODELAREA ----------

   Rochia era albă și plată, cu linii subțiri peste ea — și nu se înțelegea deloc
   ce formă are. „Parcă n-are manechin dedesubt", și chiar așa era: **o formă nu
   se citește din contur, se citește din umbră.**

   Conturul spune doar unde se termină lucrul. Ce spune că e rotund, că iese în
   față, că are un trup sub el, e felul în care lumina alunecă pe el: mijlocul
   luminat, marginile lăsate în umbră, și umbrele aruncate de o parte peste alta
   — gulerul peste piept, mâneca peste fustă.

   Umbrele astea nu strică albul. O pânză albă amorsată, pusă pe un manechin, tot
   are umbre; ce n-are e **culoare**. De-aia se face totul în cenușiu cald, fără
   niciun pigment: rochia rămâne nepictată, dar încetează să mai fie plată. */
function formaDeSubRochie(c, g) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const talie = sus + TALIA * h;
  const jos = sus + h;

  c.save();
  traseulPelerinei(c);
  c.clip();

  /* 1. Corsajul: un trup rotund. Lumină pe mijloc, umbră pe cele două laturi.
     Asta singură face din corsaj un piept, nu un carton. */
  const trup = c.createLinearGradient(cx - w * 0.15, 0, cx + w * 0.15, 0);
  trup.addColorStop(0, 'rgba(112, 100, 80, 0.52)');
  trup.addColorStop(0.28, 'rgba(255, 253, 245, 0)');
  trup.addColorStop(0.60, 'rgba(255, 253, 245, 0)');
  trup.addColorStop(1, 'rgba(112, 100, 80, 0.58)');
  c.fillStyle = trup;
  c.fillRect(cx - w * 0.16, sus + h * 0.05, w * 0.32, talie - sus - h * 0.03);

  /* 2. Mânecile-balon: fiecare e o bilă de stofă. Lumina cade sus-stânga, deci
     fiecare primește o pată deschisă acolo și se închide spre marginea de jos.
     Rotunjimea lor e ce dă rochiei umeri. */
  for (const lat of [-1, 1]) {
    const mx = cx + lat * w * 0.315, my = sus + h * 0.215;
    const rx = w * 0.175, ry = h * 0.125;
    const bila = c.createRadialGradient(mx - rx * 0.35, my - ry * 0.45, rx * 0.08,
                                        mx, my, rx * 1.25);
    bila.addColorStop(0, 'rgba(255, 255, 252, 0.85)');
    bila.addColorStop(0.45, 'rgba(255, 253, 245, 0)');
    bila.addColorStop(1, 'rgba(112, 100, 80, 0.55)');
    c.fillStyle = bila;
    c.beginPath();
    c.ellipse(mx, my, rx * 1.3, ry * 1.45, 0, 0, Math.PI * 2);
    c.fill();
  }

  /* 3. Fusta: un con. Lumina coboară pe mijlocul din față, umbra se strânge
     spre cele două margini — și cu atât mai tare în jos, unde stofa e mai
     adunată. */
  const con = c.createLinearGradient(cx - w * 0.95, 0, cx + w * 0.95, 0);
  con.addColorStop(0, 'rgba(104, 92, 74, 0.58)');
  con.addColorStop(0.22, 'rgba(150, 138, 116, 0.22)');
  con.addColorStop(0.46, 'rgba(255, 253, 245, 0)');
  con.addColorStop(0.62, 'rgba(255, 253, 245, 0)');
  con.addColorStop(0.82, 'rgba(150, 138, 116, 0.26)');
  con.addColorStop(1, 'rgba(104, 92, 74, 0.62)');
  c.fillStyle = con;
  c.fillRect(cx - w * 1.4, talie, w * 2.8, jos - talie + h * 0.06);

  // și o umbră care se adună la poale, ca stofa grea care atinge podiumul
  const poale = c.createLinearGradient(0, jos - h * 0.22, 0, jos + h * 0.03);
  poale.addColorStop(0, 'rgba(104, 92, 74, 0)');
  poale.addColorStop(1, 'rgba(104, 92, 74, 0.36)');
  c.fillStyle = poale;
  c.fillRect(cx - w * 1.4, jos - h * 0.22, w * 2.8, h * 0.25);

  /* 4. Umbrele aruncate. Ele sunt cele care spun cine stă **în fața** cui:
     gulerul peste piept, mânecile peste fustă. Fără ele, toate părțile plutesc
     în același plan, oricât de bine ar fi modelată fiecare. */
  const subGuler = c.createLinearGradient(0, sus + h * 0.030, 0, sus + h * 0.105);
  subGuler.addColorStop(0, 'rgba(96, 86, 70, 0.45)');
  subGuler.addColorStop(1, 'rgba(96, 86, 70, 0)');
  c.fillStyle = subGuler;
  c.fillRect(cx - w * 0.32, sus + h * 0.030, w * 0.64, h * 0.075);

  for (const lat of [-1, 1]) {
    const ux = cx + lat * w * 0.30;
    const subManeca = c.createLinearGradient(0, talie - h * 0.02, 0, talie + h * 0.10);
    subManeca.addColorStop(0, 'rgba(96, 86, 70, 0.34)');
    subManeca.addColorStop(1, 'rgba(96, 86, 70, 0)');
    c.fillStyle = subManeca;
    c.fillRect(ux - w * 0.18, talie - h * 0.02, w * 0.36, h * 0.12);
  }

  /* 5. Cutele fustei, ca umbre lungi, nu ca linii. O cută e o adâncitură: se
     vede fiindcă acolo lumina nu ajunge, nu fiindcă cineva a tras o dungă. */
  for (let k = 0; k < 9; k++) {
    const t = (k + 0.5) / 9;
    const de = (t - 0.5) * 2;
    const laTalie = cx + de * latimeaPelerinei(TALIA) * 0.8 * w;
    const laPoale = cx + de * (de < 0 ? latimeaStanga(0.97) : latimeaDreapta(0.97)) * 0.88 * w;
    const lat = w * (0.05 + Math.abs(de) * 0.05);
    c.save();
    c.globalAlpha = 0.16 + Math.abs(de) * 0.12;
    const cuta = c.createLinearGradient(laPoale - lat, 0, laPoale + lat, 0);
    cuta.addColorStop(0, 'rgba(96, 86, 70, 0)');
    cuta.addColorStop(0.5, 'rgba(96, 86, 70, 1)');
    cuta.addColorStop(1, 'rgba(96, 86, 70, 0)');
    c.fillStyle = cuta;
    c.beginPath();
    c.moveTo(laTalie - lat * 0.35, talie);
    c.lineTo(laTalie + lat * 0.35, talie);
    c.lineTo(laPoale + lat, jos + h * 0.02);
    c.lineTo(laPoale - lat, jos + h * 0.02);
    c.closePath();
    c.fill();
    c.restore();
  }

  c.restore();
}

/* Gâtul manechinului: un stâlp scurt care iese din decolteu. El e tot ce spune
   că rochia e **îmbrăcată pe ceva**, nu atârnată într-un cui. */
function gatulManechinului(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const lat = w * 0.10, inalt = h * 0.06;
  const lemn = c.createLinearGradient(cx - lat, 0, cx + lat, 0);
  lemn.addColorStop(0, '#e8dcc4');
  lemn.addColorStop(0.35, '#d8c8a8');
  lemn.addColorStop(1, '#a89478');
  c.fillStyle = lemn;
  c.beginPath();
  c.moveTo(cx - lat * 0.74, sus - inalt);
  c.lineTo(cx - lat, sus + h * 0.025);
  c.lineTo(cx + lat, sus + h * 0.025);
  c.lineTo(cx + lat * 0.74, sus - inalt);
  c.closePath();
  c.fill();
  creion(c, gr * 1.2);
  c.stroke();
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  c.beginPath();
  c.ellipse(cx, sus - inalt, lat * 0.74, lat * 0.22, 0, 0, Math.PI * 2);
  c.stroke();
}

/* Corsajul: decolteul pătrat de sus, cămașa care se vede peste el, și stomacherul
   — pana brodată din față, care coboară în vârf ascuțit până sub talie.

   Vârful ăsta e semnul cel mai tare al siluetei de Renaștere: el trage ochiul în
   jos și face talia să pară și mai subțire decât e. */
function corsajulSiDecolteul(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const decolteu = sus + h * 0.068;
  const talie = sus + TALIA * h;
  /* Vârful corsajului coboară **sub** talie, într-un V lung. În portrete el ajunge
     cu o palmă mai jos decât brâul — de-aia fusta pare că pleacă de mai jos și,
     odată cu asta, mai largă. */
  const varf = talie + h * 0.085;

  /* Decolteul pătrat, tăiat drept de la un umăr la altul. E linia care spune
     „Renaștere" imediat după siluetă — și tot ea lasă la vedere pieptul alb al
     manechinului, adică lucrul care dovedește că rochia e îmbrăcată. */
  creion(c, gr * 1.4);
  c.beginPath();
  c.moveTo(cx - w * 0.235, decolteu + h * 0.030);
  c.lineTo(cx - w * 0.150, decolteu + h * 0.050);
  c.lineTo(cx + w * 0.150, decolteu + h * 0.050);
  c.lineTo(cx + w * 0.235, decolteu + h * 0.030);
  c.stroke();
  // panglica cusută pe marginea decolteului
  creion(c, gr * 0.6, LINIE_SUBTIRE);
  c.beginPath();
  c.moveTo(cx - w * 0.222, decolteu + h * 0.044);
  c.lineTo(cx - w * 0.145, decolteu + h * 0.062);
  c.lineTo(cx + w * 0.145, decolteu + h * 0.062);
  c.lineTo(cx + w * 0.222, decolteu + h * 0.044);
  c.stroke();

  /* Stomacherul: pana din față, cu marginile ei și cu un caroiaj de fir de aur.
     Caroiajul e tot ce trebuie ca să se citească „brodat" — dincolo de asta,
     ochiul nu mai numără. */
  creion(c, gr * 1.25);
  c.beginPath();
  c.moveTo(cx - w * 0.140, decolteu + h * 0.050);
  c.quadraticCurveTo(cx - w * 0.115, talie - h * 0.05, cx - w * 0.075, talie);
  c.lineTo(cx, varf);
  c.lineTo(cx + w * 0.075, talie);
  c.quadraticCurveTo(cx + w * 0.115, talie - h * 0.05, cx + w * 0.140, decolteu + h * 0.050);
  c.stroke();

  /* Șirul de pietre de pe mijlocul stomacherului. În toate portretele coboară un
     lanț de nestemate exact pe linia asta — el trage ochiul spre vârful V-ului,
     adică spre locul unde silueta se strânge cel mai tare. */
  creion(c, gr * 0.7, LINIE_SUBTIRE);
  for (let k = 0; k < 6; k++) {
    const t = (k + 0.5) / 6;
    const y = intre(decolteu + h * 0.075, varf - h * 0.012, t);
    const r = w * (0.026 - t * 0.008);
    c.beginPath();
    c.moveTo(cx, y - r); c.lineTo(cx + r * 0.7, y);
    c.lineTo(cx, y + r); c.lineTo(cx - r * 0.7, y);
    c.closePath();
    c.stroke();
  }

  creion(c, gr * 0.5, LINIE_SUBTIRE);
  for (let k = 1; k < 7; k++) {
    const t = k / 7;
    const l = intre(w * 0.140, w * 0.075, t), y = intre(decolteu + h * 0.050, talie, t);
    c.beginPath();
    c.moveTo(cx - l, y); c.lineTo(cx + l, y);
    c.stroke();
  }

  // cusăturile corsajului, de la subsuoară spre talie
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.moveTo(cx + lat * w * 0.245, sus + h * 0.215);
    c.quadraticCurveTo(cx + lat * w * 0.215, sus + h * 0.30,
                       cx + lat * w * 0.185, talie);
    c.stroke();
  }
}

/* Mânecile. În portretele de epocă ele nu sunt o bufantă mică la umăr, ci
   **baloane întregi**, de la umăr până la încheietură: se umflă la cot și se
   strâng brusc într-o manșetă mică. Peste ele merg benzi cusute, de sus în jos,
   ca niște cercuri de butoi — de-acolo vine ritmul care face mâneca bogată.

   La umăr stă *aripioara*: un sul căptușit, în formă de semilună, care ascunde
   cusătura. Fără el, mâneca pare lipită de corsaj. */
function manecileBufante(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const umar = sus + h * 0.115;
  const incheietura = sus + h * 0.395;

  for (const lat of [-1, 1]) {
    // cusătura care desparte mâneca de corsaj
    creion(c, gr * 1.3);
    c.beginPath();
    c.moveTo(cx + lat * w * 0.132, sus + h * 0.095);
    c.quadraticCurveTo(cx + lat * w * 0.126, sus + h * 0.26,
                       cx + lat * w * 0.150, sus + h * 0.375);
    c.stroke();

    /* Benzile de pe mânecă: șase cercuri care urmează umflătura. Fiecare e mai
       lată acolo unde mâneca e mai groasă, fiindcă merge de jur împrejurul ei. */
    creion(c, gr * 0.8, LINIE_SUBTIRE);
    for (let k = 1; k <= 6; k++) {
      const t = k / 7;
      const v = intre(0.115, 0.395, t);
      const dinauntru = w * intre(0.130, 0.150, t);
      const dinafara = latimeaPelerinei(v) * w;
      const y = sus + v * h;
      c.beginPath();
      c.moveTo(cx + lat * dinauntru, y);
      c.quadraticCurveTo(cx + lat * (dinauntru + dinafara) * 0.5, y + h * 0.016,
                         cx + lat * dinafara * 0.985, y - h * 0.004);
      c.stroke();
    }

    // aripioara de la umăr: un sul în formă de semilună
    creion(c, gr * 1.15);
    c.beginPath();
    c.moveTo(cx + lat * w * 0.120, sus + h * 0.082);
    c.quadraticCurveTo(cx + lat * w * 0.300, sus + h * 0.062,
                       cx + lat * w * 0.360, umar + h * 0.040);
    c.stroke();
    c.beginPath();
    c.moveTo(cx + lat * w * 0.120, sus + h * 0.082);
    c.quadraticCurveTo(cx + lat * w * 0.270, sus + h * 0.118,
                       cx + lat * w * 0.360, umar + h * 0.040);
    c.stroke();
    creion(c, gr * 0.6, LINIE_SUBTIRE);
    for (let k = 1; k < 5; k++) {
      const t = k / 5;
      c.beginPath();
      c.moveTo(cx + lat * intre(w * 0.135, w * 0.340, t), sus + h * intre(0.076, 0.064, t));
      c.lineTo(cx + lat * intre(w * 0.140, w * 0.335, t), sus + h * intre(0.114, 0.108, t));
      c.stroke();
    }

    // manșeta mică de la încheietură, cu dantela ei
    creion(c, gr * 1.15);
    c.beginPath();
    c.moveTo(cx + lat * w * 0.155, incheietura - h * 0.015);
    c.quadraticCurveTo(cx + lat * w * 0.215, incheietura + h * 0.010,
                       cx + lat * w * 0.178, incheietura + h * 0.030);
    c.stroke();
    creion(c, gr * 0.6, LINIE_SUBTIRE);
    for (let k = 0; k < 5; k++) {
      const t = (k + 0.5) / 5;
      const x = cx + lat * intre(w * 0.162, w * 0.188, t);
      const y = intre(incheietura - h * 0.008, incheietura + h * 0.028, t);
      c.beginPath();
      c.arc(x, y, w * 0.014, 0, Math.PI);
      c.stroke();
    }

    // mâna care iese din mânecă
    manaManechinului(c, g, gr, lat);
  }
}

/* Fusta: deschizătura în V din față, prin care se vede jupa brodată, și cutele
   care pleacă din talie și se răsfiră spre poale. */
function fustaCuDeschizatura(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const talie = sus + TALIA * h;
  const jos = sus + h;

  /* Deschizătura: două margini care pleacă de la talie și se depărtează până la
     poale. Ce rămâne între ele e jupa — altă țesătură, deci alt loc de pus altă
     culoare. */
  /* Deschizătura fustei e un V larg, nu o crăpătură. În portrete rochia se
     desface de la talie până jos și lasă la vedere **jupa** — altă țesătură, cu
     alt desen. Ea e a doua suprafață mare pe care ai unde pune altă culoare. */
  const margine = function (t) { return w * intre(0.03, 0.62, Math.pow(t, 1.05)); };
  creion(c, gr * 1.35);
  for (const lat of [-1, 1]) {
    c.beginPath();
    for (let k = 0; k <= 24; k++) {
      const t = k / 24, y = intre(talie + h * 0.02, jos - h * 0.012, t);
      const x = cx + lat * margine(t);
      if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
  }

  /* Broderia jupei: romburi cu câte o floare, ca la brocarturile de epocă. Se
     desenează des, fiindcă asta se vede dintr-o jupă bogată. */
  creion(c, gr * 0.6, LINIE_SUBTIRE);
  for (let r = 0; r < 5; r++) {
    const t = (r + 0.6) / 5.6;
    const y = intre(talie + h * 0.03, jos - h * 0.02, t);
    const lat = margine(t) * 0.82;
    const cate = 1 + r;
    for (let k = 0; k < cate; k++) {
      const x = cx + (cate === 1 ? 0 : intre(-lat, lat, k / (cate - 1)) * 0.8);
      const rr = w * 0.030;
      c.beginPath();
      c.moveTo(x, y - rr); c.lineTo(x + rr * 0.62, y);
      c.lineTo(x, y + rr); c.lineTo(x - rr * 0.62, y);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.arc(x, y, rr * 0.22, 0, Math.PI * 2);
      c.stroke();
    }
  }

  /* Cutele fustei: pleacă din talie și se răsfiră. Ele sunt ce spune că fusta e
     din stofă grea, nu dintr-un carton conic. */
  creion(c, gr * 0.85, LINIE_SUBTIRE);
  for (let k = 0; k < 12; k++) {
    const t = (k + 0.5) / 12;
    const de = (t - 0.5) * 2;
    const laTalie = de * latimeaPelerinei(TALIA) * 0.86;
    const laPoale = de < 0 ? de * latimeaStanga(0.97) * 0.90
                           : de * latimeaDreapta(0.97) * 0.90;
    // cutele nu intră peste jupă: se opresc la marginea deschizăturii
    if (Math.abs(laPoale) * w < margine(0.9)) continue;
    c.beginPath();
    c.moveTo(cx + laTalie * w, talie + h * 0.015);
    c.quadraticCurveTo(cx + intre(laTalie, laPoale, 0.45) * w, sus + h * 0.72,
                       cx + laPoale * w, sus + h * 0.97);
    c.stroke();
  }

  // bordura de la poale
  creion(c, gr * 1.05);
  const st = -latimeaStanga(1), dr = latimeaDreapta(1);
  c.beginPath();
  for (let k = 0; k <= 36; k++) {
    const q = k / 36;
    const x = cx + intre(st * 0.955, dr * 0.955, q) * w;
    const y = sus + h * (1 + 0.026 * Math.sin(q * Math.PI * 2.4)) - h * 0.055;
    if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  c.stroke();
}

/* Brâul de la talie: o cingătoare cu pietre, din care atârnă un lanț subțire.
   E singurul lucru din desen care nu ține de croială — și tocmai de-aia se vede:
   ochiul se odihnește pe el și, odată oprit acolo, măsoară talia. */
function braulCuPietre(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const talie = sus + TALIA * h;
  const lat = latimeaPelerinei(TALIA) * w;

  creion(c, gr * 1.3);
  c.beginPath();
  c.moveTo(cx - lat, talie - h * 0.008);
  c.quadraticCurveTo(cx, talie + h * 0.018, cx + lat, talie - h * 0.008);
  c.stroke();
  c.beginPath();
  c.moveTo(cx - lat, talie + h * 0.020);
  c.quadraticCurveTo(cx, talie + h * 0.046, cx + lat, talie + h * 0.020);
  c.stroke();

  // pietrele
  creion(c, gr * 0.7, LINIE_SUBTIRE);
  for (let k = 0; k < 7; k++) {
    const t = (k + 0.5) / 7;
    const x = intre(cx - lat * 0.86, cx + lat * 0.86, t);
    const y = talie + h * 0.010 + Math.sin(t * Math.PI) * h * 0.014;
    c.beginPath();
    c.moveTo(x, y - h * 0.010); c.lineTo(x + w * 0.022, y);
    c.lineTo(x, y + h * 0.010); c.lineTo(x - w * 0.022, y);
    c.closePath();
    c.stroke();
  }

  // lanțul care atârnă din brâu peste fustă
  creion(c, gr * 0.6, LINIE_SUBTIRE);
  c.beginPath();
  c.moveTo(cx + w * 0.03, talie + h * 0.040);
  c.quadraticCurveTo(cx + w * 0.075, talie + h * 0.13, cx + w * 0.045, talie + h * 0.215);
  c.stroke();
  for (let k = 1; k <= 5; k++) {
    const t = k / 5;
    const x = intre(cx + w * 0.03, cx + w * 0.045, t) + Math.sin(t * Math.PI) * w * 0.028;
    const y = intre(talie + h * 0.040, talie + h * 0.215, t);
    c.beginPath();
    c.arc(x, y, w * 0.012, 0, Math.PI * 2);
    c.stroke();
  }
}

/* ---------- FORMELE ROCHIEI ----------

   Rochia nu e o singură pată, ci **părți**: corsajul, mâneca stângă, mâneca
   dreaptă, fusta și jupa care se vede prin deschizătură. Fiecare e o formă
   închisă.

   De ce contează: pasta pusă cu degetul se oprea acolo unde se termina tușa, nu
   acolo unde se termină forma. Ieșeau bulgări peste conturul rochiei, în aer, și
   silueta se strica — ceea ce e chiar pe dos față de rostul scenei, fiindcă
   forma exponatului e tot ce ține scena laolaltă.

   Așa că **fiecare tușă se taie la forma pe care ai atins-o.** Atingi corsajul,
   vopseaua rămâne în corsaj; atingi mâneca, rămâne în mânecă. Exact ca la o carte
   de colorat, și pentru același motiv: marginile sunt cele care fac culoarea să
   însemne ceva.

   Formele se scriu din aceleași numere din care se desenează conturul — dacă s-ar
   scrie de două ori, ai colora o rochie și ai umple alta. */
function traseulZonei(c, zona) {
  const g = geomSala8();
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const talie = sus + TALIA * h;
  const jos = sus + h;
  const decolteu = sus + h * 0.068;
  const varf = talie + h * 0.085;
  const margineJupa = function (t) { return w * intre(0.03, 0.62, Math.pow(t, 1.05)); };

  if (zona === 'corsaj') {
    /* Corsajul: de la decolteu până la vârful de sub talie, între cele două
       cusături ale mânecilor. */
    c.beginPath();
    c.moveTo(cx - w * 0.150, decolteu + h * 0.040);
    c.lineTo(cx + w * 0.150, decolteu + h * 0.040);
    c.quadraticCurveTo(cx + w * 0.140, sus + h * 0.26, cx + w * 0.150, talie);
    c.lineTo(cx, varf);
    c.lineTo(cx - w * 0.150, talie);
    c.quadraticCurveTo(cx - w * 0.140, sus + h * 0.26, cx - w * 0.150, decolteu + h * 0.040);
    c.closePath();
    return;
  }

  if (zona === 'manecaSt' || zona === 'manecaDr') {
    /* Mâneca: între cusătura de la corsaj și conturul de afară al rochiei, de la
       umăr până la încheietură. Marginea de afară se ia din chiar profilul
       rochiei — deci mâneca nu poate ieși niciodată din siluetă. */
    const lat = zona === 'manecaSt' ? -1 : 1;
    const vSus = 0.070, vJos = 0.400;
    const PASI = 16;
    c.beginPath();
    for (let k = 0; k <= PASI; k++) {
      const t = k / PASI, v = intre(vSus, vJos, t);
      const x = cx + lat * w * intre(0.128, 0.152, t), y = sus + v * h;
      if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    for (let k = PASI; k >= 0; k--) {
      const t = k / PASI, v = intre(vSus, vJos, t);
      c.lineTo(cx + lat * latimeaPelerinei(v) * w, sus + v * h);
    }
    c.closePath();
    return;
  }

  if (zona === 'jupa') {
    // jupa: triunghiul dintre cele două margini ale deschizăturii
    c.beginPath();
    for (let k = 0; k <= 24; k++) {
      const t = k / 24, y = intre(talie + h * 0.02, jos - h * 0.010, t);
      const x = cx - margineJupa(t);
      if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    for (let k = 24; k >= 0; k--) {
      const t = k / 24, y = intre(talie + h * 0.02, jos - h * 0.010, t);
      c.lineTo(cx + margineJupa(t), y);
    }
    c.closePath();
    return;
  }

  // fusta: tot ce e sub talie, mai puțin jupa (o tăiem cu winding invers)
  const PASI = 30;
  const st = -latimeaStanga(1), dr = latimeaDreapta(1);
  c.beginPath();
  for (let k = 0; k <= PASI; k++) {
    const t = k / PASI, v = intre(TALIA, 1, t);
    const x = cx - latimeaStanga(v) * w, y = sus + v * h;
    if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  for (let k = 0; k <= PASI; k++) {
    const q = k / PASI;
    c.lineTo(cx + intre(st, dr, q) * w,
             sus + h * (1 + 0.026 * Math.sin(q * Math.PI * 2.4)));
  }
  for (let k = PASI; k >= 0; k--) {
    const t = k / PASI, v = intre(TALIA, 1, t);
    c.lineTo(cx + latimeaDreapta(v) * w, sus + v * h);
  }
  c.closePath();
  /* Jupa se scoate din fustă, trasată în sens invers: cu regula „nonzero", un
     contur întors face gaură. Altfel o tușă pusă pe fustă ar trece și peste jupa
     de dedesubt, care e altă țesătură. */
  for (let k = 24; k >= 0; k--) {
    const t = k / 24, y = intre(talie + h * 0.02, jos - h * 0.010, t);
    const x = cx - margineJupa(t);
    if (k === 24) c.moveTo(x, y); else c.lineTo(x, y);
  }
  for (let k = 0; k <= 24; k++) {
    const t = k / 24, y = intre(talie + h * 0.02, jos - h * 0.010, t);
    c.lineTo(cx + margineJupa(t), y);
  }
  c.closePath();
}

const ZONELE_ROCHIEI = ['corsaj', 'manecaSt', 'manecaDr', 'jupa', 'fusta'];

/* Pe care parte a rochiei a căzut degetul. Se întreabă chiar pânza, cu
   `isPointInPath`: e răspunsul exact, dat de aceleași contururi din care se
   desenează. Socotit de mână, cu dreptunghiuri, s-ar despărți de desen la prima
   schimbare de croială. */
const panzaZonelor = { panza: null, ctx: null };

function zonaAtinsa(x, y) {
  if (!panzaZonelor.ctx) {
    panzaZonelor.panza = document.createElement('canvas');
    panzaZonelor.panza.width = 1; panzaZonelor.panza.height = 1;
    panzaZonelor.ctx = panzaZonelor.panza.getContext('2d');
  }
  const c = panzaZonelor.ctx;
  for (const zona of ZONELE_ROCHIEI) {
    traseulZonei(c, zona);
    if (c.isPointInPath(x, y)) return zona;
  }
  // în siluetă, dar în nicio parte anume (gulerul, marginile): tot rochie e
  traseulPelerinei(c);
  return c.isPointInPath(x, y) ? 'rochie' : null;
}

function ochiulPelerinei(i, j) {
  const g = geomSala8();
  const w = g.pelLat * 2 * latimeaPelerinei(0.96), h = g.pelInalt * 1.03;
  return {
    x: g.pelCx - w / 2 + (i + 0.5) * w / OCHIURI_PELERINA,
    y: g.pelSus + (j + 0.5) * h / OCHIURI_PELERINA
  };
}

/* Care ochiuri cad **pe** pelerină. Se socotește din croială: la înălțimea
   ochiului, pelerina e lată de atât — deci ochiul e pe ea dacă e mai aproape de
   ax decât atât. O singură înmulțire, fără nicio citire de pânză. */
function pregatesteOchiurile() {
  const g = geomSala8();
  s8.celule = [];
  for (let i = 0; i < OCHIURI_PELERINA; i++) {
    for (let j = 0; j < OCHIURI_PELERINA; j++) {
      const o = ochiulPelerinei(i, j);
      const v = (o.y - g.pelSus) / g.pelInalt;
      const inauntru = v >= 0 && v <= 1 &&
                       Math.abs(o.x - g.pelCx) <= latimeaPelerinei(v) * g.pelLat;
      s8.celule[i * OCHIURI_PELERINA + j] = inauntru ? false : null;
    }
  }
}

/* ---------- FIȘA DE SALĂ ---------- */
/* Fișa de sală. **Caseta se face cât textul, nu textul cât caseta.**

   Înainte caseta avea o înălțime scrisă de mână, iar litera se micșora până
   încăpea în ea: la un text lung ieșeau litere de opt pixeli într-un chenar cu
   loc gol dedesubt, fiindcă micșorarea se oprea la prag. E pe dos. Un panou de
   muzeu se face cât are de spus.

   Deci: alegem o literă care se citește (potrivită după ecran, nu după casetă),
   rupem textul pe lățimea dată, socotim câte rânduri ies — și abia atunci știm
   cât e de înaltă caseta. */
function inaltimeaFisei(c, g) {
  const marime = marimeaFisei(g);
  c.save();
  c.font = Math.round(marime) + 'px Georgia';
  const paragrafe = TEXT_FISA_PIGMENTI.split('\n');
  let inalt = g.fisaLat * 0.06;                 // marginea de sus
  for (const par of paragrafe) {
    inalt += randuriInCaseta(c, par, g.fisaLat * 0.86).length * marime * 1.42;
    inalt += marime * 0.75;                     // pauza dintre paragrafe
  }
  c.restore();
  return inalt + g.fisaLat * 0.04;              // marginea de jos
}

/* Litera fișei: destul de mare cât s-o citești de la un metru, dar nu atât cât
   să facă din panou un afiș. Se ia din ecran, fiindcă de ecran ține cititul. */
function marimeaFisei(g) {
  return Math.max(11, Math.min(g.fisaLat * 0.055, g.S * 0.021));
}

function fisaDeSala8(c, g, gr) {
  const x = g.fisaX, y = g.fisaY, w = g.fisaLat;
  const h = inaltimeaFisei(c, g);
  c.save();
  c.fillStyle = 'rgba(255, 254, 250, 0.92)';
  c.fillRect(x, y, w, h);
  creion(c, gr * 1.4);
  c.strokeRect(x, y, w, h);
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  c.strokeRect(x + w * 0.025, y + w * 0.018, w * 0.95, h - w * 0.036);
  c.restore();

  /* Trei paragrafe, cu o singură mărime de literă pentru toate. Căutată pentru
     fiecare în parte, primul ar ieși mare și ultimul mărunt — iar o fișă scrisă
     cu trei litere diferite arată a colaj. */
  const marime = marimeaFisei(g);
  let yy = y + w * 0.06;
  for (const par of TEXT_FISA_PIGMENTI.split('\n')) {
    yy = scrieInCaseta(c, par, x + w * 0.5, yy, w * 0.86, h, marime, '', '#3a342c');
    yy += marime * 0.75;
  }
}

/* ---------- USTENSILELE ---------- */
/* Șase unelte așezate **peste desen**, nu într-o cutie.

   Aveau o casetă albă cu chenar, ca o paletă de program de desen. Dar sala e o
   coală de hârtie, iar pe o coală uneltele stau pur și simplu puse — răsfirate,
   ușor înclinate, cum le lasă cineva care tocmai a pus mâna pe ele. Caseta le
   făcea să pară un meniu; fără ea, par la îndemână.

   Și sunt singurele lucruri **colorate** din toată sala nepictată. Asta nu e
   înfrumusețare: culoarea lor spune, fără niciun cuvânt, că ele sunt lucrurile
   cu care se aduce culoare aici. Ochiul le găsește din prima, oriunde ar fi. */
/* Culorile sunt luate de pe unelte adevărate, nu alese după gust: coadă de fag
   nelăcuit — pal, gălbui, aproape alb pe muchia luminată; virolă de alamă la
   pensulele rotunde și late; virolă de argint, cu nituri, la bidinele și la
   cuțite; păr de porc crem la pensulele de ulei, păr sintetic chihlimbariu la
   bidinele; lamă de oțel, îndoită la gât, la cuțitele de paletă.

   Le pusesem întâi cozi roșii, negre și maro-închis, ca la creioanele colorate.
   Arătau a jucărie. O unealtă de pictor e un lucru de lucru: lemn crud, metal și
   păr — iar tocmai fiindcă ea e singurul obiect colorat dintr-o sală nedesenată,
   e cu atât mai important să fie **adevărată**. */
const LEMN_UNEALTA  = '#e2cda4';   // fagul, în plină lumină
const LEMN_UMBRA8   = '#b99b6a';
const ALAMA_UNEALTA = '#d9a93c';
const ARGINT_UNEALTA = '#c5cad0';
const PAR_PORC      = '#f0e2c0';   // păr crem, la pensulele de ulei
const PAR_SINTETIC  = '#e8a13c';   // păr chihlimbariu, la bidinele
const OTEL_UNEALTA  = '#c9ced3';

/* Unde stă fiecare unealtă: locul, înclinarea și mărimea. Sunt răsfirate în
   evantai, ca niște pensule lăsate una peste alta — nu aliniate ca la raft. */
function locurileUneltelor() {
  const g = geomSala8();
  /* Uneltele își iau locul din registru: acolo sunt socotite deodată cu
     îndemnul și cu cercul, deci nu se pot călca unele pe altele. */
  const R = geomRegistru();
  const pas = R.unelteLat / USTENSILE.length;
  const x0 = R.unelteX + pas * 0.5;
  const y0 = R.unelteY;
  const inalt = R.unelteInalt;
  const locuri = [];
  /* Drepte și la aceeași înălțime, nu răsfirate în evantai. Erau înclinate, ca
     niște unelte lăsate pe masă — dar ele **nu fac parte din sală**: sunt un
     strat deasupra ei, lucrurile din mâna ta. Un lucru din decor stă cum a
     căzut; un lucru din mâna ta stă drept și la locul lui, ca să-l găsești fără
     să-l cauți. */
  for (let k = 0; k < USTENSILE.length; k++) {
    locuri.push({ x: x0 + k * pas, y: y0, unghi: 0, inalt });
  }
  return locuri;
}

function deseneazaTrusa(acum) {
  const g = geomSala8();
  const gr = Math.max(1, g.S * 0.0022);
  const locuri = locurileUneltelor();

  panoulRegistrului();
  indemnulScenei8(g, locuri);

  for (let k = 0; k < USTENSILE.length; k++) {
    const L = locuri[k];
    const aleasa = s8.unealta === k;
    ctx.save();
    ctx.translate(L.x, L.y + (aleasa ? -H * 0.028 : 0));

    /* Cea aleasă se ridică, se îndreaptă și primește sub ea o pată din culoarea
       cu care lucrezi acum. Nu un chenar: o urmă de vopsea, adică chiar lucrul
       pe care unealta îl face. */
    if (aleasa) {
      const cul = CERC_CROMATIC[s8.culoare % CERC_CROMATIC.length];
      ctx.save();
      ctx.globalAlpha = 0.85;
      /* O urmă mică, chiar sub vârful uneltei — nu o pată lată alături, care
         ieșea ca o gură roșie pusă pe podea. Ea spune două lucruri deodată: care
         unealtă e în mână și cu ce culoare lucrează. */
      pastaCuUnealta(ctx, 0, L.inalt * 0.60, L.inalt * 0.30, L.inalt * 0.10,
                     0.06, cul, USTENSILE[k].forma, USTENSILE[k].relief);
      ctx.restore();
    }
    /* Umbra nu mai cade pe podea, ci **în spatele uneltei**, ca la un lucru
       ținut deasupra imaginii. O umbră pe podea le-ar lipi de sală, exact ce nu
       trebuie: ele plutesc peste ea. */
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.shadowColor = 'rgba(40, 32, 22, 0.55)';
    ctx.shadowBlur = L.inalt * 0.10;
    ctx.shadowOffsetX = L.inalt * 0.035;
    ctx.shadowOffsetY = L.inalt * 0.045;
    ctx.fillStyle = '#3a3228';
    ctx.fillRect(-L.inalt * 0.05, -L.inalt * 0.48, L.inalt * 0.10, L.inalt * 0.96);
    ctx.restore();

    deseneazaUnealta(ctx, k, 0, 0, L.inalt, gr);
    ctx.restore();
  }
}

/* Îndemnul. Nu mai stă ca un titlu de ziar deasupra unei cutii: e scris pe o
   tușă de vopsea trasă cu bidineaua, ca și cum cineva ar fi vopsit un petic de
   perete anume ca să scrie pe el. Se potrivește cu ce cere — „lasă-ți amprenta"
   — fiindcă e chiar o amprentă.

   Scris pe două rânduri, cu al doilea mai mic: primul e invitația, al doilea
   explicația. Puse la fel, se citesc ca o singură frază lungă. */
/* Panoul de sticlă fumurie pe care stă tot registrul. E singurul lucru din
   scenă care se vede că e **deasupra** imaginii, nu în ea: translucid, cu o
   dungă de lumină pe muchia de sus și o umbră lăsată pe sală. */
function panoulRegistrului() {
  const R = geomRegistru();
  ctx.save();

  // umbra pe care o aruncă panoul pe sală
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  dreptunghi(R.x + R.lat * 0.02, R.y + R.lat * 0.02, R.lat, R.inalt, R.lat * 0.09);

  const sticla = ctx.createLinearGradient(R.x, R.y, R.x + R.lat, R.y + R.inalt);
  sticla.addColorStop(0, 'rgba(22, 30, 46, 0.86)');
  sticla.addColorStop(0.5, 'rgba(16, 24, 38, 0.80)');
  sticla.addColorStop(1, 'rgba(12, 20, 32, 0.88)');
  ctx.fillStyle = sticla;
  dreptunghi(R.x, R.y, R.lat, R.inalt, R.lat * 0.09);

  // muchia luminată de sus și de la stânga
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = Math.max(1, R.lat * 0.006);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(R.x, R.y, R.lat, R.inalt, R.lat * 0.09);
  else ctx.rect(R.x, R.y, R.lat, R.inalt);
  ctx.stroke();
  ctx.restore();
}

function indemnulScenei8(g, locuri) {
  const R = geomRegistru();
  const marimeMare = Math.max(13, Math.min(R.textLat * 0.088, g.S * 0.026));

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cx = R.textX + R.textLat * 0.5;

  /* Îndemnul stă acum pe sticla panoului, scris cu alb — nu pe o bandă de vopsea
     galbenă, cum era. Banda avea rostul ei cât timp sala era o coală albă; într-o
     sală întunecată, un dreptunghi galben în colț arată a etichetă lipită. */
  ctx.fillStyle = '#f6f1e4';
  ctx.font = `bold ${Math.round(marimeMare)}px Georgia`;
  ctx.fillText('Spațiul este pânza ta.', cx, R.textY + R.textInalt * 0.30);
  ctx.fillStyle = 'rgba(240, 232, 214, 0.78)';
  ctx.font = `italic ${Math.round(marimeMare * 0.78)}px Georgia`;
  ctx.fillText('Lasă-ți amprenta.', cx, R.textY + R.textInalt * 0.62);
  ctx.fillText('Personalizează exponatul.', cx, R.textY + R.textInalt * 0.88);

  // o linie subțire sub text, care desparte registrul în încăperi
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = Math.max(1, R.lat * 0.004);
  ctx.beginPath();
  ctx.moveTo(R.textX + R.textLat * 0.12, R.textY + R.textInalt * 1.06);
  ctx.lineTo(R.textX + R.textLat * 0.88, R.textY + R.textInalt * 1.06);
  ctx.stroke();
  ctx.restore();
}

/* O unealtă, desenată după cele adevărate: coada lungă de fag, virola, și
   capătul care lucrează. Ce le deosebește e chiar capătul — de-aia el se
   desenează cu grijă, iar coada e o dungă de lemn. */
function deseneazaUnealta(c, k, cx, cy, inalt, gr) {
  const u = USTENSILE[k % USTENSILE.length];
  const lat = inalt * 0.26;
  c.save();
  c.translate(cx, cy);

  if (u.cutit) cutitDePaleta(c, u, inalt, lat, gr);
  else pensula(c, u, inalt, lat, gr);

  c.restore();
}

/* Coada de fag: lungă, subțiată spre capătul de sus, cu o muchie luminată în
   stânga și una în umbră în dreapta. Lemnul nelăcuit n-are luciu, deci nu are
   sclipire — are doar cele două fețe. */
function coadaDeFag(c, latSus, latJos, sus, jos) {
  const lemn = c.createLinearGradient(-latJos, 0, latJos, 0);
  lemn.addColorStop(0, '#fdf6e6');
  lemn.addColorStop(0.30, LEMN_UNEALTA);
  lemn.addColorStop(1, LEMN_UMBRA8);
  c.fillStyle = lemn;
  c.beginPath();
  c.moveTo(-latSus, sus + latSus * 0.6);
  c.quadraticCurveTo(0, sus - latSus * 0.5, latSus, sus + latSus * 0.6);
  c.lineTo(latJos, jos);
  c.lineTo(-latJos, jos);
  c.closePath();
  c.fill();
}

function pensula(c, u, inalt, lat, gr) {
  const patrat = u.forma === 'patrat';
  const lata = u.gros > 0.9;                     // bidineaua
  const latVirola = lat * (0.18 + u.gros * 0.30);
  const virolaSus = inalt * 0.02, virolaJos = inalt * 0.19;

  coadaDeFag(c, lat * 0.075, latVirola * 0.92, -inalt * 0.5, virolaSus);

  /* Virola. La pensulele de ulei e de alamă și se lățește ușor spre păr; la
     bidinele e de argint, cu trei brâuri și cu nituri — exact cum se vede pe
     ele. */
  const met = c.createLinearGradient(-latVirola, 0, latVirola, 0);
  if (lata) {
    met.addColorStop(0, '#f2f5f8'); met.addColorStop(0.4, ARGINT_UNEALTA);
    met.addColorStop(1, '#7e858d');
  } else {
    met.addColorStop(0, '#fdf0c8'); met.addColorStop(0.4, ALAMA_UNEALTA);
    met.addColorStop(1, '#8a6a25');
  }
  c.fillStyle = met;
  c.beginPath();
  c.moveTo(-latVirola * 0.80, virolaSus);
  c.lineTo(latVirola * 0.80, virolaSus);
  c.lineTo(latVirola, virolaJos);
  c.lineTo(-latVirola, virolaJos);
  c.closePath();
  c.fill();
  creion(c, gr * 0.7);
  c.stroke();
  if (lata) {
    creion(c, gr * 0.55, 'rgba(70,78,86,0.8)');
    for (const q of [0.30, 0.52, 0.74]) {
      const y = intre(virolaSus, virolaJos, q);
      const l = intre(latVirola * 0.80, latVirola, q);
      c.beginPath(); c.moveTo(-l, y); c.lineTo(l, y); c.stroke();
    }
    // niturile
    c.fillStyle = '#8b939b';
    for (const q of [-0.5, 0.5]) {
      c.beginPath();
      c.arc(latVirola * q, intre(virolaSus, virolaJos, 0.62), Math.max(0.8, gr * 0.9), 0, Math.PI * 2);
      c.fill();
    }
  }

  /* Părul. Aici se vede felul uneltei: **ascuțit** se strânge într-un vârf,
     **pătrat** se termină retezat drept. Asta e chiar deosebirea care se simte
     pe perete când pictezi, deci trebuie să se vadă și în unealtă. */
  const lp = latVirola * 1.02;
  const varf = inalt * (patrat ? 0.47 : 0.54);
  const par = c.createLinearGradient(0, virolaJos, 0, varf);
  const bazaPar = lata ? PAR_SINTETIC : PAR_PORC;
  par.addColorStop(0, lata ? '#f6c882' : '#fdf6e4');
  par.addColorStop(0.55, bazaPar);
  par.addColorStop(1, lata ? '#c07a1e' : '#cbb183');
  c.fillStyle = par;
  c.beginPath();
  if (patrat) {
    c.moveTo(-latVirola * 0.96, virolaJos);
    c.lineTo(-lp, varf - inalt * 0.03);
    c.quadraticCurveTo(-lp * 0.9, varf, -lp * 0.72, varf);
    c.lineTo(lp * 0.72, varf);
    c.quadraticCurveTo(lp * 0.9, varf, lp, varf - inalt * 0.03);
    c.lineTo(latVirola * 0.96, virolaJos);
  } else {
    c.moveTo(-latVirola * 0.96, virolaJos);
    c.quadraticCurveTo(-lp * 1.05, intre(virolaJos, varf, 0.45),
                       -lp * 0.34, intre(virolaJos, varf, 0.80));
    c.quadraticCurveTo(-lp * 0.10, varf * 0.99, 0, varf);
    c.quadraticCurveTo(lp * 0.10, varf * 0.99, lp * 0.34, intre(virolaJos, varf, 0.80));
    c.quadraticCurveTo(lp * 1.05, intre(virolaJos, varf, 0.45),
                       latVirola * 0.96, virolaJos);
  }
  c.closePath();
  c.fill();
  creion(c, gr * 0.7);
  c.stroke();

  // firele de păr
  creion(c, gr * 0.45, lata ? 'rgba(150,88,16,0.55)' : 'rgba(150,128,88,0.5)');
  for (let q = 1; q < u.fire + 1; q++) {
    const t = q / (u.fire + 1);
    c.beginPath();
    c.moveTo(intre(-latVirola * 0.9, latVirola * 0.9, t), virolaJos + inalt * 0.01);
    c.lineTo(intre(-lp * 0.82, lp * 0.82, t), varf - inalt * 0.02);
    c.stroke();
  }
}

/* Cuțitul de paletă. Trei lucruri îl fac să fie el și nu un cuțit de bucătărie:
   coada în formă de picătură, **cu o gaură** la capăt; gâtul de oțel îndoit — de
   asta îi zice „cotit", și tocmai el ține degetele deasupra pastei; și lama
   subțire, în formă de mistrie. */
function cutitDePaleta(c, u, inalt, lat, gr) {
  const latCoada = lat * 0.30;
  const gatSus = -inalt * 0.06, gatJos = inalt * 0.10;

  // coada, picătură cu gaură
  const lemn = c.createLinearGradient(-latCoada, 0, latCoada, 0);
  lemn.addColorStop(0, '#fdf6e6');
  lemn.addColorStop(0.30, LEMN_UNEALTA);
  lemn.addColorStop(1, LEMN_UMBRA8);
  c.fillStyle = lemn;
  c.beginPath();
  c.moveTo(0, -inalt * 0.52);
  c.quadraticCurveTo(latCoada * 1.1, -inalt * 0.36, latCoada * 0.92, -inalt * 0.06);
  c.quadraticCurveTo(latCoada * 0.8, gatSus + inalt * 0.02, latCoada * 0.5, gatSus + inalt * 0.03);
  c.lineTo(-latCoada * 0.5, gatSus + inalt * 0.03);
  c.quadraticCurveTo(-latCoada * 0.8, gatSus + inalt * 0.02, -latCoada * 0.92, -inalt * 0.06);
  c.quadraticCurveTo(-latCoada * 1.1, -inalt * 0.36, 0, -inalt * 0.52);
  c.closePath();
  c.fill();
  creion(c, gr * 0.7);
  c.stroke();
  // gaura de agățat
  c.fillStyle = 'rgba(120, 100, 70, 0.55)';
  c.beginPath();
  c.arc(0, -inalt * 0.40, latCoada * 0.20, 0, Math.PI * 2);
  c.fill();
  creion(c, gr * 0.5, 'rgba(120,100,70,0.9)');
  c.stroke();

  // inelul de argint de la gât
  const met = c.createLinearGradient(-latCoada * 0.55, 0, latCoada * 0.55, 0);
  met.addColorStop(0, '#f2f5f8'); met.addColorStop(0.4, ARGINT_UNEALTA);
  met.addColorStop(1, '#7e858d');
  c.fillStyle = met;
  c.fillRect(-latCoada * 0.55, gatSus + inalt * 0.01, latCoada * 1.1, inalt * 0.045);
  creion(c, gr * 0.6);
  c.strokeRect(-latCoada * 0.55, gatSus + inalt * 0.01, latCoada * 1.1, inalt * 0.045);

  // gâtul îndoit
  creion(c, gr * 1.6, '#9aa1a8');
  c.beginPath();
  c.moveTo(0, gatSus + inalt * 0.055);
  c.quadraticCurveTo(lat * 0.10, gatJos - inalt * 0.01, -lat * 0.02, gatJos);
  c.stroke();

  // lama, mistrie subțire
  const latLama = lat * (0.34 + u.gros * 0.42);
  const varf = inalt * 0.52;
  const otel = c.createLinearGradient(-latLama, gatJos, latLama, varf);
  otel.addColorStop(0, '#f4f7fa');
  otel.addColorStop(0.45, OTEL_UNEALTA);
  otel.addColorStop(1, '#8d949b');
  c.fillStyle = otel;
  c.beginPath();
  c.moveTo(-lat * 0.02, gatJos);
  c.quadraticCurveTo(-latLama * 0.9, gatJos + inalt * 0.07, -latLama, gatJos + inalt * 0.14);
  c.quadraticCurveTo(-latLama * 0.6, varf, 0, varf);
  c.quadraticCurveTo(latLama * 0.6, varf, latLama, gatJos + inalt * 0.14);
  c.quadraticCurveTo(latLama * 0.9, gatJos + inalt * 0.07, -lat * 0.02, gatJos);
  c.closePath();
  c.fill();
  creion(c, gr * 0.7);
  c.stroke();
  // sclipirea de pe lamă
  c.strokeStyle = 'rgba(255,255,255,0.8)';
  c.lineWidth = Math.max(0.8, gr * 1.1);
  c.beginPath();
  c.moveTo(-latLama * 0.30, gatJos + inalt * 0.14);
  c.quadraticCurveTo(-latLama * 0.16, varf * 0.72, latLama * 0.06, varf * 0.86);
  c.stroke();
}

function deseneazaCercul(acum) {
  const g = geomSala8();
  const gr = Math.max(1, g.S * 0.0022);
  const cx = g.cercCx, cy = g.cercCy, R = g.cercR;

  ctx.save();
  for (let k = 0; k < CERC_CROMATIC.length; k++) {
    const a0 = (k / CERC_CROMATIC.length) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((k + 1) / CERC_CROMATIC.length) * Math.PI * 2 - Math.PI / 2;
    const aleasa = s8.culoare === k;
    const r = R * (aleasa ? 1.12 : 1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a0, a1);
    ctx.closePath();
    ctx.fillStyle = CERC_CROMATIC[k];
    ctx.fill();
    creion(ctx, aleasa ? gr * 2.4 : gr, aleasa ? LINIE_SALA : 'rgba(255,255,255,0.75)');
    ctx.stroke();
  }
  // golul din mijloc, în care se vede culoarea aleasă
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.34, 0, Math.PI * 2);
  ctx.fillStyle = CERC_CROMATIC[s8.culoare];
  ctx.fill();
  creion(ctx, gr * 1.6);
  ctx.stroke();
  ctx.restore();
}

/* ---------- PICĂTURILE ---------- */
/* Vopseaua e atât de groasă încât câteva picături grele se preling. Nu cad: se
   **târăsc**, cu opriri — o picătură de ulei care alunecă lin arată a apă. */
function facPicatura(x, y, culoare, lung) {
  s8.picaturi.push({
    x, y, culoare,
    lung: lung || Math.min(W, H) * (0.03 + Math.random() * 0.09),
    mers: 0, viteza: 0.00006 + Math.random() * 0.00012,
    lat: Math.min(W, H) * (0.004 + Math.random() * 0.006),
    stat: 0
  });
}

function actualizeazaPicaturile(dt) {
  for (let k = s8.picaturi.length - 1; k >= 0; k--) {
    const p = s8.picaturi[k];
    if (p.stat > 0) { p.stat -= dt; continue; }
    p.mers += p.viteza * dt * (1 + s8.diluare * 6);
    if (Math.random() < 0.004) p.stat = 200 + Math.random() * 900;
    if (p.mers >= 1) s8.picaturi.splice(k, 1);
  }
}

function deseneazaPicaturile() {
  ctx.save();
  for (const p of s8.picaturi) {
    const cap = p.y + p.lung * p.mers;
    ctx.strokeStyle = p.culoare;
    ctx.globalAlpha = (1 - p.mers * 0.4) * (1 - s8.diluare * 0.6);
    ctx.lineWidth = p.lat;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, cap);
    ctx.stroke();
    ctx.fillStyle = p.culoare;
    ctx.beginPath();
    ctx.ellipse(p.x, cap, p.lat * 0.85, p.lat * 1.25, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- TUȘA JUCĂTORULUI ---------- */
/* Se pune pe stratul ascuns, o singură dată, și rămâne acolo. Forma ei ține de
   unealta din mână: pensula lasă o urmă cu fire, cuțitul o lopată cu muchii
   drepte. Dacă toate ar lăsa aceeași pată, alegerea uneltei ar fi un decor. */
/* Conturul unei pete, după felul uneltei. `z` e zvâcnetul: aceleași numere mici
   trase la sorți din locul petei, ca să nu iasă două pete identice, dar nici să
   nu tremure de la un cadru la altul.

   — **ascuțit**: se umflă la mijloc și se subțiază în amândouă capetele, cu un
     vârf lung înainte. Așa lasă o pensulă rotundă, care are păr până la un fir.
   — **pătrat**: capete tăiate drept, laturi aproape paralele, colțuri abia
     strâmbe. Așa lasă o pensulă cu vârful retezat.
   — **cuțit**: o lopată — muchie dreaptă și lungă pe o parte, material împins
     grămadă pe cealaltă, cu colțurile ridicate. */
function traseulUneltei(c, forma, L, G, z) {
  c.beginPath();
  if (forma === 'ascutit') {
    c.moveTo(-L * (1 + z(0) * 0.1), G * (z(1) - 0.5) * 0.3);
    c.quadraticCurveTo(-L * 0.35, -G * (0.9 + z(2) * 0.35),
                       L * 0.2, -G * (0.75 + z(3) * 0.3));
    c.quadraticCurveTo(L * 0.75, -G * (0.4 + z(4) * 0.25),
                       L * (1.15 + z(5) * 0.2), G * (z(6) - 0.5) * 0.25);
    c.quadraticCurveTo(L * 0.75, G * (0.4 + z(7) * 0.25),
                       L * 0.2, G * (0.75 + z(8) * 0.3));
    c.quadraticCurveTo(-L * 0.35, G * (0.9 + z(9) * 0.35),
                       -L * (1 + z(0) * 0.1), G * (z(1) - 0.5) * 0.3);
  } else if (forma === 'patrat') {
    c.moveTo(-L, -G * (0.9 + z(0) * 0.2));
    c.lineTo(L * (0.96 + z(1) * 0.08), -G * (0.86 + z(2) * 0.24));
    c.lineTo(L * (1.0 + z(3) * 0.06), G * (0.9 + z(4) * 0.2));
    c.lineTo(-L * (0.98 + z(5) * 0.06), G * (0.86 + z(6) * 0.24));
    c.closePath();
  } else {
    c.moveTo(-L * (1 + z(0) * 0.12), -G * (0.55 + z(1) * 0.3));
    c.lineTo(L * (0.55 + z(2) * 0.25), -G * (0.95 + z(3) * 0.25));
    c.lineTo(L * (1.05 + z(4) * 0.12), -G * (0.15 + z(5) * 0.35));
    c.lineTo(L * (0.95 + z(6) * 0.15), G * (0.55 + z(7) * 0.35));
    c.lineTo(-L * (0.1 + z(8) * 0.3), G * (1.0 + z(9) * 0.25));
    c.lineTo(-L * (0.85 + z(10) * 0.2), G * (0.75 + z(11) * 0.3));
    c.closePath();
  }
}

/* O pată de pastă pusă cu o unealtă anume. E soră cu `pataDePasta` din sala
   focului, dar cu conturul ales după unealtă și cu creasta pe măsura ei. */
function pastaCuUnealta(c, x, y, lung, gros, unghi, culoare, forma, relief) {
  const L = Math.max(1, lung / 2), G = Math.max(0.6, gros / 2);
  const z = function (i) { return zvacnet(x, y, i); };

  c.save();
  c.translate(x, y);
  c.rotate(unghi);

  traseulUneltei(c, forma, L, G, z);
  c.fillStyle = culoare;
  c.fill();

  /* Creasta și umbra stau înăuntrul petei, ca să urmeze muchia ei strâmbă. Se
     fac din același contur, mutat puțin, trasat gros și tăiat la forma petei:
     din tot conturul mutat rămâne numai dunga care cade pe muchie. */
  c.save();
  traseulUneltei(c, forma, L, G, z);
  c.clip();
  c.save();
  c.translate(0, G * 0.55);
  traseulUneltei(c, forma, L, G, z);
  c.restore();
  c.strokeStyle = 'rgba(255, 255, 255, ' + (0.30 * relief).toFixed(3) + ')';
  c.lineWidth = G * 0.36;
  c.stroke();
  c.save();
  c.translate(0, -G * 0.55);
  traseulUneltei(c, forma, L, G, z);
  c.restore();
  c.strokeStyle = 'rgba(20, 12, 6, ' + (0.24 * relief).toFixed(3) + ')';
  c.lineWidth = G * 0.30;
  c.stroke();
  c.restore();

  c.restore();
}

function lasaTusa(x, y, unghi, marime, zona) {
  const c = stratul().getContext('2d');
  /* Vopseaua se pune **numai pe costum**, și numai în forma atinsă.

     Degetul căzut alături nu lasă nimic. Sala e pictată de mult, de altcineva;
     ce ai tu de făcut e exponatul. Iar o pată de pastă care trece peste conturul
     rochiei nu adaugă nimic — strică tocmai silueta, adică singurul lucru care
     ține scena laolaltă.

     Tăiat la formă, fiecare tușă se oprește unde se oprește stofa: atingi
     corsajul, culoarea rămâne în corsaj; atingi mâneca, rămâne în mânecă. Exact
     ca la o carte de colorat, și pentru același motiv — marginile sunt cele care
     fac culoarea să însemne ceva. */
  const taiat = zona !== undefined ? zona : zonaAtinsa(x, y);
  if (!taiat) return;
  c.save();
  if (taiat === 'rochie') traseulPelerinei(c); else traseulZonei(c, taiat);
  c.clip();
  const u = USTENSILE[s8.unealta % USTENSILE.length];
  const culoare = CERC_CROMATIC[s8.culoare % CERC_CROMATIC.length];

  const lung = marime * u.lung * (0.85 + Math.random() * 0.3);
  const gros = marime * u.gros * (0.85 + Math.random() * 0.3);

  c.save();
  c.globalAlpha = 1;
  pastaCuUnealta(c, x, y, lung, gros, unghi, culoare, u.forma, u.relief);

  if (u.cutit) {
    /* Cuțitul de paletă nu trage o dungă, **întinde un strat**: pe lângă lopata
       cea mare mai lasă câteva alături, împinse în lături, cu marginea
       neregulată. De-aia `pasta` e trei-patru la cuțite și unu la pensule —
       diferența de densitate se vede tocmai din câtă materie rămâne pe perete. */
    for (let k = 0; k < u.pasta; k++) {
      const q = (Math.random() - 0.5) * 0.9;
      const lateral = (Math.random() - 0.5) * gros * 0.8;
      pastaCuUnealta(c,
        x + Math.cos(unghi) * lung * q - Math.sin(unghi) * lateral,
        y + Math.sin(unghi) * lung * q + Math.cos(unghi) * lateral,
        lung * (0.55 + Math.random() * 0.55), gros * (0.55 + Math.random() * 0.6),
        unghi + (Math.random() - 0.5) * 0.35, culoare, u.forma, u.relief);
    }
  } else {
    // firele de păr: dâre subțiri de-a lungul tușei
    c.globalAlpha = 0.5;
    for (let k = -u.fire; k <= u.fire; k += 2) {
      const d = k * gros * 0.1;
      c.strokeStyle = k % 4 ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.14)';
      c.lineWidth = Math.max(0.7, gros * 0.06);
      c.beginPath();
      c.moveTo(x - Math.cos(unghi) * lung * 0.42 - Math.sin(unghi) * d,
               y - Math.sin(unghi) * lung * 0.42 + Math.cos(unghi) * d);
      c.lineTo(x + Math.cos(unghi) * lung * 0.42 - Math.sin(unghi) * d,
               y + Math.sin(unghi) * lung * 0.42 + Math.cos(unghi) * d);
      c.stroke();
    }
    c.globalAlpha = 1;
  }
  c.restore();

  s8.tuseFacute++;
  /* Cuțitul cu pastă groasă scapă mai des pe jos decât o pensulă subțire. */
  if (Math.random() < 0.25 * u.pasta) {
    facPicatura(x + (Math.random() - 0.5) * gros, y + gros * 0.4, culoare);
  }
  acoperaPelerina(x, y, Math.max(lung, gros) * 0.55);
  c.restore();
}

/* Ce ochiuri ale pelerinei a acoperit tușa. Se socotește pe rețea, nu pe pixeli. */
function acoperaPelerina(x, y, raza) {
  if (s8.acoperit >= 1) return;
  const g = geomSala8();
  if (x < g.pelCx - g.pelLat - raza || x > g.pelCx + g.pelLat + raza ||
      y < g.pelSus - raza || y > g.pelJos + raza) return;
  let atinse = 0, cate = 0, dinTotal = 0;
  for (let i = 0; i < OCHIURI_PELERINA; i++) {
    for (let j = 0; j < OCHIURI_PELERINA; j++) {
      const k = i * OCHIURI_PELERINA + j;
      const st = s8.celule[k];
      if (st === null || st === undefined) continue;
      dinTotal++;
      if (!st) {
        const o = ochiulPelerinei(i, j);
        if (Math.hypot(x - o.x, y - o.y) < raza) { s8.celule[k] = true; atinse++; }
      }
      if (s8.celule[k]) cate++;
    }
  }
  if (!atinse || !dinTotal) return;
  s8.acoperit = cate / dinTotal;
  if (audio) sunetPlescait();
}

/* ---------- TRAPA DE SUB PODIUM ---------- */
/* Când pelerina e acoperită de tot, vopseaua nu mai stă: podiumul se desface și
   culoarea se scurge în gaura de sub el.

   E singurul lucru care putea urma. Vopseaua de ulei e grea și udă; dacă pui
   destulă într-un loc, curge — iar dacă locul e un podium cu o trapă dedesubt,
   curge acolo. Iar ce e dedesubt e apă: uleiul diluat devine acuarelă, adică
   sala următoare. */
function facPerdeaua() {
  const g = geomSala8();
  const x = Math.round(g.pelCx - g.pelLat);
  const y = Math.round(g.pelSus);
  const w = Math.round(g.pelLat * 2), h = Math.round(g.pelInalt * 1.06);
  const p = document.createElement('canvas');
  p.width = Math.max(2, w); p.height = Math.max(2, h);
  const c = p.getContext('2d');
  c.drawImage(pregatesteSalaUlei(), x, y, w, h, 0, 0, w, h);
  c.drawImage(stratul(), x, y, w, h, 0, 0, w, h);
  s8.perdea = { panza: p, x, y, w, h };
}

function deseneazaTrapa(acum) {
  if (s8.scurgere <= 0) return;
  const g = geomSala8();
  const p = atenuare(Math.min(1, s8.scurgere));

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(g.podiumCx, g.podiumCy, g.podiumRx * 0.9 * p, g.podiumRy * 0.9 * p,
              0, 0, Math.PI * 2);
  ctx.save();
  ctx.clip();
  const adanc = ctx.createLinearGradient(0, g.podiumCy - g.podiumRy, 0, g.podiumCy + g.podiumRy);
  adanc.addColorStop(0, '#14100a');
  adanc.addColorStop(0.5, '#2a2016');
  adanc.addColorStop(1, '#0c0906');
  ctx.fillStyle = adanc;
  ctx.fillRect(g.podiumCx - g.podiumRx, g.podiumCy - g.podiumRy * 2,
               g.podiumRx * 2, g.podiumRy * 4);

  /* Apa de dedesubt: pete pastelate care se mișcă încet, tot mai luminoase pe
     măsură ce trapa se deschide. Ea e chiar începutul sălii a noua, văzut de
     sus, prin gaură. */
  const lumina = Math.max(0, p - 0.3) / 0.7;
  if (lumina > 0) {
    const PASTEL = ['#cfe0f0', '#dff0e2', '#f6e6c0', '#e4d6f0', '#f6c9c0'];
    for (let k = 0; k < 12; k++) {
      const a = samanta(13100 + k * 3.7), b = samanta(13170 + k * 6.1);
      const x = g.podiumCx + (a - 0.5) * g.podiumRx * 1.4 +
                Math.sin(acum * 0.0006 + k) * g.podiumRx * 0.1;
      const y = g.podiumCy + (b - 0.5) * g.podiumRy * 1.4;
      const raza = g.podiumRx * (0.14 + b * 0.24);
      const bal = ctx.createRadialGradient(x, y, 0, x, y, raza);
      const cul = PASTEL[Math.floor(a * PASTEL.length)];
      bal.addColorStop(0, cul);
      bal.addColorStop(1, cul + '00');
      ctx.globalAlpha = 0.55 * lumina;
      ctx.fillStyle = bal;
      ctx.beginPath();
      ctx.arc(x, y, raza, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  creion(ctx, Math.max(2, g.S * 0.005));
  ctx.stroke();

  /* Pelerina, cu vopseaua ta pe ea, se lasă în gaură: poza ei alunecă în jos și
     se strânge, ca o stofă trasă printr-o pâlnie. Ce curge e chiar munca ta. */
  if (s8.perdea && p < 1) {
    const pd = s8.perdea;
    const dy = Math.pow(p, 1.6) * (g.podiumCy - pd.y);
    const strans = 1 - Math.pow(p, 1.3) * 0.8;
    ctx.save();
    ctx.globalAlpha = 1 - p * 0.25;
    ctx.drawImage(pd.panza, pd.x + pd.w * (1 - strans) * 0.5, pd.y + dy,
                  pd.w * strans, pd.h * (1 - Math.pow(p, 1.5) * 0.6));
    ctx.restore();
  }

  // firele de culoare care se preling în gaură, înaintea restului
  for (let k = 0; k < 18; k++) {
    const z = samanta(13300 + k * 5.7), z2 = samanta(13360 + k * 3.9);
    const cat = Math.max(0, Math.min(1, (p - z2 * 0.3) / 0.7));
    if (cat <= 0) continue;
    const x = g.podiumCx + (z - 0.5) * g.podiumRx * 1.5;
    const de = g.podiumCy - g.podiumRy * 0.6;
    const lung = g.podiumRy * (1.2 + z2 * 2) * cat;
    ctx.strokeStyle = CERC_CROMATIC[Math.floor(z * CERC_CROMATIC.length)];
    ctx.globalAlpha = 0.9 * (1 - cat * 0.3);
    ctx.lineWidth = g.podiumRx * (0.014 + z2 * 0.03);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, de - lung * 0.2);
    ctx.lineTo(x, de + lung);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- CURSORUL ---------- */
/* Unealta din mână, desenată la vârful degetului, cu culoarea aleasă în capăt.
   Cursorul obișnuit — luminița caldă — n-ar spune nici cu ce lucrezi, nici cu ce
   culoare, adică tocmai cele două lucruri pe care le-ai ales. */
function cursorulScenei8() {
  if (stare !== 'ulei') return false;
  if (cursor.x < -100) return true;
  const g = geomSala8();
  const inalt = g.S * 0.11;

  ctx.save();
  ctx.translate(cursor.x, cursor.y);
  ctx.rotate(-0.5);
  ctx.translate(0, -inalt * 0.5);
  deseneazaUnealta(ctx, s8.unealta, 0, 0, inalt, Math.max(1.2, g.S * 0.003));
  ctx.restore();

  ctx.save();
  ctx.fillStyle = CERC_CROMATIC[s8.culoare];
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.ellipse(cursor.x, cursor.y, g.S * 0.012, g.S * 0.016, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  return true;
}

/* ---------- VAPORII DE LA INTRARE ---------- */
/* Mirosul nu se poate da printr-un ecran, dar se poate **spune** — și tocmai
   asta e gluma: un senzor olfactiv simulat, adică o etichetă de muzeu pentru
   ceva ce n-are cum să ajungă la tine. */
function deseneazaVaporii(acum) {
  if (s8.vapori <= 0.01) return;
  const g = geomSala8();
  const p = s8.vapori;
  ctx.save();
  for (let k = 0; k < 22; k++) {
    const a = samanta(11700 + k * 3.7), b = samanta(11770 + k * 5.9);
    const urcare = ((acum * (0.00004 + a * 0.00007) + b) % 1);
    const x = W * a + Math.sin(acum * 0.0006 + k) * W * 0.04;
    const y = intre(H * 1.02, H * 0.2, urcare);
    const raza = g.S * (0.06 + b * 0.12) * (0.5 + urcare);
    ctx.globalAlpha = 0.08 * p * Math.sin(Math.min(1, urcare * 1.4) * Math.PI * 0.9);
    const abur = ctx.createRadialGradient(x, y, 0, x, y, raza);
    abur.addColorStop(0, 'rgba(200, 186, 158, 0.9)');
    abur.addColorStop(1, 'rgba(200, 186, 158, 0)');
    ctx.fillStyle = abur;
    ctx.beginPath();
    ctx.arc(x, y, raza, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- VORBELE SĂLII ---------- */
function spuneScena8(text, cat, cursiv) {
  s8.vorba = { text, pana: performance.now() + (cat || 4600), cursiv: !!cursiv };
}

function deseneazaVorba8(acum) {
  if (!s8.vorba || acum > s8.vorba.pana) return;
  const g = geomSala8();
  const stinge = Math.min(1, (s8.vorba.pana - acum) / 700);
  const lat = Math.min(W * 0.46, ecran(500));
  const y = H * 0.045;

  ctx.save();
  ctx.globalAlpha = stinge * 0.94;
  ctx.fillStyle = 'rgba(255, 253, 248, 0.95)';
  ctx.fillRect(W * 0.5 - lat / 2, y - H * 0.026, lat, H * 0.058);
  creion(ctx, Math.max(1, g.S * 0.002));
  ctx.strokeRect(W * 0.5 - lat / 2, y - H * 0.026, lat, H * 0.058);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = stinge;
  textIncadrat(s8.vorba.text, W * 0.5, y - H * 0.012, lat - ecran(40), ecran(22),
               `${s8.vorba.cursiv ? 'italic' : 'bold'} ${Math.max(Math.round(ecran(11)), Math.round(g.S * 0.019))}px Georgia`,
               LINIE_SALA);
  ctx.restore();
}

/* ---------- INTRAREA ---------- */
function intraInUlei(acum) {
  s8.viata = 0; s8.trapa = 0;
  stare = 'ulei';
  s8.faza = 'intrare'; s8.t0 = acum; s8.ultimulCadru = acum;
  s8.vapori = 1; s8.unealta = 1; s8.culoare = 4;
  s8.acoperit = 0; s8.scurgere = 0; s8.perdea = null;
  s8.picaturi.length = 0; s8.tuseFacute = 0; s8.diluare = 0;
  s8.aSpusTrapa = false; s8.vorba = null; s8.ultimaTusa = 0;
  const c = stratul().getContext('2d');
  c.clearRect(0, 0, W, H);
  pregatesteSalaUlei();
  pregatesteOchiurile();
  opresteTurbina();
  opresteClipocitul();
  pornesteAtelierUlei();
  if (audio) sunetPortal();
  spuneScena8('[Senzor olfactiv simulat: Aromă densă de ulei de in, ' +
              'esență de terebentină și sicativ]', 7000, true);
}

function iesiDinUlei(acum) {
  /* Trapa duce în sala a noua, a acuarelei. Ea încă nu e făcută, așa că
     deocamdată te scoate înapoi la custode — dar drumul e croit, ca la arsură și
     ca la vârtej, și când va fi, aici se schimbă un singur rând. */
  opresteAtelierUlei();
  opresteClipocitul();
  s3.vizitat = true;
  stare = 'muzeu';
  faza3('usaDeschisa');
  s3.usa = 1; s3.chemare = 0; s3.aSunatChemarea = false;
  actiune3(acum);
  pornesteNatura(false);
}

/* ---------- CE SE ÎNTÂMPLĂ LA ATINGERE ---------- */
/* Care unealtă e sub deget. Fără casetă nu mai există un dreptunghi în care să
   cazi, așa că se caută cea mai apropiată — dar numai dacă degetul e destul de
   aproape de ea. Altfel, orice atingere din colțul din stânga sus ar schimba
   pensula fără să vrei, chiar când voiai să pictezi acolo. */
function peTrusa(x, y) {
  const locuri = locurileUneltelor();
  let cea = -1, ceaMai = Infinity;
  for (let k = 0; k < locuri.length; k++) {
    const L = locuri[k];
    const dx = x - L.x, dy = y - L.y;
    // unealta e înaltă și îngustă: cercul de prindere se turtește pe lățime
    const d = Math.hypot(dx / (L.inalt * 0.22), dy / (L.inalt * 0.58));
    if (d < ceaMai) { ceaMai = d; cea = k; }
  }
  return ceaMai <= 1 ? cea : -1;
}

function peCerc(x, y) {
  const g = geomSala8();
  if (Math.hypot(x - g.cercCx, y - g.cercCy) > g.cercR * 1.14) return -1;
  let a = Math.atan2(y - g.cercCy, x - g.cercCx) + Math.PI / 2;
  while (a < 0) a += Math.PI * 2;
  return Math.floor((a / (Math.PI * 2)) * CERC_CROMATIC.length) % CERC_CROMATIC.length;
}

function click8(acum) {
  const x = cursor.x, y = cursor.y;
  if (s8.faza === 'scurgere' || s8.faza === 'diluare' || s8.faza === 'iesire') return;

  const u = peTrusa(x, y);
  if (u >= 0) {
    s8.unealta = u;
    if (audio) sunetCleios();
    /* Aici scria „Ai luat: pensulă subțire cu vârf ascuțit". Nu mai scrie:
       unealta aleasă se ridică din rând, se îndreaptă și primește sub ea o urmă
       din culoarea ta — se vede că ai luat-o, și se vede și care e. Un rând de
       text care spune ce tocmai ai văzut cu ochii nu adaugă nimic; îți ia doar
       privirea de pe treabă. */
    return;
  }
  const k = peCerc(x, y);
  if (k >= 0) {
    s8.culoare = k;
    if (audio) sunetPlescait();
    return;
  }

  /* Oriunde altundeva: pui pastă. Peste tot, nu numai pe pelerină — sala e a ta,
     iar dacă vopseaua s-ar prinde doar pe exponat, „spațiul este pânza ta" ar fi
     o vorbă goală. Numai că acoperirea se socotește pe pelerină: ea e lucrarea
     neterminată, iar restul e al tău. */
  puneTusa(x, y, acum);
}

function puneTusa(x, y, acum) {
  const g = geomSala8();
  const unghi = (samanta(Math.round(x) * 3.1 + Math.round(y) * 7.7) - 0.5) * 3.14;
  lasaTusa(x, y, unghi, g.S * 0.055);
  s8.ultimaTusa = acum;
  if (audio) {
    if (s8.tuseFacute % 3 === 0) sunetSlosh(); else sunetCleios();
  }
  if (s8.faza === 'intrare') { s8.faza = 'pictezi'; s8.t0 = acum; }
}

/* Mâna trasă cu butonul apăsat: dâra continuă. Fără ea, „lasă-ți amprenta" ar fi
   însemnat o sută de clicuri — o corvoadă, nu o libertate. */
function pensuleazaScena8() {
  if (stare !== 'ulei' || !cursor.apasat) return;
  if (s8.faza === 'scurgere' || s8.faza === 'diluare' || s8.faza === 'iesire') return;
  const acum = performance.now();
  if (acum - s8.ultimaTusa < 45) return;
  if (peTrusa(cursor.x, cursor.y) >= 0 || peCerc(cursor.x, cursor.y) >= 0) return;
  puneTusa(cursor.x, cursor.y, acum);
}

/* ---------- CEASUL SCENEI ---------- */
function actualizeazaUleiul(acum) {
  const dt = Math.max(0, Math.min(100, acum - (s8.ultimulCadru || acum)));
  s8.ultimulCadru = acum;
  tinePicaturileDeUlei();
  tineClipocitul();
  actualizeazaPicaturile(dt);
  s8.vapori = Math.max(0.1, s8.vapori - dt / 9000);

  if (s8.faza === 'pictezi') {
    if (s8.acoperit >= 1) {
      /* Rochia e gata. Ce urmează nu mai e despre vopsea, ci despre ce ai făcut
         cu ea: **manechinul prinde viață și pleacă**.

         Înainte, în clipa aia se deschidea direct trapa și culoarea se scurgea —
         adică lucrarea abia terminată dispărea ca o apă murdară. Acum întâi
         pleacă purtându-și rochia, și abia pe urmă se deschide drumul. E o
         deosebire mică în cod și mare în înțeles: ce ai pictat nu se scurge, ci
         se ridică și pleacă în lume. */
      s8.faza = 'viata'; s8.t0 = acum; s8.viata = 0.001;
      if (audio) { sunetDescoperire(); }
      spuneScena8('A prins viață.', 3800);
    } else if (!s8.aSpusTrapa && s8.tuseFacute === 12) {
      s8.aSpusTrapa = true;
      spuneScena8('Acoperă pelerina de tot: ea e lucrarea neterminată.', 6000);
    }
  }

  /* Manechinul se ridică de pe podium și se destramă în lumină. Nu iese pe o
     ușă: sala n-are ușă, și nici n-ar avea rost — el pleacă din **expunere**, nu
     din cameră. Un exponat care prinde viață nu umblă, se dezleagă. */
  if (s8.faza === 'viata') {
    s8.viata = Math.min(1, s8.viata + dt / 3200);
    if (s8.viata >= 1) {
      s8.faza = 'trapa'; s8.t0 = acum; s8.trapa = 0.001;
      if (audio) sunetPortal();
    }
  }

  /* Capacul rotund al podiumului se deschide. Podiumul era plin; acum se
     descoperă că era o gură. */
  if (s8.faza === 'trapa') {
    s8.trapa = Math.min(1, s8.trapa + dt / 2400);
    if (s8.trapa >= 1) {
      facPerdeaua();
      s8.faza = 'scurgere'; s8.t0 = acum; s8.scurgere = 0.001;
      if (audio) { sunetSlosh(); sunetPlescait(); }
    }
  }

  if (s8.faza === 'scurgere') {
    s8.scurgere = Math.min(1, s8.scurgere + dt / 3400);
    if (Math.random() < dt / 80) {
      const g = geomSala8();
      facPicatura(g.podiumCx + (Math.random() - 0.5) * g.podiumRx * 1.6, g.podiumCy,
                  CERC_CROMATIC[Math.floor(Math.random() * CERC_CROMATIC.length)],
                  g.S * (0.02 + Math.random() * 0.05));
    }
    if (s8.scurgere >= 1) {
      s8.faza = 'diluare'; s8.t0 = acum;
      if (audio) { opresteAtelierUlei(); pornesteClipocitul(); }
      /* Aici nu se mai scrie nimic. Culoarea curge prin trapă, se aude apa, iar
         imaginea se înmoaie sub ochii tăi — un rând care ar spune „cobori în apă,
         culorile se desfac" ar traduce în cuvinte exact lucrul pe care tocmai îl
         vezi întâmplându-se. Ce se poate arăta nu se scrie. */
    }
  }

  if (s8.faza === 'diluare') {
    s8.diluare = Math.min(1, s8.diluare + dt / 4200);
    if (s8.diluare >= 1) { s8.faza = 'iesire'; s8.t0 = acum; }
  }
  if (s8.faza === 'iesire' && acum - s8.t0 > 900) iesiDinUlei(acum);
}

/* Locul de pe podium de unde a plecat exponatul: se acoperă cu fondul sălii și
   cu discul, ca și cum rochia n-ar fi fost niciodată acolo. */
function stergeExponatulDeJos(g) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(g.pelCx - g.pelLat * 1.6, g.pelSus - g.pelInalt * 0.5,
           g.pelLat * 3.2, g.pelInalt * 1.6);
  ctx.clip();
  fondulSalii(ctx, g);
  disculDinSpate(ctx, g);
  conulDeLumina(ctx, g);
  ctx.restore();
}

/* Scânteile despletirii: exponatul nu dispare, se desface în puncte de lumină
   care urcă. Punctul e cu ce a început toată jucăria — e drept ca tot ce a fost
   pictat aici să se întoarcă în puncte. */
function scanteileDespletirii(acum) {
  const g = geomSala8();
  const p = Math.min(1, s8.viata);
  ctx.save();
  for (let k = 0; k < 90; k++) {
    const a = samanta(4700 + k * 3.1), b = samanta(4760 + k * 7.7);
    const cat = Math.max(0, Math.min(1, (p - a * 0.45) / 0.55));
    if (cat <= 0) continue;
    const x = g.pelCx + (b - 0.5) * g.pelLat * 2.1 * (0.3 + a);
    const y0 = g.pelSus + g.pelInalt * (0.1 + b * 0.9);
    const y = y0 - H * 0.55 * cat * cat - H * 0.42 * p * p;
    ctx.globalAlpha = (1 - cat) * 0.85;
    ctx.fillStyle = CERC_CROMATIC[Math.floor(a * CERC_CROMATIC.length) % CERC_CROMATIC.length];
    ctx.beginPath();
    ctx.arc(x + Math.sin(acum * 0.002 + k) * g.S * 0.006, y,
            Math.max(0.8, g.S * 0.006 * (1 - cat * 0.5)), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------- DILUAREA ---------- */
/* Sfârșitul scenei, și puntea spre acuarelă. Marginile dure ale tușelor se
   înmoaie, culorile se lasă în apă și se răspândesc una într-alta.

   Se face cu o singură unealtă: pânza pictată se micșorează pe o pânză de lucru
   și se întinde la loc. Fiecare trecere pierde muchiile — asta **e** înmuierea,
   nu o imitație a ei. */
const panzaDiluata = { panza: null, latime: 0, inaltime: 0 };

function deseneazaDiluarea(acum) {
  const p = atenuare(Math.min(1, s8.diluare));
  const lw = Math.max(2, Math.round(W / (1 + p * 22)));
  const lh = Math.max(2, Math.round(H / (1 + p * 22)));
  const q = panzaDeLucru(panzaDiluata, lw, lh);
  const qc = q.getContext('2d');
  qc.clearRect(0, 0, lw, lh);
  qc.drawImage(stratul(), 0, 0, lw, lh);

  ctx.save();
  ctx.drawImage(q, 0, 0, W, H);

  const PASTEL = ['#f6c9c0', '#cfe0f0', '#dff0e2', '#f6e6c0', '#e4d6f0'];
  for (let k = 0; k < 26; k++) {
    const a = samanta(11900 + k * 3.7), b = samanta(11970 + k * 6.1);
    const e = samanta(12030 + k * 4.3);
    const x = W * a + Math.sin(acum * 0.0004 + k) * W * 0.05 * p;
    const y = H * b + Math.cos(acum * 0.0003 + k * 1.7) * H * 0.05 * p;
    const raza = Math.min(W, H) * (0.1 + e * 0.3) * (0.3 + p);
    const bal = ctx.createRadialGradient(x, y, 0, x, y, raza);
    const cul = PASTEL[Math.floor(e * PASTEL.length)];
    bal.addColorStop(0, cul);
    bal.addColorStop(1, cul + '00');
    ctx.globalAlpha = 0.16 * p;
    ctx.fillStyle = bal;
    ctx.beginPath();
    ctx.arc(x, y, raza, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = Math.pow(p, 2.2) * 0.9;
  ctx.fillStyle = '#f4f1e8';
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- DESENUL ---------- */
function deseneazaScena8(t, acum) {
  const g = geomSala8();

  ctx.drawImage(pregatesteSalaUlei(), 0, 0);

  /* Cât timp manechinul se ridică, rochia din ștampilă trebuie ștearsă de pe
     podium și desenată din nou, mai sus. Ștampila e o singură imagine: nu se
     poate mișca o bucată din ea, deci se acoperă locul cu sala goală și se
     redesenează exponatul unde a ajuns. */
  if (s8.viata > 0 && s8.faza !== 'diluare' && s8.faza !== 'iesire') {
    stergeExponatulDeJos(g);
    const p = atenuare(Math.min(1, s8.viata));
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - p * 1.15);
    ctx.translate(0, -H * 0.42 * p * p);
    ctx.translate(g.pelCx, g.pelSus);
    ctx.scale(1 + p * 0.06, 1 + p * 0.10);
    ctx.translate(-g.pelCx, -g.pelSus);
    pelerinaInLinie(ctx, g, Math.max(1, g.S * 0.0022));
    ctx.restore();
  }

  if (s8.faza === 'diluare' || s8.faza === 'iesire') {
    deseneazaDiluarea(acum);
  } else {
    /* Ce a pictat jucătorul, peste desenul în linie. Când manechinul prinde
       viață, stratul lui se ridică odată cu el și se stinge — pictura pleacă
       împreună cu rochia, fiindcă ea **e** rochia. */
    ctx.save();
    if (s8.viata > 0) {
      const p = atenuare(Math.min(1, s8.viata));
      ctx.globalAlpha = Math.max(0, 1 - p * 1.15);
      ctx.translate(0, -H * 0.42 * p * p);
      ctx.translate(g.pelCx, g.pelSus);
      ctx.scale(1 + p * 0.06, 1 + p * 0.10);
      ctx.translate(-g.pelCx, -g.pelSus);
    }
    ctx.drawImage(stratul(), 0, 0);
    ctx.restore();
    if (s8.viata > 0) scanteileDespletirii(acum);
    deseneazaTrapa(acum);
    deseneazaPicaturile();
    deseneazaTrusa(acum);
    deseneazaCercul(acum);
  }

  deseneazaVaporii(acum);
  deseneazaVorba8(acum);

  /* Cât din pelerină ai acoperit — o bară subțire sub podium. Fără ea, „acoperă
     pelerina" e o poruncă fără răspuns: colorezi și nu știi cât mai ai. */
  if (s8.faza === 'pictezi' && s8.tuseFacute > 3) {
    const lat = g.podiumRx * 1.4, x = g.podiumCx - lat / 2, y = H * 0.965;
    ctx.save();
    ctx.fillStyle = 'rgba(40, 36, 30, 0.12)';
    ctx.fillRect(x, y, lat, H * 0.012);
    ctx.fillStyle = CERC_CROMATIC[s8.culoare];
    ctx.fillRect(x, y, lat * s8.acoperit, H * 0.012);
    creion(ctx, Math.max(1, g.S * 0.0018));
    ctx.strokeRect(x, y, lat, H * 0.012);
    ctx.restore();
  }
}
