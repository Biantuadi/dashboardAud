/**
 * Application principale du dashboard Les Audacieuses
 * Point d'entrée pour l'application Express
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');

// Connexion à la base de données MySQL
const { connectDB, pool } = require('./config/database');
// Initialisation de la connexion
connectDB().then(() => {
  console.log('Base de données MySQL connectée!');
}).catch(err => {
  console.error('Erreur de connexion à la base de données:', err);
});

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 8080;

// Configuration des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(morgan('dev')); // Journalisation des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'votre_secret_tres_securise'));
app.use(express.static(path.join(__dirname, 'public')));

// cors
app.use(cors());

// Middleware pour ajouter les variables utiles à toutes les vues
app.use((req, res, next) => {
  // Vérifier si l'utilisateur est connecté via le cookie
  if (req.cookies.user) {
    try {
      const user = JSON.parse(req.cookies.user);
      res.locals.user = user;
      res.locals.userName = `${user.firstname} ${user.lastname}`;
    } catch (error) {
      console.error('Erreur lors du parsing du cookie utilisateur:', error);
      res.clearCookie('user');
    }
  } else {
    res.locals.user = null;
    res.locals.userName = null;
  }
  next();
});

// Import des contrôleurs
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');

// Import des routes
const dashboardRoutes = require('./routes/dashboard');
const moduleRoutes = require('./routes/modules');
const patientRoutes = require('./routes/patients');
const apiModuleRoutes = require('./routes/api/modules');
const apiPatientRoutes = require('./routes/api/patients');

// Route par défaut - redirection intelligente
app.get('/', (req, res) => {
  if (req.cookies.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Routes d'authentification
app.get('/login', authController.getLoginPage);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Routes protégées
app.use('/dashboard', authController.requireAuth, dashboardRoutes);
app.use('/modules', authController.requireAuth, moduleRoutes);
app.use('/patients', authController.requireAuth, patientRoutes);
app.use('/api/modules', authController.requireAuth, apiModuleRoutes);
app.use('/api/patients', authController.requireAuth, apiPatientRoutes);

// Route de test pour Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Gestion des erreurs - 404
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: 'Page non trouvée',
    message: 'La page que vous recherchez n\'existe pas',
    error: { status: 404 }
  });
});

// Gestion des erreurs - 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render('error', {
    title: 'Erreur',
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Démarrage du serveur uniquement si nous ne sommes pas sur Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Le serveur est démarré sur le port ${PORT}`);
  });
}

module.exports = app;