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
  faza: 'intrare',      // intrare → pictezi → scurgere → diluare → iesire
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

function geomSala8() {
  const S = Math.min(W, H);
  const podea = H * 0.62;                  // unde peretele din fund atinge podeaua
  const cornisa = H * 0.14;                // tavanul

  // podiumul rotund din mijloc, văzut în perspectivă
  const podiumCx = W * 0.5, podiumCy = H * 0.855;
  const podiumRx = Math.min(W * 0.20, H * 0.29), podiumRy = podiumRx * 0.27;

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
  /* Mai mare decât înainte. Rochia e exponatul: ea trebuie să umple firida, nu
     să stea sfioasă în mijlocul ei. Iar cu cât e mai mare, cu atât despărțiturile
     ei — corsaj, mâneci, jupă — sunt suprafețe pe care chiar ai loc să pictezi. */
  const pelLat = podiumRx * 0.72;
  const pelSus = H * 0.235;
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
    cercCx: W * 0.028 + trusaLat * 0.5,
    /* Cercul cromatic sus, uneltele dedesubt. Invers — uneltele deasupra — cozile
       lor lungi ajungeau peste îndemn, iar colțul se citea de-a valma. Așa, se
       citește de sus în jos ca o frază: ce ai de făcut, cu ce culoare, cu ce
       unealtă. */
    cercCy: H * 0.305,
    cercR,

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

function pictezaSalaUlei(c) {
  const g = geomSala8();
  const gr = Math.max(1, g.S * 0.0022);

  /* Peretele, de sus până la podea: piatră caldă, mai luminată în mijloc, unde
     cade lumina din luminator, și mai închisă spre colțuri. Lumina care se
     termină e tot ce trebuie ca o suprafață plată să pară o cameră. */
  const zid = c.createRadialGradient(W * 0.5, g.podea * 0.55, g.S * 0.1,
                                     W * 0.5, g.podea * 0.55, Math.max(W, H) * 0.72);
  zid.addColorStop(0, PIATRA_LUMINA);
  zid.addColorStop(0.45, PIATRA_PERETE);
  zid.addColorStop(1, PIATRA_UMBRA);
  c.fillStyle = zid;
  c.fillRect(0, 0, W, H);

  /* Fără vitrine pe laturi. Stăteau acolo ca să spună „ești într-un muzeu", dar
     colțul din stânga e al trusei de ustensile și cel din dreapta al fișei de
     sală — iar o vitrină pe jumătate acoperită de o cutie cu pensule nu mai
     spune nimic, doar încarcă. Sala o spune și singură: luminator, coloană cu
     capitel, aplice, cordoane. */
  peretiiSalii(c, g, gr);
  podiumulCuFunii(c, g, gr);
  pastaPesteSala(c, g, gr);
  pelerinaInLinie(c, g, gr);
  fisaDeSala8(c, g, gr);
}

/* Stratul gros, pus peste sala deja colorată. Culorile plate de dedesubt rămân
   ca fond — ele dau lumina generală a camerei — iar peste ele vin lespezile, cu
   direcția fiecărei zone: orizontale pe perete, fugind spre punctul de fugă pe
   podea și pe tavan, verticale pe coloană, urmând bolta în firidă.

   Direcția e tot ce ține forma. Împrăștiate la întâmplare peste toată sala,
   lespezile ar fi făcut o zloată colorată; urmând fiecare planul pe care stă,
   ele **construiesc** camera, așa cum construiesc floarea în tabloul cu
   floarea-soarelui: fiecare petală e o lespede pusă pe direcția petalei. */
function pastaPesteSala(c, g, gr) {
  const sus = g.cornisa + H * 0.026;
  const lambriu = g.podea - H * 0.055;
  const S = g.S;

  // ---- tavanul: lespezi care fug spre fundul sălii ----
  c.save();
  c.beginPath();
  c.rect(-W * 0.2, -H * 0.05, W * 1.4, g.cornisa + H * 0.05);
  c.clip();
  /* Tavanul cere mâna cea mai ușoară din toată sala. Cu lespezi multe și albe se
     făcea o zăpadă în care nu se mai vedea nici luminatorul, nici grinzile — iar
     tavanul e tocmai partea la care nu trebuie să te uiți: el dă lumina, atât.
     Puține, potolite, și toate pe direcția fugii. */
  campDePasta(c, -W * 0.1, -H * 0.04, W * 1.2, g.cornisa + H * 0.04, 150,
              0, 1.1, S * 0.055, S * 0.0075,
              ['#e4ebef', '#dde5eb', '#e9eef1', '#d8e0e6'], 900);
  c.restore();

  // ---- peretele: lespezi lungi, culcate ----
  c.save();
  c.beginPath();
  c.rect(0, g.cornisa, W, lambriu - g.cornisa);
  c.clip();
  campDePasta(c, -W * 0.03, g.cornisa - H * 0.01, W * 1.06, lambriu - g.cornisa + H * 0.02,
              560, -0.05, 0.35, S * 0.062, S * 0.0095,
              [PIATRA_PERETE, PIATRA_LUMINA, '#e2dac8', '#d5ccb8', '#e9e2d1'], 1200);
  c.restore();

  // ---- firida: lespezi care urmează bolta, mai închise ----
  const fx = W * 0.5, fw = latimeaFiridei();
  const fSus = sus + H * 0.045;
  c.save();
  c.beginPath();
  c.moveTo(fx - fw / 2, g.podea);
  c.lineTo(fx - fw / 2, fSus + fw * 0.46);
  c.quadraticCurveTo(fx - fw / 2, fSus, fx, fSus);
  c.quadraticCurveTo(fx + fw / 2, fSus, fx + fw / 2, fSus + fw * 0.46);
  c.lineTo(fx + fw / 2, g.podea);
  c.closePath();
  c.clip();
  campDePasta(c, fx - fw * 0.55, fSus - H * 0.01, fw * 1.1, g.podea - fSus + H * 0.02,
              280, 1.5708, 0.7, S * 0.05, S * 0.0085,
              [FIRIDA_FUND, '#a1947e', '#ac9f88', '#948872'], 1500);
  c.restore();

  // ---- lambriul: o bandă de lespezi înguste, culcate ----
  c.save();
  c.beginPath();
  c.rect(0, lambriu, W, g.podea - lambriu);
  c.clip();
  campDePasta(c, -W * 0.02, lambriu - H * 0.004, W * 1.04, g.podea - lambriu + H * 0.008,
              200, 0, 0.2, S * 0.058, S * 0.0075,
              [PIATRA_SOCLU, '#9a8e79', '#847a68', '#a99d86'], 1700);
  c.restore();

  // ---- podeaua: lespezi care fug spre punctul de fugă ----
  c.save();
  c.beginPath();
  c.rect(0, g.podea, W, H - g.podea);
  c.clip();
  for (let k = 0; k < 520; k++) {
    const a = samanta(1900 + k * 3.1), b = samanta(1960 + k * 7.7);
    const x = W * (a * 1.2 - 0.1), y = intre(g.podea, H * 1.02, Math.pow(b, 1.5));
    // cu cât e mai în față, cu atât lespedea e mai mare
    const departare = (y - g.podea) / Math.max(1, H - g.podea);
    const unghi = Math.atan2(H * 1.3 - y, W * 0.5 - x) + Math.PI / 2;
    lespedeDePasta(c, x, y,
                   S * (0.035 + departare * 0.055), S * (0.006 + departare * 0.010),
                   unghi + (a - 0.5) * 0.35,
                   ['#d6cdba', '#cdc4b0', '#dfd8c6', '#c6bda9'][k % 4],
                   1900 + k);
  }
  c.restore();

  // ---- podiumul: lespezi care urmează rotundul lui ----
  c.save();
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy, g.podiumRx, g.podiumRy, 0, 0, Math.PI * 2);
  c.rect(g.podiumCx - g.podiumRx, g.podiumCy, g.podiumRx * 2, H * 0.05);
  c.clip();
  for (let k = 0; k < 240; k++) {
    const a = samanta(2200 + k * 3.7), b = samanta(2260 + k * 5.9);
    const ang = a * Math.PI * 2, raza = Math.sqrt(b);
    const x = g.podiumCx + Math.cos(ang) * g.podiumRx * raza;
    const y = g.podiumCy + Math.sin(ang) * g.podiumRy * raza + (b > 0.9 ? H * 0.02 : 0);
    lespedeDePasta(c, x, y, S * 0.032, S * 0.006, ang + Math.PI / 2,
                   ['#a19682', '#948a78', '#a99e89', '#877d6c'][k % 4], 2200 + k);
  }
  c.restore();

  // ---- coloanele: lespezi verticale, ca fusul să rămână rotund ----
  const col = coloaneleIntrarii();
  let sam = 2400;
  for (const cxc of [col.stanga, col.dreapta]) {
    c.save();
    c.beginPath();
    c.rect(cxc - col.lat * 0.75, g.cornisa, col.lat * 1.5, g.podea - g.cornisa);
    c.clip();
    campDePasta(c, cxc - col.lat * 0.75, g.cornisa, col.lat * 1.5, g.podea - g.cornisa,
                150, 1.5708, 0.14, S * 0.040, S * 0.0060,
                [PIATRA_LUMINA, PIATRA_PERETE, '#b5aa95', '#f0e9da'], sam);
    c.restore();
    sam += 400;
  }

  contururileSalii(c, g, gr);

  /* Coloanele și aplicele, peste pastă: ele sunt lucruri **în** cameră, nu
     zugrăveala ei. Pasta e peretele; ele stau în fața lui. */
  coloanaCorintica(c, col.stanga, g.cornisa, g.podea, col.lat, gr);
  coloanaCorintica(c, col.dreapta, g.cornisa, g.podea, col.lat, gr);
  apliceleDePerete(c, g, gr);
}

