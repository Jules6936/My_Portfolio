# Portfolio de Sozehoue Kocou Jules

HTML5, CSS3, Tailwind CSS (mise en page), JavaScript vanilla. Aucune autre dépendance.
Mode clair/sombre, carrousels 3D (Services et Projets), menu mobile 3D, formulaire vers WhatsApp.

## Lancer en local
Ouvrez `index.html` dans le navigateur, ou servez le dossier :
```
cd portfolio
python3 -m http.server 8000     # puis http://localhost:8000
```
Le design repose sur `css/style.css` : le site fonctionne sans connexion hors polices Google Fonts. Le CDN Tailwind a été retiré, car aucune classe Tailwind n'est utilisée pour l'instant et il pouvait créer des conflits de style.

## Tailwind en production (recommandé)
```
npm init -y && npm i -D tailwindcss@3
npx tailwindcss init
```
Dans `tailwind.config.js` : `content: ["./index.html","./js/**/*.js"]`. Créez `css/input.css` avec
`@tailwind base; @tailwind components; @tailwind utilities;`, puis :
```
npx tailwindcss -i css/input.css -o css/tailwind.css --minify
```
Dans `index.html`, ajoutez `<link rel="stylesheet" href="css/tailwind.css">` avant `css/style.css`, puis utilisez des classes Tailwind dans le HTML si vous le souhaitez.

## Publier en ligne
Déposez le dossier tel quel sur Netlify (glisser-déposer), Vercel, GitHub Pages ou Cloudflare Pages.
Une fois le domaine connu, activez la balise `canonical` dans `index.html`.

## À personnaliser
- `js/script.js` (bloc CONFIG) : numéro WhatsApp du formulaire, e-mail de destination (`julessozehoue223@gmail.com`), `formEndpoint` (optionnel : URL Formspree pour envoyer l'e-mail sans ouvrir la messagerie), numéros affichés, URL Facebook et LinkedIn (vides pour l'instant : les boutons sont désactivés), URL Instagram (construite à partir de @code_crafter2.0, à vérifier).
- **Votre photo** : placez-la dans `assets/images/` sous le nom `profil.jpg` (ou `.jpeg`, `.png`, `.webp`). Elle s'affiche dans l'accueil.
- `assets/images/` : `profil.jpg`, `chatbot-whatsapp.jpg`, `digitgpl.jpg`, `otyche.jpg`, `dizonli.jpg` (captures authentiques). Tant qu'une image est absente, un emplacement s'affiche.
- Projets : technologies et description détaillée à ajouter lorsqu'elles sont confirmées ; dupliquez la carte « Autres réalisations » pour ajouter un projet.
- Expérience : dates, postes et responsabilités à ajouter uniquement si vous les confirmez.
- Optionnel : image de partage (Open Graph) et favicon dans `assets/icons/`.

## Contact
Deux formulaires : e-mail (ouvre la messagerie avec le message prérempli, ou envoi direct si `formEndpoint` est renseigné) et WhatsApp (ouvre WhatsApp prérempli). Le visiteur confirme toujours l'envoi lui-même.

## Note WhatsApp
Un site statique ne peut pas envoyer un message à votre insu : le formulaire ouvre WhatsApp avec le texte prérempli et le visiteur appuie sur Envoyer.
