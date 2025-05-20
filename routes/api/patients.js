const express = require('express');
const router = express.Router();
const PatientModel = require('../../models/patient');

// GET /api/patients - Retourne la liste des patientes
router.get('/', async (req, res) => {
  try {
    const patients = await PatientModel.findAll();
    res.json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/patients/:id - Retourne une patiente par ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patiente non trouvée' });
    }
    res.json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