/* Conturul sălii, tras din nou peste pastă. Fără el, lespezile îngroapă
   arhitectura: rămâne o zloată frumoasă în care nu se mai vede unde se termină
   peretele și unde începe podeaua.

   Așa lucrează și pictorii din fotografii: pasta e groasă, dar desenul de
   dedesubt se mai vede pe alocuri, iar acolo unde nu se vede, marginile dintre
   două culori îl țin locului. Aici facem amândouă. */
function contururileSalii(c, g, gr) {
  // luminatorul, tras din nou peste pastă, ca să nu se piardă în ea
  tavanulCuLuminator(c, g, gr, true);

  const sus = g.cornisa + H * 0.026;
  const lambriu = g.podea - H * 0.055;
  const fx = W * 0.5, fw = latimeaFiridei();
  const fSus = sus + H * 0.045;

  c.save();
  c.globalAlpha = 0.55;
  creion(c, gr * 1.4);
  c.beginPath();
  c.moveTo(0, g.cornisa); c.lineTo(W, g.cornisa);
  c.moveTo(0, lambriu);   c.lineTo(W, lambriu);
  c.moveTo(0, g.podea);   c.lineTo(W, g.podea);
  c.stroke();

  // arcada firidei
  creion(c, gr * 1.5);
  c.beginPath();
  c.moveTo(fx - fw / 2, g.podea);
  c.lineTo(fx - fw / 2, fSus + fw * 0.46);
  c.quadraticCurveTo(fx - fw / 2, fSus, fx, fSus);
  c.quadraticCurveTo(fx + fw / 2, fSus, fx + fw / 2, fSus + fw * 0.46);
  c.lineTo(fx + fw / 2, g.podea);
  c.stroke();

  // muchiile celor două coloane
  const col = coloaneleIntrarii();
  creion(c, gr * 1.1);
  for (const cxc of [col.stanga, col.dreapta]) {
    c.beginPath();
    c.moveTo(cxc - col.lat * 0.50, g.podea - col.lat * 0.46);
    c.lineTo(cxc - col.lat * 0.40, g.cornisa + col.lat * 1.30);
    c.moveTo(cxc + col.lat * 0.50, g.podea - col.lat * 0.46);
    c.lineTo(cxc + col.lat * 0.40, g.cornisa + col.lat * 1.30);
    c.stroke();
  }

  // conturul podiumului
  creion(c, gr * 1.3);
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy, g.podiumRx, g.podiumRy, 0, 0, Math.PI * 2);
  c.stroke();
  c.restore();
}

