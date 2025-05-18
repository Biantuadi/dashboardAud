/**
 * Application principale du dashboard Les Audacieuses
 * Point d'entrée pour l'application Express
 */

const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

// Connexion à la base de données MySQL
const { connectDB } = require('./config/database');
// Initialisation de la connexion
connectDB().then(() => {
  console.log('Base de données MySQL connectée!');
}).catch(err => {
  console.error('Erreur de connexion à la base de données:', err);
});

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(morgan('dev')); // Journalisation des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET || 'les-audacieuses-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 heure
}));

// Middleware pour ajouter les variables utiles à toutes les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.userName = req.session.user ? `${req.session.user.firstname} ${req.session.user.lastname}` : null;
  next();
});

// Routes principales
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const moduleRoutes = require('./routes/modules');
const patientRoutes = require('./routes/patients');

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/modules', moduleRoutes);
app.use('/patients', patientRoutes);

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

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
});

module.exports = app;