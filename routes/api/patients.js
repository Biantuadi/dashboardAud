const express = require('express');
const router = express.Router();
const PatientModel = require('../../models/patient');
const ModuleAssignment = require('../../models/moduleAssignment');

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

// GET /api/patients/:id/modules - Retourne les modules assignés à une patiente
router.get('/:id/modules', async (req, res) => {
  try {
    const assignments = await ModuleAssignment.getAssignedModules(req.params.id);
    // Extraire seulement les IDs de modules
    const moduleIds = assignments.map(item => item.module_id);
    res.json({ success: true, data: moduleIds });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur de récupération des modules', error: err.message });
  }
});

// POST /api/patients/:id/modules/:moduleId - Assigner un module à une patiente
router.post('/:id/modules/:moduleId', async (req, res) => {
  try {
    const result = await ModuleAssignment.assignModuleToPatient(req.params.moduleId, req.params.id);
    res.json({ success: result.success, message: result.message });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de l’assignation du module', error: err.message });
  }
});

// DELETE /api/patients/:id/modules/:moduleId - Désassigner un module d'une patiente
router.delete('/:id/modules/:moduleId', async (req, res) => {
  try {
    const result = await ModuleAssignment.unassignModule(req.params.moduleId, req.params.id);
    res.json({ success: result.success, message: result.message });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la désassignation du module', error: err.message });
  }
});

module.exports = router;