/* Sala, în linie: tavanul cu luminator, peretele din fund cu firidă, panouri,
   coloană cu capitel corintic și o ușă în dreapta; aplicele; podeaua cu dale.

   Totul e desenat numai cu creionul, fără nicio umplere — sala e o coală
   nepictată, și tocmai de-aia jucătorul simte că are voie să pună culoare pe ea.
   O sală deja colorată n-ar cere nimic nimănui. */
function peretiiSalii(c, g, gr) {
  tavanulCuLuminator(c, g, gr);
  peretulDinFund(c, g, gr);
  podeaDeDale(c, g, gr);
}

/* Tavanul. Un luminator mare de sticlă în mijloc, prins într-o ramă de grinzi
   care fug spre fundul sălii.

   Perspectiva se face din două linii: marginea din față a tavanului, largă și
   ieșită din cadru, și cea din fund, strânsă. Tot ce e între ele se interpolează
   — grinzile, ochiurile de sticlă, casetele de pe margini. Desenate una câte una,
   după ochi, ar fi ieșit un tavan care nu se închide nicăieri. */
/* `numaiLinii` cere doar desenul, fără culorile de dedesubt: așa se poate trage
   luminatorul a doua oară, peste pastă, fără să acopere pasta cu tăblia lui. */
function tavanulCuLuminator(c, g, gr, numaiLinii) {
  const yFata = -H * 0.03, yFund = g.cornisa;
  const fata0 = -W * 0.16, fata1 = W * 1.16;      // marginea din față, lată
  const fund0 = W * 0.10,  fund1 = W * 0.90;      // marginea din fund, strânsă

  // unde cade coloana `u` (0..1) la o adâncime `v` (0 = față, 1 = fund)
  function x(u, v) { return intre(intre(fata0, fata1, u), intre(fund0, fund1, u), v); }
  function y(v) { return intre(yFata, yFund, v); }

  if (numaiLinii) c.save();
  if (numaiLinii) c.globalAlpha = 0.62;

  // tăblia tavanului, mai rece decât peretele
  if (!numaiLinii) {
  c.fillStyle = TAVAN_GRINDA;
  c.beginPath();
  c.moveTo(fata0, y(0)); c.lineTo(fata1, y(0));
  c.lineTo(fund1, y(1)); c.lineTo(fund0, y(1));
  c.closePath();
  c.fill();

  /* Sticla luminatorului: lumina zilei, rece, care cade în mijlocul sălii. E
     singurul rece din toată camera — de-aia se simte ca lumină, nu ca vopsea. */
  const sticla = c.createLinearGradient(0, y(0), 0, y(1));
  sticla.addColorStop(0, '#f4f9fb');
  sticla.addColorStop(1, TAVAN_STICLA);
  c.fillStyle = sticla;
  c.beginPath();
  c.moveTo(x(0.22, 0.06), y(0.06));
  c.lineTo(x(0.78, 0.06), y(0.06));
  c.lineTo(x(0.78, 0.88), y(0.88));
  c.lineTo(x(0.22, 0.88), y(0.88));
  c.closePath();
  c.fill();
  }

  // grinzile care fug spre fund
  creion(c, gr * 1.1);
  for (const u of [0.06, 0.22, 0.78, 0.94]) {
    c.beginPath();
    c.moveTo(x(u, 0), y(0));
    c.lineTo(x(u, 1), y(1));
    c.stroke();
  }
  // traversele
  for (const v of [0.30, 0.62, 0.86]) {
    c.beginPath();
    c.moveTo(x(0.02, v), y(v));
    c.lineTo(x(0.98, v), y(v));
    c.stroke();
  }

  /* Luminatorul: dreptunghiul dintre grinzile din mijloc, împărțit în ochiuri de
     sticlă. Ochiurile se strâng spre fund odată cu tot tavanul — de-aia se scot
     din aceleași două funcții, nu dintr-o grilă dreaptă. */
  creion(c, gr * 1.4);
  c.beginPath();
  c.moveTo(x(0.22, 0.06), y(0.06));
  c.lineTo(x(0.78, 0.06), y(0.06));
  c.lineTo(x(0.78, 0.88), y(0.88));
  c.lineTo(x(0.22, 0.88), y(0.88));
  c.closePath();
  c.stroke();

  creion(c, gr * 0.7, LINIE_SUBTIRE);
  for (let k = 1; k < 7; k++) {
    const u = intre(0.22, 0.78, k / 7);
    c.beginPath();
    c.moveTo(x(u, 0.06), y(0.06));
    c.lineTo(x(u, 0.88), y(0.88));
    c.stroke();
  }
  for (let k = 1; k < 5; k++) {
    const v = intre(0.06, 0.88, Math.pow(k / 5, 1.25));
    c.beginPath();
    c.moveTo(x(0.22, v), y(v));
    c.lineTo(x(0.78, v), y(v));
    c.stroke();
  }

  // cornișa: trei brâuri paralele, ca la orice sală cu stuc
  creion(c, gr * 1.5);
  c.beginPath();
  c.moveTo(0, g.cornisa); c.lineTo(W, g.cornisa);
  c.stroke();
  creion(c, gr * 0.9);
  for (const dy of [H * 0.012, H * 0.024]) {
    c.beginPath();
    c.moveTo(0, g.cornisa + dy); c.lineTo(W, g.cornisa + dy);
    c.stroke();
  }
  if (numaiLinii) c.restore();
}

/* Peretele din fund: firida cu pelerina în mijloc, panouri înalte de-o parte și
   de alta, o coloană cu capitel corintic la dreapta firidei, o ușă în capătul
   din dreapta, și lambriul care leagă totul jos. */
