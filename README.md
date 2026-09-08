# Sito Enza Deuscit

Sito statico in Jekyll pubblicato da GitHub Pages. Le sezioni editoriali sono gestite con Decap CMS:

- **Appunti di psicologia** → file Markdown in `_appunti/`
- **Storie che scaldano il cuore** → file Markdown in `_storie/`

## Avvio locale

1. Installa Ruby 3.1 o successivo e Bundler.
2. Dalla cartella del progetto esegui `bundle install`.
3. Avvia il sito con `bundle exec jekyll serve`.
4. Apri `http://localhost:4000`.

Non modificare `_site/`: è soltanto l’output generato da Jekyll.

## GitHub Pages

Il workflow `.github/workflows/deploy-pages.yml` genera e pubblica il sito a ogni push sul branch `main`.

Nel repository GitHub, una persona con permessi di amministrazione deve attivare una sola volta **Settings → Pages → Source → GitHub Actions**. L’indirizzo iniziale sarà `https://andreacoppari.github.io/enzadeuscit/`.

## Decap CMS

Il repository e il branch usati dal CMS sono configurati in `admin/config.yml`.

La redazione apre `/admin/`, accede con GitHub e sceglie se creare o modificare un **Appunto di psicologia** oppure una **Storia che scalda il cuore**. Le immagini caricate dal CMS vengono salvate in `images/uploads/`.

Per modificare l'ordine delle schede, dal CMS si apre **Ordine Appunti** oppure **Ordine Storie** e si trascinano i titoli nella posizione desiderata. Il campo `order` nei singoli contenuti è solo un ordinamento automatico provvisorio per i contenuti appena creati, prima che vengano aggiunti alla lista centrale.

Il CMS usa il backend GitHub, ma richiede un OAuth proxy per effettuare il login. Netlify ne forniva uno: per usare il CMS sul dominio GitHub Pages occorre configurare un OAuth proxy esterno (ad esempio un Cloudflare Worker) e una GitHub OAuth App. Gli utenti del CMS devono inoltre avere accesso in scrittura al repository.
