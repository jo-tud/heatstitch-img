# heatstitch

Stickdateien ansehen, prüfen und korrigieren, und aus Bildern neue machen, komplett im Browser (kein
Backend, keine Uploads).

Drei Modi, oben umschaltbar (Tasten 1, 2 und 3):

- **Ablauf**: wie die Maschine die Datei abarbeitet. Farbblöcke als Ebenen (ausblenden, hervorheben),
  Stiche färben nach Garnfarbe, Reihenfolge, Stichart oder Stichlänge, Markierungen für Sprünge,
  Fadenschnitte, Farbwechsel, Start/Ende und Einstiche, ein Player mit geschätzter Nähzeit, und eine
  Liste der Sprünge, die sich einzeln oder nach Länge schneiden und vernähen oder ohne Schnitt
  mitziehen lassen.
- **Dichte**: Heatmap, Prüfung für Stoff und Garn, Korrektur (alles unten Beschriebene).
- **Bild**: aus einem beliebigen Bild oder Foto eine Stickdatei machen: Farben auf Garnfarben
  reduzieren, mit Farbliste und Pinsel nachbessern, Füll-, Satin- und Steppstiche erzeugen, siehe
  [Bild → Stickdatei](#bild--stickdatei).

## Funktionen

- **Formate:** DST (Tajima) und PES (Brother, liest den PEC-Block)
- **Zwei Dichtemetriken**, per Umschalter:
  - *Garnlänge* in mm/mm²: jedes Stichsegment wird exakt auf die Rasterzellen verteilt, die es durchläuft
  - *Einstiche* in 1/mm²: Nadeleinstiche pro Fläche (Perforationsrisiko)
- Rasterzelle 0,5 bis 5 mm, optionale Gauss-Glättung
- Absolute Farbskala mit einstellbarem Maximum
- **Validierung** jeder geladenen Datei (Sicher / Vorsicht / Kritisch) für ein wählbares Material (Stoff × Garnstärke), mit orange/rotem Overlay, Gesamturteil und Zonenliste, siehe unten
- Ungetrimmte Sprünge optional als Garn zählen
- Stichplan-Overlay in Garnfarben, wahlweise als realistische Fäden mit Schattierung und Schatten, Sprünge gestrichelt; das Licht folgt dabei Maus oder Neigung des Handys
- Zoom (Mausrad, Pinch), Verschieben, Tooltip mit Dichte und Position
- Statistik: Stiche, Sprünge, Schnitte, Farbwechsel, Größe, Garnlänge, Max-Dichte
- Mehrere Dateien laden und umschalten (auch per Pfeiltasten oder j/k, `f` = Einpassen)
- PNG-Export der aktuellen Ansicht inkl. Legende
- **Korrektur:** automatisch nach Digitalisier-Praxis (Füllung unter Kanten zurückziehen, Kurzstiche in Satinkurven, gleichmäßig neu verteilen, Fokus Fadendichte oder Lochdichte, praxisübliche Funde und quittierte Zonen bleiben unangetastet) und von Hand (Einstiche wählen, verschieben, löschen, Auswahl ausdünnen), mit Rückgängig/Wiederholen und Vergleichsansicht Original/korrigiert, siehe unten
- **Speichern als DST oder PES** (eigene Writer, kein pyembroidery)
- **Bild → Stickdatei:** PNG, JPG, WebP, SVG; Vorverarbeitung für Fotos, Garnfarben der Brother-Palette, Pinsel, Tatami-Füllung, Satinsäulen und Steppstich, ohne externe Bibliotheken
- Deutsch / Englisch
- PWA: installierbar, offline nutzbar, "Öffnen mit" für .dst/.pes
- Kurzanleitung auf Deutsch und Englisch (`docs.html`, Link "Anleitung" oben rechts)

## Validierung

Läuft automatisch, sobald eine Datei geladen ist, unabhängig von den Darstellungsreglern. Die Messung
(Web Worker) hängt nicht vom Material ab; die Einstufung schon, sie ist billig und läuft beim Wechsel
von Stoff oder Garn sofort für alle geladenen Dateien neu.

### Materialprofile

Die Grenzwerte gelten für 40 wt auf stabiler Webware und werden mit einem Faktor aus Stoff und Garn
skaliert (Verhältnis des empfohlenen Stichabstands zur Referenz 0,40 mm).

| Stoff | Faktor | empf. Abstand (40 wt) |
|---|---|---|
| Webware, stabil (Twill, Canvas, Denim) | 1,0 | 0,40 bis 0,45 mm |
| Kappe, strukturiert | 0,9 | 0,40 bis 0,50 mm |
| Strick, Fleece (Piqué, Jersey) | 0,85 | 0,42 bis 0,50 mm |
| Frottee, Flor | 0,65 | 0,55 bis 0,70 mm |
| Leicht, empfindlich (Seide, Batist) | 0,6 | 0,60 bis 0,70 mm |
| Leder, Kunstleder (+ Perforationsprüfung) | 0,7 | 0,50 bis 0,80 mm |

| Garn | 60 wt | 40 wt | 30 wt | 12 wt |
|---|---|---|---|---|
| Faktor (nach Madeira-Abstandstabelle) | 1,15 | 1,0 | 0,8 | 0,5 |

### Regeln

| Regel | Vorsicht | Kritisch |
|---|---|---|
| Garnlänge pro Fläche, Füllstich | ab 7,0 mm/mm² (ca. 3 Lagen) | ab 9,5 mm/mm² (4 Lagen) |
| Garnlänge pro Fläche, reiner Satin | ab 11 mm/mm² | ab 12 mm/mm² |
| Kurzstich-Häufung | ≥ 8 Stiche unter 1 mm in einer Zelle (Webware, Caps) | ≥ 8 (alle anderen Stoffe) |
| Perforation (nur Leder) | ≥ 6 Einstiche im Umkreis von 1 mm | ≥ 9 |

Dichtewerte jeweils × Profilfaktor. Eine Füllstichlage mit 0,4 mm Abstand hat 2,5 mm/mm², ein Satin
mit 0,4 mm Abstand (zwischen Einstichen auf derselben Seite) 5,0 mm/mm².

- **Raster:** feste 1-mm-Zellen. Die Dichte wird auf 0,2-mm-Unterzellen berechnet, mit σ = 0,6 mm
  geglättet; jede Zelle bekommt den **Spitzenwert** ihrer Unterzellen. So werden schmale Säulen
  (Schrift, Ränder) nicht mit ihrer leeren Umgebung weggemittelt; gleichmäßige Füllflächen lesen
  sich höchstens etwa 7 % über ihrem Nennwert.
- **Schwellen liegen zwischen typischen Aufbauten**, damit nicht die Rasterlage entscheidet: zwei
  Füllflächen mit Unterlage erreichen bis 6,4, drei Lagen ab 7,4, vier Lagen ab 9,95, ein Satinrand
  über einer Füllfläche (beide mit Unterlage) bis 9,0.
- **Satin:** liegt oben auf und sticht nur an den Kanten ein. Die Grenzen einer Zelle werden linear
  nach ihrem Satinanteil zwischen Füllstich- und Satinwerten interpoliert (Satin = Zickzack-Stiche
  1 bis 12,1 mm, nahezu gegenläufig).
- **Kurzstich-Häufung:** bis zu 6 kurze Stiche direkt nach Blockbeginn (Vernähen nach Sprung,
  Schnitt, Farbwechsel oder Designstart) bzw. direkt vor Blockende zählen nicht. Längere Ketten
  kurzer Stiche zählen ab dem siebten Stich.
- **Perforation:** pro Einstich die Zahl der anderen Einstiche im Umkreis von 1 mm (Vernähstiche
  ausgenommen). Eine Lochreihe mit Abstand p ergibt 2 × ⌊1/p⌋: 4 bei 0,35 bis 0,5 mm, 6 bei
  0,33 mm, 10 bei 0,2 mm. Gestapelte Kanten und enge Innenkurven addieren sich.
- **Zonen:** zusammenhängende (8er-Nachbarschaft) markierte Zellen bilden eine Zone; ihre Stufe ist
  die der schlimmsten Zelle. Klick (oder `n` / Umschalt+`n`) zoomt hin, Überfahren rahmt sie ein,
  `v` blendet die Markierungen ein und aus. Bei kritischen Dichte-Zonen steht dabei, wie viel
  Prozent der Spitzenwert über der Grenze liegt, damit knappe Fälle erkennbar sind.
- **Praxisübliche Funde** (`src/validation/practice.ts`) bleiben in der Liste, zählen aber nicht
  zum Gesamturteil, und die Korrektur lässt sie aus. Perforation zählt immer.
  - *Kleine Stelle:* Vorsicht bis 3 mm² oder eine einzelne kritische Zelle (Satin-Enden,
    Objektübergänge, Wendepunkte, Vernähknoten).
  - *Satin-Übergang:* überwiegend Satin, kompakt (höchstens 16 mm², Seitenverhältnis bis 2,5) und
    höchstens 30 % über der Grenze, also zwei Satinlagen, wo Säulen sich treffen oder kreuzen.
    Zwei Säulen übereinander der Länge nach ergeben eine lange Zone und bleiben ein Befund.
  - *Kurzstiche auf stabilem Stoff:* reine Kurzstich-Zonen auf Webware und Caps.

  Mit *Trotzdem prüfen* zählt eine solche Zone wieder mit; *Quittieren* nimmt jede andere Zone aus
  dem Urteil. Beides wird mit der Datei gespeichert und verfällt, wenn die Zone durch eine Änderung
  verschwindet oder deutlich wächst.
- **Tooltip:** zeigt neben dem Anzeigewert den Prüfwert der Zelle und die für sie geltenden Grenzen.
- API: `measurePattern(pattern)` (profilunabhängig) und `classify(measurement, profile)` in
  `src/validation/validate.ts`. Schwellen in `src/validation/thresholds.ts`, Profile in
  `src/validation/profiles.ts`.

## Korrektur

Das Panel *Korrektur* steht in der rechten Spalte unter den Befunden und arbeitet mit dem gewählten
Material und den eingeschalteten Prüfungen. Jede Änderung ist ein Rückgängig-Schritt (Strg+Z /
Strg+Umschalt+Z), *Original* stellt die geladene Datei wieder her.

Die bearbeitete Fassung wird bei jeder Änderung im Browser neben dem unveränderten Original
gespeichert (IndexedDB) und nach dem Neuladen der Seite wiederhergestellt; ein Rückgängig-Schritt
führt dann zurück zum Original. Das Original selbst wird nie überschrieben, und *×* entfernt beide.

### Automatisch

Die Korrektur arbeitet wie ein Digitalisierer von Hand: Sie verändert Stiche nur dort, wo es im
fertigen Stick nicht auffällt, und lässt Stellen, die in der Praxis normal sind, in Ruhe. *Ziel* ist
entweder „keine Warnung“ (Vorsicht und Kritisch beheben) oder „nur Kritisch“ (Standard). *Nur gewählte Zone*
beschränkt sie auf die Zone, die in der Liste gewählt ist. Sie läuft im Web Worker, und jeder
Schritt wird nur übernommen, wenn das Ergebnis im Bereich dadurch nicht schlechter wird.

*Fokus* legt fest, welche Regel Stiche einspart:

- **Beides** (Standard): Fadendichte, Kurzstich-Häufungen und bei Leder die Perforation.
- **Fadendichte**: nur zu viel Garn pro Fläche. Verdeckte Füllreihen werden ausgedünnt.
- **Lochdichte**: nur Einstiche (Kurzstiche, Perforation); zusätzlich werden Einstiche
  verschiedener Lagen, die im selben Loch landen, um höchstens 0,3 mm getrennt.

Die Schritte, in dieser Reihenfolge:

1. **Aufräumen** (`src/correct/shorts.ts`): Stiche ohne Bewegung fallen weg, Ketten winziger Stiche
   werden zusammengefasst, solange kein Punkt mehr als 0,3 mm abweicht.
2. **Füllung unter der Kante zurückziehen** (`src/correct/pullback.ts`): Reicht eine Füllung weit
   unter eine später gestickte Satinkante, wird das Reihenende auf die übliche Überlappung von etwa
   30 % der Kantenbreite zurückgenommen (unter einer Füllung 0,6 mm). Die Kante verdeckt das
   Reihenende ohnehin, gespart wird doppelte Lage am Rand.
3. **Kurzstiche in Satinkurven** (`src/correct/satinShort.ts`): Auf der Innenseite enger Kurven
   drängen sich die Einstiche. Wie in Digitalisierprogrammen endet dort jeder zweite Stich ein
   Viertel der Säulenbreite vor der Kante; die Kontur bleibt geschlossen.
4. **Verdeckte Reihen ausdünnen** (nur Fadendichte, `src/correct/thin.ts`): Füllreihen, die
   vollständig unter mindestens einer vollen späteren Lage liegen, werden paarweise entfernt. Man
   sieht sie nicht, Streifen entstehen also nicht.
5. **Gleichmäßig neu verteilen** (`src/correct/respace.ts`): Ist eine Füllung oder ein Satin danach
   noch zu dicht, wird die ganze Bahn mit gleichmäßig größerem Reihen- bzw. Stichabstand neu
   aufgebaut statt einzelne Reihen herauszunehmen. Kontur, Stichversatz und Bahnrichtung bleiben,
   und der Abstand wird nie größer als der für das Material empfohlene (Webware 40er: 0,45 mm).
   Schmale Details und schon ungleichmäßige Bahnen bleiben unverändert.
6. **Einstiche trennen** (`src/correct/nudge.ts`): bei Fokus Lochdichte und bei Perforation auf
   Leder; verschoben werden nur Einstiche zwischen zwei ausreichend langen Stichen.

Vernähstiche, Sprünge, Schnitte und Farbwechsel bleiben unverändert.

**Was in Ruhe bleibt:** praxisübliche und quittierte Zonen (siehe Validierung) fasst die Korrektur
nicht an; sie sorgt nur dafür, dass sie nicht schlimmer werden. Was danach noch übrig ist, meldet
das Panel als „von Hand prüfen“: meist mehrere gestapelte Lagen, also eine Designentscheidung.

### Von Hand

*Stiche bearbeiten* (`e`) blendet Stichplan und, ab etwa 6 px/mm Zoom, die Einstiche ein.

- Klick wählt einen Einstich, Umschalt+Klick erweitert, Umschalt+Ziehen wählt ein Rechteck,
  Strg+A alles. Klick ins Leere hebt die Auswahl auf, Ziehen im Leeren verschiebt die Ansicht.
- Gewählte Einstiche ziehen oder mit den Pfeiltasten verschieben (0,1 mm, mit Umschalt 0,5 mm).
- Entf / Rücktaste löscht; die Nachbarn werden durch einen Stich verbunden.
- *Ausdünnen* entfernt 25, 33 oder 50 % der Zyklen in Füllungen und Zickzacks, die überwiegend in
  der Auswahl liegen.

### Vergleich

*Mit Original vergleichen* (`c`, sobald die Datei geändert wurde) teilt die Ansicht: links das
Original, rechts die aktuelle Fassung, jeweils mit eigener Heatmap, Markierungen und Stichplan. Die
Trennlinie lässt sich ziehen, Zoom und Verschieben gelten für beide Seiten, der Tooltip zeigt die
Werte der Seite unter dem Zeiger. Darunter stehen Stiche, Garnlänge, kritische und Vorsicht-Fläche
und maximale Dichte beider Fassungen nebeneinander.

### Speichern

*Als DST* / *Als PES* schreibt das aktuelle Muster (`src/writers/`). Nach einer Änderung heißt die
Datei `name-corrected.dst`. Gespeichert werden nur Stiche und Farben: PE-Design-Objekte und
Rahmeneinstellungen des Originals gehen verloren.

- **DST:** Ein Schnitt wird als Folge von 3 Sprüngen geschrieben, aber nur, wenn die Sprungfolge danach
  nicht schon lang genug ist. Schnitte wachsen deshalb beim wiederholten Speichern nicht (anders als
  bei pyembroidery). Ungetrimmte Sprungfolgen, die sonst als Schnitt gelesen würden, werden
  zusammengefasst. Lange Stiche werden in Sprünge plus einen Stich zerlegt (keine zusätzlichen
  Einstiche). Sprünge über 36 mm brauchen 3 oder mehr Datensätze und werden beim Lesen zum Schnitt;
  das ist eine Eigenschaft des Formats. DST enthält keine Farben.
- **PES:** Version 1 mit CEmbOne/CSewSeg-Objekt für Designsoftware und PEC-Block mit
  Vorschaubildern für Maschinen. Nur Sprünge nach einem Schnitt tragen das Schnitt-Flag (pyembroidery
  markiert jeden Sprung). Farben behalten ihren PEC-Paletten-Platz; Farben aus DST bekommen den
  nächstgelegenen.
- Die Tests (`tests/writers.test.ts`) prüfen Lesen → Schreiben → Lesen für DST, PES und beide
  Konvertierungen auf Datensatz-Gleichheit. Die geschriebenen Dateien wurden außerdem mit
  pyembroidery 1.5.1 gegengelesen.

## Bild → Stickdatei

Der Modus *Bild* (Taste 3) macht aus einem Bild eine Stickdatei, in zwei Schritten, die beide in einem
Web Worker laufen (`src/digitize/worker.ts`). Jede Änderung startet eine neue Rechnung; was während einer
Rechnung geändert wird, wird danach mit den neuesten Einstellungen gerechnet. Bild, Farbänderungen und
Pinselstriche bleiben im Browser gespeichert (IndexedDB, `src/storage/imageStore.ts`).

Die Verfahren sind nach einer Recherche in Fachliteratur, Herstellerhandbüchern und den Quelltexten
freier Stickprogramme gewählt. Ink/Stitch und PEmbroider stehen unter GPL; von dort sind nur die
Verfahren übernommen und neu geschrieben, kein Code.

### Vorbereitung (`src/image/`)

1. **Arbeitsauflösung:** 0,1 mm pro Pixel (bei Motiven über 120 mm gröber, höchstens etwa 1200 Pixel),
   Flächenmittel beim Verkleinern, Transparenz bleibt erhalten.
2. **Vereinfachen** (nur Fotos, beim Laden automatisch erkannt: decken die 16 häufigsten Farben unter
   85 % der Pixel ab, ist es ein Foto): bilateraler Filter in CIELAB (Tomasi & Manduchi 1998), getrennt
   nach Zeilen und Spalten und mehrfach angewendet wie in Winnemöller u. a. 2006. Flächen werden glatt,
   Kanten bleiben.
3. **Farbreduktion:** gewichtetes k-Means auf einem Lab-Histogramm, das nach Celebi (*Improving the
   performance of k-means for color quantization*, 2011) bei kleinen Farbzahlen am besten abschneidet
   und kleine, deutliche Flächen (Augen) erhält, wo Median Cut und Wu sie verlieren. Jedes Pixel zählt
   mehr, je stärker es sich von seiner Umgebung abhebt und je bunter es ist. Fast gleiche Farben
   (CIEDE2000 unter 6) werden zusammengelegt, winzige unauffällige (unter 0,4 % der Fläche und keiner
   Farbe ferner als 22) fallen weg.
4. **Garnfarben:** nächstes Garn der Brother-Palette nach CIEDE2000 (Sharma, Wu & Dalal 2005, an deren
   Prüfdaten getestet); Farben, die auf dasselbe Garn fallen, werden eins. Die Farbliste zeigt ≠, wenn
   kein Garn nahe liegt (ΔE über 10).
5. **Änderungen von Hand:** pro Farbe anderes Garn, zusammenlegen, weglassen; Pinselstriche (malen,
   radieren) werden vor und nach dem Aufräumen eingetragen, so dass sie gelten.
6. **Aufräumen:** 3×3-Mehrheitsfilter; Säume der Kantenglättung (höchstens 0,5 mm breit, Farbe zwischen
   den beiden Nachbarn) gehen an die Nachbarn; der Hintergrund (die Farbe von mindestens 60 % des Rands
   und drei Ecken) fällt weg, soweit er mit dem Rand verbunden ist; Flächen unter *Kleinste Fläche* gehen
   in den Nachbarn mit der längsten gemeinsamen Grenze auf (wie im Goldman-Patent US 6,836,695 und bei
   Wilcom).

### Stiche (`src/digitize/`)

Jede zusammenhängende Fläche wird ein Objekt. Statt Konturen nachzuzeichnen, arbeitet alles auf einem
vorzeichenbehafteten Abstandsfeld pro Fläche (exakte Distanztransformation nach Felzenszwalb &
Huttenlocher 2012, leicht geglättet): Seine Nulllinie liegt mittig zwischen Pixeln, also teilen sich
Nachbarflächen dieselbe Grenze. Füllreihen enden dort, Satinkanten werden dort gefunden, die Unterlage
liegt auf einer Höhenlinie innerhalb.

- **Art:** Das Skelett (Ausdünnen in der Reihenfolge des Abstands, Seitenäste kürzer als 1,5 Radien
  beschnitten) liefert die Breiten. Unter 1 mm (Frottee 1,5 mm): Steppstich. Bis *Satin bis Breite*
  (7 mm), gleichmäßig breit (breiteste Stelle innerhalb drei Standardabweichungen, wie im
  Goldman-Patent), lang gegenüber der Breite und mit wenigen Verzweigungen: Satin. Sonst Füllung.
  Erzeugter Satin wird nachgemessen: Liegt irgendwo mehr als das 2,4-fache seiner Solldichte (enge
  Kurven fächern auf) oder bleiben mehr als 5 % der Fläche frei (Säulen, die von einer Mitte
  ausstrahlen), wird gefüllt.
- **Füllung (Tatami):** Reihen auf einem Raster, das am Ursprung des Motivs ausgerichtet ist, Einstiche
  versetzt um je ein Viertel der Stichlänge (4 mm) wie Ink/Stitch, so dass Nachbarflächen nahtlos
  anschließen. Die Reihen werden in Abschnitte zerlegt, die sich in einem Zug hin und her sticken lassen
  (Boustrophedon-Zerlegung, Choset 2000). Ohne festen Winkel nimmt jede Fläche von 16 Winkeln den mit
  den wenigsten Abschnitten (Goldman-Patent), möglichst 30° anders als berührende Flächen. Unterlage:
  Reihen um 90° gedreht, dreifacher Abstand, 0,4 mm innerhalb der Kante. Zwischen Abschnitten läuft der
  Faden auf dem kürzesten Weg innen unter noch nicht gestickten Reihen (wie Ink/Stitchs Underpath); läge
  er dabei mehr als 2 mm auf schon gestickten Reihen, springt er stattdessen.
- **Satin:** Die Kanten werden von der Mittellinie aus senkrecht bis zum Rand gemessen (die
  „Stroke-Normalen“ des Goldman-Patents). Abstand 0,4 mm zwischen Einstichen derselben Seite, gemessen an
  der Seite, die weiter vorrückt; auf der Innenseite von Kurven rückt jeder zu nahe Einstich (unter
  0,25 mm) 15 % der Breite nach innen, Zugausgleich nach Stoff (Webware 0,2 mm, Strick 0,35, Frottee 0,4
  pro Seite), Stiche über 7 mm werden geteilt. Ein Netz aus Säulen wird in einem Zug gestickt: jeder Ast
  hin als Unterlage (Mittelnaht, ab 4 mm Breite Zickzack) und zurück als Satin, wie Ink/Stitchs
  Auto-Satin. An Knoten deckt die erste Säule ab, die anderen reichen 0,3 mm hinein.
- **Reihenfolge:** Farben nach Fläche, die größte zuerst; in einer Farbe Füllungen vor Satin und Linien,
  jeweils das nächste Objekt. Objekte, die früher gestickt werden, reichen 0,2 mm unter spätere
  Nachbarn. Bis 1 mm Abstand ein Stich, bis 3 mm ein Sprung, darüber Vernähen (0, 0,5, 1, 0,5, 0 mm
  entlang des Fadens), Schnitt, Sprung und Anfangsvernähen; ebenso bei Farbwechseln.
- **Standardwerte** nach Material (`digitizeDefaults`): Abstand aus der Empfehlung des Profils
  (Webware 40 wt 0,40 mm zwischen benachbarten Reihen, wie in der Beispielkatze gemessen), Zugausgleich
  nach Stoff (Wilcom-Tabelle). Im Panel *Stiche* lässt sich alles überschreiben.

### Lebendiges Garn

In der realistischen Fadenansicht folgt das Licht dem Mauszeiger oder der Neigung des Handys
(`src/render/light.ts`; auf iPhones nach einmaliger Erlaubnis). Garn glänzt quer zu seinen Fasern, also
leuchten Satinsäulen und Füllreihen je nach Stichrichtung auf oder werden dunkel, wie beim Drehen eines
gestickten Aufnähers in der Hand; die Schatten wandern mit. Beim ersten umgewandelten Bild schaltet der
Modus Bild die realistische Ansicht ein und lässt das Licht einmal um das Motiv laufen, bei jedem neuen
Bild läuft es wieder (nicht bei *Bewegung reduzieren*). *✦ Wie gestickt* auf der Leinwand zeigt es jederzeit.
Eine Recherche bei Wilcom, Hatch, PE-Design, Embird, Ink/Stitch, mySewnet und Online-Konvertern fand nur
feste Lichteinstellungen in Dialogen; Licht, das man mit Maus oder Neigung bewegt, bietet keines davon.
Die Einstellung *Licht folgt Maus und Neigung* unter *Anzeige* gilt in allen Modi.

Die erzeugten Stiche laufen durch dieselbe Prüfung wie geladene Dateien. *Als Stickdatei übernehmen*
legt sie als PES in die Dateiliste. Zum Vergleich auf Webware mit 40 wt: Das Foto einer Katze (80 × 107 mm,
5 Farben, 62 Objekte) ergibt 16 Vorsicht- und 3 kritische Zonen und 131 Fadenschnitte bei 16 400 Stichen,
die professionell digitalisierte Beispielkatze 15 und 2 Zonen (höchstens 9,9 mm/mm²) und 89 Schnitte bei
9 200 Stichen. Die Befunde liegen meist
dort, wo Satin den Rand einer Füllung überlappt; die Korrektur im Modus Dichte kann sie danach angehen.

**Grenzen:** Fotos werden flächig (posterisiert) gestickt, nicht schattiert wie bei Photo-Stitch-
Verfahren mit veränderlicher Dichte. Breite Formen mit schmalen Armen werden ganz gefüllt, nicht in
Füllung und Satin zerlegt. Die Farbliste kennt nur die Brother-Palette.

## Entwicklung

```sh
npm install
npm run dev       # Dev-Server
npm test          # Unit-Tests (Vitest)
npm run build     # Typecheck + Produktionsbuild nach dist/
npm run preview   # Build lokal ansehen: http://localhost:4173/heatstitch/
```

Die Tests erzeugen ihre DST/PES-Fixtures synthetisch (`tests/helpers/encode.ts`) und prüfen u.a.,
dass die Summe des Rasters exakt der Gesamtgarnlänge bzw. Stichzahl entspricht.

## Beispieldateien

`public/examples/` enthält echte Stickdateien zum Ausprobieren, z. B. `cat-60mm.pes` (Katze, 60 mm, PES v6).
Der Knopf "Beispiel laden" unter dem Dateifeld lädt sie direkt in die App. `image-example.svg` ist das
Beispielbild des Modus Bild (Füllflächen, Satinbreiten, feine Linien).

`public/examples/demos/` enthält kleine synthetische Demos für die Anleitung, jede mit einem Befund:
`overlap.pes` (gestapelte Füllungen), `letters.pes` (Füllung unter Satin), `sun.dst` (Kurzstiche auf
Strick), `leather-patch.dst` (Perforation auf Leder) und `confetti.pes` (lange Sprünge ohne Schnitt,
kurze mit Schnitt). Sie entstehen mit den App-eigenen Writern aus
`tests/helpers/demos.ts`; `tests/demos.test.ts` prüft, dass sie aktuell sind und den beschriebenen
Befund zeigen. Nach Änderungen an Designs oder Writern: `UPDATE_DEMOS=1 npm test`. Die Bilder der
Anleitung liegen in `public/guide/` und werden nicht vorab gecacht.

## Deployment

`.github/workflows/deploy.yml` testet und baut jeden Push; Pushes auf `main` werden auf
GitHub Pages veröffentlicht. Einmalig nötig: *Settings → Pages → Source: GitHub Actions*.

## Hinweise zu den Formaten

- **DST** kennt keinen expliziten Fadenschnitt. Wie bei pyembroidery gilt eine Folge von
  mindestens 3 Sprüngen als Schnitt (`DST_TRIM_JUMP_COUNT` in `src/parsers/dst.ts`). DST enthält
  außerdem keine Garnfarben; die Farbblöcke bekommen Ersatzfarben.
- **PES**: Farben kommen aus der PEC-Palette. Die RGB-Garnlisten neuerer PES-Versionen werden noch nicht gelesen.
- Die Validierungsschwellen sind aus Digitalisier-Richtwerten hergeleitet und an synthetischen Aufbauten kalibriert; ein Abgleich mit echten Probestickungen steht noch aus.

## Aufbau

```
src/parsers/   DST- und PES-Parser, PEC-Palette
src/model/     Pattern-Datenmodell, Garnsegmente, Statistik, Bearbeitungsfunktionen,
               Ablauf (Farbblöcke, Sticharten, Sprünge, Marker), Sprünge schneiden/mitziehen
src/density/   Dichteraster, Gauss-Blur, Web Worker
src/validation/  Messung, Profile, Stufen, Satin-Erkennung, Kurzstich- und Perforationsregel, Zonen
src/correct/   Automatische Korrektur: Rückzug unter Kanten, Satin-Kurzstiche, Neuverteilen, Ausdünnen, Einstiche trennen
src/writers/   DST- und PES-Writer (PEC-Block, Vorschaubilder)
src/image/     Bildvorbereitung: Farbräume, CIEDE2000, Filter, Farbreduktion, Distanztransformation, Aufräumen
src/digitize/  Stiche aus Bildern: Abstandsfelder, Skelett, Füllung, Satin, Steppstich, Reihenfolge, Worker
src/render/    Viewport, Farbskala, Heatmap, Stichplan, Legende, Ablauf-Darstellung (Färbung, Marker, Nadel)
src/ui/        Dateiliste, Validierung, Korrektur-Panel, Stich-Editor, Controls, Statistik, Tooltip, Export,
               Farben-Liste, Sprung-Liste, Player, Modus Bild, Garnfarben-Auswahl
src/i18n/      Übersetzungen DE/EN
public/examples/  Beispiel-Stickdateien (per Knopf ladbar)
docs.html      Kurzanleitung DE/EN (src/docs.ts, src/docs.css)
public/og-image.jpg, robots.txt, sitemap.xml  Vorschaubild für Social Media, Crawler
```
