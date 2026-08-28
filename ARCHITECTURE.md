# ARCHITECTURE.md

Document de referință pentru structura tehnică a jucăriei.

> **Stare curentă:** cinci scene întregi și jucabile, 140 de teste care trec.
> Rulează fără server, cu dublu-clic pe `index.html`. Nu are build, nu are
> dependențe, nu are backend.

## Privire de ansamblu

O pagină de canvas 2D, fără biblioteci și fără niciun fișier luat de undeva —
nici imagini, nici sunete. Tot ce se vede iese din `CanvasRenderingContext2D`,
tot ce se aude iese din WebAudio, notă cu notă. `index.html` nu conține cod: e o
listă de paisprezece scripturi obișnuite, încărcate în ordine.

```mermaid
flowchart LR
  subgraph BROWSER["Browser (dublu-clic pe index.html, fără server)"]
    direction LR
    IDX["index.html<br/>listă de scripturi"]
    subgraph JS["js/*.js — paisprezece fișiere, în ordine"]
      direction TB
      TEMELIE["Temelia<br/>01 pânză · 02 cursor<br/>03 sunete · 04 stări"]
      SCENE["Scenele<br/>05 balon · 06 minge<br/>11 muzeu · 12 galerie · 13 câmpie"]
      DESEN["Desenul<br/>08 fundal · 09 mânuță<br/>10 scenele 1-2"]
      ATING["07 atingeri"]
      BUCLA["14 bucla"]
    end
    PANZA["&lt;canvas&gt;<br/>un singur element"]
    AUDIO["WebAudio<br/>oscilatoare + zgomot"]
  end

  IDX --> JS
  ATING -- "pointerdown" --> SCENE
  BUCLA -- "requestAnimationFrame" --> SCENE
  SCENE --> DESEN
  DESEN --> PANZA
  SCENE --> AUDIO
  TEMELIE --> SCENE
```

Nu există stat, nu există rutare, nu există date salvate. Tot ce știe jucăria
despre lume stă în câteva obiecte globale, iar la refresh se uită tot.

## Drumul jucătorului

O singură variabilă, `stare`, spune unde ești. Fiecare trecere e pornită de o
atingere, niciodată de un ceas — cu două excepții, marcate punctat: creșterea
punctului, care se termină singură, și întoarcerea din câmpie.

```mermaid
stateDiagram-v2
  direction LR
  [*] --> intuneric
  intuneric --> intuneric : atingere<br/>întoarce foaia (3 foi)
  intuneric --> crestere : balonul pocnește
  crestere --> balon : creșterea se termină
  balon --> transformare : atingi balonul
  transformare --> minge
  minge --> minge : sări, lași pete<br/>elefantul face curat
  minge --> muzeu : atingi elefantul
  muzeu --> galerie : atingi buzunarul GALERIE
  galerie --> campie : atingi rama
  campie --> muzeu : după cei zece pași
  galerie --> muzeu : ieși din galerie
```

## Cum se naște un cadru

`cadru(t)` e singura funcție chemată de `requestAnimationFrame`. Ea nu desenează
nimic: alege scena, o lasă să-și mute lucrurile cu `dt`, apoi o pune să se
deseneze.

```mermaid
flowchart TB
  RAF["requestAnimationFrame"] --> CADRU["cadru(t)"]
  CADRU --> CALIT["reglezaCalitatea(t)<br/>scade fineţea dacă<br/>ultimul cadru a durat prea mult"]
  CALIT --> MUZ["tineMuzicaMuzeului()<br/>programează nota următoare<br/>pe ceasul sunetului"]
  MUZ --> COMUTA{"stare"}
  COMUTA --> S1["scenele 1-2<br/>actualizează, apoi desenează"]
  COMUTA --> S3["scena 3"]
  COMUTA --> S4["scena 4"]
  COMUTA --> S5["scena 5"]
  S1 --> STAMP["ștampilele<br/>ce nu se schimbă<br/>se copiază, nu se repictează"]
  S3 --> STAMP
  S4 --> STAMP
  S5 --> STAMP
  STAMP --> PANZA["&lt;canvas&gt;"]
  PANZA --> RAF
```

