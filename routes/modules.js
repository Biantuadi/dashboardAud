/**
 * Routes pour les modules
 */

const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const authController = require('../controllers/authController');
const { uploadModule, handleUploadError, convertImagesToBase64 } = require('../config/upload');

// Protection de toutes les routes des modules
router.use(authController.requireAuth);

// Liste des modules
router.get('/', moduleController.getModules);

// Formulaire d'ajout de module
router.get('/add', moduleController.getAddModuleForm);

// Traitement de l'ajout de module
router.post('/add', uploadModule, convertImagesToBase64, handleUploadError, moduleController.addModule);

// Détails d'un module
router.get('/:id', moduleController.getModuleDetails);

// Formulaire de modification d'un module
router.get('/:id/edit', moduleController.getEditModuleForm);

// Traitement de la modification d'un module
router.post('/:id/edit', uploadModule, convertImagesToBase64, handleUploadError, moduleController.updateModule);

// Suppression d'un module
router.post('/:id/delete', moduleController.deleteModule);

module.exports = router;
