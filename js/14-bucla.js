function cadru(t) {
  reglezaCalitatea(t);
  const acum = performance.now();

  /* Muzica muzeului se scrie cu un pas înainte, de la un cadru la altul. Notele
     se programează pe ceasul sunetului, nu pe cel al cadrelor: al doilea sare,
     primul nu — și o piesă cântată pe ceasul cadrelor șchioapătă. */
  tineMuzicaMuzeului();

  // cioburile s-au risipit: acum se naște punctul
  if (stare === 'intuneric' && pocnetulBalonului !== null && catAPocnit(acum) >= 1) {
    incepeJucaria(acum);
  }

  if (acum - timpulAnterior > 100) cursor.viteza *= 0.9;

  if (stare === 'intuneric') {
    deseneazaFundal(0);
    deseneazaInvitatia(t);
  }
  else if (stare === 'crestere') {
    const progres = Math.min((acum - inceputulCresterii) / DURATA_CRESTERII, 1);
    const p = atenuare(progres);
    deseneazaFundal(p);
    deseneazaPunctulCareCreste(p, t);
    if (progres >= 1) stare = 'balon';
  }
  else if (stare === 'balon') {
    actualizeazaBalonul(acum);
    deseneazaFundal(1);
    /* Cele două definiții, de-o parte și de alta, la mijlocul înălțimii: la stânga
       punctul, din care a pornit totul; la dreapta linia, pe care balonul o
       desenează chiar acum cu urma lui. Fără titluri — se înțelege din primul
       cuvânt despre ce e vorba, iar un titlu deasupra unei singure fraze e o
       etichetă lipită degeaba. Cu negru, ca să se poată citi. */
    const marimeDef = Math.max(ecran(11), Math.min(W, H) * 0.019);
    const latDef = Math.min(W * 0.26, ecran(340));
    definitiePeFundal(DEFINITIE_PUNCT, W * 0.175, H * 0.5, latDef,
                      marimeDef, '#1c1a16', null, 'mijloc');
    definitiePeFundal(DEFINITIE_LINIE, W * 0.825, H * 0.5, latDef,
                      marimeDef, '#1c1a16', null, 'mijloc');
    deseneazaUrma();
    deseneazaBalonul(t);
  }
  else if (stare === 'transformare') {
    /* marea metamorfoză: lumea se împarte în cer și pământ, balonul devine
       minge și cade pe sol, iar urma-linie se strânge și devine elefant */
    const progres = Math.min((acum - inceputulTransformarii) / DURATA_TRANSFORMARII, 1);
    const p = atenuare(progres);

    deseneazaFundalImpartit(p);

    // urma-linie „curge" spre locul unde se naște elefantul
    const py = picioareElefant();
    for (const punct of urma) {
      punct.x = intre(punct.x, elefant.x, p * 0.06);
      punct.y = intre(punct.y, py - 40 * unitateElefant(elefant.scara), p * 0.06);
    }
    deseneazaUrma(1 - p);

    // elefantul se ivește din linie, în depărtare
    elefant.fazaMers += 0.05;
    deseneazaElefantul(t, p);

    // balonul devine minge: se estompează unul, apare cealaltă,
    // iar mingea cade și ricoșează pe pământul cel nou
    minge.y = intre(H / 2, minge.sol, ricoseu(progres));
    minge.raza = intre(minge.razaStart, minge.razaTinta, p);
    minge.rotatie = p * 4;
    if (progres < 0.6) deseneazaBalonul(t, minge.raza, 1 - progres / 0.6);
    deseneazaMingea(minge.x, minge.y, minge.raza, minge.rotatie, 0, p);

    if (progres >= 1) {
      stare = 'minge';
      urma.length = 0;
      minge.raza = minge.razaTinta;
      // intrarea în scenă: mingea sare singură de câteva ori, ca să fie văzută.
      // Nu lasă însă pete acum: petele sunt răspunsul ei la atingere, iar dacă
      // și le-ar face singură, elefantul ar veni la curățenie înainte să apuci să te joci.
      /* Dacă ai atins-o cât creștea, sare de bucurie. Dacă nu, se așază și
         așteaptă — nu face nicio săritură de intrare. */
      minge.sareDeBucurie = minge.atinsaInCrestere;
      minge.sarituriRamase = minge.atinsaInCrestere ? 3 : 0;
      minge.vy = minge.atinsaInCrestere ? saltPanaLaTavan(0.3) : 0;
      minge.turtire = minge.atinsaInCrestere ? 1 : 0.35;
      minge.atinsaInCrestere = false;
      minge.luminozitate = 1;
      if (audio) sunetBoing();
      minge.ultimaProvocare = acum - 4000;   // fluieră repede, nu după șase secunde
    }
  }
  else if (stare === 'minge') {
    actualizeazaMingea(acum);
    actualizeazaElefantul(acum);
    actualizeazaBaloaneleDeCuloare();
    actualizeazaGradina();

    deseneazaFundalImpartit(1);
    /* Definiția petei de culoare, așezată în stânga jos, cu ultimul rând chiar pe
       linia orizontului — acolo unde cerul se sfârșește și începe pământul pe
       care cad petele. Fără titlu și cu negru, ca să se poată citi. */
    definitiePeFundal(DEFINITIE_PATA, W * 0.235, orizont() - H * 0.012,
                      Math.min(W * 0.34, ecran(420)),
                      Math.max(ecran(11), Math.min(W, H) * 0.019),
                      '#1c1a16', null, 'jos');
    deseneazaBaloaneleDeCuloare();   // în spatele elefantului: par să iasă din el
    deseneazaGradina(1, 0, 0.82);    // grădina din depărtare
    deseneazaPetele();

    // umbra mingii: mai mică și mai palidă cu cât mingea sare mai sus
    if (!minge.inBuzunar && minge.mod !== 'ascunsa') {
      const inaltime = Math.max(0, Math.min(1, (minge.sol - minge.y) / (H * 0.4)));
      ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * (1 - inaltime * 0.7)})`;
      ctx.beginPath();
      ctx.ellipse(minge.x, minge.sol + minge.raza * 0.95,
                  minge.raza * (1 - inaltime * 0.35), minge.raza * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // când mingea se ascunde, e desenată ÎNAINTEA elefantului (adică în spatele lui)
    const mingeInSpate = minge.mod === 'ascunsa';
    if (mingeInSpate && !minge.inBuzunar) {
      deseneazaMingea(minge.x, minge.y, minge.raza, minge.rotatie, minge.luminozitate, 1, minge.turtire);
    }
    deseneazaElefantul(t);
    if (!mingeInSpate && !minge.inBuzunar) {
      deseneazaMingea(minge.x, minge.y, minge.raza, minge.rotatie, minge.luminozitate, 1, minge.turtire);
    }
    deseneazaGradina(1, 0.82, 1.01);   // doar ce a crescut chiar la picioarele noastre

    /* Îndemnul către baloane. Se scrie **sub balonul care așteaptă**, cu o
       săgeată spre el, nu într-un colț al ecranului: un îndemn care spune
       „atinge-le" fără să arate care nu ajută pe nimeni. Vezi
       `indemnulBaloanelor` pentru de ce e nevoie de el. */
    const balonUitat = indemnulBaloanelor(acum);
    if (balonUitat) {
      const bat = 0.6 + 0.4 * Math.sin(acum * 0.005);
      const bx = balonUitat.x, by = balonUitat.y + balonUitat.raza * 1.5;
      ctx.save();
      ctx.strokeStyle = `rgba(40, 34, 26, ${0.35 + bat * 0.45})`;
      ctx.lineWidth = Math.max(1.5, Math.min(W, H) * 0.004);
      ctx.lineCap = 'round';
      const cap = by + Math.min(W, H) * 0.035;
      ctx.beginPath();
      ctx.moveTo(bx, cap);
      ctx.lineTo(bx, by + Math.min(W, H) * 0.008);
      ctx.moveTo(bx - Math.min(W, H) * 0.012, by + Math.min(W, H) * 0.026);
      ctx.lineTo(bx, by + Math.min(W, H) * 0.008);
      ctx.lineTo(bx + Math.min(W, H) * 0.012, by + Math.min(W, H) * 0.026);
      ctx.stroke();
      ctx.restore();
      /* Numai săgeata, fără niciun cuvânt. Scrisesem sub ea și ce are de făcut —
         dar o jucărie care îți spune „atinge-le" te tratează ca pe un om care
         n-a înțeles, iar toată scena de până aici s-a purtat cu tine altfel: n-a
         scris nicăieri nici să atingi punctul, nici să prinzi balonul.

         O săgeată care pulsează spune destul. Ea arată **unde**, iar ce se
         întâmplă rămâne al tău de descoperit — care e, la urma urmei, singurul
         lucru pe care jucăria asta îl are de dat. */
    }
  }
  else if (stare === 'muzeu') {
    deseneazaScena3(t, acum);
  }
  else if (stare === 'galerie') {
    deseneazaScena4(t, acum);
  }
  else if (stare === 'campie') {
    deseneazaScena5(t, acum);
  }
  else if (stare === 'foc') {
    actualizeazaFocul(acum);
    deseneazaScena6(t, acum);
  }
  else if (stare === 'gheata') {
    actualizeazaGheata(acum);
    deseneazaScena7(t, acum);
  }
  else if (stare === 'ulei') {
    actualizeazaUleiul(acum);
    deseneazaScena8(t, acum);
  }
  else if (stare === 'acuarela') {
    /* Stropitul se ține apăsat, ca pictatul din sala uleiului: un pulverizator
       apăsat o singură dată e o brichetă, nu o stropitoare. */
    pulverizeazaScena9();
    actualizeazaAcuarela(acum);
    deseneazaScena9(t, acum);
  }

  deseneazaCursorul();
  requestAnimationFrame(cadru);
}
requestAnimationFrame(cadru);
