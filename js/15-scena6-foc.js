/* ============================================================================
   SCENA A ȘASEA — SALA ROTUNDĂ A FOCULUI

   Tema: valoarea petei picturale sub semn termic. Toată sala e făcută numai din
   culori calde — galben, portocaliu, roșu, brun — iar singura culoare rece din
   ea apare abia la sfârșit, în cenușa din gaura arsă. Asta e toată demonstrația
   scenei: cât de tare arde caldul se vede abia când, într-un colț, dai peste
   rece. Contrastul nu e o regulă scrisă undeva, e ceva ce simți în ochi.

   De ce e rotundă: într-o sală dreptunghiulară privirea fuge pe pereți spre
   colțuri. Într-una rotundă n-are unde să fugă — se întoarce mereu în mijloc,
   la foc. Sala îți ține capul întors spre tablou fără să-ți spună nimic.

   Se intră pe ușa casei din tabloul scenei a cincea, care tocmai s-a deschis.
   ========================================================================== */

/* ---------- CULORILE ---------- */
/* Numai calde. Nicio culoare din lista asta nu are albastru în ea mai mult
   decât o umbră — iar unde ar fi trebuit umbră rece, e brun ars. */
const GALBEN_SALA    = '#e8a03a';   // tapetul, în plină lumină
const GALBEN_LUMINA  = '#ffd884';   // unde bate lumina focului pe perete
const PORTOCALIU     = '#dd6a1e';
const ROSU_ADANC     = '#a8321a';
const BRUN_UMBRA     = '#5e2410';
const BRUN_ADANC     = '#2f1207';   // clarobscurul: partea de sală în care nu bate focul
/* Pardoseala face excepție de la regula culorilor calde, și o face dinadins.
   Tabla de șah e alb-negru: e singurul lucru neutru din sală, măsura după care
   ochiul judecă cât de aprins e restul. Pictată în oranj și maro — cum era întâi,
   fiindcă lumina focului o încălzea — sala devenea o baie de galben în care nimic
   nu mai avea față de ce să pară cald. */
const ALB_PODEA      = '#f4f0e8';   // pătratul deschis
const NEGRU_PODEA    = '#17140f';   // pătratul închis
const AUR_RAMA6      = '#c98b2c';

/* Singura culoare rece din toată sala. Stă în gaura arsă, la sfârșit, și tocmai
   de-aia se vede: după cinci minute de galben, o cenușă albăstruie sare în ochi
   ca o fereastră deschisă iarna. */
const CENUSA_ALBASTRA = '#8fa4c4';
const CENUSA_INCHISA  = '#5c6c8c';

/* După atâtea atingeri pe pânză cu mâna goală, mănușile vin singure. Aceeași
   socoteală ca la lupa din galerie: cine n-a înțeles din avertisment nu trebuie
   lăsat să se învârtă la nesfârșit prin sală. */
const PRAG_MANUSI_IN_MANA = 5;

const s6 = {
  faza: 'intrare',       // intrare → sala → scanteie → arde → gaura
  t0: 0, ultimulCadru: 0,
  manusiPuse: false,
  refuzuri: 0,
  frige: 0,              // cât pulsează avertismentul, după o atingere cu mâna goală
  aburi: 0,              // cât de vaporos e ecranul
  arsura: 0,             // cât a ars din tapet, 0..1
  colt: 0,               // cât arde colțul ecranului
  scanteie: null         // { x, y, vx, vy }
};

/* ---------- MĂSURILE SĂLII ---------- */
/* Toate locurile din sală se scot dintr-un singur loc. Scrise pe rând, acolo
   unde e nevoie de ele, s-ar depărta una de alta la prima schimbare — și masa
   ar sta lângă tablou, dar nu chiar sub el. */
/* Linia pe care peretele rotund întâlnește pardoseala, la o distanță `u` de la
   stânga (0) la dreapta (1).

   Nu e dreaptă, și ăsta e tot secretul sălii. Stând în mijlocul unei rotonde,
   peretele din fața ta e cel mai departe, iar cel din laturi e mai aproape — deci
   pe ecran temelia lui e sus la mijloc și coboară spre margini. Linia asta, și
   cornișa care o repetă sus, spun „rotund" mai limpede decât orice contur: un
   perete drept are temelia dreaptă, și atunci sala e o cutie oricât ai vopsi-o. */
function temeliaPeretelui(u, orizontul) {
  return orizontul + Math.pow(Math.abs(u - 0.5) * 2, 1.7) * H * 0.075;
}

function cornisaPeretelui(u) {
  return H * 0.035 - Math.pow(Math.abs(u - 0.5) * 2, 1.7) * H * 0.052;
}

function geomSala6() {
  const orizontul = H * 0.60;          // unde peretele întâlnește pardoseala, la mijloc
  const latSus = W * 0.56;             // cât de îngustă e sala în fund

  /* Pânza stă **pe un șevalet, în mijlocul sălii** — nu atârnată pe perete. Un
     tablou pe perete e un obiect de muzeu, terminat, la care te uiți. Unul pe
     șevalet e o lucrare la care se lucrează, care poate fi întoarsă, atinsă, și
     din care poate să sară o scânteie. Iar șevaletul, stând în mijloc, te obligă
     să-l ocolești: sala rotundă și el se ajută.

     E culcată, nu în picioare. Un foc de tabără e un lucru lat: are noapte
     de-o parte și de alta, are dealuri în fund, are jar care se întinde pe jos.
     Pe o pânză înaltă tot ce nu e flacără se pierde, iar focul ajunge o lumânare
     în mijlocul unui perete de întuneric.

     Și stă mai în față decât stătea. Împinsă în fund, pe o pânză mică, sala
     rămânea un hol gol cu un afiș la capăt — rotundă degeaba, fiindcă privirea
     nu avea ce să ocolească. Acum lucrarea, șevaletul, măsuța și blana de sub
     ele ocupă chiar planul întâi, unde stai tu. */
  const tablouLat = Math.min(W * 0.40, H * 0.62);
  const tablouInalt = tablouLat * 0.68;
  const tablouY = orizontul - tablouInalt * 0.62;
  const sevaletTalpa = H * 0.965;      // unde calcă picioarele șevaletului
  return {
    orizontul, latSus,
    tablouX: W * 0.5 - tablouLat / 2,
    tablouY,
    tablouLat, tablouInalt,
    sevaletTalpa,
    /* Masa cu mănuși, în **stânga** șevaletului. A stat în dreapta cât pânza era
       îngustă și cât peretele din dreapta era gol. De când lucrarea e culcată,
       acolo n-o mai încape; iar de când arsura s-a mutat pe peretele din dreapta,
       nici n-ar trebui: o măsuță pusă în fața unei uși o face pragul cuiva care
       nu vrea să fie vizitat. */
    masaLat: tablouLat * 0.42,
    masaInalt: H * 0.145,
    masaX: W * 0.5 - tablouLat * 0.72,
    masaY: H * 0.80,
    /* Fișa de sală, pe peretele din stânga — ca în galerie și ca în sala a cincea.
       O vreme a stat și un al doilea panou, în dreapta, cu numele pictorilor
       expresioniști. Erau referințele după care s-a pictat sala, nu ceva de citit
       în ea: unsprezece nume pe perete cer să fie citite, și atunci sala nu mai e
       despre căldura culorii, ci despre memorat. Peretele din dreapta a rămas gol,
       și e mai bine așa — focul are cu ce să respire. */
    panouLat: W * 0.185,
    panouInalt: H * 0.40,
    panouY: H * 0.12,
    panouStangaX: W * 0.045
  };
}

/* Unde e arsura din perete, și cât e de mare acum.

   Un singur loc pentru desen, pentru atingere și pentru teste. Cât timp erau
   trei socoteli scrise una lângă alta, gaura se putea muta din desen fără să se
   mute și locul pe care apeși — iar asta nu se vede decât încercând.

   Stă pe **peretele din dreapta**, cu pragul chiar pe linia unde peretele
   întâlnește pardoseala, și e mai înaltă decât lată. În mijlocul peretelui din
   fund, cum era întâi, era o gaură într-un perete: te uitai prin ea. Pe peretele
   din laturi, sprijinită pe podea și de statura unui om, e o **ușă** — se
   înțelege din formă și din loc că sala continuă dincolo, fără să scrie nimeni
   asta nicăieri. Și e chiar drumul pe care focul a venit: colțul de jos-dreapta
   al ecranului a ars primul, iar arsura urcă de acolo. */
const ARSURA_U = 0.80;          // pe ce parte din lățimea peretelui stă
const ARSURA_LAT = 0.78;        // cât e de lată față de raza ei
const ARSURA_INALT = 1.15;      // și cât e de înaltă — o ușă, nu o fereastră

function geomArsura(cat) {
  const g = geomSala6();
  const plin = Math.min(W, H) * 0.22;
  const r = plin * atenuare(Math.min(1, cat === undefined ? 1 : Math.max(0, cat)));
  /* Pragul rămâne pe loc cât crește gaura: focul mănâncă tapetul **în sus**,
     dinspre podea, nu se umflă dintr-un punct din perete.

     Centrul se pune destul de jos cât marginea arsă să treacă întotdeauna de
     podea și să fie tăiată de ea. Marginea fâlfâie — asta o face să pară arsă —
     iar cu centrul așezat exact cât trebuie, la unele unghiuri rămânea o palmă
     de tapet între ușă și pardoseală. O ușă care nu atinge podeaua e o
     fereastră. */
  const prag = temeliaPeretelui(ARSURA_U, g.orizontul);
  return {
    cx: W * ARSURA_U,
    cy: prag - r * ARSURA_INALT * 0.80,
    r, prag,
    latime: r * ARSURA_LAT,
    inaltime: r * ARSURA_INALT
  };
}

/* Unde stau mănușile pe masă. */
function geomManusi() {
  const g = geomSala6();
  return { x: g.masaX, y: g.masaY - g.masaInalt * 0.10,
           r: Math.min(W, H) * 0.05 };
}

/* ---------- TEXTELE DE PE PEREȚI ---------- */
const TEXT_FISA_EXPRESIONISM =
  'Expresionismul este un curent artistic dezvoltat la începutul secolului XX, ' +
  'axat pe redarea stărilor emoționale intense și a trăirilor interioare prin ' +
  'deformarea realității, culori violente și linii accentuate.';