function peretulDinFund(c, g, gr) {
  const sus = g.cornisa + H * 0.026, jos = g.podea;
  const lambriu = jos - H * 0.055;

  creion(c, gr * 1.6);
  c.beginPath();
  c.moveTo(0, jos); c.lineTo(W, jos);
  c.stroke();
  // lambriul de jos, o bandă de piatră mai închisă
  c.fillStyle = PIATRA_SOCLU;
  c.fillRect(0, lambriu, W, jos - lambriu);
  c.fillStyle = 'rgba(255, 250, 236, 0.35)';
  c.fillRect(0, lambriu, W, (jos - lambriu) * 0.16);
  creion(c, gr * 1.1);
  c.beginPath();
  c.moveTo(0, lambriu); c.lineTo(W, lambriu);
  c.stroke();

  /* Firida: o arcadă adâncă în perete, în care stă exponatul. Ea spune „aici e
     lucrarea" fără nicio săgeată — un obiect așezat într-o firidă e, prin însuși
     locul lui, un obiect arătat. */
  const fx = W * 0.5, fw = latimeaFiridei();
  const fSus = sus + H * 0.045;

  /* Adâncul firidei, umplut cu o piatră mai închisă. El e fondul pe care stă
     pelerina albă — iar un alb pus pe alb nu se vede. */
  const adanc = c.createLinearGradient(0, fSus, 0, jos);
  adanc.addColorStop(0, '#8f8371');
  adanc.addColorStop(0.55, FIRIDA_FUND);
  adanc.addColorStop(1, '#9d917b');
  c.fillStyle = adanc;
  c.beginPath();
  c.moveTo(fx - fw / 2, jos);
  c.lineTo(fx - fw / 2, fSus + fw * 0.46);
  c.quadraticCurveTo(fx - fw / 2, fSus, fx, fSus);
  c.quadraticCurveTo(fx + fw / 2, fSus, fx + fw / 2, fSus + fw * 0.46);
  c.lineTo(fx + fw / 2, jos);
  c.closePath();
  c.fill();

  creion(c, gr * 1.5);
  c.beginPath();
  c.moveTo(fx - fw / 2, jos);
  c.lineTo(fx - fw / 2, fSus + fw * 0.46);
  c.quadraticCurveTo(fx - fw / 2, fSus, fx, fSus);
  c.quadraticCurveTo(fx + fw / 2, fSus, fx + fw / 2, fSus + fw * 0.46);
  c.lineTo(fx + fw / 2, jos);
  c.stroke();
  // conturul dinăuntru, care dă grosimea zidului
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  c.beginPath();
  c.moveTo(fx - fw * 0.43, jos);
  c.lineTo(fx - fw * 0.43, fSus + fw * 0.44);
  c.quadraticCurveTo(fx - fw * 0.43, fSus + fw * 0.05, fx, fSus + fw * 0.05);
  c.quadraticCurveTo(fx + fw * 0.43, fSus + fw * 0.05, fx + fw * 0.43, fSus + fw * 0.44);
  c.lineTo(fx + fw * 0.43, jos);
  c.stroke();

  /* Panourile de perete: dreptunghiuri înalte cu ramă dublă, ca lambriurile de
     stuc din orice pinacotecă. Două în stânga firidei, unul în dreapta — în
     dreapta, restul peretelui e al fișei de sală. */
  for (const [px, plat] of [[W * 0.085, W * 0.12], [W * 0.245, W * 0.115],
                            [W * 0.905, W * 0.10]]) {
    panouDeStuc(c, px - plat / 2, sus + H * 0.05, plat, lambriu - sus - H * 0.10, gr);
  }

  /* Coloanele nu se desenează aici, ci la urmă, peste pastă. Puse acum, lespezile
     de vopsea le-ar îngropa — iar o coloană îngropată nu mai ține nimic. */

  /* Ușa din dreapta: nu duce nicăieri și n-are voie să ducă. E acolo fiindcă o
     sală fără nicio ieșire nu e o sală, e o cutie. */
  const ux = W * 0.98, ulat = W * 0.075, uSus = sus + H * 0.10;
  creion(c, gr * 1.3);
  c.beginPath();
  c.rect(ux - ulat, uSus, ulat * 1.4, jos - uSus);
  c.stroke();
  creion(c, gr * 0.8, LINIE_SUBTIRE);
  c.beginPath();
  c.rect(ux - ulat * 0.86, uSus + H * 0.014, ulat * 1.28, jos - uSus - H * 0.014);
  c.stroke();
}

/* Un panou de stuc: rama pe dinafară, o a doua ramă mai subțire înăuntru, și
   colțurile tăiate. Două linii concentrice sunt tot ce trebuie — un panou plin
   de ornamente ar cere să fie privit, iar el are treabă să stea în spate. */
function panouDeStuc(c, x, y, w, h, gr) {
  if (w <= 0 || h <= 0) return;
  // câmpul panoului, cu o umbră de sus în jos, ca la stucul adevărat
  const camp = c.createLinearGradient(x, y, x + w * 0.5, y + h);
  camp.addColorStop(0, PIATRA_LUMINA);
  camp.addColorStop(1, PANOU_PERETE);
  c.fillStyle = camp;
  c.fillRect(x, y, w, h);
  creion(c, gr * 1.1);
  c.beginPath();
  c.rect(x, y, w, h);
  c.stroke();
  creion(c, gr * 0.7, LINIE_SUBTIRE);
  c.beginPath();
  c.rect(x + w * 0.09, y + w * 0.09, w * 0.82, h - w * 0.18);
  c.stroke();
}

/* O coloană corintică întreagă: **bază, fus, capitel** — de la podea până sub
   cornișă. Fiecare parte are un rost: baza împrăștie greutatea pe pardoseală,
   fusul o duce, capitelul o preia de la grindă. O coloană căreia îi lipsește una
   din trei nu e o coloană, e o dungă verticală pe perete.

   Fusul se umflă puțin pe la mijloc — *entasis*. Grecii l-au făcut fiindcă un fus
   drept, privit de jos, pare scobit la mijloc. Se vede foarte puțin, dar fără el
   coloana arată a țeavă. */
