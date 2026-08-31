# ARCHITECTURE.md

Document de referință pentru structura tehnică a jucăriei.

> **Stare curentă:** șase scene întregi și jucabile, 196 de teste care trec.
> Rulează fără server, cu dublu-clic pe `index.html`. Nu are build, nu are
> dependențe, nu are backend.

## Privire de ansamblu

O pagină de canvas 2D, fără biblioteci și fără niciun fișier luat de undeva —
nici imagini, nici sunete. Tot ce se vede iese din `CanvasRenderingContext2D`,
tot ce se aude iese din WebAudio, notă cu notă. `index.html` nu conține cod: e o
listă de cincisprezece scripturi obișnuite, încărcate în ordine.

```mermaid
flowchart LR
  subgraph BROWSER["Browser (dublu-clic pe index.html, fără server)"]
    direction LR
    IDX["index.html<br/>listă de scripturi"]
    subgraph JS["js/*.js — cincisprezece fișiere, în ordine"]
      direction TB
      TEMELIE["Temelia<br/>01 pânză · 02 cursor<br/>03 sunete · 04 stări"]
      SCENE["Scenele<br/>05 balon · 06 minge · 11 muzeu<br/>12 galerie · 13 câmpie · 15 foc"]
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
  campie --> foc : după cei zece pași,<br/>atingi ușa deschisă din tablou
  foc --> muzeu : intri prin arsură
  galerie --> muzeu : ieși din galerie
```

## Cum se naște un cadru

`cadru(t)` e singura funcție chemată de `requestAnimationFrame`. Ea nu desenează
nimic: alege scena, o lasă să-și mute lucrurile cu `dt`, apoi o pune să se
deseneze.

```mermaid
flowchart TB
  RAF["requestAnimationFrame"] --> CADRU["cadru(t)"]
  CADRU --> CALIT["reglezaCalitatea(t)<br/>scade fineţea dacă<br/>ultimul cadru a durat prea mult<br/>— și nu mai urcă la o treaptă<br/>care s-a înecat o dată"]
  CALIT --> MUZ["tineMuzicaMuzeului()<br/>programează nota următoare<br/>pe ceasul sunetului"]
  MUZ --> COMUTA{"stare"}
  COMUTA --> S1["scenele 1-2<br/>actualizează, apoi desenează"]
  COMUTA --> S3["scena 3"]
  COMUTA --> S4["scena 4"]
  COMUTA --> S5["scena 5"]
  COMUTA --> S6["scena 6"]
  S1 --> STAMP["ștampilele<br/>ce nu se schimbă<br/>se copiază, nu se repictează"]
  S3 --> STAMP
  S4 --> STAMP
  S5 --> STAMP
  S6 --> STAMP
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
| `salaFocului` | scena 6 | sala rotundă: tapetul, pasta de pe pereți, blana |
| `ramaFocului` | scena 6 | rama aurită a lucrării, culcată |
| `fundalTablou` | scena 6 | noaptea și dealurile din lucrare, puse în pastă |

Fiecare ștampilă ține minte la ce mărime a fost pictată și se repictează când
pânza se schimbă. De-aia contează atât de mult ca pânza **să nu se schimbe
degeaba** — vezi capitolul următor.

## Măsurile: pixeli de pânză și pixeli de ecran

Nu desenăm pe ecran, ci pe o pânză plafonată la `PANZA_MAX` pixeli, întinsă pe
urmă cu CSS peste toată fereastra. Pe deasupra, `reglezaCalitatea` mai micșorează
pânza când cadrele întârzie. Deci **`W` și `H` nu sunt lățimea și înălțimea
ferestrei**, iar raportul dintre ele și fereastră (`scalaPanzei`) se schimbă în
timpul jocului.

De aici ies două feluri de greșeli, amândouă văzute pe pielea noastră:

| Greșeala | Cum arată | Leacul |
|---|---|---|
| O mărime scrisă în pixeli rotunzi (`470`, `20px`) | Pe pânză micșorată, lucrul se **umflă**: manualul sărea de la o treime la jumătate de ecran | `ecran(470)`, `scrisGeorgia(20)` |
| O socoteală ținută minte în pixeli de pânză | La schimbarea pânzei, lucrul **rămâne unde era**: cercelul zbura în dreapta ecranului, cu lănțișorul întins peste toată grădina | un ascultător în `laRedimensionare` |

```mermaid
flowchart TB
  FER["fereastra<br/>window.innerWidth × innerHeight"] --> SCALA["scalaPanzei<br/>= plafonul PANZA_MAX × calitate"]
  SCALA --> WH["W, H<br/>pixelii pe care desenăm"]
  SCALA --> ECRAN["ecran(n) = n × scalaPanzei<br/>scrisGeorgia(px)"]
  WH --> DESEN["desenul"]
  ECRAN --> DESEN
  SCALA -. "s-a schimbat" .-> ANUNT["laRedimensionare[]<br/>fiecare scenă își mută lucrurile"]
  ANUNT --> STARI["cursor · balon · minge · elefant<br/>pete · nori · cercel · lupă"]
  STARI --> DESEN