/* ---------- PASTA ---------- */
/* Sala asta e despre valoarea petei picturale. Ar fi fost de râs ca tocmai ea să
   fie zugrăvită neted, cu gradiente lucioase: tema scrisă pe perete și
   dezmințită de perete. Așa că peretele, ca și lucrarea de pe șevalet, e pus din
   pete de pastă — se vede tușa, se vede unde a apăsat pensula.

   O pată de pastă nu e o elipsă colorată. Vopseaua groasă are un **relief**:
   pe muchia dinspre lumină prinde o dungă mai deschisă, iar pe cealaltă lasă o
   umbră. Trei treceri, deci — corpul, creasta, umbra — și abia atunci ochiul
   citește „pastă", nu „pată". Cu una singură iese o confetti.

   Lumina din sală vine din tablou, de la foc; creasta stă mereu spre el. */
const PASTA_CREASTA = 'rgba(255, 226, 164, ';
const PASTA_UMBRA   = 'rgba(72, 26, 10, ';

function pataDePasta(c, x, y, lung, gros, unghi, culoare, alfa, relief) {
  const a = alfa === undefined ? 1 : alfa;
  const rel = relief === undefined ? 1 : relief;
  tusa(c, x, y, lung, gros, unghi, culoare, a);
  // creasta: o dungă subțire pe muchia dinspre lumină
  const dx = Math.sin(unghi) * gros * 0.26, dy = -Math.cos(unghi) * gros * 0.26;
  tusa(c, x + dx, y + dy, lung * 0.82, gros * 0.34, unghi,
       PASTA_CREASTA + (0.5 * rel).toFixed(3) + ')', a);
  // și umbra pe cealaltă, cât să se simtă grosimea stratului
  tusa(c, x - dx * 1.15, y - dy * 1.15, lung * 0.74, gros * 0.28, unghi,
       PASTA_UMBRA + (0.34 * rel).toFixed(3) + ')', a);
}

/* ---------- SALA, PICTATĂ O SINGURĂ DATĂ ---------- */
/* Peretele, pardoseala în tablă de șah și panourile nu se schimbă niciodată.
   Pictate la fiecare cadru, prima intrare în sală s-ar simți ca o poticnire —
   aceeași lecție ca la galerie, unde sala se picta în primul cadru și se vedea. */
const salaFocului = { panza: null, latime: 0, inaltime: 0 };

function pregatesteSalaFocului() {
  /* Și rama prețioasă se sculptează acum, nu la primul cadru din sală: e o mie de
     ornamente pe o pânză de o mie de pixeli, adică singura piesă din scenă care
     costă cât o sală întreagă. Lăsată pe mai târziu, intrarea se poticnea vizibil
     — aceeași lecție ca la galerie, a treia oară învățată. */
  if (typeof pregatesteRamaFocului === 'function') pregatesteRamaFocului();
  if (salaFocului.panza && salaFocului.latime === W && salaFocului.inaltime === H) {
    return salaFocului.panza;
  }
  const p = panzaDeLucru(salaFocului, W, H);
  const c = p.getContext('2d');
  c.clearRect(0, 0, W, H);
  pictezaSalaFocului(c);
  salaFocului.latime = W; salaFocului.inaltime = H;
  return p;
}

function pictezaSalaFocului(c) {
  const g = geomSala6();

  /* Peretele. Galbenul nu e întins uniform: e mai aprins în mijloc, unde bate
     focul din tablou, și cade spre brun ars pe margini. Asta e clarobscurul —
     nu o umbră desenată, ci o lumină care se termină. */
  const perete = c.createRadialGradient(W * 0.5, g.orizontul - H * 0.18, H * 0.05,
                                        W * 0.5, g.orizontul - H * 0.18, W * 0.62);
  perete.addColorStop(0, GALBEN_LUMINA);
  perete.addColorStop(0.34, GALBEN_SALA);
  perete.addColorStop(0.68, PORTOCALIU);
  perete.addColorStop(1, BRUN_ADANC);
  c.fillStyle = perete;
  c.fillRect(0, 0, W, g.orizontul + H * 0.09);

  /* Ce face sala să pară rotundă nu e conturul, ci lesele de tapet: sunt late în
     mijloc, unde peretele vine spre tine, și se strâng spre margini, unde fuge.
     Ochiul citește îngustarea ca pe o curbură fără să știe de ce. Un perete drept
     ar avea lesele toate la fel. */
  const LESE = 30;
  for (let k = 0; k <= LESE; k++) {
    /* Lesele nu stau la distanțe egale: se îndesesc spre margini, unde peretele
       fuge de la tine și se vede din ce în ce mai din profil. Cu ele puse la pas
       egal — cum erau întâi — sala rămâne o cutie tapetată, oricâtă lumină ai
       turna în mijloc. Cosinusul face exact îndesirea asta. */
    const u = 0.5 - 0.5 * Math.cos((k / LESE) * Math.PI);
    const x = W * u;
    const fata = Math.sin(u * Math.PI);     // 1 în mijloc, 0 pe margini
    c.globalAlpha = 0.08 + (1 - fata) * 0.26;
    c.strokeStyle = BRUN_UMBRA;
    c.lineWidth = Math.max(0.7, W * 0.0016 * (1 + (1 - fata) * 1.6));
    c.beginPath();
    c.moveTo(x, cornisaPeretelui(u));
    c.lineTo(x, temeliaPeretelui(u, g.orizontul));
    c.stroke();
  }
  c.globalAlpha = 1;

  /* Cornișa de sus: repetă curbura temeliei, răsturnată. Două arcuri care se
     închid unul spre altul citesc a boltă; unul singur ar putea fi o dungă. */
  c.fillStyle = BRUN_ADANC;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(W, 0);
  for (let k = 60; k >= 0; k--) {
    const u = k / 60;
    c.lineTo(W * u, cornisaPeretelui(u));
  }
  c.closePath();
  c.fill();
  c.strokeStyle = AUR_RAMA6;
  c.lineWidth = Math.max(1.2, H * 0.004);
  c.globalAlpha = 0.55;
  c.beginPath();
  for (let k = 0; k <= 60; k++) {
    const u = k / 60;
    if (k === 0) c.moveTo(W * u, cornisaPeretelui(u));
    else c.lineTo(W * u, cornisaPeretelui(u));
  }
  c.stroke();
  c.globalAlpha = 1;

  /* Modelul tapetului: flăcărui mici, culcate, care urcă pe perete. Se rărește
     spre margini, odată cu lumina — un model care s-ar vedea la fel de tare și
     în umbră ar strica adâncimea sălii. */
  for (let k = 0; k < 420; k++) {
    const a = samanta(3100 + k * 3.1), b = samanta(3160 + k * 7.7);
    const jos = temeliaPeretelui(a, g.orizontul), sus = cornisaPeretelui(a);
    const x = W * a, y = sus + (jos - sus) * b;
    const fata = Math.sin(a * Math.PI);
    if (samanta(3220 + k * 5.3) > 0.25 + fata * 0.65) continue;
    const r = Math.min(W, H) * (0.006 + b * 0.005);
    c.globalAlpha = 0.12 + fata * 0.16;
    c.fillStyle = [ROSU_ADANC, PORTOCALIU, GALBEN_LUMINA][k % 3];
    c.beginPath();
    c.moveTo(x, y - r * 1.6);
    c.quadraticCurveTo(x + r, y - r * 0.2, x, y + r);
    c.quadraticCurveTo(x - r, y - r * 0.2, x, y - r * 1.6);
    c.fill();
  }
  c.globalAlpha = 1;

  /* Pasta de pe pereți. Peste tapetul zugrăvit trec tușele, ca și cum toată sala
     ar fi fost pictată cu pensula, nu vopsită cu rola. Ele urmează curbura
     peretelui — culcate spre orizontală în mijloc, unde peretele vine drept spre
     tine, și tot mai înclinate spre margini, unde fuge în adâncime. Din
     îndreptarea asta se citește rotundul a doua oară, după lese.

     Culoarea fiecărei tușe se ia din locul ei, nu la sorți: aprinsă în mijloc,
     unde bate focul, brună spre margini. La sorți, peretele ar fi ieșit pestriț
     și clarobscurul pictat cu grijă în gradient s-ar fi pierdut sub el. */
  /* Puține și mari, nu multe și mărunte. Cu șase sute de fleculețe peretele
     ieșea zgrunțuros, ca o tencuială stropită — se vedea zgomot, nu pensulă. O
     tușă trebuie să fie destul de lată cât să se citească drept urmă de pensulă
     de la locul unde stai. */
  const PETE_PERETE = 300;
  for (let k = 0; k < PETE_PERETE; k++) {
    const a = samanta(3700 + k * 3.3), b = samanta(3770 + k * 6.7);
    const jos = temeliaPeretelui(a, g.orizontul), sus = cornisaPeretelui(a);
    const x = W * a, y = sus + (jos - sus) * b;
    const fata = Math.sin(a * Math.PI);           // 1 în mijloc, 0 pe margini
    const departe = 1 - fata;
    const culoare = fata > 0.86 ? GALBEN_LUMINA
                  : (fata > 0.62 ? GALBEN_SALA
                  : (fata > 0.36 ? PORTOCALIU
                  : (fata > 0.18 ? ROSU_ADANC : BRUN_UMBRA)));
    /* Tușele de sus, de sub cornișă, se culcă spre boltă; cele de jos stau mai
       drept. Nu e un capriciu: pensula unui zugrav de boltă merge pe unde merge
       zidul. */
    const unghi = (a - 0.5) * 1.9 + (b - 0.55) * 1.3;
    const lung = Math.min(W, H) * (0.05 + b * 0.06) * (0.5 + fata * 0.8);
    c.globalAlpha = 0.13 + fata * 0.20 + samanta(3840 + k * 4.1) * 0.10;
    pataDePasta(c, x, y, lung, lung * (0.24 + a * 0.10), unghi, culoare, 1,
                0.5 + fata * 0.5);
  }
  /* Peste ele, câteva zeci de tușe apăsate — cele care se văd din capătul sălii
     și care spun că peretele **a fost pictat**, nu vopsit. Puse cu aceeași
     socoteală ca celelalte, dar cu pensula încărcată. */
  for (let k = 0; k < 46; k++) {
    const a = samanta(3960 + k * 7.9), b = samanta(4020 + k * 4.7);
    const jos = temeliaPeretelui(a, g.orizontul), sus = cornisaPeretelui(a);
    const x = W * a, y = sus + (jos - sus) * b;
    const fata = Math.sin(a * Math.PI);
    if (fata < 0.22) continue;                   // în umbra de la margini n-are ce căuta
    const lung = Math.min(W, H) * (0.09 + b * 0.07) * fata;
    c.globalAlpha = 0.16 + fata * 0.18;
    /* Galbenul cel mai deschis numai chiar în mijloc. Împărțit mai larg, tușele
       apăsate se adunau într-un nor alburiu deasupra lucrării — și ochiul se
       ducea la nor, nu la foc. */
    pataDePasta(c, x, y, lung, lung * 0.3, (a - 0.5) * 1.9 + (b - 0.55) * 1.1,
                fata > 0.88 ? GALBEN_LUMINA : (fata > 0.5 ? PORTOCALIU : ROSU_ADANC),
                1, 1);
  }
  c.globalAlpha = 1;

  /* Soclul rotund: o bandă care se încovoaie în sus la capete. Linia asta e
     singurul lucru care spune limpede că peretele e curbat — dreaptă, sala ar
     rămâne o cutie oricât de bine ar fi vopsită. */
  c.fillStyle = BRUN_UMBRA;
  c.beginPath();
  for (let k = 0; k <= 60; k++) {
    const u = k / 60, y = temeliaPeretelui(u, g.orizontul) - H * 0.032;
    if (k === 0) c.moveTo(W * u, y); else c.lineTo(W * u, y);
  }
  for (let k = 60; k >= 0; k--) {
    const u = k / 60;
    c.lineTo(W * u, temeliaPeretelui(u, g.orizontul) + H * 0.004);
  }
  c.closePath();
  c.fill();

  podeaDeSah(c, g);
  blanaDeSubSevalet(c, g);
  panouDeSala(c, g.panouStangaX, g.panouY, g.panouLat, g.panouInalt);
  fisaPePanou(c, g.panouStangaX, g.panouY, g.panouLat, g.panouInalt,
              'Expresionism', TEXT_FISA_EXPRESIONISM, 0, false);
}