function coloanaCorintica(c, cx, cornisa, podea, lat, gr) {
  const capJos = cornisa + lat * 1.30;
  const bazaSus = podea - lat * 0.46;
  const razaSus = lat * 0.40, razaJos = lat * 0.50;

  /* Cât e de gros fusul la înălțimea `t` (0 sus, 1 jos), cu umflătura de la
     mijloc pusă peste subțierea de sus în jos. */
  const grosime = function (t) {
    return intre(razaSus, razaJos, t) + Math.sin(t * Math.PI) * lat * 0.035;
  };

  // fusul, rotund: luminat pe stânga, în umbră pe dreapta
  const rotund = c.createLinearGradient(cx - razaJos, 0, cx + razaJos, 0);
  rotund.addColorStop(0, PIATRA_UMBRA);
  rotund.addColorStop(0.30, PIATRA_LUMINA);
  rotund.addColorStop(0.62, PIATRA_PERETE);
  rotund.addColorStop(1, '#9d9280');
  c.fillStyle = rotund;
  c.beginPath();
  const PASI = 18;
  for (let k = 0; k <= PASI; k++) {
    const t = k / PASI, y = intre(capJos, bazaSus, t);
    if (k === 0) c.moveTo(cx - grosime(t), y); else c.lineTo(cx - grosime(t), y);
  }
  for (let k = PASI; k >= 0; k--) {
    const t = k / PASI, y = intre(capJos, bazaSus, t);
    c.lineTo(cx + grosime(t), y);
  }
  c.closePath();
  c.fill();
  creion(c, gr * 1.1);
  c.stroke();

  // canelurile: patru dungi care urmează umflătura fusului
  creion(c, gr * 0.55, 'rgba(120, 110, 92, 0.55)');
  for (const q of [-0.55, -0.20, 0.20, 0.55]) {
    c.beginPath();
    for (let k = 0; k <= PASI; k++) {
      const t = k / PASI, y = intre(capJos, bazaSus, t);
      const x = cx + grosime(t) * q;
      if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
  }

  bazaColoanei(c, cx, bazaSus, podea, lat, gr);
  capitelCorintic(c, cx, cornisa, capJos, lat, gr);
}

/* Baza: un tor rotunjit pe o plintă pătrată. Plinta e ce atinge pardoseala, și
   tocmai ea lipsea — o coloană care se termină în aer, deasupra podelei, plutește
   oricât de bine ar fi desenat restul. */
function bazaColoanei(c, cx, sus, podea, lat, gr) {
  const piatra = c.createLinearGradient(cx - lat * 0.7, 0, cx + lat * 0.7, 0);
  piatra.addColorStop(0, PIATRA_UMBRA);
  piatra.addColorStop(0.32, PIATRA_LUMINA);
  piatra.addColorStop(1, '#968b79');
  c.fillStyle = piatra;

  // torul
  c.beginPath();
  c.moveTo(cx - lat * 0.50, sus);
  c.quadraticCurveTo(cx - lat * 0.70, sus + lat * 0.14, cx - lat * 0.62, sus + lat * 0.28);
  c.lineTo(cx + lat * 0.62, sus + lat * 0.28);
  c.quadraticCurveTo(cx + lat * 0.70, sus + lat * 0.14, cx + lat * 0.50, sus);
  c.closePath();
  c.fill();
  creion(c, gr);
  c.stroke();

  // plinta, care stă pe pardoseală
  c.fillStyle = piatra;
  c.beginPath();
  c.rect(cx - lat * 0.72, sus + lat * 0.28, lat * 1.44, podea - sus - lat * 0.28);
  c.fill();
  creion(c, gr * 1.1);
  c.stroke();
}

/* Capitelul. Un corint desenat frunză cu frunză, la mărimea la care se vede
   aici, se face un ghem de linii — de departe, dintr-un corint se citesc coșul,
   două rânduri de acantă și volutele din colțuri. Atât punem. */
function capitelCorintic(c, cx, sus, jos, lat, gr) {
  const piatra = c.createLinearGradient(cx - lat * 0.8, 0, cx + lat * 0.8, 0);
  piatra.addColorStop(0, PIATRA_UMBRA);
  piatra.addColorStop(0.30, PIATRA_LUMINA);
  piatra.addColorStop(1, '#9d9280');

  // coșul capitelului, care se lărgește în sus
  c.fillStyle = piatra;
  c.beginPath();
  c.moveTo(cx - lat * 0.42, jos);
  c.quadraticCurveTo(cx - lat * 0.46, sus + lat * 0.55, cx - lat * 0.72, sus + lat * 0.26);
  c.lineTo(cx + lat * 0.72, sus + lat * 0.26);
  c.quadraticCurveTo(cx + lat * 0.46, sus + lat * 0.55, cx + lat * 0.42, jos);
  c.closePath();
  c.fill();
  creion(c, gr);
  c.stroke();

  // abacul: placa de deasupra, scobită pe laturi
  c.fillStyle = piatra;
  c.beginPath();
  c.moveTo(cx - lat * 0.82, sus);
  c.quadraticCurveTo(cx, sus + lat * 0.10, cx + lat * 0.82, sus);
  c.lineTo(cx + lat * 0.82, sus + lat * 0.26);
  c.quadraticCurveTo(cx, sus + lat * 0.34, cx - lat * 0.82, sus + lat * 0.26);
  c.closePath();
  c.fill();
  creion(c, gr * 1.2);
  c.stroke();

  // volutele din colțuri și frunzele de acantă
  creion(c, gr * 0.75, 'rgba(110, 100, 82, 0.8)');
  for (const lt of [-1, 1]) {
    c.beginPath();
    c.moveTo(cx + lt * lat * 0.66, sus + lat * 0.30);
    c.quadraticCurveTo(cx + lt * lat * 0.58, sus + lat * 0.62,
                       cx + lt * lat * 0.34, sus + lat * 0.52);
    c.stroke();
    c.beginPath();
    c.moveTo(cx + lt * lat * 0.08, jos - lat * 0.05);
    c.quadraticCurveTo(cx + lt * lat * 0.40, jos - lat * 0.42,
                       cx + lt * lat * 0.30, sus + lat * 0.68);
    c.stroke();
  }
  // frunza din mijloc
  c.beginPath();
  c.moveTo(cx, jos - lat * 0.04);
  c.quadraticCurveTo(cx - lat * 0.10, sus + lat * 0.80, cx, sus + lat * 0.58);
  c.quadraticCurveTo(cx + lat * 0.10, sus + lat * 0.80, cx, jos - lat * 0.04);
  c.stroke();
}

/* Aplicele de perete. Erau două clopote cu o dungă deasupra, atârnate în aer —
   arătau a ciuperci puse în cui. O aplică adevărată are trei lucruri: o **talpă**
   prinsă de perete, un **braț** care iese din ea, și **globul** de sticlă în
   care arde lumina. Cel din urmă e singurul care trebuie să strălucească.

   Se desenează la sfârșit, peste pastă: lumina lor cade **pe** vopsea, nu sub ea. */
function apliceleDePerete(c, g, gr) {
  const y = g.cornisa + H * 0.185;
  for (const cx of [W * 0.325, W * 0.582]) {
    const r = Math.min(W * 0.019, H * 0.030);

    // haloul cald de pe perete
    const halo = c.createRadialGradient(cx, y + r * 0.9, 0, cx, y + r * 0.9, r * 6);
    halo.addColorStop(0, 'rgba(255, 226, 158, 0.34)');
    halo.addColorStop(0.45, 'rgba(255, 214, 130, 0.12)');
    halo.addColorStop(1, 'rgba(255, 214, 130, 0)');
    c.fillStyle = halo;
    c.beginPath();
    c.arc(cx, y + r * 0.9, r * 6, 0, Math.PI * 2);
    c.fill();

    // talpa prinsă de perete
    const alama = c.createLinearGradient(cx - r * 0.5, 0, cx + r * 0.5, 0);
    alama.addColorStop(0, '#f2dc9e');
    alama.addColorStop(0.4, ALAMA_SALA);
    alama.addColorStop(1, '#7d5f1f');
    c.fillStyle = alama;
    c.beginPath();
    c.ellipse(cx, y - r * 1.5, r * 0.42, r * 0.62, 0, 0, Math.PI * 2);
    c.fill();

    // brațul, o curbă subțire care coboară spre glob
    c.strokeStyle = ALAMA_SALA;
    c.lineWidth = Math.max(1.2, r * 0.16);
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(cx, y - r * 1.4);
    c.quadraticCurveTo(cx + r * 0.30, y - r * 0.9, cx, y - r * 0.34);
    c.stroke();

    /* Globul: o bilă de sticlă lăptoasă, luminată dinăuntru. Lumina se face
       dintr-un gradient care pornește din partea de sus a bilei, nu din mijloc —
       becul stă acolo, iar sticla de dedesubt e mai plină. */
    const sticla = c.createRadialGradient(cx - r * 0.25, y - r * 0.25, r * 0.05,
                                          cx, y + r * 0.1, r * 1.15);
    sticla.addColorStop(0, '#fffbe8');
    sticla.addColorStop(0.45, '#ffeeba');
    sticla.addColorStop(1, '#e8c477');
    c.fillStyle = sticla;
    c.beginPath();
    c.arc(cx, y + r * 0.15, r, 0, Math.PI * 2);
    c.fill();
    creion(c, gr * 0.8, 'rgba(140, 108, 40, 0.55)');
    c.stroke();

    // gulerașul de alamă de deasupra globului
    c.fillStyle = alama;
    c.beginPath();
    c.ellipse(cx, y - r * 0.72, r * 0.34, r * 0.16, 0, 0, Math.PI * 2);
    c.fill();
  }
}

/* Podeaua: dale pătrate care fug spre punctul de fugă. Puține și subțiri — o
   podea desenată apăsat trage ochiul în jos, iar aici ochiul are treabă la
   mijloc. */
function podeaDeDale(c, g, gr) {
  /* Dalele de piatră, cu lumina din luminator căzută pe ele. Podeaua e mai
     închisă decât peretele: altfel camera plutește. */
  const dale = c.createLinearGradient(0, g.podea, 0, H);
  dale.addColorStop(0, PODEA_ROST);
  dale.addColorStop(0.35, PODEA_DALA);
  dale.addColorStop(1, '#b9af9c');
  c.fillStyle = dale;
  c.fillRect(0, g.podea, W, H - g.podea);
  const balta = c.createRadialGradient(W * 0.5, g.podea + H * 0.10, 0,
                                       W * 0.5, g.podea + H * 0.10, Math.max(W, H) * 0.45);
  balta.addColorStop(0, 'rgba(255, 252, 240, 0.40)');
  balta.addColorStop(1, 'rgba(255, 252, 240, 0)');
  c.fillStyle = balta;
  c.fillRect(0, g.podea, W, H - g.podea);

  creion(c, gr * 0.7, LINIE_SUBTIRE);
  for (let k = -8; k <= 8; k++) {
    c.beginPath();
    c.moveTo(W * 0.5 + k * W * 0.066, g.podea);
    c.lineTo(W * 0.5 + k * W * 0.30, H * 1.04);
    c.stroke();
  }
  for (let k = 1; k <= 6; k++) {
    const y = intre(g.podea, H * 1.04, Math.pow(k / 6, 1.8));
    c.beginPath();
    c.moveTo(0, y); c.lineTo(W, y);
    c.stroke();
  }
}

/* Podiumul rotund, cu funii de catifea pe stâlpi și cu plăcuța de sală în față. */
function podiumulCuFunii(c, g, gr) {
  const h2 = H * 0.045;

  /* Podiumul: o piatră închisă, lustruită. Închis dinadins — pelerina albă stă
     pe el, iar o treaptă deschisă i-ar mânca poalele. */
  c.fillStyle = '#6d6353';
  c.beginPath();
  c.moveTo(g.podiumCx - g.podiumRx, g.podiumCy);
  c.lineTo(g.podiumCx - g.podiumRx, g.podiumCy + h2);
  c.ellipse(g.podiumCx, g.podiumCy + h2, g.podiumRx, g.podiumRy, 0, Math.PI, 0, true);
  c.lineTo(g.podiumCx + g.podiumRx, g.podiumCy);
  c.closePath();
  c.fill();
  const blat = c.createLinearGradient(0, g.podiumCy - g.podiumRy, 0, g.podiumCy + g.podiumRy);
  blat.addColorStop(0, '#a19682');
  blat.addColorStop(1, '#8b8170');
  c.fillStyle = blat;
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy, g.podiumRx, g.podiumRy, 0, 0, Math.PI * 2);
  c.fill();

  creion(c, gr * 1.4);
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy, g.podiumRx, g.podiumRy, 0, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.moveTo(g.podiumCx - g.podiumRx, g.podiumCy);
  c.lineTo(g.podiumCx - g.podiumRx, g.podiumCy + h2);
  c.moveTo(g.podiumCx + g.podiumRx, g.podiumCy);
  c.lineTo(g.podiumCx + g.podiumRx, g.podiumCy + h2);
  c.stroke();
  c.beginPath();
  c.ellipse(g.podiumCx, g.podiumCy + h2, g.podiumRx, g.podiumRy, 0, 0, Math.PI);
  c.stroke();

  /* Aici era o etichetă de muzeu, un dreptunghi gol pe fața podiumului. A ieșit:
     gol, nu spunea nimic, iar scris ar fi spus ce vrem tocmai să nu spunem —
     lucrarea de pe podium **nu are încă nume**, fiindcă n-a făcut-o încă nimeni.
     Tu urmează s-o faci. */

  /* Aici stăteau patru stâlpi cu cordon, de jur împrejurul podiumului. I-am
     scos: în fața pelerinei n-au loc. Trena se revarsă tocmai peste locul lor,
     iar un cordon tras peste lucrarea pe care ai de gând s-o pictezi nu mai e
     un semn de muzeu, e un gard între tine și treaba ta.

     Și nici nu lipsesc: firida, podiumul și fișa de sală spun destul de limpede
     că ești într-un muzeu. */
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
  [0.000, 0.070], [0.050, 0.100],
  /* Umerii încep **sub** guler, nu la același nivel cu el. Mânecile porneau de
     lângă gât și se atingeau la mijloc: corsajul dispărea cu totul între ele, iar
     rochia se citea ca un ghem de baloane. Un trup se vede numai dacă i se lasă
     loc între brațe. */
  [0.082, 0.190], [0.115, 0.360],                   // umerii, cu aripioarele
  [0.190, 0.470], [0.265, 0.450],                   // mâneca-balon, până la cot
  [0.335, 0.330], [0.395, 0.200],                   // se strânge spre încheietură
  [0.430, 0.150],                                   // talia — locul cel mai îngust
  [0.505, 0.350], [0.605, 0.560], [0.720, 0.750],
  [0.845, 0.900], [0.950, 0.980], [1.000, 1.000]
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
const TALIA = 0.430;

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
  gulerulGhioc(c, g, gr);
  /* Umărul manechinului, deasupra gulerului. E singurul lucru care se vede din
     ce e **dedesubt** — și tocmai el spune că rochia e îmbrăcată, nu atârnată. */
  capatulManechinului(c, g, gr);
}

