# Valoris Community — GitHub Only

Questa è la versione **solo GitHub Pages + GitHub Actions** del sito Valoris.
Mantiene il frontend/PWA e i contenuti dinamici principali senza Netlify o Cloudflare.

## Importante: cosa può fare GitHub-only

GitHub Pages può servire il sito statico. GitHub Actions aggiorna automaticamente i file dati del sito.

Sono inclusi:
- PWA Android/iOS
- modalità offline
- aggiornamento versione PWA
- membri Discord reali (sincronizzati ogni 15 minuti via GitHub Actions)
- storico crescita membri
- traguardi
- eventi
- news
- area Gestione con workflow GitHub
- Vota / Discord / social

### Cosa NON può fare una pagina GitHub Pages da sola

GitHub Pages non esegue un backend server persistente. Per questo il vecchio pannello con login server-side e salvataggio immediato dal browser non può esistere in modo sicuro su GitHub-only.

Nella versione GitHub-only la gestione passa invece da **GitHub Actions**. Il browser non contiene token Discord o credenziali GitHub.

## 1. Crea il repository

Crea un repository GitHub pubblico e carica **tutto il contenuto della cartella** nella root.

## 2. Attiva GitHub Pages

Repository → Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Il workflow `.github/workflows/pages.yml` pubblicherà automaticamente `public/`.

## 3. Configura il bot Discord

Repository → Settings → Secrets and variables → Actions → New repository secret:

- `DISCORD_BOT_TOKEN`
- `DISCORD_GUILD_ID` = `1546956761997643897`

Nel Discord Developer Portal lascia attivo **Server Members Intent**.

Il workflow `sync-discord.yml` esegue una sincronizzazione ogni 15 minuti e aggiorna:

- `data/discord.json`
- `data/member-history.json`
- `public/version.json`

## 4. Gestione eventi e news

Apri:

`https://github.com/OWNER/REPO/actions/workflows/manage-content.yml`

Da lì usa **Run workflow**.

Il pannello `/admin.html` del sito contiene collegamenti a questa gestione.

Per comodità modifica `data/config.json` sostituendo `OWNER/REPO` con il tuo repository.

## 5. Aggiornamenti del sito

Ogni push su `main` esegue il deploy GitHub Pages.

Le modifiche ai dati generate dai workflow producono automaticamente un nuovo commit e quindi un nuovo deploy.

## 6. Dominio personalizzato

Su GitHub Pages puoi aggiungere un dominio personalizzato in Settings → Pages → Custom domain. Se usi un dominio, puoi aggiungere `CNAME` nella root del repository.

## 7. Limiti importanti

GitHub Pages è ottimo per il frontend statico, ma non sostituisce un backend server. Se in futuro vuoi un pannello proprietario con login server-side, salvataggio immediato, storage privato o API in tempo reale direttamente dal browser, servirà un backend esterno.
