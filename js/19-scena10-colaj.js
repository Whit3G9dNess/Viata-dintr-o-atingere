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
/* Cerneala fișelor e mult mai închisă decât restul scrisului de pe perete —
   aproape neagră, cu un pic de brun ca să nu iasă din paleta caldă a sălii.

   Restul e vechi și șters dinadins, și așa trebuie să rămână; dar sala e stinsă
   într-o umbră sepia, iar un maro potrivit pe hârtie luminată se face ilizibil pe
   hârtie în penumbră. Cele două definiții sunt singurele lucruri de pe perete
   care trebuie **citite**, nu pipăite — deci n-au voie să fie și ele vechi. */
const CERNEALA_FISA = '#150d04';
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
  ultimulFosnet: 0,
  candDoarSfori: 0,   // de când n-au mai rămas de pornit decât sforile
  aSpusSforile: false
};

/* ---------- CE E PE PERETE ----------

   Așezarea e făcută de mână, nu la întâmplare. Un colaj dadaist e haotic, dar
   haosul lui e ales: bucățile se calcă una pe alta, niciuna nu stă dreaptă, și
   totuși ochiul are unde să se odihnească. Lăsată pe seama întâmplării, ieșea o
   grămadă de gunoi — care e altceva decât Junk Art, deși seamănă. */
const PIESE_PERETE = [
  // ziare interbelice
  { fel: 'ziar',    u: 0.120, v: 0.300, w: 0.255, h: 0.300, unghi: -0.38, sam: 11 },
  { fel: 'ziar',    u: 0.615, v: 0.155, w: 0.230, h: 0.265, unghi:  0.42, sam: 23 },
  { fel: 'ziar',    u: 0.430, v: 0.818, w: 0.270, h: 0.245, unghi: -0.16, sam: 37 },
  // carton ondulat
  { fel: 'carton',  u: 0.340, v: 0.185, w: 0.295, h: 0.345, unghi:  0.19, sam: 51 },
  { fel: 'carton',  u: 0.860, v: 0.505, w: 0.255, h: 0.400, unghi: -0.31, sam: 67 },
  { fel: 'carton',  u: 0.110, v: 0.705, w: 0.250, h: 0.320, unghi:  0.52, sam: 83 },
  /* Sforile, cu capetele lor. Nu mai sunt toate verticale: una traversează
     peretele de-a latul și una în diagonală. Trei linii paralele împart peretele
     în coloane și îl așază la loc în rânduri — exact ce nu vrea un colaj. */
  { fel: 'sfoara', ax: 0.245, ay: -0.02, bx: 0.222, by: 1.02, w: 0.0130, sam: 97 },
  { fel: 'sfoara', ax: 0.735, ay: -0.02, bx: 0.762, by: 1.02, w: 0.0115, sam: 127 },
  // de asta atârnă biletețele, cu cleștișori
  /* Traseele lor sunt alese ca să **nu treacă prin mijlocul niciunei bucăți**.
     Prima oară nu erau: funia de-a latul ținea mijlocul unui ziar, iar cea în
     diagonală mijlocul altuia. Cum funia se apucă înaintea bucății de dedesubt,
     acele două ziare nu se mai puteau porni cu un clic în centrul lor — iar sala
     nu se mai termina. Se putea și din cod, lărgind regula de apucat; dar o
     așezare care nu încurcă nimic nu are nevoie de nicio regulă. */
  { fel: 'sfoara', nume: 'rufe', ax: -0.02, ay: 0.255, bx: 1.02, by: 0.205, w: 0.0165, sam: 109 },
  { fel: 'sfoara', ax: -0.02, ay: 0.620, bx: 1.02, by: 0.985, w: 0.0125, sam: 131 },
  // nasturi de os, de corn și de lemn
  { fel: 'nasturi', u: 0.490, v: 0.405, w: 0.135, h: 0.135, unghi: 0, sam: 139 },
  { fel: 'nasturi', u: 0.700, v: 0.775, w: 0.120, h: 0.120, unghi: 0, sam: 151 },
  { fel: 'nasturi', u: 0.915, v: 0.155, w: 0.110, h: 0.110, unghi: 0, sam: 167 }
];

/* Straturile de dedesubt: bucăți cu care nu ai ce face, lipite acolo înainte de
   celelalte. N-au niciun rol în joc — și tocmai în asta stă rostul lor.

   Cu numai douăsprezece bucăți pe perete, fiecare lucru pe care îl vezi e un
   lucru de făcut, iar peretele se citește ca o listă de butoane. Un asamblaj
   stratificat are **mai mult decât poți atinge**: asta îl face vechi, și asta te
   face să-l cercetezi cu mâna în loc să-l bifezi cu ochiul.

   Așezarea lor e ce deosebește un colaj de un avizier. Întâi le pusesem pe toate
   cam drepte și cam de o mărime, și ieșea un panou de afișe: rânduri, coloane,
   ochiul se plimba cuminte. Junk Art înseamnă altceva — bucăți de mărimi care nu
   se aseamănă, întoarse care încotro, unele fâșii înguste, unele lespezi
   întregi, călcându-se una pe alta și lăsând între ele crăpături întunecate. */
/* Bucățile de la mijloc sunt **mai închise decât restul**: carton gătuit, hârtie
   afumată, cerneală groasă. Un colaj întins uniform pe tot peretele n-are unde să
   odihnească ochiul: te uiți peste el ca peste un tapet. Un cuib mai întunecat și
   mai bătut la mijloc strânge privirea acolo, iar restul devine, dintr-odată,
   marginea a ceva. */
const INTUNECATE = [
  { fel: 'carton', u: 0.470, v: 0.545, w: 0.230, h: 0.290, unghi:  0.28, sam: 281, cat: 0.62 },
  { fel: 'ziar',   u: 0.560, v: 0.455, w: 0.185, h: 0.230, unghi: -0.44, sam: 283, cat: 0.50 },
  { fel: 'carton', u: 0.395, v: 0.400, w: 0.165, h: 0.245, unghi:  0.55, sam: 293, cat: 0.68 },
  { fel: 'ziar',   u: 0.610, v: 0.610, w: 0.150, h: 0.180, unghi:  0.18, sam: 307, cat: 0.44 },
  { fel: 'carton', u: 0.500, v: 0.660, w: 0.120, h: 0.135, unghi: -0.62, sam: 311, cat: 0.72 }
];