/* Vârful manechinului: gâtul de lemn și butonul lui, ieșind din guler. Un
   manechin de muzeu n-are cap; are un știft. */
function capatulManechinului(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const lat = w * 0.062, inalt = h * 0.075;
  const lemn = c.createLinearGradient(cx - lat, 0, cx + lat, 0);
  lemn.addColorStop(0, '#f0e6ce');
  lemn.addColorStop(0.32, '#dcc9a4');
  lemn.addColorStop(1, '#a89478');
  c.fillStyle = lemn;
  c.beginPath();
  c.moveTo(cx - lat * 0.80, sus - inalt);
  c.lineTo(cx - lat, sus + h * 0.020);
  c.lineTo(cx + lat, sus + h * 0.020);
  c.lineTo(cx + lat * 0.80, sus - inalt);
  c.closePath();
  c.fill();
  creion(c, gr * 1.2);
  c.stroke();
  // butonul rotund din vârf
  c.fillStyle = lemn;
  c.beginPath();
  c.ellipse(cx, sus - inalt, lat * 0.86, lat * 0.42, 0, 0, Math.PI * 2);
  c.fill();
  creion(c, gr * 1.1);
  c.stroke();
}

/* Gulerul-ghioc — *ruff*-ul. E lucrul care spune „Renaștere" înaintea oricărui
   altuia: o roată de pânză scrobită, călcată în cute în formă de opt, care stă
   în jurul gâtului ca o farfurie.

   Se desenează **la urmă**, peste tot restul: el stă în fața umerilor, iar dacă
   l-aș pune înainte, cusătura umărului i-ar trece peste cute. */
