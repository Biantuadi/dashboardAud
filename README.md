# Dashboard Les Audacieuses

Dashboard administratif pour l'accompagnement des femmes et mamans en reconversion professionnelle.

## Caractéristiques

- Interface administrateur pour un psychologue
- Gestion des modules de formation (thumbnails, contenu dynamiques)
- Gestion des patientes (profil, avatar, assignation de modules)
- Éditeur de contenu dynamique (blocs de type titre, texte, liste, image)
- Suivi de la progression et gestion des rendez-vous

## Prérequis

- Node.js v14+
- npm
- MySQL v5.7+ ou MariaDB

## Installation

1. Cloner le dépôt :
   ```
   git clone <URL_DU_REPO>
   cd dashboardAud
   ```

2. Installer les dépendances :
   ```
   npm install
   ```

3. Créer un fichier `.env` à la racine avec :
   ```
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=votre-secret-ici
   DB_HOST=localhost
   DB_USER=votre_user
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=audacieuses
   MAX_FILE_SIZE=5242880  # 5 Mo
   ```

4. Initialiser la base de données MySQL :
   ```
   node init-database.js
   ```

5. Démarrer l’application en mode développement :
   ```
   npm run dev
   ```

6. Accéder à l’application :
   ```
   http://localhost:3000
   ```

## Structure du projet

- `app.js` : point d'entrée de l'application
- `config/` : configurations (BDD, upload, etc.)
- `controllers/` : logique métier
- `models/` : accès aux données MySQL
- `routes/` : définition des routes Express
- `views/` : templates EJS
- `public/` : fichiers statiques (CSS, JS, images, uploads)
- `sql/` : script de création de schéma et de seed

## Utilisation

### Connexion

- Identifiant par défaut : `admin@lesaudacieuses.fr`
- Mot de passe : `admin123`

### Modules

- Créer / Modifier / Supprimer des modules
- Ajouter un thumbnail et du contenu bloc par bloc
- Visualiser les détails d’un module

### Patientes

- Créer / Modifier / Supprimer des patientes
- Charger un avatar
- Assigner des modules et suivre la progression
- Planifier des rendez-vous

## API REST

En complément des vues EJS, le serveur expose désormais une API REST en JSON :

- **GET** `/api/modules` : récupère la liste de tous les modules
- **GET** `/api/modules/:id` : récupère les détails d’un module par son `id`
- **GET** `/api/patients` : récupère la liste de toutes les patientes
- **GET** `/api/patients/:id` : récupère les détails d’une patiente par son `id`

Exemple d’appel côté client JavaScript :
```js
fetch('/api/modules/1')
  .then(res => res.json())
  .then(({ success, data }) => {
    if (success) {
      console.log('Module', data);
    }
  });
```

Ces endpoints permettent à une application front-end externe ou mobile de consommer les données sans passer par le rendu EJS du serveur.

## Technologies utilisées

- Node.js & Express
- MySQL via `mysql2/promise`
- EJS (templates)
- Multer (upload d’images)
- express-session (sessions)
- bcrypt (hash de mots de passe)

## Auteur

Les Audacieuses

## Licence

ISC