const FUNDAL_COLAJ = [
  { fel: 'carton', u: 0.065, v: 0.430, w: 0.265, h: 0.385, unghi:  0.62, sam: 211 },
  { fel: 'ziar',   u: 0.270, v: 0.520, w: 0.230, h: 0.115, unghi: -0.58, sam: 223 },
  { fel: 'carton', u: 0.520, v: 0.300, w: 0.345, h: 0.220, unghi: -0.11, sam: 227 },
  { fel: 'ziar',   u: 0.805, v: 0.825, w: 0.265, h: 0.285, unghi:  0.35, sam: 229 },
  { fel: 'carton', u: 0.635, v: 0.600, w: 0.285, h: 0.350, unghi:  0.24, sam: 233 },
  { fel: 'ziar',   u: 0.955, v: 0.340, w: 0.200, h: 0.345, unghi: -0.45, sam: 239 },
  { fel: 'carton', u: 0.205, v: 0.040, w: 0.310, h: 0.215, unghi: -0.29, sam: 241 },
  { fel: 'ziar',   u: 0.575, v: 0.965, w: 0.250, h: 0.130, unghi:  0.15, sam: 251 },
  { fel: 'carton', u: 0.020, v: 0.955, w: 0.265, h: 0.240, unghi: -0.21, sam: 257 },
  { fel: 'carton', u: 0.405, v: 0.045, w: 0.130, h: 0.310, unghi:  0.33, sam: 263 },
  { fel: 'ziar',   u: 0.745, v: 0.425, w: 0.165, h: 0.310, unghi:  0.51, sam: 269 },
  { fel: 'carton', u: 0.905, v: 0.955, w: 0.220, h: 0.200, unghi: -0.40, sam: 271 }
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

/* Cele două fișe de sală. În celelalte săli textul stă într-o casetă pe perete;
   aici n-ar avea unde, și n-ar avea de ce: sala **e** un colaj, deci fișa se lipește
   pe el ca orice altceva, pe câte o bucată a ei. Una pe hârtie, una pe carton —
   două materii, două definiții.

   Se pun ultimele, peste tot restul: sunt singurele bucăți de pe perete care
   trebuie **citite**, iar un text pe jumătate acoperit nu e un text. */
const TEXT_JUNK = 'Junk Art este un curent artistic care folosește obiecte și ' +
  'materiale uzate sau aruncate pentru a crea opere de artă.';
const TEXT_COLAJ = 'Colajul este o tehnică artistică prin care se combină și se ' +
  'lipesc pe o suprafață diferite materiale, imagini sau fragmente pentru a forma ' +
  'o compoziție nouă.';

/* Biletețele nu mai sunt lipite pe perete: atârnă de sfoara de-a latul, prinse cu
   cleștișori de rufe. Și, dacă tragi de sfoara aceea, se desprind și cad.

   E singurul lucru din sală pe care **îl poți strica**, și tocmai de-aia merită
   să existe: până acum tot ce atingeai se aprindea, se mototolea sau se încorda —
   adică mergea înainte. Aici, o mișcare prea hotărâtă face două hârtii să cadă pe
   jos. Nu se pierde nimic, se pot citi și de-acolo; dar sala îţi răspunde și când
   ești brusc, nu numai când ești cuminte. */
const FISE_COLAJ = [
  { fel: 'ziar',   peSfoara: 'rufe', t: 0.255, w: 0.252, h: 0.210, unghi: -0.045, sam: 301,
    titlu: 'JUNK ART', scris: TEXT_JUNK, cazut: 0, leagan: 0.0 },
  { fel: 'carton', peSfoara: 'rufe', t: 0.700, w: 0.250, h: 0.215, unghi:  0.035, sam: 313,
    titlu: 'COLAJUL',  scris: TEXT_COLAJ, cazut: 0, leagan: 1.9 }
];

/* Unde stă un bilet acum: atârnat de funie, sau căzut pe jos. */
/* Numele e `undeAtarnaBiletul`, nu `loculBiletului`, și asta nu e mofț: muzeul din
   sala a treia are de mult o funcție `loculBiletului`, pentru bilețelele lui. Toate
   cele nouăsprezece fișiere ale jucăriei se încarcă în același domeniu, ca scripturi
   obișnuite, deci a doua declarație o șterge pe prima — fără nicio plângere.

   S-a văzut ca unsprezece teste căzute în muzeu, la o schimbare făcută în sala a
   zecea. Un test nou păzește acum lucrul ăsta pentru toată jucăria.

   Sfoara de care atârnă biletele se caută **după nume**, nu după numărul ei de
   ordine. Prima oară scrisesem numărul, și când am adăugat sforile noi el a ajuns
   să arate spre un ziar: biletele au încercat să atârne de o bucată de hârtie și
   au ieșit din ecran. Un număr de ordine ține minte o listă; un nume ține minte
   un lucru. */
function sfoaraDupaNume(nume) {
  for (const p of s10.piese) if (p.nume === nume) return p;
  return null;
}

function undeAtarnaBiletul(f, acum) {
  const sf = sfoaraDupaNume(f.peSfoara);
  if (!sf) return null;
  const sus = punctulSforii(sf, f.t);
  const cq = Math.min(1, f.cazut);
  if (cq <= 0) {
    /* Atârnat: se leagănă abia-abia. O hârtie prinsă în cleștișori nu stă
       niciodată perfect nemișcată — și mișcarea asta e tot ce spune „atârnă". */
    const val = Math.sin(acum * 0.0011 + f.leagan) * 0.035;
    return { x: sus.x, y: sus.y + f.h * H * 0.5, unghi: f.unghi + val,
             prins: true, sus: sus };
  }
  // căzut: coboară legănându-se, și rămâne rezemat pe podea
  const e = atenuare(cq);
  const jos = H * 0.965 - f.h * H * 0.5;
  return {
    x: sus.x + Math.sin(cq * 5.5 + f.leagan) * W * 0.045 * (1 - cq * 0.5),
    y: intre(sus.y + f.h * H * 0.5, jos, e),
    unghi: f.unghi + Math.sin(cq * 7 + f.leagan) * 0.6 * (1 - cq) + (f.leagan - 1) * 0.22 * e,
    prins: false, sus: sus
  };
}

/* Un cleștișor de rufe, de lemn: două fălci și sârma dintre ele. */
function clestisor(c, x, y, unghi, marime) {
  c.save();
  c.translate(x, y);
  c.rotate(unghi);
  const w = marime * 0.42, h = marime;
  c.fillStyle = '#3a2c14';
  c.globalAlpha = 0.35;
  c.fillRect(-w * 0.5 + marime * 0.09, -h * 0.42 + marime * 0.09, w, h * 0.9);
  c.globalAlpha = 1;
  const lemn = c.createLinearGradient(-w * 0.5, 0, w * 0.5, 0);
  lemn.addColorStop(0, '#c9a875');
  lemn.addColorStop(0.45, '#e0c193');
  lemn.addColorStop(1, '#9a7c4e');
  c.fillStyle = lemn;
  dreptunghiIn(c, -w * 0.5, -h * 0.42, w, h * 0.9, w * 0.22);
  c.fill();
  c.strokeStyle = '#7a5f39';
  c.lineWidth = Math.max(0.6, marime * 0.045);
  c.stroke();
  // sârma
  c.strokeStyle = '#8d8f92';
  c.lineWidth = Math.max(0.7, marime * 0.07);
  c.beginPath();
  c.moveTo(-w * 0.5, h * 0.02);
  c.lineTo(w * 0.5, h * 0.02);
  c.stroke();
  // crăpătura dintre fălci
  c.strokeStyle = 'rgba(60, 44, 20, 0.55)';
  c.lineWidth = Math.max(0.5, marime * 0.035);
  c.beginPath();
  c.moveTo(0, -h * 0.42);
  c.lineTo(0, h * 0.30);
  c.stroke();
  c.restore();
}

/* Biletele se desenează **viu**, nu în ștampilă: ele se leagănă și pot să cadă. */
function deseneazaBiletele(c, acum) {
  for (const f of FISE_COLAJ) {
    const loc = undeAtarnaBiletul(f, acum);
    if (!loc) continue;
    const w = f.w * W, h = f.h * H;

    if (loc.prins) {
      // ața de la cleștișori până la colțurile de sus ale biletului
      c.save();
      c.strokeStyle = 'rgba(60, 46, 22, 0.55)';
      c.lineWidth = Math.max(0.8, Math.min(W, H) * 0.0022);
      c.beginPath();
      c.moveTo(loc.sus.x - w * 0.30, loc.sus.y);
      c.lineTo(loc.x - w * 0.30, loc.y - h * 0.46);
      c.moveTo(loc.sus.x + w * 0.30, loc.sus.y);
      c.lineTo(loc.x + w * 0.30, loc.y - h * 0.46);
      c.stroke();
      c.restore();
    }

    c.save();
    c.translate(loc.x, loc.y);
    c.rotate(loc.unghi);
    const fals = { fel: f.fel, sam: f.sam, scris: f.scris, titlu: f.titlu };
    umbraPiesei(c, fals, w, h);
    if (f.fel === 'ziar') bucataDeZiar(c, fals, w, h);
    else bucataDeCarton(c, fals, w, h);
    muchiaPiesei(c, fals, w, h);
    fisaScrisa(c, f, w, h);
    c.restore();

    if (loc.prins) {
      const m = Math.min(W, H) * 0.042;
      clestisor(c, loc.x - w * 0.30, loc.y - h * 0.46, loc.unghi + 0.06, m);
      clestisor(c, loc.x + w * 0.30, loc.y - h * 0.46, loc.unghi - 0.05, m);
    }
  }
}

/* Scrisul de pe o bucată, îndoit pe lățimea ei. Nu se poate folosi `textIncadrat`
   al muzeului: acela scrie pe pânza de pe ecran, iar aici scriem pe ștampila
   peretelui, în sistemul răsucit al bucății. */
function scrieCuvinte(c, text, latMax, marime, culoare, x, y, hLinie) {
  c.font = Math.round(marime) + 'px Georgia, serif';
  c.fillStyle = culoare;
  c.textAlign = 'left';
  c.textBaseline = 'top';
  const cuv = text.split(' ');
  let linie = '', yy = y;
  for (const cv of cuv) {
    const proba = linie ? linie + ' ' + cv : cv;
    if (c.measureText(proba).width > latMax && linie) {
      c.fillText(linie, x, yy); linie = cv; yy += hLinie;
    } else linie = proba;
  }
  if (linie) c.fillText(linie, x, yy);
  return yy + hLinie;
}

function fisaScrisa(c, p, w, h) {
  const marime = Math.max(8, Math.min(w, h) * 0.082);
  c.save();
  /* Cerneala e ștearsă de vreme, dar nu atât încât să nu se citească. În sala asta
     totul e vechi — numai ce trebuie citit are voie să fie limpede. */
  /* O foaie palidă lipită sub scris. Cerneala aproape neagră se citește bine pe
     hârtia de ziar, dar pe cartonul maro tot se îneacă — iar culoarea cartonului
     nu se poate schimba, e chiar materia lui. Deci se lipește peste el o etichetă,
     cum se face pe orice ladă: nu e un truc de citire, e felul în care oamenii au
     scris dintotdeauna pe lucruri prea închise la culoare. */
  const et = c.createLinearGradient(0, -h * 0.44, 0, h * 0.42);
  et.addColorStop(0, '#f4ecd6');
  et.addColorStop(1, '#e2d6b8');
  c.globalAlpha = 0.90;
  c.fillStyle = et;
  conturRupt(c, w * 0.92, h * 0.86, p.sam * 1.7, 0.020);
  c.fill();
  c.globalAlpha = 0.30;
  c.strokeStyle = '#7d6a44';
  c.lineWidth = Math.max(0.8, Math.min(w, h) * 0.008);
  conturRupt(c, w * 0.92, h * 0.86, p.sam * 1.7, 0.020);
  c.stroke();

  c.globalAlpha = 1;
  c.font = 'bold ' + Math.round(marime * 1.35) + 'px Georgia, serif';
  c.fillStyle = CERNEALA_FISA;
  c.textAlign = 'left';
  c.textBaseline = 'top';
  c.fillText(p.titlu, -w * 0.40, -h * 0.38);
  c.globalAlpha = 0.55;
  c.fillRect(-w * 0.40, -h * 0.38 + marime * 1.7, w * 0.80, Math.max(1, h * 0.008));
  c.globalAlpha = 1;
  scrieCuvinte(c, p.scris, w * 0.80, marime, CERNEALA_FISA,
               -w * 0.40, -h * 0.38 + marime * 2.5, marime * 1.34);
  c.restore();
}

function pregatestePiesele() {
  s10.piese = PIESE_PERETE.map(function (p, i) {
    return {
      i: i, fel: p.fel, u: p.u, v: p.v, w: p.w, h: p.h,
      unghi: p.unghi, sam: p.sam, nume: p.nume,
      // capetele sforii; la celelalte bucăți rămân nedefinite și nu le caută nimeni
      ax: p.ax, ay: p.ay, bx: p.bx, by: p.by,
      activat: false,
      zvac: 0,          // cât de proaspătă e atingerea, 1 → 0
      incretit: 0,      // numai la ziar: cât s-a mototolit
      gauri: [],        // numai la carton: găurile sparte cu degetul
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
/* Ce bucată de hârtie, carton sau nasturi e sub deget — cea mai de deasupra. */
function bucataDeSub(x, y) {
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

function piesaDeSub(x, y) {
  const bucata = bucataDeSub(x, y);

  /* Sforile stau deasupra tuturor — dar numai câtă vreme mai au ceva de dat, și
     numai cât țin ele de late.

     Două stricăciuni au ieșit de aici, amândouă făcând sala de netrecut. Întâi: o
     sfoară deja încordată rămâne arcuită peste perete și poate cădea fix peste un
     pâlc de nasturi. Apoi, când am pus sfori de-a latul: o funie cu zonă de apucat
     lată taie peretele într-o dâră de patruzeci de pixeli în care nu se mai poate
     atinge nimic — iar două dintre bucăți își aveau chiar mijlocul acolo.

     Deci: pe funie se apucă doar de pe funie. Pe pânza goală, unde n-are ce
     încurca, zona de apucat e largă — acolo o sfoară subțire ar fi altfel greu de
     nimerit. */
  for (const p of s10.piese) {
    if (p.fel !== 'sfoara' || p.activat) continue;
    const departe = catDeAproapeDeSfoara(p, x, y).departe;
    const gros = Math.max(Math.min(W, H) * 0.010, p.w * W * 0.75);
    if (departe < gros) return p;
    if (!bucata && departe < gros * 2.4) return p;
  }
  return bucata;
}

/* Sfoara, de la un capăt la altul.

   Întâi erau toate verticale, și o funie verticală se putea scrie cu un singur
   număr: `x`-ul ei. Când am pus una de-a latul și una în diagonală, numărul acela
   n-a mai însemnat nimic — deci fiecare sfoară are acum două capete, iar arcul se
   umflă **pe perpendiculara ei**, nu pe orizontală. O funie trasă se umflă într-o
   parte, oricum ar fi întinsă; încotro anume, hotărăște felul în care stă. */
function capeteleSforii(p) {
  return { ax: p.ax * W, ay: p.ay * H, bx: p.bx * W, by: p.by * H };
}

function perpendicularaSforii(p) {
  const c = capeteleSforii(p);
  const dx = c.bx - c.ax, dy = c.by - c.ay;
  const L = Math.hypot(dx, dy) || 1;
  return { nx: -dy / L, ny: dx / L };
}

function punctulSforii(p, t) {
  const c = capeteleSforii(p);
  const n = perpendicularaSforii(p);
  const q = Math.max(0, Math.min(1, t));
  const umflat = (p.arc || 0) * Math.min(W, H) * Math.sin(Math.PI * q);
  return { x: c.ax + (c.bx - c.ax) * q + n.nx * umflat,
           y: c.ay + (c.by - c.ay) * q + n.ny * umflat };
}

/* Cât de departe e degetul de funie, și pe unde. Se caută pe câteva zeci de pași:
   funia e curbată, deci nu se poate socoti dintr-o formulă de dreaptă. */
function catDeAproapeDeSfoara(p, x, y) {
  let cel = 1e9, undeva = 0;
  for (let k = 0; k <= 28; k++) {
    const t = k / 28, q = punctulSforii(p, t);
    const d = Math.hypot(x - q.x, y - q.y);
    if (d < cel) { cel = d; undeva = t; }
  }
  return { departe: cel, t: undeva };
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

  if (p.scris) { c.restore(); return; }    // pe fișe se scrie altceva, mai încolo

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
/* Un nasture adevărat, după cele de os și de corn din cutia bunicii.

   Un cerc cu două găuri nu e un nasture, e un semn de nasture. Ce-l face lucru
   sunt patru amănunte, și toate patru se văd și de departe:

   - **rama ridicată** și, înăuntrul ei, o **adâncitură** în care stau găurile.
     Asta dă grosime: un nasture e o farfurioară, nu o rondelă.
   - **vărgatura** materiei. Osul și cornul au straturi, iar straturile se văd ca
     niște dungi curbate care traversează nasturele dintr-o parte în alta —
     niciodată concentrice.
   - **luciul**, o singură pată, sus la stânga, fiindcă lumina vine de acolo.
   - **găurile cu adâncime**: buza de sus întunecată, cea de jos luminată. O gaură
     desenată ca un punct negru arată a pată, nu a gaură. */
const FELURI_NASTURE = [
  { nume: 'os',    fata: '#efe5cc', umbra: '#bdae8b', dunga: '#d6c69f', gauri: 4 },
  { nume: 'corn',  fata: '#c9b48c', umbra: '#7b6440', dunga: '#8f7a52', gauri: 4 },
  { nume: 'corn2', fata: '#8e8578', umbra: '#4a4338', dunga: '#635a4b', gauri: 2 },
  { nume: 'lemn',  fata: '#9d7a4c', umbra: '#5b4324', dunga: '#7a5c33', gauri: 2 },
  { nume: 'sidef', fata: '#e8e2d4', umbra: '#a9a394', dunga: '#cfc7b4', gauri: 4 }
];

function unNasture(c, x, y, r, fel, sam, luminat) {
  const F = FELURI_NASTURE[fel % FELURI_NASTURE.length];
  const turtit = 0.92 + samanta(sam * 3.7) * 0.08;

  c.save();
  c.translate(x, y);
  c.rotate((samanta(sam * 5.3) - 0.5) * 2);
  c.scale(1, turtit);

  // umbra pe care o aruncă pe pânză
  c.globalAlpha = 0.34;
  c.fillStyle = '#241a08';
  c.beginPath();
  c.ellipse(r * 0.14, r * 0.18, r * 1.03, r * 1.03, 0, 0, Math.PI * 2);
  c.fill();
  c.globalAlpha = 1;

  // corpul, cu rama mai luminată sus-stânga
  const corp = c.createLinearGradient(-r * 0.7, -r * 0.7, r * 0.8, r * 0.8);
  corp.addColorStop(0, amesteca(F.fata, '#ffffff', 0.28));
  corp.addColorStop(0.45, F.fata);
  corp.addColorStop(1, F.umbra);
  c.fillStyle = corp;
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.fill();

  // vărgatura materiei: dungi curbate, dintr-o margine în cealaltă
  c.save();
  c.beginPath();
  c.arc(0, 0, r * 0.99, 0, Math.PI * 2);
  c.clip();
  const unV = samanta(sam * 7.1) * Math.PI;
  c.rotate(unV);
  for (let k = 0; k < 9; k++) {
    const z = samanta(sam * 11.3 + k * 3.1);
    c.globalAlpha = 0.10 + z * 0.26;
    c.strokeStyle = z > 0.5 ? F.dunga : amesteca(F.umbra, '#000000', 0.2);
    c.lineWidth = r * (0.05 + z * 0.16);
    c.beginPath();
    const y0 = (k / 8 - 0.5) * r * 2.1;
    c.moveTo(-r * 1.1, y0);
    c.quadraticCurveTo(0, y0 + (z - 0.5) * r * 0.5, r * 1.1, y0 + (z - 0.5) * r * 0.3);
    c.stroke();
  }
  c.restore();

  // rama: un inel mai închis și, înăuntru, adâncitura
  c.globalAlpha = 0.55;
  c.strokeStyle = amesteca(F.umbra, '#000000', 0.25);
  c.lineWidth = Math.max(0.7, r * 0.06);
  c.beginPath();
  c.arc(0, 0, r * 0.97, 0, Math.PI * 2);
  c.stroke();

  const groapa = c.createRadialGradient(-r * 0.2, -r * 0.24, 0, 0, 0, r * 0.72);
  groapa.addColorStop(0, amesteca(F.fata, '#000000', 0.10));
  groapa.addColorStop(0.75, amesteca(F.fata, '#000000', 0.02));
  groapa.addColorStop(1, amesteca(F.umbra, '#000000', 0.12));
  c.globalAlpha = 0.75;
  c.fillStyle = groapa;
  c.beginPath();
  c.arc(0, 0, r * 0.70, 0, Math.PI * 2);
  c.fill();
  c.globalAlpha = 0.5;
  c.strokeStyle = amesteca(F.umbra, '#000000', 0.35);
  c.lineWidth = Math.max(0.6, r * 0.05);
  c.beginPath();
  c.arc(0, 0, r * 0.70, 0, Math.PI * 2);
  c.stroke();
  c.globalAlpha = 0.4;
  c.strokeStyle = amesteca(F.fata, '#ffffff', 0.5);
  c.beginPath();
  c.arc(0, 0, r * 0.66, Math.PI * 0.15, Math.PI * 0.85);
  c.stroke();

  // găurile, cu adâncime
  c.globalAlpha = 1;
  const gr = r * 0.135, de = r * 0.30;
  for (let q = 0; q < F.gauri; q++) {
    const un = (q / F.gauri) * Math.PI * 2 + (F.gauri === 2 ? 0 : Math.PI / 4);
    const gx = Math.cos(un) * de, gy = Math.sin(un) * de;
    c.fillStyle = amesteca(F.umbra, '#000000', 0.55);
    c.beginPath();
    c.arc(gx, gy, gr, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = amesteca(F.fata, '#ffffff', 0.45);
    c.lineWidth = Math.max(0.5, gr * 0.30);
    c.beginPath();
    c.arc(gx, gy, gr * 0.9, Math.PI * 0.15, Math.PI * 0.85);
    c.stroke();
    c.strokeStyle = 'rgba(0,0,0,0.45)';
    c.beginPath();
    c.arc(gx, gy, gr * 0.9, Math.PI * 1.15, Math.PI * 1.85);
    c.stroke();
  }

  // luciul: o singură pată, sus la stânga
  const lum = c.createRadialGradient(-r * 0.44, -r * 0.48, 0, -r * 0.44, -r * 0.48, r * 0.62);
  lum.addColorStop(0, 'rgba(255,255,255,0.55)');
  lum.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = lum;
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.fill();

  if (luminat) {
    c.globalCompositeOperation = 'lighter';
    c.globalAlpha = luminat * 0.55;
    c.fillStyle = OCRU_CALD;
    c.beginPath();
    c.arc(0, 0, r * 0.75, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

/* Un pâlc de nasturi, cusuți grosolan: mărimi și materii amestecate, unii peste
   alții, cu ața trecută pe sub ei și prin găuri. Cusutul grosolan e chiar ce cere
   Arte Povera: se vede cum a fost făcut. */
function palcDeNasturi(c, p, w, h, luminat) {
  const cate = 5 + (p.sam % 3);
  for (let k = 0; k < cate; k++) {
    const a = samanta(p.sam * 3.7 + k * 5.3), b = samanta(p.sam * 8.9 + k * 3.1);
    const e = samanta(p.sam * 13.1 + k * 7.7);
    const x = (a - 0.5) * w * 0.86, y = (b - 0.5) * h * 0.86;
    const r = Math.min(w, h) * (0.13 + e * 0.15);

    // ața, întâi: trece pe sub nasture
    c.strokeStyle = '#6b5a35';
    c.globalAlpha = 0.75;
    c.lineWidth = Math.max(0.8, r * 0.13);
    c.beginPath();
    c.moveTo(x - r * 2.4, y + r * (a - 0.5) * 2.2);
    c.lineTo(x + r * 2.2, y + r * (b - 0.5) * 2.2);
    c.stroke();
    c.globalAlpha = 1;

    unNasture(c, x, y, r, Math.floor(e * FELURI_NASTURE.length),
              p.sam * 17 + k * 29, luminat);
  }
  c.globalAlpha = 1;
}

/* Sfoara de cânepă. Trei fire răsucite: se face dintr-o singură linie groasă,
   peste care se pun hașuri oblice: fiecare hașură e o răsucire. O funie desenată
   ca o bară netedă rămâne o bară, oricâtă umbră i-ai pune. */
function franghia(c, p, luminat) {
  const gros = Math.max(3, p.w * W);
  const PASI = 34;
  const puncte = [];
  for (let k = 0; k <= PASI; k++) {
    const q = punctulSforii(p, k / PASI);
    puncte.push([q.x, q.y]);
  }
  const nperp = perpendicularaSforii(p);
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
  /* Degradeul de-a curmezișul funiei merge tot pe perpendiculara ei: la o funie
     de-a latul, unul orizontal ar fi întins-o pe toată lungimea și n-ar mai fi
     rotunjit nimic. */
  const mij = punctulSforii(p, 0.5);
  const fir = c.createLinearGradient(mij.x - nperp.nx * gros / 2, mij.y - nperp.ny * gros / 2,
                                     mij.x + nperp.nx * gros / 2, mij.y + nperp.ny * gros / 2);
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
  const cap = capeteleSforii(p);
  const lungime = Math.hypot(cap.bx - cap.ax, cap.by - cap.ay) || 1;
  const pasR = gros * 0.95;
  const cateR = Math.max(4, Math.round(lungime / pasR));
  const tx = (cap.bx - cap.ax) / lungime, ty = (cap.by - cap.ay) / lungime;

  const rasuceste = function (culoare, latime, dinPart, panaLa, alfa) {
    c.globalAlpha = alfa;
    c.strokeStyle = culoare;
    c.lineWidth = latime;
    c.beginPath();
    for (let k = 0; k <= cateR; k++) {
      const q = punctulSforii(p, k / cateR);
      c.moveTo(q.x - nperp.nx * gros * 0.48 + tx * pasR * dinPart,
               q.y - nperp.ny * gros * 0.48 + ty * pasR * dinPart);
      c.quadraticCurveTo(q.x + tx * pasR * 0.06, q.y + ty * pasR * 0.06,
                         q.x + nperp.nx * gros * 0.48 + tx * pasR * panaLa,
                         q.y + nperp.ny * gros * 0.48 + ty * pasR * panaLa);
    }
    c.stroke();
  };
  rasuceste('#43371c', Math.max(0.8, gros * 0.16), 0.62, -0.58, 0.55);
  rasuceste('#e0c894', Math.max(0.6, gros * 0.11), 0.76, -0.36, 0.38);

  // scamele de cânepă care ies din răsucire
  c.lineCap = 'round';
  c.globalAlpha = 0.55;
  c.lineWidth = Math.max(0.5, gros * 0.13);
  c.strokeStyle = '#8d7746';
  c.beginPath();
  for (let k = 0; k < 26; k++) {
    const a = samanta(p.sam * 3.1 + k * 5.7), b = samanta(p.sam * 7.3 + k * 3.3);
    const q = punctulSforii(p, a);
    const lat = (b > 0.5 ? 1 : -1) * gros * (0.5 + b * 0.9);
    c.moveTo(q.x, q.y);
    c.lineTo(q.x + nperp.nx * lat, q.y + nperp.ny * lat);
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
  for (const pi of INTUNECATE) {
    puneBucata(pi, 1);
    // și peste ele, o spălare închisă, tăiată la forma bucății
    const cut = cutiaPiesei(pi);
    c.save();
    c.translate(cut.cx, cut.cy);
    c.rotate(pi.unghi);
    conturRupt(c, cut.w, cut.h, pi.sam, pi.fel === 'carton' ? 0.022 : 0.035);
    c.clip();
    c.globalAlpha = pi.cat;
    c.fillStyle = '#2a1f0c';
    c.fillRect(-cut.w, -cut.h, cut.w * 2, cut.h * 2);
    c.restore();
  }
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
  uitaCadrul();   // pictura asta nu se pune la socoteala fluenței
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
  { u: 0.85, v: 0.52, r: 0.20 },
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

  /* Câte o pată de lumină pe fiecare bilet, **oriunde ar fi el**. Sala e stinsă
     dinadins, ca să pipăi în loc să te uiți — dar cele două definiții nu se
     pipăie, se citesc.

     Întâi luminile astea stăteau la locuri scrise de mână, de pe când fișele erau
     lipite pe perete. Când fișele au ajuns să atârne de sfoară — și să cadă de pe
     ea — luminile au rămas să strălucească pe două bucăți de perete gol. Lumina
     merge după ce trebuie văzut, nu după unde a fost pus cândva. */
  for (const f of FISE_COLAJ) {
    const loc = undeAtarnaBiletul(f, acum);
    if (!loc) continue;
    const r = S * 0.21;
    const g = c.createRadialGradient(loc.x, loc.y, 0, loc.x, loc.y, r);
    g.addColorStop(0, 'rgba(236, 190, 108, ' + (0.58 * cat).toFixed(3) + ')');
    g.addColorStop(0.45, 'rgba(190, 138, 60, ' + (0.22 * cat).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(120, 80, 30, 0)');
    c.fillStyle = g;
    c.fillRect(loc.x - r, loc.y - r, r * 2, r * 2);
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
  const w = cut.w, h = cut.h;
  conturRupt(c, w, h, p.sam);
  c.clip();

  /* Hârtia mototolită nu e hârtie cu niște linii pe ea: e hârtie **făcută din
     fețe**. Când o strângi în pumn, coala se rupe în zeci de bucăți plate, fiecare
     întoarsă în altă parte, deci fiecare prinzând altfel lumina. De-aia un ghem de
     hârtie se cunoaște dintr-o privire, chiar și alb pe alb: nu după cute, ci după
     **pete de lumină cu muchii drepte**, lipite una de alta.

     Întâi îi desenasem numai cutele — dungi albe și întunecate peste foaie — și
     rămânea o foaie zârghiită, nu una mototolită. */
  const FETE = 26;
  for (let k = 0; k < FETE; k++) {
    const a = samanta(p.sam * 17.3 + k * 3.1);
    const b = samanta(p.sam * 5.9 + k * 7.7);
    const e = samanta(p.sam * 11.1 + k * 5.3);
    const f = samanta(p.sam * 23.7 + k * 2.9);

    // mijlocul feței, strâns spre centru pe măsură ce se mototolește
    const mx = (a - 0.5) * w * (0.94 - q * 0.16);
    const my = (b - 0.5) * h * (0.94 - q * 0.16);
    const raza = Math.min(w, h) * (0.12 + e * 0.20);

    c.beginPath();
    for (let v = 0; v < 5; v++) {
      const un = (v / 5) * Math.PI * 2 + f * 6.28;
      const rr = raza * (0.55 + samanta(p.sam * 3.3 + k * 13 + v * 7) * 0.95);
      const px = mx + Math.cos(un) * rr, py = my + Math.sin(un) * rr;
      if (v === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.closePath();

    /* Fața e cu atât mai luminată cu cât e „întoarsă" mai spre lumină. Lumina vine
       din stânga sus, ca peste tot în sala asta, deci fețele din stânga sus sunt
       cele deschise. Dacă le-aș fi luminat la întâmplare, ar fi ieșit un camuflaj. */
    const spreLumina = 0.5 - (mx / w + my / h) * 0.55;
    const catre = spreLumina + (e - 0.5) * 0.5;
    /* Fețele se pun aproape opac. Puse străvezii, se vedeau ca un contur de
       sârmă peste ziarul întins — hârtia rămânea plată și deasupra ei plutea o
       plasă de poligoane. O foaie mototolită nu lasă să se vadă prin ea. */
    c.globalAlpha = q * (0.78 + f * 0.22);
    c.fillStyle = catre > 0.5 ? amesteca(ZIAR, '#fffdf2', Math.min(1, (catre - 0.5) * 1.9))
                              : amesteca(ZIAR_UMBRA, '#4a3d22', Math.min(1, (0.5 - catre) * 1.5));
    c.fill();

    // muchia feței: cuta propriu-zisă, o dungă subțire de lumină
    c.globalAlpha = q * (0.18 + e * 0.24);
    c.strokeStyle = f > 0.5 ? 'rgba(255, 250, 232, 0.9)' : 'rgba(70, 58, 32, 0.75)';
    c.lineWidth = Math.max(0.6, Math.min(w, h) * 0.005);
    c.stroke();
  }

  /* Umbra strânsă pe la margini: ghemul s-a micșorat, iar hârtia de sub el a rămas
     în umbra lui. Fără asta, mototoleala plutește deasupra foii întinse. */
  c.globalAlpha = q * 0.5;
  const rama = c.createRadialGradient(0, 0, Math.min(w, h) * 0.3,
                                      0, 0, Math.max(w, h) * 0.62);
  rama.addColorStop(0, 'rgba(40, 30, 14, 0)');
  rama.addColorStop(1, 'rgba(40, 30, 14, 0.75)');
  c.fillStyle = rama;
  c.fillRect(-w / 2, -h / 2, w, h);
  c.globalAlpha = 1;
  c.restore();
}

/* Găurile sparte în carton. O gaură nu e un cerc negru: e o **margine ruptă** cu
   fibre în lături, un strat de undă la vedere pe muchie, și întuneric dedesubt —
   fiindcă sub carton e gol, iar golul nu are culoare.

   Și cartonul rupt scoate limbi înăuntru, nu bucăți curate: partea de sus a foii
   se despică și rămâne atârnată peste gaură. După ele se cunoaște că a fost spartă
   cu degetul, nu tăiată. */
function sparge(c, p, cut) {
  c.save();
  c.translate(cut.cx, cut.cy);
  c.rotate(p.unghi);
  conturRupt(c, cut.w, cut.h, p.sam, 0.022);
  c.clip();

  for (const g of p.gauri) {
    const x = g.u * cut.w, y = g.v * cut.h;
    const r = Math.min(cut.w, cut.h) * g.r;
    const contur = function (cat) {
      c.beginPath();
      for (let k = 0; k <= 20; k++) {
        const a = (k / 20) * Math.PI * 2;
        const val = 1 + 0.30 * Math.sin(a * 2 + g.sam)
                      + 0.20 * Math.sin(a * 3.7 + g.sam * 1.3)
                      + 0.12 * Math.sin(a * 6.1 + g.sam * 0.7);
        const px = x + Math.cos(a) * r * val * cat;
        const py = y + Math.sin(a) * r * val * cat;
        if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.closePath();
    };

    // golul de dedesubt
    const adanc = c.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r * 1.1);
    adanc.addColorStop(0, '#0d0a04');
    adanc.addColorStop(0.7, '#1d1608');
    adanc.addColorStop(1, '#3b2d13');
    c.fillStyle = adanc;
    contur(1);
    c.fill();

    // unda de pe muchie: se vede grosimea cartonului
    c.save();
    contur(1.28);
    c.clip();
    c.globalCompositeOperation = 'destination-over';
    c.strokeStyle = CARTON_MUCHIE;
    c.lineWidth = Math.max(0.8, r * 0.10);
    const pasU = Math.max(2.5, r * 0.22);
    for (let a = 0; a < Math.PI * 2; a += pasU / r) {
      c.beginPath();
      c.moveTo(x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95);
      c.lineTo(x + Math.cos(a) * r * 1.26, y + Math.sin(a) * r * 1.26);
      c.stroke();
    }
    c.restore();

    // limbile de carton, răsfrânte peste gaură
    for (let k = 0; k < 4; k++) {
      const a = samanta(g.sam + k * 5.3) * Math.PI * 2;
      const lung = r * (0.5 + samanta(g.sam + k * 7.1) * 0.7);
      c.save();
      c.globalAlpha = 0.9;
      c.fillStyle = k % 2 ? '#b49269' : '#9a7c52';
      c.beginPath();
      c.moveTo(x + Math.cos(a - 0.4) * r * 1.05, y + Math.sin(a - 0.4) * r * 1.05);
      c.quadraticCurveTo(x + Math.cos(a) * lung * 0.4, y + Math.sin(a) * lung * 0.4,
                         x + Math.cos(a + 0.1) * lung * 0.3, y + Math.sin(a + 0.1) * lung * 0.3);
      c.quadraticCurveTo(x + Math.cos(a + 0.3) * r * 0.9, y + Math.sin(a + 0.3) * r * 0.9,
                         x + Math.cos(a + 0.45) * r * 1.05, y + Math.sin(a + 0.45) * r * 1.05);
      c.closePath();
      c.fill();
      c.globalAlpha = 0.5;
      c.strokeStyle = '#5d4a26';
      c.lineWidth = Math.max(0.6, r * 0.055);
      c.stroke();
      c.restore();
    }

    // fibrele scămoșate de pe margine
    c.globalAlpha = 0.7;
    c.strokeStyle = '#c9ab7e';
    c.lineWidth = Math.max(0.5, r * 0.04);
    c.beginPath();
    for (let k = 0; k < 22; k++) {
      const a = samanta(g.sam * 3.1 + k * 2.7) * Math.PI * 2;
      const z = samanta(g.sam * 5.9 + k * 3.3);
      c.moveTo(x + Math.cos(a) * r * 1.0, y + Math.sin(a) * r * 1.0);
      c.lineTo(x + Math.cos(a) * r * (1.1 + z * 0.3), y + Math.sin(a) * r * (1.1 + z * 0.3));
    }
    c.stroke();
    c.globalAlpha = 1;
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
  s10.candDoarSfori = 0; s10.aSpusSforile = false;
  pregatestePiesele();
  for (const f of FISE_COLAJ) f.cazut = 0;
  stampaPeretelui.latime = 0;         // peretele se face din nou, cu piese noi
  pregatestePeretele();
  batLaMasina('Închide ochii și simte texturile.', 1400);
  opresteVinilul();
  pornesteAtelierRetro();
  if (audio) sunetPortal();
}

function iesiDinColaj(acum) {
  /* Ruptura duce în sala a unsprezecea, a cărbunelui. Aici era rândul care te
     scotea înapoi la custode fiindcă sala nu exista încă — și tot aici scria că,
     atunci când va exista, se schimbă un singur rând. Ăsta e rândul, și e ultimul
     de felul ăsta: după sala a unsprezecea nu mai urmează alta, ci începutul.

     Trecerea are un sens: ai rupt un perete lipit din bucăți, și intri într-unul
     din care se ia materie. Amândouă fac o lucrare stricând ceva. */
  intraInCarbune(acum);
}

/* ---------- CE FACE FIECARE MATERIAL ---------- */
function pornestePiesa(p, acum) {
  const eraStinsa = !p.activat;
  p.zvac = 1;

  if (p.fel === 'ziar') {
    /* Un clic mototolește foaia **de tot**. Întâi adăuga jumătate, iar cine atingea
       o dată vedea o hârtie pe jumătate strânsă și n-avea de unde ști că mai are de
       apăsat: piesa se și aprindea la prima atingere. Ce se aprinde e gata. */
    p.incretit = Math.max(p.incretit, 0.001);
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
    /* Cartonul se **sparge** sub deget. La fiecare apăsare se face o gaură nouă,
       până la cinci: dincolo de atât bucata n-ar mai fi carton, ar fi dantelă. */
    if (p.gauri.length < 5) {
      p.gauri.push({ u: (Math.random() - 0.5) * 0.72,
                     v: (Math.random() - 0.5) * 0.72,
                     r: 0.05 + Math.random() * 0.07,
                     sam: 400 + p.gauri.length * 37 + p.sam });
    }
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
  if (p.fel === 'sfoara') {
    s10.sfoaraInMana = p.i;
    /* O sfoară apăsată **se ciupește**, ca o coardă.

       Toate celelalte unsprezece bucăți din perete se pornesc cu un deget pus
       pe ele. Sforile nu: de ele se trage, și pe bună dreptate — o manetă trasă
       cu un clic nu e o manetă. Numai că asta nu se vedea nicăieri: apăsai pe
       sfoară, nu se întâmpla nimic, și sala nu se putea termina, fiindcă colțul
       de desprins apare abia după ce s-au pornit toate treisprezece.

       Acum sfoara zvâcnește și sună sub deget, și se lasă la loc când îl iei.
       Atât — dar atât ajunge ca mâna să încerce, a doua oară, să și tragă. */
    if (!p.activat) {
      p.arc = (p.arc >= 0 ? 1 : -1) * 0.035;
      p.arcTinta = 0;
      if (audio) sunetSfoaraIncordata(0.3);
    }
    return;
  }
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
    /* Cât de tare e umflată: cât de departe a plecat degetul de la linia dreaptă
       dintre capete, măsurat pe perpendiculara ei. */
    const cap = capeteleSforii(p), n = perpendicularaSforii(p);
    const dorit = ((cursor.x - cap.ax) * n.nx + (cursor.y - cap.ay) * n.ny) /
                  Math.min(W, H);
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
      // ce era prins pe funia asta se desprinde și cade
      for (const f of FISE_COLAJ) {
        if (f.peSfoara === p.nume && f.cazut === 0) {
          f.cazut = 0.001;
          if (audio) sunetCrackClei();
        }
      }
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
    // hârtia atinsă se strânge în vreo jumătate de secundă, nu dintr-un cadru
    if (p.fel === 'ziar' && p.incretit > 0 && p.incretit < 1) {
      p.incretit = Math.min(1, p.incretit + dt / 480);
    }
    if (p.fel === 'sfoara' && s10.sfoaraInMana !== p.i) {
      p.arc += (p.arcTinta - p.arc) * Math.min(1, dt / 90);
    }
  }
  for (const f of FISE_COLAJ) {
    if (f.cazut > 0 && f.cazut < 1) f.cazut = Math.min(1, f.cazut + dt / 1500);
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
    /* Dacă tot ce se apasă a fost apăsat și au rămas numai sforile, sala o spune
       — o dată, și abia după ce ai avut vreme să încerci singur. Un perete care
       nu se mai termină și nu spune de ce nu e o ghicitoare, e o ușă încuiată. */
    if (!s10.aSpusSforile) {
      let doarSfori = true, vreoSfoara = false;
      for (const p of s10.piese) {
        if (p.activat) continue;
        if (p.fel === 'sfoara') vreoSfoara = true; else doarSfori = false;
      }
      if (doarSfori && vreoSfoara) {
        if (!s10.candDoarSfori) s10.candDoarSfori = acum;
        else if (acum - s10.candDoarSfori > 7000) {
          s10.aSpusSforile = true;
          batLaMasina('Sforile nu se apasă. Se trag.', 4200);
        }
      } else {
        s10.candDoarSfori = 0;
      }
    }
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
/* Bucățile neatinse își arată marginea.

   Peretele e un morman de hârtie, carton și ziar, toate de aceeași culoare de
   sepia și toate suprapuse — frumos ca imagine, mut ca joc: nu se vede nicăieri
   ce e o **bucată** și ce e fundal. Cine intră prima oară plimbă degetul la
   întâmplare până nimerește ceva, iar dacă nu nimerește crede că peretele e doar
   un tapet.

   Așa că, după ce ai avut vreme să te uiți, marginile celor neatinse încep să
   respire: o dungă caldă de-a lungul conturului rupt, cu fiecare bucată pe
   ritmul ei, ca să nu pulseze peretele întreg ca un far. Nu spune „apasă aici",
   spune „astea sunt lucruri". Restul îl faci tu.

   E același obicei ca al buzunarului custodelui și al lupei din galerie: sala
   nu te ia de mână, dar nici nu te lasă să crezi că e stricată. Iar cum bucata
   se atinge, dunga ei se stinge pentru totdeauna — semnul e pentru ce n-ai
   încercat încă, nu o podoabă. */
function chemareaPieselor(acum) {
  if (s10.faza !== 'explorare' && s10.faza !== 'intrare') return;
  const trecut = acum - (s10.t0 || acum);
  const cat = Math.max(0, Math.min(1, (trecut - 3200) / 2600));
  if (cat <= 0) return;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const p of s10.piese) {
    if (p.activat || p.fel === 'sfoara') continue;
    const cut = cutiaPiesei(p);
    /* Fiecare pe ritmul ei: aceeași bătaie pentru toate ar face peretele să
       clipească întreg, ca o reclamă. */
    const bat = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(acum * 0.0021 + p.sam * 1.7));
    ctx.save();
    ctx.translate(cut.cx, cut.cy);
    ctx.rotate(p.unghi);
    if (p.fel === 'nasturi') {
      ctx.beginPath();
      ctx.ellipse(0, 0, cut.w * 0.60, cut.h * 0.60, 0, 0, Math.PI * 2);
    } else {
      conturRupt(ctx, cut.w, cut.h, p.sam, p.fel === 'carton' ? 0.022 : 0.035);
    }
    ctx.globalAlpha = cat * (0.16 + bat * 0.30);
    ctx.strokeStyle = 'rgba(255, 226, 160, 1)';
    ctx.lineWidth = Math.max(1.4, Math.min(W, H) * 0.0032);
    ctx.stroke();
    // o a doua trecere, mai lată și mai stinsă: dunga capătă puțină lumină în jur
    ctx.globalAlpha = cat * (0.05 + bat * 0.10);
    ctx.lineWidth = Math.max(3, Math.min(W, H) * 0.010);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function deseneazaScena10(t, acum) {
  if (s10.faza === 'rupere' || s10.faza === 'iesire') {
    deseneazaRuptura(acum);
    return;
  }

  ctx.drawImage(pregatestePeretele(), 0, 0);

  // ce s-a schimbat de la atingeri: mototolelile, cleiul crăpat, sforile
  for (const p of s10.piese) {
    if (p.fel === 'ziar' && p.incretit > 0) increteste(ctx, p, cutiaPiesei(p), p.incretit);
    if (p.fel === 'carton' && p.gauri.length) sparge(ctx, p, cutiaPiesei(p));
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
  deseneazaBiletele(ctx, acum);

  /* Marginile celor neatinse, înainte de lumina celor pornite: semnul e pentru
     ce n-ai încercat, iar lumina pentru ce ai încercat. */
  chemareaPieselor(acum);

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