function gulerulGhioc(c, g, gr) {
  const cx = g.pelCx, sus = g.pelSus, w = g.pelLat, h = g.pelInalt;
  const cy = sus + h * 0.012;
  const rx = w * 0.235, ry = h * 0.042;

  // roata gulerului: două elipse, una în alta
  const panza = c.createRadialGradient(cx, cy - ry * 0.3, ry * 0.2, cx, cy, rx);
  panza.addColorStop(0, '#ffffff');
  panza.addColorStop(1, '#efe8d8');
  c.fillStyle = panza;
  c.beginPath();
  c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
  creion(c, gr * 1.35);
  c.stroke();
  creion(c, gr * 0.9, LINIE_SUBTIRE);
  c.beginPath();
  c.ellipse(cx, cy, rx * 0.34, ry * 0.42, 0, 0, Math.PI * 2);
  c.stroke();

  /* Cutele: fiecare e un „opt" culcat, care pleacă de la gât spre margine. Trase
     drept, ca spițele unei roți, gulerul arată a floarea-soarelui; îndoite, arată
     a pânză călcată. */
  creion(c, gr * 0.7, LINIE_SUBTIRE);
  const CUTE = 26;
  for (let k = 0; k < CUTE; k++) {
    const a = (k / CUTE) * Math.PI * 2;
    const x0 = cx + Math.cos(a) * rx * 0.34, y0 = cy + Math.sin(a) * ry * 0.42;
    const x1 = cx + Math.cos(a) * rx, y1 = cy + Math.sin(a) * ry;
    const ax = Math.cos(a + 0.22), ay = Math.sin(a + 0.22);
    c.beginPath();
    c.moveTo(x0, y0);
    c.quadraticCurveTo(cx + ax * rx * 0.78, cy + ay * ry * 0.78, x1, y1);
    c.stroke();
  }
  // marginea zimțată, din vârfurile cutelor
  creion(c, gr * 0.85);
  c.beginPath();
  for (let k = 0; k <= CUTE; k++) {
    const a = (k / CUTE) * Math.PI * 2;
    const r = 1 + (k % 2 ? 0.045 : 0);
    const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
    if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
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

  // cămașa de in care se vede peste decolteu, cu creț mărunt
  creion(c, gr * 1.15);
  c.beginPath();
  c.moveTo(cx - w * 0.185, decolteu);
  c.quadraticCurveTo(cx, decolteu - h * 0.020, cx + w * 0.185, decolteu);
  c.stroke();
  creion(c, gr * 0.6, LINIE_SUBTIRE);
  for (let k = 0; k < 9; k++) {
    const t = (k + 0.5) / 9;
    const x = intre(cx - w * 0.175, cx + w * 0.175, t);
    const y = decolteu - h * 0.018 * Math.sin(t * Math.PI);
    c.beginPath();
    c.moveTo(x, y); c.lineTo(x, y + h * 0.020);
    c.stroke();
  }

  // decolteul pătrat al rochiei
  creion(c, gr * 1.3);
  c.beginPath();
  c.moveTo(cx - w * 0.20, decolteu + h * 0.028);
  c.lineTo(cx - w * 0.155, decolteu + h * 0.050);
  c.lineTo(cx + w * 0.155, decolteu + h * 0.050);
  c.lineTo(cx + w * 0.20, decolteu + h * 0.028);
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
  const S = g.S;
  /* Uneltele stau **sub** îndemn, nu peste el: cozile lor sunt lungi și urcă
     mult deasupra mijlocului, iar așezate mai sus scriau peste litere. */
  const x0 = W * 0.048, y0 = H * 0.585;
  const pas = Math.min(W * 0.040, S * 0.076);
  const inalt = Math.min(H * 0.20, S * 0.32);
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
function indemnulScenei8(g, locuri) {
  const x = W * 0.032, y = H * 0.062;
  const lat = Math.min(W * 0.30, g.S * 0.56);
  /* Destul de înaltă cât să încapă **amândouă** rândurile cu tot cu coada
     literelor. Era cât un rând și jumătate, iar al doilea ieșea din vopsea. */
  const inalt = H * 0.082;

  ctx.save();
  // tușa de vopsea de sub scris, dintr-o pastă caldă
  ctx.globalAlpha = 0.88;
  const banda = ctx.createLinearGradient(x, y, x + lat, y + inalt);
  banda.addColorStop(0, '#f0c86a');
  banda.addColorStop(0.55, '#e8b04a');
  banda.addColorStop(1, '#d9963a');
  ctx.fillStyle = banda;
  ctx.beginPath();
  ctx.moveTo(x, y + inalt * 0.30);
  ctx.quadraticCurveTo(x + lat * 0.22, y - inalt * 0.12, x + lat * 0.58, y + inalt * 0.06);
  ctx.quadraticCurveTo(x + lat * 0.86, y + inalt * 0.20, x + lat, y + inalt * 0.02);
  ctx.lineTo(x + lat * 0.985, y + inalt * 0.92);
  ctx.quadraticCurveTo(x + lat * 0.6, y + inalt * 1.16, x + lat * 0.24, y + inalt * 0.98);
  ctx.quadraticCurveTo(x + lat * 0.08, y + inalt * 0.90, x, y + inalt * 1.02);
  ctx.closePath();
  ctx.fill();
  // creasta de sus a tușei, cât să se vadă că e pastă, nu dreptunghi
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = '#fff3d0';
  ctx.lineWidth = Math.max(1, inalt * 0.10);
  ctx.beginPath();
  ctx.moveTo(x + lat * 0.04, y + inalt * 0.26);
  ctx.quadraticCurveTo(x + lat * 0.3, y + inalt * 0.02, x + lat * 0.62, y + inalt * 0.16);
  ctx.stroke();
  ctx.restore();

  const marimeMare = Math.max(13, Math.min(g.S * 0.026, lat * 0.062));
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#4a2c10';
  ctx.font = `bold ${Math.round(marimeMare)}px Georgia`;
  ctx.fillText('Spațiul este pânza ta.', x + lat * 0.5, y + inalt * 0.38);
  ctx.font = `italic ${Math.round(marimeMare * 0.80)}px Georgia`;
  ctx.fillStyle = '#5e3a16';
  ctx.fillText('Lasă-ți amprenta. Personalizează exponatul.',
               x + lat * 0.5, y + inalt * 0.70);
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

function lasaTusa(x, y, unghi, marime) {
  const c = stratul().getContext('2d');
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
    spuneScena8('Ai luat: ' + USTENSILE[u].nume + '.', 2600);
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
      facPerdeaua();
      s8.faza = 'scurgere'; s8.t0 = acum; s8.scurgere = 0.001;
      if (audio) { sunetSlosh(); sunetPlescait(); }
      spuneScena8('Pelerina e acoperită. Culoarea nu mai stă — se scurge.', 6000);
    } else if (!s8.aSpusTrapa && s8.tuseFacute === 12) {
      s8.aSpusTrapa = true;
      spuneScena8('Acoperă pelerina de tot: ea e lucrarea neterminată.', 6000);
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

  if (s8.faza === 'diluare' || s8.faza === 'iesire') {
    deseneazaDiluarea(acum);
  } else {
    // ce a pictat jucătorul, peste desenul în linie
    ctx.drawImage(stratul(), 0, 0);
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