```

**Regula:** dacă o mărime nu iese din `W`/`H`, trebuie să iasă din `ecran()`. Dacă
o coordonată e ținută minte de la un cadru la altul, scena ei datorează un
ascultător în `laRedimensionare` — sau, mai bine, o ține în fracțiuni de ecran,
cum face grădina, și atunci nu datorează nimic.

### Regulatorul de calitate

`reglezaCalitatea` ține media alunecătoare a timpului dintre cadre și coboară o
treaptă când jocul se poticnește. Trei lucruri care nu se văd din cod la prima
citire, dar fără de care regulatorul face chiar el lagul pe care ar trebui să-l
vindece:

1. **Cadrul schimbării nu se măsoară.** Coborârea unei trepte repictează din
   temelii toate ștampilele scenei — e cel mai scump cadru din jucărie. Pus la
   socoteală, el singur spune „ne înecăm" și cheamă încă o coborâre, care
   repictează iar tot.
2. **Plafonul se închide după o urcare care nu s-a ținut.** Altfel jucăria urcă,
   se îneacă, coboară, urcă iar — la nesfârșit, cu o repictare completă la
   fiecare tur. O poticnire care vine la peste `RASPUNDEREA_URCARII` de la urcare
   e a scenei care s-a deschis între timp, nu a treptei, și nu închide nimic.
3. **Redimensionările ferestrei se adună.** Cât tragi de colț sosesc zeci pe
   secundă, și fiecare ar repicta tot; așteptăm să se oprească mâna.

### Pasta

Scena a șasea e despre valoarea petei picturale, așa că nu poate fi zugrăvită
neted: tema scrisă pe perete și dezmințită de perete. Peretele sălii și fondul
lucrării de pe șevalet se pun amândouă din tușe, cu `pataDePasta`.

O pată de pastă are trei treceri, nu una: corpul, o creastă mai deschisă pe
muchia dinspre lumină și o umbră pe cealaltă. Cu una singură iese o confetti; cu
trei, ochiul citește relief — vopsea groasă, pusă cu pensula. Lumina din sală
vine de la focul din tablou, deci creasta stă mereu spre el.

Și una, și alta stau pe ștampile: peretele pe cea a sălii, fondul lucrării pe a
lui (`fundalTablou`). Numai flăcările se repictează la fiecare cadru — ele chiar
se mișcă.

## Ce ține fiecare fișier

Ordinea contează: fiecare fișier se sprijină pe cele dinaintea lui. Dacă muți
unul mai sus, ceva de dedesubt rămâne fără pământ.

```mermaid
flowchart TB
  subgraph T["Temelia"]
    A1["01-panza.js · 142<br/>pânza, măsurile, regulatorul de calitate"]
    A2["02-cursor.js · 53<br/>cursorul și viteza degetului"]
    A3["03-sunete.js · 519<br/>toate sunetele + muzica"]
    A4["04-stari.js · 25<br/>variabila stare"]
  end
  subgraph S["Scenele"]
    B5["05-scena1-balon.js · 172"]
    B6["06-scena2-minge.js · 888<br/>mingea, petele, elefantul, grădina"]
    B11["11-scena3-muzeu.js · 1734<br/>custodele, haina, buzunarul, manualul"]
    B12["12-scena4-galerie.js · 1426<br/>sala rococo, rama, lupa"]
    B13["13-scena5-campie.js · 1813<br/>pânza uriașă, țăranii, pantofii"]
    B15["15-scena6-foc.js · 1486<br/>sala rotundă, șevaletul, pasta, arsura"]
  end
  subgraph D["Desenul și legăturile"]
    C7["07-atingeri.js · 153<br/>ce face fiecare atingere"]
    C8["08-desen-fundal.js · 285<br/>fundalurile, foile deschiderii"]
    C9["09-manuta-balon.js · 317<br/>mănușa-balon și cioburile"]
    C10["10-desen-scene-1-2.js · 676"]
    C14["14-bucla.js · 148<br/>un cadru, la nesfârșit"]
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
  subgraph DRES["Dres — fazele 10-20"]
    direction TB
    F10["10 · lagul"] --> F11["11 · mingea"]
    F11 --> F12["12 · mânuța-balon"]
    F12 --> F13["13 · nimeni blocat în galerie"]
    F13 --> F14["14 · norii se fac la atingere"]
    F14 --> F15["15 · ramă, pantofi, port"]
    F15 --> F16["16 · țăranii calcă"]
    F16 --> F17["17 · Mozart, liniște, nouă îndreptări"]
    F17 --> F18["18 · un buzunar, fișe de sală, pocnetul"]
    F18 --> F19["19 · măsurile pânzei"]
    F19 --> F20["20 · sala focului, pusă în pastă"]
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
    N4["Fonturile scenelor 4-6:<br/>lățimile de încadrare<br/>încă sunt cifre rotunde"]
    N5["Fișa de sală, pe ecran<br/>înalt și îngust, se face<br/>o coloană de un cuvânt"]
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
8. **Nicio măsură în pixeli rotunzi.** Ce nu iese din `W`/`H` iese din `ecran()`.
   Ce e ținut minte de la un cadru la altul, sau se ține în fracțiuni de ecran,
   sau își pune un ascultător în `laRedimensionare`.
