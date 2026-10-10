# Hochbettplaner – Spezifikation (Entwurf v0.1)

Stand: 10.10.2026 · Status: **Entwurf zur Abstimmung** – offene Punkte stehen in [Kapitel 14](#14-offene-fragen).

Ein Planungswerkzeug im Desktop-Browser, mit dem Heimwerker ein Hochbett in ein konkretes Zimmer
einpassen: Raum vermessen, Fenster, Heizkörper und andere Hindernisse eintragen, Balken zeichnen
oder eine Vorlage einsetzen, und dann laufend sehen, ob das Fenster noch aufgeht, wie viel Platz
unter dem Bett bleibt, ob die Balken halten und was das Ganze kostet.

---

## 1. Ziele und Abgrenzung

### 1.1 Ziele (nach Priorität)

1. **Einpassen in den Raum** – das Wichtigste. Raummaße eingeben, Hindernisse eintragen, Bett
   hineinsetzen und an die konkrete Situation anpassen. Gute Usability am Desktop.
2. **Konstruieren** – Balken zeichnen, quer legen, verbinden; oder Vorlage einsetzen und
   verändern. Immer synchron in Draufsicht, Seitenansicht und 3D.
3. **Prüfen** – Freiraum unter und über dem Bett, Fensteröffnungswinkel, Türschwenkbereich,
   Kollisionen, Balkendurchbiegung, Sicherheitsregeln (Geländer, Leiter).
4. **Material** – Stückliste und Zuschnittliste aus Baumarkt-üblichen Materialien, Kostenschätzung.
5. **Preise** (spätere Ausbaustufe) – Preise per Agent recherchieren lassen.

### 1.2 Nicht-Ziele

- Kein Ersatz für eine Tragwerksplanung. Die Statik ist eine **Abschätzung** mit klarem Hinweis.
- Keine Smartphone-Bedienung (Tablet nur „schaut nicht kaputt aus“).
- Kein vollständiges Warenwirtschaftssystem eines Baumarkts, keine Bestellfunktion.
- Kein fotorealistisches Rendering; die 3D-Ansicht soll schön, nicht realistisch sein.
- Keine allgemeine Möbel-/Innenarchitektur-Software: Möbel unter dem Bett sind einfache Platzhalter.

### 1.3 Zielgruppe

Heimwerker mit Grundausstattung (Akkuschrauber, Stichsäge/Handkreissäge, ggf. Kappsäge,
Stechbeitel). Bauen für Kinder, Jugendliche oder sich selbst; Mietwohnung oder Eigentum.

---

## 2. Begriffe

| Begriff | Bedeutung |
|---|---|
| **Stab** | Jedes stabförmige Holzteil: Pfosten, Balken, Zarge, Leiste, Strebe, Sprosse. Intern einheitlich modelliert. |
| **Pfosten** | Senkrechter Stab, trägt Lasten zum Boden (ggf. bis zur Decke). |
| **Zarge / Rahmenholz** | Waagerechter Stab, der den Bettrahmen bildet (Längs-/Querzarge). |
| **Querträger** | Waagerechter Stab quer im Rahmen, trägt Liegefläche. |
| **Auflagerleiste** | Leiste an Wand oder Zarge, auf der etwas aufliegt (engl. *ledger*). |
| **Strebe / Kopfband** | Schräger Stab zur Aussteifung. |
| **Liegefläche** | Platte, Dielen, Lattenrost oder Rollrost, auf der die Matratze liegt. |
| **Verbindung** | Stelle, an der zwei oder mehr Stäbe zusammenkommen, mit einem Verbindungstyp. |
| **Befestigung** | Verbindung eines Stabs mit Wand, Boden oder Decke. |
| **Baugruppe** | Parametrisches Bündel von Stäben (z. B. „Leiter“, „Geländer“, „Liegerahmen“). |
| **Vorlage** | Fertiges Hochbett aus Baugruppen, das eingesetzt und angepasst wird. |
| **Hindernis** | Alles im Raum, das nicht zum Bett gehört: Fenster, Tür, Heizkörper, Fensterbank, Steckdose … |

---

## 3. Arbeitsablauf (User Journey)

Der Ablauf wird beim ersten Start als geführter Assistent angeboten, ist aber jederzeit frei
wechselbar (alle Schritte bleiben über die Seitenleiste erreichbar).

1. **Raum anlegen** – Länge, Breite, Höhe. Wände werden automatisch benannt (Wand A–D, im
   Uhrzeigersinn, Wand A = Wand mit der Tür oder frei wählbar).
2. **Raum ausstatten** – Fenster, Tür, Heizkörper, Fensterbänke, Sockelleisten, Steckdosen,
   Lichtschalter, Deckenlampe, Rauchmelder, Dachschräge (falls vorgesehen, s. Frage F2).
   Pro Wand/Boden/Decke: Material (wichtig für Befestigungen).
3. **Bett einsetzen** – Vorlage auswählen (Kapitel 6) oder leer beginnen. Vorlage wird in eine
   Raumecke/an eine Wand „angedockt“; Matratzengröße und Liegehöhe werden abgefragt.
4. **Anpassen** – Balken verschieben, verlängern, Querschnitt ändern, Verbindungen wählen,
   Geländer und Leiter platzieren, Möbel darunter stellen.
5. **Prüfen** – Prüfliste (wie ein Linter): Kollisionen, Fenster, Freiräume, Statik, Sicherheit.
   Jeder Befund ist anklickbar und markiert die Stelle in allen Ansichten.
6. **Material & Bauplan** – Stückliste, Zuschnittliste, Kosten, druckbarer Bauplan.

---

## 4. Raummodell

### 4.1 Geometrie

- Koordinatensystem: Ursprung in der Raumecke unten links (Draufsicht), x entlang Wand A,
  y entlang Wand D, z nach oben. Intern **Millimeter, ganzzahlig**; Anzeige wahlweise cm oder mm.
- **v1: Rechteckiger Raum** mit Länge, Breite, Höhe.
- Erweiterungen (je nach Antwort auf F2): beliebiges Polygon (L-Form, Erker, Vorsprünge,
  Kamin/Schacht), Dachschräge (Kniestockhöhe + Neigung oder zwei Höhenpunkte), unterschiedliche
  Deckenhöhe (Unterzug).
- Wanddicke nur für Darstellung und Fensterlaibung relevant.

### 4.2 Bauteile von Wand, Boden, Decke

Pro Fläche wählbar, weil davon abhängt, wie und ob befestigt werden kann:

| Fläche | Optionen | Folge für Befestigung |
|---|---|---|
| Wand | Beton, Kalksandstein, Vollziegel, Lochziegel (Hochlochziegel), Porenbeton (Ytong), Trockenbau (Gipskarton auf Metallständer), Holzständer/Fachwerk | Dübelwahl, max. Last je Anker; Trockenbau → nur in Ständer (Ständerraster einstellbar, Standard 625 mm) |
| Boden | Estrich mit Belag, **Fußbodenheizung** (Bohrverbot), Holzdielen auf Balken | Bodenbefestigung erlaubt/gesperrt |
| Decke | Betondecke, Holzbalkendecke (Balkenlage einstellbar), abgehängte Decke | Deckenverspannung/-verschraubung erlaubt/gesperrt |

Globaler Schalter **„Mietwohnung – möglichst wenig bohren“**: bevorzugt Verspannung und
Klemmlösungen, markiert jede Bohrung in der Stückliste und im Prüfbericht.

### 4.3 Hindernisse und Ausstattung

Alle Hindernisse sind Objekte mit Position an einer Wand (Abstand von der linken Wandecke,
Höhe über Boden) und eigenen Parametern. Jedes Hindernis hat einen **Freihaltebereich**, der in
Draufsicht/Seitenansicht/3D halbtransparent angezeigt und bei der Kollisionsprüfung berücksichtigt wird.

| Objekt | Parameter | Freihaltebereich / Prüfung |
|---|---|---|
| **Fenster** | Breite, Höhe, Brüstungshöhe, Laibungstiefe, Lage des Rahmens in der Laibung, Anzahl Flügel (1/2, mit/ohne Pfosten, Stulp), je Flügel: Öffnungsart (fest, Dreh, Kipp, Dreh-Kipp), Anschlag links/rechts, Flügelrahmenstärke (Std. 70 mm), Griffüberstand (Std. 70 mm), Griffhöhe | Schwenkbereich je Flügel (Kap. 9.2), Kipp-Volumen, Erreichbarkeit des Griffs |
| **Fensterbank innen** | Tiefe/Überstand vor Wand, Dicke, Höhe (Std. = Brüstung), seitlicher Überstand | Kollision |
| **Rollladenkasten** | Höhe, Überstand innen | Kollision |
| **Tür** | Breite, Höhe, Anschlag, Öffnung nach innen/außen, Zarge | Schwenkbereich, Durchgang |
| **Heizkörper** | Breite, Höhe, Tiefe, Abstand Boden, Abstand Wand, Thermostatkopf (Seite, Überstand), Anschlussrohre | Kollision, Konvektionsraum oberhalb (Std. ≥ 100 mm), Thermostat erreichbar, Hinweis Wärmestau unter Liegefläche |
| **Sockelleiste** | Höhe, Tiefe (Std. 15 mm) | Pfosten an der Wand rücken entsprechend ab bzw. werden ausgeklinkt |
| **Steckdose / Schalter** | Position, Größe | Abdeckung durch Bauteil → Warnung (Info) |
| **Deckenlampe, Rauchmelder** | Position, Durchmesser, Abhängung | Kollision, Kopffreiheit über Matratze |
| **Dachfenster** (bei Schräge) | wie Fenster, Klapp/Schwing | Schwenkbereich |
| **Freier Körper** | Quader/Zylinder mit Name | Kollision (für Kamine, Rohre, Einbauschränke …) |

### 4.4 Möbel und Personen (Platzhalter)

- Einfache Quader mit Vorlagen: Schreibtisch (Std. 160×80×75 cm), Bürostuhl, Sofa, Kleiderschrank,
  Regal, Spielteppich, Kommode. Nur für Platz- und Höhenprüfung.
- **Personen-Silhouetten**: stehend und sitzend, Körpergröße einstellbar (Std. 180 cm Erwachsene,
  beliebige Kinder-Größen). Sitzend am Schreibtisch, sitzend auf der Matratze, liegend.

---

## 5. Konstruktionsmodell

### 5.1 Stab (Member)

Jedes Holzteil ist ein gerader Stab mit:

- Achse: Start- und Endpunkt (3D), daraus Länge und Richtung
- Querschnitt b × h (mm) und Rollwinkel um die Achse (hochkant/flach/beliebig)
- Ausrichtung des Querschnitts relativ zur Achse (Bezugskante: Mitte, Oberkante, Außenkante …),
  damit „Oberkante auf 160 cm“ direkt eingegeben werden kann
- Material (aus Katalog, Kap. 10)
- Rolle (Pfosten, Zarge, Querträger, Leiste, Strebe, Sprosse, Geländerholm, Stufe …) – steuert
  Vorschläge, Statik und Stückliste
- Zugehörigkeit zu einer Baugruppe (optional)
- Bearbeitungen aus Verbindungen (Ausklinkung, Überblattung, Zapfen, Bohrungen), die die
  Geometrie und den Restquerschnitt verändern

### 5.2 Fläche (Panel)

Liegefläche, Ablage, Geländerfüllung, Stufe aus Platte: Umriss (Polygon), Dicke, Höhe, Material,
Art **Platte** (mit Plattenformat und Faserrichtung) oder **Dielen** (Dielenbreite, Fugenabstand,
Verlegerichtung). Aussparungen (z. B. Leiterzugang) möglich.

### 5.3 Verbindung (Joint)

Wird automatisch erkannt, wenn sich Stäbe berühren oder durchdringen. Typ des Stoßes
(Eckstoß, T-Stoß, Kreuzung, Auflage, Längsstoß, Strebenanschluss) wird geometrisch bestimmt; daraus
ergibt sich die Liste zulässiger Verbindungstypen (Kap. 7). Parameter je Typ (z. B. Anzahl Schrauben,
Winkelgröße, Blatttiefe).

### 5.4 Befestigung (Fixing)

Verbindung Stab ↔ Wand/Boden/Decke mit Typ (Kap. 7.4), Anzahl Anker, Lage. Prüfung gegen das
Material der Fläche und Sperren (Fußbodenheizung, Trockenbau ohne Ständer, Mietmodus).

### 5.5 Baugruppen

Parametrische Bündel, die sich bei Änderung eines Parameters neu aufbauen:

- **Liegerahmen**: Matratzenmaß, Spiel (Std. 10 mm je Seite), Oberkante Liegefläche, Zargen-
  und Querträger-Querschnitt, Querträgerabstand (max. aus Statik), Art der Liegefläche
- **Pfostensatz**: Anzahl, Querschnitt, bis Rahmen / bis Decke, Position relativ zum Rahmen
  (außen / innen / unter)
- **Geländer**: Kante(n), Höhe über Matratze, Typ (Kap. 8.1), Zugangsöffnung
- **Leiter/Treppe**: Typ (Kap. 8.2), Position, Neigung
- **Aussteifung**: Diagonale, Kopfband, Andreaskreuz, Rückwand-Platte, Wandanbindung

Eine Baugruppe kann **aufgelöst** werden – danach sind es freie Stäbe, die einzeln bearbeitet
werden (s. Frage F7).

---

## 6. Bauarten und Vorlagen

Jede Vorlage ist eine Kombination aus Baugruppen mit sinnvollen Standardwerten, die beim
Einsetzen an Raum und Matratze angepasst wird.

| # | Bauart | Beschreibung | Typisch für | Besonderheiten |
|---|---|---|---|---|
| V1 | **Freistehend, 4 Pfosten** | Klassisch: 4 Pfosten, umlaufender Rahmen, Liegefläche im Rahmen | Kinderzimmer, Umzug | Braucht Aussteifung (Kopfbänder oder Wandanbindung), sonst wackelt es |
| V2 | **Deckenhoch, 4 Pfosten** | Pfosten Boden–Decke, verspannt; Liegefläche seitlich an die Pfosten geschraubt | Altbau, hohe Räume | Sehr steif ohne Bohren; Aufrichtbarkeit prüfen (Kap. 9.6), Verspannung über Stellfüße/Gewindespindeln |
| V3 | **Wandseitig, 2 Pfosten** | Längsseite auf Auflagerleiste an der Wand, vorne 2 Pfosten | Schmale Zimmer | Wandmaterial entscheidend |
| V4 | **Eckhochbett, 1 Pfosten** | Zwei Seiten an zwei Wänden, 1 Pfosten an der freien Ecke | Platz unter dem Bett maximieren | Hohe Anforderung an Wandbefestigung |
| V5 | **Hochebene / Nische** | Spannt von Wand zu Wand, keine oder wenige Pfosten | Schmale Räume, Nischen ≤ ca. 2,5 m | Auflager in beiden Wänden, Durchbiegung kritisch |
| V6 | **Galerie / Raumbreite Ebene** | Ebene über ganze Raumbreite, Pfosten + Wandauflager | Altbau ab ca. 3,2 m Höhe | Größere Querschnitte, Zwischenpfosten |
| V7 | **Halbhochbett** | Liegefläche ca. 100–120 cm, z. B. für jüngere Kinder | Kleinkinder ab 4–6 J. | Andere Sicherheitsregeln (s. 8.3) |
| V8 | **Doppelstock / Etagenbett** | Zwei Liegeflächen übereinander | Geschwister | Zweite Liegefläche als zusätzliche Baugruppe |

Optional (je nach F12): **deckenabgehängt** (Gewindestangen/Stahlseile von Betondecke) – nur mit
deutlicher Warnung, da Lasten und Verankerung kritisch sind.

Alle Vorlagen erlauben: Andocken an Wand/Ecke, Spiegeln, Drehen um 90°, Matratzengröße
(90/100/120/140/160 × 190/200/220), Liegehöhe, Position von Leiter und Zugang.

---

## 7. Verbindungen und Befestigungen

Jeder Verbindungstyp hat im Katalog: Darstellung (2D-Symbol + 3D-Detail), zulässige Stoßarten,
**Schwierigkeit** (1–3), benötigtes Werkzeug, **demontierbar** ja/nein, Optik, Verbrauchsmaterial
für die Stückliste, Querschnittsschwächung (für Statik) und eine qualitative **Tragfähigkeitsklasse**
(gering/mittel/hoch) mit Erläuterung des Kraftflusses.

### 7.1 Stahlverbinder (Baumarkt, verzinkt)

| Typ | Einsatz | Hinweis |
|---|---|---|
| Winkelverbinder (mit/ohne Sicke, 40–105 mm) | Eckstoß, T-Stoß, Pfosten–Zarge | Einfachste Lösung; Sicke deutlich steifer |
| Schwerlastwinkel | Pfosten–Zarge bei hoher Last | |
| Balkenschuh (innen/außen) | Querträger an Zarge (T-Stoß, bündig) | Klassisch für Querträger, Querschnitt passend wählen |
| Flachverbinder / Lochplatte | Längsstoß, Knoten in einer Ebene | |
| Lochband | Diagonalaussteifung auf Zug | Günstig, unauffällig |
| T-Verbinder / Winkel als Kopfbandersatz | Pfosten–Zarge | |
| Stellfuß / Gewindespindel (Deckenspanner) | Deckenhohe Pfosten verspannen | Für V2 |

### 7.2 Schraub- und Bolzenverbindungen

| Typ | Einsatz | Demontierbar |
|---|---|---|
| Holzbauschrauben (Teilgewinde, Tellerkopf, 6–10 mm) | Fast alles, auch Auflage | bedingt |
| Vollgewindeschrauben | Querzug, Verstärkung von Ausklinkungen | bedingt |
| Schlossschrauben M8–M12 mit Mutter + U-Scheibe | Pfosten–Zarge (durchgebolzt) | ja |
| Gewindestange + Muttern | Durchgehende Verspannung, Rahmen | ja |
| Bettschraube mit Quermutter (Zylindermutter) | Möbelbau-Rahmenverbindung, unsichtbar | ja |
| Einschraubmuffe (Rampa) + Innensechskantschraube | Wiederholt zerlegbare Verbindungen | ja |
| Einhänge-Bettbeschlag | Zargen schnell lösbar an Pfosten | ja |
| Taschenloch (Pocket Hole) | Geländer, leichte Rahmen | bedingt |

### 7.3 Zimmermanns- und Tischlerverbindungen

| Typ | Einsatz | Schwierigkeit | Statik |
|---|---|---|---|
| **Stumpfe Auflage** (Balken liegt auf Balken, verschraubt) | Querträger auf Zarge, Rahmen auf Pfosten | 1 | Druck direkt, sehr gut |
| **Auflage auf Leiste** (Auflagerleiste) | Querträger/Liegefläche im Rahmen, Wandauflager | 1 | Leiste und Schrauben tragen auf Abscheren |
| **Ausklinkung / Einkerbung** (Kerve) | Balken auf Pfosten eingelassen | 2 | Querschnittsschwächung → Schubnachweis |
| **Überblattung** (Eckblatt, T-Blatt, Kreuzblatt) | Rahmenecken, Kreuzungen | 2 | Halber Querschnitt am Stoß |
| **Schwalbenschwanzblatt** | T-Stoß, zugfest | 3 | Zugfest ohne Metall, Querschnittsschwächung |
| **Schwalbenschwanz-Einhälsung / Gratverbindung** | Querträger in Zarge | 3 | |
| **Schlitz und Zapfen** (offen) | Rahmenecke Pfosten–Zarge | 2–3 | |
| **Zapfen und Zapfenloch** | Pfosten–Zarge, Geländer | 3 | Klassisch, sehr steif mit Holznagel |
| **Holzdübel (Buche)** | Geländer, Möbelteile | 2 | Gering bis mittel |
| **Kopfband** (Strebe 45°) | Aussteifung Pfosten–Zarge | 2 | Wichtig gegen Wackeln |

Für die handwerklichen Verbindungen zeigt die App (je nach F10) eine **Detailzeichnung mit Maßen**
(z. B. Blatttiefe, Schwalbenschwanz-Neigung 1:6 bis 1:8 für Nadelholz).

### 7.4 Befestigung an Wand, Boden, Decke

| Typ | Fläche | Hinweis |
|---|---|---|
| Rahmendübel / Universaldübel + Holzbauschraube | Wand (Beton, Ziegel, KS) | Standard für Auflagerleisten und Wandanbindung |
| Betonschraube | Beton, KS | Ohne Dübel |
| Porenbeton-Spezialdübel | Porenbeton | Geringere Last, mehr Anker |
| Schraube in Ständer | Trockenbau, Holzständer | Ständerraster muss bekannt sein; Hohlraumdübel **nicht** für tragende Lasten |
| Winkel am Boden | Boden | Gesperrt bei Fußbodenheizung |
| Deckenverspannung (Stellfuß, Spindel, Keil) | Decke | Keine Bohrung, braucht stabile Decke |
| Deckenwinkel / Schwerlastanker | Decke | |
| Wandabstandshalter / Distanzklotz | Wand | Bei Sockelleiste, Heizungsrohren |
| Kippsicherung (Winkel/Gurt) | Wand | Mindestmaß für freistehende Bauarten |

### 7.5 Automatische Vorschläge

- Beim Zusammenführen zweier Stäbe schlägt die App den einfachsten passenden Typ vor
  (Standard: „Stahlwinkel + Holzbauschrauben“, einstellbar als Projektvorgabe:
  *möglichst einfach* / *möglichst wenig Metall sichtbar* / *zerlegbar*).
- Liegt ein Stab auf einem anderen, wird **Auflage** vorgeschlagen und die Höhe automatisch gesetzt.
- Verbindungen werden in allen Ansichten mit einem kleinen Symbol markiert; Klick öffnet ein
  3D-Detail mit Explosionsdarstellung.

---

## 8. Ausstattung: Geländer, Leitern, Liegefläche

### 8.1 Geländer (Absturzsicherung)

| Typ | Material | Hinweis |
|---|---|---|
| Senkrechte Stäbe | Rundstäbe (z. B. Ø 25–30 mm) oder Leisten zwischen Ober- und Unterholm | Lichter Abstand ≤ 75 mm |
| Waagerechte Bretter/Latten | Bretter, Rahmenholz | Bei Kleinkindern Klettergefahr → Warnung |
| Vollfläche | Multiplex/Leimholz, ggf. mit Ausschnitten | Ausschnitte nach gleicher Öffnungsregel |
| Rahmen mit Netz | Sicherheits- oder Kletternetz, Ösen, Spannschnur | Maschenweite und Spannung prüfen |
| Seil-/Gurtgeländer | Tauwerk, Gurtband | Nur Erwachsene, Warnung |
| Wandseite ohne Geländer | – | Nur wenn Spalt zur Wand klein genug (Prüfung) |

Parameter: Seiten (einzeln an/aus), Höhe über Liegefläche, Zugangsöffnung (Position, Breite),
Holm-Querschnitt, Pfostenabstand.

### 8.2 Leitern und Treppen

| Typ | Neigung | Platzbedarf | Hinweis |
|---|---|---|---|
| Senkrechte Leiter (fest) | 90° | minimal | Einfach, für Kinder ab ca. 6 J. |
| Einhängeleiter | 75–90° | gering | Abnehmbar, Haken-Beschlag |
| Schräge Leiter mit Sprossen | 65–75° | mittel | Bequemer, Sprossen rund oder flach |
| Stufenleiter (flache Trittstufen) | 60–70° | mittel | Deutlich komfortabler |
| Leiter in Pfosten integriert | 90° | keiner | Sprossen zwischen zwei Pfosten |
| Raumspartreppe (wechselseitige Stufen) | 55–65° | mittel | Stufenhöhe ca. 20–22 cm |
| Treppe mit Stauraum (Treppenregal, Kistentreppe) | 40–50° | groß | Stauraum als Bonus |
| Kletterwand / Griffe | – | – | Nur ergänzend |

Parameter: Seite/Position am Bett, Breite, Neigung, Sprossen-/Stufenabstand (gleichmäßig,
automatisch auf die Höhe verteilt), Handlauf/Haltegriff oben. Die App zeigt den **Grundflächenbedarf**
in der Draufsicht (inkl. Freiraum zum Ein-/Aussteigen) und prüft Schrittmaß (2 h + a ≈ 59–65 cm) bei Treppen.

### 8.3 Sicherheitsregeln (Richtwerte)

Angelehnt an DIN EN 747-1/-2 (Etagen- und Hochbetten für den Wohnbereich). **Die genauen
Zahlenwerte müssen vor der Umsetzung am Normtext geprüft werden** (s. F11). Arbeitshypothese:

- Absturzsicherung an allen Seiten, Oberkante ≥ 260 mm über Oberseite Liegefläche (Bettboden)
  und ≥ 160 mm über Matratzenoberkante → App berechnet die **maximale Matratzendicke**
- Öffnungen in der Absturzsicherung ≤ 75 mm
- Zugangsöffnung 300–400 mm breit
- Keine zugänglichen Löcher 7–12 mm (Fingerfangstellen)
- Sprossen gleichmäßig, Abstand ca. 200–300 mm
- Hinweis: Oben schlafen erst ab 6 Jahren

Die Regeln sind als Profil umschaltbar: **Kinder (streng)** / **Erwachsene (empfohlen)** / **aus**.

### 8.4 Liegefläche

| Art | Typische Baumarkt-Materialien | Hinweis |
|---|---|---|
| Rollrost | Fertiger Rollrost 90×200 … | Braucht Auflagerleisten; Abstand zwischen Leisten frei |
| Lattenrost | Fertiger Federholzrahmen | Liegt auf Leisten/Querträgern |
| Selbstbau-Leistenrost | Rahmenholz/Leisten 20×70, 24×48 … | Leistenabstand, Durchbiegung je Leiste |
| Platte | OSB/3 (15–25 mm), Spanplatte P5 Verlegeplatte (19/22 mm, N+F), Multiplex Birke (15–24 mm), Leimholz Fichte (18/28 mm), Dreischichtplatte (19/27 mm) | Lüftungsbohrungen empfohlen (Schimmel unter Matratze) – App schlägt Bohrbild vor |
| Dielen (Umwidmung) | Rauspund (19–24 mm), Hobeldielen/Fußbodendielen Fichte/Kiefer (19,5–28 mm), Fasebretter | Dielen quer oder längs, Fugen = Belüftung |

Die App berechnet bei Platten und Dielen die **zulässige Spannweite** (Abstand der Querträger) aus
Dicke und Material und schlägt die Anzahl Querträger vor.

---

## 9. Analysen und Prüfungen

### 9.1 Freiraum unter und über dem Bett

- **Lichte Höhe unter dem Bett**: Abstand Boden bis Unterkante des tiefsten Bauteils, als
  Höhenkarte in der Draufsicht (Farbverlauf) und als Maßkette in der Seitenansicht.
- **Nutzungszonen** (Ampel): Stehen (≥ Körpergröße + 5 cm), Sitzen am Schreibtisch (≥ ca. 135 cm
  für 180 cm Person), Sitzen auf Sofa, Kriechen/Spielen. Schwellwerte aus eingestellter Körpergröße.
- **Sitzhöhe über der Matratze**: Matratzenoberkante bis Decke/Lampe/Rauchmelder; Empfehlung
  ≥ 75–90 cm zum aufrechten Sitzen.
- **Silhouetten** lassen sich in jede Ansicht ziehen und kollidieren sichtbar (rote Kontur).
- Möbel-Platzhalter unter dem Bett werden auf Kollision und Zugänglichkeit geprüft (z. B.
  Schreibtischstuhl-Bewegungsraum, Schranktüren).

### 9.2 Fenster- und Türöffnung

Für jeden Dreh-Flügel wird der Flügel (Rahmen + Griff) als Quader um die Bandachse von 0° bis 180°
geschwenkt und gegen alle Bauteile, Möbel und Hindernisse geprüft.

- Ergebnis: **maximaler Öffnungswinkel** je Flügel (z. B. „Flügel links: 64° statt 90°“),
  welches Bauteil blockiert, und um wie viel es verschoben werden müsste, um 90° zu erreichen.
- Darstellung: Schwenkbogen in der Draufsicht (grün bis zum Hindernis, rot dahinter),
  im 3D ein Schieberegler „Fenster öffnen“ mit animiertem Flügel.
- Kipp-Stellung: Kippvolumen (oben typ. 100–150 mm nach innen) wird geprüft.
- Griff-Erreichbarkeit: Ist der Griff von einer stehenden Person (oder von der Matratze aus)
  erreichbar?
- Gleiches Verfahren für Türen, Dachfenster und Schranktüren der Möbel-Platzhalter.

### 9.3 Kollisionen

Prüft alle Bauteile gegen Wände, Decke, Fensterbank, Heizkörper (inkl. Konvektionsraum),
Rohre, Sockelleiste, Steckdosen/Schalter (Info), Lampen und untereinander (außer an Verbindungen
mit gewollter Durchdringung wie Überblattung).

### 9.4 Statik-Abschätzung

**Ziel:** Ein Gefühl dafür, ob ein Querschnitt reicht und wie stark ein Balken federt – mit klarem
Hinweis, dass dies keine Tragwerksplanung ist.

**Lastannahmen** (als Lastfälle wählbar, Werte editierbar):

| Lastfall | Annahme |
|---|---|
| Ruhig liegen | Matratze (Std. 25 kg) + 1–2 Personen à Körpergewicht, gleichmäßig verteilt |
| Zwei Erwachsene | 2 × 100 kg, Faktor 1,0 |
| Toben / Springen | Personenlast × dynamischer Faktor (Std. 2,0) als Einzellast an ungünstigster Stelle |
| Hinknien | Einzellast 1,0–1,5 kN auf kleiner Fläche (für Platten/Dielen) |

**Berechnung je Stab** (v1, s. F8):

- Lastverteilung von der Liegefläche über Einzugsbreiten auf Querträger → Zargen → Pfosten/Wand.
- Jeder waagerechte Stab als **Einfeldträger** zwischen seinen Auflagern (Pfosten, Auflage,
  Wandauflager), mit Gleichstreckenlast und optional Einzellast.
- Durchbiegung: f = 5 q L⁴ / (384 E I) bzw. f = F L³ / (48 E I), mit I = b h³ / 12.
- Biegespannung σ = M / W mit W = b h² / 6, verglichen mit einem vereinfachten
  Bemessungswert (C24: f_m,k = 24 N/mm², k_mod und γ_M als Projektvorgabe).
- Schub an Ausklinkungen und Überblattungen mit Restquerschnitt.
- Kriechen (Langzeitdurchbiegung) über Faktor k_def für Nutzungsklasse 1 (optional einblendbar).
- Pfosten: Druck und Knicken (vereinfachter Nachweis), meist unkritisch – wird trotzdem angezeigt.
- Platten/Dielen: Durchbiegung zwischen Querträgern (Ersatzbalken je 1 m Breite bzw. je Diele).
- **Seitensteifigkeit (Wackeln)**: qualitativ – hat die Konstruktion in beiden Richtungen eine
  Aussteifung (Strebe, Kopfband, Platte, Wandanbindung, Deckenverspannung)? Sonst Warnung.

**Grenzwerte** (Ampel): Durchbiegung ≤ L/300 grün, ≤ L/200 gelb, darüber rot; Ausnutzung ≤ 80 %
grün, ≤ 100 % gelb, darüber rot.

**Darstellung**: Stäbe im „Statik-Modus“ nach Ausnutzung eingefärbt; Hover zeigt Spannweite,
Last, Durchbiegung in mm, Ausnutzung. Für einen gewählten Stab eine **Vergleichstabelle**
aller Katalog-Querschnitte („60×120: 1,3 mm ✓ – 60×100: 2,2 mm ✓ – 45×70: 8,5 mm ⚠“) mit
Ein-Klick-Tausch. Optional: überhöhte Biegelinie in der Seitenansicht.

*Beispiel zur Plausibilisierung:* KVH 60×120 hochkant, Spannweite 2,0 m, 1,15 kN gleichmäßig
verteilt → I = 8,64·10⁶ mm⁴, f ≈ 1,3 mm (L/1600) – unkritisch. Dieselbe Last auf 45×70 hochkant →
f ≈ 8,5 mm (L/235) – gelb, spürbar federnd.

### 9.5 Material- und Fertigungsprüfungen

- Stab länger als größte Handelslänge → Hinweis auf Stoß oder Sonderbestellung.
- Matratze passt nicht ins Innenmaß des Rahmens.
- Bohrung an gesperrter Stelle (Fußbodenheizung, Trockenbau ohne Ständer, Mietmodus).
- Schraubenlänge passt nicht zur Holzdicke (bei gewählten Verbindungen).

### 9.6 Montierbarkeit

- **Aufrichtbarkeit**: Ein am Boden vormontierter Rahmen oder ein deckenhoher Pfosten muss beim
  Aufrichten über die Diagonale passen. Ist die Diagonale größer als die Raumhöhe, Hinweis
  („Pfosten 10 mm kürzer + Stellfuß“ oder „erst Pfosten stellen, dann Zargen montieren“).
- **Einbringen**: Längstes Teil vs. Türbreite/Flur (optional: Treppenhaus-Maß eingeben).
- **Montagereihenfolge** (spätere Ausbaustufe): Vorschlag einer sinnvollen Reihenfolge.

### 9.7 Prüfliste

Alle Befunde in einer Liste mit Schweregrad (Fehler / Warnung / Hinweis), Kategorie und Bauteil.
Klick → Auswahl und Zoom in allen Ansichten. Befunde können „zur Kenntnis genommen“ werden
(bleiben dann ausgegraut). Die Prüfung läuft live bei jeder Änderung.

---

## 10. Material, Stückliste, Kosten

### 10.1 Materialkatalog

Lokaler, editierbarer Katalog mit Baumarkt-üblichen Sortimenten (Hornbach, OBI, Bauhaus, toom
führen ähnliches). Jeder Eintrag: Bezeichnung, Holzart, Festigkeitsklasse/E-Modul, Rohdichte,
Querschnitt, Handelslängen bzw. Plattenformat, Oberfläche (gehobelt/sägerau), Preis (manuell,
mit Datum und Quelle), Bezugsquelle/Link.

Startbestand (Auswahl, typische Maße – Verfügbarkeit im Markt variiert):

| Gruppe | Beispiele |
|---|---|
| KVH Fichte C24, gehobelt | 60×60, 60×80, 60×100, 60×120, 60×140, 60×160, 80×80, 80×120, 100×100, 120×120; Längen 3/4/5 m |
| Brettschichtholz GL24h | 80×80, 100×100, 120×120 … |
| Gehobelte Kanthölzer / Rahmenholz | 44×44, 44×69, 44×94, 58×58, 68×68, 70×70 … |
| Rauhspund, Hobeldielen | 19×96, 19×146, 21×121, 27×146 … |
| Platten | OSB/3, Spanplatte P5, Multiplex Birke, Leimholz Fichte/Buche, Dreischicht |
| Leisten, Rundstäbe | 20×70, 24×48, Rundstab Ø 25/30 mm (Buche/Kiefer) |
| Verbinder | Winkel, Balkenschuhe, Lochband, Schrauben, Dübel, Gewindestangen, Bettbeschläge |
| Netze, Seile | Sicherheitsnetz, Tauwerk, Ösen, Spannschrauben |

### 10.2 Stückliste und Zuschnitt

- **Stückliste** gruppiert nach Material und Querschnitt, mit Länge je Teil und Teilenummer
  (die auch im Bauplan und in der 3D-Ansicht stehen).
- **Zuschnittoptimierung** (1D für Stäbe, 2D für Platten): Verteilung der Teile auf Handelslängen
  bzw. Plattenformate mit Sägeschnitt-Breite, Ausgabe von Verschnitt und Anzahl zu kaufender Stücke.
- **Baumarkt-Zuschnittservice**: Anzahl Schnitte und Kosten pro Schnitt optional.
- **Verbrauchsmaterial**: Schrauben, Winkel, Dübel aus den gewählten Verbindungen, aufgerundet
  auf Packungsgrößen.
- **Werkzeugliste** aus den gewählten Verbindungen.
- **Kosten**: Summe aus Katalogpreisen, mit Hinweis auf fehlende Preise.
- Export: CSV und Druckansicht/PDF.

### 10.3 Bauplan

Druckbare Ansichten (Draufsicht, Seitenansichten, Isometrie, Explosionsdarstellung) mit Maßketten,
Teilenummern und Verbindungsdetails. Umfang je nach F9.

### 10.4 Preisrecherche (Ausbaustufe)

Stufenweise, je nach Antwort auf F6:

- **Stufe 0 – ohne Infrastruktur**: Die App erzeugt aus der Stückliste einen fertigen Prompt
  („Recherchiere die aktuellen Preise bei Hornbach für …“), den man in einen KI-Chat kopiert;
  das Ergebnis (Tabelle) wird zurück eingefügt und in den Katalog übernommen.
- **Stufe 1 – Agent mit eigenem API-Schlüssel**: Die App ruft die Claude API mit Websuche direkt
  aus dem Browser auf (Schlüssel bleibt lokal). Je Position: gefundenes Produkt, Link, Preis,
  Einheit, Datum. Ergebnisse werden zwischengespeichert und müssen bestätigt werden.
- **Stufe 2 – kleiner Server**: Gemeinsamer Preis-Cache, Marktwahl (Filiale), regelmäßige
  Aktualisierung. Achtung: Hornbach hat keine öffentliche API; automatisiertes Auslesen der
  Webseite ist nutzungsrechtlich heikel – Agent-Recherche mit Quellenangabe ist der realistischere Weg.

---

## 11. Bedienung und Oberfläche

### 11.1 Layout

```
┌───────────────────────────────────────────────────────────────────────┐
│ Projekt ▾ │ Werkzeuge: Auswahl Balken Pfosten Platte Geländer Leiter … │ Prüfung ⚠ 3 │
├──────────┬────────────────────────────────────────────┬──────────────┤
│ Raum     │  ┌──────────────────┐ ┌──────────────────┐ │ Eigenschaften│
│ Hinder-  │  │   Draufsicht     │ │                  │ │ des gewählten│
│ nisse    │  │                  │ │       3D         │ │ Elements     │
│ Bett     │  ├──────────────────┤ │                  │ │              │
│ Bau-     │  │ Seitenansicht    │ │                  │ │ Statik-Info  │
│ gruppen  │  │ (Wand A ▾)       │ │                  │ │              │
│ Möbel    │  └──────────────────┘ └──────────────────┘ │              │
├──────────┴────────────────────────────────────────────┴──────────────┤
│ x 1234  y 567  z 1600 │ Raster 10 mm │ Fang: Kanten ✓ Raster ✓ │ Höhe: 160 cm │
└───────────────────────────────────────────────────────────────────────┘
```

- Ansichtslayouts: 1, 2, 3 Ansichten; jede Ansicht per Taste maximierbar.
- Seitenansicht wählbar: **von Wand A/B/C/D** (Blick auf die Wand) oder als **Schnitt** an einer
  frei gesetzten Linie in der Draufsicht. Bauteile vor der Schnittlinie werden ausgeblendet oder
  transparent.
- Auswahl, Hervorhebung und Hover sind in allen Ansichten synchron.

### 11.2 Zeichnen und Bearbeiten

- **Balken zeichnen**: Klick Start, Klick Ende in Draufsicht oder Seitenansicht. Fehlende dritte
  Koordinate kommt aus der **Arbeitshöhe** (Statusleiste, Standard: Oberkante Liegerahmen) bzw. der
  **Arbeitstiefe** in der Seitenansicht – oder aus dem Fang auf ein vorhandenes Bauteil.
- **Pfosten setzen**: Klick in der Draufsicht; Höhe Standard „bis Unterkante Rahmen“ oder „bis Decke“.
- **Auflegen**: Ein Balken, der quer über zwei andere gezogen wird, legt sich automatisch obenauf
  (Höhe = Oberkante der Auflager) und bekommt die Verbindung „Auflage“.
- **Direkte Maßeingabe**: Während des Zeichnens Länge/Winkel tippen (Tab wechselt Feld);
  Maßangaben an Bauteilen anklicken und Wert ändern („Abstand zur Wand B: 35 mm“).
- **Fang**: Raster (einstellbar), Wände, Bauteilkanten/-enden/-mitten, Hindernis-Kanten,
  Winkel 0°/45°/90°, Verlängerung vorhandener Achsen. Taste gedrückt halten = Fang aus.
- **Griffe**: Enden ziehen = verlängern; Körper ziehen = verschieben (in der Ebene der Ansicht);
  Pfeiltasten = Feinverschieben (1 mm / mit Shift 10 mm).
- **Querschnitt**: Dropdown aus Katalog; Taste zum Drehen hochkant/flach.
- **Vervielfältigen**: Kopieren, Spiegeln, „Gleichmäßig verteilen“ (n Querträger zwischen zwei
  Zargen, Anzahl oder max. Abstand – Vorschlag aus Statik).
- **Baugruppen bearbeiten** über das Eigenschaftenpanel (Parameter) oder mit Griffen direkt in der
  Ansicht (z. B. Geländerhöhe ziehen, Leiter entlang der Kante verschieben).
- **Rückgängig/Wiederholen** unbegrenzt, auch über Neuladen hinweg.
- Kontextmenü am Bauteil: Querschnitt, Material, Verbindungen, an Wand befestigen, Baugruppe auflösen,
  ausblenden, löschen.

### 11.3 Sichtbarkeit

Ebenen ein/aus: Raum, Hindernisse + Freihaltebereiche, Bett, Geländer, Leiter, Möbel, Personen,
Maße, Verbindungs-Symbole, Statik-Färbung, Höhenkarte.

### 11.4 Tastatur (Vorschlag)

`V` Auswahl · `B` Balken · `P` Pfosten · `F` Fläche · `M` Messen · `R` Querschnitt drehen ·
`1`–`3` Ansicht maximieren · `0` alle Ansichten · `Strg+Z/Y` · `Entf` · `Strg+D` duplizieren ·
`H` ausblenden · `Leertaste+Ziehen` verschieben der Ansicht · Mausrad Zoom.

### 11.5 3D-Ansicht

- Freie Orbit-Kamera, Standardblickwinkel („von der Tür aus“, „von oben“, „Isometrie“).
- Stil: weiches, warmes Licht, weiche Schatten (Ambient Occlusion), Holz mit dezenter prozeduraler
  Maserung, Wände hell und **automatisch ausgeblendet/transparent, wenn sie der Kamera im Weg stehen**,
  Boden mit leichter Textur. Kanten optional betont (Zeichnungsstil).
- Fenster-Animation per Schieberegler, Personen-Silhouetten, Hindernis-Freihaltebereiche als Glas-Volumen.
- Auswahl und einfaches Verschieben auch im 3D (entlang der Achsen mit Gizmo).
- Explosionsansicht einer Verbindung oder des ganzen Betts.

---

## 12. Technik

### 12.1 Vorschlag

- **Browser-only**, statische Seite (z. B. GitHub Pages), offline fähig (PWA). Kein Konto.
- TypeScript + Vite (wie im bestehenden heatstitch-Projekt).
- **3D**: three.js. **2D-Ansichten**: SVG (scharfe Linien, Maßketten, einfache Trefferprüfung, gut druckbar).
- UI-Framework: React (mit react-three-fiber) für das recht umfangreiche Eigenschaften-/Panel-UI
  – oder bewusst ohne Framework wie heatstitch. Siehe F5.
- Zustand: ein zentrales, serialisierbares Projektmodell (JSON) als einzige Wahrheit; alle
  Ansichten, Prüfungen und Stücklisten sind daraus abgeleitet. Änderungen als Befehle
  (Undo/Redo, später ggf. Zusammenarbeit).
- Geometrie-/Prüfkern ohne DOM, vollständig mit Unit-Tests (Vitest) – insbesondere Fenster-Schwenkprüfung,
  Statik, Zuschnitt, Verbindungserkennung.
- Speicherung: automatisch lokal (IndexedDB), Export/Import als `.hochbett.json`, mehrere Projekte.

### 12.2 Datenmodell (Skizze)

```ts
type Mm = number // ganzzahlige Millimeter
interface Vec3 { x: Mm; y: Mm; z: Mm }

interface Project {
  version: number
  room: Room
  obstacles: Obstacle[]      // Fenster, Tür, Heizkörper, Fensterbank, …
  furniture: Furniture[]      // Platzhalter + Personen
  members: Member[]           // alle Stäbe
  panels: Panel[]             // Platten, Dielenflächen
  joints: Joint[]             // Stab–Stab
  fixings: Fixing[]           // Stab–Wand/Boden/Decke
  assemblies: Assembly[]      // parametrische Baugruppen
  settings: ProjectSettings   // Lastfälle, Sicherheitsprofil, Mietmodus, Vorgaben
  catalogOverrides: CatalogItem[]
}

interface Member {
  id: string
  role: 'post' | 'rail' | 'joist' | 'ledger' | 'brace' | 'rung' | 'handrail' | 'tread' | 'other'
  start: Vec3; end: Vec3
  section: { b: Mm; h: Mm }
  roll: number               // Grad um die eigene Achse
  anchor: 'center' | 'top' | 'bottom' | 'left' | 'right'
  materialId: string
  assemblyId?: string
  cuts: Cut[]                // abgeleitet aus Verbindungen
}

interface Joint {
  id: string
  memberIds: string[]
  kind: 'corner' | 'tee' | 'cross' | 'bearing' | 'splice' | 'brace'
  type: string               // Katalog-ID, z. B. 'steel-angle-90', 'half-lap', 'dovetail-lap'
  params: Record<string, number | string>
}
```

---

## 13. Ausbaustufen (Vorschlag)

| Stufe | Inhalt | Ergebnis |
|---|---|---|
| **M1 Raum & Zeichnen** | Rechteckraum, Hindernisse (Fenster, Tür, Heizkörper, Fensterbank, Sockelleiste), Draufsicht + Seitenansicht + 3D, Balken/Pfosten zeichnen, Fang, Maßeingabe, Undo, lokales Speichern | Bett lässt sich frei in den Raum zeichnen |
| **M2 Vorlagen & Freiraum** | Baugruppen Liegerahmen/Pfosten/Geländer/Leiter, Vorlagen V1–V5, Matratzenmaße, Freiraum-Analyse, Personen, Möbel, Fenster-/Tür-Schwenkprüfung, Kollisionen, Prüfliste | **Kernnutzen erreicht** |
| **M3 Verbindungen & Statik** | Verbindungskatalog mit Auto-Erkennung und 3D-Details, Befestigungen, Statik-Abschätzung, Querschnittsvergleich, Sicherheitsregeln, Aufrichtbarkeit | Konstruktion technisch plausibel |
| **M4 Material** | Katalog, Stückliste, Zuschnittoptimierung, manuelle Preise, CSV/PDF, Bauplan-Druck | Einkaufsliste und Bauplan |
| **M5 Preise & Extras** | Preis-Prompt (Stufe 0), Preis-Agent (Stufe 1), Dachschräge/Polygonraum, V6–V8, Montagereihenfolge | |

---

## 14. Offene Fragen

Die Fragen sind nach Wichtigkeit für den Start sortiert. Wo ich einen Vorschlag habe, steht er dabei.

| # | Frage | Mein Vorschlag |
|---|---|---|
| **F1** | **Wo soll das Projekt leben?** Dieses Repository ist heatstitch (Stickerei-App). | Eigenes Repository `hochbettplaner`; diese Spezifikation dorthin mitnehmen |
| **F2** | **Raumformen**: Reicht ein Rechteck, oder brauchst du L-Form/Erker/Vorsprünge, **Dachschrägen**, Unterzüge? Gibt es ein konkretes Zimmer, an dem wir testen? | Rechteck in M1, Polygon + Dachschräge in M5 – es sei denn, dein Zimmer braucht es früher |
| **F3** | **Für wen** wird das Bett gebaut: Kinder (strenge Sicherheitsregeln), Jugendliche/Erwachsene, beides? | Beides, mit umschaltbarem Sicherheitsprofil |
| **F4** | **Sprache und Einheiten**: Nur Deutsch, cm in der Anzeige? | Deutsch, Anzeige cm mit einer Nachkommastelle, intern mm |
| **F5** | **Technik**: Ist React (+ react-three-fiber) ok, oder soll es wie heatstitch framework-frei bleiben? Spielt Offline/PWA eine Rolle? | React + three.js, PWA |
| **F6** | **Preisrecherche**: Reicht vorerst der kopierbare Prompt (Stufe 0)? Wäre es ok, einen eigenen Claude-API-Schlüssel in der App zu hinterlegen (Stufe 1)? Einen Server wollen wir eher nicht? | Stufe 0 in M4, Stufe 1 in M5 |
| **F7** | **Parametrik vs. Freiheit**: Sollen Vorlagen nach dem Einsetzen parametrisch bleiben (Matratzenmaß ändern → alles passt sich an), oder reicht „einsetzen und dann frei bearbeiten“? | Parametrisch bleiben, bis man die Baugruppe bewusst auflöst |
| **F8** | **Statik-Tiefe**: Reicht die Abschätzung je Balken als Einfeldträger (Kap. 9.4), oder möchtest du ein echtes Stabwerk (Rahmen mit steifen Ecken, Durchlaufträger, Seitenlasten)? | Einfeldträger in M3; Stabwerk nur, wenn sich die Abschätzung als zu grob erweist |
| **F9** | **Bauplan**: Wie wichtig ist ein druckbarer Bauplan mit Maßen, Teilenummern und Explosionsansicht? Reicht Stückliste + Screenshots? | Bauplan in M4, Explosionsansicht später |
| **F10** | **Holzverbindungen**: Nur auswählen und darstellen, oder auch **Anleitung mit Maßzeichnung** (z. B. wie tief die Überblattung, wo die Schrauben)? | Maßzeichnung für die 4–5 häufigsten Verbindungen |
| **F11** | **Normen**: Sollen Werte aus DIN EN 747 verbindlich hinterlegt werden (dann muss jemand den Normtext prüfen), oder reichen gekennzeichnete Richtwerte? | Gekennzeichnete Richtwerte |
| **F12** | **Gefährliche Bauarten**: Deckenabgehängte Betten und Seilgeländer anbieten (mit Warnung) oder weglassen? | Abgehängt weglassen, Seilgeländer nur im Erwachsenenprofil |
| **F13** | **Mehrere Betten** pro Raum (Geschwister, zwei Hochbetten über Eck) – nötig? | Ja, Projektmodell unterstützt es von Anfang an |
| **F14** | **Baumarkt**: Katalog nur an Hornbach ausrichten oder neutral (Hornbach, OBI, Bauhaus, toom)? Gibt es einen Markt in deiner Nähe, dessen Sortiment wir als Referenz nehmen? | Neutral, Startbestand an Hornbach orientiert |
| **F15** | **Speichern/Teilen**: Reicht lokal + Datei-Export, oder willst du Projekte per Link teilen? | Lokal + Datei; Link-Teilen später |
| **F16** | **Montageanleitung**: Schritt-für-Schritt-Reihenfolge wünschenswert? | Später (M5+) |
