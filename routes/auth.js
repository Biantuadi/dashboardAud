/**
 * Routes d'authentification
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Page de connexion
router.get('/', authController.getLoginPage);

// Traitement de la connexion
router.post('/login', authController.login);

// Déconnexion
router.get('/logout', authController.logout);

module.exports = router;
