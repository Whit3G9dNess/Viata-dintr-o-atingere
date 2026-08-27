/* =====================================================================
   SCENA 4 — GALERIA CU MINIATURA
   ---------------------------------------------------------------------
   Intri printr-un buzunar al hainei și te trezești într-o sală mică și
   scumpă: rococo, lumină caldă strânsă într-un con, restul în întuneric.
   Pe peretele din față atârnă o singură lucrare, foarte mică, într-o ramă
   uriașă. Lângă ea, o lupă de detectiv.

   Secretul se vede numai prin lupă: în miniatură ești tu, din spate, în fața
   ecranului negru de la începutul jocului, cu o cheie în mână, arătând spre
   rama tabloului. Muți lupa pe ramă, găsești eticheta, atingi rama — și rama
   se cască într-un portal care te scoate înapoi în muzeu, cu galeria însemnată.
   ===================================================================== */
const NEGRU_SCENA1 = '#0a0a0a';
const PRAG_TAINA = 900;          // cât trebuie ținută lupa pe loc, în milisecunde
const PRAG_LUPA_IN_MANA = 6;     // după atâtea încercări ratate, lupa vine singură

const s4 = {
  faza: 'intrare', t0: 0, buzunar: 0, ultimulCadru: 0,
  lupaX: 0, lupaY: 0, lupaR: 0,
  lupaLuata: false,                // lupa vine în mână doar dacă o iei tu
  lupaRepausX: 0, lupaRepausY: 0,
  incercari: 0,                    // de câte ori ai atins pe lângă lupă
  chemareLupa: 0,                  // cât de tare cheamă lupa de pe consolă
  chemareTablou: 0,                // cât de tare cheamă miniatura, dacă rătăcești
  ratacit: 0,                      // de cât timp umbli cu lupa fără s-o găsești
  peMiniatura: 0, peEticheta: 0, portal: 0
};

/* Unde stă lucrarea pe perete. Rama e mare și bogată, pictura dinăuntru e
   minusculă — de asta ai nevoie de lupă ca s-o vezi. */
function geomMiniatura() {
  // rama e mare cât să se vadă sculptura de pe ea, nu o pată pe perete
  // rama e mare cât să i se vadă sculptura, dar tot atârnată pe perete
  const ramaW = Math.min(W * 0.32, 560), ramaH = ramaW * 0.86;
  const ramaX = W * 0.5, ramaY = H * 0.44;
  return {
    ramaX, ramaY, ramaW, ramaH,
    picturaX: ramaX, picturaY: ramaY - ramaH * 0.12,
    picturaW: ramaW * 0.17, picturaH: ramaW * 0.17 * 0.78,
    etichetaX: ramaX, etichetaY: ramaY + ramaH * 0.44
  };
}

function intraInGalerie(k, acum) {
  stare = 'galerie';
  s4.buzunar = k;
  s4.faza = 'intrare'; s4.t0 = acum; s4.ultimulCadru = acum;
  s4.lupaR = Math.min(W, H) * 0.105;
  const m = geomMiniatura();
  // lupa odihnește pe blatul consolei; n-o ia nimeni în locul tău
  const cons = geomConsola(m);
  /* Spre marginea din dreapta a blatului, și așezată pe el, nu înfiptă în el:
     altfel sticla acoperă marmura cu totul și lupa pare că plutește. */
  s4.lupaRepausX = cons.x + cons.w * 0.26;
  s4.lupaRepausY = cons.y - s4.lupaR * 0.88;
  s4.lupaX = s4.lupaRepausX; s4.lupaY = s4.lupaRepausY;
  s4.lupaLuata = false;
  s4.incercari = 0; s4.chemareLupa = 0; s4.chemareTablou = 0; s4.ratacit = 0;
  s4.peMiniatura = 0; s4.peEticheta = 0; s4.portal = 0;
  pregatesteRama(m);              // ștampila ramei, gata dinainte de portal
  opresteMuzicaMuzeu();
  opresteNatura();                 // sala galeriei e închisă: nu se aude grădina
  pornesteMuzicaGalerie();
  sunetIntrareGalerie();
}

function intoarceInMuzeu(acum) {
  s3.vizitate[s4.buzunar] = true;
  stare = 'muzeu';
  faza3('usaDeschisa');
  s3.usa = 1; s3.chemare = 0; s3.aSunatChemarea = false;
  actiune3(acum);
  opresteMuzicaMuzeu();
  pornesteMuzicaMuzeu();
  pornesteNatura(false);
  s3.urmatoareaPasare = acum + 2000;
}

function actualizeazaGalerie(acum) {
  const dt = Math.min(100, acum - (s4.ultimulCadru || acum));
  s4.ultimulCadru = acum;

  if (s4.faza === 'intrare') {
    if (acum - s4.t0 > 1300) { s4.faza = 'sala'; s4.t0 = acum; }
    return;
  }

  /* Cine intră aici n-are de unde ști că obiectul de pe consolă se ia în mână.
     Dacă nu se întâmplă nimic o vreme, lupa începe să cheme — la fel ca
     buzunarul din haina custodelui. */
  if (!s4.lupaLuata) {
    if (acum - s4.t0 > 4000) s4.chemareLupa = Math.min(1, s4.chemareLupa + dt / 4200);
  } else {
    s4.chemareLupa = 0;
    /* Cu lupa în mână se poate rătăci la fel de bine. Dacă umbli cu ea fără s-o
       duci pe miniatură, miniatura începe și ea să lumineze. */
    if (s4.faza === 'sala') {
      s4.ratacit += dt;
      if (s4.ratacit > 8000) s4.chemareTablou = Math.min(1, s4.chemareTablou + dt / 4200);
    } else {
      s4.ratacit = 0; s4.chemareTablou = 0;
    }
  }

  // odată luată în mână, lupa vine după deget cu o mică lene; până atunci stă
  // pe consolă și se uită la tine
  if (s4.lupaLuata) {
    /* Vine repede după deget. Cu lene multă părea că se gândește dacă să te
       asculte, iar îndemnul de pe ecran vorbea despre altceva decât se vedea. */
    const iuteala = Math.min(1, dt / 26) * 0.55;
    s4.lupaX += (cursor.x - s4.lupaX) * iuteala;
    s4.lupaY += (cursor.y - s4.lupaY) * iuteala;
  }

  const m = geomMiniatura();
  const prag = m.ramaW * 0.16;
  const peMin = Math.hypot(s4.lupaX - m.picturaX, s4.lupaY - m.picturaY) < prag;
  const peEti = Math.hypot(s4.lupaX - m.etichetaX, s4.lupaY - m.etichetaY) < prag;

  if (s4.faza === 'sala') {
    if (peMin) { s4.ratacit = 0; s4.chemareTablou = Math.max(0, s4.chemareTablou - dt / 900); }
    s4.peMiniatura = peMin ? s4.peMiniatura + dt : Math.max(0, s4.peMiniatura - dt * 1.5);
    if (s4.peMiniatura > PRAG_TAINA) {
      s4.faza = 'descoperit'; s4.t0 = acum;
      opresteMuzicaMuzeu();          // tăcerea uimită din clipa recunoașterii
      sunetDescoperire();
    }
  } else if (s4.faza === 'descoperit') {
    s4.peEticheta = peEti ? s4.peEticheta + dt : Math.max(0, s4.peEticheta - dt * 1.5);
    if (s4.peEticheta > PRAG_TAINA) {
      s4.faza = 'eticheta'; s4.t0 = acum;
      if (audio) sunetClopotel(660);
    }
  } else if (s4.faza === 'portal') {
    s4.portal = Math.min(1, s4.portal + dt / 1800);
    // portalul nu te întoarce în muzeu, ci te duce în galeria următoare
    if (s4.portal >= 1 && acum - s4.t0 > 2600) intraInCampie(s4.buzunar, acum);
  }
}

function click4(acum) {
  if (s4.faza === 'intrare') return;
  if (!s4.lupaLuata) {
    /* Se prinde de sticlă sau de coadă, ca un obiect adevărat. Dar cu fiecare
       atingere care n-a nimerit, locul în care socotim că ai apucat-o se
       lărgește — iar după destule încercări i-o dăm pur și simplu în mână.
       Nimeni n-are voie să rămână blocat aici. */
    /* Locul de apucat e mai larg decât sticla: un obiect mic pe ecran se ia cu
       degetul, nu cu vârful acului. Și se lărgește în plus cu fiecare ratare. */
    const larg = 1.5 + s4.incercari * 0.45;
    const dCoada = Math.hypot(cursor.x - (s4.lupaX + Math.cos(0.78) * s4.lupaR * 2.3),
                              cursor.y - (s4.lupaY + Math.sin(0.78) * s4.lupaR * 2.3));
    if (s4.incercari >= PRAG_LUPA_IN_MANA ||
        Math.hypot(cursor.x - s4.lupaX, cursor.y - s4.lupaY) < s4.lupaR * 1.25 * larg ||
        dCoada < s4.lupaR * 1.3 * larg) {
      s4.lupaLuata = true;
      s4.ratacit = 0;
      if (audio) sunetAtingere();
      return;
    }
    s4.incercari++;
    s4.chemareLupa = Math.max(s4.chemareLupa, 0.45);
    if (audio) sunetAtingere();
    return;
  }
  if (s4.faza !== 'eticheta') return;
  const m = geomMiniatura();
  if (Math.abs(cursor.x - m.ramaX) < m.ramaW * 0.8 &&
      Math.abs(cursor.y - m.ramaY) < m.ramaH * 0.8) {
    s4.faza = 'portal'; s4.t0 = acum; s4.portal = 0;
    sunetPortal();
  }
}

