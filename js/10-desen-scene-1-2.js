function deseneazaInvitatia(t) {
  const cat = (parte, min, max) => Math.round(Math.min(Math.max(W * parte, min), max));

  // pagina întâi: titlul singur
  const tp = ceasulInvitatiei(t);
  const a1 = alfaPagina(tp, PAGINI_INVITATIE[0]);
  if (a1 > 0) {
    const marime = cat(0.062, 26, 62);
    titluDeTipar('VIAȚA DINTR-O ATINGERE', W / 2, H * 0.47, marime, marime * 0.22, a1);
  }

  // pagina a doua: ce fel de lucru ai în față
  const a2 = alfaPagina(tp, PAGINI_INVITATIE[1]);
  if (a2 > 0) {
    const marime = cat(0.032, 16, 30);
    textIncadrat('O jucărie digitală nu are scop și nu are sfârșit.',
      W / 2, H * 0.42, W * 0.74, marime * 1.6,
      `${marime}px Georgia`, `rgba(238, 230, 214, ${a2})`);
    textIncadrat('Experimentează ce se naște dintr-un punct.',
      W / 2, H * 0.42 + marime * 2.1, W * 0.74, marime * 1.6,
      `italic ${marime}px Georgia`, `rgba(206, 198, 184, ${a2 * 0.9})`);
  }

  // pagina a treia: mânuța care dă din degete, și îndemnul deasupra ei
  const a3 = alfaPagina(tp, PAGINI_INVITATIE[2]);
  if (a3 > 0) {
    const marime = cat(0.03, 15, 26);
    ctx.save();
    ctx.globalAlpha = a3;
    /* Mânuța se așază sub ultimul rând scris, nu la o înălțime fixă: pe ecran
       îngust îndemnul trece pe două rânduri și i-ar cădea peste degete. */
    const jos = textIncadrat('Atinge ecranul oriunde, ca să înceapă — apoi atinge tot ce mișcă.',
      W / 2, H * 0.28, W * 0.72, marime * 1.5,
      `${marime}px Georgia`, 'rgba(255, 244, 222, 0.92)');
    /* Mâna se întinde de la un vârf de deget la o mărime deasupra palmei până
       la poalele manșetei, la o mărime și jumătate dedesubt. Așezată prea sus,
       intră cu degetele peste rândul scris — de-aia locul ei se socotește din
       spațiul rămas sub text, nu din înălțimea ecranului. */
    const spatiu = Math.max(H * 0.2, H - jos);
    const mana = Math.min(Math.min(W, H) * 0.17, spatiu / 3.0);
    const mx = W / 2, my = jos + mana * 1.35;
    const pocnit = catAPocnit(performance.now());
    if (pocnit <= 0) {
      manutaAlba(mx, my, mana, t);
    } else if (pocnit < 1) {
      // foița se umflă o clipă și se stinge, iar cioburile pleacă în lături
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - pocnit * 2.8);
      const umflat = 1 + pocnit * 0.55;
      ctx.translate(mx, my); ctx.scale(umflat, umflat); ctx.translate(-mx, -my);
      manutaAlba(mx, my, mana, t);
      ctx.restore();
      cioburileBalonului(mx, my, mana, pocnit);
    }
    ctx.restore();
  }
}

// Un dreptunghi cu colțuri rotunjite (dacă browserul știe să le rotunjească)
function dreptunghi(x, y, latime, inaltime, rotunjire) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, latime, inaltime, rotunjire);
  else ctx.rect(x, y, latime, inaltime);
  ctx.fill();
}

// Norii cubiști care plutesc încet pe cerul alb
const nori = [];

