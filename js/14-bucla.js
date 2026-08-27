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
      minge.vy = minge.atinsaInCrestere ? saltulMingii(0.3) : 0;
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

  deseneazaCursorul();
  requestAnimationFrame(cadru);
}
requestAnimationFrame(cadru);
