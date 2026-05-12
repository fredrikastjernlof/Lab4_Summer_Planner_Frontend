#  📌Laboration 4 – Webbplats med inloggningssystem 

## 🧾 Beskrivning

Detta repository innehåller frontend-delen (del 2) av Laboration 4 i kursen Backend-baserad webbutveckling.

Projektet är uppbyggt som en somrig planner-applikation där användare kan registrera konto, logga in och planera sina veckor genom personliga events och todos.

Applikationen kommunicerar med en separat backend-webbtjänst via Fetch API och använder JWT-token för att hantera autentisering och skyddade resurser.

---

## 🎯 Syfte

Syftet med uppgiften är att:

- Kunna konsumera en extern webbtjänst med Fetch API
- Kunna skapa formulär för registrering och inloggning
- Kunna hantera JWT-token i frontend
- Kunna skydda sidor och funktionalitet för obehöriga användare
- Kunna skapa dynamiskt innehåll med JavaScript
- Kunna arbeta med användarvänlig validering och feedback i gränssnittet

---

## 🛠️ Tekniker

Projektet är byggt med:

- HTML
- SCSS
- Vanilla JavaScript
- Fetch API
- JWT
- Vite

---

## ✨ Funktionalitet

### Autentisering
- Registrera användarkonto
- Logga in användare
- Hantera JWT-token via sessionStorage
- Skydda dashboard för ej inloggade användare
- Logga ut användare
- Ta bort användarkonto

### Events
- Skapa events
- Uppdatera events
- Ta bort events
- Visa events i veckovy
- Navigera mellan veckor
- Hoppa tillbaka till aktuell vecka
- Stöd för events över flera dagar
- Scrolla automatiskt till nytt eller uppdaterat event

### ToDos
- Skapa todos
- Markera todos som klara
- Ta bort todos
- Sortera todos efter status

---

## ✅ Validering

Applikationen innehåller egen validering för att skapa tydligare feedback till användaren.

Exempel på funktionalitet:

- Tydliga felmeddelanden vid felaktig input
- Visuell felmarkering på formulärfält
- Validering av datum och tider
- Kontroll av tomma todo-fält
- Kontroll att lösenord matchar vid registrering
- Loading-overlay vid inloggning
- Dynamisk uppdatering av formulär och veckovy

---

## 🔐 Autentisering

Vid lyckad inloggning sparas JWT-token i `sessionStorage`.

Tokenen används sedan automatiskt vid anrop till skyddade endpoints via Authorization-headern:

```txt
Authorization: Bearer TOKEN
```

Om användaren saknar giltig token skickas användaren tillbaka till startsidan.

---

## 🌐 Koppling till backend

Frontend-applikationen använder webbtjänsten från del 1 av laborationen.

Backend repository:

[Öppna backend repository](https://github.com/fredrikastjernlof/Lab4_Summer_Planner_Backend)

---

## 🚀 Installation & körning

1. Klona repositoryt

```bash
git clone https://github.com/fredrikastjernlof/Lab4_Summer_Planner_Frontend.git
```
2. Installera dependencies

```bash
npm install
```

3. Starta utvecklingsservern

```bash
npm run dev
```

4. Bygg projektet:

```bash
npm run build
```

5. Förhandsgranska byggd version:

```bash
npm run preview
```
---

## 🌐 Publicering

Webbplatsen är publicerad via Netlify:

[Öppna webbplats](https://lab4-summer-planner.netlify.app/)

---

## 🙌 Det här tar jag med mig från uppgiften

- Hur mycket lättare det blir att arbeta vidare i ett projekt när man delar upp koden i mindre filer och funktioner tidigt
- Det har varit väldigt kul och lärorikt att bygga upp applikationen steg för steg och successivt förbättra både struktur och användarupplevelse under projektets gång.
- Autentisering och tokens kändes väldigt rörigt i början, men blev mycket tydligare när frontend och backend började prata med varandra på riktigt
- Att felsökning faktiskt lär en väldigt mycket, även om det ibland varit frustrerande när små saker fått hela applikationen att sluta fungera 😅