// Fundalul Scenei 2: cerul alb sus, pământul negru jos — dar cu viață în ele:
// cerul respiră printr-un gradient fin, norii plutesc, orizontul are o geană
// de lumină. „progres" face trecerea lină de la griul Scenei 1 (0) la peisaj (1).
function deseneazaFundalImpartit(progres) {
  const oriz = orizont();
  const marime = Math.min(W, H);

  // cerul: alb luminos sus, ușor umbrit spre orizont (senzație de aer, adâncime)
  const c1 = Math.round(intre(122, 251, progres));
  const c2 = Math.round(intre(122, 233, progres));
  const cer = ctx.createLinearGradient(0, 0, 0, oriz);
  cer.addColorStop(0, `rgb(${c1}, ${c1}, ${c1})`);
  cer.addColorStop(1, `rgb(${c2}, ${c2}, ${c2})`);
  ctx.fillStyle = cer;
  ctx.fillRect(0, 0, W, oriz);

  // norii: pătrățoși ca elefantul, plutesc alene și reintră pe partea cealaltă
  if (nori.length === 0) {
    for (let i = 0; i < 3; i++) {
      nori.push({
        x: Math.random() * W,
        y: oriz * (0.12 + Math.random() * 0.4),
        latime: marime * (0.12 + Math.random() * 0.14),
        viteza: 0.06 + Math.random() * 0.08
      });
    }
  }
  for (const nor of nori) {
    nor.x += nor.viteza;
    if (nor.x - nor.latime * 1.6 > W) nor.x = -nor.latime * 1.6;
    const g = marime * 0.02;
    const forma = () => {
      dreptunghi(nor.x, nor.y, nor.latime, g * 1.1, g * 0.55);
      dreptunghi(nor.x + nor.latime * 0.18, nor.y - g * 0.75, nor.latime * 0.55, g, g * 0.5);
      dreptunghi(nor.x + nor.latime * 0.42, nor.y + g * 0.55, nor.latime * 0.5, g * 0.9, g * 0.45);
    };
    ctx.fillStyle = `rgba(206, 210, 217, ${0.75 * progres})`;
    forma();
    if (nor.tenta) {                 // ce a rămas în nor din culorile aspirate
      ctx.save();
      ctx.globalAlpha = nor.tenta * progres;
      ctx.fillStyle = nor.culoare;
      forma();
      ctx.restore();
    }
  }

  // pământul: negru catifelat, cu o geană de lumină la orizont
  const g1 = Math.round(intre(122, 52, progres));
  const g2 = Math.round(intre(122, 10, progres));
  const pamant = ctx.createLinearGradient(0, oriz, 0, H);
  pamant.addColorStop(0, `rgb(${g1}, ${g1}, ${g1})`);
  pamant.addColorStop(1, `rgb(${g2}, ${g2}, ${g2})`);
  ctx.fillStyle = pamant;
  ctx.fillRect(0, oriz, W, H - oriz);
}

// Linia lăsată de balon — devine tot mai vizibilă spre capătul dinspre balon
function deseneazaUrma(transparenta = 1) {
  if (urma.length < 2) return;
  for (let i = 1; i < urma.length; i++) {
    const alfa = (i / urma.length) * 0.5 * transparenta;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alfa})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(urma[i - 1].x, urma[i - 1].y);
    ctx.lineTo(urma[i].x, urma[i].y);
    ctx.stroke();
  }
}