### Ștampilele

Cel mai scump lucru din jucărie e umplerea pixelilor, nu numărul de forme. De-aia
tot ce nu se schimbă de la un cadru la altul se pictează **o dată**, pe o pânză
ascunsă, și pe urmă se copiază.

| Ștampila | Unde | Ce ține |
|---|---|---|
| `stampilePlante` | scena 2 | fiecare soi și culoare de plantă |
| `stampileNori` | scenele 2-3 | norii vopsiți |
| `fundal3` | scena 3 | peisajul cu grădina din jurul custodelui |
| `salaGalerie` | scena 4 | interiorul rococo, întreg |
| `stampilaRamei` | scena 4 | rama aurită a miniaturii |
| `ramaMare` | scena 5 | rama aurită a pânzei uriașe |
| `tabloul` | scena 5 | pictura impresionistă |
| `compunerea`, `marunt` | scena 5 | pânze de lucru pentru pixelare |

## Ce ține fiecare fișier

Ordinea contează: fiecare fișier se sprijină pe cele dinaintea lui. Dacă muți
unul mai sus, ceva de dedesubt rămâne fără pământ.

```mermaid
flowchart TB
  subgraph T["Temelia"]
    A1["01-panza.js · 75<br/>pânza, măsurile, uneltele de desen"]
    A2["02-cursor.js · 44<br/>cursorul și viteza degetului"]
    A3["03-sunete.js · 408<br/>toate sunetele + muzica"]
    A4["04-stari.js · 25<br/>variabila stare"]
  end
  subgraph S["Scenele"]
    B5["05-scena1-balon.js · 121"]
    B6["06-scena2-minge.js · 751<br/>mingea, petele, elefantul, grădina"]
    B11["11-scena3-muzeu.js · 1746<br/>custodele, haina, buzunarul, manualul"]
    B12["12-scena4-galerie.js · 1278<br/>sala rococo, rama, lupa"]
    B13["13-scena5-campie.js · 963<br/>pânza uriașă, țăranii, pantofii"]
  end
  subgraph D["Desenul și legăturile"]
    C7["07-atingeri.js · 150<br/>ce face fiecare atingere"]
    C8["08-desen-fundal.js · 105<br/>fundalurile, foile deschiderii"]
    C9["09-manuta-balon.js · 312<br/>mănușa-balon și cioburile"]
    C10["10-desen-scene-1-2.js · 578"]
    C14["14-bucla.js · 126<br/>un cadru, la nesfârșit"]
  end
  T --> S
  T --> D
  S --> D
```

## Testele

`teste.html` nu copiază codul jucăriei. Citește `index.html`, ia de acolo lista
fișierelor **în ordinea în care le încarcă pagina**, le adună și le rulează cu o
pânză falsă care ține minte fiecare desen. Așa lista are un singur stăpân: un
fișier nou e luat de la sine, și nu se poate întâmpla ca pagina să ruleze un cod
și testele altul.

```mermaid
flowchart LR
  T["teste.html"] -- "fetch" --> IDX["index.html"]
  IDX -- "lista &lt;script src&gt;" --> T
  T -- "fetch fiecare" --> JS["js/*.js"]
  JS --> FAB["new Function(...)<br/>o jucărie izolată per test"]
  FAB --> FALS["pânză falsă<br/>ține minte forme, culori,<br/>gradiente, text, imagini"]
  FAB --> CEAS["ceas fals<br/>timpul se împinge înainte"]
  FALS --> INTREB["întrebări:<br/>câte forme? ce scrie?<br/>ce culoare? câte operații?"]
```

Se lucrează cu testul scris întâi. Când un test vechi se ceartă cu o cerere nouă,
testul se rescrie ca să apere intenția care a rămas valabilă — niciodată slăbit
în tăcere.

