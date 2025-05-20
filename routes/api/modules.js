const express = require('express');
const router = express.Router();
const ModuleModel = require('../../models/module_mysql');

// GET /api/modules - Retourne la liste des modules
router.get('/', async (req, res) => {
  try {
    const modules = await ModuleModel.findAll();
    res.json({ success: true, data: modules });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/modules/:id - Retourne un module par ID
router.get('/:id', async (req, res) => {
  try {
    const moduleItem = await ModuleModel.findById(req.params.id);
    if (!moduleItem) {
      return res.status(404).json({ success: false, message: 'Module non trouvé' });
    }
    res.json({ success: true, data: moduleItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
