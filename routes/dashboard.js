/**
 * Routes du dashboard
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');

// Protection de toutes les routes du dashboard
router.use(authController.requireAuth);

// Page d'accueil du dashboard
router.get('/', dashboardController.getDashboard);

module.exports = router;