/* Pardoseala în tablă de șah, care fuge spre fundul sălii.

   Rândurile nu sunt egale: se strâng spre fund, fiindcă asta face depărtarea.
   Iar marginea din fund nu e dreaptă, ci se încovoaie în sus la capete, ca și
   soclul — pardoseala unei săli rotunde se termină pe un arc, nu pe o dungă. */
function podeaDeSah(c, g) {
  const RANDURI = 12, COLOANE = 14;
  const sus = g.orizontul, jos = H + H * 0.02;

  c.save();
  // pardoseala se oprește la peretele din fund, care e curbat
  c.beginPath();
  c.moveTo(-W, jos + H);
  c.lineTo(-W, temeliaPeretelui(0, sus));
  for (let k = 0; k <= 60; k++) {
    const u = k / 60;
    c.lineTo(W * u, temeliaPeretelui(u, sus));
  }
  c.lineTo(W * 2, temeliaPeretelui(1, sus));
  c.lineTo(W * 2, jos + H);
  c.closePath();
  c.clip();

  for (let r = 0; r < RANDURI; r++) {
    /* Adâncimea crește neliniar: pătrățelele din fund sunt mult mai scunde decât
       cele de sub tine. La pas egal, pardoseala ar arăta ca o față de masă. */
    const t0 = Math.pow(r / RANDURI, 1.9);
    const t1 = Math.pow((r + 1) / RANDURI, 1.9);
    const y0 = intre(sus - H * 0.02, jos, t0), y1 = intre(sus - H * 0.02, jos, t1);
    const lat0 = intre(g.latSus, W * 1.9, t0);
    const lat1 = intre(g.latSus, W * 1.9, t1);
    /* Se pictează **amândouă** felurile de pătrate. Întâi se puneau numai cele
       închise, iar prin celelalte se vedea peretele — de-aia jumătate din tabla
       de șah ieșea portocalie. Un alb care e de fapt tapetul de dedesubt nu e un
       alb. */
    for (let k = 0; k < COLOANE; k++) {
      const u0 = k / COLOANE, u1 = (k + 1) / COLOANE;
      c.fillStyle = ((r + k) % 2 === 0) ? ALB_PODEA : NEGRU_PODEA;
      c.beginPath();
      c.moveTo(W * 0.5 + (u0 - 0.5) * lat0, y0);
      c.lineTo(W * 0.5 + (u1 - 0.5) * lat0, y0);
      c.lineTo(W * 0.5 + (u1 - 0.5) * lat1, y1);
      c.lineTo(W * 0.5 + (u0 - 0.5) * lat1, y1);
      c.closePath();
      c.fill();
    }
  }

  /* Pe pardoseală cade lumina focului: un oval cald care se stinge spre margini.
     Fără el, tabla de șah e un desen tehnic lipit sub perete. */
  /* Lumina focului cade și pe pardoseală, dar **puțin**: cât să se vadă că vine
     de undeva, nu cât să vopsească tabla de șah. Turnată gros — cum era întâi —
     albul se făcea portocaliu și negrul maro, și se pierdea singurul reper neutru
     din sală. Umbra de la margini rămâne mai apăsată decât lumina din mijloc:
     clarobscur, nu vopsea. */
  const balta = c.createRadialGradient(W * 0.5, sus + H * 0.06, 0,
                                       W * 0.5, sus + H * 0.06, H * 0.66);
  balta.addColorStop(0, 'rgba(255, 208, 130, 0.14)');
  balta.addColorStop(0.45, 'rgba(224, 140, 60, 0.07)');
  balta.addColorStop(1, 'rgba(24, 12, 6, 0.5)');
  c.fillStyle = balta;
  c.fillRect(-W, sus - H * 0.05, W * 3, jos - sus + H * 0.1);
  c.restore();
}

/* ---------- BLANA DE PE JOS ---------- */
/* O blană întinsă sub șevalet și sub măsuță, cu firul lung.

   Nu e un ornament. Tabla de șah e rece ca socoteală — e reperul neutru după
   care ochiul judecă restul — și tocmai de-aia sala, cu foc cu tot, rămânea o
   încăpere de muzeu în care nu ți-ar veni să stai. O blană pe jos, în fața
   focului, e primul lucru care spune „aici se stă": strânge șevaletul și măsuța
   într-un singur loc locuit, în loc de două obiecte lăsate pe o pardoseală.

   Cade și ea sub regula sălii: cremul și brunul ei au mai mult roșu decât
   albastru, deci nu răcesc nimic. */
/* Nu crem-alb. Prima blană era aproape albă și, întinsă peste tabla de șah, arăta
   a baltă de var: cea mai deschisă valoare din toată sala, adică exact ce nu
   trebuie pe jos, unde ochiul n-are ce căuta. Un miere ars, cu umbre brune, stă
   sub lucrare fără să i-o ia înainte — și e cald, ca tot restul sălii. */
const BLANA_CLARA = '#c99b56';
const BLANA_UMBRA = '#6b3f1c';
const BLANA_VARF  = '#e8c68c';   // firele care prind lumina focului

function geomBlana() {
  const g = geomSala6();
  /* Ține de la măsuță până dincolo de piciorul din dreapta al șevaletului, și e
     destul de adâncă cât să se vadă că e un covor, nu un preș. Marginea de jos
     rămâne în ecran: o blană tăiată de rama ferestrei nu mai e un loc, e o
     pată. */
  const stanga = g.masaX - g.masaLat * 0.72;
  const dreapta = W * 0.5 + g.tablouLat * 0.46;
  const ry = H * 0.10;
  return {
    cx: (stanga + dreapta) / 2,
    cy: Math.min(H - ry * 1.2, g.sevaletTalpa - H * 0.005),
    rx: (dreapta - stanga) / 2,
    ry
  };
}

