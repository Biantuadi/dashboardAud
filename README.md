# Dashboard Les Audacieuses

Dashboard administratif pour l'accompagnement des femmes et mamans en reconversion professionnelle.

## Caractéristiques

- Interface administrateur pour un psychologue
- Gestion des modules de formation
- Gestion des patientes
- Éditeur de contenu dynamique (style Notion)
- Suivi des progrès des patientes
- Gestion des rendez-vous

## Prérequis

- Node.js v14+ et npm
- MongoDB v4+
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)

## État actuel du projet

Cette version du dashboard utilise des données mockées (données de test codées en dur) au lieu d'une base de données MongoDB réelle. Les fonctionnalités de création, modification et suppression sont simulées (les formulaires fonctionnent, mais les données ne sont pas réellement sauvegardées).

### Accès au dashboard de démonstration

Utilisez les identifiants suivants pour accéder au dashboard:
- Email: `admin@lesaudacieuses.fr`
- Mot de passe: `admin123`

### Pour une version avec base de données

Pour utiliser le projet avec une vraie base de données MongoDB:
1. Installez MongoDB sur votre système ou utilisez un service hébergé
2. Décommentez la connexion à la base de données dans `app.js`
3. Exécutez le script d'initialisation pour créer l'utilisateur administrateur: `npm run init`

## Installation

1. Clonez le dépôt :
   ```
   git clone <URL_DU_REPO>
   cd dashboard
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Créez un fichier `.env` à la racine du projet avec les paramètres suivants :
   ```
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=votre-secret-ici
   MONGODB_URI=mongodb://localhost:27017/les-audacieuses
   UPLOAD_DIR=./public/uploads
   MAX_FILE_SIZE=5242880
   ADMIN_EMAIL=admin@lesaudacieuses.fr
   ```

4. Initialisez la base de données avec l'utilisateur administrateur :
   ```
   npm run init
   ```

5. Démarrez l'application :
   ```
   npm run dev
   ```

6. Accédez à l'application dans votre navigateur :
   ```
   http://localhost:3000
   ```

## Utilisation

### Connexion

- Utilisez les identifiants par défaut pour vous connecter :
  - Email : `admin@lesaudacieuses.fr`
  - Mot de passe : `admin123`

### Modules

- Consultez la liste des modules
- Ajoutez de nouveaux modules avec l'éditeur de contenu
- Modifiez les modules existants
- Attribuez des modules aux patientes

### Patientes

- Consultez la liste des patientes
- Ajoutez de nouvelles patientes
- Suivez les progrès des patientes
- Gérez les rendez-vous

## Architecture du projet

- `app.js` : Point d'entrée de l'application
- `config/` : Fichiers de configuration
- `controllers/` : Contrôleurs de l'application
- `models/` : Modèles de données
- `public/` : Fichiers statiques (CSS, JS, images)
- `routes/` : Routes de l'application
- `views/` : Templates EJS

## Technologies utilisées

- Node.js et Express
- MongoDB et Mongoose
- EJS (Embedded JavaScript Templates)
- Multer pour la gestion des fichiers
- bcrypt pour le hachage des mots de passe
- express-session pour la gestion des sessions

## Auteur

- Les Audacieuses

## Licence

ISC
