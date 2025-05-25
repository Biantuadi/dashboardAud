const express = require('express');
const router = express.Router();
const PatientModel = require('../../models/patient');
const ModuleAssignment = require('../../models/moduleAssignment');
const ModuleModel = require('../../models/module_mysql');
const bcrypt = require('bcrypt');

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
    console.log('🔍 Recherche des modules pour le patient ID:', req.params.id);
    
    const assignments = await ModuleAssignment.getAssignedModules(req.params.id);
    console.log('📦 Modules trouvés:', JSON.stringify(assignments, null, 2));
    
    const formattedModules = assignments.map(module => ({
      id: module.module_id,
      titre: module.titre,
      description: module.description,
      miniature: module.miniature,
      est_publie: module.est_publie,
      est_gratuit: module.est_gratuit,
      duree_estimee: module.duree_estimee,
      progression: module.progression,
      date_assignation: module.date_assignation,
      derniere_activite: module.derniere_activite
    }));
    
    console.log('✨ Modules formatés:', JSON.stringify(formattedModules, null, 2));
    
    res.json({ 
      success: true, 
      data: formattedModules
    });
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des modules:', err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur de récupération des modules", 
      error: err.message 
    });
  }
});

// POST /api/patients/:id/modules/:moduleId - Assigner un module à une patiente
router.post('/:id/modules/:moduleId', async (req, res) => {
  try {
    const result = await ModuleAssignment.assignModuleToPatient(req.params.moduleId, req.params.id);
    res.json({ success: result.success, message: result.message });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'assignation du module', error: err.message });
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

// POST /api/patients/login - Authentification d'une patiente
router.post('/login', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    
    if (!email || !mot_de_passe) {
      return res.status(400).json({ 
        success: false, 
        message: "Email et mot de passe requis" 
      });
    }

    const patient = await PatientModel.findByEmail(email);
    
    if (!patient) {
      return res.status(401).json({ 
        success: false, 
        message: "Email ou mot de passe incorrect" 
      });
    }

    // Vérifier si le mot de passe est crypté (commence par $2b$)
    const isPasswordHashed = patient.mot_de_passe.startsWith('$2b$');
    let isValidPassword = false;

    if (isPasswordHashed) {
      // Si le mot de passe est crypté, utiliser bcrypt.compare
      isValidPassword = await bcrypt.compare(mot_de_passe, patient.mot_de_passe);
    } else {
      // Si le mot de passe n'est pas crypté, comparer directement
      isValidPassword = mot_de_passe === patient.mot_de_passe;
      
      // Si la connexion réussit avec un mot de passe non crypté, le crypter
      if (isValidPassword) {
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        await PatientModel.update(patient.id, { ...patient, mot_de_passe: hashedPassword });
      }
    }
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: "Email ou mot de passe incorrect" 
      });
    }

    // Ne pas renvoyer le mot de passe dans la réponse
    const { mot_de_passe: _, ...patientWithoutPassword } = patient;
    
    res.json({ 
      success: true, 
      message: "Connexion réussie",
      data: patientWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'authentification", 
      error: err.message 
    });
  }
});

// GET /api/modules/:id - Retourne les détails d'un module spécifique
router.get('/module/:id', async (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    console.log('🔍 Recherche du module ID:', moduleId);
    
    if (isNaN(moduleId)) {
      console.log('❌ ID de module invalide');
      return res.status(400).json({ 
        success: false, 
        message: "ID de module invalide" 
      });
    }

    const module = await ModuleModel.findById(moduleId);
    console.log('📦 Module trouvé:', JSON.stringify(module, null, 2));
    
    if (!module) {
      console.log('❌ Module non trouvé');
      return res.status(404).json({ 
        success: false, 
        message: "Module non trouvé" 
      });
    }

    // Récupérer le contenu du module avec les types de blocs
    const moduleContent = await ModuleModel.getModuleContent(moduleId);
    console.log('📚 Contenu du module:', JSON.stringify(moduleContent, null, 2));

    // Formater le contenu du module
    const formattedContent = moduleContent.map(block => ({
      id: block.id,
      module_id: block.module_id,
      bloc_id: block.bloc_id,
      contenu: block.contenu,
      url_ressource: block.url_ressource,
      ordre: block.ordre,
      metadata: block.metadata,
      type: block.type
    }));

    const response = {
      success: true,
      data: {
        id: module.id,
        titre: module.titre,
        description: module.description,
        miniature: module.miniature,
        est_publie: module.est_publie,
        est_gratuit: module.est_gratuit,
        duree_estimee: module.duree_estimee,
        createur: {
          prenom: module.createur_prenom,
          nom: module.createur_nom
        },
        contenu: formattedContent
      }
    };

    console.log('✨ Réponse formatée:', JSON.stringify(response, null, 2));
    
    res.json(response);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération du module:', err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération du module", 
      error: err.message 
    });
  }
});

module.exports = router;