function blanaDeSubSevalet(c, g) {
  const b = geomBlana();

  /* Umbra de dedesubt, întâi: fără ea blana e un decupaj lipit pe pardoseală. */
  c.save();
  const umbra = c.createRadialGradient(b.cx, b.cy + b.ry * 0.2, 0,
                                       b.cx, b.cy + b.ry * 0.2, b.rx * 1.05);
  umbra.addColorStop(0, 'rgba(20, 10, 4, 0.5)');
  umbra.addColorStop(1, 'rgba(20, 10, 4, 0)');
  c.fillStyle = umbra;
  c.beginPath();
  c.ellipse(b.cx, b.cy + b.ry * 0.22, b.rx * 1.05, b.ry * 0.95, 0, 0, Math.PI * 2);
  c.fill();

  /* Conturul. O blană n-are marginea netedă: are labe, are crestături, are
     locuri unde firul se adună. Un oval curat ar arăta a covor de baie. */
  const PUNCTE = 64;
  c.beginPath();
  for (let k = 0; k <= PUNCTE; k++) {
    const ang = (k / PUNCTE) * Math.PI * 2;
    const val = 1
      + 0.15 * Math.sin(ang * 2.0 + 0.9)
      + 0.10 * Math.sin(ang * 3.0 + 2.2)
      + 0.06 * Math.sin(ang * 5.0 + 4.4);
    const x = b.cx + Math.cos(ang) * b.rx * val;
    const y = b.cy + Math.sin(ang) * b.ry * val;
    if (k === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  c.closePath();
  c.save();
  c.clip();

  // pielea: mai deschisă în mijloc, unde bate focul
  const piele = c.createRadialGradient(b.cx, b.cy - b.ry * 0.35, 0,
                                       b.cx, b.cy, b.rx);
  piele.addColorStop(0, BLANA_VARF);
  piele.addColorStop(0.45, BLANA_CLARA);
  piele.addColorStop(1, BLANA_UMBRA);
  c.fillStyle = piele;
  c.fillRect(b.cx - b.rx * 1.4, b.cy - b.ry * 1.4, b.rx * 2.8, b.ry * 2.8);

  /* Firul. Sute de peri scurți, pieptănați dinspre mijloc spre margini — cum stă
     firul pe o blană întinsă. Culcați toți la fel, ar fi o hașură; pieptănați din
     centru, se vede că e un animal, nu o pătură. */
  for (let k = 0; k < 1500; k++) {
    const a = samanta(4300 + k * 3.1), d = Math.sqrt(samanta(4370 + k * 5.3));
    const e = samanta(4430 + k * 7.1);
    const ang = a * Math.PI * 2;
    const x = b.cx + Math.cos(ang) * b.rx * d;
    const y = b.cy + Math.sin(ang) * b.ry * d;
    const lung = b.ry * (0.10 + e * 0.14);
    // firul se culcă în direcția în care e pieptănat, turtit de perspectivă
    const unghi = Math.atan2(Math.sin(ang) * b.ry, Math.cos(ang) * b.rx);
    c.globalAlpha = 0.14 + e * 0.28;
    c.strokeStyle = e > 0.7 ? BLANA_VARF : (e > 0.34 ? BLANA_CLARA : BLANA_UMBRA);
    c.lineWidth = Math.max(0.7, b.ry * 0.012);
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(unghi) * lung, y + Math.sin(unghi) * lung * 0.55);
    c.stroke();
  }
  c.globalAlpha = 1;

  // petele brune ale blănii, câteva, moi
  for (let k = 0; k < 7; k++) {
    const a = samanta(4500 + k * 9.7), d = samanta(4560 + k * 4.3) * 0.7;
    const ang = a * Math.PI * 2;
    c.globalAlpha = 0.16;
    c.fillStyle = BLANA_UMBRA;
    c.beginPath();
    c.ellipse(b.cx + Math.cos(ang) * b.rx * d, b.cy + Math.sin(ang) * b.ry * d,
              b.rx * (0.06 + a * 0.07), b.ry * (0.12 + a * 0.16),
              ang, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
  c.restore();

  /* Marginea: firul care iese din contur, altfel blana rămâne tăiată cu
     foarfeca. Se desenează după clip, tocmai ca să treacă peste linie. */
  for (let k = 0; k < 260; k++) {
    const ang = (k / 260) * Math.PI * 2;
    const e = samanta(4620 + k * 3.9);
    const val = 1
      + 0.15 * Math.sin(ang * 2.0 + 0.9)
      + 0.10 * Math.sin(ang * 3.0 + 2.2)
      + 0.06 * Math.sin(ang * 5.0 + 4.4);
    const x = b.cx + Math.cos(ang) * b.rx * val;
    const y = b.cy + Math.sin(ang) * b.ry * val;
    const lung = b.ry * (0.06 + e * 0.13);
    const unghi = Math.atan2(Math.sin(ang) * b.ry, Math.cos(ang) * b.rx);
    c.globalAlpha = 0.28 + e * 0.34;
    c.strokeStyle = e > 0.55 ? BLANA_VARF : BLANA_UMBRA;
    c.lineWidth = Math.max(0.7, b.ry * 0.014);
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(unghi) * lung, y + Math.sin(unghi) * lung * 0.6);
    c.stroke();
  }
  c.globalAlpha = 1;
  c.restore();
}

/* Ancadramentul unui panou de perete: o ramă simplă de stuc aurit. Fișele de
   sală se scriu peste el, ca picturi murale — la fel ca în sălile de dinainte. */
function panouDeSala(c, x, y, w, h) {
  c.save();
  c.fillStyle = 'rgba(94, 36, 16, 0.4)';
  dreptunghiIn(c, x - w * 0.02, y - h * 0.015, w * 1.04, h * 1.03, w * 0.03);
  c.fill();
  c.strokeStyle = AUR_RAMA6;
  c.lineWidth = Math.max(1.4, w * 0.016);
  dreptunghiIn(c, x, y, w, h, w * 0.02);
  c.stroke();
  c.restore();
}

/* ---------- ȘEVALETUL ---------- */
const LEMN_SEVALET  = '#7a3f1c';
const LEMN_LUMINA6  = '#a35f2c';
const LEMN_UMBRA6   = '#4a2410';
const FIER_SEVALET  = '#3a2a1e';

/* O grindă de lemn, cu latura luminată și cea din umbră. Toate piesele
   șevaletului sunt grinzi; desenate cu o singură culoare plată, ar arăta a schelă
   de sârmă, nu a lemn masiv de atelier. */
function grindaSevalet(c, x, y, lat, lung, unghi) {
  c.save();
  c.translate(x, y);
  c.rotate(unghi || 0);
  const lemn = c.createLinearGradient(-lat / 2, 0, lat / 2, 0);
  lemn.addColorStop(0, LEMN_LUMINA6);
  lemn.addColorStop(0.42, LEMN_SEVALET);
  lemn.addColorStop(1, LEMN_UMBRA6);
  c.fillStyle = lemn;
  c.fillRect(-lat / 2, 0, lat, lung);
  c.restore();
}

/* Șevaletul de atelier: două picioare din față ușor răsfirate, un picior din
   spate care ține tot, traverse între ele, catargul din mijloc pe care urcă și
   coboară polița, manivela cu roata ei dințată și rotile de jos.

   E o mașinărie, nu o cruce de scânduri: tocmai piesele care se mișcă — polița,
   clema de sus, manivela — spun că pânza de pe el e o lucrare, nu un exponat. */
function sevaletul(c, g, acum) {
  const cx = W * 0.5;
  const talpa = g.sevaletTalpa;
  /* Picioarele urcă până sub muchia de sus a pânzei, nu deasupra ei. Cât pânza
     era îngustă, ele stăteau strânse lângă catarg și ieșeau pe deasupra fără să
     supere. Pe una culcată, aceleași două picioare răsărite peste ramă arătau ca
     o poartă de fotbal: două bare verticale de-o parte și de alta a lucrării.
     Deasupra rămâne numai catargul cu clema — atât cât are un șevalet. */
  const sus = g.tablouY + g.tablouInalt * 0.06;
  const inalt = talpa - sus;
  const gros = Math.max(3, W * 0.011);
  const desfacere = g.tablouLat * 0.52;      // cât se răsfiră picioarele jos

  // piciorul din spate, primul: stă în spatele tuturor
  c.save();
  const unghiSpate = 0.26;
  grindaSevalet(c, cx + g.tablouLat * 0.30, sus + inalt * 0.16,
                gros * 0.9, inalt * 0.9, unghiSpate);
  c.restore();
  // roata piciorului din spate
  rotitaSevalet(c, cx + g.tablouLat * 0.30 + Math.sin(unghiSpate) * inalt * 0.9,
                sus + inalt * 0.16 + Math.cos(unghiSpate) * inalt * 0.9, gros * 1.1);

  // cele două picioare din față
  for (const lat of [-1, 1]) {
    const unghi = lat * 0.085;
    grindaSevalet(c, cx + lat * g.tablouLat * 0.30 - Math.sin(unghi) * inalt * 0.02,
                  sus, gros, inalt, unghi);
    rotitaSevalet(c, cx + lat * desfacere * 0.5, talpa, gros * 1.15);
  }

  // traversele: trei, tot mai late spre poale, ca picioarele să nu se depărteze
  for (const q of [0.30, 0.62, 0.88]) {
    const y = sus + inalt * q;
    const lat = g.tablouLat * 0.60 + q * desfacere * 0.36;
    c.fillStyle = LEMN_SEVALET;
    c.fillRect(cx - lat / 2, y, lat, gros * 0.72);
    c.fillStyle = 'rgba(255, 214, 150, 0.22)';
    c.fillRect(cx - lat / 2, y, lat, gros * 0.2);
  }

  /* Catargul din mijlocul șevaletului. El e singurul care trece peste pânză, în
     spatele ei, și iese puțin pe deasupra — de el se prinde clema. */
  grindaSevalet(c, cx, g.tablouY - g.tablouInalt * 0.13,
                gros * 0.85, inalt * 0.72 + g.tablouInalt * 0.19, 0);

  // polița pe care se sprijină pânza
  const politaY = g.tablouY + g.tablouInalt;
  /* Polița iese de sub pânză cât să se vadă că o ține, nu cât să facă o
     scândură. Când pânza era îngustă și înaltă, un adaos de patruzeci la sută
     din lățimea ei era o palmă de fiecare parte; pe una culcată, aceeași
     socoteală ar fi ieșit o bancă. */
  const politaLat = g.tablouLat * 1.10;
  c.fillStyle = LEMN_SEVALET;
  c.fillRect(cx - politaLat / 2, politaY, politaLat, gros * 1.5);
  c.fillStyle = LEMN_LUMINA6;
  c.fillRect(cx - politaLat / 2, politaY, politaLat, gros * 0.42);
  // buza poliței, care ține pânza să nu alunece
  c.fillStyle = LEMN_UMBRA6;
  c.fillRect(cx - politaLat / 2, politaY - gros * 0.9, politaLat, gros * 0.9);

  // manivela cu roata ei, pe catarg
  const manX = cx + gros * 1.2, manY = politaY - g.tablouInalt * 0.26;
  c.fillStyle = FIER_SEVALET;
  c.beginPath();
  c.arc(manX, manY, gros * 1.25, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = FIER_SEVALET;
  c.lineWidth = Math.max(1.5, gros * 0.34);
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(manX, manY);
  c.lineTo(manX + gros * 2.1, manY + gros * 1.5);
  c.stroke();
  c.beginPath();
  c.arc(manX + gros * 2.1, manY + gros * 1.5, gros * 0.5, 0, Math.PI * 2);
  c.fillStyle = '#8a6a3a';
  c.fill();

  // clema de sus, care apasă pe rama pânzei
  const clemaY = g.tablouY - gros * 0.8;
  c.fillStyle = LEMN_SEVALET;
  c.fillRect(cx - g.tablouLat * 0.10, clemaY - gros * 1.6, g.tablouLat * 0.20, gros * 1.6);
  c.fillStyle = FIER_SEVALET;
  c.fillRect(cx - g.tablouLat * 0.03, clemaY - gros * 3.2, g.tablouLat * 0.06, gros * 1.8);
}

function rotitaSevalet(c, x, y, r) {
  c.fillStyle = FIER_SEVALET;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#6b5a48';
  c.beginPath();
  c.arc(x, y, r * 0.4, 0, Math.PI * 2);
  c.fill();
}

/* ---------- RAMA PREȚIOASĂ ---------- */
/* Aceeași sculptură de brâuri ca în galeria a patra și în sala a cincea. Se
   pictează o dată, la o mărime de referință, și pe urmă se întinde: brâurile ei
   sunt sute de ornamente, iar sculptate din nou la fiecare cadru ar costa cât
   toată sala.

   Culcată, ca lucrarea din ea. Rama de referință trebuie să aibă chiar
   proporțiile pânzei: întinsă dintr-una înaltă peste una lată, sculptura de pe
   laturi s-ar lăți de două ori mai mult decât cea de sus și de jos, și s-ar
   vedea de la prima privire că e aceeași floare turtită. */
const ramaFocului = { panza: null, marg: 0, latime: 0, inaltime: 0 };
const PROFIL_RAMA6 = 0.085;

function pregatesteRamaFocului() {
  if (ramaFocului.panza) return ramaFocului;
  const lat = 1024, inalt = Math.round(lat * 0.68);
  const marg = Math.round(lat * PROFIL_RAMA6);
  const p = document.createElement('canvas');
  p.width = lat + marg * 2; p.height = inalt + marg * 2;
  const pc = p.getContext('2d');
  pictezaRama(pc, { ramaX: p.width / 2, ramaY: p.height / 2, ramaW: lat, ramaH: inalt },
              1, PROFIL_RAMA6);
  /* Golim deschiderea: rama se așază **peste** pictură, deci prin mijlocul ei
     trebuie să se vadă focul. */
  const gol = Math.round(lat * PROFIL_RAMA6);
  pc.clearRect(marg + gol, marg + gol, lat - gol * 2, inalt - gol * 2);
  ramaFocului.panza = p; ramaFocului.marg = marg;
  ramaFocului.latime = lat; ramaFocului.inaltime = inalt;
  return ramaFocului;
}

/* ---------- MĂSUȚA CU MĂNUȘI ---------- */
/* Stă în dreapta șevaletului, pe pardoseală. Sub pânză n-avea unde: șevaletul își
   ține picioarele acolo. */
function masaCuManusi(c, g) {
  const gros = Math.max(3, W * 0.009);
  /* Blatul văzut ușor de sus: latura din față mai lată decât cea din fund, ca la
     orice lucru privit de la înălțimea ochiului. Patru picioare, nu două: cu două
     arăta a bancă, iar mănușile păreau uitate pe o scândură. */
  const adanc = g.masaInalt * 0.28;
  // picioarele din spate, întâi
  c.fillStyle = '#4a2410';
  for (const lat of [-0.36, 0.36]) {
    c.fillRect(g.masaX + g.masaLat * lat * 0.82 - gros * 0.5, g.masaY - adanc,
               gros, g.masaInalt * 0.92);
  }
  // blatul
  c.fillStyle = '#6b3a1c';
  c.beginPath();
  c.moveTo(g.masaX - g.masaLat * 0.5, g.masaY);
  c.lineTo(g.masaX + g.masaLat * 0.5, g.masaY);
  c.lineTo(g.masaX + g.masaLat * 0.40, g.masaY - adanc);
  c.lineTo(g.masaX - g.masaLat * 0.40, g.masaY - adanc);
  c.closePath();
  c.fill();
  c.fillStyle = '#a3652f';
  c.fillRect(g.masaX - g.masaLat * 0.5, g.masaY, g.masaLat, gros * 1.2);
  c.fillStyle = '#3a1c0c';
  c.fillRect(g.masaX - g.masaLat * 0.5, g.masaY + gros * 1.2, g.masaLat, gros * 0.5);
  // picioarele din față
  c.fillStyle = '#5a2f16';
  for (const lat of [-0.44, 0.44]) {
    c.fillRect(g.masaX + g.masaLat * lat - gros * 0.6, g.masaY + gros * 1.7,
               gros * 1.2, g.masaInalt * 0.88);
  }
  // traversa dintre ele
  c.fillStyle = '#4a2410';
  c.fillRect(g.masaX - g.masaLat * 0.44, g.masaY + g.masaInalt * 0.66,
             g.masaLat * 0.88, gros * 0.8);
}

/* Mănușile. Se desenează separat de masă fiindcă dispară de pe ea când le iei. */
function deseneazaManusi(acum) {
  if (s6.manusiPuse) return;
  const m = geomManusi();
  /* Cât de tare cheamă. Când ai atins pânza cu mâna goală, mănușile pulsează —
     e singurul lucru din sală care se mișcă atunci, deci ochiul se duce la ele
     fără să fie nevoie de o săgeată desenată. */
  const cheama = 0.35 + 0.65 * Math.min(1, s6.frige + s6.refuzuri * 0.2);
  const bat = 0.5 + 0.5 * Math.sin(acum * 0.006);

  ctx.save();
  const halo = ctx.createRadialGradient(m.x, m.y - m.r * 0.3, 0,
                                        m.x, m.y - m.r * 0.3, m.r * 2.2);
  halo.addColorStop(0, `rgba(255, 226, 150, ${0.34 * cheama * bat})`);
  halo.addColorStop(1, 'rgba(255, 226, 150, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(m.x, m.y - m.r * 0.3, m.r * 2.2, 0, Math.PI * 2);
  ctx.fill();

  for (const lat of [-1, 1]) {
    manusaDeProtectie(ctx, m.x + lat * m.r * 0.52, m.y - m.r * 0.42, m.r * 0.86, lat);
  }
  ctx.restore();
}

/* O mănușă de protecție, după modelul unei mănuși de lucru adevărate: dosul
   palmei într-un galben fluorescent, degetele cu dungi roșii, o platoșă de
   cauciuc cu patru bumbi peste articulații, iar restul negru, cu manșetă lată și
   o urechiușă de piele de care o tragi pe mână.

   Întâi era o mănușă de piele veche, ca de fierar. Arăta bine, dar nu spunea
   nimic: o mănușă maro pe o masă maro, într-o sală galbenă, nu se vede. Asta se
   vede de la celălalt capăt al sălii — și tocmai asta i se cere, fiindcă e
   singurul lucru din cameră pe care trebuie să-l găsești ca să poți merge mai
   departe. Galbenul ei e tot cald, deci nu strică regula sălii; roșul, cu atât
   mai mult.

   Se face dintr-un singur contur închis, ca mânuța-balon din deschidere: două
   forme lipite ar lăsa o cusătură pe unde se suprapun. */
const MANUSA_NEGRU  = '#191919';
const MANUSA_GALBEN = '#d8e42a';
const MANUSA_ROSU   = '#d2202a';
const MANUSA_PLATOSA = '#3c3c3e';

function siluetaManusii(c, s) {
  c.beginPath();
  c.moveTo(-s * 0.36, s * 0.66);                       // colțul de jos al manșetei
  c.lineTo(-s * 0.33, -s * 0.10);
  c.quadraticCurveTo(-s * 0.34, -s * 0.60, -s * 0.16, -s * 0.66);
  c.quadraticCurveTo(-s * 0.02, -s * 0.70, s * 0.02, -s * 0.40);
  c.quadraticCurveTo(s * 0.10, -s * 0.68, s * 0.20, -s * 0.60);
  c.quadraticCurveTo(s * 0.30, -s * 0.52, s * 0.28, -s * 0.20);
  c.quadraticCurveTo(s * 0.54, -s * 0.30, s * 0.56, s * 0.00);  // degetul mare
  c.quadraticCurveTo(s * 0.58, s * 0.26, s * 0.32, s * 0.24);
  c.lineTo(s * 0.32, s * 0.66);
  c.closePath();
}

function manusaDeProtectie(c, x, y, s, lat) {
  c.save();
  c.translate(x, y);
  c.scale(lat, 1);

  // corpul negru
  siluetaManusii(c, s);
  const negru = c.createLinearGradient(-s * 0.36, -s * 0.7, s * 0.5, s * 0.66);
  negru.addColorStop(0, '#33322e');
  negru.addColorStop(0.5, MANUSA_NEGRU);
  negru.addColorStop(1, '#0d0d0c');
  c.fillStyle = negru;
  c.fill();

  /* Tot ce urmează stă **înăuntrul** siluetei: panoul galben, dungile roșii,
     platoșa. Tăiate așa, nu trebuie potrivite pe contur una câte una — și nu se
     revarsă peste margine când se schimbă forma mâinii. */
  c.save();
  siluetaManusii(c, s);
  c.clip();

  // panoul galben de pe dosul palmei
  c.fillStyle = MANUSA_GALBEN;
  c.beginPath();
  c.moveTo(-s * 0.30, s * 0.34);
  c.quadraticCurveTo(-s * 0.32, -s * 0.30, -s * 0.14, -s * 0.42);
  c.lineTo(s * 0.26, -s * 0.42);
  c.quadraticCurveTo(s * 0.34, s * 0.02, s * 0.28, s * 0.34);
  c.closePath();
  c.fill();
  // și o limbă de galben pe degetul mare
  c.beginPath();
  c.ellipse(s * 0.42, s * 0.00, s * 0.13, s * 0.16, -0.3, 0, Math.PI * 2);
  c.fill();

  // dungile roșii de pe degete
  c.fillStyle = MANUSA_ROSU;
  for (let k = 0; k < 4; k++) {
    const dx = -s * 0.24 + k * s * 0.145;
    c.beginPath();
    c.ellipse(dx, -s * 0.50, s * 0.035, s * 0.15, 0.05 * (k - 1.5), 0, Math.PI * 2);
    c.fill();
  }

  // platoșa peste articulații: o plăcuță cu patru bumbi
  c.fillStyle = MANUSA_PLATOSA;
  dreptunghiIn(c, -s * 0.26, -s * 0.24, s * 0.52, s * 0.20, s * 0.07);
  c.fill();
  c.fillStyle = '#59595c';
  for (let k = 0; k < 4; k++) {
    c.beginPath();
    c.ellipse(-s * 0.185 + k * s * 0.123, -s * 0.14, s * 0.05, s * 0.075, 0, 0, Math.PI * 2);
    c.fill();
  }

  // banda neagră de peste încheietură și manșeta
  c.fillStyle = MANUSA_NEGRU;
  c.fillRect(-s * 0.36, s * 0.30, s * 0.7, s * 0.10);
  c.fillRect(-s * 0.36, s * 0.40, s * 0.7, s * 0.28);
  c.restore();

  // urechiușa de piele, singurul lucru care iese din siluetă
  c.fillStyle = '#a8662c';
  c.beginPath();
  c.ellipse(-s * 0.06, s * 0.74, s * 0.055, s * 0.10, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = MANUSA_NEGRU;
  c.beginPath();
  c.ellipse(-s * 0.06, s * 0.74, s * 0.022, s * 0.05, 0, 0, Math.PI * 2);
  c.fill();

  c.restore();
}

/* ---------- TABLOUL CARE PULSEAZĂ ---------- */
/* Noaptea, dealurile și pasta de sub ele nu se schimbă niciodată: numai focul se
   mișcă. Pictate la fiecare cadru, cele câteva sute de tușe ale fondului ar
   costa mai mult decât flăcările care chiar au nevoie să fie repictate. Stau pe
   ștampila lor, la mărimea pânzei, și se repictează numai când se schimbă
   fereastra. */
const fundalTablou = { panza: null, latime: 0, inaltime: 0 };

function pregatesteFundalTablou(w, h) {
  const lw = Math.max(2, Math.round(w)), lh = Math.max(2, Math.round(h));
  if (fundalTablou.panza && fundalTablou.latime === lw && fundalTablou.inaltime === lh) {
    return fundalTablou.panza;
  }
  const p = panzaDeLucru(fundalTablou, lw, lh);
  const c = p.getContext('2d');
  c.clearRect(0, 0, lw, lh);
  pictezaFundalTablou(c, lw, lh);
  fundalTablou.latime = lw; fundalTablou.inaltime = lh;
  return p;
}

/* Fondul lucrării, pictat în pastă.

   Aici se vede cel mai limpede ce are sala de spus. Un cer întins cu gradientul,
   oricât de frumos ar fi, e o suprafață lucioasă de sticlă — și atunci focul din
   mijloc, pus din tușe, pare lipit peste o fotografie. Puse amândouă din pastă,
   focul și noaptea sunt din același material, iar ochiul poate să judece ce
   deosebește o pată fierbinte de una rece: nu felul cum e pusă, ci valoarea ei.
   Asta e toată lecția scenei, și se dă fără un cuvânt scris. */
function pictezaFundalTablou(c, w, h) {
  // noaptea din jurul focului: brun ars, nu negru — și el e cald
  const noapte = c.createLinearGradient(0, 0, 0, h);
  noapte.addColorStop(0, '#3a1408');
  noapte.addColorStop(0.55, '#5e2410');
  noapte.addColorStop(1, '#2a0f06');
  c.fillStyle = noapte;
  c.fillRect(0, 0, w, h);

  // dealurile din fund, abia ghicite în lumina focului
  c.fillStyle = '#4a1c0c';
  c.beginPath();
  c.moveTo(0, h * 0.52);
  c.quadraticCurveTo(w * 0.3, h * 0.4, w * 0.56, h * 0.5);
  c.quadraticCurveTo(w * 0.8, h * 0.58, w, h * 0.46);
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.closePath();
  c.fill();

  /* Tușele. Cerul se pune cu pensula culcată, lat, în tușe lungi orizontale;
     pământul, mai scurte și mai apăsate. Culoarea fiecăreia se ia din cât de
     aproape e de foc — care stă jos, la mijloc — nu la sorți: altfel noaptea
     licărește peste tot deopotrivă și nu se mai știe de unde vine lumina. */
  const focX = w * 0.5, focY = h * 0.78;
  const raza = Math.hypot(w, h) * 0.55;
  for (let k = 0; k < 340; k++) {
    const a = samanta(4700 + k * 3.7), b = samanta(4770 + k * 5.1);
    const e = samanta(4830 + k * 6.9);
    const x = w * a, y = h * b;
    const aproape = Math.max(0, 1 - Math.hypot(x - focX, (y - focY) * 1.3) / raza);
    const cer = b < 0.5;
    const culoare = aproape > 0.72 ? '#c8551e'
                  : (aproape > 0.5 ? '#8e3216'
                  : (aproape > 0.3 ? '#5e2410' : '#3a1408'));
    const lung = Math.min(w, h) * (cer ? 0.10 + e * 0.16 : 0.06 + e * 0.10);
    const unghi = cer ? (e - 0.5) * 0.34 : (e - 0.5) * 1.1;
    c.globalAlpha = 0.14 + aproape * 0.34;
    pataDePasta(c, x, y, lung, lung * (0.2 + e * 0.16), unghi, culoare, 1,
                0.3 + aproape * 0.7);
  }
  c.globalAlpha = 1;
}

function deseneazaTabloulFocului(acum) {
  const g = geomSala6();
  const x = g.tablouX, y = g.tablouY, w = g.tablouLat, h = g.tablouInalt;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.drawImage(pregatesteFundalTablou(w, h), x, y, w, h);

  const focX = x + w * 0.5, focY = y + h * 0.78;
  const marimeFoc = h * 0.5;
  /* Pulsul. Două bătăi puse una peste alta, cu perioade care nu se împart una la
     alta: una lentă, ca respirația jarului, alta iute, ca limba de flacără. Dacă
     ar fi una singură, focul ar clipi ca un bec stricat. */
  const puls = 1 + 0.09 * Math.sin(acum * 0.0031) + 0.06 * Math.sin(acum * 0.0113);

  // jarul de sub lemne: pata cea mai fierbinte din tot tabloul
  const jar = ctx.createRadialGradient(focX, focY, 0, focX, focY, marimeFoc * 1.5 * puls);
  jar.addColorStop(0, 'rgba(255, 244, 196, 0.95)');
  jar.addColorStop(0.16, 'rgba(255, 186, 60, 0.85)');
  jar.addColorStop(0.44, 'rgba(221, 106, 30, 0.55)');
  jar.addColorStop(1, 'rgba(168, 50, 26, 0)');
  ctx.fillStyle = jar;
  ctx.fillRect(x, y, w, h);

  // lemnele, două bârne încrucișate
  ctx.strokeStyle = '#2a1408';
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(2, h * 0.05);
  for (const lat of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(focX + lat * w * 0.15, focY + h * 0.07);
    ctx.lineTo(focX - lat * w * 0.06, focY - h * 0.06);
    ctx.stroke();
  }

  /* Limbile de flacără: pete lungi, culcate pe verticală, tot mai deschise spre
     mijloc. Se mișcă fiecare pe socoteala ei, dar dintr-o sămânță fixă — la
     întâmplare curată, focul ar fierbe, nu ar arde. */
  /* Culoarea nu se ia din sămânța tușei, ci din locul ei: cu cât o limbă e mai
     aproape de axul focului, cu atât e mai fierbinte. Legată de sămânță — cum era
     întâi — ieșeau limbi albe pe margine și roșii în mijloc, adică un foc care nu
     știe unde îi e inima. Albul rămâne numai pentru miez; e cea mai tare valoare
     din tot tabloul, și dacă se împrăștie nu mai arde nimic. */
  for (let k = 0; k < 96; k++) {
    const a = samanta(3400 + k * 3.7), b = samanta(3460 + k * 5.9);
    const departeDeAx = Math.abs(a - 0.5) * 2;       // 0 în ax, 1 la margine
    const unda = Math.sin(acum * (0.0022 + b * 0.0035) + k * 1.7);
    const fx = focX + (a - 0.5) * w * 0.30 + unda * w * 0.024;
    // limbile din mijloc sunt și cele mai înalte: focul are formă de flacără
    const inaltime = marimeFoc * (0.22 + b * 0.5 + (1 - departeDeAx) * 0.5) * puls;
    const fy = focY - inaltime * (0.3 + b * 0.34);
    const caldura = (1 - departeDeAx) * 0.75 + (1 - b) * 0.25;
    const culoare = caldura > 0.84 ? '#fff6d2' : (caldura > 0.62 ? '#ffcb52'
                  : (caldura > 0.38 ? '#ef8420' : (caldura > 0.2 ? '#c8481c' : '#8e2a16')));
    ctx.globalAlpha = 0.3 + b * 0.34;
    tusa(ctx, fx, fy, inaltime * 0.92, w * (0.018 + b * 0.03),
         -1.5708 + unda * 0.2, culoare, 1);
  }
  ctx.globalAlpha = 1;

  // scântei care urcă: punctele care se desprind din pată și pleacă singure
  for (let k = 0; k < 16; k++) {
    const a = samanta(3600 + k * 4.3);
    const urcare = ((acum * (0.00013 + a * 0.00017) + a) % 1);
    const sx = focX + (a - 0.5) * w * 0.4 + Math.sin(acum * 0.003 + k) * w * 0.02;
    const sy = focY - urcare * h * 0.62;
    ctx.globalAlpha = (1 - urcare) * 0.85;
    ctx.fillStyle = urcare < 0.4 ? '#fff0b8' : '#e8802a';
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(0.7, h * 0.007 * (1 - urcare * 0.6)), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  /* Lumina care iese din tablou pe perete. Ea leagă pânza de sală: fără ea,
     tabloul e un afiș lipit, nu o sursă de lumină în cameră. */
  const revarsat = ctx.createRadialGradient(focX, focY, 0, focX, focY, Math.max(W, H) * 0.5);
  revarsat.addColorStop(0, `rgba(255, 190, 90, ${0.2 * puls})`);
  revarsat.addColorStop(0.4, 'rgba(255, 150, 60, 0.06)');
  revarsat.addColorStop(1, 'rgba(255, 150, 60, 0)');
  ctx.fillStyle = revarsat;
  ctx.fillRect(0, 0, W, H);

  /* Rama prețioasă, peste pânză. Se pune la urmă, ca umbra ei să cadă pe
     pictură, nu invers. */
  const st = pregatesteRamaFocului();
  const scara = w / st.latime;
  ctx.drawImage(st.panza,
                x - st.marg * scara, y - st.marg * scara,
                st.panza.width * scara, st.panza.height * scara);
}

/* ---------- ARSURA DIN PERETE ---------- */
/* Focul mănâncă tapetul de la un colț spre mijloc, iar în urma lui rămâne o gaură
   cu marginea încă aprinsă. Marginea aprinsă e tot ce trebuie ca să se creadă:
   o gaură cu conturul curat ar arăta tăiată cu foarfeca, nu arsă. */
/* Cât de departe de centru e marginea arsurii, la unghiul `ang`.

   Hârtia arsă nu are colțuri. Prima variantă lua la sorți o rază pentru fiecare
   dintre cele patruzeci și patru de puncte și le lega cu linii drepte — ieșea o
   roată dințată, un semn desenat, nu o gaură mâncată de foc. Ce trebuie e altceva:
   valuri lungi, câteva pe toată roata, peste care se pun altele mai mărunte. Trei
   sinusuri cu perioade care nu se împart una la alta fac exact asta, și nu se
   repetă niciodată vizibil. */
function razaArsurii(ang, r, acum) {
  const val = 1
    + 0.13 * Math.sin(ang * 2.0 + 0.7)
    + 0.09 * Math.sin(ang * 3.0 + 2.4)
    + 0.055 * Math.sin(ang * 5.0 + 4.1)
    + 0.03 * Math.sin(ang * 8.0 + 1.3)
    // și marginea mai fâlfâie puțin, ca și cum ar arde chiar acum
    + 0.018 * Math.sin(acum * 0.0021 + ang * 3.0);
  return r * val;
}

/* Conturul, tras cu curbe prin mijlocul dintre puncte. Legate cu drepte, chiar și
   niște raze line dau un poligon; trecute prin mijloace, dau o margine moale. */
function conturArsurii(c, cx, cy, r, acum, latime, inaltime) {
  const PUNCTE = 72;
  const kx = latime === undefined ? ARSURA_LAT : latime;
  const ky = inaltime === undefined ? ARSURA_INALT : inaltime;
  const p = [];
  for (let k = 0; k < PUNCTE; k++) {
    const ang = (k / PUNCTE) * Math.PI * 2;
    const raza = razaArsurii(ang, r, acum);
    p.push({ x: cx + Math.cos(ang) * raza * kx, y: cy + Math.sin(ang) * raza * ky });
  }
  c.beginPath();
  c.moveTo((p[0].x + p[PUNCTE - 1].x) / 2, (p[0].y + p[PUNCTE - 1].y) / 2);
  for (let k = 0; k < PUNCTE; k++) {
    const a = p[k], b = p[(k + 1) % PUNCTE];
    c.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
  }
  c.closePath();
}

function deseneazaArsura(acum) {
  if (s6.arsura <= 0) return;
  /* Locul și mărimea vin din `geomArsura`, ca să fie aceleași și la desen, și la
     atingere. Gaura stă pe peretele din dreapta, cu pragul pe pardoseală, și
     crește în sus dinspre colțul care a luat foc.

     Așezată în mijlocul peretelui din fund, cum era întâi, se ascundea pe
     jumătate în spatele șevaletului și arăta a gaură, nu a trecere: se vedea
     prin ea, dar nu se înțelegea că se poate intra. Pe latura din dreapta,
     sprijinită pe podea și cât un om de înaltă, se citește ușă — iar caldul de
     pe șevalet și recele din prag stau acum unul lângă altul, la aceeași
     înălțime, unde se compară cel mai bine. */
  const arsura = geomArsura(s6.arsura);
  const cx = arsura.cx, cy = arsura.cy, r = arsura.r;

  ctx.save();
  /* Tot ce urmează stă **în perete**. Marginea arsă fâlfâie, deci trece uneori
     de linia unde peretele întâlnește pardoseala — și atunci gaura se revarsă
     peste tabla de șah, ca o baltă. O ușă care curge pe jos nu mai e o ușă.
     Tăiem la peretele însuși, și pragul ei cade exact pe podea. */
  ctx.beginPath();
  ctx.moveTo(0, -H);
  ctx.lineTo(W, -H);
  for (let k = 60; k >= 0; k--) {
    const u = k / 60;
    ctx.lineTo(W * u, temeliaPeretelui(u, geomSala6().orizontul));
  }
  ctx.closePath();
  ctx.clip();

  // gaura: prin ea se vede spațiul următor, plin de cenușă albastră
  conturArsurii(ctx, cx, cy, r, acum);
  ctx.save();
  ctx.clip();
  /* Aici, și numai aici, sala are voie să fie rece. Toată scena a fost galben și
     roșu; cenușa albastră din gaură e prima culoare rece de cinci minute încoace,
     și de-aia se vede ca o fereastră deschisă iarna. */
  const adanc = ctx.createRadialGradient(cx, cy - r * 0.3, 0, cx, cy, r * 1.5);
  adanc.addColorStop(0, '#39465e');
  adanc.addColorStop(0.5, '#1a2233');
  adanc.addColorStop(1, '#0c1017');
  ctx.fillStyle = adanc;
  ctx.fillRect(cx - arsura.latime * 1.3, cy - arsura.inaltime * 1.3,
               arsura.latime * 2.6, arsura.inaltime * 2.6);

  // cenușa, fulgi albăstrui care se lasă încet
  for (let k = 0; k < 190; k++) {
    const a = samanta(3900 + k * 3.3), b = samanta(3960 + k * 6.1);
    const e = samanta(4020 + k * 5.7);
    const cade = ((acum * (0.00004 + a * 0.00009) + b) % 1);
    const fx = cx + (a - 0.5) * arsura.latime * 2.1 + Math.sin(acum * 0.0008 + k) * r * 0.06;
    const fy = cy - arsura.inaltime + cade * arsura.inaltime * 2.05;
    ctx.globalAlpha = (0.18 + b * 0.55) * (1 - Math.abs(cade - 0.5) * 0.6);
    ctx.fillStyle = e > 0.62 ? '#c7d2e4' : (e > 0.3 ? CENUSA_ALBASTRA : CENUSA_INCHISA);
    /* Fulgii nu-s bile: sunt fâșii subțiri de cenușă, culcate cum cad. */
    tusa(ctx, fx, fy, r * (0.03 + a * 0.05), r * (0.008 + e * 0.012),
         0.3 + (a - 0.5) * 1.2, ctx.fillStyle, 1);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  /* Marginea, încă vie. Trei treceri: jarul lat și stins pe dinafară, dunga de
     cărbune pe contur, și firicelul galben care mănâncă hârtia chiar acum. */
  ctx.save();
  ctx.shadowColor = 'rgba(255, 150, 40, 0.9)';
  ctx.shadowBlur = Math.max(6, r * 0.22);
  ctx.strokeStyle = 'rgba(60, 24, 10, 0.95)';
  ctx.lineWidth = Math.max(2, r * 0.055);
  conturArsurii(ctx, cx, cy, r, acum);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = `rgba(255, 196, 80, ${0.5 + 0.5 * Math.sin(acum * 0.005)})`;
  ctx.lineWidth = Math.max(1, r * 0.02);
  conturArsurii(ctx, cx, cy, r * 1.02, acum);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/* Colțul ecranului care ia foc. Nu e o metaforă: scânteia chiar sare din pânză
   până acolo, iar de acolo pornește arsura. */
function deseneazaColtulAprins(acum) {
  if (s6.colt <= 0) return;
  const p = Math.min(1, s6.colt);
  const r = Math.max(W, H) * 0.42 * p;
  ctx.save();
  const flacara = ctx.createRadialGradient(W, H, 0, W, H, r);
  flacara.addColorStop(0, `rgba(255, 240, 190, ${0.85 * p})`);
  flacara.addColorStop(0.2, `rgba(255, 170, 50, ${0.6 * p})`);
  flacara.addColorStop(0.6, `rgba(200, 70, 20, ${0.25 * p})`);
  flacara.addColorStop(1, 'rgba(200, 70, 20, 0)');
  ctx.fillStyle = flacara;
  ctx.fillRect(0, 0, W, H);

  // limbi care urcă pe marginea de jos-dreapta
  /* Flăcările stau lipite de colț și se sting cu cât se depărtează de el. Împrăștiate
     egal pe un sfert de ecran — cum erau întâi — ajungeau pastile palide plutind
     pe pardoseală: focul are nevoie de un loc din care arde, altfel nu e foc. */
  for (let k = 0; k < 54; k++) {
    const a = samanta(4000 + k * 5.7), b = samanta(4060 + k * 3.9);
    const departe = Math.max(a, b);             // îndesite spre colț
    const unda = Math.sin(acum * (0.005 + b * 0.006) + k * 2.1);
    const fx = W - a * W * 0.34 * p;
    const fy = H - b * H * 0.30 * p;
    const lung = H * 0.05 * (0.35 + (1 - departe) * 1.1) * p;
    ctx.globalAlpha = (0.22 + (1 - departe) * 0.6) * p;
    tusa(ctx, fx + unda * H * 0.008, fy - lung * 0.3, lung, W * 0.009 * (0.6 + b),
         -1.5708 + unda * 0.34,
         departe < 0.25 ? '#fff2c6' : (departe < 0.55 ? '#ffb347' : '#c8461a'), 1);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- INTRAREA ȘI IEȘIREA ---------- */
function intraInFoc(acum) {
  stare = 'foc';
  s6.faza = 'intrare'; s6.t0 = acum; s6.ultimulCadru = acum;
  s6.manusiPuse = false; s6.refuzuri = 0; s6.frige = 0;
  s6.aburi = 1; s6.arsura = 0; s6.colt = 0; s6.scanteie = null;
  pregatesteSalaFocului();
  opresteMuzicaMuzeu();
  opresteNatura();
  pornesteFocul();
  if (audio) sunetPortal();
}

function iesiDinFoc(acum) {
  /* Gaura arsă duce mai departe. Sala a șaptea încă nu e făcută, așa că deocamdată
     te scoate înapoi la custode — dar drumul e croit, și când va fi, aici se
     schimbă un singur rând. */
  opresteFocul();
  s3.vizitat = true;
  stare = 'muzeu';
  faza3('usaDeschisa');
  s3.usa = 1; s3.chemare = 0; s3.aSunatChemarea = false;
  actiune3(acum);
  pornesteNatura(false);
}

/* ---------- CE SE ÎNTÂMPLĂ LA ATINGERE ---------- */
function click6(acum) {
  const g = geomSala6();
  const x = cursor.x, y = cursor.y;

  if (s6.faza === 'intrare') return;

  // gaura arsă: te duce mai departe
  if (s6.faza === 'gaura') {
    const a = geomArsura(1);
    /* Locul pe care apeși e chiar forma ușii, turtită la loc într-un cerc: lată
       cât e ea de lată, înaltă cât e ea de înaltă, cu un pic pe deasupra ca să
       nu ceară precizie de chirurg. */
    const dx = (x - a.cx) / (a.latime * 1.25), dy = (y - a.cy) / (a.inaltime * 1.15);
    if (dx * dx + dy * dy < 1) { iesiDinFoc(acum); return; }
  }

  // mănușile de pe masă
  if (!s6.manusiPuse) {
    const m = geomManusi();
    if (Math.hypot(x - m.x, y - m.y) < m.r * 1.9) {
      s6.manusiPuse = true;
      if (audio) sunetClopotel(420);
      return;
    }
  }

  // pânza
  const peTablou = x > g.tablouX - g.tablouLat * 0.05 &&
                   x < g.tablouX + g.tablouLat * 1.05 &&
                   y > g.tablouY - g.tablouInalt * 0.06 &&
                   y < g.tablouY + g.tablouInalt * 1.06;
  if (peTablou && (s6.faza === 'sala')) {
    if (!s6.manusiPuse) {
      /* Cu mâna goală, pânza frige și te trage înapoi. Nu e o pedeapsă: e felul
         în care sala îți spune ce scrie pe masă, pentru cine n-a citit. */
      s6.refuzuri++;
      s6.frige = 1;
      if (audio) sunetFrige();
      if (s6.refuzuri >= PRAG_MANUSI_IN_MANA) {
        /* Cine a încercat de cinci ori a înțeles ce vrea și nu găsește cum. Îi
           punem mănușile în mână — aceeași socoteală ca la lupa din galerie. */
        s6.manusiPuse = true;
        if (audio) sunetClopotel(420);
      }
      return;
    }
    s6.faza = 'scanteie'; s6.t0 = acum;
    const gm = geomSala6();
    s6.scanteie = { x: W * 0.5, y: gm.tablouY + gm.tablouInalt * 0.78, t: 0 };
    if (audio) { sunetScanteie(); }
    return;
  }
}

/* ---------- CEASUL SCENEI ---------- */
function actualizeazaFocul(acum) {
  /* `dt` nu are voie sa fie negativ. Sus e taiat la o zecime de secunda, ca o
     fila pierduta sa nu sara scena inainte; jos la zero, fiindca un dt negativ
     nu incetineste scena, o da **inapoi**: aburii se ingroasa in loc sa se
     limpezeasca, iar faza nu se mai schimba niciodata. */
  const dt = Math.max(0, Math.min(100, acum - (s6.ultimulCadru || acum)));
  s6.ultimulCadru = acum;
  tinePocnetele();

  s6.frige = Math.max(0, s6.frige - dt / 900);

  if (s6.faza === 'intrare') {
    s6.aburi = Math.max(0, s6.aburi - dt / 1400);
    if (s6.aburi <= 0) { s6.faza = 'sala'; s6.t0 = acum; }
  }
  else if (s6.faza === 'scanteie') {
    /* Ecranul se face vaporos, ca aerul deasupra jarului, iar scânteia zboară din
       pânză spre colțul de jos-dreapta. Când ajunge, colțul ia foc. */
    s6.aburi = Math.min(0.55, s6.aburi + dt / 900);
    const p = Math.min(1, (acum - s6.t0) / 1500);
    const g = geomSala6();
    s6.scanteie.x = intre(W * 0.5, W * 0.985, atenuare(p));
    // sare în arc: întâi urcă, apoi cade în colț
    s6.scanteie.y = intre(g.tablouY + g.tablouInalt * 0.78, H * 0.97, p * p) -
                    Math.sin(p * Math.PI) * H * 0.22;
    s6.scanteie.t = p;
    if (p >= 1) {
      s6.faza = 'arde'; s6.t0 = acum;
      if (audio) sunetHartieArsa();
    }
  }
  else if (s6.faza === 'arde') {
    s6.colt = Math.min(1, s6.colt + dt / 1100);
    s6.aburi = Math.max(0.18, s6.aburi - dt / 2600);
    if (acum - s6.t0 > 900) s6.arsura = Math.min(1, s6.arsura + dt / 2600);
    // colțul se potolește după ce arsura a mâncat peretele
    if (s6.arsura > 0.55) s6.colt = Math.max(0, s6.colt - dt / 1800);
    if (s6.arsura >= 1) { s6.faza = 'gaura'; s6.t0 = acum; }
  }
  else if (s6.faza === 'gaura') {
    s6.colt = Math.max(0, s6.colt - dt / 1600);
    s6.aburi = Math.max(0, s6.aburi - dt / 2200);
  }
}

/* ---------- DESENUL ---------- */
function deseneazaScena6(t, acum) {
  const sala = pregatesteSalaFocului();
  ctx.drawImage(sala, 0, 0);

  /* Ordinea e ordinea depărtării. Arsura e o gaură **în peretele din fund**;
     șevaletul stă în mijlocul sălii, deci în fața ei, iar masa lângă el. Așa,
     când peretele arde, pânza rămâne să se vadă în picioare pe fundalul rece —
     și tot atunci se vede cel mai bine ce are scena de arătat: cald pe rece. */
  deseneazaArsura(acum);
  const g6 = geomSala6();
  sevaletul(ctx, g6, acum);
  deseneazaTabloulFocului(acum);
  masaCuManusi(ctx, g6);
  deseneazaManusi(acum);
  deseneazaColtulAprins(acum);

  // scânteia care zboară
  if (s6.scanteie && s6.faza === 'scanteie') {
    const s = s6.scanteie;
    ctx.save();
    const jar = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, Math.min(W, H) * 0.07);
    jar.addColorStop(0, 'rgba(255, 246, 210, 0.95)');
    jar.addColorStop(0.3, 'rgba(255, 176, 60, 0.6)');
    jar.addColorStop(1, 'rgba(255, 176, 60, 0)');
    ctx.fillStyle = jar;
    ctx.beginPath();
    ctx.arc(s.x, s.y, Math.min(W, H) * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff8dc';
    ctx.beginPath();
    ctx.arc(s.x, s.y, Math.max(1.5, Math.min(W, H) * 0.008), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* Aburii. Nu sunt o ceață albă peste tot: e aerul care tremură deasupra
     jarului, deci e cald și e mai gros jos, unde e focul. */
  if (s6.aburi > 0.01) {
    ctx.save();
    const abur = ctx.createLinearGradient(0, 0, 0, H);
    abur.addColorStop(0, `rgba(255, 214, 150, ${0.22 * s6.aburi})`);
    abur.addColorStop(0.55, `rgba(255, 186, 110, ${0.5 * s6.aburi})`);
    abur.addColorStop(1, `rgba(214, 132, 60, ${0.7 * s6.aburi})`);
    ctx.fillStyle = abur;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // avertismentul de pe masă
  if (s6.faza === 'sala' && !s6.manusiPuse) {
    const g = geomSala6();
    const aprins = 0.72 + 0.28 * s6.frige;
    ctx.save();
    ctx.globalAlpha = aprins;
    ctx.fillStyle = 'rgba(46, 18, 8, 0.82)';
    dreptunghi(W * 0.5 - Math.min(W * 0.34, ecran(380)) / 2, H * 0.855,
               Math.min(W * 0.34, ecran(380)), H * 0.085, ecran(12));
    ctx.restore();
    textIncadrat('Atenție, frige! Pune-ți mănușile de protecție de pe masă.',
                 W * 0.5, H * 0.878, Math.min(W * 0.31, ecran(350)), ecran(22),
                 `bold ${Math.max(Math.round(ecran(13)), Math.round(Math.min(W, H) * 0.023))}px Georgia`,
                 s6.frige > 0.3 ? '#ffd07a' : '#f3e0bc');
  }
  else if (s6.faza === 'sala' && s6.manusiPuse) {
    textIncadrat('Acum poți atinge focul.', W * 0.5, H * 0.90,
                 Math.min(W * 0.4, ecran(420)), ecran(24),
                 `bold ${Math.max(Math.round(ecran(13)), Math.round(Math.min(W, H) * 0.023))}px Georgia`,
                 '#f3e0bc');
  }
  else if (s6.faza === 'gaura') {
    /* Îndemnul stă **sub ușă**, nu în mijlocul ecranului. Scris la mijloc, arăta
       spre șevalet, adică spre singurul lucru din sală prin care nu se poate
       trece; acum cade chiar sub pragul ars, și degetul îl urmează. */
    const a = geomArsura(1);
    /* Pe o plăcuță, ca și avertismentul de la mănuși. Scrisul rece cade tocmai pe
       pătratele negre ale pardoselii, unde albăstriul lui se pierde — iar cuvântul
       care spune cum se iese din scenă e ultimul care are voie să nu se vadă. */
    /* Sub prag, dar și sub lucrare: pusă la o palmă de podea, plăcuța intra cu
       colțul în rama aurită, iar două lucruri suprapuse nu se citesc nici unul. */
    const lat = Math.min(W * 0.26, ecran(260));
    const tx = Math.max(lat * 0.55, Math.min(W - lat * 0.55, a.cx));
    const ty = Math.max(a.prag + H * 0.05, H * 0.86);
    ctx.save();
    ctx.fillStyle = 'rgba(14, 20, 32, 0.82)';
    dreptunghi(tx - lat / 2, ty - H * 0.018, lat, H * 0.062, ecran(12));
    ctx.restore();
    textIncadrat('Intră prin arsură.', tx, ty, lat - ecran(28), ecran(24),
                 `bold ${Math.max(Math.round(ecran(13)), Math.round(Math.min(W, H) * 0.023))}px Georgia`,
                 '#dfe6f2');
  }
}
