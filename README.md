# Sito Enza Deuscit

Sito statico in Jekyll, pubblicato da Netlify. Le pagine storiche restano agli stessi indirizzi (`/`, `/chi-sono.html`, `/attivita.html`, `/contatti.html`); gli articoli sono nella nuova sezione `/riflessioni/` e si creano da `/admin/`.

## Avvio locale

1. Installa Ruby (versione 3.1 o successiva) e Bundler, se non sono già disponibili. Su Ubuntu/Debian: `sudo apt install ruby-dev build-essential` (oppure `ruby3.2-dev` se è quella la versione installata).
2. Dalla cartella del progetto: `bundle install`. Le gemme vengono salvate localmente in `vendor/bundle`, quindi non serve `sudo`.
3. Avvia il sito con: `bundle exec jekyll serve`
4. Apri `http://localhost:4000`.

Jekyll rigenera il sito quando salvi un file. Gli articoli sono file Markdown in `_riflessioni/`; non modificare la cartella `_site/`, perché è solo l'output di compilazione.

## Netlify e Decap CMS

1. Collega su Netlify questo repository GitHub e imposta **Build command**: `bundle exec jekyll build` e **Publish directory**: `_site`. Sono già definiti anche in `netlify.toml`.
2. Crea una GitHub OAuth App (GitHub → **Settings → Developer settings → OAuth Apps**). Come **Homepage URL** usa il dominio del sito e come **Authorization callback URL** usa `https://api.netlify.com/auth/done`.
3. In Netlify apri le impostazioni dell'account/team → **Authentication providers**, aggiungi GitHub e inserisci Client ID e Client Secret dell'OAuth App. Questo è il piccolo passaggio server necessario al login GitHub di Decap.
4. In GitHub, repository → **Settings → Collaborators**, invita l'account GitHub della cliente con permesso di scrittura. Accetta l'invito prima di provare il CMS.
5. La cliente apre `https://TUO-DOMINIO/admin/`, sceglie GitHub, autorizza l'app e crea una voce in **Riflessioni**. Salvando, Decap crea un commit su GitHub a suo nome; Netlify ricompila e pubblica il contenuto.

Non servono Netlify Identity né Git Gateway: l'accesso è direttamente legato a GitHub e il permesso di collaborator può essere revocato in qualunque momento. Non condividere il tuo account Netlify.

## Dominio

Quando il trasferimento è pronto, aggiungi il dominio in **Netlify → Domain management** e imposta presso Aruba i record DNS mostrati da Netlify. Mantieni il dominio precedente attivo finché Netlify non segnala la configurazione come verificata e HTTPS non è stato emesso.
