# Sito Enza Deuscit

Sito statico in Jekyll pubblicato da Netlify. Le sezioni editoriali sono gestite con Decap CMS:

- **Appunti di psicologia** → file Markdown in `_appunti/`
- **Storie che scaldano il cuore** → file Markdown in `_storie/`

## Avvio locale

1. Installa Ruby 3.1 o successivo e Bundler.
2. Dalla cartella del progetto esegui `bundle install`.
3. Avvia il sito con `bundle exec jekyll serve`.
4. Apri `http://localhost:4000`.

Non modificare `_site/`: è soltanto l’output generato da Jekyll.

## Netlify e Decap CMS

Il repository e il branch usati dal CMS sono configurati in `admin/config.yml`. Netlify usa il comando e la cartella di pubblicazione definiti in `netlify.toml`.

La redazione apre `/admin/`, accede con GitHub e sceglie se creare o modificare un **Appunto di psicologia** oppure una **Storia che scalda il cuore**. Le immagini caricate dal CMS vengono salvate in `images/uploads/`.

Non servono Netlify Identity né Git Gateway: l’accesso dipende dai permessi GitHub sul repository.
