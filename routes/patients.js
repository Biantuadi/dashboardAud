/**
 * Routes pour les patientes
 */

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authController = require('../controllers/authController');
const { uploadPatient, handleUploadError } = require('../config/upload');

// Protection de toutes les routes des patientes
router.use(authController.requireAuth);

// Liste des patientes
router.get('/', patientController.getPatients);

// Formulaire d'ajout de patiente
router.get('/add', patientController.getAddPatientForm);

// Traitement de l'ajout de patiente
router.post('/add', uploadPatient, handleUploadError, patientController.addPatient);

// Détails d'une patiente
router.get('/:id', patientController.getPatientDetails);

// Formulaire de modification d'une patiente
router.get('/:id/edit', patientController.getEditPatientForm);

// Traitement de la modification d'une patiente
router.post('/:id/edit', uploadPatient, handleUploadError, patientController.updatePatient);

// Assignation d'un module à une patiente
router.post('/:id/assign-module', patientController.assignModule);

// Suppression d'une patiente
router.post('/:id/delete', patientController.deletePatient);

module.exports = router;