/* ---- SALA, PICTATĂ O DATĂ PE O PÂNZĂ ASCUNSĂ ----
   Un interior rococo adevărat: mătase de perete cu damasc, lambriuri cu
   ancadrament în relief și rocaille în creștet, cornișă cu dinți, parchet în
   perspectivă, două aplice cu lumânări. Totul stă într-o singură pictură pe o
   pânză ascunsă — se desenează o dată și pe urmă doar se copiază. */
const AUR_FOITA = '#d4a843';       // foița de aur, în plină lumină
const AUR_LUSTRUIT = '#f7e5b0';    // muchia lustruită cu piatra de agat
const AUR_UMBRA = '#8a6520';
const BOL_ROSU = '#8a3b26';        // bolul de sub foiță, văzut pe unde s-a tocit
const LEMN_PARCHET = '#c9a063';    // stejar deschis, ca în sălile franțuzești
const LEMN_INCHIS = '#a87c42';
const VERDE_CELADON = '#b9c7a9';   // panourile de perete
const VERDE_PANOU = '#9db08c';
const ROZ_MARMURA = '#cd9490';     // pilaștrii de marmură roz
const ROZ_VINE = '#a86a68';
const CREM_STUC = '#efe6d4';

const salaGalerie = { panza: null, latime: 0, inaltime: 0 };

/* Cutia sălii: peretele din fund, iar de la el pornesc tavanul, pereții
   laterali și podeaua, toate în perspectivă. O sală adevărată are colțuri —
   fără ele, oricât ornament ai pune, tot a hală rămâne. */
function geomSala() {
  const x0 = W * 0.155, x1 = W * 0.845, yT = H * 0.185, yB = H * 0.70;
  return { x0, x1, yT, yB };
}

function fataPatruIn(c, p, culoare) {
  c.fillStyle = culoare;
  c.beginPath();
  c.moveTo(p[0], p[1]); c.lineTo(p[2], p[3]); c.lineTo(p[4], p[5]); c.lineTo(p[6], p[7]);
  c.closePath(); c.fill();
}

// Motivul de damasc de pe mătasea panourilor: o palmetă cu două frunzulițe.
function motivDamasc(c, x, y, s, culoare) {
  c.fillStyle = culoare;
  c.beginPath();
  c.moveTo(x, y - s);
  c.quadraticCurveTo(x + s * 0.58, y - s * 0.48, x + s * 0.26, y);
  c.quadraticCurveTo(x + s * 0.62, y + s * 0.52, x, y + s);
  c.quadraticCurveTo(x - s * 0.62, y + s * 0.52, x - s * 0.26, y);
  c.quadraticCurveTo(x - s * 0.58, y - s * 0.48, x, y - s);
  c.fill();
}

/* Rocaille: volута asimetrică din creștetul unui panou. Rococoul se recunoaște
   după ea — o curbă care se răsucește și nu se închide niciodată simetric. */
function rocaille(c, x, y, s, culoare) {
  c.strokeStyle = culoare;
  c.lineWidth = Math.max(1.2, s * 0.09);
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x - s, y + s * 0.2);
  c.quadraticCurveTo(x - s * 0.5, y - s * 0.55, x, y - s * 0.15);
  c.quadraticCurveTo(x + s * 0.55, y - s * 0.75, x + s * 0.95, y + s * 0.1);
  c.stroke();
  c.beginPath();
  c.moveTo(x - s * 0.45, y + s * 0.05);
  c.quadraticCurveTo(x - s * 0.15, y + s * 0.4, x + s * 0.2, y + s * 0.12);
  c.stroke();
  c.beginPath();
  c.arc(x + s * 0.95, y + s * 0.22, s * 0.14, Math.PI * 1.1, Math.PI * 2.6);
  c.stroke();
  // frunza de acant din mijloc
  c.fillStyle = culoare;
  c.beginPath();
  c.ellipse(x, y - s * 0.3, s * 0.2, s * 0.09, 0.3, 0, Math.PI * 2);
  c.fill();
}

// Un pilastru de marmură roz, cu vinele lui și capitel aurit.
function pilastru(c, x, y, w, h) {
  const m = c.createLinearGradient(x, 0, x + w, 0);
  m.addColorStop(0, ROZ_VINE);
  m.addColorStop(0.35, ROZ_MARMURA);
  m.addColorStop(0.7, '#e0b0aa');
  m.addColorStop(1, ROZ_VINE);
  c.fillStyle = m; c.fillRect(x, y, w, h);
  c.strokeStyle = 'rgba(140, 70, 68, 0.35)';
  c.lineWidth = Math.max(1, w * 0.05);
  for (let k = 0; k < 5; k++) {
    const q = (k * 0.618) % 1;
    c.beginPath();
    c.moveTo(x + w * q, y + h * 0.05 + k * h * 0.18);
    c.quadraticCurveTo(x + w * (1 - q), y + h * 0.12 + k * h * 0.18,
                       x + w * q * 0.6, y + h * 0.2 + k * h * 0.18);
    c.stroke();
  }
  c.fillStyle = AUR_FOITA;                       // capitelul și baza
  c.fillRect(x - w * 0.18, y - h * 0.02, w * 1.36, h * 0.035);
  c.fillRect(x - w * 0.18, y + h * 0.985, w * 1.36, h * 0.03);
}

