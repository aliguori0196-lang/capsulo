# Capsulo — Contesto progetto per Claude Code

## Cos'è Capsulo
PWA (Progressive Web App) per la gestione dell'inventario capsule Nespresso.
Supporta macchine **Original** e **Vertuo**. Multi-utente, mobile-first.

- **Live:** https://capsulo-eight.vercel.app
- **Repo:** https://github.com/aliguori0196-lang/capsulo
- **Versione corrente:** v0.3.4

---

## Stack tecnico

| Layer | Tecnologia |
|---|---|
| Frontend | Single-file `index.html` (HTML + CSS + JS inline) |
| Hosting | Vercel (auto-deploy da GitHub push) |
| Auth & DB | Supabase |
| PWA | Service Worker + `manifest.json` + `version.json` |

### File principali
```
/
├── index.html          # Tutta l'app (HTML + CSS + JS)
├── manifest.json       # PWA manifest
├── service-worker.js   # Cache e offline support
├── version.json        # { "version": "0.3.4" } — usato per auto-reload
├── icon-192.png        # Icona PWA
└── icon-512.png        # Icona PWA
```

---

## Database Supabase

### Tabelle
- **`capsules`** — inventario capsule per utente
- **`profiles`** — profili utente

RLS (Row Level Security) **attivo** su entrambe le tabelle.

### Auth
- Autenticazione via Supabase Auth
- Refresh token salvato in `localStorage` per re-auth silenzioso
- ⚠️ Se i dati sembrano spariti, è quasi sempre un token scaduto — NON un problema di dati. La fix è nel refresh token flow già implementato.

---

## Deployment workflow
1. Modifica `index.html` (e altri file se necessario)
2. Push su GitHub → Vercel auto-deploys in ~30 secondi
3. Nessuna build step — è tutto statico

---

## Versioning schema
- Fix minori: incrementa terza cifra → `0.3.4` → `0.3.5` → ... → `0.3.10`
- Feature significative: `0.3.x` → `0.4.0`
- Release stabile: `1.0.0` (solo su richiesta esplicita)

### Aggiornare la versione (3 posti in sync):
1. `index.html` → meta tag `appVersion`
2. `index.html` → costante JS `APP_VERSION`
3. `version.json` → campo `"version"`
4. `service-worker.js` → nome della cache (es. `capsulo-v0.3.5`)

---

## ✅ Quality checklist OBBLIGATORIA prima di ogni consegna

Eseguire **sempre** questi 5 step prima di consegnare qualsiasi versione:

1. **Syntax check JS**
   ```bash
   node --check index.html
   ```

2. **Verifica 24 DOM ID critici** — controllare che tutti esistano nell'HTML:
   `app`, `login-section`, `main-section`, `user-email`, `logout-btn`,
   `tab-inventario`, `tab-analytics`, `tab-lista`, `tab-ricette`, `tab-impostazioni`,
   `inventario-section`, `analytics-section`, `lista-section`, `ricette-section`,
   `impostazioni-section`, `capsule-select`, `quantity-input`, `expiry-input`,
   `add-btn`, `inventory-table`, `scarcity-list`, `shopping-list`,
   `recipe-list`, `version-display`

3. **Verifica funzioni render** — tutte le funzioni chiamate in `render()` devono essere definite

4. **Versione consistente** — `appVersion` HTML == `APP_VERSION` JS == `version.json`

5. **Service worker cache bumped** — il nome della cache in `service-worker.js` deve corrispondere alla nuova versione

> ⚠️ Questi check sono stati introdotti dopo regressioni reali. Non saltarli mai.

---

## Features implementate (v0.3.4)

### UX/Navigazione
- Bottom navigation bar mobile con icone SVG hand-drawn (casa, scatola 3D, carrello, tazzina, ingranaggio)
- Icone in tema light e dark mode
- Tab: Inventario, Analytics, Lista spesa, Ricette, Impostazioni

### Inventario
- Input capsule con **autocomplete searchable** (arrow-key navigation)
- Ordinamento per scadenza, poi per quantità
- Colonna consumo settimanale **rimossa**
- Tab "Scorte in scadenza" (simile a scorte in esaurimento)
- Tab "Proiezione" **rimossa**

### Analytics
- Chart scorte in esaurimento
- Chart scorte in scadenza
- Distribuzione per gusto **rimossa**

### Lista spesa
- Link shop permanenti visibili: "Shop Originale" e "Shop Vertuo"

### Ricette
- ~202 ricette in 17 categorie
- Ogni ricetta ha `capsulesOriginal` e `capsulesVertuo`
- Filtri per categoria — aprono direttamente senza accordion secondario
- `RECIPE_CATEGORY_MAP` completo

### Capsule intensità
Valori intensità ufficiali Nespresso corretti, es:
- Toccanto = 5, Kazaar = 12, Napoli = 13, Diavolitto = 11

### PWA
- Auto version-check via `version.json` con silent reload se nuova versione disponibile
- Service Worker per cache offline
- Manifest completo

### Auth
- Refresh token in localStorage per re-auth silenzioso (evita logout forzato su token scaduto)

---

## Work in progress / prossimi step pianificati

- **Splash screen kawaii** con mascotte animata (bounce + steam + heartbeat)
  - SVG mascotte fornita da Antonio (coordinate system: scale 0.1,-0.1, coords fino a x=4085)
  - Background scuro `#3A2119`
  - Da integrare direttamente nel codice app (il preview widget aveva problemi di scale)
- **Parallel auth flow** — ottimizzazione caricamento (target: ridurre 5-6s a ~2s su desktop)
  - Pianificato per v0.3.5

---

## Note importanti

- Il progetto è un **single HTML file** — tutto CSS e JS è inline in `index.html`
- Non usare framework o build tools — rimane statico puro
- L'utente (Antonio) fa deploy manualmente via push GitHub
- Dark mode e light mode entrambi supportati via CSS variables
- Il DB Supabase **non si tocca** durante i deploy — i dati sono sempre al sicuro