// Punctul alb care crește din întuneric (faza de „geneză")
function deseneazaPunctulCareCreste(progres, t) {
  const raza = Math.max(1, balon.razaBaza * progres);

  const aura = ctx.createRadialGradient(balon.x, balon.y, 0, balon.x, balon.y, raza * 4);
  const putereAura = 0.5 * (1 - progres * 0.7);
  aura.addColorStop(0, `rgba(255, 250, 240, ${putereAura})`);
  aura.addColorStop(1, 'rgba(255, 250, 240, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, W, H);

  ctx.beginPath();
  ctx.arc(balon.x, balon.y, raza, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${1 - progres * 0.9})`;
  ctx.fill();

  if (progres > 0.55) {
    deseneazaBalonul(t, raza, (progres - 0.55) / 0.45);
  }
}

// Conturul balonului, desenat din punctele membranei elastice: fiecare punct
// are un mic „offset" dat de fizica de gelatină, iar între ele tragem o curbă
// lină, ca pelicula să se unduie moale, nu în colțuri
function traseuBalon(raza) {
  ctx.beginPath();
  const n = membrana.length;
  if (n === 0) { ctx.arc(0, 0, raza, 0, Math.PI * 2); ctx.closePath(); return; }

  const pct = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = raza + membrana[i].o;   // raza de bază + unduirea din acel punct
    pct.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  // curbă netedă care trece prin mijloacele segmentelor (fără vârfuri ascuțite)
  const mij = (i, j) => [(pct[i][0] + pct[j][0]) / 2, (pct[i][1] + pct[j][1]) / 2];
  let m = mij(n - 1, 0);
  ctx.moveTo(m[0], m[1]);
  for (let i = 0; i < n; i++) {
    const urm = mij(i, (i + 1) % n);
    ctx.quadraticCurveTo(pct[i][0], pct[i][1], urm[0], urm[1]);
  }
  ctx.closePath();
}

// Balonul de săpun: corp transparent, contur irizat (curcubeu), două reflexii
function deseneazaBalonul(t, razaFortata = null, transparenta = 1) {
  /* Cu cât e mai obosit, cu atât respiră mai rar și mai adânc — ca orice ființă
     care a fugit destul. E singurul semn pe care îl are jucătorul că răbdarea
     lui lucrează: altfel atinge, balonul fuge, și nimic nu se schimbă. */
  const obosit = razaFortata !== null ? 0 : catDeObositEBalonul();
  const respiratie = 1 + (0.045 + obosit * 0.05) *
                     Math.sin(t * (0.0011 - obosit * 0.0005) + balon.faza);
  const raza = razaFortata !== null ? razaFortata : balon.razaBaza * respiratie;

  /* Și i se aprinde o aură caldă, tot mai limpede, cât ține cât e de aproape să
     se lase prins. Aceeași lumină care cheamă la buzunarul custodelui și la lupa
     de pe consolă: în toată jucăria, lucrul care se lasă atins strălucește. */
  if (obosit > 0.02) {
    const bat = 0.6 + 0.4 * Math.sin(t * 0.004);
    const aura = ctx.createRadialGradient(balon.x, balon.y, raza * 0.75,
                                          balon.x, balon.y, raza * 1.85);
    aura.addColorStop(0, `rgba(255, 246, 214, ${0.4 * obosit * bat * transparenta})`);
    aura.addColorStop(1, 'rgba(255, 246, 214, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(balon.x, balon.y, raza * 1.85, 0, Math.PI * 2);
    ctx.fill();
  }

  const vitezaLui = Math.hypot(balon.vx, balon.vy);
  const turtire = Math.min(vitezaLui * 0.012, 0.16);
  const unghiulMersului = Math.atan2(balon.vy, balon.vx);

  ctx.save();
  ctx.translate(balon.x, balon.y);
  ctx.rotate(unghiulMersului);
  ctx.scale(1 + turtire, 1 - turtire);
  ctx.rotate(-unghiulMersului);

  const prezent = performance.now() - cursor.ultimaMiscare < 4000;
  const caldura = prezent ? factorCalm() : 0.35;
  const aura = ctx.createRadialGradient(0, 0, raza * 0.6, 0, 0, raza * 2.4);
  aura.addColorStop(0, `rgba(255, 196, 128, ${0.12 * caldura * transparenta})`);
  aura.addColorStop(1, 'rgba(255, 196, 128, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, raza * 2.4, 0, Math.PI * 2);
  ctx.fill();

  const corp = ctx.createRadialGradient(-raza * 0.25, -raza * 0.25, raza * 0.1, 0, 0, raza);
  corp.addColorStop(0,    `rgba(255, 255, 255, ${0.10 * transparenta})`);
  corp.addColorStop(0.75, `rgba(255, 255, 255, ${0.03 * transparenta})`);
  corp.addColorStop(1,    `rgba(255, 255, 255, ${0.16 * transparenta})`);
  ctx.fillStyle = corp;
  traseuBalon(raza);
  ctx.fill();

  if (ctx.createConicGradient) {
    const curcubeu = ctx.createConicGradient(t * 0.0004, 0, 0);
    const a = 0.4 * transparenta;
    curcubeu.addColorStop(0.00, `rgba(255, 150, 180, ${a})`);
    curcubeu.addColorStop(0.20, `rgba(255, 220, 130, ${a})`);
    curcubeu.addColorStop(0.40, `rgba(150, 255, 190, ${a})`);
    curcubeu.addColorStop(0.60, `rgba(140, 200, 255, ${a})`);
    curcubeu.addColorStop(0.80, `rgba(210, 160, 255, ${a})`);
    curcubeu.addColorStop(1.00, `rgba(255, 150, 180, ${a})`);
    ctx.strokeStyle = curcubeu;
  } else {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * transparenta})`;
  }
  ctx.lineWidth = 2.2;
  traseuBalon(raza);
  ctx.stroke();

  ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * transparenta})`;
  ctx.lineWidth = 1;
  traseuBalon(raza);
  ctx.stroke();

  ctx.save();
  ctx.translate(-raza * 0.38, -raza * 0.42);
  ctx.rotate(-0.6);
  ctx.beginPath();
  ctx.ellipse(0, 0, raza * 0.28, raza * 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.45 * transparenta})`;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(raza * 0.4, raza * 0.45, raza * 0.07, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.25 * transparenta})`;
  ctx.fill();

  ctx.restore();
}

// Mingea de plajă: felii colorate care se rotesc, cu volum și strălucire
function deseneazaMingea(x, y, raza, rotatie, luminozitate, transparenta = 1, turtire = 0) {
  ctx.save();
  ctx.globalAlpha = transparenta;
  ctx.translate(x, y);
  if (turtire > 0.004) {
    // se lățește și se scurtează, ca o minge adevărată lovită: atâta trebuie ca
    // atingerea să se simtă instantanee
    ctx.translate(0, raza * turtire * 0.26);
    ctx.scale(1 + turtire * 0.28, 1 - turtire * 0.26);
  }

  // aureola de bucurie (după o atingere blândă)
  if (luminozitate > 0.03) {
    const aura = ctx.createRadialGradient(0, 0, raza * 0.5, 0, 0, raza * 2);
    aura.addColorStop(0, `rgba(255, 255, 180, ${0.35 * luminozitate})`);
    aura.addColorStop(1, 'rgba(255, 255, 180, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, raza * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // feliile colorate (roșu, albastru, galben, despărțite de alb)
  ctx.rotate(rotatie);
  const culori = ['#e53935', '#fafafa', '#1e88e5', '#fafafa', '#fdd835', '#fafafa'];
  for (let k = 0; k < 6; k++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, raza, k * Math.PI / 3, (k + 1) * Math.PI / 3);
    ctx.closePath();
    ctx.fillStyle = culori[k];
    ctx.fill();
  }
  // căpăcelul alb din mijloc
  ctx.beginPath();
  ctx.arc(0, 0, raza * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = '#fafafa';
  ctx.fill();
  ctx.rotate(-rotatie);

  // umbre și lumini, ca mingea să pară rotundă, nu plată
  const volum = ctx.createRadialGradient(-raza * 0.35, -raza * 0.35, raza * 0.1, 0, 0, raza);
  volum.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  volum.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
  volum.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
  ctx.fillStyle = volum;
  ctx.beginPath();
  ctx.arc(0, 0, raza, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, raza, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Elefantul-cub roșu: pătrățos, dar simpatic ca în desenele animate —
// ochi mari cu sclipire, obraz roz, zâmbet, ureche fluturândă, unghiuțe
function deseneazaElefantul(t, transparenta = 1) {
  const u = unitateElefant(elefant.scara);
  const y0 = picioareElefant();
  const leganare = Math.sin(elefant.fazaMers) * 2 * u;

  // Albastru — forma rotundă (sferă) cere albastru (cubul cerea roșu)
  const fata = '#3f7cc0', sus = '#6fa3da', lateral = '#33639f', inchis = '#264d80', unghii = '#e9eff8';

  // Mișcare de desen animat (squash & stretch): când merge, elefantul face
  // mici sălturi vesele; se întinde pe verticală când urcă și se turtește
  // când atinge pământul. Când stă pe loc, doar respiră blând.
  const merge = (elefant.stare === 'plimbare' || elefant.stare === 'vine' || elefant.stare === 'retrage') ? 1 : 0;
  const inaltime = Math.abs(Math.sin(elefant.fazaMers));      // 0 = pe sol, 1 = sus
  const salt = inaltime * 2.5 * u * merge;                     // salt mic — elefant greoi, masiv
  const intindere = (inaltime - 0.5) * 0.05 * merge;          // squash discret (nu felin)
  const respir = merge ? 0 : Math.sin(t * 0.002) * 0.02;      // respirația în repaus
  const scaleY = 1 + intindere + respir;
  const scaleX = 1 - intindere * 0.7 - respir * 0.5;          // păstrează aprox. volumul

  // memorăm deplasarea verticală și scalările, ca trompa (desenată separat)
  // să rămână lipită de cap când elefantul se leagănă la mers
  elefant._offY = leganare * 0.3 - salt;
  elefant._sx = scaleX; elefant._sy = scaleY;

  // umbra: se micșorează și pălește când elefantul e în vârful săltului
  ctx.save();
  ctx.globalAlpha = (0.35 - inaltime * 0.14 * merge) * transparenta;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(elefant.x, y0, (74 - inaltime * 16 * merge) * u, 9 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = transparenta;
  ctx.translate(elefant.x, y0 + leganare * 0.3 - salt);
  ctx.scale(elefant.directie * scaleX, scaleY);   // direcție + squash/stretch

  // ——— PICIOARELE: patru coloane groase (elefant masiv), cu unghiuțe ———
  const pasFata = Math.sin(elefant.fazaMers) * 2.5 * u;
  const pasSpate = -pasFata;
  function picior(px, culoare) {
    ctx.fillStyle = culoare;
    dreptunghi(px, -46 * u, 27 * u, 46 * u, 10 * u);
    ctx.fillStyle = unghii;
    for (let k = 0; k < 3; k++) dreptunghi(px + 4 * u + k * 6.2 * u, -8 * u, 5 * u, 7 * u, 1.5 * u);
  }
  picior(-58 * u + pasSpate, lateral);
  picior(24 * u + pasFata, lateral);
  picior(-34 * u - pasSpate, fata);
  picior(50 * u - pasFata, fata);

  // ——— CORPUL: masă mare, grea și rotundă ———
  ctx.fillStyle = fata;
  ctx.beginPath(); ctx.ellipse(-8 * u, -82 * u, 78 * u, 50 * u, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = transparenta * 0.35;
  ctx.fillStyle = sus;
  ctx.beginPath(); ctx.ellipse(-24 * u, -114 * u, 54 * u, 18 * u, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = transparenta;

  // codița cu moț
  ctx.strokeStyle = lateral; ctx.lineWidth = 4 * u; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-82 * u, -84 * u);
  ctx.quadraticCurveTo(-100 * u, -72 * u, -94 * u, -50 * u + leganare);
  ctx.stroke();
  ctx.fillStyle = inchis;
  ctx.beginPath(); ctx.arc(-94 * u, -48 * u + leganare, 5 * u, 0, Math.PI * 2); ctx.fill();

  // ——— CAPUL: bombat sus, obrazul rotund ———
  ctx.fillStyle = fata;
  ctx.beginPath(); ctx.ellipse(86 * u, -100 * u, 35 * u, 40 * u, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = transparenta * 0.35;
  ctx.fillStyle = sus;
  ctx.beginPath(); ctx.ellipse(80 * u, -122 * u, 16 * u, 11 * u, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = transparenta;

  // ——— OCHIUL cald ———
  const clipeste = performance.now() - elefant.ultimulClipit < 150;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(98 * u, -106 * u, 8 * u, clipeste ? 1.3 * u : 9 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!clipeste) {
    ctx.fillStyle = '#233246';
    ctx.beginPath(); ctx.arc(100 * u, -105 * u, 4.5 * u, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(101.5 * u, -107 * u, 1.8 * u, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = inchis; ctx.lineWidth = 2.2 * u; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(98 * u, -106 * u, 10 * u, 1.15 * Math.PI, 1.95 * Math.PI); ctx.stroke();

  // obrazul roz
  ctx.fillStyle = 'rgba(255, 150, 150, 0.45)';
  ctx.beginPath(); ctx.arc(107 * u, -86 * u, 6.5 * u, 0, Math.PI * 2); ctx.fill();

  // ——— VESTA de maestru de ceremonii (cu papion și buzunar) ———
  const vFata = '#b23a48', vUmbra = '#8f2c38', auriu = '#e8b64a';
  ctx.fillStyle = vFata;
  ctx.beginPath();
  ctx.moveTo(14 * u, -34 * u);
  ctx.lineTo(16 * u, -96 * u);
  ctx.quadraticCurveTo(20 * u, -110 * u, 44 * u, -110 * u);
  ctx.lineTo(62 * u, -108 * u);
  ctx.quadraticCurveTo(68 * u, -68 * u, 60 * u, -34 * u);
  ctx.quadraticCurveTo(38 * u, -28 * u, 14 * u, -34 * u);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = vUmbra; ctx.lineWidth = 2 * u; ctx.stroke();
  // reverul auriu în V la gât
  ctx.strokeStyle = auriu; ctx.lineWidth = 3 * u; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(56 * u, -110 * u); ctx.lineTo(40 * u, -80 * u); ctx.lineTo(54 * u, -44 * u);
  ctx.stroke();
  // nasturi auri
  ctx.fillStyle = auriu;
  for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(44 * u, (-90 + k * 17) * u, 2.6 * u, 0, Math.PI * 2); ctx.fill(); }
  // papion la gât
  ctx.fillStyle = auriu;
  ctx.beginPath(); ctx.moveTo(50 * u, -112 * u); ctx.lineTo(42 * u, -118 * u); ctx.lineTo(42 * u, -106 * u); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(50 * u, -112 * u); ctx.lineTo(58 * u, -118 * u); ctx.lineTo(58 * u, -106 * u); ctx.closePath(); ctx.fill();
  ctx.fillStyle = vUmbra; ctx.beginPath(); ctx.arc(50 * u, -112 * u, 2.6 * u, 0, Math.PI * 2); ctx.fill();
  // buzunarul vestei (aici ajunge mingea)
  ctx.fillStyle = vUmbra;
  dreptunghi(18 * u, -68 * u, 30 * u, 26 * u, 6 * u);
  ctx.strokeStyle = auriu; ctx.lineWidth = 2 * u;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(18 * u, -68 * u, 30 * u, 26 * u, 6 * u); else ctx.rect(18 * u, -68 * u, 30 * u, 26 * u);
  ctx.stroke();

  // ——— URECHEA MARE — desenată PESTE vestă și puțin mai sus ———
  ctx.save();
  ctx.translate(60 * u, -114 * u);
  ctx.rotate(0.07 * Math.sin(t * 0.003));
  ctx.fillStyle = lateral;
  ctx.beginPath(); ctx.ellipse(0, 0, 36 * u, 44 * u, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = inchis; ctx.lineWidth = 2 * u; ctx.stroke();
  ctx.fillStyle = sus;
  ctx.beginPath(); ctx.ellipse(5 * u, 3 * u, 22 * u, 29 * u, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // mingea din buzunarul vestei — se vede că iese puțin
  if (minge.inBuzunar) {
    deseneazaMingea(33 * u, -60 * u, 12 * u, t * 0.0005, 0, transparenta);
  }

  ctx.restore();

  // trompa se desenează în coordonatele lumii, ca să poată urmări petele
  deseneazaTrompa(t, transparenta);

  // (la prindere, mingea e apucată de trompă — vezi actualizeazaElefantul)
}

// Trompa: un lanț de cercuri tot mai mici, arcuit spre ținta lui —
// atârnă și se leagănă când elefantul se plimbă, dar se întinde și se
// mută de la o pată la alta în timpul aspirării
function deseneazaTrompa(t, transparenta = 1) {
  const g = geometriaTrompei(t);
  const u = g.u;
  // vârful netezit — mișcare firească, nu bruscă
  const varfX = elefant.varfNet ? elefant.varfNet.x : g.varfX;
  const varfY = elefant.varfNet ? elefant.varfNet.y : g.varfY;

  // arcuirea: controlul curbei e împins perpendicular pe direcția trompei
  const perpX = -(varfY - g.bazaY);
  const perpY = varfX - g.bazaX;
  const lungimePerp = Math.hypot(perpX, perpY) || 1;
  const indoire = 22 * u * elefant.directie;
  const cX = (g.bazaX + varfX) / 2 + (perpX / lungimePerp) * indoire;
  const cY = (g.bazaY + varfY) / 2 + (perpY / lungimePerp) * indoire;

  // punct și rază pe curba trompei (gros la bază, subțire la vârf)
  const pct = (p) => ({
    x: (1 - p) * (1 - p) * g.bazaX + 2 * (1 - p) * p * cX + p * p * varfX,
    y: (1 - p) * (1 - p) * g.bazaY + 2 * (1 - p) * p * cY + p * p * varfY,
    r: (14 - p * 10) * u
  });

  ctx.save();
  ctx.globalAlpha = transparenta;

  // corpul trompei — lanț de cercuri care se subțiază lin
  ctx.fillStyle = '#3f7cc0';
  for (let i = 0; i <= 10; i++) {
    const q = pct(i / 10);
    ctx.beginPath();
    ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // cutele (ridurile) trompei — arcuri curbate spre vârf
  ctx.strokeStyle = '#2f5b93';
  ctx.lineWidth = 1.5 * u;
  ctx.lineCap = 'round';
  for (let k = 1; k <= 4; k++) {
    const p = 0.2 + k * 0.16;
    const q = pct(p);
    const qn = pct(Math.min(p + 0.02, 1));
    const ang = Math.atan2(qn.y - q.y, qn.x - q.x);
    const px = Math.cos(ang + Math.PI / 2), py = Math.sin(ang + Math.PI / 2);
    const ax = Math.cos(ang), ay = Math.sin(ang);
    const r = q.r * 0.9;
    ctx.beginPath();
    ctx.moveTo(q.x + px * r, q.y + py * r);
    ctx.quadraticCurveTo(q.x + ax * r * 0.7, q.y + ay * r * 0.7, q.x - px * r, q.y - py * r);
    ctx.stroke();
  }

  // vârful rotunjit, cu două nări
  const varfR = pct(1).r;
  ctx.fillStyle = '#6fa3da';
  ctx.beginPath(); ctx.arc(varfX, varfY, varfR + 1.5 * u, 0, Math.PI * 2); ctx.fill();
  const dirV = Math.atan2(varfY - cY, varfX - cX) + Math.PI / 2;
  ctx.fillStyle = '#22406b';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(varfX + Math.cos(dirV) * 1.6 * u * s, varfY + Math.sin(dirV) * 1.6 * u * s, 1.3 * u, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Petele de vopsea: blob-uri neregulate, vesele
function deseneazaPetele() {
  for (const pata of pete) {
    const marime = pata.marime * (1 - pata.progres);
    if (marime <= 0.5) continue;
    ctx.fillStyle = pata.culoare;
    ctx.beginPath();
    ctx.arc(pata.x, pata.y, marime, 0, Math.PI * 2);
    ctx.fill();
    for (const strop of pata.stropi) {
      ctx.beginPath();
      ctx.arc(pata.x + strop.dx * (1 - pata.progres), pata.y + strop.dy * (1 - pata.progres),
              strop.r * (1 - pata.progres), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Cursorul luminos: cald și mic la mișcări lente, alb și mare la mișcări rapide
function deseneazaCursorul() {
  if (cursor.x < -100) return;
  const calm = factorCalm();
  const raza = 4 + cursor.viteza * 5;
  const lumina = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, raza * 3);
  const r = 255;
  const g = Math.round(200 + 55 * (1 - calm));
  const b = Math.round(140 + 115 * (1 - calm));
  lumina.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.85)`);
  lumina.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.25)`);
  lumina.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = lumina;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, raza * 3, 0, Math.PI * 2);
  ctx.fill();
}