function pictezaSala(c) {
  const m = geomMiniatura();
  const S = geomSala();

  // ---- tavanul pictat, într-o cornișă aurită ----
  const cer = c.createLinearGradient(0, 0, 0, S.yT);
  cer.addColorStop(0, '#c8b78e');
  cer.addColorStop(0.45, '#9fb6c8');
  cer.addColorStop(1, '#e3d8bd');
  fataPatruIn(c, [0, 0, W, 0, S.x1, S.yT, S.x0, S.yT], '#000');
  c.save();
  c.beginPath();
  c.moveTo(0, 0); c.lineTo(W, 0); c.lineTo(S.x1, S.yT); c.lineTo(S.x0, S.yT);
  c.closePath(); c.clip();
  c.fillStyle = cer; c.fillRect(0, 0, W, S.yT);
  // norii frescei și câteva siluete plutind, abia ghicite
  for (let k = 0; k < 14; k++) {
    const q = (k * 0.618) % 1;
    c.fillStyle = `rgba(255, 250, 235, ${0.18 + q * 0.2})`;
    c.beginPath();
    c.ellipse(W * q, S.yT * (0.12 + ((k * 0.37) % 1) * 0.7),
              W * (0.06 + q * 0.07), S.yT * (0.07 + q * 0.06), 0, 0, Math.PI * 2);
    c.fill();
  }
  for (let k = 0; k < 5; k++) {
    const x = W * (0.18 + k * 0.17), y = S.yT * (0.3 + ((k * 0.41) % 1) * 0.4);
    c.fillStyle = 'rgba(216, 168, 140, 0.5)';
    c.beginPath(); c.ellipse(x, y, W * 0.016, S.yT * 0.05, 0.4, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(x + W * 0.012, y - S.yT * 0.04, W * 0.007, 0, Math.PI * 2); c.fill();
  }
  c.restore();

  // ---- pereții laterali, în perspectivă ----
  fataPatruIn(c, [0, 0, S.x0, S.yT, S.x0, S.yB, 0, H], '#8d9b7f');
  fataPatruIn(c, [W, 0, S.x1, S.yT, S.x1, S.yB, W, H], '#7f8d72');
  for (const lat of [0, 1]) {
    const xm = lat ? W : 0, xi = lat ? S.x1 : S.x0;
    for (let k = 1; k <= 3; k++) {
      const q = k / 4;
      c.strokeStyle = 'rgba(212, 168, 67, 0.3)';
      c.lineWidth = Math.max(1.2, W * 0.0018);
      c.beginPath();
      c.moveTo(intre(xm, xi, q), intre(0, S.yT, q));
      c.lineTo(intre(xm, xi, q), intre(H, S.yB, q));
      c.stroke();
    }
    // marmura roz de pe muchia de colț
    pilastru(c, lat ? S.x1 - W * 0.014 : S.x0, S.yT, W * 0.014, S.yB - S.yT);
  }

  // ---- peretele din fund ----
  const latP = S.x1 - S.x0, inaltP = S.yB - S.yT;
  c.fillStyle = CREM_STUC; c.fillRect(S.x0, S.yT, latP, inaltP);

  // friza de sub cornișă: verde cu ornament de aur și dinți
  c.fillStyle = VERDE_PANOU;
  c.fillRect(S.x0, S.yT, latP, inaltP * 0.12);
  c.fillStyle = AUR_FOITA;
  for (let k = 0; k * (latP * 0.028) < latP; k++) {
    c.fillRect(S.x0 + k * latP * 0.028, S.yT + inaltP * 0.005, latP * 0.014, inaltP * 0.022);
  }
  for (let k = 0; k < 9; k++) {
    rocaille(c, S.x0 + latP * (0.06 + k * 0.11), S.yT + inaltP * 0.075,
             latP * 0.024, 'rgba(212, 168, 67, 0.85)');
  }
  c.fillStyle = AUR_FOITA;
  c.fillRect(S.x0, S.yT + inaltP * 0.12, latP, Math.max(2, inaltP * 0.012));

  // patru panouri de celadon, despărțite de pilaștri de marmură roz
  const panouri = 4;
  for (let k = 0; k < panouri; k++) {
    const pas = latP / panouri;
    const px = S.x0 + k * pas + pas * 0.11, pw = pas * 0.78;
    const py = S.yT + inaltP * 0.19, ph = inaltP * 0.62;
    const fond = c.createLinearGradient(px, py, px, py + ph);
    fond.addColorStop(0, VERDE_CELADON);
    fond.addColorStop(1, VERDE_PANOU);
    c.fillStyle = fond; c.fillRect(px, py, pw, ph);
    for (let r = 0; r * (pw * 0.3) < ph; r++) {
      for (let q = 0; q * (pw * 0.3) < pw; q++) {
        motivDamasc(c, px + q * pw * 0.3 + (r % 2 ? pw * 0.15 : 0),
                    py + r * pw * 0.3, pw * 0.055, 'rgba(255, 255, 240, 0.12)');
      }
    }
    // ancadramentul aurit al panoului
    c.strokeStyle = AUR_FOITA; c.lineWidth = Math.max(2, pw * 0.02);
    c.strokeRect(px, py, pw, ph);
    c.strokeStyle = AUR_LUSTRUIT; c.lineWidth = Math.max(1, pw * 0.008);
    c.strokeRect(px + pw * 0.035, py + ph * 0.022, pw * 0.93, ph * 0.956);
    rocaille(c, px + pw * 0.5, py + ph * 0.035, pw * 0.11, AUR_FOITA);
    rocaille(c, px + pw * 0.5, py + ph * 0.96, pw * 0.08, AUR_UMBRA);
    // pilastrul dintre panouri
    if (k < panouri - 1) {
      pilastru(c, S.x0 + (k + 1) * pas - pas * 0.055, S.yT + inaltP * 0.13,
               pas * 0.11, inaltP * 0.74);
    }
  }

  // lambriul de jos și plinta de marmură
  c.fillStyle = CREM_STUC;
  c.fillRect(S.x0, S.yT + inaltP * 0.83, latP, inaltP * 0.17);
  c.fillStyle = AUR_FOITA;
  c.fillRect(S.x0, S.yT + inaltP * 0.83, latP, Math.max(1.5, inaltP * 0.008));
  c.fillStyle = '#ded2bc';
  c.fillRect(S.x0, S.yB - inaltP * 0.055, latP, inaltP * 0.055);

  // ---- podeaua: parchet deschis, în romburi, care fug spre perete ----
  const podea = c.createLinearGradient(0, S.yB, 0, H);
  podea.addColorStop(0, LEMN_INCHIS);
  podea.addColorStop(0.4, LEMN_PARCHET);
  podea.addColorStop(1, '#d8b478');
  c.fillStyle = podea;
  c.beginPath();
  c.moveTo(0, H); c.lineTo(W, H); c.lineTo(S.x1, S.yB); c.lineTo(S.x0, S.yB);
  c.closePath(); c.fill();
  for (let r = 0; r < 9; r++) {
    const q0 = Math.pow(r / 9, 1.6), q1 = Math.pow((r + 1) / 9, 1.6);
    const y0 = intre(S.yB, H, q0), y1 = intre(S.yB, H, q1);
    const a0 = intre(S.x0, 0, q0), b0 = intre(S.x1, W, q0);
    const a1 = intre(S.x0, 0, q1), b1 = intre(S.x1, W, q1);
    const n = 9;
    for (let k = 0; k <= n; k++) {
      c.strokeStyle = 'rgba(120, 80, 34, 0.28)';
      c.lineWidth = Math.max(1, (r + 1) * 0.22);
      c.beginPath();
      c.moveTo(intre(a0, b0, k / n), y0);
      c.lineTo(intre(a1, b1, (k + 0.5) / n), y1);
      c.stroke();
      c.beginPath();
      c.moveTo(intre(a0, b0, k / n), y0);
      c.lineTo(intre(a1, b1, (k - 0.5) / n), y1);
      c.stroke();
    }
    c.strokeStyle = 'rgba(120, 80, 34, 0.22)';
    c.beginPath(); c.moveTo(a1, y1); c.lineTo(b1, y1); c.stroke();
  }
  // oglindirea sălii în lustrul podelei
  const oglinda = c.createLinearGradient(0, S.yB, 0, H);
  oglinda.addColorStop(0, 'rgba(255, 246, 220, 0.3)');
  oglinda.addColorStop(1, 'rgba(255, 246, 220, 0)');
  c.fillStyle = oglinda;
  c.beginPath();
  c.ellipse(m.ramaX, S.yB + (H - S.yB) * 0.42, W * 0.26, (H - S.yB) * 0.55, 0, 0, Math.PI * 2);
  c.fill();

  // ---- candelabrul de cristal ----
  const lx = W * 0.5, ly = S.yT * 0.5;
  c.strokeStyle = AUR_UMBRA; c.lineWidth = Math.max(1.5, W * 0.002);
  c.beginPath(); c.moveTo(lx, 0); c.lineTo(lx, ly); c.stroke();
  c.fillStyle = AUR_FOITA;
  for (let k = 0; k < 3; k++) {
    c.beginPath();
    c.ellipse(lx, ly + k * H * 0.022, W * (0.05 - k * 0.012), H * 0.008, 0, 0, Math.PI * 2);
    c.fill();
  }
  for (let k = 0; k < 10; k++) {
    const a2 = k / 10 * Math.PI * 2;
    const bx = lx + Math.cos(a2) * W * 0.048, by = ly + H * 0.012 + Math.sin(a2) * H * 0.006;
    c.strokeStyle = AUR_FOITA; c.lineWidth = Math.max(1, W * 0.0014);
    c.beginPath();
    c.moveTo(lx, ly); c.quadraticCurveTo(bx, ly + H * 0.03, bx, by + H * 0.018);
    c.stroke();
    c.fillStyle = '#fff3cf';
    c.beginPath(); c.ellipse(bx, by + H * 0.024, W * 0.004, H * 0.009, 0, 0, Math.PI * 2); c.fill();
  }
  for (let k = 0; k < 26; k++) {                 // cristalele
    const q = (k * 0.618) % 1;
    c.fillStyle = `rgba(255, 252, 235, ${0.35 + q * 0.4})`;
    c.beginPath();
    c.ellipse(lx + (q - 0.5) * W * 0.1, ly + H * (0.02 + ((k * 0.31) % 1) * 0.05),
              W * 0.0035, H * 0.007, 0, 0, Math.PI * 2);
    c.fill();
  }
  const halouLampa = c.createRadialGradient(lx, ly, 0, lx, ly, W * 0.24);
  halouLampa.addColorStop(0, 'rgba(255, 240, 200, 0.3)');
  halouLampa.addColorStop(1, 'rgba(255, 240, 200, 0)');
  c.fillStyle = halouLampa;
  c.beginPath(); c.arc(lx, ly, W * 0.24, 0, Math.PI * 2); c.fill();

  // ---- aplicele de o parte și de alta a lucrării ----
  for (const lat of [-1, 1]) {
    const ax = m.ramaX + lat * m.ramaW * 0.86, ay = m.ramaY - m.ramaH * 0.06;
    c.fillStyle = AUR_UMBRA;
    c.beginPath();
    c.ellipse(ax, ay + m.ramaH * 0.06, m.ramaW * 0.028, m.ramaH * 0.1, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = AUR_FOITA; c.lineWidth = Math.max(2, W * 0.0032); c.lineCap = 'round';
    c.beginPath();
    c.moveTo(ax, ay + m.ramaH * 0.06);
    c.quadraticCurveTo(ax + lat * m.ramaW * 0.1, ay - m.ramaH * 0.02,
                       ax + lat * m.ramaW * 0.13, ay - m.ramaH * 0.1);
    c.stroke();
    c.fillStyle = '#efe3c4';
    c.fillRect(ax + lat * m.ramaW * 0.13 - m.ramaW * 0.011, ay - m.ramaH * 0.26,
               m.ramaW * 0.022, m.ramaH * 0.16);
    c.fillStyle = '#ffd88a';
    c.beginPath();
    c.ellipse(ax + lat * m.ramaW * 0.13, ay - m.ramaH * 0.29, m.ramaW * 0.01, m.ramaW * 0.024, 0, 0, Math.PI * 2);
    c.fill();
    const halou = c.createRadialGradient(ax + lat * m.ramaW * 0.13, ay - m.ramaH * 0.28, 0,
                                         ax + lat * m.ramaW * 0.13, ay - m.ramaH * 0.28, m.ramaW * 0.5);
    halou.addColorStop(0, 'rgba(255, 214, 140, 0.34)');
    halou.addColorStop(1, 'rgba(255, 214, 140, 0)');
    c.fillStyle = halou;
    c.beginPath();
    c.arc(ax + lat * m.ramaW * 0.13, ay - m.ramaH * 0.28, m.ramaW * 0.5, 0, Math.PI * 2);
    c.fill();
  }

  // ---- lumina strânsă pe lucrare ----
  const balta = c.createRadialGradient(m.ramaX, m.ramaY, m.ramaW * 0.25,
                                       m.ramaX, m.ramaY, m.ramaW * 1.2);
  balta.addColorStop(0, 'rgba(255, 244, 214, 0.4)');
  balta.addColorStop(1, 'rgba(255, 244, 214, 0)');
  c.fillStyle = balta;
  c.beginPath(); c.ellipse(m.ramaX, m.ramaY, m.ramaW * 1.2, m.ramaH * 1.3, 0, 0, Math.PI * 2); c.fill();

  consolaLupei(c, m);

  c.fillStyle = 'rgba(60, 40, 20, 0.3)';         // umbra ramei pe perete
  dreptunghiIn(c, m.ramaX - m.ramaW * 0.5 + m.ramaW * 0.03, m.ramaY - m.ramaH * 0.5 + m.ramaH * 0.04,
               m.ramaW, m.ramaH, m.ramaW * 0.03);
  pictezaRama(c, m, 1);

  // ---- funia de catifea pe stâlpi de alamă, în față ----
  const fy = H * 0.9;
  for (const lat of [-1, 1]) {
    const sx = m.ramaX + lat * W * 0.21;
    c.fillStyle = 'rgba(80, 54, 24, 0.3)';
    c.beginPath(); c.ellipse(sx, fy + H * 0.055, W * 0.022, H * 0.012, 0, 0, Math.PI * 2); c.fill();
    const stalp = c.createLinearGradient(sx - W * 0.006, 0, sx + W * 0.006, 0);
    stalp.addColorStop(0, AUR_UMBRA);
    stalp.addColorStop(0.4, AUR_FOITA);
    stalp.addColorStop(1, '#9c7526');
    c.fillStyle = stalp;
    c.fillRect(sx - W * 0.005, fy - H * 0.14, W * 0.01, H * 0.19);
    c.beginPath(); c.ellipse(sx, fy + H * 0.05, W * 0.022, H * 0.008, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(sx, fy - H * 0.15, W * 0.012, H * 0.012, 0, 0, Math.PI * 2); c.fill();
  }
  c.strokeStyle = '#8d2f3c'; c.lineWidth = Math.max(3, H * 0.009); c.lineCap = 'round';
  c.beginPath();
  c.moveTo(m.ramaX - W * 0.21, fy - H * 0.135);
  c.quadraticCurveTo(m.ramaX, fy - H * 0.06, m.ramaX + W * 0.21, fy - H * 0.135);
  c.stroke();
  c.strokeStyle = 'rgba(214, 120, 130, 0.4)'; c.lineWidth = Math.max(1, H * 0.003);
  c.beginPath();
  c.moveTo(m.ramaX - W * 0.21, fy - H * 0.139);
  c.quadraticCurveTo(m.ramaX, fy - H * 0.064, m.ramaX + W * 0.21, fy - H * 0.139);
  c.stroke();

  /* Clarobscurul: lumina se strânge pe lucrare, marginile sălii se sting. Fără
     asta, o încăpere luminată egal arată ca un desen tehnic. */
  const colt = c.createRadialGradient(m.ramaX, m.ramaY, Math.min(W, H) * 0.2,
                                      m.ramaX, m.ramaY, Math.max(W, H) * 0.62);
  colt.addColorStop(0, 'rgba(24, 14, 6, 0)');
  colt.addColorStop(0.6, 'rgba(24, 14, 6, 0.26)');
  colt.addColorStop(1, 'rgba(24, 14, 6, 0.72)');
  c.fillStyle = colt; c.fillRect(0, 0, W, H);
}

// Un dreptunghi rotunjit desenat într-un context oarecare.
function dreptunghiIn(c, x, y, w, h, r) {
  c.beginPath();
  if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
  c.fill();
}

// Consola de marmură de sub lucrare, unde stă lupa cât n-o ia nimeni.
/* Unde stă consola de marmură. Lupa se așază pe blatul ei, așa că locul se
   socotește o singură dată, aici: altfel una urcă și cealaltă rămâne jos.
   Blatul stă la înălțimea tabloului, nu la genunchi — un obiect așezat jos de
   tot se ia din aplecare, și se simte greu de apucat. */
function geomConsola(m) {
  const w = m.ramaW * 0.62, h = m.ramaH * 0.07;
  return { w, h, x: m.ramaX + m.ramaW * 0.72, y: m.ramaY + m.ramaH * 0.40 };
}

function consolaLupei(c, m) {
  const g = geomConsola(m);
  const w = g.w, h = g.h, x = g.x, y = g.y;
  c.fillStyle = 'rgba(70, 48, 24, 0.3)';
  c.fillRect(x - w / 2 + h * 0.4, y + h, w, h * 0.5);
  const marmura = c.createLinearGradient(0, y, 0, y + h);
  marmura.addColorStop(0, '#f2ece0');
  marmura.addColorStop(1, '#c3b6a1');
  c.fillStyle = marmura;
  dreptunghiIn(c, x - w / 2, y, w, h, h * 0.25);
  c.fillStyle = AUR_FOITA;
  c.fillRect(x - w / 2, y + h * 0.82, w, Math.max(1, h * 0.12));
  c.strokeStyle = AUR_UMBRA; c.lineWidth = Math.max(1.5, w * 0.018);
  for (const lat of [-1, 1]) {
    c.beginPath();
    c.moveTo(x + lat * w * 0.32, y + h);
    c.quadraticCurveTo(x + lat * w * 0.26, y + h * 2.4, x + lat * w * 0.06, y + h * 2.9);
    c.stroke();
  }
}

/* ---- RAMA ----
   O ramă aurită adevărată nu e un chenar, ci un teanc de brâuri concentrice,
   fiecare cu ornamentul lui: mărgele, torul gadronat (lobii înclinați, cu
   creastă luminată și vale întunecată), iar mărgele, dinți, o friză netedă și
   încă un rând de mărgele lângă tablou. În colțuri, brâurile se rup și în locul
   lor stă câte un cartuș de acant. Aurul se tocește pe creste și lasă bolul
   roșu să se vadă — de-aia o ramă veche nu e niciodată de o singură culoare. */

/* Tot aurul ramei se scoate dintr-o singură scară de lumină: 0 e fundul negru
   al unei scobituri, 1 e creasta lustruită care prinde fereastra. Așa ornamentele
   nu mai sunt pete de culoare puse una lângă alta, ci același metal văzut sub
   lumini diferite — ăsta e lucrul care face diferența dintre desen și sculptură. */
function tonAur(l) {
  const q = Math.max(0, Math.min(1, l));
  /* Patru trepte, nu două: fundul negru-brun al scobiturii, aurul de mijloc,
     creasta caldă și, chiar în vârf, o sclipire răcoroasă — foița bătută are
     puncte care bat spre argintiu acolo unde lumina cade perpendicular. */
  const umbra = [46, 28, 4], adanc = [122, 84, 20], mijloc = [206, 162, 62],
        creasta = [250, 232, 176], argint = [252, 248, 236];
  const intre3 = (a, b, t) => Math.round(a + (b - a) * t);
  const treapta = (a, b, t) =>
    `rgb(${intre3(a[0], b[0], t)}, ${intre3(a[1], b[1], t)}, ${intre3(a[2], b[2], t)})`;
  if (q < 0.28) return treapta(umbra, adanc, q / 0.28);
  if (q < 0.58) return treapta(adanc, mijloc, (q - 0.28) / 0.3);
  if (q < 0.88) return treapta(mijloc, creasta, (q - 0.58) / 0.3);
  return treapta(creasta, argint, (q - 0.88) / 0.12);
}

/* Cât de tare bate lumina într-un punct al ramei. Vine din stânga-sus, deci
   latura de sus și cea din stânga sunt luminate, celelalte două stau în umbră.
   Fără asta, o ramă desenată arată plată oricâte ornamente ai pune pe ea. */
function luminaRamei(px, py, x, y, w, h) {
  const qx = (px - x) / w, qy = (py - y) / h;
  return 0.42 + 0.58 * ((1 - qx) * 0.45 + (1 - qy) * 0.55);
}

// Plimbă un ornament pe toate cele patru laturi, la o depărtare dată de margine.
function braulRamei(c, x, y, w, h, inset, pas, deseneaza) {
  const X = x + inset, Y = y + inset, Wb = w - inset * 2, Hb = h - inset * 2;
  if (Wb <= 0 || Hb <= 0 || pas <= 0.5) return;
  const L = (px, py) => luminaRamei(px, py, x, y, w, h);
  let i = 0;
  for (let px = X + pas * 0.5; px < X + Wb; px += pas) {
    deseneaza(c, px, Y, 0, L(px, Y), i++);
    deseneaza(c, px, Y + Hb, Math.PI, L(px, Y + Hb), i++);
  }
  for (let py = Y + pas * 0.5; py < Y + Hb; py += pas) {
    deseneaza(c, X, py, -Math.PI / 2, L(X, py), i++);
    deseneaza(c, X + Wb, py, Math.PI / 2, L(X + Wb, py), i++);
  }
}

// O mărgică: bilă de aur, cu lumina în creștet și scobitura umbrită dedesubt.
function margica(c, x, y, ang, r, l, i) {
  // fiecare bilă e cioplită cu mâna: alta ca mărime, alta ca așezare
  const v = pigment((i || 0) * 2.7 + 1.3), v2 = pigment((i || 0) * 5.1 + 0.4);
  const rr = r * (0.84 + v * 0.34);
  c.save();
  c.translate(x + (v2 - 0.5) * r * 0.22, y + (v - 0.5) * r * 0.18);
  c.rotate(ang);
  c.fillStyle = tonAur(l * 0.13);                 // scobitura din spatele bilei
  c.beginPath(); c.ellipse(0, rr * 0.3, rr * 1.14, rr * 1.02, 0, 0, Math.PI * 2); c.fill();
  const bila = c.createRadialGradient(-rr * 0.32, -rr * 0.36, rr * 0.06, 0, 0, rr);
  bila.addColorStop(0, tonAur(Math.min(1, l * 1.42 + v2 * 0.1)));
  bila.addColorStop(0.42, tonAur(l * 0.94));
  bila.addColorStop(1, tonAur(l * 0.36));
  c.fillStyle = bila;
  c.beginPath(); c.ellipse(0, 0, rr * 0.95, rr * (0.88 + v2 * 0.14), 0, 0, Math.PI * 2); c.fill();
  c.restore();
}

/* Un lob de tor gadronat. Lobii se ating unul pe altul, iar între ei rămâne o
   crăpătură aproape neagră; pe fiecare aleargă o creastă care prinde lumina.
   Contrastul dintre crăpătură și creastă e tot ce face aurul să pară bătut. */
function gadron(c, x, y, ang, lat, adanc, l, i) {
  const v = pigment((i || 0) * 3.7 + 2.1), v2 = pigment((i || 0) * 1.9 + 5.5);
  const la = lat * (0.88 + v * 0.26), ad = adanc * (0.9 + v2 * 0.2);
  const inclin = -0.4 + (v - 0.5) * 0.22;         // niciun lob nu stă la fel
  c.save();
  c.translate(x, y + (v2 - 0.5) * adanc * 0.1);
  c.rotate(ang);
  c.fillStyle = tonAur(l * 0.08);                 // crăpătura dintre lobi
  c.beginPath();
  c.ellipse(-la * 0.34, 0, la * 0.56, ad * 0.58, inclin, 0, Math.PI * 2);
  c.fill();
  const perna = c.createLinearGradient(-la * 0.34, ad * 0.36, la * 0.34, -ad * 0.36);
  perna.addColorStop(0, tonAur(l * 0.22));
  perna.addColorStop(0.4, tonAur(l * 0.76));
  perna.addColorStop(0.7, tonAur(Math.min(1, l * 1.26 + v * 0.08)));
  perna.addColorStop(1, tonAur(l * 0.42));
  c.fillStyle = perna;
  c.beginPath();
  c.ellipse(0, 0, la * 0.54, ad * 0.52, inclin, 0, Math.PI * 2);
  c.fill();
  // creasta, cu o sclipire punctuală acolo unde lumina cade drept
  c.strokeStyle = tonAur(Math.min(1, l * 1.45));
  c.lineWidth = Math.max(1, ad * 0.085); c.lineCap = 'round';
  c.beginPath();
  c.moveTo(-la * 0.18, ad * 0.24); c.lineTo(la * 0.2, -ad * 0.26);
  c.stroke();
  if (l > 0.62 && v2 > 0.4) {
    c.fillStyle = tonAur(1);
    c.beginPath();
    c.ellipse(la * (0.02 + v * 0.12), -ad * 0.14, la * 0.09, ad * 0.06, inclin, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

// Un dinte: bloculeț cu față luminată, latură umbrită și umbra lui dedesubt.
function dinte(c, x, y, ang, lat, inalt, l, i) {
  const v = pigment((i || 0) * 4.3 + 3.9);
  lat = lat * (0.9 + v * 0.2);
  c.save(); c.translate(x, y); c.rotate(ang + (v - 0.5) * 0.06);
  c.fillStyle = tonAur(l * 0.12);
  c.fillRect(-lat * 0.5, -inalt * 0.4, lat * 1.1, inalt);
  const fata = c.createLinearGradient(0, -inalt * 0.5, 0, inalt * 0.5);
  fata.addColorStop(0, tonAur(Math.min(1, l * 1.25)));
  fata.addColorStop(1, tonAur(l * 0.55));
  c.fillStyle = fata;
  c.fillRect(-lat * 0.4, -inalt * 0.5, lat * 0.8, inalt * 0.86);
  c.restore();
}

// O frunzuliță de acant, culcată pe brâul dinăuntru.
function frunzulita(c, x, y, ang, s, l) {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.fillStyle = tonAur(l === undefined ? 0.8 : l * 0.95);
  c.beginPath();
  c.moveTo(0, s * 0.4);
  c.quadraticCurveTo(-s * 0.5, -s * 0.1, 0, -s * 0.5);
  c.quadraticCurveTo(s * 0.5, -s * 0.1, 0, s * 0.4);
  c.fill();
  c.strokeStyle = tonAur((l === undefined ? 0.8 : l) * 0.3);
  c.lineWidth = Math.max(0.8, s * 0.09);
  c.beginPath(); c.moveTo(0, s * 0.35); c.lineTo(0, -s * 0.42); c.stroke();
  c.restore();
}

/* Cartușul de colț: acantul care rupe brâurile și se răsucește în afară.
   Fără el, cele patru laturi s-ar întâlni ca la un tocător de bucătărie. */
function cartusColt(c, cx, cy, s, sx, sy) {
  c.save(); c.translate(cx, cy); c.scale(sx, sy);

  /* Umbra bosajului cade spre înăuntrul ramei, nu în afară — altfel se scurge
     pe perete și pare o pată, nu o umbră. */
  const uSus = c.createRadialGradient(-s * 0.18, -s * 0.16, s * 0.1, -s * 0.18, -s * 0.16, s * 0.86);
  uSus.addColorStop(0, 'rgba(28, 16, 2, 0.42)');
  uSus.addColorStop(1, 'rgba(28, 16, 2, 0)');
  c.fillStyle = uSus;
  c.beginPath();
  c.ellipse(-s * 0.18, -s * 0.16, s * 0.86, s * 0.78, 0.3, 0, Math.PI * 2);
  c.fill();

  /* Foile de acant, una peste alta, de la cele din spate spre cele din față.
     Fiecare are dosul umbrit și fața luminată, iar vârfurile se răsucesc în
     afară — asta face bosajul să pară cioplit, nu ștanțat. */
  for (let k = 0; k < 7; k++) {
    const a2 = -2.5 + k * 0.42;
    const adanc = k / 6;                          // cele din spate stau în umbră
    const lung = s * (0.72 + pigment(k * 2.3) * 0.34);
    c.save(); c.rotate(a2);
    c.fillStyle = tonAur(0.16 + adanc * 0.22);    // dosul foii
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(lung * 0.5, -s * 0.34, lung * 1.04, -s * 0.04);
    c.quadraticCurveTo(lung * 0.56, s * 0.2, 0, 0);
    c.fill();
    const fata = c.createLinearGradient(0, -s * 0.2, lung, s * 0.1);
    fata.addColorStop(0, tonAur(0.5 + adanc * 0.3));
    fata.addColorStop(0.55, tonAur(0.78 + adanc * 0.2));
    fata.addColorStop(1, tonAur(0.34));
    c.fillStyle = fata;
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(lung * 0.48, -s * 0.26, lung * 0.94, -s * 0.06);
    c.quadraticCurveTo(lung * 0.5, s * 0.12, 0, 0);
    c.fill();
    // nervura de pe mijlocul foii
    c.strokeStyle = tonAur(0.22);
    c.lineWidth = Math.max(0.8, s * 0.035);
    c.beginPath();
    c.moveTo(lung * 0.12, -s * 0.02);
    c.quadraticCurveTo(lung * 0.52, -s * 0.13, lung * 0.9, -s * 0.05);
    c.stroke();
    // vârful răsucit, care prinde lumina
    c.fillStyle = tonAur(0.95);
    c.beginPath();
    c.ellipse(lung * 0.92, -s * 0.05, s * 0.09, s * 0.045, -0.4, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  // butonul din mijloc: o bilă de aur cu scobitura ei
  c.fillStyle = tonAur(0.14);
  c.beginPath(); c.arc(s * 0.02, s * 0.04, s * 0.29, 0, Math.PI * 2); c.fill();
  const buton = c.createRadialGradient(-s * 0.1, -s * 0.12, s * 0.02, 0, 0, s * 0.28);
  buton.addColorStop(0, tonAur(1));
  buton.addColorStop(0.45, tonAur(0.8));
  buton.addColorStop(1, tonAur(0.34));
  c.fillStyle = buton;
  c.beginPath(); c.arc(-s * 0.04, -s * 0.04, s * 0.25, 0, Math.PI * 2); c.fill();
  // volута care iese din buton
  c.strokeStyle = tonAur(0.62); c.lineWidth = Math.max(1, s * 0.06); c.lineCap = 'round';
  c.beginPath();
  c.arc(-s * 0.04, -s * 0.04, s * 0.16, 0.5, 4.6);
  c.stroke();
  c.restore();
}

/* `grosime` e cât din lățime ține profilul aurit. În jurul unei miniaturi rama
   e lată — de-aia se și vede sculptura pe ea. În jurul unei pânze mari, aceeași
   proporție ar da un profil cât un stat de om, așa că se subțiază. */
function pictezaRama(c, m, scara, grosime) {
  const w = m.ramaW * scara, h = m.ramaH * scara;
  const x = m.ramaX - w / 2, y = m.ramaY - h / 2;
  const gr = w * (grosime || 0.2);             // toată lățimea profilului

  // bolul roșu de dedesubt, care se ivește pe unde s-a tocit aurul
  c.fillStyle = BOL_ROSU;
  dreptunghiIn(c, x - gr * 0.12, y - gr * 0.12, w + gr * 0.24, h + gr * 0.24, gr * 0.1);

  // corpul ramei: aurul de fond, cu lumina venind din stânga-sus
  const aur = c.createLinearGradient(x, y, x + w * 0.75, y + h);
  aur.addColorStop(0, AUR_LUSTRUIT);
  aur.addColorStop(0.28, AUR_FOITA);
  aur.addColorStop(0.6, AUR_UMBRA);
  aur.addColorStop(0.86, AUR_FOITA);
  aur.addColorStop(1, AUR_LUSTRUIT);
  c.fillStyle = aur;
  dreptunghiIn(c, x, y, w, h, gr * 0.06);

  /* Muchiile se înmoaie. O ramă fotografiată n-are contururi tăiate cu cuțitul:
     lumina se scurge peste ele. Estomparea se plătește o singură dată, fiindcă
     sala se pictează o dată și pe urmă se copiază. */
  const moale = scara <= 1.01 && c.filter !== undefined;
  if (moale) c.filter = 'blur(0.7px)';

  // ---- brâurile, de la margine spre tablou ----
  const marg = Math.max(1.6, gr * 0.075);
  braulRamei(c, x, y, w, h, gr * 0.075, marg * 1.82,
             (cc, px, py, ang, l, i) => margica(cc, px, py, ang, marg, l, i));

  // friza netedă dintre mărgele și tor
  c.fillStyle = AUR_UMBRA;
  c.fillRect(x + gr * 0.17, y + gr * 0.17, w - gr * 0.34, h - gr * 0.34);
  c.fillStyle = aur;
  c.fillRect(x + gr * 0.2, y + gr * 0.2, w - gr * 0.4, h - gr * 0.4);

  // torul gadronat — ornamentul care se vede de departe
  const lobLat = Math.max(5, gr * 0.36), lobAdanc = Math.max(5, gr * 0.42);
  braulRamei(c, x, y, w, h, gr * 0.42, lobLat * 0.6,
             (cc, px, py, ang, l, i) => gadron(cc, px, py, ang, lobLat, lobAdanc, l, i));

  // al doilea rând de mărgele
  const marg2 = Math.max(1.3, gr * 0.055);
  braulRamei(c, x, y, w, h, gr * 0.68, marg2 * 1.85,
             (cc, px, py, ang, l, i) => margica(cc, px, py, ang, marg2, l, i + 40));

  // dinții
  const dLat = Math.max(2.4, gr * 0.1), dInalt = Math.max(2.4, gr * 0.12);
  braulRamei(c, x, y, w, h, gr * 0.8, dLat * 1.75,
             (cc, px, py, ang, l, i) => dinte(cc, px, py, ang, dLat, dInalt, l, i));

  // frunzulițele de pe brâul dinăuntru
  braulRamei(c, x, y, w, h, gr * 0.95, Math.max(4, gr * 0.18),
             (cc, px, py, ang, l, i) =>
               frunzulita(cc, px, py, ang, gr * 0.16 * (0.86 + pigment(i * 6.1) * 0.3), l));

  if (moale) c.filter = 'none';

  /* Umbrele dintre planuri: fiecare brâu stă mai adânc decât cel dinaintea lui,
     iar pe muchia de sus-stânga a scobiturii cade o umbră subțire. Asta dă
     senzația de trepte, nu de desen plat. */
  c.strokeStyle = 'rgba(32, 18, 2, 0.4)';
  for (const q of [0.17, 0.4, 0.66, 0.79, 0.94]) {
    c.lineWidth = Math.max(1, gr * 0.035);
    c.strokeRect(x + gr * q, y + gr * q, w - gr * q * 2, h - gr * q * 2);
  }
  c.strokeStyle = 'rgba(255, 240, 200, 0.22)';
  for (const q of [0.19, 0.42, 0.68, 0.81, 0.96]) {
    c.lineWidth = Math.max(1, gr * 0.02);
    c.beginPath();
    c.moveTo(x + gr * q, y + h - gr * q);
    c.lineTo(x + gr * q, y + gr * q);
    c.lineTo(x + w - gr * q, y + gr * q);
    c.stroke();
  }

  // ---- cartușele din colțuri, care rup brâurile ----
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    // cel de sus-stânga e mai mare: rococoul nu e simetric
    const mare = (sx < 0 && sy < 0) ? 1.28 : (sx > 0 && sy > 0 ? 0.86 : 1);
    cartusColt(c, m.ramaX + sx * (w / 2 - gr * 0.34), m.ramaY + sy * (h / 2 - gr * 0.34),
               gr * 0.52 * mare * scara / (scara || 1), sx, sy);
  }
  // scoica din creștetul laturii de sus
  c.fillStyle = AUR_LUSTRUIT;
  c.beginPath();
  c.ellipse(m.ramaX, y + gr * 0.28, gr * 0.5, gr * 0.3, 0, Math.PI, 0);
  c.fill();
  c.strokeStyle = AUR_UMBRA; c.lineWidth = Math.max(1, gr * 0.03);
  for (let k = -3; k <= 3; k++) {
    c.beginPath();
    c.moveTo(m.ramaX, y + gr * 0.28);
    c.lineTo(m.ramaX + k * gr * 0.13, y + gr * 0.28 - gr * 0.28 + Math.abs(k) * gr * 0.035);
    c.stroke();
  }

  /* Patina: praful și lacul vechi se strâng în scobituri, iar jumătatea de
     jos-dreapta a ramei stă oricum în umbră. O trecere peste tot, la sfârșit,
     leagă ornamentele între ele mai bine decât orice detaliu în plus. */
  const patina = c.createLinearGradient(x, y, x + w, y + h);
  patina.addColorStop(0, 'rgba(40, 24, 4, 0)');
  patina.addColorStop(0.55, 'rgba(40, 24, 4, 0.1)');
  patina.addColorStop(1, 'rgba(40, 24, 4, 0.42)');
  c.fillStyle = patina;
  dreptunghiIn(c, x, y, w, h, gr * 0.06);

  // tocirile: aurul plecat de pe creste, cu bolul roșu ivit dedesubt
  c.fillStyle = 'rgba(138, 59, 38, 0.45)';
  for (let k = 0; k < 18; k++) {
    const q = (k * 0.618) % 1, pe = k % 4;
    const px = (pe === 0 || pe === 2) ? x + w * q : (pe === 1 ? x + w - gr * 0.3 : x + gr * 0.3);
    const py = pe === 0 ? y + gr * 0.3 : (pe === 2 ? y + h - gr * 0.3 : y + h * q);
    c.beginPath();
    c.ellipse(px, py, gr * (0.05 + q * 0.09), gr * 0.04, q * 3, 0, Math.PI * 2);
    c.fill();
  }

  /* Textura foiței: bătută pe gesso, se crapă fin și prinde praf în crăpături,
     iar pe creste rămân sclipiri mărunte. Fără ele aurul arată ca vopseaua. */
  for (let k = 0; k < 220; k++) {
    const q = (k * 0.618) % 1, q2 = (k * 0.377) % 1, q3 = (k * 0.211) % 1;
    const px3 = x + w * q, py3 = y + h * q2;
    const peProfil = px3 < x + gr || px3 > x + w - gr || py3 < y + gr || py3 > y + h - gr;
    if (!peProfil) continue;
    const l3 = luminaRamei(px3, py3, x, y, w, h);
    if (q3 > 0.55) {
      c.strokeStyle = `rgba(38, 22, 4, ${0.1 + q3 * 0.18})`;   // crăpătura
      c.lineWidth = Math.max(0.6, gr * 0.012);
      c.beginPath();
      c.moveTo(px3, py3);
      c.lineTo(px3 + (q - 0.5) * gr * 0.4, py3 + (q2 - 0.5) * gr * 0.4);
      c.stroke();
    } else if (l3 > 0.66) {
      c.fillStyle = `rgba(255, 250, 226, ${0.2 + q3 * 0.4})`;  // sclipirea
      c.beginPath();
      c.ellipse(px3, py3, gr * (0.012 + q3 * 0.02), gr * 0.012, q * 6, 0, Math.PI * 2);
      c.fill();
    }
  }

  // ---- pânza de in și tabloul ----
  const li = gr * 1.06;
  c.fillStyle = '#3a2a14';
  c.fillRect(x + li * 0.94, y + li * 0.94, w - li * 1.88, h - li * 1.88);
  c.fillStyle = '#cbbfa4';
  c.fillRect(x + li, y + li, w - li * 2, h - li * 2);
  c.strokeStyle = '#f6f1e2'; c.lineWidth = Math.max(1, gr * 0.035);
  c.strokeRect(x + li, y + li, w - li * 2, h - li * 2);

  const pw = m.picturaW * scara, ph = m.picturaH * scara;
  const px2 = m.ramaX - pw / 2, py2 = m.ramaY - h * 0.1 - ph / 2;
  c.fillStyle = '#2a1c0c';
  c.fillRect(px2 - pw * 0.09, py2 - ph * 0.09, pw * 1.18, ph * 1.18);
  c.fillStyle = NEGRU_SCENA1;
  c.fillRect(px2, py2, pw, ph);
  c.fillStyle = 'rgba(255, 248, 228, 0.8)';
  c.beginPath(); c.arc(m.ramaX, py2 + ph * 0.42, Math.max(1, pw * 0.06), 0, Math.PI * 2); c.fill();

  // plăcuța de alamă de pe brâul de jos
  c.fillStyle = '#b9922f';
  const ew = w * 0.26, eh = h * 0.042;
  c.fillRect(m.ramaX - ew / 2, m.ramaY + h * 0.42 - eh / 2, ew, eh);
  c.fillStyle = 'rgba(255, 240, 190, 0.55)';
  c.fillRect(m.ramaX - ew / 2, m.ramaY + h * 0.42 - eh / 2, ew, Math.max(1, eh * 0.28));
}

/* Lupa de detectiv, așa cum arată una adevărată: cerc de alamă cu bizou, sticlă
   cu o dâră de lumină curbată pe ea, coadă de lemn strunjit cu inel și verigă.
   Cât stă pe consolă își aruncă umbra pe marmură. */
function deseneazaLupa(lx, ly, r, luata, unghi) {
  const a = unghi === undefined ? 0.78 : unghi;

  if (!luata) {                          // umbra de pe blatul consolei
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#4a3018';
    ctx.beginPath();
    ctx.ellipse(lx + r * 0.85, ly + r * 0.52, r * 1.5, r * 0.2, 0.62, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // coada: lemn strunjit, cu verigă la capăt
  /* Proporțiile unei lupe adevărate: la o lentilă de 7,8 cm, toată lupa are
     18 cm — coada e cam cât un diametru și un sfert, nu cât o jumătate. */
  const cx1 = lx + Math.cos(a) * r * 1.1, cy1 = ly + Math.sin(a) * r * 1.1;
  const cx2 = lx + Math.cos(a) * r * 3.5, cy2 = ly + Math.sin(a) * r * 3.5;
  const lemn = ctx.createLinearGradient(cx1, cy1 - r * 0.14, cx1, cy1 + r * 0.14);
  lemn.addColorStop(0, '#8a5b2c');
  lemn.addColorStop(0.45, '#5b3717');
  lemn.addColorStop(1, '#3a220e');
  ctx.strokeStyle = lemn; ctx.lineWidth = r * 0.24; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx1, cy1); ctx.lineTo(cx2, cy2); ctx.stroke();
  // strunjirea: două inele care subțiază lemnul pe la mijloc
  ctx.strokeStyle = '#331d0b'; ctx.lineWidth = r * 0.26;
  for (const q of [1.75, 2.9]) {
    const gx = lx + Math.cos(a) * r * q, gy = ly + Math.sin(a) * r * q;
    ctx.beginPath();
    ctx.moveTo(gx - Math.cos(a) * r * 0.05, gy - Math.sin(a) * r * 0.05);
    ctx.lineTo(gx + Math.cos(a) * r * 0.05, gy + Math.sin(a) * r * 0.05);
    ctx.stroke();
  }
  // virola de alamă de la gât și veriga de agățat de la capăt
  ctx.strokeStyle = AUR_FOITA; ctx.lineWidth = r * 0.11;
  ctx.beginPath();
  ctx.moveTo(lx + Math.cos(a) * r * 1.14, ly + Math.sin(a) * r * 1.14);
  ctx.lineTo(lx + Math.cos(a) * r * 1.42, ly + Math.sin(a) * r * 1.42);
  ctx.stroke();
  ctx.lineWidth = r * 0.055;
  ctx.beginPath();
  ctx.arc(lx + Math.cos(a) * r * 3.66, ly + Math.sin(a) * r * 3.66, r * 0.13, 0, Math.PI * 2);
  ctx.stroke();

  // cercul de alamă: un tor cu lumină sus-stânga și umbră jos-dreapta
  const alama = ctx.createLinearGradient(lx - r, ly - r, lx + r, ly + r);
  alama.addColorStop(0, AUR_LUSTRUIT);
  alama.addColorStop(0.35, AUR_FOITA);
  alama.addColorStop(0.7, AUR_UMBRA);
  alama.addColorStop(1, '#c9a24a');
  ctx.strokeStyle = alama; ctx.lineWidth = r * 0.16;
  ctx.beginPath(); ctx.arc(lx, ly, r * 1.05, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(60, 38, 8, 0.5)'; ctx.lineWidth = r * 0.035;
  ctx.beginPath(); ctx.arc(lx, ly, r * 0.98, 0, Math.PI * 2); ctx.stroke();
}

// Dâra de lumină de pe sticlă — se desenează peste ce se vede prin lupă.
function luciulSticlei(lx, ly, r) {
  ctx.save();
  ctx.beginPath(); ctx.arc(lx, ly, r, 0, Math.PI * 2); ctx.clip();
  const dara = ctx.createLinearGradient(lx - r, ly - r, lx + r * 0.3, ly + r * 0.5);
  dara.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  dara.addColorStop(0.4, 'rgba(255, 255, 255, 0.04)');
  dara.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = dara;
  ctx.beginPath(); ctx.arc(lx, ly, r, 0, Math.PI * 2); ctx.fill();
  // reflexul curbat al ferestrei, semnul că e sticlă și nu o gaură
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = r * 0.075; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(lx, ly, r * 0.72, Math.PI * 1.08, Math.PI * 1.42);
  ctx.stroke();
  ctx.lineWidth = r * 0.035;
  ctx.beginPath();
  ctx.arc(lx, ly, r * 0.72, Math.PI * 1.5, Math.PI * 1.62);
  ctx.stroke();
  // umbra tocului pe sticlă, jos-dreapta
  const inel = ctx.createRadialGradient(lx, ly, r * 0.7, lx, ly, r);
  inel.addColorStop(0, 'rgba(40, 24, 8, 0)');
  inel.addColorStop(1, 'rgba(40, 24, 8, 0.4)');
  ctx.fillStyle = inel;
  ctx.beginPath(); ctx.arc(lx, ly, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/* Rama are peste o mie de forme. Cât crește portalul, redesenarea ei la fiecare
   cadru face mișcarea să se poticnească — tocmai acolo unde trebuie să curgă.
   Așa că se pictează o dată pe o ștampilă a ei, cu tot cu volutele care ies din
   dreptunghi, și pe urmă se întinde ca o imagine. */
const stampilaRamei = { panza: null, cheie: '', latime: 0, inaltime: 0 };

function pregatesteRama(m) {
  const cheie = Math.round(m.ramaW) + 'x' + Math.round(m.ramaH);
  if (stampilaRamei.panza && stampilaRamei.cheie === cheie) return stampilaRamei;
  const marg = m.ramaW * 0.2;                  // loc pentru cartușele din colțuri
  const p = document.createElement('canvas');
  p.width = Math.ceil(m.ramaW + marg * 2);
  p.height = Math.ceil(m.ramaH + marg * 2);
  const local = Object.assign({}, m, { ramaX: p.width / 2, ramaY: p.height / 2 });
  pictezaRama(p.getContext('2d'), local, 1);
  stampilaRamei.panza = p; stampilaRamei.cheie = cheie;
  stampilaRamei.latime = p.width; stampilaRamei.inaltime = p.height;
  return stampilaRamei;
}

function pregatesteSala() {
  if (salaGalerie.panza && salaGalerie.latime === W && salaGalerie.inaltime === H) return;
  const p = document.createElement('canvas');
  p.width = W; p.height = H;
  pictezaSala(p.getContext('2d'));
  salaGalerie.panza = p; salaGalerie.latime = W; salaGalerie.inaltime = H;
}

/* ---- ce se vede prin lupă ---- */

// Taina: tu, din spate, în fața ecranului negru de la începutul jocului.
function deseneazaTaina(lx, ly, r, acum) {
  ctx.fillStyle = NEGRU_SCENA1;
  ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
  // punctul alb din mijloc — cel de la care a pornit totul
  const puls = 0.7 + 0.3 * Math.sin(acum * 0.004);
  ctx.fillStyle = `rgba(255, 250, 240, ${0.9 * puls})`;
  ctx.beginPath(); ctx.arc(lx + r * 0.05, ly - r * 0.3, r * 0.035, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#1b2430';                      // umerii și capul, văzute din spate
  ctx.beginPath();
  ctx.ellipse(lx - r * 0.12, ly + r * 0.78, r * 0.4, r * 0.34, 0, Math.PI, 0);
  ctx.fill();
  ctx.beginPath(); ctx.arc(lx - r * 0.12, ly + r * 0.34, r * 0.17, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#1b2430'; ctx.lineWidth = r * 0.08; ctx.lineCap = 'round';
  ctx.beginPath();                                 // brațul care arată spre ramă
  ctx.moveTo(lx + r * 0.08, ly + r * 0.6);
  ctx.quadraticCurveTo(lx + r * 0.45, ly + r * 0.44, lx + r * 0.66, ly + r * 0.16);
  ctx.stroke();

  // cheia strălucitoare din cealaltă mână
  ctx.strokeStyle = ALAMA; ctx.lineWidth = r * 0.05;
  ctx.beginPath();
  ctx.moveTo(lx - r * 0.52, ly + r * 0.5); ctx.lineTo(lx - r * 0.52, ly + r * 0.76);
  ctx.stroke();
  ctx.fillStyle = ALAMA;
  ctx.beginPath(); ctx.arc(lx - r * 0.52, ly + r * 0.46, r * 0.075, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(lx - r * 0.52, ly + r * 0.66, r * 0.1, r * 0.035);
  const sclipire = ctx.createRadialGradient(lx - r * 0.52, ly + r * 0.56, 0,
                                            lx - r * 0.52, ly + r * 0.56, r * 0.4);
  sclipire.addColorStop(0, `rgba(255, 228, 150, ${0.5 * puls})`);
  sclipire.addColorStop(1, 'rgba(255, 228, 150, 0)');
  ctx.fillStyle = sclipire;
  ctx.beginPath(); ctx.arc(lx - r * 0.52, ly + r * 0.56, r * 0.4, 0, Math.PI * 2); ctx.fill();
}

// Eticheta gravată de pe brâul ramei.
function deseneazaEtichetaRamei(lx, ly, r) {
  ctx.fillStyle = '#3a2718';
  ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
  ctx.fillStyle = '#b9922f';
  dreptunghi(lx - r * 0.9, ly - r * 0.5, r * 1.8, r * 1.0, r * 0.06);
  ctx.fillStyle = 'rgba(255, 240, 190, 0.45)';
  ctx.fillRect(lx - r * 0.9, ly - r * 0.5, r * 1.8, Math.max(1, r * 0.03));
  ctx.strokeStyle = '#6d4d1a'; ctx.lineWidth = Math.max(1, r * 0.014);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(lx - r * 0.82, ly - r * 0.42, r * 1.64, r * 0.84, r * 0.04);
  else ctx.rect(lx - r * 0.82, ly - r * 0.42, r * 1.64, r * 0.84);
  ctx.stroke();

  /* Rândurile se așază unul sub altul folosind unde s-a terminat cel dinainte.
     Puse la înălțimi fixe, se călcau când titlul trecea pe două rânduri. */
  const marime = Math.max(9, Math.round(r * 0.125));
  const jos = textIncadrat('«Tu, înainte de a începe»', lx, ly - r * 0.33,
                           r * 1.5, marime * 1.35, `${marime}px Georgia`, '#3a2a10');
  textIncadrat('atinge rama', lx, jos + marime * 0.4, r * 1.5,
               marime * 1.35, `italic ${marime}px Georgia`, '#5a4520');
}

function deseneazaPrinLupa(lx, ly, r, acum) {
  const m = geomMiniatura();
  const prag = m.ramaW * 0.16;
  const peMin = Math.hypot(lx - m.picturaX, ly - m.picturaY) < prag;
  const peEti = Math.hypot(lx - m.etichetaX, ly - m.etichetaY) < prag;

  ctx.save();
  ctx.beginPath(); ctx.arc(lx, ly, r, 0, Math.PI * 2); ctx.clip();
  if (peMin) deseneazaTaina(lx, ly, r, acum);
  else if (peEti) deseneazaEtichetaRamei(lx, ly, r);
  else {
    // peretele văzut de aproape: firele pânzei de sub vopsea
    ctx.fillStyle = '#3f2a17';
    ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
    ctx.strokeStyle = 'rgba(255, 226, 170, 0.07)';
    ctx.lineWidth = Math.max(1, r * 0.02);
    for (let k = -7; k <= 7; k++) {
      ctx.beginPath();
      ctx.moveTo(lx - r, ly + k * r * 0.15); ctx.lineTo(lx + r, ly + k * r * 0.15); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lx + k * r * 0.15, ly - r); ctx.lineTo(lx + k * r * 0.15, ly + r); ctx.stroke();
    }
  }
  ctx.restore();

  luciulSticlei(lx, ly, r);
  deseneazaLupa(lx, ly, r, s4.lupaLuata);

  /* Cât stai pe locul bun, un inel se umple în jurul lupei. Fără el, ținutul pe
     loc e o secundă în care nu se întâmplă nimic vizibil, și mâna pleacă tocmai
     când era pe punctul să reușească. */
  const rabdare = Math.max(s4.peMiniatura, s4.peEticheta);
  if (s4.lupaLuata && rabdare > 40) {
    const p = Math.min(1, rabdare / PRAG_TAINA);
    ctx.save();
    ctx.strokeStyle = `rgba(255, 246, 214, ${0.35 + 0.5 * p})`;
    ctx.lineWidth = Math.max(2, r * 0.09);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(lx, ly, r * 1.2, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // aura care cheamă la luat, cât lupa stă pe consolă
  if (!s4.lupaLuata && s4.chemareLupa > 0.02) {
    const bat = 0.55 + 0.45 * Math.sin(acum * 0.005);
    const halo = ctx.createRadialGradient(lx, ly, r * 0.7, lx, ly, r * 2.4);
    halo.addColorStop(0, `rgba(255, 246, 214, ${0.5 * s4.chemareLupa * bat})`);
    halo.addColorStop(1, 'rgba(255, 246, 214, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(lx, ly, r * 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(255, 250, 228, ${0.7 * s4.chemareLupa * bat})`;
    ctx.lineWidth = Math.max(1.5, r * 0.05);
    ctx.beginPath(); ctx.arc(lx, ly, r * 1.28, 0, Math.PI * 2); ctx.stroke();
  }
}

// O vorbă pusă sus, pe o plăcuță de lumină, ca să se citească pe întuneric.
function vorbaGaleriei(text) {
  const y = H * 0.09;
  ctx.font = 'bold 19px Georgia';
  const lat = ctx.measureText(text).width;
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = CREM_HARTIE;
  dreptunghi(W * 0.5 - lat / 2 - 18, y - 10, lat + 36, 38, 12);
  ctx.restore();
  textIncadrat(text, W * 0.5, y, W * 0.8, 24, 'bold 19px Georgia', '#2b2113');
}

function deseneazaScena4(t, acum) {
  actualizeazaGalerie(acum);
  pregatesteSala();
  const m = geomMiniatura();

  if (s4.faza === 'intrare') {
    /* Buzunarul se cască până umple ecranul: intri prin el, nu se schimbă
       decorul peste tine. */
    const p = atenuare(Math.min(1, (acum - s4.t0) / 1300));
    ctx.fillStyle = '#070503'; ctx.fillRect(0, 0, W, H);
    const b = geomBuzunar(geomMuzeu(), s4.buzunar);
    const bx = intre(b.x, -W * 0.12, p), by = intre(b.y, -H * 0.12, p);
    const bw = intre(b.w, W * 1.24, p), bh = intre(b.h, H * 1.24, p);
    ctx.save();
    traseuOgiva(bx, by, bw, bh);
    ctx.clip();
    ctx.drawImage(salaGalerie.panza, 0, 0);
    ctx.restore();
    ctx.strokeStyle = ALAMA; ctx.lineWidth = Math.max(2, 12 * (1 - p));
    traseuOgiva(bx, by, bw, bh); ctx.stroke();
    return;
  }

  ctx.drawImage(salaGalerie.panza, 0, 0);

  if (s4.faza === 'portal') {
    /* Rama crește geometric până înghite ecranul, iar prin ea vine lumina. */
    const p = atenuare(s4.portal);
    const scara = 1 + p * (Math.max(W, H) / m.ramaW) * 1.6;
    const st = pregatesteRama(m);
    ctx.drawImage(st.panza, m.ramaX - st.latime * scara / 2, m.ramaY - st.inaltime * scara / 2,
                  st.latime * scara, st.inaltime * scara);
    // fără nicio vorbă: se vede singur că rama a crescut și că treci prin ea
    ctx.fillStyle = `rgba(255, 246, 224, ${Math.max(0, p - 0.55) / 0.45})`;
    ctx.fillRect(0, 0, W, H);
    return;
  }

  // dacă rătăcești cu lupa, miniatura se aprinde ea, ca să te cheme la sine
  if (s4.chemareTablou > 0.02) {
    const bat = 0.55 + 0.45 * Math.sin(acum * 0.004);
    const halo = ctx.createRadialGradient(m.picturaX, m.picturaY, m.picturaW * 0.4,
                                          m.picturaX, m.picturaY, m.ramaW * 0.3);
    halo.addColorStop(0, `rgba(255, 244, 200, ${0.7 * s4.chemareTablou * bat})`);
    halo.addColorStop(1, 'rgba(255, 244, 200, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(m.picturaX, m.picturaY, m.ramaW * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  deseneazaPrinLupa(s4.lupaX, s4.lupaY, s4.lupaR, acum);

  if (s4.faza === 'sala') {
    /* Îndemnul spune întâi ce ai de făcut, iar dacă tot nu se întâmplă nimic,
       spune și unde s-o cauți. Un jucător blocat n-are nevoie de poezie. */
    if (s4.lupaLuata) {
      /* Cât ții lupa pe locul bun, îndemnul se schimbă pe loc. Altfel scria
         mai departe „caută", tocmai când găsiseși — și mișcarea ta și vorba de
         pe ecran vorbeau despre lucruri diferite. */
      if (s4.peMiniatura > 60) vorbaGaleriei('Așa. Ține-o pe loc.');
      else if (s4.chemareTablou > 0.4) vorbaGaleriei('Ține lupa peste tăblița mică din mijlocul ramei.');
      else vorbaGaleriei('Privește prin lupă până găsești secretul.');
    } else {
      vorbaGaleriei(s4.chemareLupa > 0.4
        ? 'Lupa e pe consola din dreapta tabloului. Atinge-o ca s-o iei.'
        : 'Aici trebuie să devii detectiv de artă. Ia lupa de pe consolă.');
    }
  } else if (s4.faza === 'descoperit') {
    if (s4.peEticheta > 60) vorbaGaleriei('Așa. Ține-o pe loc.');
    else vorbaGaleriei(acum - s4.t0 < 2600
      ? 'Ești tu. Înainte de prima atingere.'
      : 'Mai caută. Rama ascunde ceva.');
  } else if (s4.faza === 'eticheta') {
    vorbaGaleriei('Atinge rama.');
  }
}
