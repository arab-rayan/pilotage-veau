# Pilotage Veau

Application de pilotage du projet SI de la Mairie de Veau (BTS SIO SISR) : tâches et planning, schéma réseau type Packet Tracer, documents Google Drive, décisions, feuille de route et révision de l'oral.

## Mettre en ligne avec GitHub Pages

1. Crée un dépôt (ex. `pilotage-veau`) et dépose tous ces fichiers à la racine.
2. Dans le dépôt : **Settings › Pages › Build and deployment › Source : Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
3. Après 1 à 2 minutes, le site est en ligne à `https://<ton-pseudo>.github.io/pilotage-veau/`.

## Partage en direct entre les membres (Firebase, gratuit, 5 minutes)

Sans configuration, chaque navigateur garde sa propre copie : les autres ne voient pas tes changements.
Pour que tout le monde voie les modifications **en direct** (tâches, prénoms, schéma…), branche une base Firebase :

1. Va sur https://console.firebase.google.com › **Ajouter un projet** (nom : `pilotage-veau`, Google Analytics désactivé).
2. Menu **Créer › Firestore Database › Créer une base de données** : emplacement `europe-west9 (Paris)`, **mode production**.
3. Onglet **Règles** de Firestore, remplace tout par ceci puis **Publier** :
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if true; }
     }
   }
   ```
4. **Paramètres du projet** (roue dentée) › **Vos applications** › icône **</>** › nom `web` › **Enregistrer**. Copie l'objet `firebaseConfig`.
5. Colle-le dans `config.js` à la place de `null`, puis pousse sur GitHub.
6. Au premier lancement, la base se remplit toute seule avec les données de départ. En bas à gauche, l'état passe à « Synchronisé en direct ».

⚠️ Avec ces règles, toute personne qui a le lien du site peut lire et modifier les données. C'est suffisant pour un projet de classe, mais n'y mets rien de confidentiel.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'entrée |
| `styles.css` | Apparence |
| `data.js` | Exigences du CDC, feuille de route, questions de révision, catalogue d'équipements |
| `icons.js` | Illustrations des équipements |
| `config.js` | Configuration Firebase (à remplir pour le partage en direct) |
| `core.js` | Données, identité, notifications, navigation |
| `views.js` | Accueil, tâches, documents, projet, feuille de route, révision, équipe |
| `infra.js` | Topologie, plan, vue 3D, baie, tableaux, exports PDF/PNG/SVG |
| `seed.json` | Données de départ (bibliothèque, tâches, décisions, documents) |