## Fazele

Primele nouă au adus scenele. De la zece în sus n-a mai apărut nicio scenă nouă:
s-a dres ce nu mergea.

```mermaid
flowchart LR
  subgraph CONSTRUIT["Construit — fazele 0-9"]
    direction TB
    F0["0 · scheletul"] --> F1["1 · punctul și balonul"]
    F1 --> F2["2 · mingea și elefantul"]
    F2 --> F3["3 · plante și nori"]
    F3 --> F4["4 · muzeul e elefantul"]
    F4 --> F5["5 · manual, diplomă, cercel"]
    F5 --> F6["6 · galeria cu lupa"]
    F6 --> F7["7 · rama aurită"]
    F7 --> F8["8 · pânza și cei zece pași"]
    F8 --> F9["9 · deschiderea cu trei foi"]
  end
  subgraph DRES["Dres — fazele 10-18"]
    direction TB
    F10["10 · lagul"] --> F11["11 · mingea"]
    F11 --> F12["12 · mânuța-balon"]
    F12 --> F13["13 · nimeni blocat în galerie"]
    F13 --> F14["14 · norii se fac la atingere"]
    F14 --> F15["15 · ramă, pantofi, port"]
    F15 --> F16["16 · țăranii calcă"]
    F16 --> F17["17 · Mozart, liniște, nouă îndreptări"]
    F17 --> F18["18 · un buzunar, fișe de sală, pocnetul"]
  end
  CONSTRUIT ==> DRES
```

Fiecare fază are, în [PLAN.md](PLAN.md), ce s-a stricat și de ce — partea cea mai
folositoare din tot ce e scris aici.

## Ce trebuie făcut în continuare

```mermaid
flowchart TB
  subgraph ACUM["De pus mâna acum"]
    direction TB
    N1["Pridvorul casei<br/>e văzut din față, plat<br/>scena 5, casa cu pridvor"]
    N2["La zece pași rămâne<br/>prea mult perete gol<br/>poate nu trebuie atât de mic"]
    N3["Fișa din galerie:<br/>lupa trece peste colțul ei<br/>de mutat în stânga?"]
  end
  subgraph APOI["De cântărit"]
    direction TB
    M1["Unde s-a tăiat codul<br/>în cele 14 fișiere:<br/>merge, dar n-a cântărit nimeni"]
    M2["Sunetul, ascultat de om:<br/>testele spun că e acolo,<br/>nu și cum sună"]
    M3["Pe telefon, cu degetul<br/>— nu s-a încercat niciodată"]
  end
  subgraph NICIODATA["Rămâne pe dinafară — deliberat"]
    direction TB
    X1["Scor, niveluri, victorie"]
    X2["Meniuri, setări, salvare"]
    X3["Taste"]
    X4["Text de prisos:<br/>ce se poate arăta nu se scrie"]
  end
  ACUM ==> APOI
```

## Reguli care nu se calcă

1. **Niciun fișier extern.** Tot desenul și tot sunetul se nasc în cod.
2. **Se deschide de pe disc**, cu dublu-clic. De-aia `js/` sunt scripturi
   obișnuite, nu module: modulele nu se încarcă de pe `file://`.
3. **Tot ce ține de timp trece prin `dt`.** Nimic nu depinde de câte cadre pe
   secundă merge ecranul.
4. **Ce se pictează o dată se ștampilează.** Un desen care nu se schimbă de la un
   cadru la altul n-are ce căuta în buclă.
5. **Nimeni nu rămâne blocat.** Orice loc unde trebuie făcut ceva anume are un
   semn care cheamă, și semnul se întărește cu cât treci mai mult fără să
   reușești.
6. **Cod și comentarii în română.** Numele lucrurilor din poveste sunt numele lor
   din cod.
7. **Comentariile spun de ce, nu ce.** Ce face o linie se vede din ea; comentariul
   spune ce s-a stricat când era altfel.
