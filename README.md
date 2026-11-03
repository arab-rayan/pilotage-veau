# Pilotage Veau

Application de pilotage du projet SI de la Mairie de Veau (BTS SIO SISR) : tâches et planning, schéma réseau type Packet Tracer, documents Google Drive, décisions, feuille de route et révision de l'oral.

## Mettre en ligne avec GitHub Pages

1. Crée un dépôt (ex. `pilotage-veau`) et dépose tous ces fichiers à la racine.
2. Dans le dépôt : **Settings › Pages › Build and deployment › Source : Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
3. Après 1 à 2 minutes, le site est en ligne à `https://<ton-pseudo>.github.io/pilotage-veau/`.

## Important : où sont enregistrées les données

Sur GitHub Pages, il n'y a pas de base de données partagée : chaque navigateur garde **sa propre copie** des données (au départ, celles de `seed.json`).
Les modifications d'un membre **ne sont pas visibles** par les autres.

- Pour travailler à plusieurs en direct, utilisez la version hébergée sur claude.ai (bouton Partager, rôle Éditeur).
- Pour transmettre ses données : rubrique **Équipe › Télécharger une sauvegarde**.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'entrée |
| `styles.css` | Apparence |
| `data.js` | Exigences du CDC, feuille de route, questions de révision, catalogue d'équipements |
| `icons.js` | Illustrations des équipements |
| `core.js` | Données, identité, notifications, navigation |
| `views.js` | Accueil, tâches, documents, projet, feuille de route, révision, équipe |
| `infra.js` | Topologie, plan, vue 3D, baie, tableaux, exports PDF/PNG/SVG |
| `seed.json` | Données de départ (bibliothèque, tâches, décisions, documents) |
